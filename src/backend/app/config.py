"""
Application configuration using Pydantic Settings.
Loads environment variables with validation and type coercion.
"""
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict

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


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Convenience access
settings = get_settings()
