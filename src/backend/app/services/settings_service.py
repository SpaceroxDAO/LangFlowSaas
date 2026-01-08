"""
Settings service for managing user settings and API keys.
"""
import logging
import uuid
from typing import Optional, Dict, List
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import UserSettingsUpdate, ApiKeyResponse

logger = logging.getLogger(__name__)


class SettingsServiceError(Exception):
    """Exception raised when settings operations fail."""
    pass


class SettingsService:
    """Service for user settings CRUD operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_or_create(self, user: User) -> UserSettings:
        """
        Get user settings, creating defaults if they don't exist.

        Args:
            user: User model instance

        Returns:
            UserSettings for the user
        """
        user_id_str = str(user.id)
        stmt = select(UserSettings).where(UserSettings.user_id == user_id_str)
        result = await self.session.execute(stmt)
        settings = result.scalar_one_or_none()

        if settings:
            return settings

        # Create default settings
        settings = UserSettings(
            user_id=user_id_str,
            default_llm_provider="openai",
            theme="light",
            sidebar_collapsed=False,
            onboarding_completed=False,
            tours_completed={},
        )
        self.session.add(settings)
        await self.session.flush()

        logger.info(f"Created default settings for user {user.id}")
        return settings

    async def update(
        self,
        settings: UserSettings,
        data: UserSettingsUpdate,
    ) -> UserSettings:
        """
        Update user settings.

        Args:
            settings: Settings to update
            data: Update data

        Returns:
            Updated settings
        """
        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(settings, key, value)

        await self.session.flush()
        logger.info(f"Updated settings for user {settings.user_id}")
        return settings

    async def set_api_key(
        self,
        settings: UserSettings,
        provider: str,
        api_key: str,
    ) -> UserSettings:
        """
        Set an API key for a provider.

        Note: In production, this should use proper encryption.
        For now, we store keys directly (suitable for dev/demo).

        Args:
            settings: User settings
            provider: LLM provider name
            api_key: API key to store

        Returns:
            Updated settings
        """
        if settings.api_keys_encrypted is None:
            settings.api_keys_encrypted = {}

        # In production, encrypt the key here
        # For now, store with a simple marker
        settings.api_keys_encrypted[provider] = {
            "key": api_key,  # TODO: Encrypt in production
            "updated_at": datetime.utcnow().isoformat(),
        }

        await self.session.flush()
        logger.info(f"Set API key for provider {provider}")
        return settings

    async def delete_api_key(
        self,
        settings: UserSettings,
        provider: str,
    ) -> UserSettings:
        """
        Delete an API key for a provider.

        Args:
            settings: User settings
            provider: LLM provider to remove

        Returns:
            Updated settings
        """
        if settings.api_keys_encrypted and provider in settings.api_keys_encrypted:
            del settings.api_keys_encrypted[provider]
            await self.session.flush()
            logger.info(f"Deleted API key for provider {provider}")

        return settings

    def get_api_key(self, settings: UserSettings, provider: str) -> Optional[str]:
        """
        Get the actual API key for a provider.

        Args:
            settings: User settings
            provider: LLM provider name (e.g., 'openai', 'anthropic')

        Returns:
            The API key string or None if not set
        """
        if not settings.api_keys_encrypted:
            return None

        # Normalize provider name to lowercase
        provider = provider.lower()
        key_data = settings.api_keys_encrypted.get(provider)

        if isinstance(key_data, dict):
            return key_data.get("key")

        return None

    def get_api_keys_list(self, settings: UserSettings) -> List[ApiKeyResponse]:
        """
        Get list of API keys (masked) for response.

        Args:
            settings: User settings

        Returns:
            List of API key info (masked)
        """
        if not settings.api_keys_encrypted:
            return []

        result = []
        for provider, data in settings.api_keys_encrypted.items():
            updated_at = None
            if isinstance(data, dict) and "updated_at" in data:
                try:
                    updated_at = datetime.fromisoformat(data["updated_at"])
                except (ValueError, TypeError):
                    pass

            result.append(ApiKeyResponse(
                provider=provider,
                is_set=True,
                last_updated=updated_at,
            ))

        return result

    async def complete_tour(
        self,
        settings: UserSettings,
        tour_id: str,
    ) -> UserSettings:
        """
        Mark a tour as completed.

        Args:
            settings: User settings
            tour_id: ID of the completed tour

        Returns:
            Updated settings
        """
        if settings.tours_completed is None:
            settings.tours_completed = {}

        settings.tours_completed[tour_id] = True
        await self.session.flush()
        logger.info(f"Marked tour {tour_id} as completed")
        return settings

    async def is_tour_completed(
        self,
        settings: UserSettings,
        tour_id: str,
    ) -> bool:
        """
        Check if a tour has been completed.

        Args:
            settings: User settings
            tour_id: Tour to check

        Returns:
            True if completed
        """
        if not settings.tours_completed:
            return False
        return settings.tours_completed.get(tour_id, False)
