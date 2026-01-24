"""
Agent Components API endpoint tests.

These tests verify the agent component CRUD operations including:
- Authentication requirements
- Create from Q&A wizard
- Read/list with pagination
- Update operations
- Delete operations

Uses SQLite in-memory database for isolation.
"""
import uuid
from unittest.mock import AsyncMock, patch, MagicMock

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession

from app.middleware.clerk_auth import ClerkUser, get_current_user


# Test data
VALID_QA_DATA = {
    "who": "A friendly customer support assistant who helps users with their questions",
    "rules": "Always be polite and helpful. Never share personal information.",
    "tricks": "Can look up order status, process returns, and answer FAQs",
    "name": "Support Charlie",
    "icon": "headphones",
    "color": "#3B82F6",
}

MINIMAL_QA_DATA = {
    "who": "A simple test assistant for testing",
    "rules": "Just be helpful and answer questions",
}


# Mock Clerk user for authenticated tests
MOCK_CLERK_USER = ClerkUser(
    user_id="test_user_clerk_123",
    session_id="test_session",
    email="test@example.com",
    authorized_party="http://localhost:3001",
    expires_at=None,
    issued_at=None,
    organization=None,
    raw_claims=None,
)


@pytest.fixture
async def simple_client():
    """Create a client that doesn't require database setup."""
    from app.main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def authenticated_client(setup_test_database):
    """
    Create an authenticated HTTP client for testing.

    Overrides the Clerk authentication to use a mock user.
    Uses the same database session from conftest to ensure data persistence.
    """
    from app.main import app
    from app.database import get_async_session
    from tests.conftest import test_session_maker

    # Override authentication to return mock user
    async def override_get_current_user():
        return MOCK_CLERK_USER

    # Use the same session override from conftest - this ensures commit happens
    async def override_get_session():
        async with test_session_maker() as session:
            try:
                yield session
                await session.commit()  # Commit on success
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_async_session] = override_get_session
    app.dependency_overrides[get_current_user] = override_get_current_user

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_db_session(setup_test_database):
    """Get a test database session."""
    from tests.conftest import test_session_maker

    async with test_session_maker() as session:
        yield session


# =============================================================================
# Authentication Tests
# =============================================================================


@pytest.mark.asyncio
async def test_list_agent_components_requires_auth(simple_client: AsyncClient):
    """Test that listing agent components requires authentication."""
    response = await simple_client.get("/api/v1/agent-components")

    # Should return 401 or 403 without auth
    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_create_agent_component_requires_auth(simple_client: AsyncClient):
    """Test that creating agent components requires authentication."""
    response = await simple_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_get_agent_component_requires_auth(simple_client: AsyncClient):
    """Test that getting a specific agent component requires authentication."""
    fake_id = str(uuid.uuid4())
    response = await simple_client.get(f"/api/v1/agent-components/{fake_id}")

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_update_agent_component_requires_auth(simple_client: AsyncClient):
    """Test that updating agent components requires authentication."""
    fake_id = str(uuid.uuid4())
    response = await simple_client.patch(
        f"/api/v1/agent-components/{fake_id}",
        json={"name": "Updated Name"},
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_delete_agent_component_requires_auth(simple_client: AsyncClient):
    """Test that deleting agent components requires authentication."""
    fake_id = str(uuid.uuid4())
    response = await simple_client.delete(f"/api/v1/agent-components/{fake_id}")

    assert response.status_code in [401, 403]


# =============================================================================
# Create Tests
# =============================================================================


@pytest.mark.asyncio
async def test_create_agent_component_success(authenticated_client: AsyncClient):
    """Test successfully creating an agent component from Q&A data."""
    response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )

    assert response.status_code == 201
    data = response.json()

    # Verify response structure
    assert "id" in data
    assert data["name"] == VALID_QA_DATA["name"]
    assert data["qa_who"] == VALID_QA_DATA["who"]
    assert data["qa_rules"] == VALID_QA_DATA["rules"]
    assert data["qa_tricks"] == VALID_QA_DATA["tricks"]
    assert data["icon"] == VALID_QA_DATA["icon"]
    assert data["color"] == VALID_QA_DATA["color"]
    assert data["is_active"] is True
    assert data["is_published"] is False


