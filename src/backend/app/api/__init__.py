"""
API routes for Teach Charlie AI.
"""
from app.api.health import router as health_router
from app.api.agents import router as agents_router
from app.api.chat import router as chat_router
from app.api.analytics import router as analytics_router
from app.api.projects import router as projects_router
from app.api.settings import router as settings_router

__all__ = [
    "health_router",
    "agents_router",
    "chat_router",
    "analytics_router",
    "projects_router",
    "settings_router",
]
