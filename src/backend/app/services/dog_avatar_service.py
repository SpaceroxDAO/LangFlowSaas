"""
Dog Avatar Service - GPT Image Edit based avatar generation.

Uses a canonical base dog image and OpenAI's gpt-image-1 model to generate
consistent job-based avatar variants with accessories.

Strategy:
1. Known job → predefined accessory (controlled, consistent)
2. Unknown job + description → description-based with strict constraints
3. Unknown job + no description → return base image (no API call, saves $$$)
"""
import base64
import hashlib
import io
import logging
import re
from pathlib import Path
from typing import Optional, Tuple

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# =============================================================================
# Configuration
# =============================================================================

PROMPT_VERSION = "v2"  # Bumped for description-based fallback

# Paths - Use /app as base when running in Docker, otherwise use file-based detection
APP_DIR = Path(__file__).parent.parent  # /app/app -> /app (in Docker) or src/backend/app -> src/backend (local)
# STATIC_DIR is where we store generated avatars
STATIC_DIR = APP_DIR / "static" / "avatars"
# ASSETS_DIR for base images (also in static for simplicity)
ASSETS_DIR = APP_DIR / "static" / "assets"
BASE_IMAGE_PATH = ASSETS_DIR / "dog_base.png"

# Ensure directories exist
STATIC_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

# =============================================================================
# Job → Accessory Mapping
# =============================================================================

JOB_ACCESSORIES = {
    # Core business roles
    "support": "tiny headset with mic",
    "developer": "simple square glasses",
    "data": "small abstract node/sparkle near head (minimal)",
    "manager": "minimal flat cap",
    "sales": "small tie",
    "security": "small shield badge on collar",
    "designer": "small beret",
    "product": "tiny sticky note on ear (outline only)",
    "marketing": "small megaphone icon floating near head (outline only)",
    "finance": "tiny coin icon near collar (outline only)",
    "legal": "small scales-of-justice icon near collar (outline only)",
    "hr": "small heart badge on collar (outline only)",
    "ops": "tiny gear icon near head (outline only)",
    "qa": "tiny checkmark badge on collar",
    "research": "tiny monocle (no hand)",
    # Professional services
    "doctor": "tiny stethoscope draped around neck (no hands)",
    "teacher": "small graduation cap",
    "pilot": "simple aviator cap with goggles on top",
    "chef": "small chef hat (toque)",
    "artist": "small paintbrush behind ear (no hand holding it)",
    # Additional roles
    "scientist": "small safety goggles on head",
    "writer": "tiny pencil behind ear",
    "gardener": "small straw sun hat",
    "athlete": "small sweatband on head",
    "musician": "small music note icon near ear (outline only)",
    "photographer": "tiny camera strap around neck (outline only)",
    "engineer": "small hard hat",
    "nurse": "small nurse cap",
    "accountant": "small reading glasses",
    "consultant": "small bow tie",
    "assistant": "small collar with bell",
    "receptionist": "small name tag on collar",
    "therapist": "small heart icon near head (outline only)",
    "counselor": "small heart icon near head (outline only)",
    "coach": "small whistle on lanyard around neck",
    "trainer": "small whistle on lanyard around neck",
    "tutor": "small graduation cap",
    "guide": "small compass icon near collar (outline only)",
    "helper": "small star badge on collar",
    "bot": "small antenna on head",
    "agent": "small bow tie",
    # Default (no accessory - handled specially)
    "default": "",
}

# Allowed accessories for description-based fallback (constrained list)
ALLOWED_ACCESSORIES = [
    "small glasses",
    "tiny bow tie",
    "small collar with tag",
    "small cap",
    "tiny badge on collar",
    "small headband",
]

# =============================================================================
# Prompt Templates
# =============================================================================