@pytest.mark.asyncio
async def test_create_agent_component_minimal_data(authenticated_client: AsyncClient):
    """Test creating agent component with minimal required data."""
    response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=MINIMAL_QA_DATA,
    )

    assert response.status_code == 201
    data = response.json()

    # Should have auto-generated name and defaults
    assert "id" in data
    assert data["qa_who"] == MINIMAL_QA_DATA["who"]
    assert data["qa_rules"] == MINIMAL_QA_DATA["rules"]
    assert data["icon"] == "bot"  # Default icon
    assert data["color"] == "#7C3AED"  # Default color


@pytest.mark.asyncio
async def test_create_agent_component_validation_error_who_too_short(
    authenticated_client: AsyncClient,
):
    """Test validation error when 'who' field is too short."""
    invalid_data = {
        "who": "Short",  # Less than 10 characters
        "rules": "Valid rules for the agent assistant",
    }
    response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=invalid_data,
    )

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_create_agent_component_validation_error_missing_required(
    authenticated_client: AsyncClient,
):
    """Test validation error when required fields are missing."""
    invalid_data = {
        "who": "A valid who description that is long enough",
        # Missing 'rules' field
    }
    response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=invalid_data,
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_agent_component_generates_system_prompt(
    authenticated_client: AsyncClient,
):
    """Test that creating an agent component generates a system prompt."""
    response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )

    assert response.status_code == 201
    data = response.json()

    # System prompt should be generated and non-empty
    assert "system_prompt" in data
    assert len(data["system_prompt"]) > 0
    # System prompt should incorporate the Q&A answers
    assert "customer support" in data["system_prompt"].lower() or "support" in data["system_prompt"].lower()


@pytest.mark.asyncio
async def test_create_agent_component_with_tools(authenticated_client: AsyncClient):
    """Test creating agent component with selected tools."""
    data_with_tools = {
        **VALID_QA_DATA,
        "selected_tools": ["web_search", "calculator"],
    }
    response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=data_with_tools,
    )

    assert response.status_code == 201
    data = response.json()

    assert data["selected_tools"] == ["web_search", "calculator"]


# =============================================================================
# Read Tests
# =============================================================================


@pytest.mark.asyncio
async def test_list_agent_components_empty(authenticated_client: AsyncClient):
    """Test listing agent components returns empty list when none exist."""
    response = await authenticated_client.get("/api/v1/agent-components")

    assert response.status_code == 200
    data = response.json()

    assert data["agent_components"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["page_size"] == 20


@pytest.mark.asyncio
async def test_list_agent_components_returns_created(authenticated_client: AsyncClient):
    """Test that listing returns previously created components."""
    # Create a component first
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]

    # List should include the new component
    list_response = await authenticated_client.get("/api/v1/agent-components")

    assert list_response.status_code == 200
    data = list_response.json()

    assert data["total"] == 1
    assert len(data["agent_components"]) == 1
    assert data["agent_components"][0]["id"] == created_id


