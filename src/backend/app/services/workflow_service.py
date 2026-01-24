"""
Workflow service for managing Langflow flows.
"""
import logging
import uuid
from typing import AsyncGenerator, List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.streaming import (
    StreamEvent,
    StreamEventType,
    session_start_event,
    error_event,
    done_event,
)

logger = logging.getLogger(__name__)

from app.models.workflow import Workflow
from app.models.agent_component import AgentComponent
from app.models.user import User
from app.models.project import Project
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowCreateFromAgent,
    WorkflowCreateFromTemplate,
    WorkflowUpdate,
)
from app.services.langflow_client import LangflowClient, langflow_client
from app.services.template_mapping import TemplateMapper, template_mapper
from app.services.settings_service import SettingsService
from app.services.knowledge_service import KnowledgeService
from app.services.billing_service import BillingService


class WorkflowServiceError(Exception):
    """Exception raised when workflow operations fail."""
    pass


# RAG Configuration
RAG_CHUNK_SIZE = 1000
RAG_CHUNK_OVERLAP = 200
RAG_NUMBER_OF_RESULTS = 5


class WorkflowService:
    """Service for workflow CRUD and chat operations."""

    def __init__(
        self,
        session: AsyncSession,
        langflow: LangflowClient = None,
        mapper: TemplateMapper = None,
    ):
        self.session = session
        self.langflow = langflow or langflow_client
        self.mapper = mapper or template_mapper

    async def get_by_id(
        self,
        workflow_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Optional[Workflow]:
        """
        Get workflow by ID, filtered by user for security.

        Args:
            workflow_id: Workflow UUID
            user_id: User UUID to ensure ownership (REQUIRED for security)

        Returns:
            Workflow if found and owned by user, None otherwise
        """
        workflow_id_str = str(workflow_id)
        user_id_str = str(user_id)
        stmt = select(Workflow).where(
            Workflow.id == workflow_id_str,
            Workflow.user_id == user_id_str,
        )

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def _unsafe_get_by_id(
        self,
        workflow_id: uuid.UUID,
    ) -> Optional[Workflow]:
        """
        Get workflow by ID without user filtering.

        WARNING: Only use for internal admin operations.
        """
        workflow_id_str = str(workflow_id)
        stmt = select(Workflow).where(Workflow.id == workflow_id_str)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        project_id: uuid.UUID = None,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
    ) -> Tuple[List[Workflow], int]:
        """List workflows for a user with pagination."""
        user_id_str = str(user_id)
        stmt = select(Workflow).where(Workflow.user_id == user_id_str)

        if project_id:
            project_id_str = str(project_id)
            stmt = stmt.where(Workflow.project_id == project_id_str)

        if active_only:
            stmt = stmt.where(Workflow.is_active == True)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(Workflow.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        workflows = list(result.scalars().all())

        return workflows, total

    async def _ingest_knowledge_sources(
        self,
        user: User,
        source_ids: List[str],
        collection_name: str,
        openai_api_key: str,
    ) -> bool:
        """
        Run ingestion flow to populate Chroma vector store with documents.

        This creates a temporary flow in Langflow, runs it to ingest the documents,
        then deletes the flow. The Chroma data persists in the mounted volume.

        Args:
            user: The user whose documents to ingest
            source_ids: List of knowledge source IDs
            collection_name: Chroma collection name
            openai_api_key: OpenAI API key for embeddings

        Returns:
            True if ingestion succeeded
        """
        if not source_ids:
            return True

        knowledge_service = KnowledgeService(self.session)
        sources = await knowledge_service.get_sources_by_ids(source_ids, user.id)

        if not sources:
            logger.warning(f"No valid knowledge sources found for ingestion")
            return False

        # Get file paths
        file_paths = []
        for source in sources:
            path = knowledge_service.get_file_absolute_path(source)
            if path and path.exists():
                file_paths.append(str(path))
            else:
                logger.warning(f"Knowledge source {source.id} has no valid file path")

        if not file_paths:
            logger.warning(f"No valid file paths for ingestion")
            return False

        logger.info(f"Ingesting {len(file_paths)} files into collection '{collection_name}'")

        # Load and configure ingestion flow
        try:
            ingest_template = self.mapper.load_rag_template("ingest")
            ingest_flow = self.mapper.configure_ingestion_flow(
                flow_data=ingest_template,
                file_paths=file_paths,
                collection_name=collection_name,
                openai_api_key=openai_api_key,
                chunk_size=RAG_CHUNK_SIZE,
                chunk_overlap=RAG_CHUNK_OVERLAP,
            )
        except Exception as e:
            logger.error(f"Failed to configure ingestion flow: {e}")
            raise WorkflowServiceError(f"Failed to prepare document ingestion: {e}")

        # Create temporary flow in Langflow
        temp_flow_id = None
        try:
            temp_flow_id = await self.langflow.create_flow(
                name=f"Ingest-{collection_name}",
                data=ingest_flow.get("data", {}),
                description="Temporary ingestion flow",
            )
            logger.info(f"Created temporary ingestion flow: {temp_flow_id}")

            # Run the ingestion flow
            # Note: Ingestion flows don't need user input, but Langflow requires a message
            await self.langflow.run_flow(
                flow_id=temp_flow_id,
                message="ingest",
                session_id=f"ingest-{collection_name}",
            )
            logger.info(f"Completed ingestion for collection '{collection_name}'")
            return True

        except Exception as e:
            logger.error(f"Ingestion failed: {e}")
            raise WorkflowServiceError(f"Document ingestion failed: {e}")

        finally:
            # Always cleanup the temporary flow
            if temp_flow_id:
                try:
                    await self.langflow.delete_flow(temp_flow_id)
                    logger.info(f"Cleaned up temporary ingestion flow")
                except Exception as e:
                    logger.warning(f"Failed to cleanup ingestion flow: {e}")

    async def _get_or_create_default_project(self, user: User) -> str:
        """Get or create the user's default project."""
        stmt = select(Project).where(
            Project.user_id == str(user.id),
            Project.is_default == True,
        )
        result = await self.session.execute(stmt)
        default_project = result.scalar_one_or_none()

        if default_project:
            return str(default_project.id)

        default_project = Project(
            user_id=str(user.id),
            name="My Projects",
            description="Your default project",
            icon="star",
            color="#7C3AED",
            is_default=True,
            sort_order=0,
        )
        self.session.add(default_project)
        await self.session.flush()
        return str(default_project.id)

    async def create(
        self,
        user: User,
        data: WorkflowCreate,
    ) -> Workflow:
        """Create a new workflow."""
        if not await self.langflow.health_check():
            raise WorkflowServiceError(
                "AI Canvas isn't responding. Please try again in a moment."
            )

        # Determine project
        project_id = None
        if data.project_id:
            project_id_str = str(data.project_id)
            stmt = select(Project).where(
                Project.id == project_id_str,
                Project.user_id == str(user.id),
            )
            result = await self.session.execute(stmt)
            project = result.scalar_one_or_none()
            if project:
                project_id = str(project.id)

        if not project_id:
            project_id = await self._get_or_create_default_project(user)

        # Create flow in Langflow
        flow_id = None
        flow_data = data.flow_data or {"data": {"nodes": [], "edges": []}}

        # Note: Composio components use entity_id="default" by default.
        # Our Connections page also uses "default" to match. See composio_connection_service.py

        try:
            flow_id = await self.langflow.create_flow(
                name=f"{data.name} - {user.id}",
                data=flow_data.get("data", {}),
                description=data.description or f"Workflow for user {user.email}",
            )
        except Exception as e:
            logger.error(f"Failed to create Langflow flow: {e}")
            raise WorkflowServiceError("Failed to create workflow. Please try again.")

        # Create workflow in database
        try:
            workflow = Workflow(
                user_id=str(user.id),
                project_id=project_id,
                name=data.name,
                description=data.description,
                langflow_flow_id=flow_id,
                flow_data=flow_data,
                is_active=True,
                is_public=False,
            )

            self.session.add(workflow)
            await self.session.flush()
            await self.session.refresh(workflow)

            logger.info(f"Created workflow {workflow.id} for user {user.id}")
            return workflow

        except Exception as e:
            logger.error(f"Failed to save workflow to DB: {e}")
            try:
                await self.langflow.delete_flow(flow_id)
            except Exception:
                pass
            raise WorkflowServiceError("Workflow created but couldn't be saved.")

    async def create_from_agent(
        self,
        user: User,
        data: WorkflowCreateFromAgent,
    ) -> Workflow:
        """
        Create a quick workflow from an agent component.
        Creates: ChatInput -> Agent -> ChatOutput
        """
        if not await self.langflow.health_check():
            raise WorkflowServiceError("AI Canvas isn't responding.")

        # Get user's LLM settings
        settings_service = SettingsService(self.session)
        user_settings = await settings_service.get_or_create(user)
        llm_provider = user_settings.default_llm_provider or "openai"
        api_key = settings_service.get_api_key(user_settings, llm_provider)

        if not api_key:
            raise WorkflowServiceError(
                f"No API key configured for {llm_provider}. "
                "Please add your API key in Settings."
            )

        logger.info(f"Creating workflow with LLM provider: {llm_provider}")

        # Get the agent component
        component_id_str = str(data.agent_component_id)
        stmt = select(AgentComponent).where(
            AgentComponent.id == component_id_str,
            AgentComponent.user_id == str(user.id),
        )
        result = await self.session.execute(stmt)
        component = result.scalar_one_or_none()

        if not component:
            raise WorkflowServiceError("Agent component not found.")

        # Determine if RAG should be used (based on knowledge sources)
        use_rag = self.mapper.should_use_rag_template(component.knowledge_source_ids)
        rag_failed = False

        if use_rag:
            # Use RAG template with Chroma vector search
            logger.info(f"Using RAG template for workflow with {len(component.knowledge_source_ids)} knowledge sources")

            # Generate unique collection name for this workflow
            # We use a temporary workflow ID since we don't have the real one yet
            temp_workflow_id = str(uuid.uuid4())
            collection_name = self.mapper.generate_collection_name(str(user.id), temp_workflow_id)

            # Get OpenAI API key for embeddings (required for RAG)
            openai_key = settings_service.get_api_key(user_settings, "openai")
            if not openai_key:
                # Fall back to keyword search if no OpenAI key
                logger.warning("No OpenAI API key for RAG embeddings, falling back to keyword search")
                use_rag = False
                rag_failed = True
            else:
                try:
                    # Run document ingestion
                    await self._ingest_knowledge_sources(
                        user=user,
                        source_ids=component.knowledge_source_ids,
                        collection_name=collection_name,
                        openai_api_key=openai_key,
                    )

                    # Generate RAG flow
                    flow_data, _, _ = self.mapper.create_rag_flow_from_qa(
                        who=component.qa_who,
                        rules=component.qa_rules,
                        collection_name=collection_name,
                        openai_api_key=openai_key,
                        llm_provider=llm_provider,
                        llm_api_key=api_key,
                        agent_display_name=component.name,
                        selected_tools=component.selected_tools or [],
                        number_of_results=RAG_NUMBER_OF_RESULTS,
                    )
                except Exception as e:
                    # RAG ingestion failed, fall back to keyword search
                    logger.warning(f"RAG ingestion failed, falling back to keyword search: {e}")
                    use_rag = False
                    rag_failed = True

        if not use_rag:
            # Use standard agent_base template with keyword-based knowledge search
            if rag_failed:
                logger.info("Using keyword-based knowledge search (RAG fallback)")
            else:
                logger.info("Using standard agent template without RAG")

            knowledge_content = None
            if component.knowledge_source_ids:
                knowledge_service = KnowledgeService(self.session)
                knowledge_content = await knowledge_service.load_combined_content(
                    source_ids=component.knowledge_source_ids,
                    user_id=user.id,
                )
                if knowledge_content:
                    logger.info(f"Loaded {len(knowledge_content)} chars of knowledge content for workflow")

            # Generate flow from component's Q&A with user's LLM settings
            # Pass the agent's name to display in the canvas instead of generic "Agent"
            # Include selected_tools to inject tool nodes into the flow
            flow_data, _, _ = self.mapper.create_flow_from_qa(
                who=component.qa_who,
                rules=component.qa_rules,
                tricks=component.qa_tricks,
                selected_tools=component.selected_tools or [],  # Pass stored tool IDs
                template_name="agent_base",
                llm_provider=llm_provider,
                api_key=api_key,
                agent_display_name=component.name,
                knowledge_content=knowledge_content,  # Pass knowledge content for keyword search
            )

        workflow_name = data.name or f"{component.name} Workflow"
        project_id = str(data.project_id) if data.project_id else component.project_id

        if not project_id:
            project_id = await self._get_or_create_default_project(user)

        # Create flow in Langflow
        flow_id = None
        try:
            flow_id = await self.langflow.create_flow(
                name=f"{workflow_name} - {user.id}",
                data=flow_data.get("data", {}),
                description=f"Quick workflow from {component.name}",
            )
        except Exception as e:
            logger.error(f"Failed to create Langflow flow: {e}")
            raise WorkflowServiceError("Failed to create workflow.")

        # Create workflow in database
        try:
            workflow = Workflow(
                user_id=str(user.id),
                project_id=project_id,
                name=workflow_name,
                description=data.description or f"Workflow using {component.name}",
                langflow_flow_id=flow_id,
                flow_data=flow_data,
                agent_component_ids=[str(component.id)],
                is_active=True,
                is_public=False,
            )

            self.session.add(workflow)
            await self.session.flush()
            await self.session.refresh(workflow)

            logger.info(f"Created workflow {workflow.id} from agent {component.id}")
            return workflow

        except Exception as e:
            logger.error(f"Failed to save workflow: {e}")
            try:
                await self.langflow.delete_flow(flow_id)
            except Exception:
                pass
            raise WorkflowServiceError("Workflow couldn't be saved.")

    async def create_from_template(
        self,
        user: User,
        data: WorkflowCreateFromTemplate,
    ) -> Workflow:
        """Create a workflow from a predefined template."""
        if not await self.langflow.health_check():
            raise WorkflowServiceError("AI Canvas isn't responding.")

        # Get user's LLM settings
        settings_service = SettingsService(self.session)
        user_settings = await settings_service.get_or_create(user)
        llm_provider = user_settings.default_llm_provider or "openai"
        api_key = settings_service.get_api_key(user_settings, llm_provider)

        if not api_key:
            raise WorkflowServiceError(
                f"No API key configured for {llm_provider}. "
                "Please add your API key in Settings."
            )

        # Load template
        try:
            flow_data = self.mapper.load_template(data.template_name)
        except Exception as e:
            logger.error(f"Template not found: {data.template_name}")
            raise WorkflowServiceError(f"Template '{data.template_name}' not found.")

        # Inject user's LLM configuration into the template
        flow_data = self.mapper.inject_llm_config(flow_data, llm_provider, api_key)

        workflow_name = data.name or f"{data.template_name.replace('_', ' ').title()} Workflow"

        project_id = None
        if data.project_id:
            project_id = str(data.project_id)
        else:
            project_id = await self._get_or_create_default_project(user)

        # Create flow in Langflow
        flow_id = None
        try:
            flow_id = await self.langflow.create_flow(
                name=f"{workflow_name} - {user.id}",
                data=flow_data.get("data", {}),
                description=f"From template: {data.template_name}",
            )
        except Exception as e:
            logger.error(f"Failed to create Langflow flow: {e}")
            raise WorkflowServiceError("Failed to create workflow.")

        # Create workflow
        try:
            workflow = Workflow(
                user_id=str(user.id),
                project_id=project_id,
                name=workflow_name,
                description=data.description,
                langflow_flow_id=flow_id,
                flow_data=flow_data,
                is_active=True,
                is_public=False,
            )

            self.session.add(workflow)
            await self.session.flush()
            await self.session.refresh(workflow)

            return workflow

        except Exception as e:
            try:
                await self.langflow.delete_flow(flow_id)
            except Exception:
                pass
            raise WorkflowServiceError("Workflow couldn't be saved.")

    async def update(
        self,
        workflow: Workflow,
        update_data: WorkflowUpdate,
    ) -> Workflow:
        """Update workflow data."""
        data = update_data.model_dump(exclude_unset=True)

        # If flow_data changed, update Langflow
        if "flow_data" in data and data["flow_data"]:
            try:
                await self.langflow.update_flow(
                    flow_id=workflow.langflow_flow_id,
                    data=data["flow_data"].get("data", {}),
                )
            except Exception as e:
                logger.error(f"Failed to update Langflow flow: {e}")
                raise WorkflowServiceError("Failed to update workflow.")

        for field, value in data.items():
            setattr(workflow, field, value)

        await self.session.flush()
        await self.session.refresh(workflow)

        return workflow

    async def delete(self, workflow: Workflow) -> bool:
        """Delete a workflow and its Langflow flow."""
        try:
            await self.langflow.delete_flow(workflow.langflow_flow_id)
        except Exception as e:
            logger.warning(f"Failed to delete Langflow flow: {e}")

        await self.session.delete(workflow)
        await self.session.flush()
        return True

    async def duplicate(
        self,
        workflow: Workflow,
        new_name: str = None,
    ) -> Workflow:
        """Create a duplicate of a workflow."""
        if not await self.langflow.health_check():
            raise WorkflowServiceError("AI Canvas isn't responding.")

        name = new_name or f"{workflow.name} (Copy)"
        flow_data = workflow.flow_data or {"data": {"nodes": [], "edges": []}}

        flow_id = None
        try:
            flow_id = await self.langflow.create_flow(
                name=f"{name} - {workflow.user_id}",
                data=flow_data.get("data", {}),
                description=f"Copy of {workflow.name}",
            )
        except Exception as e:
            logger.error(f"Failed to duplicate Langflow flow: {e}")
            raise WorkflowServiceError("Failed to duplicate workflow.")

        try:
            new_workflow = Workflow(
                user_id=workflow.user_id,
                project_id=workflow.project_id,
                name=name,
                description=f"Copy of {workflow.name}",
                langflow_flow_id=flow_id,
                flow_data=flow_data,  # Use the injected flow_data
                agent_component_ids=workflow.agent_component_ids,
                is_active=True,
                is_public=False,
            )

            self.session.add(new_workflow)
            await self.session.flush()
            await self.session.refresh(new_workflow)

            return new_workflow

        except Exception as e:
            try:
                await self.langflow.delete_flow(flow_id)
            except Exception:
                pass
            raise WorkflowServiceError("Failed to save duplicate.")

    async def chat(
        self,
        workflow: Workflow,
        user: User,
        message: str,
        conversation_id: uuid.UUID = None,
    ) -> Tuple[str, uuid.UUID, uuid.UUID]:
        """Send a message to a workflow and get a response."""
        # Get or create conversation
        if conversation_id:
            conv_id_str = str(conversation_id)
            user_id_str = str(user.id)
            workflow_id_str = str(workflow.id)
            stmt = select(Conversation).where(
                Conversation.id == conv_id_str,
                Conversation.user_id == user_id_str,
                Conversation.workflow_id == workflow_id_str,
            )
            result = await self.session.execute(stmt)
            conversation = result.scalar_one_or_none()

            if not conversation:
                raise WorkflowServiceError("Conversation not found")
        else:
            conversation = Conversation(
                user_id=str(user.id),
                workflow_id=str(workflow.id),
                langflow_session_id=str(uuid.uuid4()),
                title=message[:100] if message else "New conversation",
            )
            self.session.add(conversation)
            await self.session.flush()

        # Save user message
        user_message = Message(
            conversation_id=str(conversation.id),
            role="user",
            content=message,
        )
        self.session.add(user_message)
        await self.session.flush()

        # Call Langflow
        response_text = ""
        response_metadata = None
        try:
            # Build tweaks to inject user's entity_id into Composio components
            # This enables multi-user isolation for OAuth connections
            tweaks = {}
            if workflow.flow_data:
                tweaks = self.mapper.build_composio_tweaks(
                    workflow.flow_data, str(user.id)
                )

            response = await self.langflow.run_flow(
                flow_id=workflow.langflow_flow_id,
                message=message,
                session_id=conversation.langflow_session_id,
                tweaks=tweaks if tweaks else None,
            )
            response_text = response.get("text", "")
            response_metadata = response.get("metadata")

            if not response_text or response_text == "{}":
                response_text = "I'm having trouble responding. Please try again."

        except Exception as e:
            logger.error(f"Langflow chat error: {e}")
            response_text = "Something went wrong. Please try again."

        # Save assistant message
        assistant_message = Message(
            conversation_id=str(conversation.id),
            role="assistant",
            content=response_text,
            message_metadata=response_metadata,
        )
        self.session.add(assistant_message)
        await self.session.flush()
        await self.session.refresh(assistant_message)

        # Track usage for billing
        try:
            billing = BillingService(self.session)
            # Track message count
            await billing.track_usage(
                user_id=str(user.id),
                metric_type="messages_sent",
                value=1,
                extra_data={"workflow_id": str(workflow.id)},
            )
            # Estimate tokens (~4 chars per token for English)
            estimated_tokens = (len(message) + len(response_text)) // 4
            if estimated_tokens > 0:
                await billing.track_usage(
                    user_id=str(user.id),
                    metric_type="llm_tokens",
                    value=estimated_tokens,
                    extra_data={"workflow_id": str(workflow.id)},
                )
        except Exception as e:
            # Don't fail the chat if billing tracking fails
            logger.warning(f"Failed to track usage for user {user.id}: {e}")

        return response_text, conversation.id, assistant_message.id

    async def chat_stream(
        self,
        workflow: Workflow,
        user: User,
        message: str,
        conversation_id: uuid.UUID = None,
    ) -> AsyncGenerator[StreamEvent, None]:
        """
        Send a message to a workflow and stream the response.

        Yields StreamEvent objects for real-time response with agent visibility.

        Args:
            workflow: The workflow to chat with
            user: The authenticated user
            message: User's message
            conversation_id: Optional existing conversation ID

        Yields:
            StreamEvent objects (text chunks, tool calls, thinking, etc.)
        """
        # Get or create conversation
        if conversation_id:
            conv_id_str = str(conversation_id)
            user_id_str = str(user.id)
            workflow_id_str = str(workflow.id)
            stmt = select(Conversation).where(
                Conversation.id == conv_id_str,
                Conversation.user_id == user_id_str,
                Conversation.workflow_id == workflow_id_str,
            )
            result = await self.session.execute(stmt)
            conversation = result.scalar_one_or_none()

            if not conversation:
                yield error_event(
                    code="NOT_FOUND",
                    message="Conversation not found",
                )
                return
        else:
            conversation = Conversation(
                user_id=str(user.id),
                workflow_id=str(workflow.id),
                langflow_session_id=str(uuid.uuid4()),
                title=message[:100] if message else "New conversation",
            )
            self.session.add(conversation)
            await self.session.flush()

        # Save user message
        user_message = Message(
            conversation_id=str(conversation.id),
            role="user",
            content=message,
        )
        self.session.add(user_message)
        await self.session.flush()

        # CRITICAL: Commit before streaming so conversation exists for follow-up messages
        await self.session.commit()

        # Generate a message ID for the assistant response
        assistant_message_id = str(uuid.uuid4())

        # Yield session start with conversation/message IDs
        yield session_start_event(
            session_id=conversation.langflow_session_id,
            conversation_id=str(conversation.id),
            message_id=assistant_message_id,
        )

        # Stream response from Langflow
        accumulated_text = ""
        response_metadata = {}

        # Build tweaks to inject user's entity_id into Composio components
        # This enables multi-user isolation for OAuth connections
        tweaks = {}
        if workflow.flow_data:
            tweaks = self.mapper.build_composio_tweaks(
                workflow.flow_data, str(user.id)
            )

        try:
            async for event in self.langflow.run_flow_stream_enhanced(
                flow_id=workflow.langflow_flow_id,
                message=message,
                session_id=conversation.langflow_session_id,
                tweaks=tweaks if tweaks else None,
            ):
                # Skip the session_start from langflow client (we sent our own)
                if event.event == StreamEventType.SESSION_START:
                    continue

                # Accumulate text for saving
                if event.event == StreamEventType.TEXT_DELTA:
                    accumulated_text += event.data.get("text", "")
                elif event.event == StreamEventType.TEXT_COMPLETE:
                    accumulated_text = event.data.get("text", accumulated_text)

                # Track tool calls and thinking for metadata
                if event.event in (
                    StreamEventType.TOOL_CALL_START,
                    StreamEventType.TOOL_CALL_END,
                    StreamEventType.THINKING_START,
                    StreamEventType.THINKING_END,
                ):
                    if "events" not in response_metadata:
                        response_metadata["events"] = []
                    response_metadata["events"].append({
                        "type": event.event.value,
                        "data": event.data,
                        "timestamp": event.timestamp.isoformat() if event.timestamp else None,
                    })

                # Yield the event to the client
                yield event

                # Check for done event
                if event.event == StreamEventType.DONE:
                    break

        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield error_event(
                code="STREAM_ERROR",
                message="An error occurred during streaming",
                details={"error": str(e)},
            )
            accumulated_text = "Something went wrong. Please try again."

        # Save assistant message with accumulated text
        if accumulated_text:
            assistant_message = Message(
                id=assistant_message_id,
                conversation_id=str(conversation.id),
                role="assistant",
                content=accumulated_text,
                message_metadata=response_metadata if response_metadata else None,
            )
            self.session.add(assistant_message)
            await self.session.flush()

            # Track usage for billing
            try:
                billing = BillingService(self.session)
                # Track message count
                await billing.track_usage(
                    user_id=str(user.id),
                    metric_type="messages_sent",
                    value=1,
                    extra_data={"workflow_id": str(workflow.id)},
                )
                # Estimate tokens (~4 chars per token for English)
                estimated_tokens = (len(message) + len(accumulated_text)) // 4
                if estimated_tokens > 0:
                    await billing.track_usage(
                        user_id=str(user.id),
                        metric_type="llm_tokens",
                        value=estimated_tokens,
                        extra_data={"workflow_id": str(workflow.id)},
                    )
            except Exception as e:
                # Don't fail the stream if billing tracking fails
                logger.warning(f"Failed to track usage for user {user.id}: {e}")

        # Final done event with IDs
        yield done_event(
            conversation_id=str(conversation.id),
            message_id=assistant_message_id,
        )

    async def export(self, workflow: Workflow) -> dict:
        """Export workflow as JSON."""
        return {
            "name": workflow.name,
            "description": workflow.description,
            "flow_data": workflow.flow_data,
            "agent_component_ids": workflow.agent_component_ids,
            "version": "1.0",
            "type": "workflow",
        }

    async def get_conversations(
        self,
        workflow_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> List[Conversation]:
        """Get all conversations for a workflow."""
        stmt = select(Conversation).where(
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user_id),
        ).order_by(Conversation.created_at.desc())

        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def sync_from_langflow(self, workflow: Workflow) -> Workflow:
        """
        Sync workflow's flow_data from Langflow.

        Use this when the user may have edited the flow in the Langflow canvas
        and you want to ensure our DB has the latest version.
        """
        try:
            langflow_flow = await self.langflow.get_flow(workflow.langflow_flow_id)
            flow_data = langflow_flow.get("data", {})

            # Update our cached flow_data
            workflow.flow_data = {"data": flow_data}
            await self.session.flush()
            await self.session.refresh(workflow)

            logger.info(f"Synced flow_data from Langflow for workflow {workflow.id}")
            return workflow

        except Exception as e:
            logger.error(f"Failed to sync from Langflow: {e}")
            raise WorkflowServiceError(f"Failed to sync from Langflow: {e}")

    async def check_langflow_sync(self, workflow: Workflow) -> dict:
        """
        Check if workflow is in sync with Langflow.

        Returns:
            dict with sync status and details
        """
        try:
            langflow_flow = await self.langflow.get_flow(workflow.langflow_flow_id)
            exists_in_langflow = True
            langflow_name = langflow_flow.get("name", "")
        except Exception:
            exists_in_langflow = False
            langflow_name = None

        return {
            "workflow_id": str(workflow.id),
            "langflow_flow_id": workflow.langflow_flow_id,
            "exists_in_langflow": exists_in_langflow,
            "langflow_name": langflow_name,
            "our_name": workflow.name,
            "has_flow_data": workflow.flow_data is not None,
        }

    async def get_sync_status(self, user_id: uuid.UUID = None) -> dict:
        """
        Get sync status between our DB and Langflow.

        Returns counts of workflows, orphaned flows, and missing flows.
        """
        # Get all workflows (optionally filtered by user)
        stmt = select(Workflow).where(Workflow.is_active == True)
        if user_id:
            stmt = stmt.where(Workflow.user_id == str(user_id))

        result = await self.session.execute(stmt)
        workflows = list(result.scalars().all())

        our_flow_ids = {w.langflow_flow_id for w in workflows if w.langflow_flow_id}

        # Get all flows from Langflow
        langflow_flow_ids = set()
        try:
            # Note: This requires listing all flows - we'll check individual ones
            for workflow in workflows:
                try:
                    await self.langflow.get_flow(workflow.langflow_flow_id)
                    langflow_flow_ids.add(workflow.langflow_flow_id)
                except Exception:
                    pass
        except Exception as e:
            logger.error(f"Failed to check Langflow flows: {e}")

        missing_in_langflow = our_flow_ids - langflow_flow_ids

        return {
            "total_workflows": len(workflows),
            "synced_with_langflow": len(langflow_flow_ids),
            "missing_in_langflow": list(missing_in_langflow),
            "missing_count": len(missing_in_langflow),
        }

    async def repair_missing_flow(self, workflow: Workflow, user: User) -> Workflow:
        """
        Repair a workflow that's missing its Langflow flow.

        Creates a new flow in Langflow and updates the workflow's langflow_flow_id.
        """
        # Get user's LLM settings
        settings_service = SettingsService(self.session)
        user_settings = await settings_service.get_or_create(user)
        llm_provider = user_settings.default_llm_provider or "openai"
        api_key = settings_service.get_api_key(user_settings, llm_provider)

        if not api_key:
            raise WorkflowServiceError(f"No API key configured for {llm_provider}")

        # Use existing flow_data or create minimal flow
        flow_data = workflow.flow_data or {"data": {"nodes": [], "edges": []}}

        # Inject current LLM settings
        flow_data = self.mapper.inject_llm_config(flow_data, llm_provider, api_key)

        try:
            new_flow_id = await self.langflow.create_flow(
                name=f"{workflow.name} - {user.id}",
                data=flow_data.get("data", {}),
                description=f"Repaired workflow: {workflow.description or workflow.name}",
            )

            workflow.langflow_flow_id = new_flow_id
            workflow.flow_data = flow_data
            await self.session.flush()
            await self.session.refresh(workflow)

            logger.info(f"Repaired workflow {workflow.id} with new flow {new_flow_id}")
            return workflow

        except Exception as e:
            logger.error(f"Failed to repair workflow: {e}")
            raise WorkflowServiceError(f"Failed to repair workflow: {e}")
