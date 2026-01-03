"""
Health check endpoints.
"""
from fastapi import APIRouter, status

from app.services.langflow_client import langflow_client

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
)
async def health_check():
    """
    Basic health check endpoint.
    Returns 200 if the API is running.
    """
    return {"status": "healthy", "service": "teach-charlie-api"}


@router.get(
    "/health/langflow",
    status_code=status.HTTP_200_OK,
    summary="Langflow health check",
)
async def langflow_health_check():
    """
    Check if Langflow service is healthy.
    """
    is_healthy = await langflow_client.health_check()

    if not is_healthy:
        return {
            "status": "unhealthy",
            "service": "langflow",
            "message": "Langflow service is not responding",
        }

    return {"status": "healthy", "service": "langflow"}


@router.get(
    "/health/full",
    status_code=status.HTTP_200_OK,
    summary="Full health check",
)
async def full_health_check():
    """
    Check health of all services.
    """
    langflow_healthy = await langflow_client.health_check()

    return {
        "status": "healthy" if langflow_healthy else "degraded",
        "services": {
            "api": "healthy",
            "langflow": "healthy" if langflow_healthy else "unhealthy",
        },
    }
