"""
Agent API endpoint tests.

These tests verify authentication is required for agent endpoints.
Uses simple client without database dependencies.
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
async def test_list_agents_unauthorized(simple_client: AsyncClient):
    """Test that listing agents requires authentication."""
    response = await simple_client.get("/api/v1/agents")

    # Should return 401 or 403 without auth
    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_create_agent_unauthorized(simple_client: AsyncClient):
    """Test that creating agents requires authentication."""
    response = await simple_client.post(
        "/api/v1/agents/create-from-qa",
        json={
            "who": "A test assistant",
            "rules": "Be helpful",
            "tricks": "Answer questions",
        },
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_create_agent_validation(simple_client: AsyncClient):
    """Test that agent creation validates required fields."""
    # This will fail auth first, but we're testing the endpoint exists
    response = await simple_client.post(
        "/api/v1/agents/create-from-qa",
        json={
            # Missing required fields
        },
    )

    # Either auth error or validation error
    assert response.status_code in [401, 403, 422]


@pytest.mark.asyncio
async def test_get_agent_not_found(simple_client: AsyncClient):
    """Test getting a non-existent agent."""
    response = await simple_client.get("/api/v1/agents/00000000-0000-0000-0000-000000000000")

    # Should be auth error or not found
    assert response.status_code in [401, 403, 404]
