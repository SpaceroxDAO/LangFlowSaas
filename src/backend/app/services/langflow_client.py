"""
Langflow API client for creating and executing flows.
"""
import json
import uuid
import logging
from datetime import datetime
from typing import Any, AsyncGenerator, Dict, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.schemas.streaming import (
    StreamEvent,
    StreamEventType,
    ToolCallStatus,
    ContentBlockType,
    text_delta_event,
    text_complete_event,
    thinking_start_event,
    thinking_delta_event,
    thinking_end_event,
    tool_call_start_event,
    tool_call_end_event,
    content_block_event,
    session_start_event,
    error_event,
    done_event,
)

logger = logging.getLogger(__name__)


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
        tweaks: Dict[str, Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Execute a flow with a message.

        Args:
            flow_id: Flow UUID
            message: User message to send
            session_id: Optional session ID for conversation continuity
            stream: Whether to stream the response
            tweaks: Optional dict of component parameter overrides.
                    Format: {"ComponentID": {"param_name": "value"}}
                    Used to inject user-specific values like entity_id at runtime.

        Returns:
            Flow execution result
        """
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        # Build payload
        payload = {
            "input_value": message,
            "input_type": "chat",
            "output_type": "chat",
            "session_id": session_id,
        }

        # Add tweaks if provided (for multi-user isolation)
        if tweaks:
            payload["tweaks"] = tweaks

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/v1/run/{flow_id}",
                headers=await self._get_headers(),
                params={"stream": str(stream).lower()},
                json=payload,
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
        tweaks: Dict[str, Dict[str, Any]] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Execute a flow with streaming response.

        Args:
            flow_id: Flow UUID
            message: User message to send
            session_id: Optional session ID for conversation continuity
            tweaks: Optional dict of component parameter overrides

        Yields:
            Text chunks as they arrive from the model
        """
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        # Build payload
        payload = {
            "input_value": message,
            "input_type": "chat",
            "output_type": "chat",
            "session_id": session_id,
        }

        if tweaks:
            payload["tweaks"] = tweaks

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/v1/run/{flow_id}",
                headers=await self._get_headers(),
                params={"stream": "true"},
                json=payload,
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

    async def run_flow_stream_enhanced(
        self,
        flow_id: str,
        message: str,
        session_id: str = None,
        tweaks: Dict[str, Dict[str, Any]] = None,
    ) -> AsyncGenerator[StreamEvent, None]:
        """
        Execute a flow with streaming response, yielding structured StreamEvent objects.

        Parses Langflow's SSE events and converts them to our StreamEvent format,
        supporting:
        - Text chunks (text_delta)
        - Tool/function calls (tool_call_start, tool_call_end)
        - Agent thinking/reasoning (thinking_start, thinking_delta, thinking_end)
        - Content blocks (code, tables, etc.)

        Args:
            flow_id: Flow UUID
            message: User message to send
            session_id: Optional session ID for conversation continuity
            tweaks: Optional dict of component parameter overrides.
                    Format: {"ComponentID": {"param_name": "value"}}
                    Used to inject user-specific values like entity_id at runtime.

        Yields:
            StreamEvent objects representing the streaming response
        """
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        # Build payload
        payload = {
            "input_value": message,
            "input_type": "chat",
            "output_type": "chat",
            "session_id": session_id,
        }

        if tweaks:
            payload["tweaks"] = tweaks

        accumulated_text = ""
        event_index = 0
        active_tool_calls: Dict[str, Dict] = {}  # Track ongoing tool calls
        is_thinking = False
        accumulated_thinking = ""

        # Yield session start event
        yield session_start_event(session_id=session_id)
        event_index += 1

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/v1/run/{flow_id}",
                    headers=await self._get_headers(),
                    params={"stream": "true"},
                    json=payload,
                ) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        yield error_event(
                            code="LANGFLOW_ERROR",
                            message=f"Failed to run flow: {error_text.decode()}",
                            details={"status_code": response.status_code},
                        )
                        return

                    # Stream response (Langflow uses NDJSON format)
                    async for line in response.aiter_lines():
                        line = line.strip()
                        if not line:
                            continue

                        # Handle SSE format if present (data: prefix)
                        if line.startswith("data: "):
                            data_str = line[6:]
                        else:
                            data_str = line

                        # Check for stream end
                        if data_str.strip() == "[DONE]":
                            break

                        try:
                            data = json.loads(data_str)
                        except json.JSONDecodeError:
                            # Plain text chunk
                            if data_str.strip():
                                accumulated_text += data_str
                                yield text_delta_event(data_str, index=event_index)
                                event_index += 1
                            continue

                        if not isinstance(data, dict):
                            continue

                        # Handle Langflow's NDJSON event format
                        # Format: {"event": "token|add_message|end", "data": {...}}
                        langflow_event = data.get("event")
                        langflow_data = data.get("data", {})

                        if langflow_event == "token":
                            # Token streaming event
                            chunk = langflow_data.get("chunk", "")
                            if chunk:
                                accumulated_text += chunk
                                yield text_delta_event(chunk, index=event_index)
                                event_index += 1
                            continue

                        if langflow_event == "end":
                            # Stream end - extract final text
                            result = langflow_data.get("result", {})
                            outputs = result.get("outputs", [])
                            if outputs:
                                for output in outputs:
                                    for out in output.get("outputs", []):
                                        msg = out.get("results", {}).get("message", {})
                                        final_text = msg.get("text", "")
                                        if final_text and not accumulated_text:
                                            accumulated_text = final_text
                            break

                        if langflow_event == "add_message":
                            # Message event - can contain content blocks
                            msg_data = langflow_data
                            if msg_data.get("sender") == "Machine":
                                content_blocks = msg_data.get("content_blocks", [])
                                for block in content_blocks:
                                    for content in block.get("contents", []):
                                        if content.get("type") == "tool":
                                            tool_name = content.get("header", {}).get("title", "Tool")
                                            tool_id = str(uuid.uuid4())
                                            yield tool_call_start_event(tool_id, tool_name, {})
                                            event_index += 1
                            continue

                        # Parse different event types from Langflow (legacy format)

                        # 1. Handle tool calls
                        if "tool_call" in data or "function_call" in data:
                            tool_data = data.get("tool_call") or data.get("function_call", {})
                            tool_id = tool_data.get("id") or str(uuid.uuid4())
                            tool_name = tool_data.get("name", "unknown")
                            tool_input = tool_data.get("arguments") or tool_data.get("input", {})

                            if isinstance(tool_input, str):
                                try:
                                    tool_input = json.loads(tool_input)
                                except json.JSONDecodeError:
                                    tool_input = {"raw": tool_input}

                            # Start or update tool call
                            if tool_id not in active_tool_calls:
                                active_tool_calls[tool_id] = {
                                    "name": tool_name,
                                    "input": tool_input,
                                }
                                yield tool_call_start_event(tool_id, tool_name, tool_input)
                                event_index += 1
                            continue

                        # 2. Handle tool call results
                        if "tool_result" in data or "function_result" in data:
                            result_data = data.get("tool_result") or data.get("function_result", {})
                            tool_id = result_data.get("id") or result_data.get("tool_call_id", "")
                            output = result_data.get("output") or result_data.get("content", "")
                            error = result_data.get("error")

                            if tool_id in active_tool_calls:
                                tool_name = active_tool_calls[tool_id]["name"]
                                yield tool_call_end_event(tool_id, tool_name, output=output, error=error)
                                del active_tool_calls[tool_id]
                                event_index += 1
                            continue

                        # 3. Handle thinking/reasoning
                        if "thinking" in data or "reasoning" in data:
                            thinking_content = data.get("thinking") or data.get("reasoning", "")

                            if not is_thinking:
                                is_thinking = True
                                yield thinking_start_event()
                                event_index += 1

                            accumulated_thinking += thinking_content
                            yield thinking_delta_event(thinking_content)
                            event_index += 1
                            continue

                        # 4. Handle thinking end
                        if data.get("thinking_complete") or data.get("reasoning_complete"):
                            if is_thinking:
                                yield thinking_end_event(accumulated_thinking)
                                is_thinking = False
                                accumulated_thinking = ""
                                event_index += 1
                            continue

                        # 5. Handle content blocks (code, tables, etc.)
                        if "content_block" in data:
                            block = data["content_block"]
                            block_id = block.get("id") or str(uuid.uuid4())
                            block_type_str = block.get("type", "text")

                            # Map to our ContentBlockType
                            try:
                                block_type = ContentBlockType(block_type_str)
                            except ValueError:
                                block_type = ContentBlockType.MARKDOWN

                            yield content_block_event(
                                block_id=block_id,
                                block_type=block_type,
                                content=block.get("content", ""),
                                language=block.get("language"),
                                title=block.get("title"),
                            )
                            event_index += 1
                            continue

                        # 6. Handle intermediate outputs from agents
                        if "intermediate_output" in data:
                            intermediate = data["intermediate_output"]
                            # Treat as content block
                            yield content_block_event(
                                block_id=str(uuid.uuid4()),
                                block_type=ContentBlockType.JSON,
                                content=json.dumps(intermediate, indent=2),
                                title="Intermediate Output",
                            )
                            event_index += 1
                            continue

                        # 7. Handle text chunks (standard case)
                        chunk = None
                        # Try different possible locations for text content
                        chunk = (
                            data.get("chunk") or
                            data.get("text") or
                            data.get("content") or
                            data.get("delta", {}).get("content") or
                            data.get("delta", {}).get("text")
                        )

                        # Also check nested message structure
                        if not chunk and "message" in data:
                            msg = data["message"]
                            if isinstance(msg, dict):
                                chunk = msg.get("text") or msg.get("content")
                            elif isinstance(msg, str):
                                chunk = msg

                        # Check for outputs structure (Langflow format)
                        if not chunk and "outputs" in data:
                            try:
                                outputs = data["outputs"]
                                if outputs and isinstance(outputs, list):
                                    first_output = outputs[0].get("outputs", [])
                                    if first_output:
                                        message_data = first_output[0].get("results", {}).get("message", {})
                                        chunk = message_data.get("text") or message_data.get("content")
                            except (KeyError, IndexError, TypeError):
                                pass

                        if chunk:
                            accumulated_text += chunk
                            yield text_delta_event(chunk, index=event_index)
                            event_index += 1

            # End any remaining thinking
            if is_thinking:
                yield thinking_end_event(accumulated_thinking)
                event_index += 1

            # Close any remaining tool calls
            for tool_id, tool_info in active_tool_calls.items():
                yield tool_call_end_event(
                    tool_id,
                    tool_info["name"],
                    error="Tool call interrupted",
                )
                event_index += 1

            # Yield final text complete event
            if accumulated_text:
                yield text_complete_event(accumulated_text, index=event_index)
                event_index += 1

            # Yield done event
            yield done_event()

        except httpx.TimeoutException:
            yield error_event(
                code="TIMEOUT",
                message="Request timed out while waiting for response",
            )
        except httpx.RequestError as e:
            yield error_event(
                code="REQUEST_ERROR",
                message=f"Request failed: {str(e)}",
            )
        except Exception as e:
            logger.exception("Unexpected error in streaming")
            yield error_event(
                code="INTERNAL_ERROR",
                message=f"An unexpected error occurred: {str(e)}",
            )

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

    async def upload_file(
        self,
        flow_id: str,
        file_name: str,
        file_content: bytes,
        mime_type: str,
    ) -> Optional[str]:
        """
        Upload a file to Langflow for use in a flow.

        Args:
            flow_id: Flow UUID to associate the file with
            file_name: Name of the file
            file_content: File content as bytes
            mime_type: MIME type of the file

        Returns:
            Langflow file ID if successful, None otherwise
        """
        import io

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            # Create file-like object
            files = {
                "file": (file_name, io.BytesIO(file_content), mime_type),
            }

            # Try uploading to Langflow's file upload endpoint
            try:
                response = await client.post(
                    f"{self.base_url}/api/v1/files/upload/{flow_id}",
                    headers={
                        "Authorization": (await self._get_headers()).get("Authorization", ""),
                    },
                    files=files,
                )

                if response.status_code in [200, 201]:
                    data = response.json()
                    return data.get("file_path") or data.get("id") or data.get("file_id")

                # Try alternative endpoint format
                response = await client.post(
                    f"{self.base_url}/api/v1/upload/{flow_id}",
                    headers={
                        "Authorization": (await self._get_headers()).get("Authorization", ""),
                    },
                    files=files,
                )

                if response.status_code in [200, 201]:
                    data = response.json()
                    return data.get("file_path") or data.get("id") or data.get("file_id")

            except Exception as e:
                raise LangflowClientError(
                    f"Failed to upload file: {str(e)}",
                    status_code=500,
                )

        return None


# Singleton instance
langflow_client = LangflowClient()
