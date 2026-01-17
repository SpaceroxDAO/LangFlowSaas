"""
Mission service for guided learning system.

Handles mission listing, progress tracking, and step completion.
"""
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.mission import Mission
from app.models.user_mission_progress import UserMissionProgress

logger = logging.getLogger(__name__)


class MissionServiceError(Exception):
    """Exception raised when mission operations fail."""
    pass


class MissionService:
    """Service for mission management and progress tracking."""

    def __init__(self, session: AsyncSession):
        self.session = session

    # =========================================================================
    # Mission Listing
    # =========================================================================

    async def list_missions(
        self,
        category: Optional[str] = None,
        active_only: bool = True,
    ) -> List[Mission]:
        """List all available missions."""
        stmt = select(Mission)

        if category:
            stmt = stmt.where(Mission.category == category)

        if active_only:
            stmt = stmt.where(Mission.is_active == True)

        stmt = stmt.order_by(Mission.sort_order)

        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_mission(self, mission_id: str) -> Optional[Mission]:
        """Get a single mission by ID."""
        stmt = select(Mission).where(Mission.id == mission_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_missions_with_progress(
        self,
        user_id: str,
        category: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get missions with user's progress status."""
        missions = await self.list_missions(category=category)

        # Get user's progress for all missions
        stmt = select(UserMissionProgress).where(
            UserMissionProgress.user_id == user_id
        )
        result = await self.session.execute(stmt)
        progress_records = {p.mission_id: p for p in result.scalars().all()}

        missions_with_progress = []
        for mission in missions:
            progress = progress_records.get(mission.id)
            missions_with_progress.append({
                "mission": mission,
                "progress": {
                    "status": progress.status if progress else "not_started",
                    "current_step": progress.current_step if progress else 0,
                    "completed_steps": progress.completed_steps if progress else [],
                    "started_at": progress.started_at.isoformat() if progress and progress.started_at else None,
                    "completed_at": progress.completed_at.isoformat() if progress and progress.completed_at else None,
                }
            })

        return missions_with_progress

    # =========================================================================
    # Progress Tracking
    # =========================================================================

    async def get_progress(
        self,
        user_id: str,
        mission_id: str,
    ) -> Optional[UserMissionProgress]:
        """Get user's progress for a specific mission."""
        stmt = select(UserMissionProgress).where(
            UserMissionProgress.user_id == user_id,
            UserMissionProgress.mission_id == mission_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def start_mission(
        self,
        user_id: str,
        mission_id: str,
    ) -> UserMissionProgress:
        """Start a mission for a user."""
        # Check if mission exists
        mission = await self.get_mission(mission_id)
        if not mission:
            raise MissionServiceError(f"Mission {mission_id} not found")

        # Check prerequisites
        if mission.prerequisites:
            for prereq_id in mission.prerequisites:
                prereq_progress = await self.get_progress(user_id, prereq_id)
                if not prereq_progress or prereq_progress.status != "completed":
                    raise MissionServiceError(
                        f"Complete mission {prereq_id} first"
                    )

        # Get or create progress
        progress = await self.get_progress(user_id, mission_id)

        if progress:
            if progress.status == "completed":
                raise MissionServiceError("Mission already completed")
            # Already in progress, just return
            return progress

        # Create new progress
        progress = UserMissionProgress(
            user_id=user_id,
            mission_id=mission_id,
            status="in_progress",
            current_step=0,
            completed_steps=[],
            started_at=datetime.utcnow(),
        )
        self.session.add(progress)
        await self.session.flush()
        await self.session.refresh(progress)

        logger.info(f"User {user_id} started mission {mission_id}")
        return progress

    async def complete_step(
        self,
        user_id: str,
        mission_id: str,
        step_id: int,
        artifacts: Optional[Dict[str, Any]] = None,
    ) -> UserMissionProgress:
        """Mark a step as completed."""
        progress = await self.get_progress(user_id, mission_id)

        if not progress:
            raise MissionServiceError("Mission not started")

        if progress.status == "completed":
            raise MissionServiceError("Mission already completed")

        # Get mission to check total steps
        mission = await self.get_mission(mission_id)

        # Add step to completed if not already
        if step_id not in progress.completed_steps:
            progress.completed_steps = progress.completed_steps + [step_id]

        # Update current step to next uncompleted
        # Note: next_step is an index (0-based), completed_steps contains step IDs
        total_steps = len(mission.steps)
        next_step = progress.current_step + 1
        while next_step < total_steps:
            step_id_at_index = mission.steps[next_step].get("id", next_step + 1)
            if step_id_at_index not in progress.completed_steps:
                break
            next_step += 1
        progress.current_step = min(next_step, total_steps - 1)

        # Store artifacts if provided
        if artifacts:
            existing = progress.artifacts or {}
            existing.update(artifacts)
            progress.artifacts = existing

        # Check if all steps completed
        all_step_ids = [s.get("id", i + 1) for i, s in enumerate(mission.steps)]
        if all(sid in progress.completed_steps for sid in all_step_ids):
            progress.status = "completed"
            progress.completed_at = datetime.utcnow()
            logger.info(f"User {user_id} completed mission {mission_id}")

        await self.session.flush()
        await self.session.refresh(progress)

        return progress

    async def reset_progress(
        self,
        user_id: str,
        mission_id: str,
    ) -> UserMissionProgress:
        """Reset progress for a mission."""
        progress = await self.get_progress(user_id, mission_id)

        if not progress:
            raise MissionServiceError("No progress to reset")

        progress.status = "not_started"
        progress.current_step = 0
        progress.completed_steps = []
        progress.started_at = None
        progress.completed_at = None
        progress.artifacts = None

        await self.session.flush()
        await self.session.refresh(progress)

        logger.info(f"User {user_id} reset mission {mission_id}")
        return progress

    async def uncomplete_step(
        self,
        user_id: str,
        mission_id: str,
        step_id: int,
    ) -> UserMissionProgress:
        """Mark a step as uncompleted (remove from completed_steps)."""
        progress = await self.get_progress(user_id, mission_id)

        if not progress:
            raise MissionServiceError("Mission not started")

        # Remove step from completed if present
        if step_id in progress.completed_steps:
            progress.completed_steps = [s for s in progress.completed_steps if s != step_id]

        # Get mission to find step index
        mission = await self.get_mission(mission_id)

        # Find the index of this step
        step_index = None
        for i, step in enumerate(mission.steps):
            if step.get("id", i + 1) == step_id:
                step_index = i
                break

        # Update current_step to the earliest uncompleted step
        if step_index is not None and step_index < progress.current_step:
            progress.current_step = step_index

        # Update status if was completed
        if progress.status == "completed":
            progress.status = "in_progress"
            progress.completed_at = None

        await self.session.flush()
        await self.session.refresh(progress)

        logger.info(f"User {user_id} uncompleted step {step_id} of mission {mission_id}")
        return progress

    # =========================================================================
    # Statistics
    # =========================================================================

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get user's mission statistics."""
        stmt = select(UserMissionProgress).where(
            UserMissionProgress.user_id == user_id
        )
        result = await self.session.execute(stmt)
        progress_list = list(result.scalars().all())

        completed = sum(1 for p in progress_list if p.status == "completed")
        in_progress = sum(1 for p in progress_list if p.status == "in_progress")

        # Get total missions
        total_stmt = select(func.count()).select_from(Mission).where(Mission.is_active == True)
        total_result = await self.session.execute(total_stmt)
        total = total_result.scalar_one()

        return {
            "total_missions": total,
            "completed": completed,
            "in_progress": in_progress,
            "not_started": total - completed - in_progress,
            "completion_percent": int((completed / total * 100)) if total > 0 else 0,
        }

    # =========================================================================
    # Canvas Integration
    # =========================================================================

    async def get_or_create_mission_flow(
        self,
        user_id: str,
        mission_id: str,
        template_id: Optional[str] = None,
    ) -> Optional[str]:
        """
        Get existing mission flow or create from template.

        Returns the Langflow flow ID for the mission.
        """
        from app.services.workflow_service import WorkflowService
        from app.schemas.workflow import WorkflowCreateFromTemplate
        from app.models.user import User

        # Check if user already has a flow for this mission
        progress = await self.get_progress(user_id, mission_id)
        if progress and progress.artifacts and progress.artifacts.get("flow_id"):
            existing_flow_id = progress.artifacts["flow_id"]
            logger.info(f"Using existing mission flow {existing_flow_id} for user {user_id}")
            return existing_flow_id

        # Get the User object
        from sqlalchemy import select
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            logger.error(f"User {user_id} not found")
            return None

        # Create new flow from template
        workflow_service = WorkflowService(self.session)

        # Default to agent_base template if none specified
        template_name = template_id or "agent_base"

        try:
            # Create workflow from template
            template_data = WorkflowCreateFromTemplate(
                template_name=template_name,
                name=f"Mission {mission_id}",
                description=f"Flow created for mission {mission_id}",
            )
            workflow = await workflow_service.create_from_template(
                user=user,
                data=template_data,
            )

            flow_id = workflow.langflow_flow_id

            # Store flow_id in progress artifacts
            if progress:
                progress.artifacts = progress.artifacts or {}
                progress.artifacts["flow_id"] = flow_id
                progress.artifacts["workflow_id"] = str(workflow.id)
                await self.session.flush()

            logger.info(f"Created new mission flow {flow_id} for user {user_id}, mission {mission_id}")
            return flow_id

        except Exception as e:
            logger.error(f"Failed to create mission flow: {e}")
            return None

    async def validate_step_from_event(
        self,
        mission: Mission,
        progress: UserMissionProgress,
        event_type: str,
        event_data: Dict[str, Any],
    ) -> bool:
        """
        Validate if a step is completed based on a canvas event.

        Returns True if the step was auto-completed.
        """
        # Get current step
        if progress.status == "completed":
            return False

        current_step_idx = progress.current_step
        if current_step_idx >= len(mission.steps):
            return False

        current_step = mission.steps[current_step_idx]
        step_id = current_step.get("id", current_step_idx + 1)

        # Skip if step already completed
        if step_id in progress.completed_steps:
            return False

        # Check if step has validation rules
        validation = current_step.get("validation")
        if not validation:
            # No validation rules - step requires manual completion
            return False

        # Validate based on event type and rules
        step_completed = False

        # Node addition validation
        if event_type == "node_added" and validation.get("node_type"):
            expected_type = validation["node_type"]
            actual_type = event_data.get("node_type")
            if actual_type and expected_type.lower() in actual_type.lower():
                step_completed = True
                logger.info(f"Auto-completed step {step_id}: node_type match {actual_type}")

        # Edge creation validation
        elif event_type == "edge_created" and validation.get("edge_required"):
            step_completed = True
            logger.info(f"Auto-completed step {step_id}: edge created")

        # Node configuration validation
        elif event_type == "node_configured" and validation.get("config_required"):
            step_completed = True
            logger.info(f"Auto-completed step {step_id}: node configured")

        # If step is validated, mark it complete
        if step_completed:
            # Add step to completed
            if step_id not in progress.completed_steps:
                progress.completed_steps = progress.completed_steps + [step_id]

            # Advance to next step
            total_steps = len(mission.steps)
            next_step = progress.current_step + 1
            progress.current_step = min(next_step, total_steps - 1)

            # Check if all steps completed
            all_step_ids = [s.get("id", i + 1) for i, s in enumerate(mission.steps)]
            if all(sid in progress.completed_steps for sid in all_step_ids):
                progress.status = "completed"
                progress.completed_at = datetime.utcnow()
                logger.info(f"Mission {mission.id} auto-completed for user {progress.user_id}")

            await self.session.flush()

        return step_completed
