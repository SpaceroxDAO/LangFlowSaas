"""
WebSocket relay for OpenClaw agent communication.

Maintains a mapping of user_id -> WebSocket connection.
When the frontend sends a chat message for a published agent,
the relay forwards it to the local OpenClaw instance via WebSocket.

This is the Phase 1 foundation. The TC Connector (Phase 2) will
connect to this endpoint to receive and respond to tool calls.
"""
import logging
from typing import Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

router = APIRouter(tags=["WebSocket Relay"])

# Active WebSocket connections: user_id -> WebSocket
active_connections: Dict[str, WebSocket] = {}


@router.websocket("/ws/agent/relay")
async def agent_relay(websocket: WebSocket):
    """
    WebSocket endpoint for OpenClaw agent relay.

    Protocol:
    1. Client connects and sends auth message: {"type": "auth", "user_id": "..."}
    2. Server registers the connection for that user_id
    3. Messages are relayed bidirectionally:
       - Frontend -> relay -> local OpenClaw
       - Local OpenClaw -> relay -> frontend

    For Phase 1, this endpoint accepts connections and maintains
    the connection map. Full message relay comes in Phase 2.
    """
    await websocket.accept()

    user_id = None
    try:
        # Wait for auth message
        auth_data = await websocket.receive_json()

        if auth_data.get("type") != "auth" or not auth_data.get("user_id"):
            await websocket.send_json({
                "type": "error",
                "message": "First message must be auth with user_id",
            })
            await websocket.close(code=4001, reason="Auth required")
            return

        user_id = auth_data["user_id"]

        # Close existing connection for this user if any
        if user_id in active_connections:
            try:
                await active_connections[user_id].close(
                    code=4002, reason="Replaced by new connection"
                )
            except Exception:
                pass

        active_connections[user_id] = websocket
        logger.info(f"Agent relay connected: user={user_id}")

        await websocket.send_json({
            "type": "connected",
            "message": "Agent relay connected",
        })

        # Message loop - relay messages between frontend and local agent
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "unknown")

            if msg_type == "ping":
                await websocket.send_json({"type": "pong"})
            elif msg_type == "tool_result":
                # Phase 2: Forward tool results back to the frontend
                logger.info(f"Tool result from user={user_id}: {data.get('tool_name')}")
            else:
                logger.debug(f"Relay message from user={user_id}: type={msg_type}")

    except WebSocketDisconnect:
        logger.info(f"Agent relay disconnected: user={user_id}")
    except Exception as e:
        logger.warning(f"Agent relay error: user={user_id}, error={e}")
    finally:
        if user_id and user_id in active_connections:
            del active_connections[user_id]


def is_user_connected(user_id: str) -> bool:
    """Check if a user has an active agent relay connection."""
    return user_id in active_connections


async def send_to_agent(user_id: str, message: dict) -> bool:
    """
    Send a message to a user's connected agent.

    Returns True if message was sent, False if user is not connected.
    """
    ws = active_connections.get(user_id)
    if not ws:
        return False

    try:
        await ws.send_json(message)
        return True
    except Exception as e:
        logger.warning(f"Failed to send to agent relay: user={user_id}, error={e}")
        # Clean up dead connection
        if user_id in active_connections:
            del active_connections[user_id]
        return False
