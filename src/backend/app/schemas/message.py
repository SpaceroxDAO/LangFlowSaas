"""
Message and chat schemas for request/response validation.
"""
import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any, List, Literal

from pydantic import BaseModel, ConfigDict, Field


class FeedbackType(str, Enum):
    """Feedback type for assistant messages."""
    POSITIVE = "positive"
    NEGATIVE = "negative"


class MessageBase(BaseModel):
    """Base message schema."""

    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class MessageCreate(MessageBase):
    """Schema for creating a message."""

    conversation_id: uuid.UUID
    message_metadata: Optional[Dict[str, Any]] = None


class MessageUpdate(BaseModel):
    """Schema for updating a message (editing)."""

    content: str = Field(..., min_length=1, description="Updated message content")


class MessageFeedback(BaseModel):
    """Schema for submitting feedback on a message."""

    feedback: Literal["positive", "negative"] = Field(
        ..., description="Feedback type: positive (thumbs up) or negative (thumbs down)"
    )


class MessageResponse(BaseModel):
    """Schema for message responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    conversation_id: uuid.UUID
    role: str
    content: str
    message_metadata: Optional[Dict[str, Any]]
    created_at: datetime
    # Edit tracking
    is_edited: bool = False
    edited_at: Optional[datetime] = None
    original_content: Optional[str] = None
    # Feedback
    feedback: Optional[str] = None
    feedback_at: Optional[datetime] = None


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
