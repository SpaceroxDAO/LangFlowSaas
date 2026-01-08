"""
Workflow service for managing Langflow flows.
"""
import logging
import uuid
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

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


class WorkflowServiceError(Exception):
    """Exception raised when workflow operations fail."""
    pass


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
        user_id: uuid.UUID = None,
    ) -> Optional[Workflow]:
        """Get workflow by ID, optionally filtered by user."""
        workflow_id_str = str(workflow_id)
        stmt = select(Workflow).where(Workflow.id == workflow_id_str)

        if user_id:
            user_id_str = str(user_id)
            stmt = stmt.where(Workflow.user_id == user_id_str)

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
                "Langflow isn't responding. Please try again in a moment."
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
            raise WorkflowServiceError("Langflow isn't responding.")

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

        # Generate flow from component's Q&A with user's LLM settings
        flow_data, _, _ = self.mapper.create_flow_from_qa(
            who=component.qa_who,
            rules=component.qa_rules,
            tricks=component.qa_tricks,
            template_name="agent_base",
            llm_provider=llm_provider,
            api_key=api_key,
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
            raise WorkflowServiceError("Langflow isn't responding.")

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
            raise WorkflowServiceError("Langflow isn't responding.")

        name = new_name or f"{workflow.name} (Copy)"

        flow_id = None
        try:
            flow_id = await self.langflow.create_flow(
                name=f"{name} - {workflow.user_id}",
                data=workflow.flow_data.get("data", {}) if workflow.flow_data else {},
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
                flow_data=workflow.flow_data,
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
            response = await self.langflow.run_flow(
                flow_id=workflow.langflow_flow_id,
                message=message,
                session_id=conversation.langflow_session_id,
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

        return response_text, conversation.id, assistant_message.id

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
