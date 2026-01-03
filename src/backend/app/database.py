"""
Async SQLAlchemy 2.0 database setup for FastAPI with PostgreSQL.
"""
import uuid
from datetime import datetime
from typing import Annotated, AsyncGenerator

from fastapi import Depends
from sqlalchemy import DateTime, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func

from app.config import settings

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(AsyncAttrs, DeclarativeBase):
    """Base class for all database models."""

    pass


# Type annotations for common column patterns
UUIDPrimaryKey = Annotated[
    uuid.UUID,
    mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    ),
]

CreatedAt = Annotated[
    datetime,
    mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    ),
]

UpdatedAt = Annotated[
    datetime,
    mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    ),
]


class TimestampMixin:
    """Mixin that adds created_at and updated_at timestamp fields."""

    created_at: Mapped[CreatedAt]
    updated_at: Mapped[UpdatedAt]


class UUIDMixin:
    """Mixin that adds UUID primary key."""

    id: Mapped[UUIDPrimaryKey]


class BaseModel(UUIDMixin, TimestampMixin, Base):
    """Abstract base model with UUID primary key and timestamps."""

    __abstract__ = True

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}(id={self.id})>"


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that provides an async database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Type alias for cleaner dependency injection
AsyncSessionDep = Annotated[AsyncSession, Depends(get_async_session)]


async def create_tables() -> None:
    """Create all tables. Use Alembic migrations in production."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_tables() -> None:
    """Drop all tables. Use only for testing."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
