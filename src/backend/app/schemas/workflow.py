"""
Workflow schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List, Any

from pydantic import BaseModel, ConfigDict, Field


class WorkflowBase(BaseModel):
    """Base workflow schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class WorkflowCreate(WorkflowBase):
    """Schema for creating a workflow."""

    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project ID to assign workflow to (uses default project if not provided)",
    )

    # Optional: pre-created Langflow flow ID (for advanced users)
    langflow_flow_id: Optional[str] = Field(
        None,
        description="Existing Langflow flow ID (if creating from existing flow)",
    )

    # Optional: flow data for import
    flow_data: Optional[dict] = Field(
        None,
        description="Langflow flow JSON (for import)",
    )


class WorkflowCreateFromAgent(BaseModel):
    """
    Schema for creating a quick workflow from an agent component.
    Creates a simple flow: ChatInput -> Agent -> ChatOutput
    """

    agent_component_id: uuid.UUID = Field(
        ...,
        description="Agent component to use in the workflow",
    )

    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Workflow name (auto-generated from agent name if not provided)",
    )

    description: Optional[str] = None

    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project ID (uses agent's project if not provided)",
    )


class WorkflowCreateFromTemplate(BaseModel):
    """Schema for creating a workflow from a template."""

    template_name: str = Field(
        ...,
        description="Template name to use",
        examples=["support_bot", "sales_agent", "knowledge_assistant"],
    )

    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Workflow name",
    )

    description: Optional[str] = None

    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project ID to assign workflow to",
    )

    # Optional customization
    customization: Optional[dict] = Field(
        None,
        description="Template customization parameters",
    )


class WorkflowUpdate(BaseModel):
    """Schema for updating a workflow."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    is_public: Optional[bool] = None
    flow_data: Optional[dict] = None


class WorkflowResponse(BaseModel):
    """Schema for workflow responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: Optional[uuid.UUID]
    name: str
    description: Optional[str]
    langflow_flow_id: str
    flow_data: Optional[dict]
    agent_component_ids: Optional[List[uuid.UUID]]
    is_active: bool
    is_public: bool
    created_at: datetime
    updated_at: datetime


class WorkflowListResponse(BaseModel):
    """Schema for paginated workflow list."""

    workflows: List[WorkflowResponse]
    total: int
    page: int
    page_size: int


class WorkflowWithAgentsResponse(WorkflowResponse):
    """Schema for workflow with agent component details."""

    agent_components: List[Any] = []  # List of AgentComponentResponse (avoid circular import)


class WorkflowExportResponse(BaseModel):
    """Schema for workflow export."""

    workflow: WorkflowResponse
    flow_data: dict
    agent_components: List[Any] = []
    version: str = "1.0"


class WorkflowImportRequest(BaseModel):
    """Schema for workflow import."""

    workflow: dict = Field(
        ...,
        description="Workflow data to import",
    )
    flow_data: Optional[dict] = Field(
        None,
        description="Langflow flow JSON",
    )
    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project to import into",
    )
