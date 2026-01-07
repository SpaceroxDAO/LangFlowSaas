"""
MCP Server management endpoints.
"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.mcp_server import (
    MCPServerCreate,
    MCPServerCreateFromTemplate,
    MCPServerResponse,
    MCPServerUpdate,
    MCPServerListResponse,
    MCPServerHealthResponse,
    MCPServerSyncResponse,
    MCPServerTemplatesResponse,
    RestartStatusResponse,
)
from app.services.user_service import UserService
from app.services.mcp_server_service import MCPServerService, MCPServerServiceError

router = APIRouter(prefix="/mcp-servers", tags=["MCP Servers"])


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.get(
    "/templates",
    response_model=MCPServerTemplatesResponse,
    summary="List MCP server templates",
    description="Get list of available MCP server templates.",
)
async def list_templates(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get available MCP server templates."""
    await get_user_from_clerk(clerk_user, session)  # Ensure authenticated
    service = MCPServerService(session)

    templates = service.get_templates()
    return MCPServerTemplatesResponse(templates=templates)


@router.post(
    "",
    response_model=MCPServerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create MCP server",
    description="Create a new MCP server configuration.",
)
async def create_mcp_server(
    data: MCPServerCreate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create a new MCP server configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    try:
        server = await service.create(user=user, data=data)
        return server
    except MCPServerServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/from-template",
    response_model=MCPServerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create MCP server from template",
    description="Create an MCP server from a predefined template.",
)
async def create_mcp_server_from_template(
    data: MCPServerCreateFromTemplate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create an MCP server from a predefined template."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    try:
        server = await service.create_from_template(user=user, data=data)
        return server
    except MCPServerServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "",
    response_model=MCPServerListResponse,
    summary="List MCP servers",
    description="List all MCP servers for the current user.",
)
async def list_mcp_servers(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    project_id: Optional[uuid.UUID] = None,
    page: int = 1,
    page_size: int = 20,
    enabled_only: bool = False,
):
    """List all MCP servers for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    servers, total = await service.list_by_user(
        user_id=user.id,
        project_id=project_id,
        page=page,
        page_size=page_size,
        enabled_only=enabled_only,
    )

    return MCPServerListResponse(
        mcp_servers=[MCPServerResponse.model_validate(s) for s in servers],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/restart-status",
    response_model=RestartStatusResponse,
    summary="Get restart status",
    description="Get Langflow restart status and pending changes.",
)
async def get_restart_status(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get restart status and pending changes."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    return await service.get_restart_status(user.id)


@router.get(
    "/{server_id}",
    response_model=MCPServerResponse,
    summary="Get MCP server",
    description="Get details of a specific MCP server.",
)
async def get_mcp_server(
    server_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific MCP server by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    server = await service.get_by_id(server_id, user_id=user.id)

    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MCP server not found.",
        )

    return server


@router.patch(
    "/{server_id}",
    response_model=MCPServerResponse,
    summary="Update MCP server",
    description="Update an MCP server configuration.",
)
async def update_mcp_server(
    server_id: uuid.UUID,
    update_data: MCPServerUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update an MCP server's configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    server = await service.get_by_id(server_id, user_id=user.id)

    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MCP server not found.",
        )

    try:
        updated = await service.update(server, update_data)
        return updated
    except MCPServerServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{server_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete MCP server",
    description="Delete an MCP server configuration.",
)
async def delete_mcp_server(
    server_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete an MCP server."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    server = await service.get_by_id(server_id, user_id=user.id)

    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MCP server not found.",
        )

    await service.delete(server)
    return None


@router.post(
    "/{server_id}/enable",
    response_model=MCPServerResponse,
    summary="Enable MCP server",
    description="Enable an MCP server.",
)
async def enable_mcp_server(
    server_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Enable an MCP server."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    server = await service.get_by_id(server_id, user_id=user.id)

    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MCP server not found.",
        )

    return await service.enable(server)


@router.post(
    "/{server_id}/disable",
    response_model=MCPServerResponse,
    summary="Disable MCP server",
    description="Disable an MCP server.",
)
async def disable_mcp_server(
    server_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Disable an MCP server."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    server = await service.get_by_id(server_id, user_id=user.id)

    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MCP server not found.",
        )

    return await service.disable(server)


@router.get(
    "/{server_id}/health",
    response_model=MCPServerHealthResponse,
    summary="Check MCP server health",
    description="Check if an MCP server is healthy.",
)
async def check_mcp_server_health(
    server_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Check MCP server health."""
    user = await get_user_from_clerk(clerk_user, session)
    service = MCPServerService(session)

    server = await service.get_by_id(server_id, user_id=user.id)

    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MCP server not found.",
        )

    return await service.check_health(server)


@router.post(
    "/sync",
    response_model=MCPServerSyncResponse,
    summary="Sync MCP servers",
    description="Sync all MCP servers to .mcp.json configuration file.",
)
async def sync_mcp_servers(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Sync all enabled MCP servers to .mcp.json.

    This generates the configuration file that Langflow reads.
    After syncing, Langflow needs to be restarted for changes to take effect.
    """
    await get_user_from_clerk(clerk_user, session)  # Ensure authenticated
    service = MCPServerService(session)

    try:
        result = await service.sync_to_config()
        return result
    except MCPServerServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
