"""
AgentComponent schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict, Field


class AgentComponentAdvancedConfig(BaseModel):
    """
    Advanced configuration for agent components.

    These settings control the LLM behavior when the component is used.
    All fields have sensible defaults for beginners.
    """

    # Model Selection
    model_provider: str = Field(
        default="OpenAI",
        description="LLM provider (OpenAI, Anthropic, Google, Azure OpenAI)",
    )
    model_name: str = Field(
        default="gpt-4o-mini",
        description="Specific model to use",
    )

    # Generation Settings
    temperature: float = Field(
        default=0.7,
        ge=0,
        le=2,
        description="Controls randomness (0=deterministic, 2=creative)",
    )
    max_tokens: int = Field(
        default=4096,
        ge=1,
        le=128000,
        description="Maximum tokens in the response",
    )

    # Agent Behavior
    max_iterations: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Maximum agent reasoning steps",
    )
    verbose: bool = Field(
        default=False,
        description="Show detailed reasoning steps",
    )
    handle_parsing_errors: bool = Field(
        default=True,
        description="Gracefully handle LLM output parsing errors",
    )
    chat_history_enabled: bool = Field(
        default=True,
        description="Enable multi-turn conversation memory",
    )


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

    # Knowledge sources for RAG
    knowledge_source_ids: List[str] = Field(
        default=[],
        description="List of knowledge source IDs for RAG retrieval",
        examples=[["uuid-1", "uuid-2"]],
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
    selected_tools: Optional[List[str]] = Field(
        None,
        description="Array of selected tool IDs (e.g., ['web_search', 'weather'])",
    )
    knowledge_source_ids: Optional[List[str]] = Field(
        None,
        description="Array of knowledge source IDs for RAG retrieval",
    )
    icon: Optional[str] = None
    color: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None
    advanced_config: Optional[AgentComponentAdvancedConfig] = Field(
        None,
        description="Advanced LLM configuration (model, temperature, etc.)",
    )


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
    selected_tools: Optional[List[str]] = None
    knowledge_source_ids: Optional[List[str]] = None
    system_prompt: str
    advanced_config: Optional[AgentComponentAdvancedConfig] = None
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


class PublishWithSkillsRequest(BaseModel):
    """Request to publish an agent and set workflow skills in one call."""

    skill_workflow_ids: List[uuid.UUID] = Field(
        default=[],
        description="Workflow IDs to enable as agent skills",
    )


class EnabledSkillInfo(BaseModel):
    """Info about an enabled skill workflow."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


class PublishWithSkillsResponse(BaseModel):
    """Response from publish-with-skills endpoint."""

    agent: AgentComponentResponse
    enabled_skills: List[EnabledSkillInfo]
    mcp_token: Optional[str] = Field(
        None,
        description="Raw MCP token (only returned if newly generated)",
    )
    has_mcp_token: bool = Field(
        description="Whether the user has an MCP bridge token",
    )