@pytest.mark.asyncio
async def test_list_agent_components_with_pagination(authenticated_client: AsyncClient):
    """Test listing agent components with pagination parameters."""
    # Create multiple components
    for i in range(5):
        await authenticated_client.post(
            "/api/v1/agent-components/create-from-qa",
            json={
                **MINIMAL_QA_DATA,
                "name": f"Test Agent {i}",
            },
        )

    # Test first page with page_size=2
    response = await authenticated_client.get(
        "/api/v1/agent-components",
        params={"page": 1, "page_size": 2},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["total"] == 5
    assert len(data["agent_components"]) == 2
    assert data["page"] == 1
    assert data["page_size"] == 2

    # Test second page
    response2 = await authenticated_client.get(
        "/api/v1/agent-components",
        params={"page": 2, "page_size": 2},
    )

    data2 = response2.json()
    assert len(data2["agent_components"]) == 2
    assert data2["page"] == 2


@pytest.mark.asyncio
async def test_get_agent_component_by_id(authenticated_client: AsyncClient):
    """Test getting a specific agent component by ID."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    created = create_response.json()
    component_id = created["id"]

    # Get by ID
    response = await authenticated_client.get(f"/api/v1/agent-components/{component_id}")

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == component_id
    assert data["name"] == VALID_QA_DATA["name"]


@pytest.mark.asyncio
async def test_get_agent_component_not_found(authenticated_client: AsyncClient):
    """Test getting a non-existent agent component returns 404."""
    fake_id = str(uuid.uuid4())
    response = await authenticated_client.get(f"/api/v1/agent-components/{fake_id}")

    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_get_agent_component_invalid_uuid(authenticated_client: AsyncClient):
    """Test getting with invalid UUID returns 422."""
    response = await authenticated_client.get("/api/v1/agent-components/not-a-uuid")

    assert response.status_code == 422


# =============================================================================
# Update Tests
# =============================================================================


@pytest.mark.asyncio
async def test_update_agent_component_success(authenticated_client: AsyncClient):
    """Test successfully updating an agent component."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    component_id = create_response.json()["id"]

    # Update it
    update_data = {
        "name": "Updated Support Charlie",
        "description": "An updated description",
        "color": "#EF4444",
    }
    response = await authenticated_client.patch(
        f"/api/v1/agent-components/{component_id}",
        json=update_data,
    )

    assert response.status_code == 200
    data = response.json()

    assert data["name"] == "Updated Support Charlie"
    assert data["description"] == "An updated description"
    assert data["color"] == "#EF4444"
    # Original Q&A data should be preserved
    assert data["qa_who"] == VALID_QA_DATA["who"]


@pytest.mark.asyncio
async def test_update_agent_component_qa_regenerates_prompt(
    authenticated_client: AsyncClient,
):
    """Test that updating Q&A fields regenerates the system prompt."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    created = create_response.json()
    component_id = created["id"]
    original_prompt = created["system_prompt"]

    # Update Q&A field
    update_data = {
        "qa_who": "A technical support engineer who helps with software issues",
    }
    response = await authenticated_client.patch(
        f"/api/v1/agent-components/{component_id}",
        json=update_data,
    )

    assert response.status_code == 200
    data = response.json()

    # System prompt should be regenerated
    assert data["system_prompt"] != original_prompt
    assert data["qa_who"] == update_data["qa_who"]


@pytest.mark.asyncio
async def test_update_agent_component_not_found(authenticated_client: AsyncClient):
    """Test updating a non-existent agent component returns 404."""
    fake_id = str(uuid.uuid4())
    response = await authenticated_client.patch(
        f"/api/v1/agent-components/{fake_id}",
        json={"name": "Updated Name"},
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_agent_component_partial(authenticated_client: AsyncClient):
    """Test partial update only changes specified fields."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    created = create_response.json()
    component_id = created["id"]

    # Update only the icon
    response = await authenticated_client.patch(
        f"/api/v1/agent-components/{component_id}",
        json={"icon": "star"},
    )

    assert response.status_code == 200
    data = response.json()

    # Only icon should change
    assert data["icon"] == "star"
    # Other fields preserved
    assert data["name"] == VALID_QA_DATA["name"]
    assert data["color"] == VALID_QA_DATA["color"]


# =============================================================================
# Delete Tests
# =============================================================================


@pytest.mark.asyncio
async def test_delete_agent_component_success(authenticated_client: AsyncClient):
    """Test successfully deleting an agent component."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    component_id = create_response.json()["id"]

    # Delete it
    response = await authenticated_client.delete(
        f"/api/v1/agent-components/{component_id}"
    )

    assert response.status_code == 204

    # Verify it's gone
    get_response = await authenticated_client.get(
        f"/api/v1/agent-components/{component_id}"
    )
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_agent_component_not_found(authenticated_client: AsyncClient):
    """Test deleting a non-existent agent component returns 404."""
    fake_id = str(uuid.uuid4())
    response = await authenticated_client.delete(f"/api/v1/agent-components/{fake_id}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_removes_from_list(authenticated_client: AsyncClient):
    """Test that deleted component no longer appears in list."""
    # Create two components
    response1 = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json={**MINIMAL_QA_DATA, "name": "Agent 1"},
    )
    response2 = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json={**MINIMAL_QA_DATA, "name": "Agent 2"},
    )
    id1 = response1.json()["id"]
    id2 = response2.json()["id"]

    # Delete first one
    await authenticated_client.delete(f"/api/v1/agent-components/{id1}")

    # List should only have the second one
    list_response = await authenticated_client.get("/api/v1/agent-components")
    data = list_response.json()

    assert data["total"] == 1
    assert data["agent_components"][0]["id"] == id2


# =============================================================================
# Additional Endpoint Tests
# =============================================================================


@pytest.mark.asyncio
async def test_duplicate_agent_component(authenticated_client: AsyncClient):
    """Test duplicating an agent component."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    component_id = create_response.json()["id"]

    # Duplicate it
    response = await authenticated_client.post(
        f"/api/v1/agent-components/{component_id}/duplicate"
    )

    assert response.status_code == 201
    data = response.json()

    # Should have a new ID but same Q&A data
    assert data["id"] != component_id
    assert data["qa_who"] == VALID_QA_DATA["who"]
    assert data["qa_rules"] == VALID_QA_DATA["rules"]
    # Name should indicate it's a copy
    assert "Copy" in data["name"] or data["name"] != VALID_QA_DATA["name"]


@pytest.mark.asyncio
async def test_duplicate_with_custom_name(authenticated_client: AsyncClient):
    """Test duplicating with a custom name."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    component_id = create_response.json()["id"]

    # Duplicate with custom name
    response = await authenticated_client.post(
        f"/api/v1/agent-components/{component_id}/duplicate",
        params={"new_name": "Custom Duplicate Name"},
    )

    assert response.status_code == 201
    data = response.json()

    assert data["name"] == "Custom Duplicate Name"


@pytest.mark.asyncio
async def test_export_agent_component(authenticated_client: AsyncClient):
    """Test exporting an agent component as JSON."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    component_id = create_response.json()["id"]

    # Export it
    response = await authenticated_client.get(
        f"/api/v1/agent-components/{component_id}/export"
    )

    assert response.status_code == 200
    data = response.json()

    # Should have export format
    assert data["name"] == VALID_QA_DATA["name"]
    assert data["qa_who"] == VALID_QA_DATA["who"]
    assert data["type"] == "agent_component"
    assert "version" in data


@pytest.mark.asyncio
async def test_import_agent_component(authenticated_client: AsyncClient):
    """Test importing an agent component from JSON."""
    import_data = {
        "name": "Imported Agent",
        "description": "An imported agent",
        "qa_who": "A helpful assistant that was imported",
        "qa_rules": "Follow the imported rules carefully",
        "qa_tricks": "",
        "system_prompt": "You are an imported assistant.",
        "icon": "upload",
        "color": "#10B981",
        "type": "agent_component",
        "version": "1.3",
    }

    response = await authenticated_client.post(
        "/api/v1/agent-components/import",
        json=import_data,
    )

    assert response.status_code == 201
    data = response.json()

    # Should be imported with "(Imported)" suffix
    assert "Imported" in data["name"]
    assert data["qa_who"] == import_data["qa_who"]
    assert data["icon"] == import_data["icon"]


@pytest.mark.asyncio
async def test_list_active_only_filter(authenticated_client: AsyncClient):
    """Test filtering list to active components only."""
    # Create a component
    create_response = await authenticated_client.post(
        "/api/v1/agent-components/create-from-qa",
        json=VALID_QA_DATA,
    )
    component_id = create_response.json()["id"]

    # Deactivate it
    await authenticated_client.patch(
        f"/api/v1/agent-components/{component_id}",
        json={"is_active": False},
    )

    # List with active_only=True (default)
    response = await authenticated_client.get("/api/v1/agent-components")
    data = response.json()

    # Should not include the deactivated component
    assert data["total"] == 0

    # List with active_only=False
    response2 = await authenticated_client.get(
        "/api/v1/agent-components",
        params={"active_only": False},
    )
    data2 = response2.json()

    # Should include the deactivated component
    assert data2["total"] == 1
