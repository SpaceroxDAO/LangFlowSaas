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
    agents_router,
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
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
app.include_router(agents_router, prefix="/api/v1")
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
