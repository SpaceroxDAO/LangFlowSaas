"""
Health check endpoint tests.

These tests use a simple client without database dependencies.
"""
import pytest
from httpx import AsyncClient, ASGITransport


@pytest.fixture
async def simple_client():
    """Create a client that doesn't require database setup."""
    from app.main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health_check(simple_client: AsyncClient):
    """Test basic health check endpoint."""
    response = await simple_client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "teach-charlie-api"


@pytest.mark.asyncio
async def test_root_endpoint(simple_client: AsyncClient):
    """Test root endpoint returns API info."""
    response = await simple_client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Teach Charlie AI"
    assert "version" in data
    assert data["docs"] == "/docs"
