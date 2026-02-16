"""
User settings management endpoints.
"""
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.settings import (
    ApiKeyCreate,
    ApiKeyResponse,
    UserSettingsUpdate,
    UserSettingsResponse,
    TourCompletedRequest,
)
from app.services.user_service import UserService
from app.services.settings_service import SettingsService, SettingsServiceError

router = APIRouter(prefix="/settings", tags=["Settings"])


def build_settings_response(
    settings,
    settings_service: SettingsService,
) -> UserSettingsResponse:
    """Build a complete UserSettingsResponse from a settings model."""
    return UserSettingsResponse(
        id=settings.id,
        user_id=settings.user_id,
        default_llm_provider=settings.default_llm_provider,
        theme=settings.theme,
        sidebar_collapsed=settings.sidebar_collapsed,
        onboarding_completed=settings.onboarding_completed,
        tours_completed=settings.tours_completed or {},
        created_at=settings.created_at,
        updated_at=settings.updated_at,
        api_keys=settings_service.get_api_keys_list(settings),
    )


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """
    Get or create user from Clerk authentication.
    This ensures the user exists in our database.
    """
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.get(
    "",
    response_model=UserSettingsResponse,
    summary="Get user settings",
    description="Get current user's settings.",
)
async def get_settings(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get the current user's settings."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)

    return build_settings_response(settings, settings_service)


@router.patch(
    "",
    response_model=UserSettingsResponse,
    summary="Update user settings",
    description="Update the current user's settings.",
)
async def update_settings(
    update_data: UserSettingsUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update user settings."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)

    try:
        updated = await settings_service.update(settings, update_data)
        return build_settings_response(updated, settings_service)
    except SettingsServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/api-keys",
    response_model=List[ApiKeyResponse],
    summary="List API keys",
    description="List all configured API keys (masked).",
)
async def list_api_keys(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """List all API keys for the user (shows provider and status, not actual keys)."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)
    return settings_service.get_api_keys_list(settings)


@router.post(
    "/api-keys",
    response_model=ApiKeyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Set API key",
    description="Store an API key for a provider.",
)
async def set_api_key(
    data: ApiKeyCreate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Store an API key for a specific provider."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)

    try:
        await settings_service.set_api_key(settings, data.provider, data.api_key)
        # Return the updated key info (masked)
        keys = settings_service.get_api_keys_list(settings)
        for key in keys:
            if key.provider == data.provider:
                return key
        # Should not reach here
        return ApiKeyResponse(provider=data.provider, is_set=True, last_updated=None)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save API key. Error: {str(e)}",
        )


@router.delete(
    "/api-keys/{provider}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete API key",
    description="Remove an API key for a provider.",
)
async def delete_api_key(
    provider: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete an API key for a specific provider."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)
    await settings_service.delete_api_key(settings, provider)
    return None


@router.post(
    "/tours/{tour_id}/complete",
    response_model=UserSettingsResponse,
    summary="Complete tour",
    description="Mark an onboarding tour as completed.",
)
async def complete_tour(
    tour_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Mark a specific tour as completed."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)
    updated = await settings_service.complete_tour(settings, tour_id)

    return build_settings_response(updated, settings_service)


@router.get(
    "/tours/{tour_id}/completed",
    summary="Check tour status",
    description="Check if a specific tour has been completed.",
)
async def check_tour_completed(
    tour_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Check if a specific tour has been completed."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)
    is_completed = await settings_service.is_tour_completed(settings, tour_id)

    return {"tour_id": tour_id, "completed": is_completed}


@router.post(
    "/onboarding/complete",
    response_model=UserSettingsResponse,
    summary="Complete onboarding",
    description="Mark the entire onboarding process as completed.",
)
async def complete_onboarding(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Mark the entire onboarding process as completed."""
    user = await get_user_from_clerk(clerk_user, session)
    settings_service = SettingsService(session)

    settings = await settings_service.get_or_create(user)
    updated = await settings_service.update(
        settings,
        UserSettingsUpdate(onboarding_completed=True),
    )

    return build_settings_response(updated, settings_service)


# ---------------------------------------------------------------------------
# MCP Bridge Token (for TC Connector / OpenClaw integration)
# ---------------------------------------------------------------------------

@router.post(
    "/mcp-token",
    summary="Generate MCP bridge token",
    description="Generate a new MCP bridge token for TC Connector authentication. "
                "Replaces any existing token.",
)
async def generate_mcp_token(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Generate a new MCP bridge token. The token is only shown once."""
    user = await get_user_from_clerk(clerk_user, session)

    # Generate a cryptographically secure token
    token = f"tc_{secrets.token_urlsafe(48)}"
    user.mcp_bridge_token = token
    await session.commit()

    return {
        "token": token,
        "message": "Token generated. Copy it now — it won't be shown again.",
    }


@router.get(
    "/mcp-token",
    summary="Check MCP token status",
    description="Check if an MCP bridge token has been generated.",
)
async def get_mcp_token_status(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Check if a token exists (does not reveal the token)."""
    user = await get_user_from_clerk(clerk_user, session)
    has_token = bool(user.mcp_bridge_token)
    return {
        "has_token": has_token,
        "token_preview": f"{user.mcp_bridge_token[:8]}...{user.mcp_bridge_token[-4:]}" if has_token else None,
    }


@router.delete(
    "/mcp-token",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke MCP bridge token",
    description="Revoke the current MCP bridge token. "
                "The TC Connector will stop working until a new token is generated.",
)
async def revoke_mcp_token(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Revoke the current MCP bridge token."""
    user = await get_user_from_clerk(clerk_user, session)
    user.mcp_bridge_token = None
    await session.commit()
    return None
