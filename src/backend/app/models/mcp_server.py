"""
MCPServer model - stores MCP (Model Context Protocol) server configurations.

MCP servers provide external tool integrations like database access,
browser automation, file operations, etc.
"""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project


class MCPServer(BaseModel):
    """
    An MCP server configuration for external tool integrations.

    MCP (Model Context Protocol) servers provide tools like:
    - PostgreSQL database queries
    - SQLite database access
    - Playwright browser automation
    - Filesystem operations
    - Git operations
    - Custom API integrations

    Configurations are synced to .mcp.json for Langflow to use.
    """

    __tablename__ = "mcp_servers"

    # Owner relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Project relationship (nullable - MCP servers can be global or project-specific)
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Project this MCP server belongs to (null = global)",
    )

    # Server identity
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Display name for the MCP server",
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Server type (for UI and validation)
    server_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Type: postgres, sqlite, playwright, filesystem, git, custom",
    )

    # Configuration (matches .mcp.json structure)
    command: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Command to run (e.g., 'npx', 'python')",
    )

    args: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        comment="Arguments for the command (e.g., ['-y', '@modelcontextprotocol/server-postgres'])",
    )

    env: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
        comment="Environment variables (non-sensitive)",
    )

    # Encrypted credentials (sensitive data)
    credentials_encrypted: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Encrypted JSON of sensitive credentials",
    )

    # Server status
    is_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether this server is enabled in .mcp.json",
    )

    # Sync status (whether changes have been synced to .mcp.json and Langflow restarted)
    needs_sync: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether changes need to be synced to Langflow",
    )

    # Health monitoring
    last_health_check: Mapped[Optional[datetime]] = mapped_column(
        DateTime(),
        nullable=True,
        comment="Last time health check was performed",
    )

    health_status: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default="unknown",
        comment="Health status: healthy, unhealthy, unknown",
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="mcp_servers",
        lazy="select",
    )

    project: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="mcp_servers",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<MCPServer(id={self.id}, name={self.name}, type={self.server_type})>"

    def to_mcp_config(self) -> dict:
        """
        Convert to .mcp.json format for Langflow.

        Returns:
            dict: MCP server config in Langflow format
        """
        return {
            "command": self.command,
            "args": self.args,
            "env": self.env,  # Note: credentials need to be decrypted and merged
            "disabled": not self.is_enabled,
        }
