"""
Agent schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field


class AgentBase(BaseModel):
    """Base agent schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class AgentCreateFromQA(BaseModel):
    """
    Schema for creating an agent from 3-step Q&A.
    This is the primary way users create agents.
    """

    # Q&A answers (required)
    who: str = Field(
        ...,
        min_length=1,
        description="Who is Charlie? What kind of job does he have?",
        examples=["A friendly bakery assistant who helps customers find the perfect pastries"],
    )

    rules: str = Field(
        ...,
        min_length=1,
        description="What are the rules to his job? What does he need to know?",
        examples=["Always be polite, know the menu, suggest pairings with coffee"],
    )

    tricks: str = Field(
        ...,
        min_length=1,
        description="What tricks does Charlie know? What can he do?",
        examples=["Answer questions about ingredients, take orders, give recommendations"],
    )

    # Optional name (auto-generated if not provided)
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Agent name (auto-generated from 'who' if not provided)",
    )


class AgentCreate(AgentBase):
    """Schema for direct agent creation (advanced)."""

    qa_who: str
    qa_rules: str
    qa_tricks: str
    system_prompt: str
    langflow_flow_id: str
    template_name: str = "support_bot"


class AgentUpdate(BaseModel):
    """Schema for updating an agent."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    qa_who: Optional[str] = None
    qa_rules: Optional[str] = None
    qa_tricks: Optional[str] = None
    is_active: Optional[bool] = None


class AgentResponse(BaseModel):
    """Schema for agent responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: Optional[str]
    qa_who: str
    qa_rules: str
    qa_tricks: str
    system_prompt: str
    template_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class AgentListResponse(BaseModel):
    """Schema for paginated agent list."""

    agents: List[AgentResponse]
    total: int
    page: int
    page_size: int
