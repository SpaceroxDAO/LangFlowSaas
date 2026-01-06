"""
User settings schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, List

from pydantic import BaseModel, ConfigDict, Field


class ApiKeyCreate(BaseModel):
    """Schema for adding an API key."""

    provider: str = Field(
        ...,
        description="LLM provider name",
        examples=["openai", "anthropic", "google"],
    )
    api_key: str = Field(
        ...,
        min_length=10,
        description="API key (will be encrypted)",
    )


class ApiKeyResponse(BaseModel):
    """Schema for API key response (masked)."""

    provider: str
    is_set: bool
    last_updated: Optional[datetime] = None


class UserSettingsUpdate(BaseModel):
    """Schema for updating user settings."""

    default_llm_provider: Optional[str] = Field(
        None,
        max_length=50,
        description="Default LLM provider",
    )
    theme: Optional[str] = Field(
        None,
        description="UI theme: light, dark, system",
    )
    sidebar_collapsed: Optional[bool] = None
    onboarding_completed: Optional[bool] = None


class UserSettingsResponse(BaseModel):
    """Schema for user settings response."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    default_llm_provider: Optional[str]
    theme: str
    sidebar_collapsed: bool
    onboarding_completed: bool
    tours_completed: Optional[Dict[str, bool]]
    created_at: datetime
    updated_at: datetime
    # API keys (masked)
    api_keys: List[ApiKeyResponse] = []


class TourCompletedRequest(BaseModel):
    """Schema for marking a tour as completed."""

    tour_id: str = Field(
        ...,
        description="ID of the completed tour",
        examples=["dashboard", "create-agent", "canvas"],
    )
