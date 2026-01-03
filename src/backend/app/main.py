"""
Teach Charlie AI - FastAPI Backend Application

This is the main entry point for the backend API.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.api import health_router, agents_router, chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Startup
    if settings.debug:
        # In development, create tables automatically
        # In production, use Alembic migrations
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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health_router)
app.include_router(agents_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")


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
