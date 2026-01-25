"""
Startup Validation Module

This module validates that all required external services are reachable
before the application starts accepting requests. This prevents silent
failures where the app appears healthy but can't actually function.

Critical external dependencies:
- Clerk JWKS endpoint (for JWT validation) - REQUIRED
- Database (PostgreSQL) - REQUIRED
- Langflow API - REQUIRED
- OpenAI API - OPTIONAL (users provide keys)
- Anthropic API - OPTIONAL (users provide keys)
- Stripe API - OPTIONAL (for billing)
- Sentry - OPTIONAL (for error monitoring)
"""

import asyncio
import logging
import httpx
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)


class StartupCheckError(Exception):
    """Raised when a critical startup check fails."""
    pass


class StartupValidation:
    """Validates external service connectivity at startup."""

    def __init__(self):
        self.results: dict[str, dict] = {}

    async def check_clerk_jwks(self) -> bool:
        """
        Verify Clerk JWKS endpoint is reachable.
        This is CRITICAL - without it, JWT validation will fail for all requests.
        """
        jwks_url = settings.clerk_jwks_url
        if not jwks_url:
            logger.error("CLERK_JWKS_URL not configured")
            self.results["clerk_jwks"] = {
                "status": "error",
                "message": "CLERK_JWKS_URL not configured",
                "critical": True
            }
            return False

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(jwks_url)
                if response.status_code == 200:
                    # Verify it's valid JWKS
                    data = response.json()
                    if "keys" in data and len(data["keys"]) > 0:
                        logger.info(f"✅ Clerk JWKS reachable: {jwks_url}")
                        self.results["clerk_jwks"] = {
                            "status": "ok",
                            "message": f"JWKS endpoint reachable with {len(data['keys'])} keys",
                            "critical": True
                        }
                        return True
                    else:
                        logger.error(f"Clerk JWKS returned invalid data: {data}")
                        self.results["clerk_jwks"] = {
                            "status": "error",
                            "message": "JWKS endpoint returned invalid data (no keys)",
                            "critical": True
                        }
                        return False
                else:
                    logger.error(f"Clerk JWKS returned status {response.status_code}")
                    self.results["clerk_jwks"] = {
                        "status": "error",
                        "message": f"JWKS endpoint returned HTTP {response.status_code}",
                        "critical": True
                    }
                    return False
        except httpx.ConnectError as e:
            logger.error(f"❌ Cannot connect to Clerk JWKS: {e}")
            self.results["clerk_jwks"] = {
                "status": "error",
                "message": f"Connection failed: {str(e)}. Check Docker network configuration - backend may need public network access.",
                "critical": True
            }
            return False
        except Exception as e:
            logger.error(f"❌ Clerk JWKS check failed: {e}")
            self.results["clerk_jwks"] = {
                "status": "error",
                "message": str(e),
                "critical": True
            }
            return False

    async def check_langflow(self) -> bool:
        """
        Verify Langflow API is reachable.
        This is CRITICAL - without it, agent execution will fail.
        """
        langflow_url = settings.langflow_api_url
        if not langflow_url:
            logger.warning("LANGFLOW_API_URL not configured")
            self.results["langflow"] = {
                "status": "warning",
                "message": "LANGFLOW_API_URL not configured",
                "critical": True
            }
            return False

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{langflow_url}/health")
                if response.status_code == 200:
                    logger.info(f"✅ Langflow reachable: {langflow_url}")
                    self.results["langflow"] = {
                        "status": "ok",
                        "message": "Langflow API healthy",
                        "critical": True
                    }
                    return True
                else:
                    logger.warning(f"Langflow returned status {response.status_code}")
                    self.results["langflow"] = {
                        "status": "warning",
                        "message": f"Langflow returned HTTP {response.status_code}",
                        "critical": True
                    }
                    return False
        except Exception as e:
            logger.warning(f"⚠️ Langflow check failed (may still be starting): {e}")
            self.results["langflow"] = {
                "status": "warning",
                "message": f"Connection failed: {str(e)}",
                "critical": True
            }
            return False

    async def check_database(self, db_session) -> bool:
        """
        Verify database is reachable.
        This is CRITICAL - without it, nothing works.
        """
        try:
            from sqlalchemy import text
            result = await db_session.execute(text("SELECT 1"))
            logger.info("✅ Database connection healthy")
            self.results["database"] = {
                "status": "ok",
                "message": "Database connection successful",
                "critical": True
            }
            return True
        except Exception as e:
            logger.error(f"❌ Database check failed: {e}")
            self.results["database"] = {
                "status": "error",
                "message": str(e),
                "critical": True
            }
            return False

    async def check_openai(self) -> bool:
        """
        Check if OpenAI API is reachable (optional).
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get("https://api.openai.com/v1/models",
                                           headers={"Authorization": "Bearer test"})
                # 401 means API is reachable but key is invalid (expected)
                if response.status_code in [200, 401]:
                    logger.info("✅ OpenAI API reachable")
                    self.results["openai"] = {
                        "status": "ok",
                        "message": "OpenAI API reachable",
                        "critical": False
                    }
                    return True
        except Exception as e:
            logger.warning(f"⚠️ OpenAI API check failed: {e}")
            self.results["openai"] = {
                "status": "warning",
                "message": str(e),
                "critical": False
            }
        return False

    async def check_anthropic(self) -> bool:
        """
        Check if Anthropic API is reachable (optional).
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get("https://api.anthropic.com/v1/messages",
                                           headers={"x-api-key": "test"})
                # 401 means API is reachable but key is invalid (expected)
                if response.status_code in [200, 401]:
                    logger.info("✅ Anthropic API reachable")
                    self.results["anthropic"] = {
                        "status": "ok",
                        "message": "Anthropic API reachable",
                        "critical": False
                    }
                    return True
        except Exception as e:
            logger.warning(f"⚠️ Anthropic API check failed: {e}")
            self.results["anthropic"] = {
                "status": "warning",
                "message": str(e),
                "critical": False
            }
        return False

    async def run_all_checks(self, db_session=None) -> bool:
        """
        Run all startup checks and return overall status.

        Returns True if all CRITICAL checks pass.
        Logs warnings for non-critical failures.
        """
        logger.info("=" * 60)
        logger.info("Running startup connectivity checks...")
        logger.info("=" * 60)

        # Run critical checks
        clerk_ok = await self.check_clerk_jwks()
        langflow_ok = await self.check_langflow()

        # Run optional checks in parallel
        await asyncio.gather(
            self.check_openai(),
            self.check_anthropic(),
            return_exceptions=True
        )

        # Database check requires session
        db_ok = True
        if db_session:
            db_ok = await self.check_database(db_session)

        logger.info("=" * 60)
        logger.info("Startup check results:")
        for service, result in self.results.items():
            status_icon = "✅" if result["status"] == "ok" else "⚠️" if result["status"] == "warning" else "❌"
            critical_tag = "[CRITICAL]" if result.get("critical") else "[optional]"
            logger.info(f"  {status_icon} {service} {critical_tag}: {result['message']}")
        logger.info("=" * 60)

        # Determine if we should fail startup
        critical_failures = [
            name for name, result in self.results.items()
            if result.get("critical") and result["status"] == "error"
        ]

        if critical_failures:
            logger.error(f"❌ CRITICAL STARTUP FAILURES: {', '.join(critical_failures)}")
            logger.error("The application may not function correctly.")
            logger.error("")
            logger.error("Common fixes:")
            logger.error("  - Clerk JWKS: Ensure backend container has public network access")
            logger.error("  - Database: Check DATABASE_URL and PostgreSQL container health")
            logger.error("  - Langflow: Check Langflow container health and LANGFLOW_API_URL")
            return False

        logger.info("✅ All critical startup checks passed")
        return True

    def get_results(self) -> dict:
        """Return check results for health endpoint."""
        return self.results


# Singleton instance
startup_validator = StartupValidation()


async def run_startup_checks(db_session=None, fail_on_error: bool = False) -> bool:
    """
    Run startup validation checks.

    Args:
        db_session: Optional database session for DB check
        fail_on_error: If True, raise exception on critical failures

    Returns:
        True if all critical checks pass
    """
    result = await startup_validator.run_all_checks(db_session)

    if not result and fail_on_error:
        raise StartupCheckError(
            "Critical startup checks failed. Check logs for details."
        )

    return result
