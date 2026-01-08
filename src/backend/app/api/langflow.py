"""
Langflow management endpoints.

Provides status, restart, and logging functionality for Langflow integration.
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.mcp_server import RestartStatusResponse
from app.services.user_service import UserService
from app.services.langflow_service import LangflowService, LangflowServiceError
from pydantic import BaseModel

router = APIRouter(prefix="/langflow", tags=["Langflow"])


class LangflowRestartResponse(BaseModel):
    """Response for Langflow restart operation."""
    success: bool
    message: str


class LangflowLogsResponse(BaseModel):
    """Response for Langflow logs."""
    logs: str


class LangflowHealthResponse(BaseModel):
    """Response for Langflow health check."""
    healthy: bool
    message: str


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.get(
    "/status",
    response_model=RestartStatusResponse,
    summary="Get Langflow status",
    description="Get unified status including pending component and MCP server changes.",
)
async def get_langflow_status(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Get comprehensive Langflow status.

    Includes:
    - Pending component changes (publish/unpublish)
    - Pending MCP server changes
    - Langflow health status
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = LangflowService(session)

    return await service.get_restart_status(user.id)


@router.get(
    "/health",
    response_model=LangflowHealthResponse,
    summary="Check Langflow health",
    description="Check if Langflow is running and healthy.",
)
async def check_langflow_health(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Check Langflow health status."""
    await get_user_from_clerk(clerk_user, session)  # Ensure authenticated
    service = LangflowService(session)

    healthy = await service.check_langflow_health()

    return LangflowHealthResponse(
        healthy=healthy,
        message="Langflow is running" if healthy else "Langflow is not responding",
    )


@router.post(
    "/restart",
    response_model=LangflowRestartResponse,
    summary="Restart Langflow",
    description="Restart Langflow to apply pending changes (requires Docker).",
)
async def restart_langflow(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Restart Langflow container to apply pending changes.

    This triggers a Docker container restart which will:
    - Reload all custom components
    - Apply MCP server configuration changes

    Note: This operation may take 30-60 seconds.
    """
    await get_user_from_clerk(clerk_user, session)  # Ensure authenticated
    service = LangflowService(session)

    result = await service.restart_langflow()

    return LangflowRestartResponse(
        success=result["success"],
        message=result["message"],
    )


@router.get(
    "/logs",
    response_model=LangflowLogsResponse,
    summary="Get Langflow logs",
    description="Get recent Langflow container logs for debugging.",
)
async def get_langflow_logs(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    lines: int = 50,
):
    """
    Get recent Langflow container logs.

    Useful for debugging component loading issues.
    """
    await get_user_from_clerk(clerk_user, session)  # Ensure authenticated
    service = LangflowService(session)

    # Limit to reasonable number of lines
    lines = min(max(lines, 10), 500)

    logs = await service.get_langflow_logs(lines)

    return LangflowLogsResponse(logs=logs)
