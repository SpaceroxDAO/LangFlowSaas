"""
User service for managing user data.
"""
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.middleware.clerk_auth import ClerkUser
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """Service for user CRUD operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        """Get user by ID."""
        # Convert UUID to string for SQLite/PostgreSQL compatibility
        user_id_str = str(user_id)
        stmt = select(User).where(User.id == user_id_str)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_clerk_id(self, clerk_id: str) -> Optional[User]:
        """Get user by Clerk ID."""
        stmt = select(User).where(User.clerk_id == clerk_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user_data: UserCreate) -> User:
        """Create a new user."""
        user = User(
            clerk_id=user_data.clerk_id,
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
        )
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def update(self, user: User, user_data: UserUpdate) -> User:
        """Update user data."""
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def get_or_create_from_clerk(
        self,
        clerk_user: ClerkUser,
        email: str = None,
    ) -> User:
        """
        Get existing user or create new user from Clerk data.

        This is called on every authenticated request to ensure
        the user exists in our database.
        """
        # First try to find by clerk_id
        user = await self.get_by_clerk_id(clerk_user.user_id)

        if user:
            return user

        # User doesn't exist, create new one
        # Email might be in the token or passed separately
        user_email = email or clerk_user.email

        if not user_email:
            # Generate placeholder email from Clerk user ID
            # This allows the app to work even if Clerk JWT doesn't include email
            user_email = f"{clerk_user.user_id}@clerk.placeholder"

        user_create = UserCreate(
            clerk_id=clerk_user.user_id,
            email=user_email,
        )

        return await self.create(user_create)

    async def delete(self, user: User) -> bool:
        """Delete a user."""
        await self.session.delete(user)
        await self.session.flush()
        return True
