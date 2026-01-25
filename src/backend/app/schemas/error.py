"""
Standardized error response schemas.

All API errors should use these schemas for consistent error handling
across the application. This ensures:
- Frontend can reliably parse error responses
- Error messages are user-friendly (not exposing internals)
- Debug information is only included in development
"""
from typing import Optional, List
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """
    Individual error detail for validation errors.

    Used when multiple fields have errors (e.g., form validation).
    """
    field: Optional[str] = Field(
        None,
        description="The field that caused the error (for validation errors)",
    )
    message: str = Field(
        ...,
        description="Human-readable error message",
    )
    code: Optional[str] = Field(
        None,
        description="Machine-readable error code (e.g., 'required', 'invalid_format')",
    )


class ErrorResponse(BaseModel):
    """
    Standardized error response format.

    All API errors return this structure for consistent error handling.

    Example responses:

    404 Not Found:
    {
        "error": "not_found",
        "message": "Agent not found",
        "status_code": 404
    }

    400 Validation Error:
    {
        "error": "validation_error",
        "message": "Invalid request data",
        "status_code": 400,
        "details": [
            {"field": "email", "message": "Invalid email format", "code": "invalid_format"}
        ]
    }

    500 Internal Error:
    {
        "error": "internal_error",
        "message": "Something went wrong. Please try again.",
        "status_code": 500
    }
    """
    error: str = Field(
        ...,
        description="Machine-readable error type (e.g., 'not_found', 'validation_error')",
    )
    message: str = Field(
        ...,
        description="Human-readable error message suitable for display to users",
    )
    status_code: int = Field(
        ...,
        description="HTTP status code",
    )
    details: Optional[List[ErrorDetail]] = Field(
        None,
        description="Additional error details (for validation errors)",
    )
    request_id: Optional[str] = Field(
        None,
        description="Request ID for support/debugging (if available)",
    )

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "error": "not_found",
                    "message": "Agent not found",
                    "status_code": 404,
                },
                {
                    "error": "validation_error",
                    "message": "Invalid request data",
                    "status_code": 400,
                    "details": [
                        {
                            "field": "name",
                            "message": "Name is required",
                            "code": "required",
                        }
                    ],
                },
                {
                    "error": "rate_limited",
                    "message": "Too many requests. Please try again later.",
                    "status_code": 429,
                },
            ]
        }


# Common error codes for machine-readable error handling
class ErrorCode:
    """
    Standardized error codes for the API.

    Use these constants in error responses for consistent error handling.
    """
    # Authentication & Authorization
    UNAUTHORIZED = "unauthorized"
    FORBIDDEN = "forbidden"
    TOKEN_EXPIRED = "token_expired"
    INVALID_TOKEN = "invalid_token"

    # Resource errors
    NOT_FOUND = "not_found"
    ALREADY_EXISTS = "already_exists"
    CONFLICT = "conflict"

    # Validation errors
    VALIDATION_ERROR = "validation_error"
    INVALID_FORMAT = "invalid_format"
    REQUIRED_FIELD = "required"
    INVALID_VALUE = "invalid_value"

    # Rate limiting & quotas
    RATE_LIMITED = "rate_limited"
    QUOTA_EXCEEDED = "quota_exceeded"
    INSUFFICIENT_CREDITS = "insufficient_credits"

    # External service errors
    LANGFLOW_ERROR = "langflow_error"
    EXTERNAL_SERVICE_ERROR = "external_service_error"
    TIMEOUT = "timeout"

    # Internal errors
    INTERNAL_ERROR = "internal_error"
    SERVICE_UNAVAILABLE = "service_unavailable"
    DATABASE_ERROR = "database_error"


# User-friendly error messages (not exposing internals)
FRIENDLY_MESSAGES = {
    ErrorCode.UNAUTHORIZED: "Please sign in to continue.",
    ErrorCode.FORBIDDEN: "You don't have permission to do that.",
    ErrorCode.NOT_FOUND: "The requested item was not found.",
    ErrorCode.ALREADY_EXISTS: "This item already exists.",
    ErrorCode.VALIDATION_ERROR: "Please check your input and try again.",
    ErrorCode.RATE_LIMITED: "You're doing that too fast. Please wait a moment.",
    ErrorCode.QUOTA_EXCEEDED: "You've reached your usage limit.",
    ErrorCode.INSUFFICIENT_CREDITS: "You don't have enough credits for this action.",
    ErrorCode.LANGFLOW_ERROR: "There was a problem with the AI service. Please try again.",
    ErrorCode.EXTERNAL_SERVICE_ERROR: "An external service is unavailable. Please try again.",
    ErrorCode.TIMEOUT: "The request took too long. Please try again.",
    ErrorCode.INTERNAL_ERROR: "Something went wrong. Please try again.",
    ErrorCode.SERVICE_UNAVAILABLE: "The service is temporarily unavailable. Please try again later.",
    ErrorCode.DATABASE_ERROR: "There was a problem saving your data. Please try again.",
}
