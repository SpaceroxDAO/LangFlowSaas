"""
Composio Agent Service - executes LangChain agents with Composio tools.

This service provides an alternative execution path that bypasses Langflow
and uses LangChain directly with Composio tools for users with connected apps.

Key features:
- Creates LangChain agents with user's connected Composio tools
- Supports streaming responses with tool call visibility
- Maintains conversation history within sessions
"""
import logging
import uuid
from datetime import datetime
from typing import Any, AsyncGenerator, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User
from app.models.workflow import Workflow
from app.services.composio_connection_service import ComposioConnectionService
from app.services.settings_service import SettingsService
from app.schemas.streaming import (
    StreamEvent,
    StreamEventType,
    text_delta_event,
    text_complete_event,
    thinking_start_event,
    thinking_delta_event,
    thinking_end_event,
    tool_call_start_event,
    tool_call_end_event,
    session_start_event,
    error_event,
    done_event,
)

logger = logging.getLogger(__name__)


class ComposioAgentServiceError(Exception):
    """Exception raised when Composio agent operations fail."""
    pass


class ComposioAgentService:
    """
    Service for executing chat with LangChain agents powered by Composio tools.

    This provides an enhanced chat experience where users' connected apps
    are automatically available as tools to the AI agent.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self._connection_service = None

    def _get_connection_service(self) -> ComposioConnectionService:
        """Get or create connection service."""
        if self._connection_service is None:
            self._connection_service = ComposioConnectionService(self.session)
        return self._connection_service

    async def _get_openai_api_key(self, user: User) -> Optional[str]:
        """
        Get the OpenAI API key from user settings.

        Falls back to environment variable if not set in user settings.
        """
        settings_service = SettingsService(self.session)
        user_settings = await settings_service.get_or_create(user)

        # Try to get from user settings first
        api_key = settings_service.get_api_key(user_settings, "openai")
        if api_key:
            return api_key

        # Fall back to environment variable
        import os
        return os.environ.get("OPENAI_API_KEY")

    async def get_available_tools_for_user(
        self,
        user: User,
    ) -> List[Dict[str, Any]]:
        """
        Get list of available Composio tools for a user based on their connections.

        Returns tool metadata (not the actual LangChain tools).
        """
        connection_service = self._get_connection_service()
        tools_response = await connection_service.get_tools_for_user(user)

        return [
            {
                "name": tool.name,
                "description": tool.description,
                "app_name": tool.app_name,
                "parameters": tool.parameters,
            }
            for tool in tools_response.tools
        ]

    async def _get_entity_id_for_tools(self, user: User, app_names: Optional[List[str]] = None) -> str:
        """
        Get the correct Composio entity_id for fetching tools.

        Looks up the entity_id from stored connections first, falls back to user ID.
        """
        # Try to get entity_id from stored connections
        connection_service = self._get_connection_service()
        connections = await connection_service.get_active_connections(user.id)

        if connections:
            # Use the entity_id from the first connection
            # (they should all be the same for a user)
            for conn in connections:
                if conn.composio_entity_id:
                    logger.info(f"Using entity_id from stored connection: {conn.composio_entity_id}")
                    return conn.composio_entity_id

        # Fall back to user ID
        logger.info(f"Using user ID as entity_id: {user.id}")
        return str(user.id)

    def _get_langchain_tools(self, user: User, app_names: Optional[List[str]] = None, entity_id: Optional[str] = None) -> List[Any]:
        """
        Get LangChain-compatible tools for a user.

        Uses the new Composio SDK (v0.10+) to get tools and wrap them for LangChain.
        """
        if not settings.composio_api_key:
            logger.warning("Composio API key not configured")
            return []

        # Use provided entity_id or fall back to 'default' for Composio dashboard connections
        if not entity_id:
            entity_id = "default"

        try:
            from composio import Composio
            from composio_langchain import LangchainProvider
        except (ImportError, AttributeError) as e:
            logger.error(f"Cannot import Composio SDK (requires Python 3.10+): {e}")
            return []

        try:
            import time

            logger.info("Creating Composio client...")
            start_time = time.time()
            client = Composio(api_key=settings.composio_api_key)
            logger.info(f"Composio client created in {time.time() - start_time:.2f}s")

            # Convert app_names to toolkits format (lowercase)
            toolkits = None
            if app_names:
                toolkits = [name.lower() for name in app_names]
            else:
                # Default to gmail if no apps specified (or get from user's connections)
                toolkits = ['gmail']

            # Get raw Composio tools
            logger.info(f"Getting tools for toolkits: {toolkits}")
            tools_start = time.time()
            raw_tools = client.tools.get_raw_composio_tools(toolkits=toolkits, limit=20)
            logger.info(f"Got {len(raw_tools)} raw tools in {time.time() - tools_start:.2f}s")

            if not raw_tools:
                logger.warning("No tools returned from Composio")
                return []

            # Create execute function with user_id bound
            def execute_with_user(slug: str, arguments: dict):
                logger.info(f"Executing tool {slug} for user {entity_id}")
                return client.tools.execute(
                    slug=slug,
                    arguments=arguments,
                    user_id=entity_id,
                    # Skip version check to allow execution without specifying toolkit versions
                    # This is safe for user-facing tools where we always use latest
                    dangerously_skip_version_check=True
                )

            # Wrap tools for LangChain
            logger.info("Wrapping tools with LangchainProvider...")
            wrap_start = time.time()
            provider = LangchainProvider()
            langchain_tools = provider.wrap_tools(raw_tools, execute_with_user)
            logger.info(f"Wrapped {len(langchain_tools)} tools in {time.time() - wrap_start:.2f}s")

            return langchain_tools

        except Exception as e:
            logger.error(f"Failed to get LangChain tools: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return []

    async def chat(
        self,
        user: User,
        message: str,
        workflow: Optional[Workflow] = None,
        conversation_id: Optional[str] = None,
        app_names: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Execute a non-streaming chat with Composio tools.

        Args:
            user: The user making the request
            message: User's chat message
            workflow: Optional workflow for system prompt context
            conversation_id: Optional ID for conversation continuity
            app_names: Optional list of app names to filter tools

        Returns:
            Chat response with text and metadata
        """
        # Get the correct entity_id from stored connections
        entity_id = await self._get_entity_id_for_tools(user, app_names)
        tools = self._get_langchain_tools(user, app_names, entity_id)

        if not tools:
            raise ComposioAgentServiceError(
                "No Composio tools available. Please connect at least one app."
            )

        # Get OpenAI API key from user settings
        api_key = await self._get_openai_api_key(user)
        if not api_key:
            raise ComposioAgentServiceError(
                "OpenAI API key not configured. Please add your API key in Settings."
            )

        try:
            from langchain_openai import ChatOpenAI
            from langchain.agents import AgentExecutor, create_openai_functions_agent
            from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

            # Get system prompt from workflow or use default
            system_prompt = self._get_system_prompt(workflow)

            # Create prompt template
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                MessagesPlaceholder(variable_name="chat_history", optional=True),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ])

            # Create LLM with user's API key
            llm = ChatOpenAI(
                model=settings.default_llm_model if hasattr(settings, 'default_llm_model') else "gpt-4o",
                temperature=0.7,
                streaming=False,
                api_key=api_key,
            )

            # Create agent
            agent = create_openai_functions_agent(llm, tools, prompt)
            agent_executor = AgentExecutor(
                agent=agent,
                tools=tools,
                verbose=True,
                handle_parsing_errors=True,
            )

            # Execute
            result = agent_executor.invoke({
                "input": message,
                "chat_history": [],  # TODO: Load from conversation_id
            })

            return {
                "text": result.get("output", ""),
                "session_id": conversation_id or str(uuid.uuid4()),
                "tools_used": [t.name for t in tools],
                "metadata": {
                    "execution_type": "composio_agent",
                    "tools_available": len(tools),
                },
            }

        except ImportError as e:
            raise ComposioAgentServiceError(
                f"Required packages not installed: {e}. "
                "Install with: pip install langchain langchain-openai"
            )
        except Exception as e:
            logger.error(f"Composio agent chat failed: {e}")
            raise ComposioAgentServiceError(f"Chat execution failed: {e}")

    async def chat_stream(
        self,
        user: User,
        message: str,
        workflow: Optional[Workflow] = None,
        conversation_id: Optional[str] = None,
        app_names: Optional[List[str]] = None,
    ) -> AsyncGenerator[StreamEvent, None]:
        """
        Execute a streaming chat with Composio tools.

        Yields StreamEvent objects that can be sent as Server-Sent Events.

        Args:
            user: The user making the request
            message: User's chat message
            workflow: Optional workflow for system prompt context
            conversation_id: Optional ID for conversation continuity
            app_names: Optional list of app names to filter tools

        Yields:
            StreamEvent objects for real-time updates
        """
        session_id = conversation_id or str(uuid.uuid4())

        # Yield session start FIRST (before any blocking operations)
        yield session_start_event(
            session_id=session_id,
            conversation_id=session_id,
        )

        # Yield thinking event to show we're starting
        yield thinking_start_event()
        yield thinking_delta_event("Initializing tools...")

        # Get OpenAI API key from user settings (async operation)
        api_key = await self._get_openai_api_key(user)
        if not api_key:
            yield thinking_end_event()
            yield error_event("config_error", "OpenAI API key not configured. Please add your API key in Settings.")
            yield done_event()
            return

        # Get the correct entity_id from stored connections
        yield thinking_delta_event("Looking up your connections...")
        entity_id = await self._get_entity_id_for_tools(user, app_names)

        # Get tools (this can be slow due to Composio API calls)
        yield thinking_delta_event(f"Loading tools for entity {entity_id[:8]}...")

        # Run tool fetching in a thread with timeout
        import asyncio

        tools = []
        try:
            tools = await asyncio.wait_for(
                asyncio.to_thread(
                    self._get_langchain_tools, user, app_names, entity_id
                ),
                timeout=30.0  # 30 second timeout
            )
        except asyncio.TimeoutError:
            logger.error("Timeout fetching Composio tools after 30 seconds")
            yield thinking_end_event()
            yield error_event("timeout_error", "Tool loading timed out. The Composio API may be slow - please try again.")
            yield done_event()
            return
        except Exception as e:
            logger.error(f"Error fetching Composio tools: {e}")
            yield thinking_end_event()
            yield error_event("tool_error", f"Failed to load tools: {e}")
            yield done_event()
            return

        yield thinking_end_event()

        if not tools:
            yield error_event("no_tools", "No Composio tools available. Please connect at least one app.")
            yield done_event()
            return

        try:
            from langchain_openai import ChatOpenAI
            from langgraph.prebuilt import create_react_agent
            from langchain_core.messages import HumanMessage, AIMessage
            import asyncio

            # Get system prompt from workflow or use default
            system_prompt = self._get_system_prompt(workflow)

            # Create LLM with user's API key
            llm = ChatOpenAI(
                model=settings.default_llm_model if hasattr(settings, 'default_llm_model') else "gpt-4o",
                temperature=0.7,
                api_key=api_key,
            )

            # Create the react agent using langgraph
            agent = create_react_agent(
                model=llm,
                tools=tools,
                prompt=system_prompt,
            )

            # Run agent in executor to not block
            def run_agent():
                return agent.invoke({
                    "messages": [HumanMessage(content=message)],
                })

            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, run_agent)

            # Process the result messages
            tool_call_index = 0
            final_text = ""

            for msg in result.get("messages", []):
                if hasattr(msg, 'tool_calls') and msg.tool_calls:
                    # This is an AI message with tool calls
                    for tool_call in msg.tool_calls:
                        yield tool_call_start_event(
                            tool_name=tool_call.get("name", "unknown"),
                            tool_input=tool_call.get("args", {}),
                            index=tool_call_index,
                        )
                        tool_call_index += 1
                elif hasattr(msg, 'name') and msg.name:
                    # This is a tool response message
                    yield tool_call_end_event(
                        output=str(msg.content)[:500],  # Truncate long tool outputs
                        index=max(0, tool_call_index - 1),
                    )
                elif isinstance(msg, AIMessage) and msg.content:
                    # This is the final AI response
                    final_text = msg.content

            # Stream the final text
            if final_text:
                # Send as deltas for streaming effect
                chunk_size = 10
                for i in range(0, len(final_text), chunk_size):
                    chunk = final_text[i:i+chunk_size]
                    yield text_delta_event(chunk)
                    await asyncio.sleep(0.01)  # Small delay for streaming effect
                yield text_complete_event(final_text)

            yield done_event()

        except ImportError as e:
            yield error_event(
                "import_error",
                f"Required packages not installed: {e}. "
                "Install with: pip install langchain langchain-openai"
            )
            yield done_event()
        except Exception as e:
            logger.error(f"Composio agent streaming chat failed: {e}")
            yield error_event("execution_error", f"Chat execution failed: {e}")
            yield done_event()

    def _get_system_prompt(self, workflow: Optional[Workflow]) -> str:
        """
        Get the system prompt from workflow or use a default.
        """
        default_prompt = """You are Charlie, a helpful AI assistant with access to various tools and integrations.

You can help users by:
- Answering questions using your knowledge
- Using connected tools to take actions (like sending emails, managing calendars, etc.)
- Providing helpful information and recommendations

When using tools:
- Explain what you're doing before using a tool
- Share the results clearly after tool execution
- If a tool fails, explain what happened and suggest alternatives

Be friendly, helpful, and proactive in assisting users."""

        if workflow:
            # Try to extract system prompt from workflow's flow_data if available
            try:
                if hasattr(workflow, 'flow_data') and workflow.flow_data:
                    flow_data = workflow.flow_data
                    if isinstance(flow_data, dict):
                        # Look for system prompt in flow data
                        data = flow_data.get('data', {})
                        nodes = data.get('nodes', [])
                        for node in nodes:
                            node_data = node.get('data', {})
                            if 'system_prompt' in node_data:
                                return node_data['system_prompt']
            except Exception:
                pass  # Use default prompt if extraction fails

        return default_prompt

    async def check_user_has_tools(self, user: User) -> bool:
        """
        Check if a user has any connected Composio tools available.
        """
        connection_service = self._get_connection_service()
        connections = await connection_service.get_active_connections(user.id)
        return len(connections) > 0
