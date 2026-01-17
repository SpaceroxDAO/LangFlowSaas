"""
Mission model for guided learning system.
"""
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import String, Integer, Boolean, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Mission(Base):
    """
    Mission definition for guided learning.

    Categories:
    - skill_sprint: Short focused exercises (15-30 min)
    - applied_build: Longer project-based missions (45-90 min)
    """

    __tablename__ = "missions"

    # Primary key is a readable ID like "L001", "L002"
    id: Mapped[str] = mapped_column(String(50), primary_key=True)

    # Basic info
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    difficulty: Mapped[str] = mapped_column(String(20), default="beginner", nullable=False)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    icon: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)

    # Mission steps (JSON array)
    # Each step: {"id": 1, "title": "...", "description": "...", "type": "action|info|quiz"}
    steps: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, nullable=False)

    # Prerequisites (array of mission IDs)
    prerequisites: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)

    # Learning outcomes
    outcomes: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)

    # Active flag
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Canvas integration fields
    template_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    component_pack: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    canvas_mode: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # UI Config for canvas visibility (hide_sidebar, hide_minimap, hide_toolbar, etc.)
    ui_config: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return f"<Mission {self.id}: {self.name}>"


# Default missions to seed
DEFAULT_MISSIONS = [
    # ===== L001: Hello Charlie =====
    # First mission - introduces the canvas and basic agent creation
    {
        "id": "L001-hello-charlie",
        "name": "Hello Charlie",
        "description": "Meet your first AI agent on the canvas. See how components connect and bring Charlie to life!",
        "category": "skill_sprint",
        "difficulty": "beginner",
        "estimated_minutes": 10,
        "icon": "bot",
        "sort_order": 1,
        "canvas_mode": True,
        "template_id": "agent_base",
        # UI Config - removed hiding, show full canvas
        "ui_config": None,
        # Component pack (for validation)
        "component_pack": {
            "allowed_components": ["ChatInput", "ChatOutput", "Agent"],
            "allowed_categories": ["input & output", "models & agents"],
            "validation_rules": {
                "require_chat_input": True,
                "require_chat_output": True,
                "max_nodes": 3,
            },
        },
        "steps": [
            {
                "id": 1,
                "title": "Meet the Canvas",
                "description": "Look at the three boxes on screen. Chat Input tells Charlie to expect messages from users. The Agent in the middle is Charlie's brain where he processes everything. Chat Output tells Charlie to send his responses back. These components are already wired together - you'll chat with Charlie using the Playground button later!",
                "type": "info",
                "phase": "works",
            },
            {
                "id": 2,
                "title": "Give Charlie a Job",
                "description": "Click on the Agent box in the middle. Find the 'Agent Instructions' field and tell Charlie what to do. Try: 'You are a friendly assistant who loves helping people learn new things.'",
                "type": "action",
                "phase": "works",
                "highlight": {
                    "element": "field:agent_instructions",
                    "title": "Charlie's Job Description",
                    "description": "Type what you want Charlie to do. Be specific about his personality and how he should respond.",
                    "position": "left",
                    "auto_trigger": False,
                },
                "hints": [
                    "Think of this like writing a job description for a new employee",
                    "Be specific about Charlie's personality and how he should respond",
                    "Try mentioning what topics Charlie should help with",
                ],
                "validation": {
                    "auto": True,
                    "event_type": "node_configured",
                    "node_type": "Agent",
                    "field_name": "agent_instructions",
                },
            },
            {
                "id": 3,
                "title": "Say Hello!",
                "description": "Click the Playground button in the top right corner to open the chat. Type 'Hello Charlie!' and press Enter. Charlie will respond based on the job you gave him!",
                "type": "action",
                "phase": "reliable",
                "highlight": {
                    "element": "button:playground",
                    "title": "Open the Playground",
                    "description": "Click here to open the chat window where you can talk to Charlie!",
                    "position": "bottom",
                    "auto_trigger": False,
                },
                "hints": [
                    "The Playground button is in the top right corner next to Share",
                    "Try asking Charlie about himself to see if he follows your instructions",
                    "If Charlie doesn't respond the way you want, you can go back and update his instructions",
                ],
            },
        ],
        "prerequisites": None,
        "outcomes": [
            "Understand how the canvas works",
            "Give an agent its job description",
            "Chat with your first AI agent",
        ],
    },
    {
        "id": "L002",
        "name": "FAQ Bot v1",
        "description": "Build a simple FAQ bot that answers common questions about your topic.",
        "category": "skill_sprint",
        "difficulty": "beginner",
        "estimated_minutes": 20,
        "icon": "help-circle",
        "sort_order": 2,
        "steps": [
            {"id": 1, "title": "Choose a Topic", "description": "Pick something you know well - a hobby, product, or service.", "type": "info"},
            {"id": 2, "title": "Create Your FAQ Agent", "description": "Use the wizard to create an agent specialized in answering questions.", "type": "action"},
            {"id": 3, "title": "Add Knowledge", "description": "Include at least 5 FAQ questions in the agent's knowledge.", "type": "action"},
            {"id": 4, "title": "Test Your Bot", "description": "Ask your bot several questions to see how it handles them.", "type": "action"},
        ],
        "prerequisites": ["L001-hello-charlie"],
        "outcomes": ["Build a specialized FAQ agent", "Structure knowledge effectively"],
    },
    {
        "id": "L003",
        "name": "Daily Co-Pilot",
        "description": "Create a personal assistant agent that helps with your daily tasks.",
        "category": "applied_build",
        "difficulty": "beginner",
        "estimated_minutes": 45,
        "icon": "calendar",
        "sort_order": 3,
        "steps": [
            {"id": 1, "title": "Define Your Needs", "description": "List 3-5 tasks you do regularly that an AI could help with.", "type": "info"},
            {"id": 2, "title": "Create the Agent", "description": "Build an agent with a helpful assistant personality.", "type": "action"},
            {"id": 3, "title": "Train on Your Tasks", "description": "Add specific instructions for each task type.", "type": "action"},
            {"id": 4, "title": "Create a Workflow", "description": "Turn your agent into a workflow for easier access.", "type": "action"},
            {"id": 5, "title": "Daily Test Run", "description": "Use your co-pilot for one full day of tasks.", "type": "action"},
        ],
        "prerequisites": ["L001-hello-charlie"],
        "outcomes": ["Build a personalized assistant", "Create workflows from agents"],
    },
    {
        "id": "L004",
        "name": "Tools 101",
        "description": "Learn to connect external tools to make your agents more powerful.",
        "category": "skill_sprint",
        "difficulty": "intermediate",
        "estimated_minutes": 30,
        "icon": "tool",
        "sort_order": 4,
        "steps": [
            {"id": 1, "title": "What are MCP Servers?", "description": "Learn how MCP servers extend your agent's abilities.", "type": "info"},
            {"id": 2, "title": "Browse Available Tools", "description": "Explore the MCP Server library.", "type": "action"},
            {"id": 3, "title": "Connect Your First Tool", "description": "Add an MCP server to your project.", "type": "action"},
            {"id": 4, "title": "Use the Tool", "description": "Create an agent that uses your new tool.", "type": "action"},
        ],
        "prerequisites": ["L001-hello-charlie"],
        "outcomes": ["Understand MCP servers", "Connect external tools", "Build tool-using agents"],
    },
    {
        "id": "L005",
        "name": "One Connection",
        "description": "Connect your first external service using MCP.",
        "category": "skill_sprint",
        "difficulty": "intermediate",
        "estimated_minutes": 25,
        "icon": "link",
        "sort_order": 5,
        "steps": [
            {"id": 1, "title": "Choose a Service", "description": "Pick a service you already use (calendar, notes, etc.).", "type": "info"},
            {"id": 2, "title": "Find the MCP Server", "description": "Search for an MCP server that connects to your service.", "type": "action"},
            {"id": 3, "title": "Configure the Connection", "description": "Set up the connection with your credentials.", "type": "action"},
            {"id": 4, "title": "Build an Integration", "description": "Create an agent that uses this connection.", "type": "action"},
        ],
        "prerequisites": ["L004"],
        "outcomes": ["Connect external services", "Configure MCP credentials"],
    },
    {
        "id": "L006",
        "name": "Inbox + Calendar Concierge",
        "description": "Build an assistant that manages your email and calendar.",
        "category": "applied_build",
        "difficulty": "intermediate",
        "estimated_minutes": 60,
        "icon": "inbox",
        "sort_order": 6,
        "steps": [
            {"id": 1, "title": "Plan Your Concierge", "description": "Define what tasks you want automated.", "type": "info"},
            {"id": 2, "title": "Connect Email", "description": "Set up an MCP server for email access.", "type": "action"},
            {"id": 3, "title": "Connect Calendar", "description": "Set up an MCP server for calendar access.", "type": "action"},
            {"id": 4, "title": "Build the Agent", "description": "Create an agent that can read and manage both.", "type": "action"},
            {"id": 5, "title": "Create Workflows", "description": "Set up automated routines.", "type": "action"},
            {"id": 6, "title": "Test and Refine", "description": "Use for a week and improve based on experience.", "type": "action"},
        ],
        "prerequisites": ["L005"],
        "outcomes": ["Integrate multiple services", "Build complex workflows"],
    },
    {
        "id": "L007",
        "name": "RAG 101",
        "description": "Learn how to give your agents access to your documents.",
        "category": "skill_sprint",
        "difficulty": "intermediate",
        "estimated_minutes": 30,
        "icon": "book-open",
        "sort_order": 7,
        "steps": [
            {"id": 1, "title": "What is RAG?", "description": "Learn about Retrieval Augmented Generation.", "type": "info"},
            {"id": 2, "title": "Upload a Document", "description": "Add a document to the Knowledge Sources.", "type": "action"},
            {"id": 3, "title": "Create a RAG Agent", "description": "Build an agent that uses your document.", "type": "action"},
            {"id": 4, "title": "Test Understanding", "description": "Ask questions about your document.", "type": "action"},
        ],
        "prerequisites": ["L001-hello-charlie"],
        "outcomes": ["Understand RAG concepts", "Upload knowledge sources", "Build document-aware agents"],
    },
    {
        "id": "L009",
        "name": "Personal Second Brain",
        "description": "Create an AI that knows everything about your notes and documents.",
        "category": "applied_build",
        "difficulty": "intermediate",
        "estimated_minutes": 90,
        "icon": "brain",
        "sort_order": 8,
        "steps": [
            {"id": 1, "title": "Gather Your Knowledge", "description": "Collect documents, notes, and files you want to include.", "type": "info"},
            {"id": 2, "title": "Upload to Knowledge Base", "description": "Add your documents to Knowledge Sources.", "type": "action"},
            {"id": 3, "title": "Organize by Topic", "description": "Create projects to organize different knowledge areas.", "type": "action"},
            {"id": 4, "title": "Build Your Brain Agent", "description": "Create an agent that can search across all your knowledge.", "type": "action"},
            {"id": 5, "title": "Add Conversation Memory", "description": "Enable the agent to remember past discussions.", "type": "action"},
            {"id": 6, "title": "Daily Usage", "description": "Use your second brain for a week of questions.", "type": "action"},
        ],
        "prerequisites": ["L007"],
        "outcomes": ["Build a personal knowledge base", "Create intelligent search agents"],
    },
    # Canvas-enabled missions
    {
        "id": "L010",
        "name": "Build Your First Agent",
        "description": "Learn to build an AI agent directly on the canvas. See how components connect and data flows.",
        "category": "skill_sprint",
        "difficulty": "beginner",
        "estimated_minutes": 20,
        "icon": "bot",
        "sort_order": 10,
        "canvas_mode": True,
        "template_id": "agent_base",
        "component_pack": {
            "allowed_components": ["ChatInput", "ChatOutput", "Agent"],
            "allowed_categories": ["input & output", "models & agents"],
            "validation_rules": {
                "require_chat_input": True,
                "require_chat_output": True,
                "max_nodes": 5,
            },
        },
        "steps": [
            {
                "id": 1,
                "title": "Explore the Canvas",
                "description": "Look at the three components on the canvas: Chat Input (where messages come in), Agent (the AI brain), and Chat Output (where replies go).",
                "type": "info",
            },
            {
                "id": 2,
                "title": "Click the Agent",
                "description": "Click on the Agent component (the one in the middle). This is where you configure your AI's behavior.",
                "type": "action",
                "validation": {"node_type": "Agent"},
            },
            {
                "id": 3,
                "title": "Set Agent Instructions",
                "description": "In the Agent's 'Agent Instructions' field, write what you want your agent to do. For example: 'You are a helpful assistant that answers questions clearly and concisely.'",
                "type": "action",
            },
            {
                "id": 4,
                "title": "Test Your Agent",
                "description": "Click the Play button in the toolbar to run your flow, then send a message to test your agent.",
                "type": "action",
            },
        ],
        "prerequisites": ["L001-hello-charlie"],
        "outcomes": [
            "Understand flow-based AI building",
            "Configure an Agent component",
            "Test flows in the canvas",
        ],
    },
]
