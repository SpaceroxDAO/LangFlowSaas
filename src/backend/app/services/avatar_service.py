"""
Avatar generation service using OpenAI DALL-E.
"""
import logging
from typing import Optional
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# The prompt template for generating dog avatars
# Testing: Simple black and white dog icon with hd + vivid settings
# Note: Uses agent NAME (short) not description (long) for consistent results
AVATAR_PROMPT_TEMPLATE = """Create a dog {description} icon thats black and white"""


class AvatarService:
    """Service for generating AI avatars using OpenAI DALL-E."""

    def __init__(self):
        self.api_key = settings.openai_api_key
        self.api_url = "https://api.openai.com/v1/images/generations"

    async def generate_avatar(self, description: str) -> Optional[str]:
        """
        Generate an avatar image based on the agent description.

        Args:
            description: The agent's persona/job description

        Returns:
            URL to the generated image, or None if generation failed
        """
        if not self.api_key:
            logger.error("OpenAI API key not configured")
            raise ValueError("OpenAI API key not configured. Set OPENAI_API_KEY environment variable.")

        # Build the full prompt
        prompt = AVATAR_PROMPT_TEMPLATE.format(description=description)

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "dall-e-3",
                        "prompt": prompt,
                        "n": 1,
                        "size": "1024x1024",
                        "quality": "hd",
                        "style": "vivid",  # Testing hd + vivid with black and white prompt
                    },
                )

                if response.status_code != 200:
                    error_detail = response.json().get("error", {}).get("message", "Unknown error")
                    logger.error(f"DALL-E API error: {response.status_code} - {error_detail}")
                    raise ValueError(f"Failed to generate avatar: {error_detail}")

                data = response.json()
                image_url = data["data"][0]["url"]

                logger.info(f"Successfully generated avatar for description: {description[:50]}...")
                return image_url

        except httpx.TimeoutException:
            logger.error("DALL-E API request timed out")
            raise ValueError("Avatar generation timed out. Please try again.")
        except Exception as e:
            logger.error(f"Error generating avatar: {e}")
            raise


# Singleton instance
avatar_service = AvatarService()
