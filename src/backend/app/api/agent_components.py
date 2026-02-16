"""
Agent component management endpoints.
"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select, and_

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.middleware.redis_rate_limit import check_rate_limit_with_user
from app.models.user import User
from app.models.agent_component import AgentComponent
from app.schemas.agent_component import (
    AgentComponentCreateFromQA,
    AgentComponentResponse,
    AgentComponentUpdate,
    AgentComponentListResponse,
    GenerateAvatarRequest,
    GenerateAvatarResponse,
)
from app.services.user_service import UserService
from app.services.agent_component_service import (
    AgentComponentService,
    AgentComponentServiceError,
)
from app.services.avatar_service import avatar_service

router = APIRouter(prefix="/agent-components", tags=["Agent Components"])


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.post(
    "/create-from-qa",
    response_model=AgentComponentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create agent component from Q&A",
    description="Create a new agent component from the 3-step Q&A wizard.",
)
async def create_agent_component_from_qa(
    qa_data: AgentComponentCreateFromQA,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Create a new agent component from Q&A answers.

    The component can be used immediately in the Playground,
    but needs to be published to appear in the Langflow sidebar.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    try:
        component = await service.create_from_qa(user=user, qa_data=qa_data)
        return component
    except AgentComponentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create agent component: {str(e)}",
        )


@router.get(
    "",
    response_model=AgentComponentListResponse,
    summary="List agent components",
    description="List all agent components for the current user.",
)
async def list_agent_components(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    project_id: Optional[uuid.UUID] = None,
    page: int = 1,
    page_size: int = 20,
    active_only: bool = True,
    published_only: bool = False,
):
    """List all agent components for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    components, total = await service.list_by_user(
        user_id=user.id,
        project_id=project_id,
        page=page,
        page_size=page_size,
        active_only=active_only,
        published_only=published_only,
    )

    return AgentComponentListResponse(
        agent_components=[AgentComponentResponse.model_validate(c) for c in components],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{component_id}",
    response_model=AgentComponentResponse,
    summary="Get agent component",
    description="Get details of a specific agent component.",
)
async def get_agent_component(
    component_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific agent component by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)

    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    return component


@router.patch(
    "/{component_id}",
    response_model=AgentComponentResponse,
    summary="Update agent component",
    description="Update an existing agent component.",
)
async def update_agent_component(
    component_id: uuid.UUID,
    update_data: AgentComponentUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update an agent component's configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)

    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    try:
        updated = await service.update(component, update_data)
        return updated
    except AgentComponentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{component_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete agent component",
    description="Delete an agent component.",
)
async def delete_agent_component(
    component_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete an agent component."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)

    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    await service.delete(component)
    return None


@router.post(
    "/{component_id}/duplicate",
    response_model=AgentComponentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate agent component",
    description="Create a copy of an existing agent component.",
)
async def duplicate_agent_component(
    component_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    new_name: Optional[str] = None,
):
    """Create a duplicate of an agent component."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)

    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    duplicated = await service.duplicate(component, new_name)
    return duplicated


@router.get(
    "/{component_id}/export",
    summary="Export agent component",
    description="Export an agent component as JSON.",
)
async def export_agent_component(
    component_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Export an agent component as JSON for backup or sharing."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)

    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    return await service.export(component)


@router.post(
    "/import",
    response_model=AgentComponentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Import agent component",
    description="Import an agent component from JSON.",
)
async def import_agent_component(
    import_data: dict,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    project_id: Optional[uuid.UUID] = None,
):
    """Import an agent component from exported JSON data."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    try:
        # Handle both wrapped and unwrapped formats
        component_data = import_data.get("agent_component", import_data)

        component = await service.import_component(
            user=user,
            import_data=component_data,
            project_id=project_id,
        )
        return component
    except AgentComponentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/generate-avatar",
    response_model=GenerateAvatarResponse,
    summary="Generate avatar image",
    description="Generate an AI avatar image based on the agent description using DALL-E.",
)
async def generate_avatar(
    avatar_request: GenerateAvatarRequest,
    request: Request,
    clerk_user: CurrentUser,
):
    """
    Generate a minimalist dog avatar for the agent using OpenAI DALL-E.

    The avatar is styled as a clean Lucide-style icon with subtle
    persona-specific accessories based on the description.
    """
    # Rate limit avatar generation (expensive API calls)
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

    try:
        avatar_url = await avatar_service.generate_avatar(avatar_request.description)
        return GenerateAvatarResponse(
            avatar_url=avatar_url,
            message="Avatar generated successfully",
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate avatar: {str(e)}",
        )


@router.post(
    "/{component_id}/generate-avatar",
    response_model=AgentComponentResponse,
    summary="Generate and save avatar for component",
    description="Generate an AI avatar and save it to the agent component.",
)
async def generate_and_save_avatar(
    component_id: uuid.UUID,
    request: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Generate an avatar for an existing agent component and save it.

    Uses the component's qa_who field as the description for avatar generation.
    """
    # Rate limit avatar generation (expensive API calls)
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)

    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    try:
        # Generate avatar using the agent's name (short, produces consistent results)
        avatar_url = await avatar_service.generate_avatar(component.name)

        # Update the component with the new avatar
        update_data = AgentComponentUpdate(avatar_url=avatar_url)
        updated = await service.update(component, update_data)
        return updated
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate avatar: {str(e)}",
        )


@router.post(
    "/{component_id}/publish",
    response_model=AgentComponentResponse,
    summary="Publish agent as live agent",
    description="Publish this agent as the user's live OpenClaw agent. Unpublishes any other published agent (1-live-agent limit on Free plan).",
)
async def publish_agent(
    component_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Publish an agent component as the user's live agent."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    # Unpublish any other published agents for this user (1-live-agent limit)
    result = await session.execute(
        select(AgentComponent).where(
            and_(
                AgentComponent.user_id == user.id,
                AgentComponent.is_published == True,
                AgentComponent.id != component_id,
            )
        )
    )
    for other in result.scalars().all():
        other.is_published = False

    # Publish this agent
    component.is_published = True
    await session.commit()
    await session.refresh(component)

    return component


@router.post(
    "/{component_id}/unpublish",
    response_model=AgentComponentResponse,
    summary="Unpublish live agent",
    description="Remove this agent from being the user's live OpenClaw agent.",
)
async def unpublish_agent(
    component_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Unpublish an agent component."""
    user = await get_user_from_clerk(clerk_user, session)
    service = AgentComponentService(session)

    component = await service.get_by_id(component_id, user_id=user.id)
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent component not found.",
        )

    component.is_published = False
    await session.commit()
    await session.refresh(component)

    return component