PROMPT_PREFIX = """Edit the input image.
Preserve the exact same dog head shape, ear shape, face proportions, and stroke weight from the input.
Minimal monoline icon, rounded caps and joins, outline-only.
No hands, no arms, no paws, no limbs, no props held by the dog.
No fills, no shading, no gradients, no shadows, no 3D.
Add ONLY the accessory described below; do not add any other objects.
Centered composition, friendly, clean, modern app icon.
Transparent background."""

RETRY_ADDITION = """
CRITICAL: Do NOT add any new body parts. Keep ONLY the existing head, ears, neck, and upper body from the input.
ABSOLUTELY NO additional limbs, arms, hands, or paws beyond what exists in the input image."""

# For description-based fallback when no known job matches
DESCRIPTION_BASED_PROMPT = """Edit the input image.
Preserve the exact same dog head shape, ear shape, face proportions, and stroke weight from the input.
Minimal monoline icon, rounded caps and joins, outline-only.
No hands, no arms, no paws, no limbs, no props held by the dog.
No fills, no shading, no gradients, no shadows, no 3D.
Centered composition, friendly, clean, modern app icon.
Transparent background.

The dog represents: "{description}"

Add ONE small accessory that best represents this role. You MUST choose from ONLY these options:
- small glasses (for intellectual/professional roles)
- tiny bow tie (for formal/business roles)
- small collar with name tag (for service/assistant roles)
- small cap (for casual/outdoor roles)
- tiny badge on collar (for official/authority roles)
- small headband (for active/energetic roles)

Pick the SINGLE most appropriate accessory from the list above. Place it on the head or neck area only."""


def build_prompt(job: str, retry: bool = False, description: Optional[str] = None) -> str:
    """
    Build the full prompt for a given job.

    Args:
        job: Job type from JOB_ACCESSORIES mapping
        retry: If True, add stronger constraints
        description: Optional description for fallback when job is "default"
    """
    accessory = JOB_ACCESSORIES.get(job, "")

    # If job is "default" and we have a description, use description-based prompt
    if job == "default" and description:
        prompt = DESCRIPTION_BASED_PROMPT.format(description=description[:200])
        if retry:
            prompt += RETRY_ADDITION
        return prompt

    # Standard job-based prompt
    prompt = PROMPT_PREFIX
    if retry:
        prompt += RETRY_ADDITION
    if accessory:
        prompt += f"\n\nAccessory to add: {accessory}"
    else:
        prompt += "\n\nNo accessory needed - keep the dog exactly as is with transparent background."

    return prompt


# =============================================================================
# Cache Management
# =============================================================================

def get_cache_key(job: str, size: str, background: str, description: Optional[str] = None) -> str:
    """Generate cache key for avatar variant."""
    base_key = f"dog_{PROMPT_VERSION}_{job}_{size.replace('x', '_')}_{background}"

    # For description-based generation, add a hash of the description
    if job == "default" and description:
        desc_hash = hashlib.md5(description.lower().strip()[:200].encode()).hexdigest()[:8]
        return f"{base_key}_desc_{desc_hash}"

    return base_key


def get_cache_path(cache_key: str) -> Path:
    """Get filesystem path for cached avatar."""
    return STATIC_DIR / f"{cache_key}.png"


def get_static_url(cache_key: str) -> str:
    """Get the URL path for serving the cached avatar."""
    return f"/static/avatars/{cache_key}.png"


# =============================================================================
# Validation Functions
# =============================================================================

def validate_transparency(image_bytes: bytes) -> bool:
    """Check if PNG has alpha channel with actual transparency."""
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != "RGBA":
            logger.warning("Image is not RGBA mode")
            return False
        alpha = img.getchannel("A")
        min_alpha, max_alpha = alpha.getextrema()
        has_transparency = min_alpha < 255
        logger.debug(f"Transparency check: min_alpha={min_alpha}, has_transparency={has_transparency}")
        return has_transparency
    except ImportError:
        logger.warning("PIL not available, skipping transparency validation")
        return True  # Skip validation if PIL not available
    except Exception as e:
        logger.error(f"Transparency validation error: {e}")
        return False


