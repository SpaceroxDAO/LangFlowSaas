"""
Project service for managing projects and organizing agents.
"""
import logging
import uuid
from typing import List, Optional, Tuple

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.project import Project
from app.models.agent import Agent
from app.models.agent_component import AgentComponent
from app.models.workflow import Workflow
from app.models.mcp_server import MCPServer
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate

logger = logging.getLogger(__name__)


class ProjectServiceError(Exception):
    """Exception raised when project operations fail."""
    pass


class ProjectService:
    """Service for project CRUD operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(
        self,
        project_id: uuid.UUID,
        user_id: uuid.UUID = None,
        include_agents: bool = False,
    ) -> Optional[Project]:
        """
        Get project by ID, optionally filtered by user.

        Args:
            project_id: Project UUID
            user_id: Optional user UUID to ensure ownership
            include_agents: Whether to load agents relationship

        Returns:
            Project if found, None otherwise
        """
        project_id_str = str(project_id)
        stmt = select(Project).where(Project.id == project_id_str)

        if user_id:
            user_id_str = str(user_id)
            stmt = stmt.where(Project.user_id == user_id_str)

        if include_agents:
            stmt = stmt.options(selectinload(Project.agents))

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        include_archived: bool = False,
    ) -> List[Project]:
        """
        List all projects for a user.

        Returns:
            List of projects with agent counts
        """
        user_id_str = str(user_id)
        stmt = select(Project).where(Project.user_id == user_id_str)

        if not include_archived:
            stmt = stmt.where(Project.is_archived == False)

        stmt = stmt.order_by(Project.sort_order, Project.created_at)

        result = await self.session.execute(stmt)
        projects = list(result.scalars().all())

        # Get counts for each project
        for project in projects:
            project_id_str = str(project.id)

            # Count agents (AgentComponents)
            agent_count_stmt = select(func.count()).select_from(AgentComponent).where(
                AgentComponent.project_id == project_id_str,
            )
            agent_count_result = await self.session.execute(agent_count_stmt)
            project.agent_count = agent_count_result.scalar_one()

            # Count workflows
            workflow_count_stmt = select(func.count()).select_from(Workflow).where(
                Workflow.project_id == project_id_str,
            )
            workflow_count_result = await self.session.execute(workflow_count_stmt)
            project.workflow_count = workflow_count_result.scalar_one()

            # Count MCP servers
            mcp_count_stmt = select(func.count()).select_from(MCPServer).where(
                MCPServer.project_id == project_id_str,
            )
            mcp_count_result = await self.session.execute(mcp_count_stmt)
            project.mcp_server_count = mcp_count_result.scalar_one()

        return projects

    async def get_or_create_default(self, user: User) -> Project:
        """
        Get the user's default project, creating it if it doesn't exist.

        Args:
            user: User model instance

        Returns:
            Default project for the user
        """
        user_id_str = str(user.id)
        stmt = select(Project).where(
            Project.user_id == user_id_str,
            Project.is_default == True,
        )
        result = await self.session.execute(stmt)
        project = result.scalar_one_or_none()

        if project:
            return project

        # Create default project
        project = Project(
            user_id=user_id_str,
            name="My Projects",
            description="Your default project for organizing agents",
            icon="star",
            color="#f97316",
            is_default=True,
            sort_order=0,
        )
        self.session.add(project)
        await self.session.flush()

        logger.info(f"Created default project for user {user.id}")
        return project

    async def create(
        self,
        user: User,
        data: ProjectCreate,
    ) -> Project:
        """
        Create a new project.

        Args:
            user: User creating the project
            data: Project creation data

        Returns:
            Created project
        """
        user_id_str = str(user.id)

        # Get the next sort order
        max_order_stmt = select(func.max(Project.sort_order)).where(
            Project.user_id == user_id_str
        )
        result = await self.session.execute(max_order_stmt)
        max_order = result.scalar_one() or 0

        project = Project(
            user_id=user_id_str,
            name=data.name,
            description=data.description,
            icon=data.icon,
            color=data.color,
            is_default=False,
            sort_order=max_order + 1,
        )
        self.session.add(project)
        await self.session.flush()

        project.agent_count = 0
        logger.info(f"Created project {project.id} for user {user.id}")
        return project

    async def update(
        self,
        project: Project,
        data: ProjectUpdate,
    ) -> Project:
        """
        Update a project.

        Args:
            project: Project to update
            data: Update data

        Returns:
            Updated project
        """
        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(project, key, value)

        await self.session.flush()
        logger.info(f"Updated project {project.id}")
        return project

    async def archive(self, project: Project) -> Project:
        """
        Archive a project (soft delete).

        Args:
            project: Project to archive

        Returns:
            Archived project

        Raises:
            ProjectServiceError: If trying to archive default project
        """
        if project.is_default:
            raise ProjectServiceError("Cannot archive the default project")

        project.is_archived = True
        await self.session.flush()
        logger.info(f"Archived project {project.id}")
        return project

    async def delete(self, project: Project) -> None:
        """
        Permanently delete a project. Agents are moved to default project.

        Args:
            project: Project to delete

        Raises:
            ProjectServiceError: If trying to delete default project
        """
        if project.is_default:
            raise ProjectServiceError("Cannot delete the default project")

        # Move agents to default project
        user_id_str = str(project.user_id)
        default_stmt = select(Project).where(
            Project.user_id == user_id_str,
            Project.is_default == True,
        )
        result = await self.session.execute(default_stmt)
        default_project = result.scalar_one_or_none()

        if default_project:
            update_stmt = (
                update(Agent)
                .where(Agent.project_id == str(project.id))
                .values(project_id=str(default_project.id))
            )
            await self.session.execute(update_stmt)

        await self.session.delete(project)
        await self.session.flush()
        logger.info(f"Deleted project {project.id}")

    async def move_agent(
        self,
        agent: Agent,
        target_project: Project,
    ) -> Agent:
        """
        Move an agent to a different project.

        Args:
            agent: Agent to move
            target_project: Target project

        Returns:
            Updated agent
        """
        agent.project_id = str(target_project.id)
        await self.session.flush()
        logger.info(f"Moved agent {agent.id} to project {target_project.id}")
        return agent

    async def duplicate(
        self,
        project: Project,
        new_name: str,
        user: User,
    ) -> Project:
        """
        Duplicate a project (without agents).

        Args:
            project: Project to duplicate
            new_name: Name for the new project
            user: User creating the duplicate

        Returns:
            New project
        """
        data = ProjectCreate(
            name=new_name,
            description=project.description,
            icon=project.icon,
            color=project.color,
        )
        return await self.create(user, data)

    async def get_agents_in_project(
        self,
        project_id: uuid.UUID,
        user_id: uuid.UUID,
        active_only: bool = True,
    ) -> Tuple[List[Agent], int]:
        """
        Get all agents in a project.

        Args:
            project_id: Project UUID
            user_id: User UUID for security check
            active_only: Only return active agents

        Returns:
            Tuple of (agents list, total count)
        """
        project_id_str = str(project_id)
        user_id_str = str(user_id)

        stmt = select(Agent).where(
            Agent.project_id == project_id_str,
            Agent.user_id == user_id_str,
        )

        if active_only:
            stmt = stmt.where(Agent.is_active == True)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Get agents
        stmt = stmt.order_by(Agent.created_at.desc())
        result = await self.session.execute(stmt)
        agents = list(result.scalars().all())

        return agents, total
