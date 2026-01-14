"""
Workflow management endpoints.
"""
import asyncio
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sse_starlette.sse import EventSourceResponse

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.models.user import User
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowCreateFromAgent,
    WorkflowCreateFromTemplate,
    WorkflowResponse,
    WorkflowUpdate,
    WorkflowListResponse,
    WorkflowExportResponse,
)
from app.schemas.message import ChatRequest, ChatResponse, MessageUpdate, MessageFeedback
from app.schemas.streaming import StreamEvent, StreamEventType
from app.services.user_service import UserService
from app.services.workflow_service import WorkflowService, WorkflowServiceError

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.get(
    "/templates",
    summary="Get workflow templates",
    description="Get available workflow templates from Langflow.",
)
async def get_workflow_templates():
    """
    Get available workflow templates.

    Returns starter templates from Langflow plus any custom templates.
    """
    from app.services.langflow_client import langflow_client, LangflowClientError

    templates = []
    categories = [
        {"id": "get-started", "name": "Get started", "icon": "play", "group": None},
        {"id": "all", "name": "All templates", "icon": "grid", "group": None},
        # Methodology
        {"id": "agents", "name": "Agents", "icon": "bot", "group": "Methodology"},
        {"id": "prompting", "name": "Prompting", "icon": "message-square", "group": "Methodology"},
        {"id": "rag", "name": "RAG", "icon": "database", "group": "Methodology"},
        # Use Cases
        {"id": "support", "name": "Customer Support", "icon": "headphones", "group": "Use Cases"},
        {"id": "data", "name": "Data & Analytics", "icon": "bar-chart", "group": "Use Cases"},
        {"id": "sales", "name": "Sales & Marketing", "icon": "trending-up", "group": "Use Cases"},
        {"id": "dev", "name": "Developer Tools", "icon": "code", "group": "Use Cases"},
        {"id": "automation", "name": "Automation", "icon": "refresh-cw", "group": "Use Cases"},
        # Advanced (community templates from langflow-templates)
        {"id": "advanced", "name": "Advanced", "icon": "zap", "group": "Advanced"},
    ]

    # Add Get Started showcase templates (one for each methodology)
    get_started_templates = [
        {
            "id": "get-started-prompting",
            "name": "Basic Prompting",
            "description": "Learn the basics of prompting with a simple chat flow using OpenAI.",
            "category": "get-started",
            "tags": ["PROMPTING"],
            "gradient": "purple-pink",
            "icon": "message-square",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "get-started-rag",
            "name": "Document Q&A",
            "description": "Build a RAG system that answers questions about your documents.",
            "category": "get-started",
            "tags": ["RAG"],
            "gradient": "blue-cyan",
            "icon": "database",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "get-started-agent",
            "name": "AI Agent",
            "description": "Create an intelligent agent that can use tools and take actions.",
            "category": "get-started",
            "tags": ["AGENTS"],
            "gradient": "pink-purple",
            "icon": "bot",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
    ]
    templates.extend(get_started_templates)

    # Add curated built-in templates (always available)
    builtin_templates = [
        # === STARTER TEMPLATES ===
        {
            "id": "basic-prompting",
            "name": "Basic Prompting",
            "description": "Perform basic prompting with an OpenAI model.",
            "category": "prompting",
            "tags": ["PROMPTING", "STARTER"],
            "gradient": "purple-pink",
            "icon": "message-square",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "simple-agent",
            "name": "Simple Agent",
            "description": "A simple but powerful starter agent with tools.",
            "category": "agents",
            "tags": ["AGENTS", "STARTER"],
            "gradient": "pink-purple",
            "icon": "bot",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "memory-chatbot",
            "name": "Memory Chatbot",
            "description": "A chatbot with conversation memory that remembers context.",
            "category": "agents",
            "tags": ["AGENTS", "MEMORY"],
            "gradient": "green-teal",
            "icon": "brain",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "vector-store-rag",
            "name": "Vector Store RAG",
            "description": "Load your data for chat context with Retrieval Augmented Generation.",
            "category": "rag",
            "tags": ["RAG", "VECTORS"],
            "gradient": "blue-cyan",
            "icon": "database",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "document-qa",
            "name": "Document Q&A",
            "description": "Ask questions about your documents using AI.",
            "category": "rag",
            "tags": ["RAG", "Q&A"],
            "gradient": "orange-red",
            "icon": "file-text",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "sequential-agent",
            "name": "Sequential Agent",
            "description": "Chain multiple AI tasks together in sequence.",
            "category": "agents",
            "tags": ["AGENTS", "ADVANCED"],
            "gradient": "indigo-purple",
            "icon": "git-branch",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "founder-flow",
            "name": "FounderFlow",
            "description": "Multi-agent startup builder with CEO, PM, Designer & Engineer agents.",
            "category": "agents",
            "tags": ["AGENTS", "MULTI-AGENT", "STARTUP"],
            "gradient": "amber-orange",
            "icon": "zap",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === AGENTIC RAG TEMPLATES (from langflow-templates) ===
        {
            "id": "tool-based-rag",
            "name": "Tool Based RAG",
            "description": "Advanced RAG system using tools for intelligent information retrieval and processing.",
            "category": "rag",
            "tags": ["RAG", "TOOLS", "ADVANCED"],
            "gradient": "blue-cyan",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "rag-web-article",
            "name": "RAG Web Article",
            "description": "Extract and process web articles with RAG for intelligent Q&A.",
            "category": "rag",
            "tags": ["RAG", "WEB"],
            "gradient": "cyan-blue",
            "icon": "globe",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "vectorless-rag",
            "name": "Vectorless RAG",
            "description": "RAG implementation without vector databases using alternative retrieval.",
            "category": "rag",
            "tags": ["RAG", "LIGHTWEIGHT"],
            "gradient": "teal-green",
            "icon": "layers",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === DOCUMENT INTELLIGENCE TEMPLATES ===
        {
            "id": "document-classifier",
            "name": "Document Classifier",
            "description": "Automatically classify documents into categories using AI.",
            "category": "prompting",
            "tags": ["DOCUMENTS", "CLASSIFICATION"],
            "gradient": "violet-purple",
            "icon": "folder",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "summary-generator",
            "name": "Summary Generator",
            "description": "Generate concise summaries from long documents automatically.",
            "category": "prompting",
            "tags": ["DOCUMENTS", "SUMMARY"],
            "gradient": "amber-orange",
            "icon": "align-left",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "data-extractor",
            "name": "Data Extractor",
            "description": "Extract structured data from unstructured documents.",
            "category": "prompting",
            "tags": ["DOCUMENTS", "EXTRACTION"],
            "gradient": "rose-pink",
            "icon": "scissors",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === CUSTOMER SUPPORT TEMPLATES ===
        {
            "id": "sentiment-analyzer",
            "name": "Sentiment Analyzer",
            "description": "Analyze customer sentiment from messages and feedback.",
            "category": "support",
            "tags": ["SUPPORT", "ANALYTICS"],
            "gradient": "emerald-teal",
            "icon": "heart",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "ticket-router",
            "name": "Ticket Router",
            "description": "Intelligently route support tickets to the right team or agent.",
            "category": "support",
            "tags": ["SUPPORT", "AUTOMATION"],
            "gradient": "sky-blue",
            "icon": "send",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "support-agent-assist",
            "name": "Support Agent Assist",
            "description": "AI assistant that helps support agents with suggested responses.",
            "category": "support",
            "tags": ["SUPPORT", "ASSISTANT"],
            "gradient": "indigo-blue",
            "icon": "headphones",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === DATA & ANALYTICS TEMPLATES ===
        {
            "id": "csv-agent",
            "name": "CSV Agent",
            "description": "Query and analyze CSV files using natural language.",
            "category": "data",
            "tags": ["DATA", "ANALYTICS"],
            "gradient": "lime-green",
            "icon": "table",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "dashboard-generator",
            "name": "Dashboard Generator",
            "description": "Generate data dashboards and visualizations from your data.",
            "category": "data",
            "tags": ["DATA", "VISUALIZATION"],
            "gradient": "fuchsia-pink",
            "icon": "bar-chart",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "trend-detector",
            "name": "Trend Detector",
            "description": "Detect patterns and trends in your data automatically.",
            "category": "data",
            "tags": ["DATA", "INSIGHTS"],
            "gradient": "purple-indigo",
            "icon": "trending-up",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === SALES & MARKETING TEMPLATES ===
        {
            "id": "lead-scorer",
            "name": "Lead Scorer",
            "description": "Score and prioritize leads based on engagement and fit.",
            "category": "sales",
            "tags": ["SALES", "SCORING"],
            "gradient": "yellow-amber",
            "icon": "star",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "content-creator",
            "name": "Content Creator",
            "description": "Generate marketing content, blog posts, and social media copy.",
            "category": "sales",
            "tags": ["MARKETING", "CONTENT"],
            "gradient": "pink-rose",
            "icon": "edit",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "seo-optimizer",
            "name": "SEO Optimizer",
            "description": "Optimize content for search engines with AI suggestions.",
            "category": "sales",
            "tags": ["MARKETING", "SEO"],
            "gradient": "green-emerald",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === DEVELOPER PRODUCTIVITY TEMPLATES ===
        {
            "id": "code-reviewer",
            "name": "Code Reviewer",
            "description": "Automated code review with suggestions and best practices.",
            "category": "dev",
            "tags": ["DEV", "CODE"],
            "gradient": "slate-gray",
            "icon": "code",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "codebase-chat",
            "name": "Codebase Chat",
            "description": "Chat with your codebase to understand and navigate code.",
            "category": "dev",
            "tags": ["DEV", "CODE"],
            "gradient": "zinc-slate",
            "icon": "terminal",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === WORKFLOW AUTOMATION TEMPLATES ===
        {
            "id": "process-automation",
            "name": "Process Automation",
            "description": "Automate repetitive business processes with AI agents.",
            "category": "automation",
            "tags": ["AUTOMATION", "WORKFLOW"],
            "gradient": "orange-amber",
            "icon": "refresh-cw",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "email-assistant",
            "name": "Email Assistant",
            "description": "Draft, summarize, and manage emails with AI assistance.",
            "category": "automation",
            "tags": ["AUTOMATION", "EMAIL"],
            "gradient": "red-orange",
            "icon": "mail",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === ADVANCED TEMPLATES (from langflow-templates community repo) ===
        {
            "id": "adv-tool-based-rag",
            "name": "Tool-Based RAG",
            "description": "Advanced RAG with tool-calling capabilities for dynamic information retrieval.",
            "category": "advanced",
            "tags": ["ADVANCED", "RAG", "TOOLS"],
            "gradient": "violet-purple",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-vectorless-rag",
            "name": "Vectorless RAG",
            "description": "RAG implementation without vector databases using alternative retrieval methods.",
            "category": "advanced",
            "tags": ["ADVANCED", "RAG"],
            "gradient": "teal-green",
            "icon": "layers",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-ingestion-router",
            "name": "Ingestion Router",
            "description": "Smart document ingestion with intelligent routing based on content type.",
            "category": "advanced",
            "tags": ["ADVANCED", "DOCUMENTS"],
            "gradient": "cyan-blue",
            "icon": "git-branch",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-multi-source-retrieval",
            "name": "Multi-Source Retrieval",
            "description": "Retrieve and combine information from multiple data sources.",
            "category": "advanced",
            "tags": ["ADVANCED", "RAG", "DATA"],
            "gradient": "indigo-purple",
            "icon": "database",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-agentic-process",
            "name": "Agentic Process Automation",
            "description": "Complex multi-step process automation with autonomous agents.",
            "category": "advanced",
            "tags": ["ADVANCED", "AUTOMATION"],
            "gradient": "amber-orange",
            "icon": "refresh-cw",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-document-intelligence",
            "name": "Document Intelligence",
            "description": "Advanced document understanding with classification, extraction, and summarization.",
            "category": "advanced",
            "tags": ["ADVANCED", "DOCUMENTS"],
            "gradient": "rose-pink",
            "icon": "file-text",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-semantic-memory",
            "name": "Semantic Memory",
            "description": "Long-term semantic memory system for persistent agent knowledge.",
            "category": "advanced",
            "tags": ["ADVANCED", "MEMORY"],
            "gradient": "purple-indigo",
            "icon": "brain",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "adv-multi-agent-system",
            "name": "Multi-Agent System",
            "description": "Coordinated multi-agent workflows with specialized roles and collaboration.",
            "category": "advanced",
            "tags": ["ADVANCED", "AGENTS"],
            "gradient": "fuchsia-pink",
            "icon": "bot",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
    ]
    templates.extend(builtin_templates)

    # Try to fetch additional Langflow starter templates
    try:
        starter_templates = await langflow_client.get_starter_templates()

        # Define metadata for known starter templates
        template_metadata = {
            "Basic Prompting": {
                "category": "prompting",
                "tags": ["PROMPTING"],
                "gradient": "purple-pink",
                "icon": "message-square",
                "description": "Perform basic prompting with an OpenAI model.",
            },
            "Vector Store RAG": {
                "category": "rag",
                "tags": ["RAG"],
                "gradient": "blue-cyan",
                "icon": "database",
                "description": "Load your data for chat context with Retrieval Augmented Generation.",
            },
            "Simple Agent": {
                "category": "agents",
                "tags": ["AGENTS"],
                "gradient": "pink-purple",
                "icon": "bot",
                "description": "A simple but powerful starter agent.",
            },
            "Memory Chatbot": {
                "category": "agents",
                "tags": ["AGENTS", "MEMORY"],
                "gradient": "green-teal",
                "icon": "brain",
                "description": "A chatbot with conversation memory.",
            },
            "Document Q&A": {
                "category": "rag",
                "tags": ["RAG", "Q&A"],
                "gradient": "orange-red",
                "icon": "file-text",
                "description": "Ask questions about your documents.",
            },
        }

        for i, starter in enumerate(starter_templates):
            # Extract name from the flow data
            name = starter.get("name")

            # Skip templates without a proper name - these are corrupted/incomplete
            if not name:
                continue

            # Get metadata or use defaults
            metadata = template_metadata.get(name, {
                "category": "get-started",
                "tags": ["STARTER"],
                "gradient": "purple-pink",
                "icon": "zap",
                "description": starter.get("description") or "A starter template from Langflow.",
            })

            templates.append({
                "id": f"langflow-starter-{i}",
                "name": name,
                "description": metadata.get("description", ""),
                "category": metadata.get("category", "get-started"),
                "tags": metadata.get("tags", []),
                "gradient": metadata.get("gradient", "purple-pink"),
                "icon": metadata.get("icon", "zap"),
                "is_blank": False,
                "is_langflow_starter": True,
                "data": starter.get("data"),
            })

    except LangflowClientError as e:
        # If Langflow is unavailable, continue with just blank template
        pass
    except Exception as e:
        # Log but don't fail
        pass

    return {
        "categories": categories,
        "templates": templates,
    }


async def get_user_from_clerk(
    clerk_user: CurrentUser,
    session: AsyncSessionDep,
) -> User:
    """Get or create user from Clerk authentication."""
    user_service = UserService(session)
    return await user_service.get_or_create_from_clerk(clerk_user)


@router.post(
    "",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow",
    description="Create a new blank workflow.",
)
async def create_workflow(
    data: WorkflowCreate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create a new workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    try:
        workflow = await service.create(user=user, data=data)
        return workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create workflow: {str(e)}",
        )


@router.post(
    "/from-agent",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow from agent",
    description="Create a quick workflow from an agent component.",
)
async def create_workflow_from_agent(
    data: WorkflowCreateFromAgent,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Create a quick workflow from an agent component.

    This creates a simple flow: ChatInput -> Agent -> ChatOutput
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    try:
        workflow = await service.create_from_agent(user=user, data=data)
        return workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/from-template",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow from template",
    description="Create a workflow from a predefined template.",
)
async def create_workflow_from_template(
    data: WorkflowCreateFromTemplate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Create a workflow from a predefined template."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    try:
        workflow = await service.create_from_template(user=user, data=data)
        return workflow
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "",
    response_model=WorkflowListResponse,
    summary="List workflows",
    description="List all workflows for the current user.",
)
async def list_workflows(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    project_id: Optional[uuid.UUID] = None,
    page: int = 1,
    page_size: int = 20,
    active_only: bool = True,
):
    """List all workflows for the authenticated user."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflows, total = await service.list_by_user(
        user_id=user.id,
        project_id=project_id,
        page=page,
        page_size=page_size,
        active_only=active_only,
    )

    return WorkflowListResponse(
        workflows=[WorkflowResponse.model_validate(w) for w in workflows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/sync-status",
    summary="Get overall sync status",
    description="Get sync status for all your workflows.",
)
async def get_overall_sync_status(
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Get overall sync status between our DB and Langflow.

    Returns counts of workflows and their sync status.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    return await service.get_sync_status(user_id=user.id)


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    summary="Get workflow",
    description="Get details of a specific workflow.",
)
async def get_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get a specific workflow by ID."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    return workflow


@router.patch(
    "/{workflow_id}",
    response_model=WorkflowResponse,
    summary="Update workflow",
    description="Update an existing workflow.",
)
async def update_workflow(
    workflow_id: uuid.UUID,
    update_data: WorkflowUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Update a workflow's configuration."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        updated = await service.update(workflow, update_data)
        return updated
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/{workflow_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete workflow",
    description="Delete a workflow and all its data.",
)
async def delete_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete a workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    await service.delete(workflow)
    return None


@router.post(
    "/{workflow_id}/duplicate",
    response_model=WorkflowResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate workflow",
    description="Create a copy of an existing workflow.",
)
async def duplicate_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
    new_name: Optional[str] = None,
):
    """Create a duplicate of a workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        duplicated = await service.duplicate(workflow, new_name)
        return duplicated
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{workflow_id}/chat",
    response_model=ChatResponse,
    summary="Chat with workflow",
    description="Send a message to a workflow and get a response.",
)
async def chat_with_workflow(
    workflow_id: uuid.UUID,
    chat_request: ChatRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Send a message to a workflow and get a response."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        response_text, conversation_id, message_id = await service.chat(
            workflow=workflow,
            user=user,
            message=chat_request.message,
            conversation_id=chat_request.conversation_id,
        )

        return ChatResponse(
            message=response_text,
            conversation_id=conversation_id,
            message_id=message_id,
        )
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/{workflow_id}/chat/stream",
    summary="Chat with workflow (streaming)",
    description="Send a message to a workflow and receive streaming response with agent events.",
)
async def chat_with_workflow_stream(
    workflow_id: uuid.UUID,
    chat_request: ChatRequest,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Stream chat response with agent visibility.

    Returns Server-Sent Events (SSE) stream with:
    - text_delta: Incremental text chunks
    - thinking_start/delta/end: Agent reasoning
    - tool_call_start/end: Tool invocations
    - content_block_*: Structured content
    - done: Stream complete
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    async def event_generator():
        """Generate SSE events from the streaming chat."""
        try:
            async for event in service.chat_stream(
                workflow=workflow,
                user=user,
                message=chat_request.message,
                conversation_id=chat_request.conversation_id,
            ):
                # Convert StreamEvent to SSE format
                yield {
                    "event": event.event.value,
                    "data": event.model_dump_json(),
                }

                # Stop after done event
                if event.event == StreamEventType.DONE:
                    break

        except asyncio.CancelledError:
            # Client disconnected, cleanup gracefully
            pass
        except Exception as e:
            # Send error event on unexpected errors
            from app.schemas.streaming import error_event
            err = error_event(
                code="STREAM_ERROR",
                message=str(e),
            )
            yield {
                "event": err.event.value,
                "data": err.model_dump_json(),
            }

    return EventSourceResponse(
        event_generator(),
        media_type="text/event-stream",
    )


@router.get(
    "/{workflow_id}/conversations",
    summary="List workflow conversations",
    description="List all conversations for a workflow.",
)
async def list_workflow_conversations(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """List all conversations for a workflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    conversations = await service.get_conversations(workflow_id, user.id)

    return {
        "conversations": [
            {
                "id": str(c.id),
                "title": c.title,
                "created_at": str(c.created_at),
                "updated_at": str(c.updated_at),
            }
            for c in conversations
        ],
        "total": len(conversations),
    }


@router.get(
    "/{workflow_id}/conversations/{conversation_id}/messages",
    summary="Get conversation messages",
    description="Get all messages for a specific conversation.",
)
async def get_conversation_messages(
    workflow_id: uuid.UUID,
    conversation_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Get all messages for a specific conversation from Langflow."""
    from app.services.langflow_client import langflow_client, LangflowClientError
    from app.models.conversation import Conversation
    from sqlalchemy import select

    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Get the conversation
    result = await session.execute(
        select(Conversation).where(
            Conversation.id == str(conversation_id),
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user.id),
        )
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    try:
        # Fetch messages from Langflow using the session ID
        messages_data = await langflow_client.get_messages(
            flow_id=workflow.langflow_flow_id,
            session_id=conversation.langflow_session_id,
            limit=200,
        )

        # Handle different response formats
        if isinstance(messages_data, list):
            messages = messages_data
        else:
            messages = messages_data.get("messages", [])

        # Format messages for frontend
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                "id": msg.get("id"),
                "role": "assistant" if msg.get("sender") == "Machine" else "user",
                "content": msg.get("text", ""),
                "timestamp": msg.get("timestamp") or msg.get("created_at"),
            })

        return {
            "messages": formatted_messages,
            "conversation_id": str(conversation_id),
            "total": len(formatted_messages),
        }

    except LangflowClientError as e:
        raise HTTPException(
            status_code=e.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch messages: {e.message}",
        )


@router.patch(
    "/{workflow_id}/conversations/{conversation_id}/messages/{message_id}",
    summary="Edit a message",
    description="Edit the content of a user message.",
)
async def update_message(
    workflow_id: uuid.UUID,
    conversation_id: uuid.UUID,
    message_id: uuid.UUID,
    update_data: MessageUpdate,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Edit a user message. Stores original content and marks as edited."""
    from app.schemas.message import MessageUpdate, MessageResponse
    from app.models.message import Message
    from app.models.conversation import Conversation
    from sqlalchemy import select
    from datetime import datetime

    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    # Verify workflow ownership
    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Verify conversation ownership
    result = await session.execute(
        select(Conversation).where(
            Conversation.id == str(conversation_id),
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user.id),
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # Get the message
    result = await session.execute(
        select(Message).where(
            Message.id == str(message_id),
            Message.conversation_id == str(conversation_id),
        )
    )
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    # Only allow editing user messages
    if message.role != "user":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only user messages can be edited.",
        )

    # Store original content if first edit
    if not message.is_edited:
        message.original_content = message.content

    # Update the message
    message.content = update_data.content
    message.is_edited = True
    message.edited_at = datetime.utcnow()

    await session.commit()
    await session.refresh(message)

    return MessageResponse.model_validate(message)


@router.delete(
    "/{workflow_id}/conversations/{conversation_id}/messages/{message_id}",
    summary="Delete a message",
    description="Delete a message from a conversation.",
)
async def delete_message(
    workflow_id: uuid.UUID,
    conversation_id: uuid.UUID,
    message_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete a message from a conversation."""
    from app.models.message import Message
    from app.models.conversation import Conversation
    from sqlalchemy import select

    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    # Verify workflow ownership
    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Verify conversation ownership
    result = await session.execute(
        select(Conversation).where(
            Conversation.id == str(conversation_id),
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user.id),
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # Get the message
    result = await session.execute(
        select(Message).where(
            Message.id == str(message_id),
            Message.conversation_id == str(conversation_id),
        )
    )
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    await session.delete(message)
    await session.commit()

    return {"success": True, "message": "Message deleted."}


@router.delete(
    "/{workflow_id}/conversations/{conversation_id}",
    summary="Delete a conversation",
    description="Delete a conversation and all its messages.",
)
async def delete_conversation(
    workflow_id: uuid.UUID,
    conversation_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Delete a conversation and all its messages."""
    from app.models.conversation import Conversation
    from sqlalchemy import select

    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    # Verify workflow ownership
    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Get the conversation
    result = await session.execute(
        select(Conversation).where(
            Conversation.id == str(conversation_id),
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user.id),
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    await session.delete(conversation)
    await session.commit()

    return {"success": True, "message": "Conversation deleted."}


@router.post(
    "/{workflow_id}/conversations/{conversation_id}/messages/{message_id}/feedback",
    summary="Submit feedback on a message",
    description="Submit thumbs up/down feedback on an assistant message.",
)
async def submit_message_feedback(
    workflow_id: uuid.UUID,
    conversation_id: uuid.UUID,
    message_id: uuid.UUID,
    feedback_data: MessageFeedback,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Submit positive or negative feedback on an assistant message."""
    from app.schemas.message import MessageFeedback, MessageResponse
    from app.models.message import Message
    from app.models.conversation import Conversation
    from sqlalchemy import select
    from datetime import datetime

    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    # Verify workflow ownership
    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Verify conversation ownership
    result = await session.execute(
        select(Conversation).where(
            Conversation.id == str(conversation_id),
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user.id),
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # Get the message
    result = await session.execute(
        select(Message).where(
            Message.id == str(message_id),
            Message.conversation_id == str(conversation_id),
        )
    )
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    # Only allow feedback on assistant messages
    if message.role != "assistant":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback can only be submitted on assistant messages.",
        )

    # Toggle feedback if same value, otherwise set new value
    if message.feedback == feedback_data.feedback:
        # Same feedback clicked again - remove it
        message.feedback = None
        message.feedback_at = None
    else:
        # Set new feedback
        message.feedback = feedback_data.feedback
        message.feedback_at = datetime.utcnow()

    await session.commit()
    await session.refresh(message)

    return MessageResponse.model_validate(message)


@router.delete(
    "/{workflow_id}/conversations/{conversation_id}/messages/{message_id}/feedback",
    summary="Remove feedback from a message",
    description="Remove previously submitted feedback from a message.",
)
async def remove_message_feedback(
    workflow_id: uuid.UUID,
    conversation_id: uuid.UUID,
    message_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Remove feedback from an assistant message."""
    from app.schemas.message import MessageResponse
    from app.models.message import Message
    from app.models.conversation import Conversation
    from sqlalchemy import select

    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    # Verify workflow ownership
    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    # Verify conversation ownership
    result = await session.execute(
        select(Conversation).where(
            Conversation.id == str(conversation_id),
            Conversation.workflow_id == str(workflow_id),
            Conversation.user_id == str(user.id),
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # Get the message
    result = await session.execute(
        select(Message).where(
            Message.id == str(message_id),
            Message.conversation_id == str(conversation_id),
        )
    )
    message = result.scalar_one_or_none()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    # Remove feedback
    message.feedback = None
    message.feedback_at = None

    await session.commit()
    await session.refresh(message)

    return MessageResponse.model_validate(message)


@router.get(
    "/{workflow_id}/export",
    summary="Export workflow",
    description="Export a workflow as JSON.",
)
async def export_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Export a workflow as JSON for backup or sharing."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    return await service.export(workflow)


@router.post(
    "/{workflow_id}/sync",
    response_model=WorkflowResponse,
    summary="Sync workflow from Langflow",
    description="Sync workflow's flow_data from Langflow canvas.",
)
async def sync_workflow_from_langflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Sync workflow's flow_data from Langflow.

    Use this after editing a flow in the Langflow canvas to ensure
    our database has the latest version.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        synced = await service.sync_from_langflow(workflow)
        return synced
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/{workflow_id}/sync-status",
    summary="Check workflow sync status",
    description="Check if a workflow is in sync with Langflow.",
)
async def check_workflow_sync_status(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Check if a specific workflow is in sync with Langflow."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    return await service.check_langflow_sync(workflow)


@router.post(
    "/{workflow_id}/repair",
    response_model=WorkflowResponse,
    summary="Repair workflow",
    description="Repair a workflow by recreating its Langflow flow.",
)
async def repair_workflow(
    workflow_id: uuid.UUID,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """
    Repair a workflow that's missing its Langflow flow.

    Creates a new flow in Langflow using the cached flow_data.
    """
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)

    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    try:
        repaired = await service.repair_missing_flow(workflow, user)
        return repaired
    except WorkflowServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


