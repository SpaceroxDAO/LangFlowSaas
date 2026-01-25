"""
Middleware for authentication, security, and request processing.
"""
from app.middleware.clerk_auth import (
    ClerkUser,
    get_current_user,
    get_optional_user,
    require_user,
)
from app.middleware.rate_limit import check_rate_limit, rate_limiter
from app.middleware.security_headers import SecurityHeadersMiddleware

__all__ = [
    "ClerkUser",
    "get_current_user",
    "get_optional_user",
    "require_user",
    "check_rate_limit",
    "rate_limiter",
    "SecurityHeadersMiddleware",
]
