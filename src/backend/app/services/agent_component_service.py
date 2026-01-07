"""
AgentComponent service for managing reusable AI agent components.
"""
import logging
import uuid
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.models.agent_component import AgentComponent
from app.models.user import User
from app.models.project import Project
from app.schemas.agent_component import (
    AgentComponentCreateFromQA,
    AgentComponentUpdate,
    AgentComponentPublishResponse,
)
from app.services.template_mapping import TemplateMapper, template_mapper


class AgentComponentServiceError(Exception):
    """Exception raised when agent component operations fail."""
    pass


class AgentComponentService:
    """Service for agent component CRUD operations."""

    def __init__(
        self,
        session: AsyncSession,
        mapper: TemplateMapper = None,
    ):
        self.session = session
        self.mapper = mapper or template_mapper

    async def get_by_id(
        self,
        component_id: uuid.UUID,
        user_id: uuid.UUID = None,
    ) -> Optional[AgentComponent]:
        """
        Get agent component by ID, optionally filtered by user.
        """
        component_id_str = str(component_id)
        stmt = select(AgentComponent).where(AgentComponent.id == component_id_str)

        if user_id:
            user_id_str = str(user_id)
            stmt = stmt.where(AgentComponent.user_id == user_id_str)

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        project_id: uuid.UUID = None,
        page: int = 1,
        page_size: int = 20,
        active_only: bool = True,
        published_only: bool = False,
    ) -> Tuple[List[AgentComponent], int]:
        """
        List agent components for a user with pagination.
        """
        user_id_str = str(user_id)
        stmt = select(AgentComponent).where(AgentComponent.user_id == user_id_str)

        if project_id:
            project_id_str = str(project_id)
            stmt = stmt.where(AgentComponent.project_id == project_id_str)

        if active_only:
            stmt = stmt.where(AgentComponent.is_active == True)

        if published_only:
            stmt = stmt.where(AgentComponent.is_published == True)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(AgentComponent.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        components = list(result.scalars().all())

        return components, total

    async def _get_or_create_default_project(self, user: User) -> str:
        """Get or create the user's default project."""
        stmt = select(Project).where(
            Project.user_id == str(user.id),
            Project.is_default == True,
        )
        result = await self.session.execute(stmt)
        default_project = result.scalar_one_or_none()

        if default_project:
            return str(default_project.id)

        # Create default project
        default_project = Project(
            user_id=str(user.id),
            name="My Projects",
            description="Your default project for organizing agents",
            icon="star",
            color="#7C3AED",
            is_default=True,
            sort_order=0,
        )
        self.session.add(default_project)
        await self.session.flush()
        logger.info(f"Created default project for user {user.id}")
        return str(default_project.id)

    async def create_from_qa(
        self,
        user: User,
        qa_data: AgentComponentCreateFromQA,
    ) -> AgentComponent:
        """
        Create an agent component from Q&A answers.

        This creates only the component (personality definition).
        No Langflow flow is created - that happens when a Workflow uses this component.
        """
        # Determine project_id
        project_id = None
        if qa_data.project_id:
            project_id_str = str(qa_data.project_id)
            user_id_str = str(user.id)
            stmt = select(Project).where(
                Project.id == project_id_str,
                Project.user_id == user_id_str,
            )
            result = await self.session.execute(stmt)
            project = result.scalar_one_or_none()
            if project:
                project_id = str(project.id)
            else:
                logger.warning(f"Project {qa_data.project_id} not found for user {user.id}")

        if not project_id:
            project_id = await self._get_or_create_default_project(user)

        # Generate system prompt from Q&A
        _, system_prompt, auto_name = self.mapper.create_flow_from_qa(
            who=qa_data.who,
            rules=qa_data.rules,
            tricks=qa_data.tricks,
            selected_tools=qa_data.selected_tools,
            template_name="agent_base",
        )

        # Use provided name or auto-generated
        component_name = qa_data.name or auto_name

        # Create component in database
        component = AgentComponent(
            user_id=str(user.id),
            project_id=project_id,
            name=component_name,
            description=f"Created from Q&A wizard",
            icon=qa_data.icon or "bot",
            color=qa_data.color or "#7C3AED",
            avatar_url=qa_data.avatar_url,
            qa_who=qa_data.who,
            qa_rules=qa_data.rules,
            qa_tricks=qa_data.tricks,
            system_prompt=system_prompt,
            is_published=False,  # Not published by default
            is_active=True,
        )

        self.session.add(component)
        await self.session.flush()
        await self.session.refresh(component)

        logger.info(f"Created agent component {component.id} for user {user.id}")
        return component

    async def update(
        self,
        component: AgentComponent,
        update_data: AgentComponentUpdate,
    ) -> AgentComponent:
        """Update agent component data."""
        data = update_data.model_dump(exclude_unset=True)

        # If Q&A fields changed, regenerate system prompt
        qa_changed = any(k in data for k in ["qa_who", "qa_rules", "qa_tricks"])

        if qa_changed:
            who = data.get("qa_who", component.qa_who)
            rules = data.get("qa_rules", component.qa_rules)
            tricks = data.get("qa_tricks", component.qa_tricks)

            # Regenerate system prompt
            _, system_prompt, _ = self.mapper.create_flow_from_qa(
                who=who,
                rules=rules,
                tricks=tricks,
                template_name="agent_base",
            )
            data["system_prompt"] = system_prompt

            # If component was published, it needs re-publishing
            if component.is_published:
                data["is_published"] = False
                component.component_file_path = None
                component.component_class_name = None
                logger.info(f"Component {component.id} needs re-publishing after Q&A update")

        # Apply updates
        for field, value in data.items():
            setattr(component, field, value)

        await self.session.flush()
        await self.session.refresh(component)

        return component

    async def delete(self, component: AgentComponent) -> bool:
        """Delete an agent component."""
        # If published, we should clean up the Python component file
        if component.component_file_path:
            # TODO: Delete component file and trigger Langflow restart
            logger.warning(f"Published component {component.id} deleted - may need Langflow restart")

        await self.session.delete(component)
        await self.session.flush()
        return True

    async def duplicate(
        self,
        component: AgentComponent,
        new_name: str = None,
    ) -> AgentComponent:
        """Create a duplicate of an agent component."""
        name = new_name or f"{component.name} (Copy)"

        new_component = AgentComponent(
            user_id=component.user_id,
            project_id=component.project_id,
            name=name,
            description=f"Copy of {component.name}",
            icon=component.icon,
            color=component.color,
            qa_who=component.qa_who,
            qa_rules=component.qa_rules,
            qa_tricks=component.qa_tricks,
            system_prompt=component.system_prompt,
            is_published=False,  # Copies are not published
            is_active=True,
        )

        self.session.add(new_component)
        await self.session.flush()
        await self.session.refresh(new_component)

        logger.info(f"Duplicated agent component {component.id} as {new_component.id}")
        return new_component

    async def publish(
        self,
        component: AgentComponent,
    ) -> AgentComponentPublishResponse:
        """
        Mark an agent component for publishing to Langflow sidebar.

        This marks the component as published and generates the Python
        component file. Actual publishing requires a Langflow restart.
        """
        if component.is_published:
            return AgentComponentPublishResponse(
                id=component.id,
                name=component.name,
                is_published=True,
                component_file_path=component.component_file_path,
                needs_restart=False,
                message="Component is already published.",
            )

        # Generate Python component file path and class name
        safe_name = "".join(c if c.isalnum() else "_" for c in component.name)
        class_name = f"UserAgent_{safe_name}_{str(component.id)[:8]}"
        file_path = f"custom_components/user_agents/{class_name.lower()}.py"

        component.is_published = True
        component.component_file_path = file_path
        component.component_class_name = class_name

        await self.session.flush()
        await self.session.refresh(component)

        logger.info(f"Published agent component {component.id} - needs Langflow restart")

        return AgentComponentPublishResponse(
            id=component.id,
            name=component.name,
            is_published=True,
            component_file_path=file_path,
            needs_restart=True,
            message="Component published! Restart Langflow to make it available in the sidebar.",
        )

    async def unpublish(
        self,
        component: AgentComponent,
    ) -> AgentComponentPublishResponse:
        """
        Remove an agent component from Langflow sidebar.
        """
        if not component.is_published:
            return AgentComponentPublishResponse(
                id=component.id,
                name=component.name,
                is_published=False,
                component_file_path=None,
                needs_restart=False,
                message="Component is not published.",
            )

        old_file_path = component.component_file_path

        component.is_published = False
        component.component_file_path = None
        component.component_class_name = None

        await self.session.flush()
        await self.session.refresh(component)

        logger.info(f"Unpublished agent component {component.id}")

        return AgentComponentPublishResponse(
            id=component.id,
            name=component.name,
            is_published=False,
            component_file_path=old_file_path,
            needs_restart=True,
            message="Component unpublished! Restart Langflow to remove it from the sidebar.",
        )

    async def export(self, component: AgentComponent) -> dict:
        """Export agent component as JSON."""
        return {
            "name": component.name,
            "description": component.description,
            "icon": component.icon,
            "color": component.color,
            "qa_who": component.qa_who,
            "qa_rules": component.qa_rules,
            "qa_tricks": component.qa_tricks,
            "system_prompt": component.system_prompt,
            "version": "1.0",
            "type": "agent_component",
        }

    async def import_component(
        self,
        user: User,
        import_data: dict,
        project_id: uuid.UUID = None,
    ) -> AgentComponent:
        """Import an agent component from JSON."""
        name = import_data.get("name")
        if not name:
            raise AgentComponentServiceError("Import data must include a name.")

        # Determine project
        target_project_id = None
        if project_id:
            target_project_id = str(project_id)
        else:
            target_project_id = await self._get_or_create_default_project(user)

        component = AgentComponent(
            user_id=str(user.id),
            project_id=target_project_id,
            name=f"{name} (Imported)",
            description=import_data.get("description"),
            icon=import_data.get("icon", "bot"),
            color=import_data.get("color", "#7C3AED"),
            qa_who=import_data.get("qa_who", ""),
            qa_rules=import_data.get("qa_rules", ""),
            qa_tricks=import_data.get("qa_tricks", ""),
            system_prompt=import_data.get("system_prompt", ""),
            is_published=False,
            is_active=True,
        )

        self.session.add(component)
        await self.session.flush()
        await self.session.refresh(component)

        logger.info(f"Imported agent component as {component.id} for user {user.id}")
        return component
