"""
Desktop app bootstrap, setup code, and download endpoints.

- Bootstrap: returns everything the desktop app needs in a single call
- Setup code: generates a 6-digit code for desktop app pairing
- Activate: exchanges a setup code for bootstrap data (no auth required)
- Bootstrap-by-token: refreshes bootstrap data using MCP token (no Clerk)
- Download: redirects to the correct installer for the user's platform
"""
import json
import secrets
import logging
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy import select, and_

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.agent_component import AgentComponent
from app.models.workflow import Workflow
from app.models.user import User
from app.services.user_service import UserService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/desktop", tags=["Desktop App"])

# --- Download files served by nginx at /downloads/ ---
_DOWNLOAD_FILES = {
    "mac": "/downloads/TeachCharlie-0.1.0-mac-arm64.dmg",
    "mac-intel": "/downloads/TeachCharlie-0.1.0-mac-x64.dmg",
    "windows": "/downloads/TeachCharlie-0.1.0-win-x64.msi",
}


class ActivateRequest(BaseModel):
    code: str


# ---- Shared helpers ----

async def _get_user(clerk_user: CurrentUser, session: AsyncSessionDep) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(
        clerk_user=clerk_user,
        email=clerk_user.email,
    )


async def _build_bootstrap_response(session: AsyncSessionDep, user: User) -> dict:
    """Build the standard bootstrap response for a user.

    Shared by GET /bootstrap, POST /activate, and GET /bootstrap-by-token.
    """
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


async def _resolve_user_by_token(
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


# ---- Endpoints ----

@router.get("/download")
async def desktop_download(os: str = "mac"):
    """
    Redirect to the desktop app installer for the given OS.

    Query params:
      - os: "mac" (default), "mac-intel", or "windows"

    No authentication required — this is a public download link.
    """
    path = _DOWNLOAD_FILES.get(os)
    if not path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown OS: {os}. Use 'mac', 'mac-intel', or 'windows'.",
        )
    # Redirect to nginx-served static file
    return RedirectResponse(url=path, status_code=302)


@router.get("/bootstrap")
async def desktop_bootstrap(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """
    Single bootstrap call for the desktop app (requires Clerk JWT).

    Returns the user's published agent, skill-enabled workflows,
    and MCP bridge token. Generates a token if one doesn't exist.
    """
    user = await _get_user(clerk_user, session)
    return await _build_bootstrap_response(session, user)


@router.post("/setup-code")
async def generate_setup_code(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
):
    """
    Generate a 6-digit setup code for desktop app pairing.

    Requires Clerk JWT (called from the web app).
    Code expires in 10 minutes and is stored in Redis.
    """
    user = await _get_user(clerk_user, session)

    # Generate 6-digit numeric code
    code = f"{secrets.randbelow(900000) + 100000}"

    # Store in Redis with 10-min TTL
    try:
        from app.middleware.redis_rate_limit import get_redis
        redis = await get_redis()
        if redis is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Setup codes require Redis. Please try again later.",
            )
        key = f"desktop-setup:{code}"
        value = json.dumps({"user_id": str(user.id), "clerk_id": user.clerk_id})
        await redis.setex(key, 600, value)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to store setup code in Redis: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not generate setup code. Please try again.",
        )

    return {"code": code, "expires_in": 600}


@router.post("/activate")
async def activate_desktop(
    session: AsyncSessionDep,
    body: ActivateRequest,
):
    """
    Activate a desktop app using a 6-digit setup code.

    No authentication required — the code itself proves the user's identity.
    Returns the same bootstrap data as GET /bootstrap.
    The code is single-use and deleted after successful activation.
    """
    # Look up code in Redis
    try:
        from app.middleware.redis_rate_limit import get_redis
        redis = await get_redis()
        if redis is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Service temporarily unavailable.",
            )
        key = f"desktop-setup:{body.code}"
        data = await redis.get(key)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to look up setup code in Redis: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service temporarily unavailable.",
        )

    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired code. Generate a new one at app.teachcharlie.ai.",
        )

    # Delete code (one-time use)
    await redis.delete(key)

    # Look up user and return bootstrap data
    payload = json.loads(data)
    user = await session.get(User, payload["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please try generating a new code.",
        )

    return await _build_bootstrap_response(session, user)


@router.get("/bootstrap-by-token")
async def bootstrap_by_token(
    session: AsyncSessionDep,
    authorization: str = Header(...),
):
    """
    Refresh bootstrap data using an MCP bridge token.

    No Clerk JWT required — uses the MCP token from a previous activation.
    This allows the desktop app to refresh its data after initial setup.
    """
    user = await _resolve_user_by_token(session, authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked token. Please re-connect your account.",
        )
    return await _build_bootstrap_response(session, user)
