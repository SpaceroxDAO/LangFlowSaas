"""
Application configuration using Pydantic Settings.
Loads environment variables with validation and type coercion.
"""
import logging
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

# Find the project root .env file (two levels up from this file)
_env_file = Path(__file__).parent.parent.parent.parent / ".env"


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

    # Development Mode - bypasses Clerk auth when True
    # Set DEV_MODE=true in .env to enable
    dev_mode: bool = False

    # Database (SQLite for development, PostgreSQL for production)
    # Use sqlite+aiosqlite:///./teachcharlie.db for local dev without Docker
    database_url: str = "sqlite+aiosqlite:///./teachcharlie.db"

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
