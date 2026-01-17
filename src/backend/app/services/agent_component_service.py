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
from app.services.component_generator import ComponentGenerator, ComponentGeneratorError, get_component_generator


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
        user_id: uuid.UUID,
    ) -> Optional[AgentComponent]:
        """
        Get agent component by ID, filtered by user for security.

        Args:
            component_id: AgentComponent UUID
            user_id: User UUID to ensure ownership (REQUIRED for security)

        Returns:
            AgentComponent if found and owned by user, None otherwise
        """
        component_id_str = str(component_id)
        user_id_str = str(user_id)
        stmt = select(AgentComponent).where(
            AgentComponent.id == component_id_str,
            AgentComponent.user_id == user_id_str,
        )

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def _unsafe_get_by_id(
        self,
        component_id: uuid.UUID,
    ) -> Optional[AgentComponent]:
        """
        Get agent component by ID without user filtering.

        WARNING: Only use for internal admin operations.
        """
        component_id_str = str(component_id)
        stmt = select(AgentComponent).where(AgentComponent.id == component_id_str)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_embed_token(
        self,
        embed_token: str,
    ) -> Optional[AgentComponent]:
        """
        Get agent component by embed token for public embed access.

        Args:
            embed_token: The unique embed token

        Returns:
            AgentComponent if found and embeddable, None otherwise
        """
        stmt = select(AgentComponent).where(
            AgentComponent.embed_token == embed_token,
            AgentComponent.is_embeddable == True,
            AgentComponent.is_active == True,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def chat(
        self,
        component_id: uuid.UUID,
        message: str,
        user_id: uuid.UUID,
        conversation_id: Optional[str] = None,
    ) -> dict:
        """
        Simple chat with an agent component using direct LLM call.

        Used for embed widget chat.

        Args:
            component_id: AgentComponent UUID
            message: User's message
            user_id: Owner's user ID
            conversation_id: Optional conversation ID for context

        Returns:
            Dict with 'message' and 'conversation_id'
        """
        from app.config import settings
        import httpx

        # Get agent component
        component = await self._unsafe_get_by_id(component_id)
        if not component:
            raise AgentComponentServiceError("Agent component not found")

        # Simple LLM call using system prompt
        system_prompt = component.system_prompt

        # Get LLM provider settings
        config = component.advanced_config or {}
        model_provider = config.get("model_provider", "openai")
        model_name = config.get("model_name", "gpt-4o-mini")
        temperature = config.get("temperature", 0.7)

        # Generate or use conversation ID
        conv_id = conversation_id or str(uuid.uuid4())

        try:
            # Call OpenAI-compatible API
            if model_provider == "openai":
                api_key = settings.openai_api_key
                if not api_key:
                    raise AgentComponentServiceError("OpenAI API key not configured")

                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": model_name,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": message},
                            ],
                            "temperature": temperature,
                            "max_tokens": config.get("max_tokens", 1024),
                        },
                        timeout=60.0,
                    )
                    response.raise_for_status()
                    data = response.json()
                    reply = data["choices"][0]["message"]["content"]

            elif model_provider == "anthropic":
                api_key = settings.anthropic_api_key
                if not api_key:
                    raise AgentComponentServiceError("Anthropic API key not configured")

                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://api.anthropic.com/v1/messages",
                        headers={
                            "x-api-key": api_key,
                            "anthropic-version": "2023-06-01",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": model_name or "claude-3-haiku-20240307",
                            "max_tokens": config.get("max_tokens", 1024),
                            "system": system_prompt,
                            "messages": [{"role": "user", "content": message}],
                        },
                        timeout=60.0,
                    )
                    response.raise_for_status()
                    data = response.json()
                    reply = data["content"][0]["text"]

            else:
                raise AgentComponentServiceError(f"Unsupported model provider: {model_provider}")

            return {
                "message": reply,
                "conversation_id": conv_id,
            }

        except httpx.HTTPStatusError as e:
            logger.error(f"LLM API error: {e.response.text}")
            raise AgentComponentServiceError(f"LLM API error: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Chat error: {e}")
            raise AgentComponentServiceError(f"Failed to get response: {str(e)}")

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
            selected_tools=qa_data.selected_tools or [],  # Store selected tool IDs
            knowledge_source_ids=qa_data.knowledge_source_ids or [],  # Store knowledge source IDs
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

        # Handle advanced_config specially - convert Pydantic model to dict
        if "advanced_config" in data and data["advanced_config"] is not None:
            if hasattr(data["advanced_config"], "model_dump"):
                data["advanced_config"] = data["advanced_config"].model_dump()

        # If Q&A fields or tools changed, regenerate system prompt
        qa_changed = any(k in data for k in ["qa_who", "qa_rules", "qa_tricks", "selected_tools"])

        if qa_changed:
            who = data.get("qa_who", component.qa_who)
            rules = data.get("qa_rules", component.qa_rules)
            tricks = data.get("qa_tricks", component.qa_tricks)
            selected_tools = data.get("selected_tools", component.selected_tools or [])

            # Regenerate system prompt with tools
            _, system_prompt, _ = self.mapper.create_flow_from_qa(
                who=who,
                rules=rules,
                tricks=tricks,
                selected_tools=selected_tools,
                template_name="agent_base",
            )
            data["system_prompt"] = system_prompt

            # If component was published, it needs re-publishing
            if component.is_published:
                data["is_published"] = False
                component.component_file_path = None
                component.component_class_name = None
                logger.info(f"Component {component.id} needs re-publishing after Q&A update")

        # If advanced_config changed and component is published, needs re-publishing
        if "advanced_config" in data and component.is_published:
            data["is_published"] = False
            component.component_file_path = None
            component.component_class_name = None
            logger.info(f"Component {component.id} needs re-publishing after advanced_config update")

        # Apply updates
        for field, value in data.items():
            setattr(component, field, value)

        await self.session.flush()
        await self.session.refresh(component)

        return component

    async def delete(self, component: AgentComponent) -> bool:
        """Delete an agent component."""
        # If published, clean up the Python component file
        if component.component_file_path:
            try:
                generator = get_component_generator()
                generator.delete_component(component.component_file_path)
                logger.info(f"Deleted component file for {component.id}")
            except Exception as e:
                logger.warning(f"Failed to delete component file for {component.id}: {e}")

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
            avatar_url=component.avatar_url,
            qa_who=component.qa_who,
            qa_rules=component.qa_rules,
            qa_tricks=component.qa_tricks,
            selected_tools=component.selected_tools,  # Copy selected tools
            knowledge_source_ids=component.knowledge_source_ids,  # Copy knowledge sources
            system_prompt=component.system_prompt,
            advanced_config=component.advanced_config,  # Copy advanced config
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
        Publish an agent component to the Langflow sidebar.

        This generates a Python component file that mirrors Langflow's
        Agent component but with prefilled configuration from the user's
        Q&A answers. The component appears in the sidebar after Langflow restart.
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

        # Generate the Python component file
        try:
            generator = get_component_generator()

            file_path, class_name = generator.generate_component(
                component_id=str(component.id),
                user_id=str(component.user_id),
                name=component.name,
                description=component.description or f"AI Agent: {component.name}",
                system_prompt=component.system_prompt,
                advanced_config=component.advanced_config,
            )

            # Validate the generated file
            is_valid, error = generator.validate_generated_component(file_path)
            if not is_valid:
                logger.error(f"Generated component validation failed: {error}")
                # Clean up invalid file
                generator.delete_component(file_path)
                return AgentComponentPublishResponse(
                    id=component.id,
                    name=component.name,
                    is_published=False,
                    component_file_path=None,
                    needs_restart=False,
                    message=f"Failed to generate component: {error}",
                )

            # Update component record
            component.is_published = True
            component.component_file_path = file_path
            component.component_class_name = class_name

            await self.session.flush()
            await self.session.refresh(component)

            logger.info(f"Published agent component {component.id} to {file_path}")

            return AgentComponentPublishResponse(
                id=component.id,
                name=component.name,
                is_published=True,
                component_file_path=file_path,
                needs_restart=True,
                message=f"Component '{component.name}' published! Restart AI Canvas to make it available in the sidebar.",
            )

        except ComponentGeneratorError as e:
            logger.error(f"Failed to generate component for {component.id}: {e}")
            return AgentComponentPublishResponse(
                id=component.id,
                name=component.name,
                is_published=False,
                component_file_path=None,
                needs_restart=False,
                message=f"Failed to generate component: {str(e)}",
            )
        except Exception as e:
            logger.error(f"Unexpected error publishing component {component.id}: {e}")
            return AgentComponentPublishResponse(
                id=component.id,
                name=component.name,
                is_published=False,
                component_file_path=None,
                needs_restart=False,
                message=f"Unexpected error: {str(e)}",
            )

    async def unpublish(
        self,
        component: AgentComponent,
    ) -> AgentComponentPublishResponse:
        """
        Remove an agent component from Langflow sidebar.

        This deletes the Python component file and marks the component
        as unpublished. The component will be removed from the sidebar
        after Langflow restart.
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

        # Delete the component file if it exists
        if old_file_path:
            try:
                generator = get_component_generator()
                generator.delete_component(old_file_path)
            except Exception as e:
                logger.warning(f"Failed to delete component file {old_file_path}: {e}")

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
            message="Component unpublished! Restart AI Canvas to remove it from the sidebar.",
        )

    async def export(self, component: AgentComponent) -> dict:
        """Export agent component as JSON."""
        return {
            "name": component.name,
            "description": component.description,
            "icon": component.icon,
            "color": component.color,
            "avatar_url": component.avatar_url,
            "qa_who": component.qa_who,
            "qa_rules": component.qa_rules,
            "qa_tricks": component.qa_tricks,
            "selected_tools": component.selected_tools,
            "knowledge_source_ids": component.knowledge_source_ids,
            "system_prompt": component.system_prompt,
            "advanced_config": component.advanced_config,
            "version": "1.3",  # Updated version for knowledge_source_ids support
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
            avatar_url=import_data.get("avatar_url"),
            qa_who=import_data.get("qa_who", ""),
            qa_rules=import_data.get("qa_rules", ""),
            qa_tricks=import_data.get("qa_tricks", ""),
            selected_tools=import_data.get("selected_tools", []),
            knowledge_source_ids=import_data.get("knowledge_source_ids", []),
            system_prompt=import_data.get("system_prompt", ""),
            advanced_config=import_data.get("advanced_config"),
            is_published=False,
            is_active=True,
        )

        self.session.add(component)
        await self.session.flush()
        await self.session.refresh(component)

        logger.info(f"Imported agent component as {component.id} for user {user.id}")
        return component
