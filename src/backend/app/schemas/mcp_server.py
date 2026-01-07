"""
MCPServer schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

from pydantic import BaseModel, ConfigDict, Field


# Predefined MCP server templates
MCP_SERVER_TEMPLATES = {
    "postgres": {
        "name": "PostgreSQL Database",
        "description": "Query PostgreSQL databases",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-postgres"],
        "server_type": "postgres",
        "env_schema": {
            "POSTGRES_URL": {"type": "string", "required": True, "secret": True, "description": "PostgreSQL connection URL"}
        }
    },
    "sqlite": {
        "name": "SQLite Database",
        "description": "Query SQLite databases",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-sqlite"],
        "server_type": "sqlite",
        "env_schema": {
            "DATABASE_PATH": {"type": "string", "required": True, "description": "Path to SQLite database file"}
        }
    },
    "playwright": {
        "name": "Playwright Browser",
        "description": "Browser automation and web scraping",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-playwright"],
        "server_type": "playwright",
        "env_schema": {}
    },
    "filesystem": {
        "name": "File System",
        "description": "Read and write files",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem"],
        "server_type": "filesystem",
        "env_schema": {
            "ALLOWED_PATHS": {"type": "array", "required": True, "description": "Allowed file paths"}
        }
    },
    "git": {
        "name": "Git Operations",
        "description": "Programmatic git operations",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-git"],
        "server_type": "git",
        "env_schema": {}
    },
    "custom": {
        "name": "Custom Server",
        "description": "Configure your own MCP server",
        "command": "",
        "args": [],
        "server_type": "custom",
        "env_schema": {}
    }
}


class MCPServerBase(BaseModel):
    """Base MCP server schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class MCPServerCreate(MCPServerBase):
    """Schema for creating an MCP server."""

    server_type: str = Field(
        ...,
        description="Type: postgres, sqlite, playwright, filesystem, git, custom",
    )

    command: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Command to run (e.g., 'npx', 'python')",
    )

    args: List[str] = Field(
        default=[],
        description="Arguments for the command",
    )

    env: Dict[str, str] = Field(
        default={},
        description="Environment variables (non-sensitive)",
    )

    credentials: Dict[str, str] = Field(
        default={},
        description="Sensitive credentials (will be encrypted)",
    )

    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project ID (null = global MCP server)",
    )


class MCPServerCreateFromTemplate(BaseModel):
    """Schema for creating an MCP server from a template."""

    template_name: str = Field(
        ...,
        description="Template to use: postgres, sqlite, playwright, filesystem, git",
        examples=["postgres", "sqlite"],
    )

    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Custom name (uses template name if not provided)",
    )

    description: Optional[str] = None

    credentials: Dict[str, str] = Field(
        default={},
        description="Credentials required by the template",
    )

    env: Dict[str, str] = Field(
        default={},
        description="Additional environment variables",
    )

    project_id: Optional[uuid.UUID] = Field(
        None,
        description="Project ID (null = global MCP server)",
    )


class MCPServerUpdate(BaseModel):
    """Schema for updating an MCP server."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    command: Optional[str] = None
    args: Optional[List[str]] = None
    env: Optional[Dict[str, str]] = None
    credentials: Optional[Dict[str, str]] = None
    is_enabled: Optional[bool] = None


class MCPServerResponse(BaseModel):
    """Schema for MCP server responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: Optional[uuid.UUID]
    name: str
    description: Optional[str]
    server_type: str
    command: str
    args: List[str]
    env: Dict[str, Any]
    # Note: credentials are never returned
    is_enabled: bool
    needs_sync: bool
    last_health_check: Optional[datetime]
    health_status: Optional[str]
    created_at: datetime
    updated_at: datetime


class MCPServerListResponse(BaseModel):
    """Schema for paginated MCP server list."""

    mcp_servers: List[MCPServerResponse]
    total: int
    page: int
    page_size: int


class MCPServerHealthResponse(BaseModel):
    """Schema for health check response."""

    id: uuid.UUID
    name: str
    health_status: str
    last_health_check: datetime
    message: Optional[str] = None


class MCPServerTemplateResponse(BaseModel):
    """Schema for MCP server template."""

    name: str
    display_name: str
    description: str
    command: str
    args: List[str]
    server_type: str
    env_schema: Dict[str, Any]


class MCPServerTemplatesResponse(BaseModel):
    """Schema for list of available templates."""

    templates: List[MCPServerTemplateResponse]


class MCPServerSyncResponse(BaseModel):
    """Schema for sync operation response."""

    synced_count: int
    needs_restart: bool
    message: str


class PendingChange(BaseModel):
    """Schema for pending restart changes."""

    type: str  # 'agent' or 'mcp'
    id: uuid.UUID
    name: str
    action: str  # 'publish', 'create', 'update', 'delete'
    timestamp: datetime


class RestartStatusResponse(BaseModel):
    """Schema for Langflow restart status."""

    pending_changes: List[PendingChange]
    is_restarting: bool
    last_restart: Optional[datetime]
    langflow_healthy: bool
