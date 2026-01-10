"""
File service for managing user uploaded files.
"""
import logging
import os
import shutil
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Tuple

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.user_file import UserFile

logger = logging.getLogger(__name__)

# Base directory for file uploads (relative to backend)
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"

# Allowed file extensions and their MIME types
ALLOWED_EXTENSIONS = {
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".csv": "text/csv",
    ".json": "application/json",
    ".md": "text/markdown",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
}

# Max file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024


class FileServiceError(Exception):
    """Exception raised when file operations fail."""
    pass


class FileService:
    """Service for user file CRUD operations."""

    def __init__(self, session: AsyncSession):
        self.session = session
        # Ensure uploads directory exists
        UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    async def list_files(
        self,
        user_id: uuid.UUID,
        project_id: Optional[uuid.UUID] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[UserFile], int]:
        """
        List files for a user with pagination.

        Args:
            user_id: User's ID
            project_id: Optional project filter
            page: Page number (1-indexed)
            page_size: Items per page

        Returns:
            Tuple of (files list, total count)
        """
        user_id_str = str(user_id)
        stmt = select(UserFile).where(UserFile.user_id == user_id_str)

        if project_id:
            stmt = stmt.where(UserFile.project_id == str(project_id))

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(UserFile.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        files = list(result.scalars().all())

        return files, total

    async def get_file(
        self,
        file_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Optional[UserFile]:
        """
        Get a file by ID, ensuring user ownership.

        Args:
            file_id: File ID
            user_id: User ID for ownership check

        Returns:
            UserFile if found and owned by user, else None
        """
        stmt = select(UserFile).where(
            UserFile.id == str(file_id),
            UserFile.user_id == str(user_id),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def upload_file(
        self,
        user: User,
        filename: str,
        content: bytes,
        content_type: str,
        project_id: Optional[uuid.UUID] = None,
        description: Optional[str] = None,
    ) -> UserFile:
        """
        Upload a new file.

        Args:
            user: User uploading the file
            filename: Original filename
            content: File content as bytes
            content_type: MIME type
            project_id: Optional project to associate with
            description: Optional description

        Returns:
            Created UserFile record

        Raises:
            FileServiceError: If validation fails
        """
        # Validate file extension
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise FileServiceError(
                f"File type '{ext}' not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS.keys())}"
            )

        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            raise FileServiceError(
                f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB"
            )

        # Generate unique filename
        file_uuid = str(uuid.uuid4())
        stored_filename = f"{file_uuid}{ext}"

        # Create user-specific directory
        user_dir = UPLOADS_DIR / str(user.id)
        user_dir.mkdir(parents=True, exist_ok=True)

        # Save file to disk
        file_path = user_dir / stored_filename
        try:
            file_path.write_bytes(content)
        except Exception as e:
            logger.error(f"Failed to write file to disk: {e}")
            raise FileServiceError("Failed to save file")

        # Create database record
        user_file = UserFile(
            user_id=str(user.id),
            project_id=str(project_id) if project_id else None,
            filename=stored_filename,
            original_filename=filename,
            content_type=content_type,
            size=len(content),
            storage_path=f"{user.id}/{stored_filename}",
            description=description,
        )

        self.session.add(user_file)
        await self.session.flush()
        await self.session.refresh(user_file)

        logger.info(f"Uploaded file {user_file.id} for user {user.id}")
        return user_file

    async def delete_file(
        self,
        file_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> bool:
        """
        Delete a file.

        Args:
            file_id: File ID
            user_id: User ID for ownership check

        Returns:
            True if deleted, False if not found

        Raises:
            FileServiceError: If deletion fails
        """
        user_file = await self.get_file(file_id, user_id)
        if not user_file:
            return False

        # Delete file from disk
        file_path = UPLOADS_DIR / user_file.storage_path
        try:
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            logger.error(f"Failed to delete file from disk: {e}")
            # Continue with database deletion even if file deletion fails

        # Delete database record
        await self.session.delete(user_file)
        await self.session.flush()

        logger.info(f"Deleted file {file_id}")
        return True

    def get_file_path(self, user_file: UserFile) -> Path:
        """
        Get the full path to a file on disk.

        Args:
            user_file: UserFile record

        Returns:
            Path to the file
        """
        return UPLOADS_DIR / user_file.storage_path

    def get_file_url(self, user_file: UserFile) -> str:
        """
        Get the URL to access a file.

        Args:
            user_file: UserFile record

        Returns:
            URL path for the file
        """
        return f"/api/v1/files/{user_file.id}/download"

    async def get_storage_stats(self, user_id: uuid.UUID) -> dict:
        """
        Get storage statistics for a user.

        Args:
            user_id: User ID

        Returns:
            Dict with storage stats
        """
        stmt = select(
            func.count(UserFile.id).label("file_count"),
            func.coalesce(func.sum(UserFile.size), 0).label("total_size"),
        ).where(UserFile.user_id == str(user_id))

        result = await self.session.execute(stmt)
        row = result.one()

        return {
            "file_count": row.file_count,
            "total_size": row.total_size,
            "total_size_mb": round(row.total_size / (1024 * 1024), 2),
        }
