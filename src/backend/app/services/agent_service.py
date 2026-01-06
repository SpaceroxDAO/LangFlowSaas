"""
Agent service for managing AI agents.
"""
import logging
import uuid
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.models.agent import Agent
from app.models.user import User
from app.models.project import Project
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.agent import AgentCreateFromQA, AgentUpdate
from app.services.langflow_client import LangflowClient, langflow_client
from app.services.template_mapping import TemplateMapper, template_mapper


class AgentServiceError(Exception):
    """Exception raised when agent operations fail."""

    pass


class AgentService:
    """Service for agent CRUD and chat operations."""

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
        agent_id: uuid.UUID,
        user_id: uuid.UUID = None,
    ) -> Optional[Agent]:
        """
        Get agent by ID, optionally filtered by user.

        Args:
            agent_id: Agent UUID
            user_id: Optional user UUID to ensure ownership

        Returns:
            Agent if found, None otherwise
        """
        # Convert UUID to string for SQLite/PostgreSQL compatibility
        agent_id_str = str(agent_id)
        stmt = select(Agent).where(Agent.id == agent_id_str)

        if user_id:
            user_id_str = str(user_id)
            stmt = stmt.where(Agent.user_id == user_id_str)

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        project_id: uuid.UUID = None,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
    ) -> Tuple[List[Agent], int]:
        """
        List agents for a user with pagination.

        Args:
            user_id: User UUID
            project_id: Optional project UUID to filter by
            page: Page number (1-indexed)
            page_size: Number of agents per page
            active_only: Only return active agents

        Returns:
            Tuple of (agents list, total count)
        """
        # Convert UUID to string for SQLite/PostgreSQL compatibility
        user_id_str = str(user_id)
        # Base query
        stmt = select(Agent).where(Agent.user_id == user_id_str)

        # Filter by project if specified
        if project_id:
            project_id_str = str(project_id)
            stmt = stmt.where(Agent.project_id == project_id_str)

        if active_only:
            stmt = stmt.where(Agent.is_active == True)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(Agent.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        agents = list(result.scalars().all())

        return agents, total

    async def create_from_qa(
        self,
        user: User,
        qa_data: AgentCreateFromQA,
        template_name: str = "agent_base",
    ) -> Agent:
        """
        Create an agent from Q&A answers.

        This is the main entry point for creating agents from the
        3-step onboarding flow.

        Uses a "Langflow-first" strategy: create flow in Langflow first,
        then persist to DB. If DB fails, we clean up Langflow.
        """
        # Check Langflow health before starting
        if not await self.langflow.health_check():
            raise AgentServiceError(
                "Charlie's brain isn't responding right now. Please try again in a moment."
            )

        # Determine project_id - use provided or get/create default
        project_id = None
        if qa_data.project_id:
            # Verify project exists and belongs to user
            project_id_str = str(qa_data.project_id)
            user_id_str = str(user.id)
            stmt = select(Project).where(
                Project.id == project_id_str,
                Project.user_id == user_id_str,
            )
            result = await self.session.execute(stmt)
            project = result.scalar_one_or_none()
            if project:
                project_id = str(project.id)
            else:
                logger.warning(f"Project {qa_data.project_id} not found for user {user.id}, will use default")

        # If no valid project_id, get or create default project
        if not project_id:
            stmt = select(Project).where(
                Project.user_id == str(user.id),
                Project.is_default == True,
            )
            result = await self.session.execute(stmt)
            default_project = result.scalar_one_or_none()

            if default_project:
                project_id = str(default_project.id)
            else:
                # Create default project
                default_project = Project(
                    user_id=str(user.id),
                    name="My Projects",
                    description="Your default project for organizing agents",
                    icon="star",
                    color="#f97316",
                    is_default=True,
                    sort_order=0,
                )
                self.session.add(default_project)
                await self.session.flush()
                project_id = str(default_project.id)
                logger.info(f"Created default project for user {user.id}")

        # Generate flow from Q&A with selected tools
        flow_data, system_prompt, auto_name = self.mapper.create_flow_from_qa(
            who=qa_data.who,
            rules=qa_data.rules,
            tricks=qa_data.tricks,
            selected_tools=qa_data.selected_tools,
            template_name=template_name,
        )

        # Use provided name or auto-generated
        agent_name = qa_data.name or auto_name

        # Create flow in Langflow FIRST (easier to clean up if DB fails)
        flow_id = None
        try:
            flow_id = await self.langflow.create_flow(
                name=f"{agent_name} - {user.id}",
                data=flow_data.get("data", {}),
                description=f"Agent for user {user.email}",
            )
        except Exception as e:
            logger.error(f"Failed to create Langflow flow: {e}")
            raise AgentServiceError(
                "Charlie couldn't learn his new skills. Please try again."
            )

        # Now create agent in our database
        try:
            agent = Agent(
                user_id=user.id,
                project_id=project_id,
                name=agent_name,
                description=f"Created from 3-step Q&A",
                qa_who=qa_data.who,
                qa_rules=qa_data.rules,
                qa_tricks=qa_data.tricks,
                system_prompt=system_prompt,
                langflow_flow_id=flow_id,
                template_name=template_name,
                flow_data=flow_data,
            )

            self.session.add(agent)
            await self.session.flush()
            await self.session.refresh(agent)

            logger.info(f"Created agent {agent.id} for user {user.id} in project {project_id}")
            return agent

        except Exception as e:
            # DB creation failed - clean up the Langflow flow we created
            logger.error(f"Failed to save agent to DB, cleaning up Langflow flow: {e}")
            try:
                await self.langflow.delete_flow(flow_id)
            except Exception as cleanup_error:
                logger.error(f"Failed to clean up Langflow flow {flow_id}: {cleanup_error}")
            raise AgentServiceError(
                "Charlie was created but couldn't be saved. Please try again."
            )

    async def update(
        self,
        agent: Agent,
        update_data: AgentUpdate,
    ) -> Agent:
        """Update agent data."""
        data = update_data.model_dump(exclude_unset=True)

        # If Q&A fields changed, regenerate system prompt and update Langflow
        qa_changed = any(k in data for k in ["qa_who", "qa_rules", "qa_tricks"])

        if qa_changed:
            who = data.get("qa_who", agent.qa_who)
            rules = data.get("qa_rules", agent.qa_rules)
            tricks = data.get("qa_tricks", agent.qa_tricks)

            # Regenerate flow
            flow_data, system_prompt, _ = self.mapper.create_flow_from_qa(
                who=who,
                rules=rules,
                tricks=tricks,
                template_name=agent.template_name,
            )

            # Update Langflow
            await self.langflow.update_flow(
                flow_id=agent.langflow_flow_id,
                data=flow_data.get("data", {}),
            )

            # Update local data
            data["system_prompt"] = system_prompt
            data["flow_data"] = flow_data

        # Apply updates
        for field, value in data.items():
            setattr(agent, field, value)

        await self.session.flush()
        await self.session.refresh(agent)

        return agent

    async def delete(self, agent: Agent) -> bool:
        """
        Delete an agent and its Langflow flow.
        """
        # Delete from Langflow
        try:
            await self.langflow.delete_flow(agent.langflow_flow_id)
        except Exception as e:
            # Log but don't fail if Langflow deletion fails
            # Agent should still be deleted from our DB even if Langflow cleanup fails
            logger.warning(
                f"Failed to delete Langflow flow {agent.langflow_flow_id}: {e}"
            )

        # Delete from our database
        await self.session.delete(agent)
        await self.session.flush()

        return True

    async def duplicate(
        self,
        agent: Agent,
        new_name: str,
    ) -> Agent:
        """
        Create a duplicate of an agent with a new name.

        Args:
            agent: The agent to duplicate
            new_name: Name for the new agent

        Returns:
            The newly created agent
        """
        # Check Langflow health before starting
        if not await self.langflow.health_check():
            raise AgentServiceError(
                "Charlie's brain isn't responding right now. Please try again in a moment."
            )

        # Create a new flow in Langflow with the same data
        flow_id = None
        try:
            flow_id = await self.langflow.create_flow(
                name=f"{new_name} - {agent.user_id}",
                data=agent.flow_data.get("data", {}) if agent.flow_data else {},
                description=f"Duplicated from {agent.name}",
            )
        except Exception as e:
            logger.error(f"Failed to create Langflow flow for duplicate: {e}")
            raise AgentServiceError(
                "Charlie couldn't be duplicated. Please try again."
            )

        # Create the new agent in our database
        try:
            new_agent = Agent(
                user_id=agent.user_id,
                project_id=agent.project_id,
                name=new_name,
                description=f"Copy of {agent.name}",
                qa_who=agent.qa_who,
                qa_rules=agent.qa_rules,
                qa_tricks=agent.qa_tricks,
                system_prompt=agent.system_prompt,
                langflow_flow_id=flow_id,
                template_name=agent.template_name,
                flow_data=agent.flow_data,
            )

            self.session.add(new_agent)
            await self.session.flush()
            await self.session.refresh(new_agent)

            logger.info(f"Duplicated agent {agent.id} as {new_agent.id}")
            return new_agent

        except Exception as e:
            # DB creation failed - clean up the Langflow flow we created
            logger.error(f"Failed to save duplicated agent to DB: {e}")
            try:
                await self.langflow.delete_flow(flow_id)
            except Exception as cleanup_error:
                logger.error(f"Failed to clean up Langflow flow {flow_id}: {cleanup_error}")
            raise AgentServiceError(
                "Charlie was duplicated but couldn't be saved. Please try again."
            )

    async def chat(
        self,
        agent: Agent,
        user: User,
        message: str,
        conversation_id: uuid.UUID = None,
    ) -> Tuple[str, uuid.UUID, uuid.UUID]:
        """
        Send a message to an agent and get a response.

        Args:
            agent: The agent to chat with
            user: The user sending the message
            message: The message content
            conversation_id: Optional conversation to continue

        Returns:
            Tuple of (response_text, conversation_id, message_id)
        """
        # Get or create conversation
        if conversation_id:
            # Convert UUIDs to strings for SQLite/PostgreSQL compatibility
            conv_id_str = str(conversation_id)
            user_id_str = str(user.id)
            agent_id_str = str(agent.id)
            stmt = select(Conversation).where(
                Conversation.id == conv_id_str,
                Conversation.user_id == user_id_str,
                Conversation.agent_id == agent_id_str,
            )
            result = await self.session.execute(stmt)
            conversation = result.scalar_one_or_none()

            if not conversation:
                raise AgentServiceError("Conversation not found")
        else:
            # Create new conversation
            conversation = Conversation(
                user_id=user.id,
                agent_id=agent.id,
                langflow_session_id=str(uuid.uuid4()),
                title=message[:100] if message else "New conversation",
            )
            self.session.add(conversation)
            await self.session.flush()

        # Save user message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=message,
        )
        self.session.add(user_message)
        await self.session.flush()

        # Call Langflow with proper error handling
        response = {}
        response_metadata = None
        try:
            response = await self.langflow.run_flow(
                flow_id=agent.langflow_flow_id,
                message=message,
                session_id=conversation.langflow_session_id,
            )
            response_text = response.get("text", "")
            response_metadata = response.get("metadata")

            # Handle empty responses
            if not response_text or response_text == "{}":
                logger.warning(f"Empty response from Langflow for agent {agent.id}")
                response_text = "I'm having trouble thinking right now. Could you try asking that again?"

        except Exception as e:
            logger.error(f"Langflow chat error for agent {agent.id}: {e}")
            response_text = "Charlie ran into a problem and couldn't respond. Please try again in a moment."

        # Save assistant message
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text,
            message_metadata=response_metadata,
        )
        self.session.add(assistant_message)
        await self.session.flush()
        await self.session.refresh(assistant_message)

        return response_text, conversation.id, assistant_message.id

    async def get_conversation_history(
        self,
        conversation_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Optional[Conversation]:
        """Get conversation with messages."""
        # Convert UUIDs to strings for SQLite/PostgreSQL compatibility
        conv_id_str = str(conversation_id)
        user_id_str = str(user_id)
        stmt = (
            select(Conversation)
            .where(
                Conversation.id == conv_id_str,
                Conversation.user_id == user_id_str,
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
