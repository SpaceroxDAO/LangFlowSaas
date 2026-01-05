"""
Simple in-memory rate limiting for API protection.

For MVP, this uses in-memory storage. For production with multiple
backend instances, upgrade to Redis-based rate limiting.
"""
import time
from collections import defaultdict
from typing import Dict, Tuple

from fastapi import HTTPException, Request, status


class RateLimiter:
    """
    Simple sliding window rate limiter.

    Tracks request counts per user/IP within a time window.
    """

    def __init__(
        self,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
    ):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        # Track requests: {identifier: [(timestamp, count), ...]}
        self._minute_requests: Dict[str, list] = defaultdict(list)
        self._hour_requests: Dict[str, list] = defaultdict(list)

    def _clean_old_requests(
        self,
        requests: list,
        window_seconds: int,
    ) -> list:
        """Remove requests older than the time window."""
        cutoff = time.time() - window_seconds
        return [r for r in requests if r[0] > cutoff]

    def _get_identifier(self, request: Request) -> str:
        """Get unique identifier for rate limiting (user ID or IP)."""
        # Try to get user ID from request state (set by auth middleware)
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"user:{user_id}"

        # Fall back to IP address
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        return f"ip:{ip}"

    def check_rate_limit(self, request: Request) -> Tuple[bool, str]:
        """
        Check if request is within rate limits.

        Returns:
            Tuple of (is_allowed, error_message)
        """
        identifier = self._get_identifier(request)
        now = time.time()

        # Clean and check minute window
        self._minute_requests[identifier] = self._clean_old_requests(
            self._minute_requests[identifier], 60
        )
        minute_count = len(self._minute_requests[identifier])

        if minute_count >= self.requests_per_minute:
            return False, "Too many requests. Please slow down a bit!"

        # Clean and check hour window
        self._hour_requests[identifier] = self._clean_old_requests(
            self._hour_requests[identifier], 3600
        )
        hour_count = len(self._hour_requests[identifier])

        if hour_count >= self.requests_per_hour:
            return False, "You've made a lot of requests today. Take a short break!"

        # Record this request
        self._minute_requests[identifier].append((now, 1))
        self._hour_requests[identifier].append((now, 1))

        return True, ""


# Import settings for configuration
from app.config import settings

# Global rate limiter instance (uses settings for configuration)
rate_limiter = RateLimiter(
    requests_per_minute=settings.rate_limit_per_minute,
    requests_per_hour=settings.rate_limit_per_hour,
)


async def check_rate_limit(request: Request) -> None:
    """
    FastAPI dependency for rate limiting.

    Usage:
        @app.post("/api/v1/chat")
        async def chat(request: Request, _: None = Depends(check_rate_limit)):
            ...
    """
    is_allowed, error_message = rate_limiter.check_rate_limit(request)
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_message,
        )
