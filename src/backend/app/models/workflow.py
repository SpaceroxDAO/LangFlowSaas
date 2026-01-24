"""
Workflow model - stores Langflow flows that orchestrate agent components and tools.

Workflows are the actual executable flows in Langflow. They can contain
multiple agent components, tools, and other nodes connected together.
"""
import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.project import Project
    from app.models.conversation import Conversation


class Workflow(BaseModel):
    """
    A Langflow workflow (flow) that orchestrates components.

    Workflows are complete AI pipelines that can include:
    - Agent components (from AgentComponent)
    - Built-in Langflow components
    - MCP tools
    - Custom logic

    Users can chat with workflows in the Playground.
    """

    __tablename__ = "workflows"

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
        comment="Project this workflow belongs to",
    )

    # Workflow identity
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Langflow integration
    langflow_flow_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="UUID of the flow in Langflow",
    )

    # Cached flow JSON for reference and export
    flow_data: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
        comment="Cached copy of Langflow flow JSON",
    )

    # Track which agent components are used in this workflow
    # Stored as JSON array of UUIDs for flexibility
    agent_component_ids: Mapped[Optional[list]] = mapped_column(
        JSON,
        nullable=True,
        default=list,
        comment="Array of AgentComponent IDs used in this workflow",
    )

    # Workflow status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Sharing/publishing
    is_public: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether this workflow can be accessed via public link",
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="workflows",
        lazy="joined",
    )

    project: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="workflows",
        lazy="select",
    )

    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation",
        back_populates="workflow",
        lazy="select",
        cascade="all, delete-orphan",
        foreign_keys="Conversation.workflow_id",
    )

    def __repr__(self) -> str:
        return f"<Workflow(id={self.id}, name={self.name})>"
