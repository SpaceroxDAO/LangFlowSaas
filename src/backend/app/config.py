"""
Application configuration using Pydantic Settings.
Loads environment variables with validation and type coercion.
"""
import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field

logger = logging.getLogger(__name__)

# Find the project root .env file (two levels up from this file)
_env_file = Path(__file__).parent.parent.parent.parent / ".env"

# Production environment names that should never have DEV_MODE enabled
PRODUCTION_ENVIRONMENTS = {"production", "prod", "staging", "stage", "live"}


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(_env_file) if _env_file.exists() else ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    # Environment name (development, staging, production)
    environment: str = "development"

    # Development Mode - bypasses Clerk auth when True
    # SECURITY: This is protected by multiple safeguards to prevent
    # accidental enabling in production. See is_dev_mode_safe property.
    _dev_mode_raw: bool = False

    @computed_field
    @property
    def dev_mode(self) -> bool:
        """
        Development mode with production safeguards.

        DEV_MODE is only allowed when ALL of the following are true:
        1. DEV_MODE env var is explicitly set to true
        2. ENVIRONMENT is not a production-like value
        3. Database URL points to localhost (not a remote server)

        This prevents accidental auth bypass in production.
        """
        # Check the raw env var
        raw_dev_mode = os.getenv("DEV_MODE", "false").lower() == "true"

        if not raw_dev_mode:
            return False

        # SAFEGUARD 1: Block in production-like environments
        env_name = self.environment.lower()
        if env_name in PRODUCTION_ENVIRONMENTS:
            logger.critical(
                "SECURITY: DEV_MODE=true BLOCKED because ENVIRONMENT=%s. "
                "DEV_MODE cannot be enabled in production environments.",
                self.environment
            )
            return False

        # SAFEGUARD 2: Block if using a remote database
        db_url = os.getenv("DATABASE_URL", "")
        is_local_db = (
            not db_url or
            "localhost" in db_url or
            "127.0.0.1" in db_url or
            "host.docker.internal" in db_url or
            "@postgres:" in db_url  # Docker Compose container name
        )
        if not is_local_db:
            logger.critical(
                "SECURITY: DEV_MODE=true BLOCKED because DATABASE_URL appears "
                "to be a remote server. DEV_MODE only allowed with localhost database."
            )
            return False

        # SAFEGUARD 3: Block if Clerk production keys are configured
        clerk_key = os.getenv("CLERK_PUBLISHABLE_KEY", "")
        if clerk_key.startswith("pk_live_"):
            logger.critical(
                "SECURITY: DEV_MODE=true BLOCKED because production Clerk keys "
                "(pk_live_) are configured. Remove production keys for local dev."
            )
            return False

        # All safeguards passed - allow dev mode
        logger.warning(
            "DEV_MODE is ENABLED - authentication is bypassed. "
            "This message should NEVER appear in production logs."
        )
        return True

    # Database - PostgreSQL via Docker Compose (REQUIRED)
    # IMPORTANT: Always use Docker Compose for development. Do NOT use standalone SQLite.
    # Run: docker-compose -f docker-compose.dev.yml up -d
    # This provides PostgreSQL at localhost:5432 for both Teach Charlie and Langflow
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/teachcharlie"

    # Langflow
    langflow_api_url: str = "http://localhost:7860"
    langflow_api_key: str = "dev-langflow-api-key"
    langflow_container_name: str = "teachcharlie-langflow"  # Must match docker-compose.yml

    # Clerk Authentication
    clerk_publishable_key: str = ""
    clerk_secret_key: str = ""
    clerk_jwks_url: str = ""
    clerk_issuer: str = ""
    clerk_authorized_parties: str = "http://localhost:3000,http://localhost:5173"

    # CORS Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"

    # Rate Limiting
    rate_limit_per_minute: int = 60
    rate_limit_per_hour: int = 1000

    # Redis (for distributed rate limiting)
    redis_url: str = "redis://localhost:6379"

    # Sentry (error monitoring)
    sentry_dsn: str = ""  # Set to enable Sentry
    sentry_environment: str = "development"
    sentry_traces_sample_rate: float = 0.1  # 10% of transactions

    # Stripe (billing)
    stripe_secret_key: str = ""  # sk_test_xxx or sk_live_xxx
    stripe_publishable_key: str = ""  # pk_test_xxx or pk_live_xxx
    stripe_webhook_secret: str = ""  # whsec_xxx
    stripe_pro_price_id: str = ""  # price_xxx for Pro plan
    stripe_team_price_id: str = ""  # price_xxx for Team plan

    # Encryption key for sensitive data (API keys, credentials)
    # Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    encryption_key: str = ""

    @property
    def authorized_parties_list(self) -> List[str]:
        """Parse authorized parties into a list."""
        return [p.strip() for p in self.clerk_authorized_parties.split(",") if p.strip()]

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins into a list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    # LLM API Keys (passed to Langflow)
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # Composio Integration (OAuth for 500+ apps)
    # Get from: https://app.composio.dev/settings
    composio_api_key: str = ""
    composio_callback_url: str = "http://localhost:3001/settings/connections/callback"

    def validate_startup(self) -> bool:
        """
        Validate required environment variables on startup.
        Returns True if all critical vars are present, logs warnings otherwise.
        """
        is_valid = True
        warnings = []
        errors = []

        # Check Langflow connection
        if not self.langflow_api_url:
            errors.append("LANGFLOW_API_URL is required")
            is_valid = False

        # Check auth configuration
        if not self.dev_mode:
            if not self.clerk_jwks_url:
                errors.append("CLERK_JWKS_URL is required when DEV_MODE=false")
                is_valid = False
            if not self.clerk_issuer:
                errors.append("CLERK_ISSUER is required when DEV_MODE=false")
                is_valid = False
        else:
            warnings.append("DEV_MODE=true: Clerk authentication is bypassed (not for production)")

        # Check LLM API keys
        if not self.openai_api_key and not self.anthropic_api_key:
            warnings.append("No LLM API keys configured (OPENAI_API_KEY or ANTHROPIC_API_KEY)")

        # Log results
        for warning in warnings:
            logger.warning(f"⚠️  {warning}")
        for error in errors:
            logger.error(f"❌ {error}")

        if is_valid:
            logger.info("✅ Environment configuration validated successfully")

        return is_valid


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Convenience access
settings = get_settings()
