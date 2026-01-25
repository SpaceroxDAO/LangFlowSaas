"""
Security Headers Middleware

Adds HTTP security headers to all responses to protect against common web vulnerabilities:
- XSS attacks (X-XSS-Protection, Content-Security-Policy)
- Clickjacking (X-Frame-Options)
- MIME sniffing (X-Content-Type-Options)
- Information disclosure (X-Powered-By removal)
- Transport security (Strict-Transport-Security in production)

Reference: https://owasp.org/www-project-secure-headers/
"""
import logging
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.config import settings

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds security headers to all HTTP responses.

    Headers are configured based on environment:
    - Development: Relaxed CSP for hot reload, no HSTS
    - Production: Strict CSP, HSTS enabled
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.is_production = settings.environment.lower() in {
            "production", "prod", "staging", "stage", "live"
        }

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)

        # Skip security headers for health checks (reduces overhead)
        if request.url.path in ("/health", "/health/"):
            return response

        # ========================================
        # Core Security Headers (always applied)
        # ========================================

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Legacy XSS protection (for older browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Control referrer information leakage
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Disable browser features that aren't needed
        response.headers["Permissions-Policy"] = (
            "accelerometer=(), camera=(), geolocation=(), gyroscope=(), "
            "magnetometer=(), microphone=(), payment=(), usb=()"
        )

        # Remove server identification headers
        if "server" in response.headers:
            del response.headers["server"]
        if "x-powered-by" in response.headers:
            del response.headers["x-powered-by"]

        # ========================================
        # Frame Options (API endpoints)
        # ========================================
        # Note: Langflow iframe embedding is handled by nginx, not this API
        # API endpoints should never be framed
        if not request.url.path.startswith("/api/v1/embed"):
            response.headers["X-Frame-Options"] = "DENY"

        # ========================================
        # Production-Only Headers
        # ========================================
        if self.is_production:
            # HTTP Strict Transport Security (HSTS)
            # Forces HTTPS for 1 year, includes subdomains
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

            # Content Security Policy (strict for API)
            # API responses shouldn't load external resources
            response.headers["Content-Security-Policy"] = (
                "default-src 'none'; "
                "frame-ancestors 'none'; "
                "base-uri 'none'; "
                "form-action 'none'"
            )
        else:
            # Development: Relaxed CSP to allow debugging tools
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: blob:; "
                "connect-src 'self' ws: wss:; "
                "frame-ancestors 'self'"
            )

        return response


def add_security_headers_middleware(app: ASGIApp) -> None:
    """
    Add security headers middleware to a FastAPI application.

    Usage:
        from app.middleware.security_headers import add_security_headers_middleware
        add_security_headers_middleware(app)
    """
    app.add_middleware(SecurityHeadersMiddleware)
    logger.info(
        f"Security headers middleware enabled "
        f"(production mode: {settings.environment.lower() in {'production', 'prod', 'staging', 'stage', 'live'}})"
    )
