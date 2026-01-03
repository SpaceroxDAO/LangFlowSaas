"""
Message and chat schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from pydantic import BaseModel, ConfigDict, Field


class MessageBase(BaseModel):
    """Base message schema."""

    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class MessageCreate(MessageBase):
    """Schema for creating a message."""

    conversation_id: uuid.UUID
    message_metadata: Optional[Dict[str, Any]] = None


class MessageResponse(BaseModel):
    """Schema for message responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    conversation_id: uuid.UUID
    role: str
    content: str
    message_metadata: Optional[Dict[str, Any]]
    created_at: datetime


class ChatRequest(BaseModel):
    """
    Schema for chat request to an agent.
    This is the main way users interact with their agents.
    """

    message: str = Field(
        ...,
        min_length=1,
        description="The user's message to send to the agent",
        examples=["What pastries do you have today?"],
    )

    # Optional: specify conversation to continue
    conversation_id: Optional[uuid.UUID] = Field(
        None,
        description="Conversation ID to continue. If not provided, creates new conversation.",
    )


class ChatResponse(BaseModel):
    """Schema for chat response from an agent."""

    message: str = Field(..., description="The agent's response")
    conversation_id: uuid.UUID = Field(..., description="The conversation ID")
    message_id: uuid.UUID = Field(..., description="The message ID")

    # Optional metadata from Langflow
    metadata: Optional[Dict[str, Any]] = None


class ConversationHistory(BaseModel):
    """Schema for conversation history."""

    conversation_id: uuid.UUID
    agent_id: uuid.UUID
    messages: List[MessageResponse]
    created_at: datetime
