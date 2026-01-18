"""
Agent Preset Model

Pre-built agent templates that users can start from when creating agents.
Based on templates from langflow-factory and community contributions.
"""
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import Column, String, Text, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid

from app.database import Base


class AgentPreset(Base):
    """
    A pre-built agent template users can start from.

    Presets provide:
    - Pre-filled Q&A answers (who, rules, tools)
    - Categorization for browsing
    - Default configuration settings
    """
    __tablename__ = "agent_presets"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Identity
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=False, default="Bot")  # Lucide icon name
    category = Column(String(100), nullable=False, default="general")

    # Pre-filled Q&A content
    who = Column(Text, nullable=False)  # Step 1: Identity
    rules = Column(Text, nullable=True)  # Step 2: Rules/Knowledge
    tools = Column(JSON, nullable=True)  # Step 3: Tools/Actions

    # Pre-built system prompt (generated from Q&A)
    system_prompt = Column(Text, nullable=True)

    # Advanced configuration defaults
    model_provider = Column(String(50), default="OpenAI")
    model_name = Column(String(100), default="gpt-4o-mini")
    temperature = Column(String(10), default="0.7")

    # Display options
    gradient = Column(String(50), default="purple-pink")  # CSS gradient class
    tags = Column(JSON, default=list)  # ["support", "rag", "automation"]

    # Metadata
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(String(10), default="100")

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API response."""
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "icon": self.icon,
            "category": self.category,
            "who": self.who,
            "rules": self.rules,
            "tools": self.tools,
            "system_prompt": self.system_prompt,
            "model_provider": self.model_provider,
            "model_name": self.model_name,
            "temperature": self.temperature,
            "gradient": self.gradient,
            "tags": self.tags or [],
            "is_featured": self.is_featured,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# Default presets to seed the database
DEFAULT_PRESETS = [
    {
        "name": "Customer Support",
        "description": "A friendly support agent that helps users with questions and issues.",
        "icon": "Headphones",
        "category": "support",
        "who": "You are a helpful customer support agent. You're friendly, patient, and focused on solving customer problems efficiently.",
        "rules": "- Always be polite and professional\n- Ask clarifying questions when needed\n- Provide step-by-step solutions\n- Escalate complex issues appropriately\n- Keep responses concise but thorough",
        "tools": ["knowledge_search"],
        "gradient": "blue-cyan",
        "tags": ["support", "customer-service"],
        "is_featured": True,
        "sort_order": "10",
    },
    {
        "name": "Document Assistant",
        "description": "An AI that answers questions based on your uploaded documents.",
        "icon": "FileText",
        "category": "rag",
        "who": "You are a document analysis assistant. You help users find and understand information from their documents.",
        "rules": "- Base answers only on the provided documents\n- Quote relevant passages when possible\n- Clearly state when information isn't in the documents\n- Summarize complex content clearly\n- Highlight key points and takeaways",
        "tools": ["knowledge_search"],
        "gradient": "orange-red",
        "tags": ["rag", "documents", "q&a"],
        "is_featured": True,
        "sort_order": "20",
    },
    {
        "name": "Sales Assistant",
        "description": "A knowledgeable sales helper that qualifies leads and answers product questions.",
        "icon": "TrendingUp",
        "category": "sales",
        "who": "You are a friendly sales assistant. You help potential customers understand products and make informed decisions.",
        "rules": "- Focus on understanding customer needs first\n- Highlight relevant product benefits\n- Be honest about limitations\n- Provide pricing information when asked\n- Offer to schedule demos or calls",
        "tools": ["knowledge_search"],
        "gradient": "green-teal",
        "tags": ["sales", "lead-qualification"],
        "is_featured": True,
        "sort_order": "30",
    },
    {
        "name": "Technical Expert",
        "description": "A coding and technical assistant that helps with development questions.",
        "icon": "Code",
        "category": "developer",
        "who": "You are a technical expert. You help developers with coding questions, debugging, and best practices.",
        "rules": "- Provide working code examples\n- Explain your reasoning\n- Follow best practices and conventions\n- Consider security and performance\n- Suggest alternative approaches when relevant",
        "tools": ["knowledge_search"],
        "gradient": "slate-gray",
        "tags": ["developer", "code", "technical"],
        "is_featured": False,
        "sort_order": "40",
    },
    {
        "name": "Writing Assistant",
        "description": "A creative writing helper for content, emails, and documentation.",
        "icon": "PenTool",
        "category": "content",
        "who": "You are a professional writing assistant. You help with creating, editing, and improving written content.",
        "rules": "- Adapt tone and style to the audience\n- Focus on clarity and readability\n- Suggest improvements without being overly critical\n- Maintain consistent voice throughout\n- Offer multiple variations when helpful",
        "tools": [],
        "gradient": "pink-rose",
        "tags": ["writing", "content", "marketing"],
        "is_featured": False,
        "sort_order": "50",
    },
    {
        "name": "Data Analyst",
        "description": "An AI assistant that helps analyze and interpret data.",
        "icon": "BarChart",
        "category": "analytics",
        "who": "You are a data analysis assistant. You help users understand their data, find insights, and make data-driven decisions.",
        "rules": "- Explain statistical concepts in plain language\n- Visualize data when possible\n- Highlight significant trends and outliers\n- Provide actionable insights\n- Consider data quality and limitations",
        "tools": ["knowledge_search"],
        "gradient": "purple-indigo",
        "tags": ["analytics", "data", "insights"],
        "is_featured": False,
        "sort_order": "60",
    },
    {
        "name": "Meeting Assistant",
        "description": "Helps with meeting notes, action items, and follow-ups.",
        "icon": "Calendar",
        "category": "productivity",
        "who": "You are a meeting assistant. You help organize meetings, capture notes, and track action items.",
        "rules": "- Capture key decisions and action items\n- Identify owners and deadlines\n- Summarize discussions concisely\n- Flag unresolved issues\n- Suggest follow-up topics",
        "tools": [],
        "gradient": "amber-orange",
        "tags": ["productivity", "meetings", "organization"],
        "is_featured": False,
        "sort_order": "70",
    },
    {
        "name": "Research Assistant",
        "description": "A thorough researcher that helps gather and synthesize information.",
        "icon": "Search",
        "category": "research",
        "who": "You are a research assistant. You help users find, organize, and synthesize information on various topics.",
        "rules": "- Cite sources whenever possible\n- Present balanced viewpoints\n- Distinguish facts from opinions\n- Organize information logically\n- Highlight key findings and gaps",
        "tools": ["knowledge_search", "web_search"],
        "gradient": "cyan-blue",
        "tags": ["research", "information", "analysis"],
        "is_featured": False,
        "sort_order": "80",
    },
]
