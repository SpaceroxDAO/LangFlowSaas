"""
Connection schemas for Composio OAuth integrations.
"""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal

from pydantic import BaseModel, ConfigDict, Field


# Connection status enum
ConnectionStatus = Literal["pending", "active", "expired", "revoked", "error"]


# Available Composio apps (most popular)
COMPOSIO_APPS = {
    "gmail": {
        "display_name": "Gmail",
        "description": "Read, search, and send emails",
        "icon": "mail",
        "category": "communication",
        "actions": ["GMAIL_SEARCH", "GMAIL_SEND", "GMAIL_READ", "GMAIL_CREATE_DRAFT"],
    },
    "googlecalendar": {
        "display_name": "Google Calendar",
        "description": "View and create calendar events",
        "icon": "calendar",
        "category": "productivity",
        "actions": ["CALENDAR_GET_EVENTS", "CALENDAR_CREATE_EVENT", "CALENDAR_DELETE_EVENT"],
    },
    "slack": {
        "display_name": "Slack",
        "description": "Send messages and manage channels",
        "icon": "message-square",
        "category": "communication",
        "actions": ["SLACK_SEND_MESSAGE", "SLACK_LIST_CHANNELS", "SLACK_SEARCH"],
    },
    "notion": {
        "display_name": "Notion",
        "description": "Read and write Notion pages",
        "icon": "file-text",
        "category": "productivity",
        "actions": ["NOTION_GET_PAGE", "NOTION_CREATE_PAGE", "NOTION_UPDATE_PAGE"],
    },
    "hubspot": {
        "display_name": "HubSpot",
        "description": "Manage contacts and deals",
        "icon": "users",
        "category": "crm",
        "actions": ["HUBSPOT_GET_CONTACTS", "HUBSPOT_CREATE_CONTACT", "HUBSPOT_GET_DEALS"],
    },
    "googledrive": {
        "display_name": "Google Drive",
        "description": "Access and manage files",
        "icon": "hard-drive",
        "category": "storage",
        "actions": ["DRIVE_LIST_FILES", "DRIVE_DOWNLOAD", "DRIVE_UPLOAD"],
    },
    "github": {
        "display_name": "GitHub",
        "description": "Manage repositories and issues",
        "icon": "github",
        "category": "development",
        "actions": ["GITHUB_GET_REPOS", "GITHUB_CREATE_ISSUE", "GITHUB_GET_PR"],
    },
    "linear": {
        "display_name": "Linear",
        "description": "Manage issues and projects",
        "icon": "layout",
        "category": "development",
        "actions": ["LINEAR_GET_ISSUES", "LINEAR_CREATE_ISSUE", "LINEAR_UPDATE_ISSUE"],
    },
}


class ConnectionInitiateRequest(BaseModel):
    """Request to initiate a new OAuth connection."""

    app_name: str = Field(
        ...,
        description="Composio app key: gmail, slack, googlecalendar, etc.",
        examples=["gmail", "slack", "notion"],
    )

    redirect_url: Optional[str] = Field(
        None,
        description="Custom redirect URL after OAuth (defaults to callback URL in settings)",
    )


class ConnectionInitiateResponse(BaseModel):
    """Response with OAuth redirect URL."""

    connection_id: uuid.UUID = Field(
        ...,
        description="Internal connection ID (pending status)",
    )

    composio_connection_id: str = Field(
        ...,
        description="Composio's connection request ID",
    )

    redirect_url: str = Field(
        ...,
        description="URL to redirect user for OAuth authorization",
    )

    expires_in: int = Field(
        default=600,
        description="How long the redirect URL is valid (seconds)",
    )


class ConnectionCallbackRequest(BaseModel):
    """Request from OAuth callback."""

    connection_id: uuid.UUID = Field(
        ...,
        description="Internal connection ID from initiate response",
    )


class ConnectionResponse(BaseModel):
    """Full connection details response."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    app_name: str
    app_display_name: str
    status: ConnectionStatus
    account_identifier: Optional[str]
    scopes: Optional[List[str]]
    available_actions: Optional[List[Dict[str, Any]]]
    connected_at: Optional[datetime]
    last_used_at: Optional[datetime]
    expires_at: Optional[datetime]
    last_error: Optional[str]
    created_at: datetime
    updated_at: datetime

    # Computed properties
    @property
    def is_active(self) -> bool:
        return self.status == "active"

    @property
    def needs_reconnection(self) -> bool:
        return self.status in ("expired", "error", "revoked")


class ConnectionListResponse(BaseModel):
    """Paginated list of connections."""

    connections: List[ConnectionResponse]
    total: int
    page: int
    page_size: int


class ComposioAppInfo(BaseModel):
    """Information about a Composio app."""

    app_name: str
    display_name: str
    description: str
    icon: str
    category: str
    actions: List[str]
    is_connected: bool = False
    connection_id: Optional[uuid.UUID] = None
    connection_status: Optional[ConnectionStatus] = None


class ComposioAppsResponse(BaseModel):
    """List of available Composio apps."""

    apps: List[ComposioAppInfo]
    categories: List[str]


class ConnectionToolsRequest(BaseModel):
    """Request to get tools for connected apps."""

    app_names: List[str] = Field(
        ...,
        description="List of app names to get tools for",
        examples=[["gmail", "googlecalendar"]],
    )


class ConnectionToolInfo(BaseModel):
    """Information about a tool from a connected app."""

    name: str
    description: str
    app_name: str
    parameters: Optional[Dict[str, Any]] = None


class ConnectionToolsResponse(BaseModel):
    """Tools available from connected apps."""

    tools: List[ConnectionToolInfo]
    total: int


class ConnectionStatusResponse(BaseModel):
    """Quick status check for a connection."""

    id: uuid.UUID
    app_name: str
    status: ConnectionStatus
    is_active: bool
    needs_reconnection: bool
    last_error: Optional[str]
