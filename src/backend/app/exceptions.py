"""
Custom application exceptions.

Use these exceptions instead of raw HTTPException for standardized error handling.
The global exception handler will convert these to proper ErrorResponse format.
"""
from typing import Optional, List, Dict, Any

from app.schemas.error import ErrorCode, ErrorDetail, FRIENDLY_MESSAGES


class AppException(Exception):
    """
    Base exception for all application errors.

    Subclass this for specific error types. The global exception handler
    will convert these to standardized ErrorResponse format.
    """

    def __init__(
        self,
        error: str,
        message: Optional[str] = None,
        status_code: int = 500,
        details: Optional[List[ErrorDetail]] = None,
    ):
        self.error = error
        self.message = message or FRIENDLY_MESSAGES.get(error, "An error occurred.")
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


class NotFoundError(AppException):
    """Resource not found (404)."""

    def __init__(self, resource: str = "Resource", message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.NOT_FOUND,
            message=message or f"{resource} not found",
            status_code=404,
        )


class ValidationError(AppException):
    """Request validation failed (400)."""

    def __init__(
        self,
        message: str = "Invalid request data",
        details: Optional[List[ErrorDetail]] = None,
        field_errors: Optional[Dict[str, str]] = None,
    ):
        # Convert field_errors dict to ErrorDetail list
        if field_errors and not details:
            details = [
                ErrorDetail(field=field, message=msg, code=ErrorCode.INVALID_VALUE)
                for field, msg in field_errors.items()
            ]

        super().__init__(
            error=ErrorCode.VALIDATION_ERROR,
            message=message,
            status_code=400,
            details=details,
        )


class UnauthorizedError(AppException):
    """Authentication required (401)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.UNAUTHORIZED,
            message=message,
            status_code=401,
        )


class ForbiddenError(AppException):
    """Access denied (403)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.FORBIDDEN,
            message=message,
            status_code=403,
        )


class ConflictError(AppException):
    """Resource conflict (409)."""

    def __init__(self, message: str = "This resource already exists"):
        super().__init__(
            error=ErrorCode.CONFLICT,
            message=message,
            status_code=409,
        )


class RateLimitError(AppException):
    """Rate limit exceeded (429)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.RATE_LIMITED,
            message=message,
            status_code=429,
        )


class QuotaExceededError(AppException):
    """Quota/limit exceeded (402)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.QUOTA_EXCEEDED,
            message=message,
            status_code=402,
        )


class InsufficientCreditsError(AppException):
    """Not enough credits (402)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.INSUFFICIENT_CREDITS,
            message=message or "You don't have enough credits for this action.",
            status_code=402,
        )


class LangflowError(AppException):
    """Langflow service error (502)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.LANGFLOW_ERROR,
            message=message,
            status_code=502,
        )


class ExternalServiceError(AppException):
    """External service error (502)."""

    def __init__(self, service: str = "external service", message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.EXTERNAL_SERVICE_ERROR,
            message=message or f"Failed to connect to {service}. Please try again.",
            status_code=502,
        )


class TimeoutError(AppException):
    """Request timeout (504)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.TIMEOUT,
            message=message,
            status_code=504,
        )


class InternalError(AppException):
    """Internal server error (500)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.INTERNAL_ERROR,
            message=message,
            status_code=500,
        )


class ServiceUnavailableError(AppException):
    """Service temporarily unavailable (503)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.SERVICE_UNAVAILABLE,
            message=message,
            status_code=503,
        )


class DatabaseError(AppException):
    """Database operation failed (500)."""

    def __init__(self, message: Optional[str] = None):
        super().__init__(
            error=ErrorCode.DATABASE_ERROR,
            message=message,
            status_code=500,
        )
