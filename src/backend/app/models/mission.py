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

    # Plan gating - which plan is required to access this mission
    # "free" = available to all, "individual" = paid only, "business" = business only
    # See docs/19_PRICING_STRATEGY.md for gating strategy
    required_plan: Mapped[str] = mapped_column(String(20), default="free", nullable=False)

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
# Plan gating: "free" = starter missions (available to all), "individual" = full library
# See docs/19_PRICING_STRATEGY.md for gating strategy
DEFAULT_MISSIONS = [
    # ===== L001: Hello Charlie ===== (STARTER MISSION - FREE)
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
        "required_plan": "free",  # STARTER MISSION
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
    # ===== L002: FAQ Bot v1 ===== (STARTER MISSION - FREE)
    # Second mission - teaches specialized agents, guardrails, and escalation
    {
        "id": "L002-faq-bot-v1",
        "name": "FAQ Bot v1",
        "description": "Turn Charlie into a focused FAQ specialist. Learn to add guardrails so Charlie stays on-topic and knows when to ask for help.",
        "category": "skill_sprint",
        "difficulty": "beginner",
        "estimated_minutes": 20,
        "icon": "help-circle",
        "sort_order": 2,
        "required_plan": "free",  # STARTER MISSION
        "canvas_mode": True,
        "template_id": "agent_base",
        # UI Config - show full canvas (same as L001)
        "ui_config": None,
        # Component pack - same basic components as L001
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
            # Step 1: Choose Your Topic (info)
            {
                "id": 1,
                "title": "Pick Your FAQ Topic",
                "description": "For this mission, you'll turn Charlie into an FAQ expert. Think of a topic you know well - maybe a hobby like photography or cooking, a product or service you use, a subject you're passionate about, or your business area. Once you have a topic in mind, continue to the next step!",
                "type": "info",
                "phase": "works",
                "hints": [
                    "Pick something you could answer 5-10 common questions about",
                    "The more specific your topic, the better Charlie will perform",
                    "Example: 'Coffee brewing' is better than just 'food'",
                ],
            },
            # Step 2: Write FAQ-Specialized Instructions (action)
            {
                "id": 2,
                "title": "Create Your FAQ Expert",
                "description": "Click on the Agent and update the 'Agent Instructions' field. This time, make Charlie a specialist! Try something like: 'You are an FAQ assistant for [your topic]. You help people understand [topic] by answering common questions clearly and concisely. You know about [list 3-5 specific areas].'",
                "type": "action",
                "phase": "works",
                "highlight": {
                    "element": "field:agent_instructions",
                    "title": "Specialize Charlie",
                    "description": "Write instructions that make Charlie an expert in your chosen topic. Be specific about what Charlie knows.",
                    "position": "left",
                    "auto_trigger": False,
                },
                "hints": [
                    "Include your specific topic area in the instructions",
                    "List 3-5 things Charlie should know about",
                    "Example: 'You know about espresso machines, pour-over methods, and bean selection'",
                ],
                "validation": {
                    "auto": True,
                    "event_type": "node_configured",
                    "node_type": "Agent",
                    "field_name": "agent_instructions",
                    "min_length": 50,
                },
            },
            # Step 3: Add Guardrails - "I don't know" behavior (action)
            {
                "id": 3,
                "title": "Add Guardrails",
                "description": "Great FAQ bots know their limits! Add guardrails to Charlie's instructions. Tell Charlie to politely redirect off-topic questions back to your topic, and to say 'I'm not certain about that' rather than guessing when unsure. This prevents Charlie from making up answers or going off-topic!",
                "type": "action",
                "phase": "reliable",
                "highlight": {
                    "element": "field:agent_instructions",
                    "title": "Add Safety Rules",
                    "description": "Update the instructions to include boundaries. Tell Charlie what to do when questions are off-topic or unclear.",
                    "position": "left",
                    "auto_trigger": False,
                },
                "hints": [
                    "Add a line like: 'If asked about unrelated topics, politely redirect to [your topic]'",
                    "Include: 'Never make up information - admit when you're unsure'",
                    "Think about what questions might trip up your bot",
                ],
                "validation": {
                    "auto": True,
                    "event_type": "node_configured",
                    "node_type": "Agent",
                    "field_name": "agent_instructions",
                    "min_length": 100,
                },
            },
            # Step 4: Add Escalation Behavior (action)
            {
                "id": 4,
                "title": "Add Escalation",
                "description": "Sometimes Charlie needs to hand off to a human. Add an escalation instruction telling Charlie to recommend reaching out to a support channel or person for complex issues, complaints, or questions he cannot answer. This builds trust - users know Charlie won't leave them stuck!",
                "type": "action",
                "phase": "reliable",
                "highlight": {
                    "element": "field:agent_instructions",
                    "title": "Add Human Handoff",
                    "description": "Tell Charlie when and how to suggest human help. This could be an email, phone number, or just 'contact support'.",
                    "position": "left",
                    "auto_trigger": False,
                },
                "hints": [
                    "Add: 'For issues I can't resolve, suggest contacting [your support channel]'",
                    "Be specific about what triggers escalation (complaints, complex issues)",
                    "Example: 'If someone has a billing issue, direct them to billing@example.com'",
                ],
                "validation": {
                    "auto": True,
                    "event_type": "node_configured",
                    "node_type": "Agent",
                    "field_name": "agent_instructions",
                    "min_length": 150,
                },
            },
            # Step 5: Test Your FAQ Bot (action)
            {
                "id": 5,
                "title": "Test Your FAQ Bot!",
                "description": "Time to put Charlie to the test! Open the Playground and try both good questions (basic questions about your topic, asking for recommendations) and tricky questions (off-topic questions, things Charlie shouldn't know, pretending to be upset). See how Charlie handles each one!",
                "type": "action",
                "phase": "reliable",
                "highlight": {
                    "element": "button:playground",
                    "title": "Test Your Bot",
                    "description": "Open the Playground and test Charlie with both normal questions and tricky edge cases.",
                    "position": "bottom",
                    "auto_trigger": False,
                },
                "hints": [
                    "Try: '[Basic question about your topic]' - should answer confidently",
                    "Try: 'What's the weather today?' - should politely stay on topic",
                    "Try: 'I'm really frustrated...' - should offer escalation",
                    "If Charlie doesn't respond correctly, go back and refine the instructions!",
                ],
            },
        ],
        "prerequisites": ["L001-hello-charlie"],
        "outcomes": [
            "Specialize an agent for a specific topic",
            "Add guardrails to keep agents on-topic",
            "Teach agents to admit uncertainty",
            "Set up escalation to human support",
        ],
    },
    # ===== L003+ : FULL LIBRARY (INDIVIDUAL PLAN) =====
    {
        "id": "L003",
        "name": "Daily Co-Pilot",
        "description": "Create a personal assistant agent that helps with your daily tasks.",
        "category": "applied_build",
        "difficulty": "beginner",
        "estimated_minutes": 45,
        "icon": "calendar",
        "sort_order": 3,
        "required_plan": "individual",  # PAID MISSION
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
        "required_plan": "individual",  # PAID MISSION
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
        "required_plan": "individual",  # PAID MISSION
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
        "required_plan": "individual",  # PAID MISSION
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
        "required_plan": "individual",  # PAID MISSION
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
        "required_plan": "individual",  # PAID MISSION
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
        "required_plan": "individual",  # PAID MISSION
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