def validate_style(image_bytes: bytes) -> bool:
    """Basic heuristic: image should be mostly stroke (dark) and background (light/transparent)."""
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
        pixels = list(img.getdata())

        if not pixels:
            return False

        # Count pixel types
        transparent = sum(1 for r, g, b, a in pixels if a < 128)
        dark = sum(1 for r, g, b, a in pixels if a >= 128 and r < 100 and g < 100 and b < 100)
        light = sum(1 for r, g, b, a in pixels if a >= 128 and r > 200 and g > 200 and b > 200)

        total = len(pixels)
        ratio = (transparent + light) / total

        logger.debug(f"Style check: transparent={transparent}, dark={dark}, light={light}, ratio={ratio:.2f}")

        # Good monoline icon: mostly transparent/light background with some dark strokes
        return ratio > 0.80  # 80% should be background

    except ImportError:
        logger.warning("PIL not available, skipping style validation")
        return True
    except Exception as e:
        logger.error(f"Style validation error: {e}")
        return False


def validate_avatar(image_bytes: bytes) -> bool:
    """Run all validations. Returns True if avatar passes."""
    return validate_transparency(image_bytes) and validate_style(image_bytes)


# =============================================================================
# OpenAI API Integration
# =============================================================================

async def call_openai_image_edit(
    base_image_bytes: bytes,
    prompt: str,
    size: str = "1024x1024",
) -> bytes:
    """
    Call OpenAI /v1/images/edits endpoint with gpt-image-1.

    Returns PNG image bytes (decoded from base64).
    """
    api_key = settings.openai_api_key
    if not api_key:
        raise ValueError("OpenAI API key not configured")

    async with httpx.AsyncClient(timeout=180.0) as client:
        files = {"image": ("dog_base.png", base_image_bytes, "image/png")}
        data = {
            "model": "gpt-image-1",
            "prompt": prompt,
            "size": size,
            "n": "1",
        }

        logger.info(f"Calling OpenAI image edit API with prompt: {prompt[:100]}...")

        response = await client.post(
            "https://api.openai.com/v1/images/edits",
            headers={"Authorization": f"Bearer {api_key}"},
            files=files,
            data=data,
        )

        if response.status_code != 200:
            error_detail = "Unknown error"
            try:
                error_json = response.json()
                error_detail = error_json.get("error", {}).get("message", response.text[:500])
            except Exception:
                error_detail = response.text[:500]

            logger.error(f"OpenAI API error: {response.status_code} - {error_detail}")
            raise ValueError(f"OpenAI API error: {error_detail}")

        result = response.json()
        b64_data = result["data"][0]["b64_json"]
        image_bytes = base64.b64decode(b64_data)

        logger.info(f"Successfully generated image: {len(image_bytes)} bytes")
        return image_bytes


# =============================================================================
# Main Service Class
# =============================================================================

