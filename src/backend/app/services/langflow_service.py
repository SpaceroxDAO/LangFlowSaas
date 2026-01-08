"""
Langflow Service - Manages Langflow integration, restart, and status.

This service provides:
1. Unified status tracking for pending changes (MCP servers + components)
2. Langflow health checks
3. Docker-based restart functionality
"""
import logging
import os
import subprocess
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent_component import AgentComponent
from app.models.mcp_server import MCPServer
from app.schemas.mcp_server import PendingChange, RestartStatusResponse

logger = logging.getLogger(__name__)


class LangflowServiceError(Exception):
    """Exception raised when Langflow operations fail."""
    pass


class LangflowService:
    """
    Service for managing Langflow integration.

    Provides unified status tracking, health checks, and restart functionality.
    """

    # Docker container name for Langflow (from docker-compose)
    LANGFLOW_CONTAINER_NAME = os.environ.get("LANGFLOW_CONTAINER_NAME", "langflow")

    # Langflow health check URL
    LANGFLOW_HEALTH_URL = os.environ.get("LANGFLOW_URL", "http://localhost:7860") + "/health"

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_pending_component_changes(
        self,
        user_id: uuid.UUID = None
    ) -> List[PendingChange]:
        """
        Get list of component changes that need Langflow restart.

        Components with is_published=True but no component_file_path need regeneration.
        Components recently published/unpublished need restart to take effect.
        """
        # Query for components that have been recently changed
        # We look for components where is_published status recently changed
        stmt = select(AgentComponent).where(
            AgentComponent.is_published == True
        )

        if user_id:
            stmt = stmt.where(AgentComponent.user_id == str(user_id))

        # For now, we track components that are published
        # In a full implementation, we'd track publish/unpublish actions separately
        result = await self.session.execute(stmt)
        components = list(result.scalars().all())

        # Only include components that have been published (have file paths)
        # This is a simplified implementation - in production you'd track actual changes
        pending = []
        for c in components:
            if c.component_file_path:
                pending.append(
                    PendingChange(
                        type="component",
                        id=c.id,
                        name=c.name,
                        action="publish",
                        timestamp=c.updated_at,
                    )
                )

        return pending

    async def get_pending_mcp_changes(
        self,
        user_id: uuid.UUID = None
    ) -> List[PendingChange]:
        """Get list of MCP server changes that need Langflow restart."""
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

    async def get_restart_status(
        self,
        user_id: uuid.UUID = None
    ) -> RestartStatusResponse:
        """
        Get comprehensive restart status including all pending changes.

        Combines MCP server and component changes into a unified status.
        """
        # Get pending changes from both sources
        mcp_changes = await self.get_pending_mcp_changes(user_id)
        component_changes = await self.get_pending_component_changes(user_id)

        all_changes = mcp_changes + component_changes

        # Check Langflow health
        langflow_healthy = await self.check_langflow_health()

        return RestartStatusResponse(
            pending_changes=all_changes,
            is_restarting=False,  # Would be set by a state machine in production
            last_restart=None,  # Would be tracked in a persistent store
            langflow_healthy=langflow_healthy,
        )

    async def check_langflow_health(self) -> bool:
        """
        Check if Langflow is healthy by calling its health endpoint.
        """
        try:
            import httpx
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(self.LANGFLOW_HEALTH_URL)
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"Langflow health check failed: {e}")
            return False

    async def restart_langflow(self) -> dict:
        """
        Restart Langflow container via Docker.

        This is the simplest restart method that works in Docker environments.
        After restart, Langflow will reload all custom components.

        Returns:
            dict with status and message
        """
        container_name = self.LANGFLOW_CONTAINER_NAME

        try:
            # Check if running in Docker environment
            if not self._is_docker_available():
                logger.warning("Docker not available - cannot restart Langflow")
                return {
                    "success": False,
                    "message": "Docker is not available. Please restart Langflow manually.",
                }

            # Restart the Langflow container
            logger.info(f"Restarting Langflow container: {container_name}")

            result = subprocess.run(
                ["docker", "restart", container_name],
                capture_output=True,
                text=True,
                timeout=60,
            )

            if result.returncode == 0:
                logger.info(f"Langflow container restarted successfully")
                return {
                    "success": True,
                    "message": f"Langflow is restarting. This may take 30-60 seconds.",
                }
            else:
                logger.error(f"Docker restart failed: {result.stderr}")
                return {
                    "success": False,
                    "message": f"Restart failed: {result.stderr}",
                }

        except subprocess.TimeoutExpired:
            logger.error("Docker restart timed out")
            return {
                "success": False,
                "message": "Restart timed out. Please check Docker logs.",
            }
        except FileNotFoundError:
            logger.error("Docker command not found")
            return {
                "success": False,
                "message": "Docker command not found. Please restart Langflow manually.",
            }
        except Exception as e:
            logger.error(f"Unexpected error restarting Langflow: {e}")
            return {
                "success": False,
                "message": f"Unexpected error: {str(e)}",
            }

    def _is_docker_available(self) -> bool:
        """Check if Docker is available on the system."""
        try:
            result = subprocess.run(
                ["docker", "version"],
                capture_output=True,
                text=True,
                timeout=5,
            )
            return result.returncode == 0
        except Exception:
            return False

    async def get_langflow_logs(self, lines: int = 50) -> str:
        """
        Get recent Langflow container logs.

        Useful for debugging component loading issues.
        """
        container_name = self.LANGFLOW_CONTAINER_NAME

        try:
            result = subprocess.run(
                ["docker", "logs", "--tail", str(lines), container_name],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode == 0:
                return result.stdout + result.stderr
            else:
                return f"Failed to get logs: {result.stderr}"

        except Exception as e:
            return f"Error getting logs: {str(e)}"


# Singleton instance
_langflow_service_instance = None


def get_langflow_service(session: AsyncSession) -> LangflowService:
    """Get LangflowService instance for the given session."""
    return LangflowService(session)
