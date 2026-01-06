"""
Project management endpoints.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    ProjectWithAgentsResponse,
    MoveAgentRequest,
)
from app.schemas.agent import AgentResponse
from app.services.user_service import UserService
from app.services.project_service import ProjectService, ProjectServiceError
from app.services.agent_service import AgentService

router = APIRouter(prefix="/projects", tags=["Projects"])


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
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create project",
    description="Create a new project to organize agents.",
)
async def create_project(
    data: ProjectCreate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create a new project for organizing agents."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    try:
        project = await project_service.create(user=user, data=data)
        return project
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create project. Please try again. Error: {str(e)}",
        )


@router.get(
    "",
    response_model=ProjectListResponse,
    summary="List projects",
    description="List all projects for the current user.",
)
async def list_projects(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    include_archived: bool = False,
):
    """List all projects for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    # Ensure default project exists
    await project_service.get_or_create_default(user)

    projects = await project_service.list_by_user(
        user_id=user.id,
        include_archived=include_archived,
    )

    return ProjectListResponse(
        projects=[ProjectResponse.model_validate(p) for p in projects],
        total=len(projects),
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Get project",
    description="Get details of a specific project.",
)
async def get_project(
    project_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific project by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    project = await project_service.get_by_id(project_id, user_id=user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    return project


@router.get(
    "/{project_id}/agents",
    response_model=ProjectWithAgentsResponse,
    summary="Get project with agents",
    description="Get a project with all its agents.",
)
async def get_project_agents(
    project_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    active_only: bool = True,
):
    """Get all agents in a specific project."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    project = await project_service.get_by_id(
        project_id,
        user_id=user.id,
        include_agents=True,
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    agents, total = await project_service.get_agents_in_project(
        project_id=project_id,
        user_id=user.id,
        active_only=active_only,
    )

    return ProjectWithAgentsResponse(
        project=ProjectResponse.model_validate(project),
        agents=[AgentResponse.model_validate(a) for a in agents],
        agent_count=total,
    )


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Update project",
    description="Update an existing project.",
)
async def update_project(
    project_id: uuid.UUID,
    update_data: ProjectUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update a project's configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    project = await project_service.get_by_id(project_id, user_id=user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    try:
        updated = await project_service.update(project, update_data)
        return updated
    except ProjectServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Archive project",
    description="Archive a project (soft delete). Agents are preserved.",
)
async def archive_project(
    project_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Archive a project. Agents are moved to the default project."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    project = await project_service.get_by_id(project_id, user_id=user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    try:
        await project_service.archive(project)
        return None
    except ProjectServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{project_id}/agents/{agent_id}/move",
    response_model=AgentResponse,
    summary="Move agent to project",
    description="Move an agent to a different project.",
)
async def move_agent_to_project(
    project_id: uuid.UUID,
    agent_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Move an agent to a different project."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)
    agent_service = AgentService(session)

    # Verify target project exists and belongs to user
    target_project = await project_service.get_by_id(project_id, user_id=user.id)
    if not target_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target project not found.",
        )

    # Verify agent exists and belongs to user
    agent = await agent_service.get_by_id(agent_id, user_id=user.id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found.",
        )

    # Move the agent
    updated_agent = await project_service.move_agent(agent, target_project)
    return updated_agent


@router.post(
    "/{project_id}/duplicate",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate project",
    description="Create a copy of a project (without agents).",
)
async def duplicate_project(
    project_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    new_name: str = None,
):
    """Duplicate a project (structure only, not agents)."""
    user = await get_user_from_clerk(clerk_user, session)
    project_service = ProjectService(session)

    project = await project_service.get_by_id(project_id, user_id=user.id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    name = new_name or f"{project.name} (Copy)"
    duplicate = await project_service.duplicate(project, name, user)
    return duplicate
