"""
Chat endpoints - STUB FILE

The legacy /agents/{agent_id}/chat endpoints have been deprecated.
Use /api/v1/workflows/{workflow_id}/chat/stream instead.

See:
- app/api/workflows.py for current chat implementation
- app/api/_deprecated/chat_legacy.py for archived legacy endpoints
"""
from fastapi import APIRouter

router = APIRouter(tags=["Chat (Deprecated)"])

# No active endpoints - all chat functionality moved to /workflows/{id}/chat
# This file exists only to prevent import errors in main.py
