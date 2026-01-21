"""
Database models for Teach Charlie AI.

Architecture (Post-cleanup 2026-01-15):
- AgentComponent: Reusable AI personalities created via Q&A wizard
- Workflow: Langflow flow wrappers for execution
- Conversation: Chat sessions (linked to workflows)
- Message: Individual chat messages

Removed tables (see _deprecated/ for archived models):
- agents: Replaced by agent_components + workflows
- usage_metrics: Analytics computed on-the-fly from messages
"""
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.project import Project
from app.models.user_settings import UserSettings
# Primary models for three-tab architecture
from app.models.agent_component import AgentComponent
from app.models.workflow import Workflow
from app.models.mcp_server import MCPServer
from app.models.user_file import UserFile
from app.models.knowledge_source import KnowledgeSource
from app.models.agent_preset import AgentPreset
# Billing models
from app.models.subscription import Subscription
from app.models.billing_event import BillingEvent
# Analytics models
from app.models.analytics_daily import AnalyticsDaily
# Mission/learning models
from app.models.mission import Mission
from app.models.user_mission_progress import UserMissionProgress
# Composio connections
from app.models.user_connection import UserConnection

__all__ = [
    "User",
    "Conversation",
    "Message",
    "Project",
    "UserSettings",
    # Primary models
    "AgentComponent",
    "Workflow",
    "MCPServer",
    "UserFile",
    "KnowledgeSource",
    "AgentPreset",
    # Billing models
    "Subscription",
    "BillingEvent",
    # Analytics
    "AnalyticsDaily",
    # Missions
    "Mission",
    "UserMissionProgress",
    # Composio connections
    "UserConnection",
]
