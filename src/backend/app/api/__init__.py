"""
API routes for Teach Charlie AI.
"""
from app.api.health import router as health_router
from app.api.agents import router as agents_router
from app.api.chat import router as chat_router
from app.api.analytics import router as analytics_router
from app.api.projects import router as projects_router
from app.api.settings import router as settings_router
from app.api.agent_components import router as agent_components_router
from app.api.workflows import router as workflows_router
from app.api.mcp_servers import router as mcp_servers_router
from app.api.avatars import router as avatars_router
from app.api.langflow import router as langflow_router
from app.api.files import router as files_router
from app.api.knowledge_sources import router as knowledge_sources_router
from app.api.chat_files import router as chat_files_router
from app.api.agent_presets import router as agent_presets_router

__all__ = [
    "health_router",
    "agents_router",
    "chat_router",
    "analytics_router",
    "projects_router",
    "settings_router",
    "agent_components_router",
    "workflows_router",
    "mcp_servers_router",
    "avatars_router",
    "langflow_router",
    "files_router",
    "knowledge_sources_router",
    "chat_files_router",
    "agent_presets_router",
]
