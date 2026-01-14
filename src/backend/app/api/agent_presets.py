"""
Agent Presets API endpoints.

Provides pre-built agent templates that users can start from.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionDep
from app.models.agent_preset import AgentPreset

router = APIRouter(prefix="/agent-presets", tags=["Agent Presets"])


@router.get(
    "",
    summary="List agent presets",
    description="Get all available agent presets/templates.",
)
async def list_presets(
    session: AsyncSessionDep,
    category: Optional[str] = None,
    featured_only: bool = False,
):
    """
    List all active agent presets.

    Args:
        category: Filter by category (e.g., "support", "rag", "sales")
        featured_only: Only return featured presets

    Returns:
        List of preset objects with categories
    """
    # Build query
    query = select(AgentPreset).where(AgentPreset.is_active == True)

    if category:
        query = query.where(AgentPreset.category == category)

    if featured_only:
        query = query.where(AgentPreset.is_featured == True)

    query = query.order_by(AgentPreset.sort_order, AgentPreset.name)

    # Execute
    result = await session.execute(query)
    presets = result.scalars().all()

    # Group by category
    categories_order = [
        {"id": "featured", "name": "Featured", "icon": "Star"},
        {"id": "support", "name": "Customer Support", "icon": "Headphones"},
        {"id": "rag", "name": "Document Q&A", "icon": "FileText"},
        {"id": "sales", "name": "Sales & Marketing", "icon": "TrendingUp"},
        {"id": "developer", "name": "Developer Tools", "icon": "Code"},
        {"id": "content", "name": "Content & Writing", "icon": "PenTool"},
        {"id": "analytics", "name": "Data & Analytics", "icon": "BarChart"},
        {"id": "productivity", "name": "Productivity", "icon": "Calendar"},
        {"id": "research", "name": "Research", "icon": "Search"},
        {"id": "general", "name": "General", "icon": "Bot"},
    ]

    return {
        "presets": [p.to_dict() for p in presets],
        "categories": categories_order,
        "total": len(presets),
    }


@router.get(
    "/categories",
    summary="List preset categories",
    description="Get all preset categories with counts.",
)
async def list_categories(session: AsyncSessionDep):
    """Get preset categories with counts."""
    from sqlalchemy import func

    result = await session.execute(
        select(AgentPreset.category, func.count(AgentPreset.id))
        .where(AgentPreset.is_active == True)
        .group_by(AgentPreset.category)
    )

    counts = {row[0]: row[1] for row in result.all()}

    categories = [
        {"id": "featured", "name": "Featured", "icon": "Star", "count": 0},
        {"id": "support", "name": "Customer Support", "icon": "Headphones", "count": counts.get("support", 0)},
        {"id": "rag", "name": "Document Q&A", "icon": "FileText", "count": counts.get("rag", 0)},
        {"id": "sales", "name": "Sales & Marketing", "icon": "TrendingUp", "count": counts.get("sales", 0)},
        {"id": "developer", "name": "Developer Tools", "icon": "Code", "count": counts.get("developer", 0)},
        {"id": "content", "name": "Content & Writing", "icon": "PenTool", "count": counts.get("content", 0)},
        {"id": "analytics", "name": "Data & Analytics", "icon": "BarChart", "count": counts.get("analytics", 0)},
        {"id": "productivity", "name": "Productivity", "icon": "Calendar", "count": counts.get("productivity", 0)},
        {"id": "research", "name": "Research", "icon": "Search", "count": counts.get("research", 0)},
        {"id": "general", "name": "General", "icon": "Bot", "count": counts.get("general", 0)},
    ]

    # Count featured
    featured_result = await session.execute(
        select(func.count(AgentPreset.id))
        .where(AgentPreset.is_active == True, AgentPreset.is_featured == True)
    )
    categories[0]["count"] = featured_result.scalar() or 0

    return {"categories": categories}


@router.get(
    "/{preset_id}",
    summary="Get preset details",
    description="Get full details of a specific preset.",
)
async def get_preset(
    preset_id: str,
    session: AsyncSessionDep,
):
    """Get a specific preset by ID."""
    result = await session.execute(
        select(AgentPreset).where(
            AgentPreset.id == preset_id,
            AgentPreset.is_active == True,
        )
    )
    preset = result.scalar_one_or_none()

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preset not found.",
        )

    return preset.to_dict()


@router.get(
    "/featured/list",
    summary="Get featured presets",
    description="Get featured presets for the onboarding wizard.",
)
async def get_featured_presets(session: AsyncSessionDep):
    """Get featured presets for display in the agent creation wizard."""
    result = await session.execute(
        select(AgentPreset)
        .where(AgentPreset.is_active == True, AgentPreset.is_featured == True)
        .order_by(AgentPreset.sort_order)
        .limit(6)
    )
    presets = result.scalars().all()

    return {
        "presets": [
            {
                "id": str(p.id),
                "name": p.name,
                "description": p.description,
                "icon": p.icon,
                "gradient": p.gradient,
                "category": p.category,
            }
            for p in presets
        ]
    }
