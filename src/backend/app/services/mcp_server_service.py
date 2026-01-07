"""
MCPServer service for managing MCP server configurations.
"""
import json
import logging
import os
import uuid
from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.models.mcp_server import MCPServer
from app.models.user import User
from app.models.project import Project
from app.schemas.mcp_server import (
    MCPServerCreate,
    MCPServerCreateFromTemplate,
    MCPServerUpdate,
    MCPServerHealthResponse,
    MCPServerSyncResponse,
    MCPServerTemplateResponse,
    MCP_SERVER_TEMPLATES,
    PendingChange,
    RestartStatusResponse,
)
from app.config import settings

# Path to .mcp.json config file
MCP_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "../../../.mcp.json")


class MCPServerServiceError(Exception):
    """Exception raised when MCP server operations fail."""
    pass


class MCPServerService:
    """Service for MCP server CRUD and configuration operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(
        self,
        server_id: uuid.UUID,
        user_id: uuid.UUID = None,
    ) -> Optional[MCPServer]:
        """Get MCP server by ID, optionally filtered by user."""
        server_id_str = str(server_id)
        stmt = select(MCPServer).where(MCPServer.id == server_id_str)

        if user_id:
            user_id_str = str(user_id)
            stmt = stmt.where(MCPServer.user_id == user_id_str)

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        project_id: uuid.UUID = None,
        page: int = 1,
        page_size: int = 20,
        enabled_only: bool = False,
    ) -> Tuple[List[MCPServer], int]:
        """List MCP servers for a user with pagination."""
        user_id_str = str(user_id)
        stmt = select(MCPServer).where(MCPServer.user_id == user_id_str)

        if project_id:
            project_id_str = str(project_id)
            stmt = stmt.where(MCPServer.project_id == project_id_str)

        if enabled_only:
            stmt = stmt.where(MCPServer.is_enabled == True)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(MCPServer.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        servers = list(result.scalars().all())

        return servers, total

    async def list_enabled(self) -> List[MCPServer]:
        """List all enabled MCP servers (for syncing to .mcp.json)."""
        stmt = select(MCPServer).where(MCPServer.is_enabled == True)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create(
        self,
        user: User,
        data: MCPServerCreate,
    ) -> MCPServer:
        """Create a new MCP server configuration."""
        # Determine project
        project_id = None
        if data.project_id:
            project_id = str(data.project_id)

        # Encrypt credentials if provided
        credentials_encrypted = None
        if data.credentials:
            credentials_encrypted = self._encrypt_credentials(data.credentials)

        server = MCPServer(
            user_id=str(user.id),
            project_id=project_id,
            name=data.name,
            description=data.description,
            server_type=data.server_type,
            command=data.command,
            args=data.args,
            env=data.env,
            credentials_encrypted=credentials_encrypted,
            is_enabled=True,
            needs_sync=True,  # Needs to be synced to .mcp.json
            health_status="unknown",
        )

        self.session.add(server)
        await self.session.flush()
        await self.session.refresh(server)

        logger.info(f"Created MCP server {server.id} for user {user.id}")
        return server

    async def create_from_template(
        self,
        user: User,
        data: MCPServerCreateFromTemplate,
    ) -> MCPServer:
        """Create an MCP server from a predefined template."""
        template = MCP_SERVER_TEMPLATES.get(data.template_name)
        if not template:
            raise MCPServerServiceError(f"Template '{data.template_name}' not found.")

        # Encrypt credentials
        credentials_encrypted = None
        if data.credentials:
            credentials_encrypted = self._encrypt_credentials(data.credentials)

        # Merge template env with user env
        env = {**template.get("env_schema", {})}
        if data.env:
            env.update(data.env)
        # Remove schema metadata from env
        env = {k: v for k, v in env.items() if not isinstance(v, dict)}

        server = MCPServer(
            user_id=str(user.id),
            project_id=str(data.project_id) if data.project_id else None,
            name=data.name or template["name"],
            description=data.description or template["description"],
            server_type=template["server_type"],
            command=template["command"],
            args=template["args"],
            env=env,
            credentials_encrypted=credentials_encrypted,
            is_enabled=True,
            needs_sync=True,
            health_status="unknown",
        )

        self.session.add(server)
        await self.session.flush()
        await self.session.refresh(server)

        logger.info(f"Created MCP server from template {data.template_name}")
        return server

    async def update(
        self,
        server: MCPServer,
        update_data: MCPServerUpdate,
    ) -> MCPServer:
        """Update MCP server configuration."""
        data = update_data.model_dump(exclude_unset=True)

        # Handle credentials separately
        if "credentials" in data:
            if data["credentials"]:
                server.credentials_encrypted = self._encrypt_credentials(data["credentials"])
            else:
                server.credentials_encrypted = None
            del data["credentials"]

        # Apply other updates
        for field, value in data.items():
            setattr(server, field, value)

        # Mark as needing sync
        server.needs_sync = True

        await self.session.flush()
        await self.session.refresh(server)

        return server

    async def delete(self, server: MCPServer) -> bool:
        """Delete an MCP server configuration."""
        await self.session.delete(server)
        await self.session.flush()

        # Note: .mcp.json sync will happen on next restart
        logger.info(f"Deleted MCP server {server.id}")
        return True

    async def enable(self, server: MCPServer) -> MCPServer:
        """Enable an MCP server."""
        server.is_enabled = True
        server.needs_sync = True
        await self.session.flush()
        await self.session.refresh(server)
        return server

    async def disable(self, server: MCPServer) -> MCPServer:
        """Disable an MCP server."""
        server.is_enabled = False
        server.needs_sync = True
        await self.session.flush()
        await self.session.refresh(server)
        return server

    async def check_health(self, server: MCPServer) -> MCPServerHealthResponse:
        """
        Check if an MCP server is healthy.

        This attempts to spawn the server process briefly to verify it can start.
        """
        # TODO: Implement actual health check by spawning process
        # For now, just update timestamp
        server.last_health_check = datetime.utcnow()
        server.health_status = "unknown"  # Would be "healthy" or "unhealthy" after real check
        await self.session.flush()

        return MCPServerHealthResponse(
            id=server.id,
            name=server.name,
            health_status=server.health_status,
            last_health_check=server.last_health_check,
            message="Health check not yet implemented",
        )

    async def sync_to_config(self) -> MCPServerSyncResponse:
        """
        Sync all enabled MCP servers to .mcp.json file.

        This generates the configuration file that Langflow reads.
        """
        servers = await self.list_enabled()

        config = {"mcpServers": {}}

        for server in servers:
            # Build env with decrypted credentials
            env = dict(server.env) if server.env else {}
            if server.credentials_encrypted:
                credentials = self._decrypt_credentials(server.credentials_encrypted)
                env.update(credentials)

            config["mcpServers"][server.name] = {
                "command": server.command,
                "args": server.args,
                "env": env,
                "disabled": not server.is_enabled,
            }

            # Mark as synced
            server.needs_sync = False

        # Write config file
        try:
            config_path = os.path.abspath(MCP_CONFIG_PATH)
            with open(config_path, 'w') as f:
                json.dump(config, f, indent=2)
            logger.info(f"Synced {len(servers)} MCP servers to {config_path}")
        except Exception as e:
            logger.error(f"Failed to write .mcp.json: {e}")
            raise MCPServerServiceError(f"Failed to sync config: {e}")

        await self.session.flush()

        return MCPServerSyncResponse(
            synced_count=len(servers),
            needs_restart=True,
            message=f"Synced {len(servers)} servers. Restart Langflow to apply changes.",
        )

    async def get_pending_changes(self, user_id: uuid.UUID = None) -> List[PendingChange]:
        """Get list of changes that need Langflow restart."""
        stmt = select(MCPServer).where(MCPServer.needs_sync == True)
        if user_id:
            stmt = stmt.where(MCPServer.user_id == str(user_id))

        result = await self.session.execute(stmt)
        servers = list(result.scalars().all())

        return [
            PendingChange(
                type="mcp",
                id=s.id,
                name=s.name,
                action="update",
                timestamp=s.updated_at,
            )
            for s in servers
        ]

    async def get_restart_status(self, user_id: uuid.UUID = None) -> RestartStatusResponse:
        """Get current restart status."""
        pending = await self.get_pending_changes(user_id)

        # TODO: Check actual Langflow health
        langflow_healthy = True

        return RestartStatusResponse(
            pending_changes=pending,
            is_restarting=False,
            last_restart=None,
            langflow_healthy=langflow_healthy,
        )

    def get_templates(self) -> List[MCPServerTemplateResponse]:
        """Get list of available MCP server templates."""
        return [
            MCPServerTemplateResponse(
                name=key,
                display_name=template["name"],
                description=template["description"],
                command=template["command"],
                args=template["args"],
                server_type=template["server_type"],
                env_schema=template["env_schema"],
            )
            for key, template in MCP_SERVER_TEMPLATES.items()
        ]

    def _encrypt_credentials(self, credentials: dict) -> str:
        """Encrypt credentials for storage."""
        # TODO: Implement proper encryption using Fernet
        # For now, just JSON encode (NOT SECURE - placeholder)
        return json.dumps(credentials)

    def _decrypt_credentials(self, encrypted: str) -> dict:
        """Decrypt credentials from storage."""
        # TODO: Implement proper decryption using Fernet
        # For now, just JSON decode (NOT SECURE - placeholder)
        try:
            return json.loads(encrypted)
        except Exception:
            return {}
