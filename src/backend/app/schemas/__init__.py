"""
Pydantic schemas for request/response validation.
"""
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.schemas.agent import (
    AgentCreate,
    AgentCreateFromQA,
    AgentResponse,
    AgentUpdate,
    AgentListResponse,
)
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    ConversationListResponse,
)
from app.schemas.message import (
    MessageCreate,
    MessageResponse,
    ChatRequest,
    ChatResponse,
)
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    ProjectWithAgentsResponse,
    MoveAgentRequest,
)
from app.schemas.settings import (
    ApiKeyCreate,
    ApiKeyResponse,
    UserSettingsUpdate,
    UserSettingsResponse,
    TourCompletedRequest,
)
# New schemas for three-tab architecture
from app.schemas.agent_component import (
    AgentComponentCreate,
    AgentComponentCreateFromQA,
    AgentComponentUpdate,
    AgentComponentResponse,
    AgentComponentListResponse,
    AgentComponentPublishResponse,
)
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowCreateFromAgent,
    WorkflowCreateFromTemplate,
    WorkflowUpdate,
    WorkflowResponse,
    WorkflowListResponse,
    WorkflowWithAgentsResponse,
    WorkflowExportResponse,
    WorkflowImportRequest,
)
from app.schemas.mcp_server import (
    MCPServerCreate,
    MCPServerCreateFromTemplate,
    MCPServerUpdate,
    MCPServerResponse,
    MCPServerListResponse,
    MCPServerHealthResponse,
    MCPServerTemplateResponse,
    MCPServerTemplatesResponse,
    MCPServerSyncResponse,
    PendingChange,
    RestartStatusResponse,
    MCP_SERVER_TEMPLATES,
)

__all__ = [
    "UserCreate",
    "UserResponse",
    "UserUpdate",
    "AgentCreate",
    "AgentCreateFromQA",
    "AgentResponse",
    "AgentUpdate",
    "AgentListResponse",
    "ConversationCreate",
    "ConversationResponse",
    "ConversationListResponse",
    "MessageCreate",
    "MessageResponse",
    "ChatRequest",
    "ChatResponse",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectResponse",
    "ProjectListResponse",
    "ProjectWithAgentsResponse",
    "MoveAgentRequest",
    "ApiKeyCreate",
    "ApiKeyResponse",
    "UserSettingsUpdate",
    "UserSettingsResponse",
    "TourCompletedRequest",
    # New schemas
    "AgentComponentCreate",
    "AgentComponentCreateFromQA",
    "AgentComponentUpdate",
    "AgentComponentResponse",
    "AgentComponentListResponse",
    "AgentComponentPublishResponse",
    "WorkflowCreate",
    "WorkflowCreateFromAgent",
    "WorkflowCreateFromTemplate",
    "WorkflowUpdate",
    "WorkflowResponse",
    "WorkflowListResponse",
    "WorkflowWithAgentsResponse",
    "WorkflowExportResponse",
    "WorkflowImportRequest",
    "MCPServerCreate",
    "MCPServerCreateFromTemplate",
    "MCPServerUpdate",
    "MCPServerResponse",
    "MCPServerListResponse",
    "MCPServerHealthResponse",
    "MCPServerTemplateResponse",
    "MCPServerTemplatesResponse",
    "MCPServerSyncResponse",
    "PendingChange",
    "RestartStatusResponse",
    "MCP_SERVER_TEMPLATES",
]
