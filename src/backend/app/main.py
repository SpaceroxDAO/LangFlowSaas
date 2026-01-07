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
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Startup: Validate environment configuration
    settings.validate_startup()

    # In development, create tables automatically
    # In production, use Alembic migrations
    if settings.debug:
        await create_tables()

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

# Mount static files for serving generated avatars
STATIC_DIR = Path(__file__).parent.parent / "static" / "avatars"
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
