"""
Agent service for managing AI agents.
"""
import uuid
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent import Agent
from app.models.user import User
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
        stmt = select(Agent).where(Agent.id == agent_id)

        if user_id:
            stmt = stmt.where(Agent.user_id == user_id)

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
    ) -> Tuple[List[Agent], int]:
        """
        List agents for a user with pagination.

        Returns:
            Tuple of (agents list, total count)
        """
        # Base query
        stmt = select(Agent).where(Agent.user_id == user_id)

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
        template_name: str = "support_bot",
    ) -> Agent:
        """
        Create an agent from Q&A answers.

        This is the main entry point for creating agents from the
        3-step onboarding flow.
        """
        # Generate flow from Q&A
        flow_data, system_prompt, auto_name = self.mapper.create_flow_from_qa(
            who=qa_data.who,
            rules=qa_data.rules,
            tricks=qa_data.tricks,
            template_name=template_name,
        )

        # Use provided name or auto-generated
        agent_name = qa_data.name or auto_name

        # Create flow in Langflow
        flow_id = await self.langflow.create_flow(
            name=f"{agent_name} - {user.id}",
            data=flow_data.get("data", {}),
            description=f"Agent for user {user.email}",
        )

        # Create agent in our database
        agent = Agent(
            user_id=user.id,
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

        return agent

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
        except Exception:
            # Log but don't fail if Langflow deletion fails
            pass

        # Delete from our database
        await self.session.delete(agent)
        await self.session.flush()

        return True

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
            stmt = select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user.id,
                Conversation.agent_id == agent.id,
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

        # Call Langflow
        response = await self.langflow.run_flow(
            flow_id=agent.langflow_flow_id,
            message=message,
            session_id=conversation.langflow_session_id,
        )

        response_text = response.get("text", "")

        # Save assistant message
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text,
            metadata=response.get("metadata"),
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
        stmt = (
            select(Conversation)
            .where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
