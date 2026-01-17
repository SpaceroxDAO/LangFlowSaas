"""
Missions API endpoints for guided learning system.
"""
import logging
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.services.user_service import UserService
from app.services.mission_service import MissionService, MissionServiceError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/missions", tags=["Missions"])


# =============================================================================
# Request/Response Models
# =============================================================================

class StepHighlight(BaseModel):
    """Configuration for Walk Me highlight on a step."""

    element: Optional[str] = None
    selector: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[str] = "auto"
    auto_trigger: bool = True
    allow_click: bool = True


class MissionStep(BaseModel):
    """A single step in a mission."""

    id: int
    title: str
    description: str
    type: str = "action"
    phase: Optional[str] = None
    highlight: Optional[StepHighlight] = None
    hints: Optional[List[str]] = None
    show_me_text: Optional[str] = None
    validation: Optional[Dict[str, Any]] = None


class MissionResponse(BaseModel):
    """Response model for a mission."""

    id: str
    name: str
    description: Optional[str] = None
    category: str
    difficulty: str
    estimated_minutes: int
    icon: Optional[str] = None
    steps: List[MissionStep]
    prerequisites: Optional[List[str]] = None
    outcomes: Optional[List[str]] = None
    # Canvas fields
    canvas_mode: bool = False
    template_id: Optional[str] = None
    component_pack: Optional[Dict[str, Any]] = None
    # UI Config for canvas visibility
    ui_config: Optional[Dict[str, Any]] = None


class MissionProgressResponse(BaseModel):
    """Response model for mission progress."""

    status: str
    current_step: int
    completed_steps: List[int]
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class MissionWithProgressResponse(BaseModel):
    """Mission with user's progress."""

    mission: MissionResponse
    progress: MissionProgressResponse


class MissionListResponse(BaseModel):
    """Response for mission list."""

    missions: List[MissionWithProgressResponse]
    categories: List[Dict[str, Any]]
    stats: Dict[str, Any]


class CompleteStepRequest(BaseModel):
    """Request to complete a mission step."""

    step_id: int
    artifacts: Optional[Dict[str, Any]] = None


class CanvasStartResponse(BaseModel):
    """Response when starting a mission with canvas."""

    mission_id: str
    status: str
    current_step: int
    completed_steps: List[int]
    is_completed: bool
    # Canvas data
    canvas_url: Optional[str] = None
    flow_id: Optional[str] = None
    workflow_id: Optional[str] = None  # Our workflow ID for navigation
    component_filter: Optional[str] = None


class CanvasEventRequest(BaseModel):
    """Request for canvas event validation."""

    event_type: str = Field(description="Type: node_added, node_removed, edge_created, node_configured")
    node_type: Optional[str] = None
    node_id: Optional[str] = None
    flow_state: Optional[Dict[str, Any]] = None


class CanvasEventResponse(BaseModel):
    """Response after processing a canvas event."""

    event_processed: bool
    step_completed: bool
    current_step: int


class ProgressResponse(BaseModel):
    """Response after progress update."""

    mission_id: str
    status: str
    current_step: int
    completed_steps: List[int]
    is_completed: bool


# =============================================================================
# Helper Functions
# =============================================================================

async def get_user_from_clerk(clerk_user: CurrentUser, session: AsyncSessionDep):
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


