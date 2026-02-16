"""
Workflow management endpoints.
"""
import asyncio
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sse_starlette.sse import EventSourceResponse

from app.database import AsyncSessionDep
from app.middleware.clerk_auth import CurrentUser
from app.middleware.redis_rate_limit import check_rate_limit_with_user
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

    # Add curated built-in templates (all from official Langflow starter projects)
    builtin_templates = [
        # === PROMPTING TEMPLATES ===
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
            "id": "prompt-chaining",
            "name": "Prompt Chaining",
            "description": "Chain multiple prompts together for complex reasoning tasks.",
            "category": "prompting",
            "tags": ["PROMPTING", "CHAINING"],
            "gradient": "blue-cyan",
            "icon": "git-branch",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === AGENT TEMPLATES ===
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
            "id": "search-agent",
            "name": "Search Agent",
            "description": "An agent that can search the web for information.",
            "category": "agents",
            "tags": ["AGENTS", "SEARCH"],
            "gradient": "cyan-blue",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "research-agent",
            "name": "Research Agent",
            "description": "AI agent for conducting research and gathering information.",
            "category": "agents",
            "tags": ["AGENTS", "RESEARCH"],
            "gradient": "indigo-purple",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "sequential-agent",
            "name": "Sequential Tasks Agent",
            "description": "Chain multiple AI tasks together in sequence.",
            "category": "agents",
            "tags": ["AGENTS", "ADVANCED"],
            "gradient": "violet-purple",
            "icon": "git-branch",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "travel-agent",
            "name": "Travel Planning Agent",
            "description": "AI agent for planning trips and travel itineraries.",
            "category": "agents",
            "tags": ["AGENTS", "TRAVEL"],
            "gradient": "emerald-teal",
            "icon": "globe",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "social-media-agent",
            "name": "Social Media Agent",
            "description": "Agent for managing and creating social media content.",
            "category": "agents",
            "tags": ["AGENTS", "SOCIAL"],
            "gradient": "pink-rose",
            "icon": "send",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "pokedex-agent",
            "name": "Pokédex Agent",
            "description": "Fun agent that knows everything about Pokémon.",
            "category": "agents",
            "tags": ["AGENTS", "FUN"],
            "gradient": "yellow-amber",
            "icon": "zap",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === RAG TEMPLATES ===
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
            "id": "hybrid-search-rag",
            "name": "Hybrid Search RAG",
            "description": "Combines vector and keyword search for better retrieval.",
            "category": "rag",
            "tags": ["RAG", "SEARCH"],
            "gradient": "teal-green",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "knowledge-ingestion",
            "name": "Knowledge Ingestion",
            "description": "Ingest and process documents into a knowledge base.",
            "category": "rag",
            "tags": ["RAG", "INGESTION"],
            "gradient": "cyan-blue",
            "icon": "database",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "knowledge-retrieval",
            "name": "Knowledge Retrieval",
            "description": "Retrieve information from your knowledge base.",
            "category": "rag",
            "tags": ["RAG", "RETRIEVAL"],
            "gradient": "indigo-blue",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === DOCUMENT PROCESSING ===
        {
            "id": "financial-report-parser",
            "name": "Financial Report Parser",
            "description": "Extract and analyze data from financial reports.",
            "category": "data",
            "tags": ["DOCUMENTS", "FINANCE"],
            "gradient": "emerald-teal",
            "icon": "bar-chart",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "invoice-summarizer",
            "name": "Invoice Summarizer",
            "description": "Automatically extract and summarize invoice data.",
            "category": "data",
            "tags": ["DOCUMENTS", "FINANCE"],
            "gradient": "lime-green",
            "icon": "file-text",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "meeting-summary",
            "name": "Meeting Summary",
            "description": "Generate summaries from meeting transcripts and notes.",
            "category": "automation",
            "tags": ["DOCUMENTS", "MEETINGS"],
            "gradient": "purple-indigo",
            "icon": "align-left",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === CONTENT CREATION ===
        {
            "id": "blog-writer",
            "name": "Blog Writer",
            "description": "Generate blog posts and articles on any topic.",
            "category": "sales",
            "tags": ["CONTENT", "WRITING"],
            "gradient": "pink-purple",
            "icon": "edit",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "instagram-copywriter",
            "name": "Instagram Copywriter",
            "description": "Create engaging Instagram captions and content.",
            "category": "sales",
            "tags": ["CONTENT", "SOCIAL"],
            "gradient": "fuchsia-pink",
            "icon": "send",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "twitter-thread-generator",
            "name": "Twitter Thread Generator",
            "description": "Generate viral Twitter threads from any topic.",
            "category": "sales",
            "tags": ["CONTENT", "SOCIAL"],
            "gradient": "sky-blue",
            "icon": "send",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "seo-keyword-generator",
            "name": "SEO Keyword Generator",
            "description": "Generate SEO-optimized keywords for your content.",
            "category": "sales",
            "tags": ["CONTENT", "SEO"],
            "gradient": "green-emerald",
            "icon": "search",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "portfolio-website-generator",
            "name": "Portfolio Website Generator",
            "description": "Generate code for a portfolio website.",
            "category": "dev",
            "tags": ["CODE", "WEBSITE"],
            "gradient": "violet-purple",
            "icon": "code",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === ANALYSIS TEMPLATES ===
        {
            "id": "text-sentiment-analysis",
            "name": "Text Sentiment Analysis",
            "description": "Analyze sentiment from text messages and reviews.",
            "category": "support",
            "tags": ["ANALYSIS", "SENTIMENT"],
            "gradient": "emerald-teal",
            "icon": "heart",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "image-sentiment-analysis",
            "name": "Image Sentiment Analysis",
            "description": "Analyze sentiment from images using vision AI.",
            "category": "support",
            "tags": ["ANALYSIS", "VISION"],
            "gradient": "rose-pink",
            "icon": "heart",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "youtube-analysis",
            "name": "YouTube Analysis",
            "description": "Analyze YouTube videos and extract insights.",
            "category": "data",
            "tags": ["ANALYSIS", "VIDEO"],
            "gradient": "red-orange",
            "icon": "trending-up",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "market-research",
            "name": "Market Research",
            "description": "Conduct market research and competitive analysis.",
            "category": "data",
            "tags": ["RESEARCH", "BUSINESS"],
            "gradient": "blue-cyan",
            "icon": "bar-chart",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "news-aggregator",
            "name": "News Aggregator",
            "description": "Aggregate and summarize news from multiple sources.",
            "category": "data",
            "tags": ["NEWS", "AGGREGATION"],
            "gradient": "slate-gray",
            "icon": "file-text",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === BUSINESS TEMPLATES ===
        {
            "id": "saas-pricing",
            "name": "SaaS Pricing",
            "description": "Analyze and optimize SaaS pricing strategies.",
            "category": "data",
            "tags": ["BUSINESS", "PRICING"],
            "gradient": "amber-orange",
            "icon": "trending-up",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "price-deal-finder",
            "name": "Price Deal Finder",
            "description": "Find the best deals and prices for products.",
            "category": "automation",
            "tags": ["SHOPPING", "DEALS"],
            "gradient": "yellow-amber",
            "icon": "star",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === DEVELOPER TEMPLATES ===
        {
            "id": "custom-component-generator",
            "name": "Custom Component Generator",
            "description": "Generate custom Langflow components with AI.",
            "category": "dev",
            "tags": ["DEV", "COMPONENTS"],
            "gradient": "indigo-purple",
            "icon": "code",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "research-translation-loop",
            "name": "Research Translation Loop",
            "description": "Research and translate content in a loop.",
            "category": "automation",
            "tags": ["RESEARCH", "TRANSLATION"],
            "gradient": "cyan-blue",
            "icon": "refresh-cw",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        # === ADVANCED / CUSTOM TEMPLATES ===
        {
            "id": "founder-flow",
            "name": "FounderFlow",
            "description": "Multi-agent startup builder with CEO, PM, Designer & Engineer agents.",
            "category": "advanced",
            "tags": ["MULTI-AGENT", "STARTUP"],
            "gradient": "amber-orange",
            "icon": "zap",
            "is_blank": False,
            "is_builtin": True,
            "data": None,
        },
        {
            "id": "nvidia-remix",
            "name": "Nvidia Remix",
            "description": "Advanced AI workflow using Nvidia's models.",
            "category": "advanced",
            "tags": ["ADVANCED", "NVIDIA"],
            "gradient": "lime-green",
            "icon": "zap",
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


@router.patch(
    "/{workflow_id}/agent-skill",
    response_model=WorkflowResponse,
    summary="Toggle workflow as agent skill",
    description="Enable or disable this workflow as an OpenClaw agent skill.",
)
async def toggle_workflow_agent_skill(
    workflow_id: uuid.UUID,
    body: dict,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Toggle whether a workflow is exposed as an agent skill."""
    user = await get_user_from_clerk(clerk_user, session)
    service = WorkflowService(session)

    workflow = await service.get_by_id(workflow_id, user_id=user.id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found.",
        )

    is_agent_skill = body.get("is_agent_skill")
    if is_agent_skill is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="is_agent_skill field is required.",
        )

    workflow.is_agent_skill = bool(is_agent_skill)
    await session.commit()
    await session.refresh(workflow)

    return workflow


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
    request: Request,
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    """Send a message to a workflow and get a response."""
    # Rate limit chat requests to prevent abuse
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

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
    request: Request,
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
    # Rate limit chat requests to prevent abuse
    await check_rate_limit_with_user(request, user_id=clerk_user.user_id)

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


