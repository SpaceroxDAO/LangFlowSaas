"""
User schemas for request/response validation.
"""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user from Clerk data."""

    clerk_id: str


class UserUpdate(BaseModel):
    """Schema for updating user data."""

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user responses."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    clerk_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    @property
    def full_name(self) -> str:
        """Get user's full name."""
        parts = [p for p in [self.first_name, self.last_name] if p]
        return " ".join(parts) if parts else str(self.email)
