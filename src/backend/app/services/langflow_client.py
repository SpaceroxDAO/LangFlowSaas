"""
Langflow API client for creating and executing flows.
"""
import json
import uuid
from typing import Any, AsyncGenerator, Dict, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings


class LangflowClientError(Exception):
    """Exception raised when Langflow API call fails."""

    def __init__(self, message: str, status_code: Optional[int] = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class LangflowClient:
    """
    Client for interacting with Langflow API.

    Handles:
    - Flow CRUD operations
    - Flow execution (chat)
    - Session management
    """

    def __init__(
        self,
        base_url: str = None,
        api_key: str = None,
        timeout: float = 60.0,
    ):
        self.base_url = (base_url or settings.langflow_api_url).rstrip("/")
        self.api_key = api_key or settings.langflow_api_key
        self.timeout = timeout
        self._access_token: Optional[str] = None

    async def _get_access_token(self) -> str:
        """Get access token from Langflow auto_login endpoint."""
        if self._access_token:
            return self._access_token

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}/api/v1/auto_login")
            if response.status_code == 200:
                data = response.json()
                self._access_token = data.get("access_token")
                return self._access_token
        return None

    async def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        # Try auto_login token first, fall back to API key
        token = await self._get_access_token()
        if token:
            headers["Authorization"] = f"Bearer {token}"
        elif self.api_key:
            headers["x-api-key"] = self.api_key
        return headers

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
    )
    async def create_flow(
        self,
        name: str,
        data: Dict[str, Any],
        description: str = "",
    ) -> str:
        """
        Create a new flow in Langflow.

        Args:
            name: Flow name
            data: Flow data (nodes, edges, viewport)
            description: Flow description

        Returns:
            Flow ID (UUID string)
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/v1/flows/",
                headers=await self._get_headers(),
                json={
                    "name": name,
                    "data": data,
                    "description": description,
                },
            )

            if response.status_code != 201 and response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to create flow: {response.text}",
                    status_code=response.status_code,
                )

            result = response.json()
            return result.get("id")

    async def get_flow(self, flow_id: str) -> Dict[str, Any]:
        """
        Get a flow by ID.

        Args:
            flow_id: Flow UUID

        Returns:
            Flow data
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{self.base_url}/api/v1/flows/{flow_id}",
                headers=await self._get_headers(),
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to get flow: {response.text}",
                    status_code=response.status_code,
                )

            return response.json()

    async def update_flow(
        self,
        flow_id: str,
        data: Dict[str, Any],
        name: str = None,
    ) -> Dict[str, Any]:
        """
        Update an existing flow.

        Args:
            flow_id: Flow UUID
            data: Updated flow data
            name: Optional new name

        Returns:
            Updated flow data
        """
        payload = {"data": data}
        if name:
            payload["name"] = name

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.patch(
                f"{self.base_url}/api/v1/flows/{flow_id}",
                headers=await self._get_headers(),
                json=payload,
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to update flow: {response.text}",
                    status_code=response.status_code,
                )

            return response.json()

    async def delete_flow(self, flow_id: str) -> bool:
        """
        Delete a flow.

        Args:
            flow_id: Flow UUID

        Returns:
            True if deleted successfully
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.delete(
                f"{self.base_url}/api/v1/flows/{flow_id}",
                headers=await self._get_headers(),
            )

            if response.status_code not in [200, 204]:
                raise LangflowClientError(
                    f"Failed to delete flow: {response.text}",
                    status_code=response.status_code,
                )

            return True

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
    )
    async def run_flow(
        self,
        flow_id: str,
        message: str,
        session_id: str = None,
        stream: bool = False,
    ) -> Dict[str, Any]:
        """
        Execute a flow with a message.

        Args:
            flow_id: Flow UUID
            message: User message to send
            session_id: Optional session ID for conversation continuity
            stream: Whether to stream the response

        Returns:
            Flow execution result
        """
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/v1/run/{flow_id}",
                headers=await self._get_headers(),
                params={"stream": str(stream).lower()},
                json={
                    "input_value": message,
                    "input_type": "chat",
                    "output_type": "chat",
                    "session_id": session_id,
                },
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to run flow: {response.text}",
                    status_code=response.status_code,
                )

            result = response.json()

            # Extract the message text from the nested response structure
            try:
                outputs = result.get("outputs", [])
                if outputs:
                    first_output = outputs[0].get("outputs", [])
                    if first_output:
                        message_data = first_output[0].get("results", {}).get("message", {})
                        return {
                            "text": message_data.get("text", ""),
                            "session_id": session_id,
                            "metadata": result,
                        }
            except (KeyError, IndexError):
                pass

            # Fallback: return raw result
            return {
                "text": str(result),
                "session_id": session_id,
                "metadata": result,
            }

    async def run_flow_stream(
        self,
        flow_id: str,
        message: str,
        session_id: str = None,
    ) -> AsyncGenerator[str, None]:
        """
        Execute a flow with streaming response.

        Args:
            flow_id: Flow UUID
            message: User message to send
            session_id: Optional session ID for conversation continuity

        Yields:
            Text chunks as they arrive from the model
        """
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/v1/run/{flow_id}",
                headers=await self._get_headers(),
                params={"stream": "true"},
                json={
                    "input_value": message,
                    "input_type": "chat",
                    "output_type": "chat",
                    "session_id": session_id,
                },
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    raise LangflowClientError(
                        f"Failed to run flow: {error_text.decode()}",
                        status_code=response.status_code,
                    )

                # Stream Server-Sent Events
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]  # Remove "data: " prefix
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            # Extract text chunk from different possible formats
                            chunk = None
                            if isinstance(data, dict):
                                # Try common SSE data formats
                                chunk = data.get("chunk") or data.get("text") or data.get("content")
                                if not chunk and "message" in data:
                                    chunk = data["message"].get("text") or data["message"].get("content")
                            if chunk:
                                yield chunk
                        except json.JSONDecodeError:
                            # If it's not JSON, it might be plain text
                            if data_str.strip():
                                yield data_str

    async def health_check(self) -> bool:
        """
        Check if Langflow is healthy.

        Returns:
            True if healthy
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/health",
                )
                return response.status_code == 200
        except Exception:
            return False

    async def get_messages(
        self,
        flow_id: str = None,
        session_id: str = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """
        Get messages from Langflow monitor API.

        Args:
            flow_id: Optional filter by flow ID
            session_id: Optional filter by session ID
            limit: Max number of messages to return
            offset: Pagination offset

        Returns:
            Messages data from Langflow
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            params = {
                "limit": limit,
                "offset": offset,
            }
            if flow_id:
                params["flow_id"] = flow_id
            if session_id:
                params["session_id"] = session_id

            response = await client.get(
                f"{self.base_url}/api/v1/monitor/messages",
                headers=await self._get_headers(),
                params=params,
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to get messages: {response.text}",
                    status_code=response.status_code,
                )

            return response.json()

    async def get_starter_templates(self) -> list:
        """
        Get Langflow's starter project templates.

        Returns:
            List of starter template flows
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{self.base_url}/api/v1/starter-projects/",
                headers=await self._get_headers(),
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to get starter templates: {response.text}",
                    status_code=response.status_code,
                )

            return response.json()

    async def get_store_components(
        self,
        skip: int = 0,
        limit: int = 20,
        tags: list = None,
        sort_by: str = None,
    ) -> Dict[str, Any]:
        """
        Get components from Langflow's community store.

        Args:
            skip: Pagination offset
            limit: Results per page
            tags: Filter by tags
            sort_by: Sort order

        Returns:
            Store components with pagination info
        """
        params = {"skip": skip, "limit": limit}
        if tags:
            params["tags"] = ",".join(tags)
        if sort_by:
            params["sort_by"] = sort_by

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{self.base_url}/api/v1/store/components/",
                headers=await self._get_headers(),
                params=params,
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to get store components: {response.text}",
                    status_code=response.status_code,
                )

            return response.json()

    async def get_store_tags(self) -> list:
        """
        Get available tags from Langflow's community store.

        Returns:
            List of tags for filtering
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{self.base_url}/api/v1/store/tags",
                headers=await self._get_headers(),
            )

            if response.status_code != 200:
                raise LangflowClientError(
                    f"Failed to get store tags: {response.text}",
                    status_code=response.status_code,
                )

            return response.json()

    async def get_message_stats(
        self,
        flow_id: str,
    ) -> Dict[str, Any]:
        """
        Get aggregated statistics for a flow's messages.

        Args:
            flow_id: Flow UUID to get stats for

        Returns:
            Dictionary with message statistics
        """
        try:
            messages_data = await self.get_messages(flow_id=flow_id, limit=1000)
            messages = messages_data if isinstance(messages_data, list) else messages_data.get("messages", [])

            if not messages:
                return {
                    "total_messages": 0,
                    "total_sessions": 0,
                    "messages_today": 0,
                    "messages_this_week": 0,
                    "average_messages_per_session": 0,
                }

            # Calculate statistics
            from datetime import datetime, timedelta

            now = datetime.utcnow()
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            week_start = today_start - timedelta(days=7)

            session_ids = set()
            messages_today = 0
            messages_this_week = 0

            for msg in messages:
                # Track unique sessions
                if msg.get("session_id"):
                    session_ids.add(msg["session_id"])

                # Parse timestamp
                timestamp_str = msg.get("timestamp") or msg.get("created_at")
                if timestamp_str:
                    try:
                        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
                        timestamp = timestamp.replace(tzinfo=None)
                        if timestamp >= today_start:
                            messages_today += 1
                        if timestamp >= week_start:
                            messages_this_week += 1
                    except (ValueError, AttributeError):
                        pass

            total_messages = len(messages)
            total_sessions = len(session_ids)

            return {
                "total_messages": total_messages,
                "total_sessions": total_sessions,
                "messages_today": messages_today,
                "messages_this_week": messages_this_week,
                "average_messages_per_session": round(total_messages / total_sessions, 1) if total_sessions > 0 else 0,
            }
        except Exception as e:
            # Return empty stats on error
            return {
                "total_messages": 0,
                "total_sessions": 0,
                "messages_today": 0,
                "messages_this_week": 0,
                "average_messages_per_session": 0,
                "error": str(e),
            }


# Singleton instance
langflow_client = LangflowClient()
