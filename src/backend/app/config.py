"""
Application configuration using Pydantic Settings.
Loads environment variables with validation and type coercion.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/teachcharlie"

    # Langflow
    langflow_api_url: str = "http://localhost:7860"
    langflow_api_key: str = "dev-langflow-api-key"

    # Clerk Authentication
    clerk_publishable_key: str = ""
    clerk_secret_key: str = ""
    clerk_jwks_url: str = ""
    clerk_issuer: str = ""
    clerk_authorized_parties: str = "http://localhost:3000,http://localhost:5173"

    @property
    def authorized_parties_list(self) -> List[str]:
        """Parse authorized parties into a list."""
        return [p.strip() for p in self.clerk_authorized_parties.split(",") if p.strip()]

    # LLM API Keys (passed to Langflow)
    openai_api_key: str = ""
    anthropic_api_key: str = ""


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Convenience access
settings = get_settings()
