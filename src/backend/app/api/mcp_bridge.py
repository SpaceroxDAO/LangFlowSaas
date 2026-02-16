"""
MCP Bridge endpoint - exposes user's skill-enabled workflows as MCP-compatible tools.

This is the foundation for OpenClaw integration. The TC Connector (Phase 2)
will call these endpoints to discover and execute workflow skills.
"""
import logging
import re
import uuid

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, and_

from app.database import AsyncSessionDep
from app.models.workflow import Workflow
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mcp/bridge", tags=["MCP Bridge"])


def slugify(name: str) -> str:
    """Convert a workflow name to a safe MCP tool name."""
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return slug or "unnamed-tool"


@router.get(
    "/{user_id}/tools",
    summary="List available MCP tools",
    description="Returns all skill-enabled workflows for the user as MCP-compatible tools.",
)
async def list_tools(
    user_id: str,
    session: AsyncSessionDep,
):
    """List skill-enabled workflows as MCP tools for the given user."""
    # Verify user exists
    result = await session.execute(
        select(User).where(User.clerk_id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # Fetch all skill-enabled workflows
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


@router.post(
    "/{user_id}/tools/call",
    summary="Call an MCP tool",
    description="Execute a workflow skill via MCP tool call.",
)
async def call_tool(
    user_id: str,
    body: dict,
    session: AsyncSessionDep,
):
    """
    Execute a tool call by routing to the correct workflow.

    Expected body:
    {
        "name": "tool-name",
        "arguments": { "message": "..." }
    }
    """
    # Verify user exists
    result = await session.execute(
        select(User).where(User.clerk_id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    tool_name = body.get("name")
    arguments = body.get("arguments", {})
    message = arguments.get("message", "")

    if not tool_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tool name is required.",
        )

    # Find the matching workflow by slugified name
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

    target_workflow = None
    for wf in workflows:
        if slugify(wf.name) == tool_name:
            target_workflow = wf
            break

    if not target_workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool '{tool_name}' not found.",
        )

    # Route to workflow chat endpoint
    # In Phase 2, this will use the actual workflow execution service.
    # For now, return a placeholder indicating the bridge is working.
    logger.info(
        f"MCP bridge tool call: user={user_id}, tool={tool_name}, "
        f"workflow={target_workflow.id}"
    )

    return {
        "content": [
            {
                "type": "text",
                "text": f"[MCP Bridge] Workflow '{target_workflow.name}' received message: {message}. "
                        f"Full execution will be available when the TC Connector is installed.",
            }
        ],
        "isError": False,
    }
