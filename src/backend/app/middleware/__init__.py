"""
Middleware for authentication and request processing.
"""
from app.middleware.clerk_auth import (
    ClerkUser,
    get_current_user,
    get_optional_user,
    require_user,
)

__all__ = [
    "ClerkUser",
    "get_current_user",
    "get_optional_user",
    "require_user",
]