class DogAvatarService:
    """Service for generating dog avatar variants using GPT Image Edit."""

    def __init__(self):
        self.base_image_path = BASE_IMAGE_PATH

    def _load_base_image(self) -> bytes:
        """Load the canonical base dog image."""
        if not self.base_image_path.exists():
            raise FileNotFoundError(
                f"Base dog image not found at {self.base_image_path}. "
                "Please save the canonical dog image to assets/avatars/dog_base.png"
            )
        return self.base_image_path.read_bytes()

    async def generate_avatar(
        self,
        job: str,
        size: str = "1024x1024",
        background: str = "transparent",
        regenerate: bool = False,
        description: Optional[str] = None,
    ) -> dict:
        """
        Generate or retrieve a cached dog avatar for the given job.

        Strategy:
        1. Known job → use predefined accessory (controlled, consistent)
        2. "default" + description → use description-based prompt (constrained)
        3. "default" + no description → return base image directly (no API call)

        Args:
            job: Job type from JOB_ACCESSORIES mapping
            size: Image size (default 1024x1024)
            background: Background type (default transparent)
            regenerate: If True, bypass cache and generate new
            description: Optional agent description for fallback generation

        Returns:
            dict with image_url, cached, needs_review, etc.
        """
        # Normalize job
        job = job.lower().strip()
        if job not in JOB_ACCESSORIES:
            logger.warning(f"Unknown job '{job}', using default")
            job = "default"

        # SPECIAL CASE: "default" with no description = return base image directly
        # This saves API costs and ensures consistency
        if job == "default" and not description:
            logger.info("No job match and no description - returning base image")
            # Copy base image to static directory if not already there
            base_cache_key = f"dog_{PROMPT_VERSION}_base"
            base_cache_path = get_cache_path(base_cache_key)
            if not base_cache_path.exists():
                base_image_bytes = self._load_base_image()
                base_cache_path.write_bytes(base_image_bytes)
                logger.info(f"Copied base image to {base_cache_path}")

            return {
                "job": "default",
                "size": size,
                "background": background,
                "image_url": get_static_url(base_cache_key),
                "cached": True,
                "prompt_version": PROMPT_VERSION,
                "model": "base-image",  # No API call made
                "needs_review": False,
            }

        # Check cache (include description in key for description-based generation)
        cache_key = get_cache_key(job, size, background, description)
        cache_path = get_cache_path(cache_key)

        if cache_path.exists() and not regenerate:
            logger.info(f"Cache hit for {cache_key}")
            return {
                "job": job,
                "size": size,
                "background": background,
                "image_url": get_static_url(cache_key),
                "cached": True,
                "prompt_version": PROMPT_VERSION,
                "model": "gpt-image-1",
                "needs_review": False,
            }

        # Load base image
        base_image_bytes = self._load_base_image()

        # Generate with retry logic
        image_bytes, needs_review = await self._generate_with_retry(
            job=job,
            base_image_bytes=base_image_bytes,
            size=size,
            description=description,
        )

        # Save to cache
        cache_path.write_bytes(image_bytes)
        logger.info(f"Saved avatar to {cache_path}")

        return {
            "job": job,
            "size": size,
            "background": background,
            "image_url": get_static_url(cache_key),
            "cached": False,
            "prompt_version": PROMPT_VERSION,
            "model": "gpt-image-1",
            "needs_review": needs_review,
        }

    async def _generate_with_retry(
        self,
        job: str,
        base_image_bytes: bytes,
        size: str,
        description: Optional[str] = None,
    ) -> Tuple[bytes, bool]:
        """Generate avatar, retry once if validation fails."""

        # First attempt
        prompt = build_prompt(job, retry=False, description=description)
        image_bytes = await call_openai_image_edit(base_image_bytes, prompt, size)

        if validate_avatar(image_bytes):
            logger.info("First attempt passed validation")
            return image_bytes, False

        logger.warning("First attempt failed validation, retrying with stronger prompt")

        # Retry with stronger prompt
        prompt = build_prompt(job, retry=True, description=description)
        image_bytes = await call_openai_image_edit(base_image_bytes, prompt, size)

        if validate_avatar(image_bytes):
            logger.info("Retry attempt passed validation")
            return image_bytes, False

        logger.warning("Retry also failed validation, flagging for review")
        return image_bytes, True

    def get_available_jobs(self) -> list:
        """Return list of available job types."""
        return list(JOB_ACCESSORIES.keys())

    def clear_cache(self, job: Optional[str] = None) -> int:
        """Clear cached avatars. Returns count of files deleted."""
        count = 0
        pattern = f"dog_{PROMPT_VERSION}_{job}_*" if job else f"dog_{PROMPT_VERSION}_*"

        for file in STATIC_DIR.glob(pattern):
            if file.suffix == ".png":
                file.unlink()
                count += 1
                logger.info(f"Deleted cached avatar: {file.name}")

        return count


# Singleton instance
dog_avatar_service = DogAvatarService()
