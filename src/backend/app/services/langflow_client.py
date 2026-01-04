"""
Langflow API client for creating and executing flows.
"""
import uuid
from typing import Any, Dict, Optional

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

    async def health_check(self) -> bool:
        """
        Check if Langflow is healthy.

        Returns:
            True if healthy
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/health_check",
                )
                return response.status_code == 200
        except Exception:
            return False


# Singleton instance
langflow_client = LangflowClient()
