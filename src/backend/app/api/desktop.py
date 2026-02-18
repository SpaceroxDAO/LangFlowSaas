"""
Desktop app bootstrap endpoint.

Returns everything the Teach Charlie Desktop app needs in a single call:
published agent, skill-enabled workflows, and MCP bridge token.
"""
import secrets
import logging

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, and_

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.agent_component import AgentComponent
from app.models.workflow import Workflow
from app.models.user import User
from app.services.user_service import UserService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/desktop", tags=["Desktop App"])


async def _get_user(clerk_user: CurrentUser, session: AsyncSessionDep) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(
        clerk_user=clerk_user,
        email=clerk_user.email,
    )


@router.get("/bootstrap")
async def desktop_bootstrap(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """
    Single bootstrap call for the desktop app.

    Returns the user's published agent, skill-enabled workflows,
    and MCP bridge token. Generates a token if one doesn't exist.
    """
    user = await _get_user(clerk_user, session)

    # 1. Get published agent (first one found)
    agent_result = await session.execute(
        select(AgentComponent).where(
            and_(
                AgentComponent.user_id == user.id,
                AgentComponent.is_published == True,
            )
        ).limit(1)
    )
    agent = agent_result.scalar_one_or_none()

    # 2. Get skill-enabled workflows
    skills_result = await session.execute(
        select(Workflow).where(
            and_(
                Workflow.user_id == user.id,
                Workflow.is_agent_skill == True,
                Workflow.is_active == True,
            )
        )
    )
    skills = skills_result.scalars().all()

    # 3. Get or generate MCP bridge token
    if not user.mcp_bridge_token:
        user.mcp_bridge_token = f"tc_{secrets.token_urlsafe(48)}"
        await session.commit()
        await session.refresh(user)

    # Format response
    published_agent = None
    if agent:
        published_agent = {
            "id": str(agent.id),
            "name": agent.name,
            "description": agent.description,
            "avatar_url": agent.avatar_url,
            "qa_who": agent.qa_who,
            "is_published": agent.is_published,
        }

    skill_list = []
    for s in skills:
        skill_list.append({
            "id": str(s.id),
            "name": s.name,
            "description": s.description or f"Executes the '{s.name}' workflow",
            "is_active": s.is_active,
        })

    return {
        "user": {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        "published_agent": published_agent,
        "skills": skill_list,
        "mcp_token": user.mcp_bridge_token,
    }