def mission_to_response(mission, progress_data: Optional[Dict] = None) -> MissionWithProgressResponse:
    """Convert mission model to response."""
    return MissionWithProgressResponse(
        mission=MissionResponse(
            id=mission.id,
            name=mission.name,
            description=mission.description,
            category=mission.category,
            difficulty=mission.difficulty,
            estimated_minutes=mission.estimated_minutes,
            icon=mission.icon,
            steps=[MissionStep(**s) for s in mission.steps],
            prerequisites=mission.prerequisites,
            outcomes=mission.outcomes,
            # Canvas fields
            canvas_mode=getattr(mission, 'canvas_mode', False),
            template_id=getattr(mission, 'template_id', None),
            component_pack=getattr(mission, 'component_pack', None),
            ui_config=getattr(mission, 'ui_config', None),
        ),
        progress=MissionProgressResponse(
            status=progress_data.get("status", "not_started") if progress_data else "not_started",
            current_step=progress_data.get("current_step", 0) if progress_data else 0,
            completed_steps=progress_data.get("completed_steps", []) if progress_data else [],
            started_at=progress_data.get("started_at") if progress_data else None,
            completed_at=progress_data.get("completed_at") if progress_data else None,
        ),
    )


# =============================================================================
# Endpoints
# =============================================================================

@router.get(
    "",
    response_model=MissionListResponse,
    summary="List all missions",
    description="Get all available missions with user progress.",
)
async def list_missions(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    category: Optional[str] = None,
) -> MissionListResponse:
    """List all missions with user's progress."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    missions_with_progress = await mission_service.get_missions_with_progress(
        user_id=str(user.id),
        category=category,
    )

    # Get stats
    stats = await mission_service.get_user_stats(str(user.id))

    # Define categories
    categories = [
        {"id": "skill_sprint", "name": "Skill Sprints", "description": "Quick focused exercises"},
        {"id": "applied_build", "name": "Applied Builds", "description": "Longer project-based missions"},
    ]

    return MissionListResponse(
        missions=[
            mission_to_response(mp["mission"], mp["progress"])
            for mp in missions_with_progress
        ],
        categories=categories,
        stats=stats,
    )


@router.get(
    "/{mission_id}",
    response_model=MissionWithProgressResponse,
    summary="Get a mission",
    description="Get details of a specific mission with progress.",
)
async def get_mission(
    mission_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> MissionWithProgressResponse:
    """Get a specific mission with progress."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    mission = await mission_service.get_mission(mission_id)
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )

    progress = await mission_service.get_progress(str(user.id), mission_id)

    progress_data = None
    if progress:
        progress_data = {
            "status": progress.status,
            "current_step": progress.current_step,
            "completed_steps": progress.completed_steps,
            "started_at": progress.started_at.isoformat() if progress.started_at else None,
            "completed_at": progress.completed_at.isoformat() if progress.completed_at else None,
        }

    return mission_to_response(mission, progress_data)


