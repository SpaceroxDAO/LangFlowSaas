"""
MCP Bridge endpoint - exposes user's skill-enabled workflows as MCP-compatible tools.

Phase 2: Real workflow execution via WorkflowService.chat(), token-based auth,
and proper MCP-formatted error responses.
"""
import asyncio
import logging
import re
import uuid

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select, and_
from typing import Optional

from app.database import AsyncSessionDep
from app.models.workflow import Workflow
from app.models.user import User
from app.services.workflow_service import WorkflowService, WorkflowServiceError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mcp/bridge", tags=["MCP Bridge"])

MCP_TOOL_TIMEOUT = 120.0  # seconds


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class MCPToolCallRequest(BaseModel):
    name: str
    arguments: dict = Field(default_factory=dict)
    workflow_id: Optional[str] = None  # Optional: override slug matching


class MCPContentBlock(BaseModel):
    type: str = "text"
    text: str


class MCPToolCallResponse(BaseModel):
    content: list[MCPContentBlock]
    isError: bool = False


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    """Convert a workflow name to a safe MCP tool name."""
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return slug or "unnamed-tool"


async def resolve_user_by_token(
    session: AsyncSessionDep,
    authorization: Optional[str],
) -> Optional[User]:
    """Resolve a user from a Bearer token (mcp_bridge_token)."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization[7:]
    if not token:
        return None
    result = await session.execute(
        select(User).where(User.mcp_bridge_token == token)
    )
    return result.scalar_one_or_none()


async def resolve_user(
    session: AsyncSessionDep,
    user_id: Optional[str] = None,
    authorization: Optional[str] = None,
) -> User:
    """
    Resolve user by token auth (preferred) or by URL user_id (legacy).
    Token auth is checked first when Authorization header is present.
    """
    # 1. Try token-based auth
    if authorization:
        user = await resolve_user_by_token(session, authorization)
        if user:
            return user

    # 2. Fall back to clerk_id from URL
    if user_id:
        result = await session.execute(
            select(User).where(User.clerk_id == user_id)
        )
        user = result.scalar_one_or_none()
        if user:
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication. Provide a valid MCP token or user ID.",
    )


# ---------------------------------------------------------------------------
# Token-authenticated endpoints (no user_id in URL)
# ---------------------------------------------------------------------------

@router.get(
    "/tools",
    summary="List MCP tools (token auth)",
    description="List available skill-enabled workflows using Bearer token auth.",
)
async def list_tools_by_token(
    session: AsyncSessionDep,
    authorization: Optional[str] = Header(None),
):
    """List skill-enabled workflows as MCP tools using token auth."""
    user = await resolve_user(session, authorization=authorization)
    return await _list_tools_for_user(session, user)


@router.post(
    "/tools/call",
    summary="Call an MCP tool (token auth)",
    description="Execute a workflow skill via MCP tool call using Bearer token auth.",
)
async def call_tool_by_token(
    body: MCPToolCallRequest,
    session: AsyncSessionDep,
    authorization: Optional[str] = Header(None),
):
    """Execute a tool call using token auth."""
    user = await resolve_user(session, authorization=authorization)
    return await _execute_tool_call(session, user, body)


# ---------------------------------------------------------------------------
# URL-based endpoints (backward compatible)
# ---------------------------------------------------------------------------

@router.get(
    "/{user_id}/tools",
    summary="List available MCP tools",
    description="Returns all skill-enabled workflows for the user as MCP-compatible tools.",
)
async def list_tools(
    user_id: str,
    session: AsyncSessionDep,
    authorization: Optional[str] = Header(None),
):
    """List skill-enabled workflows as MCP tools for the given user."""
    user = await resolve_user(session, user_id=user_id, authorization=authorization)
    return await _list_tools_for_user(session, user)


@router.post(
    "/{user_id}/tools/call",
    summary="Call an MCP tool",
    description="Execute a workflow skill via MCP tool call.",
)
async def call_tool(
    user_id: str,
    body: MCPToolCallRequest,
    session: AsyncSessionDep,
    authorization: Optional[str] = Header(None),
):
    """Execute a tool call by routing to the correct workflow."""
    user = await resolve_user(session, user_id=user_id, authorization=authorization)
    return await _execute_tool_call(session, user, body)


# ---------------------------------------------------------------------------
# Shared implementation
# ---------------------------------------------------------------------------

async def _list_tools_for_user(session: AsyncSessionDep, user: User) -> dict:
    """Fetch all skill-enabled workflows and format as MCP tools."""
    result = await session.execute(
        select(Workflow).where(
            and_(
                Workflow.user_id == user.id,
                Workflow.is_agent_skill == True,
                Workflow.is_active == True,
            )
        )
    )
    workflows = result.scalars().all()

    tools = []
    for wf in workflows:
        tools.append({
            "name": slugify(wf.name),
            "description": wf.description or f"Executes the '{wf.name}' workflow",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The input message to send to the workflow",
                    }
                },
                "required": ["message"],
            },
            "_workflow_id": str(wf.id),
        })

    return {"tools": tools}


async def _execute_tool_call(
    session: AsyncSessionDep,
    user: User,
    body: MCPToolCallRequest,
) -> dict:
    """Execute a workflow via WorkflowService.chat() and return MCP-formatted response."""
    tool_name = body.name
    message = body.arguments.get("message", "")

    if not tool_name:
        return {
            "content": [{"type": "text", "text": "Tool name is required."}],
            "isError": True,
        }

    # Find target workflow - by explicit ID or by slug match
    target_workflow = None

    if body.workflow_id:
        # Direct workflow_id override
        try:
            wf_uuid = uuid.UUID(body.workflow_id)
        except ValueError:
            return {
                "content": [{"type": "text", "text": f"Invalid workflow_id: {body.workflow_id}"}],
                "isError": True,
            }
        result = await session.execute(
            select(Workflow).where(
                and_(
                    Workflow.id == wf_uuid,
                    Workflow.user_id == user.id,
                    Workflow.is_agent_skill == True,
                    Workflow.is_active == True,
                )
            )
        )
        target_workflow = result.scalar_one_or_none()
    else:
        # Slug-based matching
        result = await session.execute(
            select(Workflow).where(
                and_(
                    Workflow.user_id == user.id,
                    Workflow.is_agent_skill == True,
                    Workflow.is_active == True,
                )
            )
        )
        workflows = result.scalars().all()
        for wf in workflows:
            if slugify(wf.name) == tool_name:
                target_workflow = wf
                break

    if not target_workflow:
        return {
            "content": [{"type": "text", "text": f"Tool '{tool_name}' not found."}],
            "isError": True,
        }

    # Execute via WorkflowService.chat()
    logger.info(
        f"MCP bridge tool call: user={user.clerk_id}, tool={tool_name}, "
        f"workflow={target_workflow.id}"
    )

    try:
        service = WorkflowService(session)
        response_text, conv_id, msg_id = await asyncio.wait_for(
            service.chat(
                workflow=target_workflow,
                user=user,
                message=message,
                conversation_id=None,  # Stateless: new conversation each call
            ),
            timeout=MCP_TOOL_TIMEOUT,
        )

        return {
            "content": [{"type": "text", "text": response_text}],
            "isError": False,
        }

    except asyncio.TimeoutError:
        logger.warning(
            f"MCP bridge timeout: tool={tool_name}, workflow={target_workflow.id}"
        )
        return {
            "content": [{"type": "text", "text": f"Tool execution timed out after {int(MCP_TOOL_TIMEOUT)} seconds."}],
            "isError": True,
        }
    except WorkflowServiceError as e:
        logger.error(f"MCP bridge workflow error: {e}")
        return {
            "content": [{"type": "text", "text": f"Workflow error: {str(e)}"}],
            "isError": True,
        }
    except Exception as e:
        logger.error(f"MCP bridge unexpected error: {e}", exc_info=True)
        return {
            "content": [{"type": "text", "text": f"Error executing tool: {str(e)}"}],
            "isError": True,
        }
