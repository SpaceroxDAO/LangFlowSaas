"""
Conversation schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class ConversationBase(BaseModel):
    """Base conversation schema."""

    title: Optional[str] = None


class ConversationCreate(ConversationBase):
    """Schema for creating a conversation."""

    agent_id: uuid.UUID


class ConversationResponse(BaseModel):
    """Schema for conversation responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    agent_id: uuid.UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime


class ConversationListResponse(BaseModel):
    """Schema for paginated conversation list."""

    conversations: List[ConversationResponse]
    total: int
