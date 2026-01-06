"""
Agent management endpoints.
"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.agent import (
    AgentCreateFromQA,
    AgentResponse,
    AgentUpdate,
    AgentListResponse,
)
from app.services.user_service import UserService
from app.services.agent_service import AgentService, AgentServiceError

router = APIRouter(prefix="/agents", tags=["Agents"])


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


@router.post(
    "/create-from-qa",
    response_model=AgentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create agent from Q&A",
    description="Create a new Charlie agent from the 3-step Q&A onboarding flow.",
)
async def create_agent_from_qa(
    qa_data: AgentCreateFromQA,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Create a new agent from Q&A answers.

    This is the primary way to create agents through the onboarding flow:
    1. Who is Charlie?
    2. What are his rules?
    3. What tricks does he know?
    """
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    try:
        agent = await agent_service.create_from_qa(
            user=user,
            qa_data=qa_data,
        )
        return agent
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Charlie couldn't be created. Please try again. Error: {str(e)}",
        )


@router.get(
    "",
    response_model=AgentListResponse,
    summary="List agents",
    description="List all agents for the current user, optionally filtered by project.",
)
async def list_agents(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    project_id: Optional[uuid.UUID] = None,
    page: int = 1,
    page_size: int = 20,
    active_only: bool = True,
):
    """List all agents for the authenticated user, optionally filtered by project."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    agents, total = await agent_service.list_by_user(
        user_id=user.id,
        project_id=project_id,
        page=page,
        page_size=page_size,
        active_only=active_only,
    )

    return AgentListResponse(
        agents=[AgentResponse.model_validate(a) for a in agents],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{agent_id}",
    response_model=AgentResponse,
    summary="Get agent",
    description="Get details of a specific agent.",
)
async def get_agent(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific agent by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found. Are you sure this is your Charlie?",
        )

    return agent


@router.patch(
    "/{agent_id}",
    response_model=AgentResponse,
    summary="Update agent",
    description="Update an existing agent's configuration.",
)
async def update_agent(
    agent_id: uuid.UUID,
    update_data: AgentUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update an agent's configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found.",
        )

    try:
        updated = await agent_service.update(agent, update_data)
        return updated
    except AgentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete agent",
    description="Delete an agent and all its data.",
)
async def delete_agent(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete an agent."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found.",
        )

    await agent_service.delete(agent)
    return None


@router.get(
    "/{agent_id}/export",
    summary="Export agent",
    description="Export an agent's configuration as JSON for backup or sharing.",
)
async def export_agent(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Export an agent's full configuration as JSON."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found.",
        )

    # Return exportable agent data (excluding internal IDs)
    export_data = {
        "name": agent.name,
        "description": agent.description,
        "qa_who": agent.qa_who,
        "qa_rules": agent.qa_rules,
        "qa_tricks": agent.qa_tricks,
        "system_prompt": agent.system_prompt,
        "template_name": agent.template_name,
        "flow_data": agent.flow_data,
        "is_active": agent.is_active,
        "exported_at": str(agent.updated_at),
        "version": "1.0",
    }

    return export_data


@router.post(
    "/{agent_id}/duplicate",
    response_model=AgentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate agent",
    description="Create a copy of an existing agent.",
)
async def duplicate_agent(
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    new_name: Optional[str] = None,
):
    """Create a duplicate of an agent with a new name."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    agent = await agent_service.get_by_id(agent_id, user_id=user.id)

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charlie not found.",
        )

    try:
        duplicated = await agent_service.duplicate(
            agent=agent,
            new_name=new_name or f"{agent.name} (Copy)",
        )
        return duplicated
    except AgentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/import",
    response_model=AgentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Import agent",
    description="Import an agent from exported JSON data.",
)
async def import_agent(
    import_data: dict,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Import an agent from exported JSON data."""
    user = await get_user_from_clerk(clerk_user, session)
    agent_service = AgentService(session)

    try:
        # Handle both single agent format and wrapped format
        agent_data = import_data.get("agent", import_data)

        imported = await agent_service.import_agent(
            user=user,
            import_data=agent_data,
        )
        return imported
    except AgentServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to import agent: {str(e)}",
        )
