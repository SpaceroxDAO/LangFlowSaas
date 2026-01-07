"""
AgentComponent schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field


class AgentComponentBase(BaseModel):
    """Base agent component schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class AgentComponentCreateFromQA(BaseModel):
    """
    Schema for creating an agent component from 3-step Q&A.
    This is the primary way users create agent components.
    """

    # Q&A answers (required)
    who: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Who is Charlie? What kind of job does he have?",
        examples=["A friendly bakery assistant who helps customers find the perfect pastries"],
    )

    rules: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="What are the rules to his job? What does he need to know?",
        examples=["Always be polite, know the menu, suggest pairings with coffee"],
    )

    tricks: str = Field(
        default="",
        max_length=5000,
        description="What tricks does Charlie know? (Legacy field, use selected_tools instead)",
        examples=["Answer questions about ingredients, take orders, give recommendations"],
    )

    # Tool selection
    selected_tools: List[str] = Field(
        default=[],
        description="List of tool IDs to enable (e.g., ['web_search', 'calculator'])",
        examples=[["web_search", "calculator"]],
    )

    # Optional name (auto-generated if not provided)
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Agent name (auto-generated from 'who' if not provided)",
    )

    # Project to assign to (optional - uses default project if not provided)
    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project ID to assign agent component to (uses default project if not provided)",
    )

    # Visual customization
    icon: Optional[str] = Field(
        default="bot",
        max_length=50,
        description="Icon name for the agent component",
    )

    color: Optional[str] = Field(
        default="#7C3AED",
        max_length=20,
        description="Hex color for the agent component",
    )

    avatar_url: Optional[str] = Field(
        default=None,
        max_length=500,
        description="URL to AI-generated avatar image",
    )


class AgentComponentCreate(AgentComponentBase):
    """Schema for direct agent component creation (advanced)."""

    qa_who: str
    qa_rules: str
    qa_tricks: str = ""
    system_prompt: str
    icon: str = "bot"
    color: str = "#7C3AED"


class AgentComponentUpdate(BaseModel):
    """Schema for updating an agent component."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    qa_who: Optional[str] = None
    qa_rules: Optional[str] = None
    qa_tricks: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None


class GenerateAvatarRequest(BaseModel):
    """Schema for generating an avatar image."""

    description: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Agent description to generate avatar from",
    )


class GenerateAvatarResponse(BaseModel):
    """Schema for avatar generation response."""

    avatar_url: str
    message: str = "Avatar generated successfully"


class AgentComponentResponse(BaseModel):
    """Schema for agent component responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: Optional[uuid.UUID]
    name: str
    description: Optional[str]
    icon: str
    color: str
    avatar_url: Optional[str] = None
    qa_who: str
    qa_rules: str
    qa_tricks: str
    system_prompt: str
    component_file_path: Optional[str]
    component_class_name: Optional[str]
    is_published: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class AgentComponentListResponse(BaseModel):
    """Schema for paginated agent component list."""

    agent_components: List[AgentComponentResponse]
    total: int
    page: int
    page_size: int


class AgentComponentPublishResponse(BaseModel):
    """Schema for publish operation response."""

    id: uuid.UUID
    name: str
    is_published: bool
    component_file_path: Optional[str]
    needs_restart: bool = True
    message: str
