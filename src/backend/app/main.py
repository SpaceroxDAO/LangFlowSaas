"""
Teach Charlie AI - FastAPI Backend Application

This is the main entry point for the backend API.
"""
from contextlib import asynccontextmanager

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import create_tables
from app.api import (
    health_router,
    chat_router,
    analytics_router,
    projects_router,
    settings_router,
    agent_components_router,
    workflows_router,
    mcp_servers_router,
    avatars_router,
    langflow_router,
    files_router,
    knowledge_sources_router,
    chat_files_router,
    agent_presets_router,
    billing_router,
    dashboard_router,
    missions_router,
    embed_router,
)


async def seed_default_presets():
    """Seed default agent presets if none exist."""
    from app.database import async_session_maker
    from app.models.agent_preset import AgentPreset, DEFAULT_PRESETS
    from sqlalchemy import select
    import logging

    logger = logging.getLogger(__name__)

    async with async_session_maker() as session:
        # Check if presets already exist
        result = await session.execute(select(AgentPreset).limit(1))
        existing = result.scalar_one_or_none()

        if existing:
            logger.info("Agent presets already seeded, skipping")
            return

        # Seed default presets
        logger.info(f"Seeding {len(DEFAULT_PRESETS)} default agent presets...")
        for preset_data in DEFAULT_PRESETS:
            preset = AgentPreset(**preset_data)
            session.add(preset)

        await session.commit()
        logger.info("Default agent presets seeded successfully")


async def sync_mcp_servers():
    """Sync MCP servers to .mcp.json on startup."""
    from app.database import async_session_maker
    from app.services.mcp_server_service import MCPServerService
    import logging

    logger = logging.getLogger(__name__)

    try:
        async with async_session_maker() as session:
            mcp_service = MCPServerService(session)
            result = await mcp_service.sync_to_config()
            logger.info(f"MCP servers synced on startup: {result.synced_count} servers")
    except Exception as e:
        logger.warning(f"MCP server sync failed (non-fatal): {e}")


async def seed_default_missions():
    """Seed default missions, adding or updating as needed."""
    from app.database import async_session_maker
    from app.models.mission import Mission, DEFAULT_MISSIONS
    from sqlalchemy import select
    import logging

    logger = logging.getLogger(__name__)

    async with async_session_maker() as session:
        # Get existing missions
        result = await session.execute(select(Mission))
        existing_missions = {m.id: m for m in result.scalars().all()}

        added_count = 0
        updated_count = 0

        for mission_data in DEFAULT_MISSIONS:
            mission_id = mission_data.get("id")

            if mission_id not in existing_missions:
                # Add new mission
                mission = Mission(**mission_data)
                session.add(mission)
                added_count += 1
                logger.info(f"Adding new mission: {mission_id}")
            else:
                # Update existing mission with new fields (like ui_config, highlight, hints)
                existing = existing_missions[mission_id]
                needs_update = False

                # Check for new fields that need updating
                for field in ['ui_config', 'steps', 'component_pack']:
                    new_value = mission_data.get(field)
                    old_value = getattr(existing, field, None)
                    # Update if values differ (including when new_value is None)
                    if new_value != old_value:
                        setattr(existing, field, new_value)
                        needs_update = True
                        logger.info(f"  Field '{field}' changed: {old_value} -> {new_value}")

                if needs_update:
                    updated_count += 1
                    logger.info(f"Updated mission: {mission_id}")

        if added_count > 0 or updated_count > 0:
            await session.commit()
            logger.info(f"Missions: {added_count} added, {updated_count} updated")
        else:
            logger.info("All default missions up to date")


def init_sentry():
    """Initialize Sentry error monitoring if configured."""
    import logging
    logger = logging.getLogger(__name__)

    if not settings.sentry_dsn:
        logger.info("Sentry DSN not configured, error monitoring disabled")
        return

    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.sentry_environment,
            traces_sample_rate=settings.sentry_traces_sample_rate,
            integrations=[
                FastApiIntegration(transaction_style="url"),
                SqlalchemyIntegration(),
            ],
            # Don't send PII
            send_default_pii=False,
        )
        logger.info(f"Sentry initialized for environment: {settings.sentry_environment}")
    except ImportError:
        logger.warning("sentry-sdk not installed, error monitoring disabled")
    except Exception as e:
        logger.warning(f"Failed to initialize Sentry: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Initialize Sentry for error monitoring (before other startup tasks)
    init_sentry()

    # Startup: Validate environment configuration
    settings.validate_startup()

    # Validate Langflow container configuration (warns if misconfigured)
    # This catches container name mismatches early at startup
    from app.services.langflow_service import LangflowService
    langflow_validator = LangflowService(session=None)  # No DB needed for validation
    langflow_validator.validate_container_config()

    # In development, create tables automatically
    # In production, use Alembic migrations
    if settings.debug:
        await create_tables()

    # Seed default presets if needed
    await seed_default_presets()

    # Seed default missions if needed
    await seed_default_missions()

    # Sync MCP servers to .mcp.json on startup
    await sync_mcp_servers()

    yield

    # Shutdown
    # Add cleanup code here if needed


# Create FastAPI application
app = FastAPI(
    title="Teach Charlie AI",
    description=(
        "Educational AI Agent Builder API. "
        "Build friendly AI agents using a simple Q&A approach."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS from environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health_router)
app.include_router(chat_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")

# New three-tab architecture routers
app.include_router(agent_components_router, prefix="/api/v1")
app.include_router(workflows_router, prefix="/api/v1")
app.include_router(mcp_servers_router, prefix="/api/v1")
app.include_router(avatars_router, prefix="/api/v1")
app.include_router(langflow_router, prefix="/api/v1")
app.include_router(files_router, prefix="/api/v1")
app.include_router(knowledge_sources_router, prefix="/api/v1")
app.include_router(chat_files_router, prefix="/api/v1")
app.include_router(agent_presets_router, prefix="/api/v1")
app.include_router(billing_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(missions_router, prefix="/api/v1")
app.include_router(embed_router, prefix="/api/v1")

# Mount static files for serving generated avatars
# Path(__file__).parent = /app/app (where main.py is located)
STATIC_DIR = Path(__file__).parent / "static" / "avatars"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static/avatars", StaticFiles(directory=str(STATIC_DIR)), name="avatars")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Teach Charlie AI",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