@router.post(
    "/{mission_id}/start",
    response_model=ProgressResponse,
    summary="Start a mission",
    description="Start working on a mission.",
)
async def start_mission(
    mission_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> ProgressResponse:
    """Start a mission."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    try:
        progress = await mission_service.start_mission(
            user_id=str(user.id),
            mission_id=mission_id,
        )
        await session.commit()

        return ProgressResponse(
            mission_id=mission_id,
            status=progress.status,
            current_step=progress.current_step,
            completed_steps=progress.completed_steps,
            is_completed=progress.is_completed,
        )

    except MissionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{mission_id}/complete-step",
    response_model=ProgressResponse,
    summary="Complete a step",
    description="Mark a mission step as completed.",
)
async def complete_step(
    mission_id: str,
    request: CompleteStepRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> ProgressResponse:
    """Complete a mission step."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    try:
        progress = await mission_service.complete_step(
            user_id=str(user.id),
            mission_id=mission_id,
            step_id=request.step_id,
            artifacts=request.artifacts,
        )
        await session.commit()

        return ProgressResponse(
            mission_id=mission_id,
            status=progress.status,
            current_step=progress.current_step,
            completed_steps=progress.completed_steps,
            is_completed=progress.is_completed,
        )

    except MissionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{mission_id}/reset",
    response_model=ProgressResponse,
    summary="Reset progress",
    description="Reset progress for a mission.",
)
async def reset_progress(
    mission_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> ProgressResponse:
    """Reset mission progress."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    try:
        progress = await mission_service.reset_progress(
            user_id=str(user.id),
            mission_id=mission_id,
        )
        await session.commit()

        return ProgressResponse(
            mission_id=mission_id,
            status=progress.status,
            current_step=progress.current_step,
            completed_steps=progress.completed_steps,
            is_completed=progress.is_completed,
        )

    except MissionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{mission_id}/uncomplete-step",
    response_model=ProgressResponse,
    summary="Uncomplete a step",
    description="Mark a mission step as not completed.",
)
async def uncomplete_step(
    mission_id: str,
    request: CompleteStepRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> ProgressResponse:
    """Uncomplete a mission step."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    try:
        progress = await mission_service.uncomplete_step(
            user_id=str(user.id),
            mission_id=mission_id,
            step_id=request.step_id,
        )
        await session.commit()

        return ProgressResponse(
            mission_id=mission_id,
            status=progress.status,
            current_step=progress.current_step,
            completed_steps=progress.completed_steps,
            is_completed=progress.is_completed,
        )

    except MissionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =============================================================================
# Canvas Integration Endpoints
# =============================================================================

@router.post(
    "/{mission_id}/start-canvas",
    response_model=CanvasStartResponse,
    summary="Start mission with canvas",
    description="Start a mission and prepare canvas with template and component filter.",
)
async def start_mission_with_canvas(
    mission_id: str,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> CanvasStartResponse:
    """Start a mission and return canvas configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    # Get mission details
    mission = await mission_service.get_mission(mission_id)
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found",
        )

    if not getattr(mission, 'canvas_mode', False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This mission does not use canvas mode",
        )

    try:
        # Start mission progress
        progress = await mission_service.start_mission(
            user_id=str(user.id),
            mission_id=mission_id,
        )

        # Get or create flow from template
        flow_id = await mission_service.get_or_create_mission_flow(
            user_id=str(user.id),
            mission_id=mission_id,
            template_id=getattr(mission, 'template_id', None),
        )

        await session.commit()

        # Build component filter string from component_pack
        component_filter = None
        component_pack = getattr(mission, 'component_pack', None)
        if component_pack and component_pack.get("allowed_components"):
            component_filter = ",".join(component_pack["allowed_components"])

        # Get workflow_id from progress artifacts (stored when flow is created)
        # Need to refresh progress to get the latest artifacts
        await session.refresh(progress)
        workflow_id = progress.artifacts.get("workflow_id") if progress.artifacts else None

        return CanvasStartResponse(
            mission_id=mission_id,
            status=progress.status,
            current_step=progress.current_step,
            completed_steps=progress.completed_steps,
            is_completed=progress.is_completed,
            canvas_url=f"/flow/{flow_id}" if flow_id else None,
            flow_id=flow_id,
            workflow_id=workflow_id,
            component_filter=component_filter,
        )

    except MissionServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{mission_id}/canvas-event",
    response_model=CanvasEventResponse,
    summary="Handle canvas event",
    description="Process canvas events for step auto-validation.",
)
async def handle_canvas_event(
    mission_id: str,
    request: CanvasEventRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
) -> CanvasEventResponse:
    """Handle canvas events and check if step is completed."""
    user = await get_user_from_clerk(clerk_user, session)
    mission_service = MissionService(session)

    # Get mission and progress
    mission = await mission_service.get_mission(mission_id)
    progress = await mission_service.get_progress(str(user.id), mission_id)

    if not mission or not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission or progress not found",
        )

    # Validate step based on event
    step_completed = await mission_service.validate_step_from_event(
        mission=mission,
        progress=progress,
        event_type=request.event_type,
        event_data={
            "node_type": request.node_type,
            "node_id": request.node_id,
            "flow_state": request.flow_state,
        },
    )

    if step_completed:
        await session.commit()

    return CanvasEventResponse(
        event_processed=True,
        step_completed=step_completed,
        current_step=progress.current_step,
    )
