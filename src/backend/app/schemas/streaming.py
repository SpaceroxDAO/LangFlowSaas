"""
Streaming response schemas for SSE events.

Defines event types and data structures for real-time chat streaming
with agent visibility (tool calls, thinking, content blocks).
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class StreamEventType(str, Enum):
    """Types of events that can be streamed during chat."""

    # Text content events
    TEXT_DELTA = "text_delta"           # Incremental text chunk
    TEXT_COMPLETE = "text_complete"     # Final complete text

    # Agent thinking/reasoning events
    THINKING_START = "thinking_start"   # Agent starts reasoning
    THINKING_DELTA = "thinking_delta"   # Reasoning content chunk
    THINKING_END = "thinking_end"       # Reasoning complete

    # Tool/function call events
    TOOL_CALL_START = "tool_call_start" # Agent invokes a tool
    TOOL_CALL_ARGS = "tool_call_args"   # Tool arguments (may stream)
    TOOL_CALL_END = "tool_call_end"     # Tool execution complete

    # Structured content events
    CONTENT_BLOCK_START = "content_block_start"  # Start of content block
    CONTENT_BLOCK_DELTA = "content_block_delta"  # Content block chunk
    CONTENT_BLOCK_END = "content_block_end"      # Content block complete

    # Session events
    SESSION_START = "session_start"     # Session/conversation info

    # Control events
    ERROR = "error"                     # Error occurred
    DONE = "done"                       # Stream complete


class ToolCallStatus(str, Enum):
    """Status of a tool call."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ContentBlockType(str, Enum):
    """Types of structured content blocks."""
    CODE = "code"
    TABLE = "table"
    IMAGE = "image"
    FILE = "file"
    JSON = "json"
    MARKDOWN = "markdown"


class ToolCallData(BaseModel):
    """Data for a tool call event."""
    id: str = Field(..., description="Unique identifier for this tool call")
    name: str = Field(..., description="Name of the tool being called")
    input: Optional[Dict[str, Any]] = Field(default=None, description="Tool input arguments")
    output: Optional[str] = Field(default=None, description="Tool output (when completed)")
    status: ToolCallStatus = Field(default=ToolCallStatus.PENDING, description="Current status")
    error: Optional[str] = Field(default=None, description="Error message if failed")
    started_at: Optional[datetime] = Field(default=None, description="When tool started")
    completed_at: Optional[datetime] = Field(default=None, description="When tool completed")


class ThinkingData(BaseModel):
    """Data for thinking/reasoning events."""
    content: str = Field(default="", description="Thinking content")
    is_complete: bool = Field(default=False, description="Whether thinking is complete")


class ContentBlockData(BaseModel):
    """Data for a structured content block."""
    id: str = Field(..., description="Unique identifier for this block")
    type: ContentBlockType = Field(..., description="Type of content block")
    content: str = Field(default="", description="Block content")
    language: Optional[str] = Field(default=None, description="Language for code blocks")
    title: Optional[str] = Field(default=None, description="Optional title")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional metadata")


class SessionData(BaseModel):
    """Data for session start event."""
    session_id: str = Field(..., description="Session/conversation ID")
    conversation_id: Optional[str] = Field(default=None, description="Our conversation ID")
    message_id: Optional[str] = Field(default=None, description="Message ID being generated")


class ErrorData(BaseModel):
    """Data for error events."""
    code: str = Field(..., description="Error code")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Additional error details")


class StreamEvent(BaseModel):
    """
    A single event in the SSE stream.

    The `data` field contains event-specific payload based on `event` type:
    - text_delta/text_complete: {"text": "..."}
    - thinking_*: ThinkingData
    - tool_call_*: ToolCallData
    - content_block_*: ContentBlockData
    - session_start: SessionData
    - error: ErrorData
    - done: {}
    """
    event: StreamEventType = Field(..., description="Type of event")
    data: Dict[str, Any] = Field(default_factory=dict, description="Event payload")
    index: Optional[int] = Field(default=None, description="Event sequence number")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Event timestamp")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

    def to_sse(self) -> str:
        """Convert to SSE format string."""
        import json
        data_json = json.dumps({
            "event": self.event.value,
            "data": self.data,
            "index": self.index,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        })
        return f"data: {data_json}\n\n"


# Helper functions to create common events

def text_delta_event(text: str, index: int = None) -> StreamEvent:
    """Create a text delta event."""
    return StreamEvent(
        event=StreamEventType.TEXT_DELTA,
        data={"text": text},
        index=index,
    )


def text_complete_event(text: str, index: int = None) -> StreamEvent:
    """Create a text complete event."""
    return StreamEvent(
        event=StreamEventType.TEXT_COMPLETE,
        data={"text": text},
        index=index,
    )


def thinking_start_event() -> StreamEvent:
    """Create a thinking start event."""
    return StreamEvent(
        event=StreamEventType.THINKING_START,
        data={"content": "", "is_complete": False},
    )


def thinking_delta_event(content: str) -> StreamEvent:
    """Create a thinking delta event."""
    return StreamEvent(
        event=StreamEventType.THINKING_DELTA,
        data={"content": content, "is_complete": False},
    )


def thinking_end_event(full_content: str = None) -> StreamEvent:
    """Create a thinking end event."""
    return StreamEvent(
        event=StreamEventType.THINKING_END,
        data={"content": full_content or "", "is_complete": True},
    )


def tool_call_start_event(tool_id: str, tool_name: str, tool_input: Dict[str, Any] = None) -> StreamEvent:
    """Create a tool call start event."""
    return StreamEvent(
        event=StreamEventType.TOOL_CALL_START,
        data=ToolCallData(
            id=tool_id,
            name=tool_name,
            input=tool_input,
            status=ToolCallStatus.RUNNING,
            started_at=datetime.utcnow(),
        ).model_dump(),
    )


def tool_call_end_event(
    tool_id: str,
    tool_name: str,
    output: str = None,
    error: str = None
) -> StreamEvent:
    """Create a tool call end event."""
    status = ToolCallStatus.FAILED if error else ToolCallStatus.COMPLETED
    return StreamEvent(
        event=StreamEventType.TOOL_CALL_END,
        data=ToolCallData(
            id=tool_id,
            name=tool_name,
            output=output,
            error=error,
            status=status,
            completed_at=datetime.utcnow(),
        ).model_dump(),
    )


def content_block_event(
    block_id: str,
    block_type: ContentBlockType,
    content: str,
    language: str = None,
    title: str = None,
) -> StreamEvent:
    """Create a content block event."""
    return StreamEvent(
        event=StreamEventType.CONTENT_BLOCK_END,
        data=ContentBlockData(
            id=block_id,
            type=block_type,
            content=content,
            language=language,
            title=title,
        ).model_dump(),
    )


def session_start_event(
    session_id: str,
    conversation_id: str = None,
    message_id: str = None
) -> StreamEvent:
    """Create a session start event."""
    return StreamEvent(
        event=StreamEventType.SESSION_START,
        data=SessionData(
            session_id=session_id,
            conversation_id=conversation_id,
            message_id=message_id,
        ).model_dump(),
    )


def error_event(code: str, message: str, details: Dict[str, Any] = None) -> StreamEvent:
    """Create an error event."""
    return StreamEvent(
        event=StreamEventType.ERROR,
        data=ErrorData(
            code=code,
            message=message,
            details=details,
        ).model_dump(),
    )


def done_event(conversation_id: str = None, message_id: str = None) -> StreamEvent:
    """Create a done event."""
    return StreamEvent(
        event=StreamEventType.DONE,
        data={
            "conversation_id": conversation_id,
            "message_id": message_id,
        },
    )
