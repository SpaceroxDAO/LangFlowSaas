"""
Analytics endpoints - wraps Langflow's /monitor API.

Provides agent usage analytics for the Teach Charlie dashboard.
"""
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.services.user_service import UserService
from app.services.agent_service import AgentService
from app.services.langflow_client import langflow_client, LangflowClientError

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# Response models
class MessageStats(BaseModel):
    """Aggregated message statistics for an agent."""
    total_messages: int
    total_sessions: int
    messages_today: int
    messages_this_week: int
    average_messages_per_session: float
    error: Optional[str] = None


class MessageRecord(BaseModel):
    """Individual message record."""
    id: Optional[str] = None
    session_id: Optional[str] = None
    sender: Optional[str] = None
    sender_name: Optional[str] = None
    text: Optional[str] = None
    timestamp: Optional[str] = None


class MessagesResponse(BaseModel):
    """Response containing messages list."""
    messages: List[MessageRecord]
    total: int
    limit: int
    offset: int


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.get(
    "/agents/{agent_id}/stats",
    response_model=MessageStats,
    summary="Get agent analytics",
    description="Get aggregated message statistics for an agent.",
)
async def get_agent_stats(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Get aggregated analytics for an agent.

    Returns:
    - Total messages processed
    - Total unique sessions (conversations)
    - Messages today
    - Messages this week
    - Average messages per session
    """
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    # Verify agent belongs to user
    agent = await agent_service.get_by_id(agent_id, user_id=user.id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found.",
        )

    if not agent.langflow_flow_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent does not have a Langflow flow.",
        )

    # Get stats from Langflow
    stats = await langflow_client.get_message_stats(agent.langflow_flow_id)
    return MessageStats(**stats)


@router.get(
    "/agents/{agent_id}/messages",
    response_model=MessagesResponse,
    summary="Get agent messages",
    description="Get recent messages for an agent.",
)
async def get_agent_messages(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    limit: int = 50,
    offset: int = 0,
):
    """
    Get recent messages for an agent.

    Supports pagination with limit and offset parameters.
    """
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    # Verify agent belongs to user
    agent = await agent_service.get_by_id(agent_id, user_id=user.id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found.",
        )

    if not agent.langflow_flow_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent does not have a Langflow flow.",
        )

    try:
        # Get messages from Langflow
        messages_data = await langflow_client.get_messages(
            flow_id=agent.langflow_flow_id,
            limit=limit,
            offset=offset,
        )

        # Handle different response formats
        if isinstance(messages_data, list):
            messages = messages_data
            total = len(messages)
        else:
            messages = messages_data.get("messages", [])
            total = messages_data.get("total", len(messages))

        # Convert to response format
        message_records = []
        for msg in messages:
            message_records.append(MessageRecord(
                id=msg.get("id"),
                session_id=msg.get("session_id"),
                sender=msg.get("sender"),
                sender_name=msg.get("sender_name"),
                text=msg.get("text"),
                timestamp=msg.get("timestamp") or msg.get("created_at"),
            ))

        return MessagesResponse(
            messages=message_records,
            total=total,
            limit=limit,
            offset=offset,
        )
    except LangflowClientError as e:
        raise HTTPException(
            status_code=e.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch messages: {e.message}",
        )
