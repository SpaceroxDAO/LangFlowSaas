"""
Avatar generation API endpoints.

Provides endpoints for generating dog avatar variants using GPT Image Edit.
"""
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.dog_avatar_service import dog_avatar_service, JOB_ACCESSORIES

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/avatars", tags=["avatars"])


# =============================================================================
# Request/Response Models
# =============================================================================

class GenerateDogAvatarRequest(BaseModel):
    """Request model for dog avatar generation."""

    job: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Job type for the avatar (e.g., 'support', 'developer')",
        examples=["support", "developer", "sales"],
    )
    size: str = Field(
        default="1024x1024",
        description="Image size",
        examples=["1024x1024", "512x512"],
    )
    background: str = Field(
        default="transparent",
        description="Background type",
        examples=["transparent", "white"],
    )
    regenerate: bool = Field(
        default=False,
        description="If true, bypass cache and generate new avatar",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=500,
        description="Agent description for fallback when job is 'default'. Used to generate context-aware accessory.",
        examples=["A friendly assistant that helps with gardening tips"],
    )


class DogAvatarResponse(BaseModel):
    """Response model for dog avatar generation."""

    job: str
    size: str
    background: str
    image_url: str
    cached: bool
    prompt_version: str
    model: str
    needs_review: bool


class AvailableJobsResponse(BaseModel):
    """Response model for listing available jobs."""

    jobs: list[str]
    count: int


class ClearCacheResponse(BaseModel):
    """Response model for cache clearing."""

    deleted_count: int
    message: str


# =============================================================================
# Endpoints
# =============================================================================

@router.post(
    "/dog",
    response_model=DogAvatarResponse,
    summary="Generate dog avatar",
    description="Generate a dog avatar with job-specific accessory using GPT Image Edit.",
)
async def generate_dog_avatar(request: GenerateDogAvatarRequest) -> DogAvatarResponse:
    """
    Generate a dog avatar for the specified job.

    The avatar is based on a canonical dog image with a job-specific accessory added.
    Results are cached - use regenerate=true to force a new generation.

    If job is 'default' and description is provided, uses description-based generation
    with constrained accessory options. If job is 'default' with no description,
    returns the base image directly (no API call).
    """
    try:
        result = await dog_avatar_service.generate_avatar(
            job=request.job,
            size=request.size,
            background=request.background,
            regenerate=request.regenerate,
            description=request.description,
        )
        return DogAvatarResponse(**result)

    except FileNotFoundError as e:
        logger.error(f"Base image not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Base avatar image not configured. Please contact support.",
        )
    except ValueError as e:
        logger.error(f"Avatar generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to generate avatar: {str(e)}",
        )
    except Exception as e:
        logger.exception(f"Unexpected error generating avatar: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again.",
        )


@router.get(
    "/dog/jobs",
    response_model=AvailableJobsResponse,
    summary="List available jobs",
    description="Get list of available job types for avatar generation.",
)
async def list_available_jobs() -> AvailableJobsResponse:
    """List all available job types for avatar generation."""
    jobs = dog_avatar_service.get_available_jobs()
    return AvailableJobsResponse(jobs=jobs, count=len(jobs))


@router.delete(
    "/dog/cache",
    response_model=ClearCacheResponse,
    summary="Clear avatar cache",
    description="Clear cached avatar images. Optionally specify a job to clear only that job's cache.",
)
async def clear_avatar_cache(job: Optional[str] = None) -> ClearCacheResponse:
    """
    Clear cached avatar images.

    If job is specified, only clears that job's cached avatars.
    If job is None, clears all cached avatars.
    """
    try:
        deleted_count = dog_avatar_service.clear_cache(job=job)
        message = (
            f"Cleared {deleted_count} cached avatar(s) for job '{job}'"
            if job
            else f"Cleared {deleted_count} cached avatar(s)"
        )
        return ClearCacheResponse(deleted_count=deleted_count, message=message)
    except Exception as e:
        logger.exception(f"Error clearing cache: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear cache.",
        )


@router.post(
    "/dog/batch",
    response_model=list[DogAvatarResponse],
    summary="Generate multiple avatars",
    description="Generate avatars for multiple jobs in one request.",
)
async def generate_batch_avatars(
    jobs: list[str],
    size: str = "1024x1024",
    background: str = "transparent",
    regenerate: bool = False,
) -> list[DogAvatarResponse]:
    """
    Generate avatars for multiple jobs.

    Useful for pre-generating all job variants.
    """
    results = []

    for job in jobs:
        try:
            result = await dog_avatar_service.generate_avatar(
                job=job,
                size=size,
                background=background,
                regenerate=regenerate,
            )
            results.append(DogAvatarResponse(**result))
        except Exception as e:
            logger.error(f"Failed to generate avatar for job '{job}': {e}")
            # Continue with other jobs, don't fail entire batch
            continue

    return results
