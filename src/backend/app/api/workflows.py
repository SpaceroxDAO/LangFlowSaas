"""
Workflow management endpoints.
"""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowCreateFromAgent,
    WorkflowCreateFromTemplate,
    WorkflowResponse,
    WorkflowUpdate,
    WorkflowListResponse,
    WorkflowExportResponse,
)
from app.schemas.message import ChatRequest, ChatResponse
from app.services.user_service import UserService
from app.services.workflow_service import WorkflowService, WorkflowServiceError

router = APIRouter(prefix="/workflows", tags=["Workflows"])


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.post(
    "",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow",
    description="Create a new blank workflow.",
)
async def create_workflow(
    data: WorkflowCreate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create a new workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    try:
        workflow = await service.create(user=user, data=data)
        return workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create workflow: {str(e)}",
        )


@router.post(
    "/from-agent",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow from agent",
    description="Create a quick workflow from an agent component.",
)
async def create_workflow_from_agent(
    data: WorkflowCreateFromAgent,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Create a quick workflow from an agent component.

    This creates a simple flow: ChatInput -> Agent -> ChatOutput
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    try:
        workflow = await service.create_from_agent(user=user, data=data)
        return workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/from-template",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow from template",
    description="Create a workflow from a predefined template.",
)
async def create_workflow_from_template(
    data: WorkflowCreateFromTemplate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create a workflow from a predefined template."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    try:
        workflow = await service.create_from_template(user=user, data=data)
        return workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "",
    response_model=WorkflowListResponse,
    summary="List workflows",
    description="List all workflows for the current user.",
)
async def list_workflows(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    project_id: Optional[uuid.UUID] = None,
    page: int = 1,
    page_size: int = 20,
    active_only: bool = True,
):
    """List all workflows for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflows, total = await service.list_by_user(
        user_id=user.id,
        project_id=project_id,
        page=page,
        page_size=page_size,
        active_only=active_only,
    )

    return WorkflowListResponse(
        workflows=[WorkflowResponse.model_validate(w) for w in workflows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    summary="Get workflow",
    description="Get details of a specific workflow.",
)
async def get_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific workflow by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    return workflow


@router.patch(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    summary="Update workflow",
    description="Update an existing workflow.",
)
async def update_workflow(
    workflow_id: uuid.UUID,
    update_data: WorkflowUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update a workflow's configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        updated = await service.update(workflow, update_data)
        return updated
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{workflow_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete workflow",
    description="Delete a workflow and all its data.",
)
async def delete_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete a workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    await service.delete(workflow)
    return None


@router.post(
    "/{workflow_id}/duplicate",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate workflow",
    description="Create a copy of an existing workflow.",
)
async def duplicate_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    new_name: Optional[str] = None,
):
    """Create a duplicate of a workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        duplicated = await service.duplicate(workflow, new_name)
        return duplicated
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{workflow_id}/chat",
    response_model=ChatResponse,
    summary="Chat with workflow",
    description="Send a message to a workflow and get a response.",
)
async def chat_with_workflow(
    workflow_id: uuid.UUID,
    chat_request: ChatRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Send a message to a workflow and get a response."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        response_text, conversation_id, message_id = await service.chat(
            workflow=workflow,
            user=user,
            message=chat_request.message,
            conversation_id=chat_request.conversation_id,
        )

        return ChatResponse(
            message=response_text,
            conversation_id=conversation_id,
            message_id=message_id,
        )
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/{workflow_id}/conversations",
    summary="List workflow conversations",
    description="List all conversations for a workflow.",
)
async def list_workflow_conversations(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """List all conversations for a workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    conversations = await service.get_conversations(workflow_id, user.id)

    return {
        "conversations": [
            {
                "id": str(c.id),
                "title": c.title,
                "created_at": str(c.created_at),
                "updated_at": str(c.updated_at),
            }
            for c in conversations
        ],
        "total": len(conversations),
    }


@router.get(
    "/{workflow_id}/export",
    summary="Export workflow",
    description="Export a workflow as JSON.",
)
async def export_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Export a workflow as JSON for backup or sharing."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    return await service.export(workflow)
