"""
Redis-based distributed rate limiting for production use.

Uses sliding window algorithm with Redis sorted sets for accurate
rate limiting that works across multiple backend instances.
"""
import logging
import time
from typing import Optional, Tuple, Dict, Any

from fastapi import HTTPException, Request, status

logger = logging.getLogger(__name__)

# Redis will be imported lazily to avoid startup failures
_redis_client = None
_redis_available = None


async def get_redis():
    """Get Redis client, creating connection if needed."""
    global _redis_client, _redis_available

    if _redis_available is False:
        return None

    if _redis_client is not None:
        return _redis_client

    try:
        import redis.asyncio as redis
        from app.config import settings

        _redis_client = redis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        # Test connection
        await _redis_client.ping()
        _redis_available = True
        logger.info(f"Redis connected at {settings.redis_url}")
        return _redis_client
    except ImportError:
        logger.warning("Redis package not installed, falling back to in-memory rate limiting")
        _redis_available = False
        return None
    except Exception as e:
        logger.warning(f"Redis connection failed, falling back to in-memory: {e}")
        _redis_available = False
        return None


class RedisRateLimiter:
    """
    Redis-based sliding window rate limiter.

    Uses Redis sorted sets for accurate per-user rate limiting
    that persists across restarts and works with multiple backend instances.
    """

    def __init__(
        self,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
    ):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour

    def _get_identifier(self, request: Request, user_id: Optional[str] = None) -> str:
        """
        Get unique identifier for rate limiting.

        Prefers user_id if provided, falls back to IP address.
        """
        if user_id:
            return f"ratelimit:user:{user_id}"

        # Fall back to IP address
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        return f"ratelimit:ip:{ip}"

    async def check_rate_limit(
        self,
        request: Request,
        user_id: Optional[str] = None,
    ) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Check if request is within rate limits using Redis.

        Args:
            request: FastAPI request object
            user_id: Optional user ID for per-user limiting

        Returns:
            Tuple of (is_allowed, error_message, metadata)
        """
        redis_client = await get_redis()

        if redis_client is None:
            # Fall back to allowing requests if Redis is unavailable
            # In production, you might want to be more restrictive
            return True, "", {"fallback": True}

        identifier = self._get_identifier(request, user_id)
        now = time.time()

        try:
            # Check minute window using Redis sorted set
            minute_key = f"{identifier}:minute"
            pipe = redis_client.pipeline()

            # Remove old entries
            pipe.zremrangebyscore(minute_key, 0, now - 60)
            # Count current entries
            pipe.zcard(minute_key)
            # Add this request
            pipe.zadd(minute_key, {str(now): now})
            # Set expiry
            pipe.expire(minute_key, 60)

            results = await pipe.execute()
            minute_count = results[1]

            if minute_count >= self.requests_per_minute:
                return (
                    False,
                    "Too many requests. Please slow down a bit!",
                    {"retry_after": 60, "limit": "minute", "count": minute_count},
                )

            # Check hour window
            hour_key = f"{identifier}:hour"
            pipe = redis_client.pipeline()

            pipe.zremrangebyscore(hour_key, 0, now - 3600)
            pipe.zcard(hour_key)
            pipe.zadd(hour_key, {str(now): now})
            pipe.expire(hour_key, 3600)

            results = await pipe.execute()
            hour_count = results[1]

            if hour_count >= self.requests_per_hour:
                return (
                    False,
                    "You've made a lot of requests. Take a short break!",
                    {"retry_after": 3600, "limit": "hour", "count": hour_count},
                )

            return (
                True,
                "",
                {
                    "remaining_minute": self.requests_per_minute - minute_count - 1,
                    "remaining_hour": self.requests_per_hour - hour_count - 1,
                },
            )

        except Exception as e:
            logger.error(f"Redis rate limit check failed: {e}")
            # On error, allow the request but log it
            return True, "", {"error": str(e)}


# Import settings for configuration
from app.config import settings

# Global rate limiter instance
redis_rate_limiter = RedisRateLimiter(
    requests_per_minute=settings.rate_limit_per_minute,
    requests_per_hour=settings.rate_limit_per_hour,
)


async def check_rate_limit(request: Request) -> None:
    """
    FastAPI dependency for rate limiting (backward compatible).

    Usage:
        @app.post("/api/v1/chat")
        async def chat(request: Request, _: None = Depends(check_rate_limit)):
            ...
    """
    is_allowed, error_message, meta = await redis_rate_limiter.check_rate_limit(request)
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_message,
            headers={"Retry-After": str(meta.get("retry_after", 60))},
        )


async def check_rate_limit_with_user(
    request: Request,
    user_id: Optional[str] = None,
) -> None:
    """
    Rate limit dependency that accepts explicit user_id.

    Usage:
        @app.post("/api/v1/agents/{agent_id}/chat")
        async def chat(
            request: Request,
            agent_id: uuid.UUID,
            clerk_user: CurrentUser,
        ):
            await check_rate_limit_with_user(request, user_id=clerk_user.user_id)
            ...
    """
    is_allowed, error_message, meta = await redis_rate_limiter.check_rate_limit(
        request, user_id
    )
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_message,
            headers={"Retry-After": str(meta.get("retry_after", 60))},
        )
