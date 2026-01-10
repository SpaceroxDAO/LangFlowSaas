"""
KnowledgeService for managing knowledge sources (RAG documents).

Handles file storage, URL fetching, and metadata management.
Actual RAG processing (embedding, vector storage) is done by Langflow
components at flow runtime.
"""
import logging
import os
import uuid
import hashlib
import httpx
from pathlib import Path
from typing import List, Optional, Tuple
from datetime import datetime

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge_source import KnowledgeSource
from app.models.user import User
from app.config import settings

logger = logging.getLogger(__name__)

# Storage configuration
KNOWLEDGE_STORAGE_DIR = Path(settings.upload_dir if hasattr(settings, 'upload_dir') else "uploads") / "knowledge"


class KnowledgeServiceError(Exception):
    """Exception raised when knowledge source operations fail."""
    pass


class KnowledgeService:
    """Service for knowledge source CRUD operations and file management."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self._ensure_storage_dir()

    def _ensure_storage_dir(self):
        """Ensure the knowledge storage directory exists."""
        KNOWLEDGE_STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    def _get_user_storage_path(self, user_id: str) -> Path:
        """Get the storage directory for a user."""
        user_dir = KNOWLEDGE_STORAGE_DIR / user_id
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir

    def _generate_safe_filename(self, original_filename: str, user_id: str) -> str:
        """Generate a unique, safe filename."""
        # Get extension
        ext = Path(original_filename).suffix.lower()
        # Create unique name
        unique_id = hashlib.md5(f"{user_id}{original_filename}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:12]
        safe_name = f"{unique_id}{ext}"
        return safe_name

    async def get_by_id(
        self,
        source_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Optional[KnowledgeSource]:
        """Get a knowledge source by ID."""
        stmt = select(KnowledgeSource).where(
            KnowledgeSource.id == str(source_id),
            KnowledgeSource.user_id == str(user_id),
            KnowledgeSource.is_active == True,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: uuid.UUID,
        project_id: Optional[uuid.UUID] = None,
        page: int = 1,
        page_size: int = 50,
    ) -> Tuple[List[KnowledgeSource], int]:
        """List knowledge sources for a user with pagination."""
        user_id_str = str(user_id)
        stmt = select(KnowledgeSource).where(
            KnowledgeSource.user_id == user_id_str,
            KnowledgeSource.is_active == True,
        )

        if project_id:
            stmt = stmt.where(KnowledgeSource.project_id == str(project_id))

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        stmt = stmt.order_by(KnowledgeSource.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(stmt)
        sources = list(result.scalars().all())

        return sources, total

    async def create_from_file(
        self,
        user: User,
        file_content: bytes,
        filename: str,
        mime_type: str,
        project_id: Optional[uuid.UUID] = None,
    ) -> KnowledgeSource:
        """
        Create a knowledge source from an uploaded file.

        Args:
            user: The user uploading the file
            file_content: The file bytes
            filename: Original filename
            mime_type: MIME type of the file
            project_id: Optional project to associate with

        Returns:
            Created KnowledgeSource
        """
        user_id_str = str(user.id)

        # Generate safe filename and path
        safe_filename = self._generate_safe_filename(filename, user_id_str)
        user_storage = self._get_user_storage_path(user_id_str)
        file_path = user_storage / safe_filename

        # Write file to disk
        try:
            with open(file_path, "wb") as f:
                f.write(file_content)
        except IOError as e:
            logger.error(f"Failed to write file {file_path}: {e}")
            raise KnowledgeServiceError(f"Failed to save file: {e}")

        # Generate content preview (first 500 chars for text files)
        content_preview = None
        if mime_type in ["text/plain", "text/markdown", "text/csv"]:
            try:
                content_preview = file_content[:500].decode("utf-8", errors="ignore")
            except Exception:
                pass

        # Create database record
        source = KnowledgeSource(
            user_id=user_id_str,
            project_id=str(project_id) if project_id else None,
            name=filename,
            source_type="file",
            file_path=str(file_path.relative_to(KNOWLEDGE_STORAGE_DIR.parent)),
            original_filename=filename,
            mime_type=mime_type,
            file_size=len(file_content),
            status="ready",  # Files are ready immediately (processing happens in Langflow)
            content_preview=content_preview,
        )

        self.session.add(source)
        await self.session.flush()
        await self.session.refresh(source)

        logger.info(f"Created knowledge source {source.id} from file {filename}")
        return source

    async def create_from_url(
        self,
        user: User,
        url: str,
        name: Optional[str] = None,
        project_id: Optional[uuid.UUID] = None,
    ) -> KnowledgeSource:
        """
        Create a knowledge source from a URL.

        Args:
            user: The user adding the URL
            url: The URL to fetch
            name: Optional display name
            project_id: Optional project to associate with

        Returns:
            Created KnowledgeSource
        """
        user_id_str = str(user.id)

        # Extract domain for default name
        if not name:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            name = parsed.netloc or url[:50]

        # Fetch URL content
        content = None
        content_preview = None
        status = "ready"
        error_message = None

        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                response = await client.get(url)
                response.raise_for_status()
                content = response.text
                content_preview = content[:500] if content else None
        except httpx.HTTPError as e:
            logger.warning(f"Failed to fetch URL {url}: {e}")
            status = "error"
            error_message = f"Failed to fetch URL: {str(e)}"
        except Exception as e:
            logger.warning(f"Error processing URL {url}: {e}")
            status = "error"
            error_message = str(e)

        # Optionally save content to file for persistence
        file_path = None
        if content and status == "ready":
            safe_filename = self._generate_safe_filename(f"{name}.txt", user_id_str)
            user_storage = self._get_user_storage_path(user_id_str)
            local_path = user_storage / safe_filename
            try:
                with open(local_path, "w", encoding="utf-8") as f:
                    f.write(content)
                file_path = str(local_path.relative_to(KNOWLEDGE_STORAGE_DIR.parent))
            except IOError as e:
                logger.warning(f"Failed to cache URL content: {e}")

        # Create database record
        source = KnowledgeSource(
            user_id=user_id_str,
            project_id=str(project_id) if project_id else None,
            name=name,
            source_type="url",
            url=url,
            file_path=file_path,
            file_size=len(content) if content else None,
            status=status,
            error_message=error_message,
            content_preview=content_preview,
        )

        self.session.add(source)
        await self.session.flush()
        await self.session.refresh(source)

        logger.info(f"Created knowledge source {source.id} from URL {url}")
        return source

    async def create_from_text(
        self,
        user: User,
        content: str,
        name: str,
        project_id: Optional[uuid.UUID] = None,
    ) -> KnowledgeSource:
        """
        Create a knowledge source from pasted text.

        Args:
            user: The user adding the text
            content: The text content
            name: Display name
            project_id: Optional project to associate with

        Returns:
            Created KnowledgeSource
        """
        user_id_str = str(user.id)

        # Save content to file
        safe_filename = self._generate_safe_filename(f"{name}.txt", user_id_str)
        user_storage = self._get_user_storage_path(user_id_str)
        file_path = user_storage / safe_filename

        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
        except IOError as e:
            logger.error(f"Failed to write text content: {e}")
            raise KnowledgeServiceError(f"Failed to save content: {e}")

        # Create database record
        source = KnowledgeSource(
            user_id=user_id_str,
            project_id=str(project_id) if project_id else None,
            name=name,
            source_type="text",
            file_path=str(file_path.relative_to(KNOWLEDGE_STORAGE_DIR.parent)),
            mime_type="text/plain",
            file_size=len(content.encode("utf-8")),
            status="ready",
            content_preview=content[:500],
        )

        self.session.add(source)
        await self.session.flush()
        await self.session.refresh(source)

        logger.info(f"Created knowledge source {source.id} from text")
        return source

    async def delete(self, source: KnowledgeSource) -> bool:
        """
        Delete a knowledge source.

        Soft deletes the database record and optionally removes the file.
        """
        # Delete file if exists
        if source.file_path:
            full_path = KNOWLEDGE_STORAGE_DIR.parent / source.file_path
            try:
                if full_path.exists():
                    full_path.unlink()
                    logger.info(f"Deleted file {full_path}")
            except IOError as e:
                logger.warning(f"Failed to delete file {full_path}: {e}")

        # Soft delete record
        source.is_active = False
        await self.session.flush()

        logger.info(f"Deleted knowledge source {source.id}")
        return True

    def get_file_absolute_path(self, source: KnowledgeSource) -> Optional[Path]:
        """Get the absolute file path for a knowledge source."""
        if not source.file_path:
            return None
        return KNOWLEDGE_STORAGE_DIR.parent / source.file_path

    async def get_sources_by_ids(
        self,
        source_ids: List[str],
        user_id: uuid.UUID,
    ) -> List[KnowledgeSource]:
        """Get multiple knowledge sources by their IDs."""
        logger.info(f"get_sources_by_ids called with source_ids={source_ids}, user_id={user_id}")
        if not source_ids:
            logger.warning("No source_ids provided")
            return []

        user_id_str = str(user_id)
        logger.info(f"Querying knowledge_sources with IDs in {source_ids} for user {user_id_str}")
        stmt = select(KnowledgeSource).where(
            KnowledgeSource.id.in_(source_ids),
            KnowledgeSource.user_id == user_id_str,
            KnowledgeSource.is_active == True,
            KnowledgeSource.status == "ready",
        )
        result = await self.session.execute(stmt)
        sources = list(result.scalars().all())
        logger.info(f"Found {len(sources)} matching sources")
        return sources

    async def load_combined_content(
        self,
        source_ids: List[str],
        user_id: uuid.UUID,
        max_total_chars: int = 100000,
    ) -> str:
        """
        Load and combine content from multiple knowledge sources.

        Args:
            source_ids: List of knowledge source IDs to load
            user_id: The user ID (for access control)
            max_total_chars: Maximum total characters to include

        Returns:
            Combined text content from all sources
        """
        logger.info(f"load_combined_content called with source_ids={source_ids}, user_id={user_id}")

        if not source_ids:
            logger.warning("No source_ids provided to load_combined_content")
            return ""

        sources = await self.get_sources_by_ids(source_ids, user_id)
        logger.info(f"get_sources_by_ids returned {len(sources)} sources")
        if not sources:
            logger.warning("No sources found for the given IDs")
            return ""

        combined_parts = []
        total_chars = 0

        for source in sources:
            file_path = self.get_file_absolute_path(source)
            if not file_path or not file_path.exists():
                logger.warning(f"File not found for source {source.id}: {file_path}")
                continue

            try:
                # Read file content
                content = ""

                # Handle different file types
                if source.mime_type in ["text/plain", "text/markdown", "text/csv", "application/octet-stream"]:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                elif source.mime_type == "application/pdf":
                    # For PDFs, try to extract text if pypdf is available
                    try:
                        from pypdf import PdfReader
                        reader = PdfReader(str(file_path))
                        content = "\n\n".join(page.extract_text() or "" for page in reader.pages)
                    except ImportError:
                        logger.warning("pypdf not installed, cannot extract PDF text")
                        # Use content_preview as fallback
                        content = source.content_preview or ""
                    except Exception as e:
                        logger.warning(f"Failed to extract PDF text: {e}")
                        content = source.content_preview or ""

                elif source.mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    # For .docx files, extract text using python-docx
                    try:
                        from docx import Document
                        doc = Document(str(file_path))
                        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
                        content = "\n\n".join(paragraphs)
                        logger.info(f"Extracted {len(paragraphs)} paragraphs from .docx file")
                    except ImportError:
                        logger.warning("python-docx not installed, cannot extract .docx text")
                        content = source.content_preview or ""
                    except Exception as e:
                        logger.warning(f"Failed to extract .docx text: {e}")
                        content = source.content_preview or ""

                else:
                    # For other types, try reading as text
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                    except Exception as e:
                        logger.warning(f"Failed to read file {file_path}: {e}")
                        content = source.content_preview or ""

                if content:
                    # Add source header
                    section = f"\n\n--- {source.name} ---\n\n{content.strip()}"

                    # Check if we have room
                    if total_chars + len(section) > max_total_chars:
                        # Truncate this section
                        remaining = max_total_chars - total_chars
                        if remaining > 100:  # Only add if meaningful
                            section = section[:remaining] + "\n... (truncated)"
                            combined_parts.append(section)
                        break

                    combined_parts.append(section)
                    total_chars += len(section)

            except Exception as e:
                logger.error(f"Error loading content from source {source.id}: {e}")
                continue

        return "\n".join(combined_parts).strip()
