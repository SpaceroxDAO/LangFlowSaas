"""
Project schemas for request/response validation.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    """Base project schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    icon: str = Field(default="folder", max_length=50)
    color: str = Field(default="#f97316", max_length=20)


class ProjectCreate(BaseModel):
    """Schema for creating a project."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Project name",
        examples=["Customer Support", "Sales Agents"],
    )
    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Project description",
    )
    icon: str = Field(
        default="folder",
        max_length=50,
        description="Emoji or icon name",
        examples=["folder", "star", "zap", "users"],
    )
    color: str = Field(
        default="#f97316",
        max_length=20,
        description="Hex color for the project",
        examples=["#f97316", "#3b82f6", "#10b981"],
    )


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    icon: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=20)
    sort_order: Optional[int] = None
    is_archived: Optional[bool] = None


class ProjectResponse(BaseModel):
    """Schema for project responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: Optional[str]
    icon: str
    color: str
    is_default: bool
    is_archived: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    # Computed fields - counts
    agent_count: int = 0
    workflow_count: int = 0
    mcp_server_count: int = 0


class ProjectWithAgentsResponse(BaseModel):
    """Schema for project with nested agents."""

    model_config = ConfigDict(from_attributes=True)

    project: ProjectResponse
    agents: List["AgentResponse"] = []
    agent_count: int = 0


class ProjectListResponse(BaseModel):
    """Schema for paginated project list."""

    projects: List[ProjectResponse]
    total: int


class MoveAgentRequest(BaseModel):
    """Schema for moving an agent to a project."""

    project_id: uuid.UUID = Field(
        ...,
        description="Target project ID",
    )


# Import AgentResponse and rebuild models to resolve forward references
from app.schemas.agent import AgentResponse  # noqa: E402

ProjectWithAgentsResponse.model_rebuild()
