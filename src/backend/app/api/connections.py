"""
Connection management endpoints for Composio OAuth integrations.
"""
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.connection import (
    ConnectionInitiateRequest,
    ConnectionInitiateResponse,
    ConnectionCallbackRequest,
    ConnectionResponse,
    ConnectionListResponse,
    ComposioAppsResponse,
    ConnectionToolsRequest,
    ConnectionToolsResponse,
    ConnectionStatusResponse,
)
from app.services.user_service import UserService
from app.services.composio_connection_service import (
    ComposioConnectionService,
    ComposioConnectionServiceError,
)
from app.services.composio_agent_service import (
    ComposioAgentService,
    ComposioAgentServiceError,
)

router = APIRouter(prefix="/connections", tags=["Connections"])


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.get(
    "/apps",
    response_model=ComposioAppsResponse,
    summary="List available apps",
    description="Get list of available Composio apps with connection status.",
)
async def list_available_apps(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Get all available apps that can be connected.

    Returns apps grouped by category with current connection status.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    return await service.get_available_apps(user)


@router.post(
    "/initiate",
    response_model=ConnectionInitiateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start OAuth flow",
    description="Initiate OAuth connection to an app.",
)
async def initiate_connection(
    data: ConnectionInitiateRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Start the OAuth flow for connecting an app.

    Returns a redirect URL to send the user to for authorization.
    After authorization, Composio redirects back to the callback URL.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    try:
        return await service.initiate_connection(user=user, data=data)
    except ComposioConnectionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/callback",
    response_model=ConnectionResponse,
    summary="OAuth callback",
    description="Handle OAuth callback after user authorization.",
)
async def handle_oauth_callback(
    data: ConnectionCallbackRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Handle the OAuth callback after user authorizes the app.

    This finalizes the connection and stores the connection status.
    Supports lookup by either:
    - connection_id: Our internal ID (preferred)
    - composio_connection_id: Composio's connectedAccountId from OAuth callback
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    try:
        if data.connection_id:
            # Lookup by our internal connection ID
            return await service.handle_callback(user=user, connection_id=data.connection_id)
        elif data.composio_connection_id:
            # Lookup by Composio's connection ID
            return await service.handle_callback_by_composio_id(
                user=user,
                composio_connection_id=data.composio_connection_id,
                app_name=data.app_name,
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either connection_id or composio_connection_id is required",
            )
    except ComposioConnectionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "",
    response_model=ConnectionListResponse,
    summary="List connections",
    description="List all connections for the current user.",
)
async def list_connections(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    page: int = 1,
    page_size: int = 20,
    active_only: bool = False,
):
    """List all app connections for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    connections, total = await service.list_by_user(
        user_id=user.id,
        page=page,
        page_size=page_size,
        active_only=active_only,
    )

    return ConnectionListResponse(
        connections=[ConnectionResponse.model_validate(c) for c in connections],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{connection_id}",
    response_model=ConnectionResponse,
    summary="Get connection",
    description="Get details of a specific connection.",
)
async def get_connection(
    connection_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific connection by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    connection = await service.get_by_id(connection_id, user_id=user.id)

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found.",
        )

    return ConnectionResponse.model_validate(connection)


@router.get(
    "/{connection_id}/status",
    response_model=ConnectionStatusResponse,
    summary="Check connection status",
    description="Quick status check for a connection.",
)
async def check_connection_status(
    connection_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Check the current status of a connection."""
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    try:
        return await service.check_connection_status(user=user, connection_id=connection_id)
    except ComposioConnectionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post(
    "/{connection_id}/refresh",
    response_model=ConnectionResponse,
    summary="Refresh connection",
    description="Attempt to refresh an expired connection.",
)
async def refresh_connection(
    connection_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Refresh a connection that may have expired.

    Composio handles token refresh automatically, but this can be used
    to manually trigger a status check/refresh.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    try:
        return await service.refresh_connection(user=user, connection_id=connection_id)
    except ComposioConnectionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{connection_id}/revoke",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke connection",
    description="Revoke/disconnect an app connection.",
)
async def revoke_connection(
    connection_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Revoke a connection.

    This disconnects the app and marks the connection as revoked.
    The connection record is preserved for audit purposes.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    try:
        await service.revoke_connection(user=user, connection_id=connection_id)
        return None
    except ComposioConnectionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{connection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete connection",
    description="Permanently delete a connection record.",
)
async def delete_connection(
    connection_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Delete a connection record.

    This permanently removes the connection from the database.
    For most cases, use revoke instead to preserve history.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    try:
        await service.delete_connection(user=user, connection_id=connection_id)
        return None
    except ComposioConnectionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/tools",
    response_model=ConnectionToolsResponse,
    summary="Get available tools",
    description="Get tools available from connected apps.",
)
async def get_available_tools(
    data: ConnectionToolsRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Get tools available from the user's connected apps.

    This returns tool metadata, not the actual LangChain tools.
    The actual tools are injected during workflow execution.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = ComposioConnectionService(session)

    return await service.get_tools_for_user(user=user, app_names=data.app_names)


# =============================================================================
# Enhanced Chat with Composio Tools
# =============================================================================


class EnhancedChatRequest(BaseModel):
    """Request for enhanced chat with Composio tools."""
    message: str
    conversation_id: Optional[str] = None
    workflow_id: Optional[str] = None
    app_names: Optional[List[str]] = None


class EnhancedChatResponse(BaseModel):
    """Response from enhanced chat."""
    text: str
    session_id: str
    tools_used: List[str]
    metadata: dict


class ToolAvailabilityResponse(BaseModel):
    """Response indicating tool availability."""
    has_tools: bool
    tool_count: int
    connected_apps: List[str]
    tools: List[dict]


@router.get(
    "/tools/availability",
    response_model=ToolAvailabilityResponse,
    summary="Check tool availability",
    description="Check if the user has any Composio tools available.",
)
async def check_tool_availability(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Quick check if the user has any connected tools available.

    Used by the playground to determine whether to show the
    "Enhanced Chat" option.
    """
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = ComposioAgentService(session)

    has_tools = await agent_service.check_user_has_tools(user)
    tools = await agent_service.get_available_tools_for_user(user)

    # Get unique app names
    connected_apps = list(set(t["app_name"] for t in tools))

    return ToolAvailabilityResponse(
        has_tools=has_tools,
        tool_count=len(tools),
        connected_apps=connected_apps,
        tools=tools,
    )


@router.post(
    "/chat",
    response_model=EnhancedChatResponse,
    summary="Enhanced chat with tools",
    description="Chat using a LangChain agent with Composio tools.",
)
async def enhanced_chat(
    data: EnhancedChatRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Execute a chat message using LangChain with Composio tools.

    This provides an alternative to Langflow execution, directly using
    the user's connected app tools in a LangChain agent.
    """
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = ComposioAgentService(session)

    # Get workflow if specified (for system prompt context)
    workflow = None
    if data.workflow_id:
        from app.services.workflow_service import WorkflowService
        workflow_service = WorkflowService(session)
        workflow = await workflow_service.get_by_id(uuid.UUID(data.workflow_id), user.id)

    try:
        result = await agent_service.chat(
            user=user,
            message=data.message,
            workflow=workflow,
            conversation_id=data.conversation_id,
            app_names=data.app_names,
        )

        return EnhancedChatResponse(
            text=result["text"],
            session_id=result["session_id"],
            tools_used=result.get("tools_used", []),
            metadata=result.get("metadata", {}),
        )

    except ComposioAgentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/chat/stream",
    summary="Enhanced streaming chat with tools",
    description="Streaming chat using a LangChain agent with Composio tools.",
)
async def enhanced_chat_stream(
    data: EnhancedChatRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Execute a streaming chat message using LangChain with Composio tools.

    Returns Server-Sent Events (SSE) with real-time updates including
    tool call visibility.
    """
    import json

    user = await get_user_from_clerk(clerk_user, session)
    agent_service = ComposioAgentService(session)

    # Get workflow if specified (for system prompt context)
    workflow = None
    if data.workflow_id:
        from app.services.workflow_service import WorkflowService
        workflow_service = WorkflowService(session)
        workflow = await workflow_service.get_by_id(uuid.UUID(data.workflow_id), user.id)

    async def event_generator():
        try:
            async for event in agent_service.chat_stream(
                user=user,
                message=data.message,
                workflow=workflow,
                conversation_id=data.conversation_id,
                app_names=data.app_names,
            ):
                # Use mode='json' to properly serialize datetime objects to ISO strings
                yield f"data: {json.dumps(event.model_dump(mode='json'))}\n\n"
        except ComposioAgentServiceError as e:
            from app.schemas.streaming import error_event, done_event
            yield f"data: {json.dumps(error_event(str(e)).model_dump(mode='json'))}\n\n"
            yield f"data: {json.dumps(done_event().model_dump(mode='json'))}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
