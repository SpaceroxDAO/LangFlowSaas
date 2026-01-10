"""
AgentComponent model - stores reusable AI agent components created via Q&A wizard.

These are the "personality" definitions that can be published to appear
in the Langflow sidebar for use in workflows.
"""
import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project


class AgentComponent(BaseModel):
    """
    A reusable AI agent component created via the Q&A wizard.

    AgentComponents define the "personality" of an AI agent:
    - Who they are (qa_who)
    - What rules they follow (qa_rules)
    - What tools they can use (qa_tricks)

    When published, they appear in the Langflow sidebar under "My Agents"
    and can be dragged into workflows.
    """

    __tablename__ = "agent_components"

    # Owner relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Project relationship (nullable for migration)
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        String(36),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Project this agent component belongs to",
    )

    # Agent identity
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Visual customization
    icon: Mapped[str] = mapped_column(
        String(50),
        default="bot",
        nullable=False,
        comment="Icon name for the agent component",
    )

    color: Mapped[str] = mapped_column(
        String(20),
        default="#7C3AED",
        nullable=False,
        comment="Hex color for the agent component",
    )

    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="URL to AI-generated avatar image",
    )

    # Q&A answers from onboarding (used for template mapping)
    qa_who: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Answer to: Who is Charlie? What kind of job does he have?",
    )

    qa_rules: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Answer to: What are the rules to his job?",
    )

    qa_tricks: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
        comment="Answer to: What tricks does Charlie know? (tools)",
    )

    # Selected tools (array of tool IDs)
    selected_tools: Mapped[Optional[list]] = mapped_column(
        JSON,
        nullable=True,
        default=None,
        comment="Array of selected tool IDs (e.g., ['web_search', 'weather'])",
    )

    # Knowledge sources for RAG (array of knowledge source IDs)
    knowledge_source_ids: Mapped[Optional[list]] = mapped_column(
        JSON,
        nullable=True,
        default=None,
        comment="Array of knowledge source IDs for RAG retrieval",
    )

    # Generated system prompt (from Q&A mapping)
    system_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Advanced configuration for published components
    # Stores model settings, temperature, max_tokens, etc.
    advanced_config: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        default=None,
        comment="Advanced configuration: model_provider, model_name, temperature, max_tokens, etc.",
    )

    # Python component file (for sidebar publishing)
    component_file_path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Path to generated Python component file",
    )

    component_class_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Python class name for the component",
    )

    # Publishing status
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether this agent appears in Langflow sidebar",
    )

    # Agent status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="agent_components",
        lazy="select",
    )

    project: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="agent_components",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<AgentComponent(id={self.id}, name={self.name}, published={self.is_published})>"
