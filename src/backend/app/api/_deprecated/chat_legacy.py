"""
Chat endpoints for interacting with agents.
"""
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.middleware.redis_rate_limit import check_rate_limit_with_user
from app.models.user import User
from app.models.conversation import Conversation
from app.schemas.message import (
    ChatRequest,
    ChatResponse,
    MessageResponse,
    ConversationHistory,
)
from app.schemas.conversation import ConversationResponse, ConversationListResponse
from app.services.user_service import UserService
from app.services.agent_service import AgentService, AgentServiceError

router = APIRouter(tags=["Chat"])


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.post(
    "/agents/{agent_id}/chat",
    response_model=ChatResponse,
    summary="Chat with agent",
    description="Send a message to an agent and get a response.",
)
async def chat_with_agent(
    agent_id: uuid.UUID,
    chat_request: ChatRequest,
    request: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Send a message to a Charlie agent and get a response.

    This is the main interaction point for users chatting with their agents.
    """
    # Rate limit with user context for accurate per-user limiting
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    # Verify agent exists and belongs to user
    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found. Make sure you're talking to your own Charlie!",
        )

    if not agent.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This Charlie is currently taking a nap. Please activate it first.",
        )

    try:
        response_text, conversation_id, message_id = await agent_service.chat(
            agent=agent,
            user=user,
            message=chat_request.message,
            conversation_id=chat_request.conversation_id,
        )

        return ChatResponse(
            message=response_text,
            conversation_id=conversation_id,
            message_id=message_id,
        )

    except AgentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Charlie had trouble understanding that. Error: {str(e)}",
        )


@router.get(
    "/agents/{agent_id}/conversations",
    response_model=ConversationListResponse,
    summary="List conversations",
    description="List all conversations with an agent.",
)
async def list_conversations(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """List all conversations with a specific agent."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    # Verify agent exists and belongs to user
    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found.",
        )

    # Get conversations
    stmt = (
        select(Conversation)
        .where(
            Conversation.agent_id == agent_id,
            Conversation.user_id == user.id,
        )
        .order_by(Conversation.updated_at.desc())
    )
    result = await session.execute(stmt)
    conversations = list(result.scalars().all())

    return ConversationListResponse(
        conversations=[ConversationResponse.model_validate(c) for c in conversations],
        total=len(conversations),
    )


@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationHistory,
    summary="Get conversation history",
    description="Get all messages in a conversation.",
)
async def get_conversation_history(
    conversation_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get the full message history for a conversation."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    conversation = await agent_service.get_conversation_history(
        conversation_id=conversation_id,
        user_id=user.id,
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    return ConversationHistory(
        conversation_id=conversation.id,
        agent_id=conversation.agent_id,
        messages=[MessageResponse.model_validate(m) for m in conversation.messages],
        created_at=conversation.created_at,
    )


@router.delete(
    "/conversations/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete conversation",
    description="Delete a conversation and all its messages.",
)
async def delete_conversation(
    conversation_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete a conversation."""
    user = await get_user_from_clerk(clerk_user, session)

    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.user_id == user.id,
    )
    result = await session.execute(stmt)
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    await session.delete(conversation)
    await session.flush()

    return None
