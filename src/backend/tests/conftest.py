"""
Pytest configuration and fixtures for backend tests.

Uses SQLite in-memory database for unit tests (no Docker required).
"""
import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import JSON, event
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_async_session


# Use SQLite in-memory for tests (no PostgreSQL required)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# Register type adapter for PostgreSQL JSONB -> SQLite JSON
# This is needed because some models use JSONB which SQLite doesn't support
@event.listens_for(Base.metadata, "before_create")
def _set_jsonb_to_json(target, connection, **kw):
    """Convert JSONB columns to JSON for SQLite compatibility."""
    from sqlalchemy.dialects.postgresql import JSONB

    # Only apply for SQLite connections
    if 'sqlite' not in str(connection.engine.url):
        return

    # Iterate through all tables and convert JSONB to JSON
    for table in target.tables.values():
        for column in table.columns:
            if isinstance(column.type, JSONB):
                column.type = JSON()


# Create test engine with SQLite-specific settings
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # Required for in-memory SQLite
)

# Create test session factory
test_session_maker = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def test_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async with test_session_maker() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def client(setup_test_database) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an HTTP client for testing the API.
    Imports app lazily to avoid module-level database connection.
    """
    # Import app here to avoid early database initialization
    from app.main import app

    async def override_get_session():
        async with test_session_maker() as session:
            try:
                yield session
                await session.commit()  # Commit on success like the real session
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_async_session] = override_get_session

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def setup_test_database():
    """
    Create test database tables before each test.
    Uses function scope for isolation.
    """
    # Import all models to ensure they're registered with Base.metadata
    # This is required because SQLAlchemy only knows about models that have been imported
    from app.models import (  # noqa: F401
        user,
        project,
        agent_component,
        workflow,
        conversation,
        mcp_server,
        user_settings,
        agent_preset,
        user_file,
        knowledge_source,
        billing_event,
        subscription,
        analytics_daily,
        mission,
        user_mission_progress,
        user_connection,
    )

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# Mock Clerk token for testing
TEST_CLERK_USER_ID = "user_test123456789"
TEST_CLERK_EMAIL = "test@example.com"


@pytest.fixture
def mock_auth_headers() -> dict:
    """
    Headers that simulate authenticated requests.
    In tests, we bypass real Clerk verification.
    """
    return {}
