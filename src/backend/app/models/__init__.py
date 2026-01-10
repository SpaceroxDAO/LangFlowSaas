"""
Database models for Teach Charlie AI.
"""
from app.models.user import User
from app.models.agent import Agent
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.project import Project
from app.models.user_settings import UserSettings
# New models for three-tab architecture
from app.models.agent_component import AgentComponent
from app.models.workflow import Workflow
from app.models.mcp_server import MCPServer
from app.models.user_file import UserFile
from app.models.knowledge_source import KnowledgeSource

__all__ = [
    "User",
    "Agent",
    "Conversation",
    "Message",
    "Project",
    "UserSettings",
    # New models
    "AgentComponent",
    "Workflow",
    "MCPServer",
    "UserFile",
    "KnowledgeSource",
]
