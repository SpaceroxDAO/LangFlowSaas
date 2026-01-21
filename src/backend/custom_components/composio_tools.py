"""
Composio Tools Component for Langflow Canvas - Dynamic Action Picker Edition

This component provides fine-grained control over Composio tools:
- Select an app (Gmail, Slack, etc.)
- See all available actions for that app
- Choose exactly which actions to enable
- Only selected actions are loaded as tools

This prevents the LLM from being overwhelmed with too many tools
and ensures the right tools are available for the task.
"""
import os
import time
import logging
from typing import Any, Dict, List, Optional

from langflow.custom import Component
from langflow.io import (
    Output,
    SecretStrInput,
    StrInput,
    MultilineInput,
    DropdownInput,
    BoolInput,
    IntInput,
    MultiselectInput,
)
from langflow.field_typing import Tool
from langflow.field_typing.range_spec import RangeSpec

logger = logging.getLogger(__name__)


class ComposioToolsComponent(Component):
    """
    My Connected Apps - Dynamic Action Picker

    Select an app and choose exactly which actions to enable.
    This gives you fine-grained control over what tools your agent can use.
    """

    display_name = "My Connected Apps"
    description = "Select an app and choose specific actions to enable for your agent"
    icon = "link"
    name = "ComposioTools"

    # =========================================================================
    # CLASS-LEVEL CACHING
    # =========================================================================
    # Cache fetched actions to avoid repeated API calls
    _ACTION_CACHE: Dict[str, Dict[str, Any]] = {}
    _CACHE_TTL = 300  # 5 minutes

    # =========================================================================
    # ESSENTIAL ACTIONS PER APP
    # =========================================================================
    # Pre-defined essential actions for common apps
    # These use the human-readable display names returned by Composio API
    ESSENTIAL_ACTIONS = {
        "gmail": [
            "Send Email",
            "Fetch emails",
            "Reply to email thread",
            "Create email draft",
            "Get Profile",
        ],
        "googlecalendar": [
            "Create event",
            "Find event",
            "List calendars",
            "Delete event",
            "Update event",
        ],
        "slack": [
            "Sends a message to a Slack channel",
            "List all Slack team channels",
            "Fetch messages from channel",
            "Send direct message",
        ],
        "github": [
            "Create an issue",
            "List repository issues",
            "Star a repository for the authenticated user",
            "Get a repository",
            "Create a pull request",
        ],
        "notion": [
            "Create a new page",
            "Query a database",
            "Update page properties",
            "Search by title",
            "Retrieve a database",
        ],
        "linear": [
            "Create Linear issue",
            "List Linear issues",
            "Update Linear issue",
            "List Linear projects",
        ],
        "discord": [
            "Send message",
            "List channels",
            "Get channel messages",
        ],
        "jira": [
            "Create issue",
            "Get issue",
            "Update issue",
            "Search issues",
        ],
        "asana": [
            "Create task",
            "Get task",
            "Update task",
            "Search tasks",
        ],
        "trello": [
            "Create card",
            "Get card",
            "Update card",
            "List boards",
        ],
        "outlook": [
            "Send email",
            "List messages",
            "Get message",
            "Create draft",
        ],
        "googledocs": [
            "Create a new document",
            "Get document content",
            "Batch update document",
        ],
        "googlesheets": [
            "Batch get sheet values",
            "Batch update sheet values",
            "Create Google sheet",
        ],
    }

    # Supported apps list
    SUPPORTED_APPS = [
        "gmail",
        "googlecalendar",
        "slack",
        "github",
        "notion",
        "linear",
        "discord",
        "jira",
        "asana",
        "trello",
        "outlook",
        "googledocs",
        "googlesheets",
    ]

    inputs = [
        # =====================================================================
        # PRIMARY INPUTS
        # =====================================================================
        DropdownInput(
            name="app_name",
            display_name="Connected App",
            options=[
                "gmail",
                "googlecalendar",
                "slack",
                "github",
                "notion",
                "linear",
                "discord",
                "jira",
                "asana",
                "trello",
                "outlook",
                "googledocs",
                "googlesheets",
            ],
            value="gmail",
            info="Select which app's actions to configure. The available actions will update automatically.",
            real_time_refresh=True,  # Triggers update_outputs() on change
        ),
        DropdownInput(
            name="action_preset",
            display_name="Action Preset",
            options=[
                "Essential Actions",
                "All Actions",
                "Custom Selection",
            ],
            value="Essential Actions",
            info="Quick selection: Essential (recommended), All, or Custom (manual selection below)",
            real_time_refresh=True,  # Triggers update_outputs() on change
        ),
        MultiselectInput(
            name="selected_actions",
            display_name="Selected Actions",
            options=[],  # Will be populated dynamically
            value=[],    # Will be set based on preset
            info="Choose which actions to enable. Only these will be available to your agent.",
        ),

        # =====================================================================
        # ADVANCED SETTINGS
        # =====================================================================
        StrInput(
            name="entity_id",
            display_name="Entity ID",
            info="Pre-configured. Only change if using a custom entity.",
            value="default",
            advanced=True,
        ),
        SecretStrInput(
            name="composio_api_key",
            display_name="Composio API Key",
            info="Pre-configured from environment. Leave blank to use COMPOSIO_API_KEY.",
            required=False,
            advanced=True,
        ),
        BoolInput(
            name="show_action_descriptions",
            display_name="Show Action Descriptions",
            info="Show detailed descriptions for each action in the status",
            value=False,
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Tools",
            name="tools",
            method="get_tools",
        ),
    ]

    # =========================================================================
    # HELPER METHODS
    # =========================================================================

    def _get_api_key(self) -> Optional[str]:
        """Get Composio API key from input or environment."""
        return self.composio_api_key or os.environ.get("COMPOSIO_API_KEY")

    def _format_action_name(self, slug: str) -> str:
        """
        Convert action slug to friendly display name.

        GMAIL_SEND_EMAIL -> Send Email
        SLACK_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL -> Sends A Message To A Slack Channel
        """
        # Remove app prefix (everything before first underscore)
        parts = slug.split("_", 1)
        if len(parts) > 1:
            name_part = parts[1]
        else:
            name_part = slug

        # Convert to title case
        words = name_part.replace("_", " ").split()
        return " ".join(word.capitalize() for word in words)

    def _get_cached_actions(self, app_name: str) -> Optional[List[str]]:
        """Get actions from cache if not expired."""
        cache_key = app_name.lower()
        if cache_key in self._ACTION_CACHE:
            cached = self._ACTION_CACHE[cache_key]
            if time.time() - cached.get("timestamp", 0) < self._CACHE_TTL:
                return cached.get("actions", [])
        return None

    def _cache_actions(self, app_name: str, actions: List[str]) -> None:
        """Store actions in cache."""
        cache_key = app_name.lower()
        self._ACTION_CACHE[cache_key] = {
            "timestamp": time.time(),
            "actions": actions,
        }

    def _fetch_actions_from_api(self, app_name: str) -> List[str]:
        """
        Fetch available actions for an app from Composio API.

        Returns list of action slugs.
        """
        api_key = self._get_api_key()
        if not api_key:
            logger.warning("No Composio API key available")
            return []

        try:
            from composio import Composio

            client = Composio(api_key=api_key)

            # Fetch all tools for this app (high limit to get everything)
            raw_tools = client.tools.get_raw_composio_tools(
                toolkits=[app_name.lower()],
                limit=100
            )

            if not raw_tools:
                logger.info(f"No actions found for {app_name}")
                return []

            # Extract action slugs
            actions = [tool.name for tool in raw_tools]
            logger.info(f"Fetched {len(actions)} actions for {app_name}")

            return actions

        except Exception as e:
            logger.error(f"Failed to fetch actions for {app_name}: {e}")
            return []

    def _get_actions_for_app(self, app_name: str) -> List[str]:
        """
        Get available actions for an app (with caching).

        Falls back to essential actions if API fails.
        """
        app_lower = app_name.lower()

        # Check cache first
        cached = self._get_cached_actions(app_lower)
        if cached:
            return cached

        # Try fetching from API
        actions = self._fetch_actions_from_api(app_lower)

        if actions:
            self._cache_actions(app_lower, actions)
            return actions

        # Fallback to hardcoded essential actions
        fallback = self.ESSENTIAL_ACTIONS.get(app_lower, [])
        if fallback:
            logger.info(f"Using fallback essential actions for {app_name}")
        return fallback

    # =========================================================================
    # DYNAMIC UI
    # =========================================================================

    def update_build_config(
        self,
        build_config: dict,
        field_value: Any,
        field_name: str | None = None
    ) -> dict:
        """
        Called when app_name or action_preset changes (via real_time_refresh=True).

        Updates the available actions in the multi-select dropdown
        and applies presets.

        Args:
            build_config: The current component configuration dict
            field_value: The new value of the changed field
            field_name: The name of the field that changed

        Returns:
            Updated build_config dict
        """
        # Get current values from build_config
        app_name = build_config.get("app_name", {}).get("value", "gmail")
        preset = build_config.get("action_preset", {}).get("value", "Essential Actions")

        # Only update when app_name or action_preset changes (or on initial load)
        if field_name in ("app_name", "action_preset", None):
            # Fetch available actions for this app
            available_actions = self._get_actions_for_app(app_name)

            # Update the multi-select options
            if "selected_actions" in build_config:
                build_config["selected_actions"]["options"] = available_actions

                # Apply preset
                if preset == "Essential Actions":
                    # Select only essential actions
                    essential = self.ESSENTIAL_ACTIONS.get(app_name.lower(), [])
                    # Filter to only actions that exist in available_actions
                    selected = [a for a in essential if a in available_actions]
                    build_config["selected_actions"]["value"] = selected

                elif preset == "All Actions":
                    # Select all available actions
                    build_config["selected_actions"]["value"] = available_actions

                # "Custom Selection" - don't change current selection
                # (user is manually selecting)

        return build_config

    # =========================================================================
    # MAIN OUTPUT METHOD
    # =========================================================================

    def get_tools(self) -> List[Tool]:
        """
        Fetch LangChain-compatible tools for only the selected actions.

        This is the main output method that returns tools to connect to an Agent.
        """
        api_key = self._get_api_key()
        if not api_key:
            self.status = "⚠️ Setup needed: Add COMPOSIO_API_KEY to environment variables"
            return []

        app_name = self.app_name or "gmail"
        entity_id = self.entity_id or "default"
        selected_actions = self.selected_actions or []

        # If no actions selected, try to use essential actions
        if not selected_actions:
            selected_actions = self.ESSENTIAL_ACTIONS.get(app_name.lower(), [])
            if not selected_actions:
                self.status = "⚠️ No actions selected. Choose actions from the list above."
                return []

        try:
            from composio import Composio
            from composio_langchain import LangchainProvider
        except ImportError as e:
            self.status = f"❌ Composio SDK not installed: {e}"
            logger.error(f"Composio import error: {e}")
            return []

        try:
            client = Composio(api_key=api_key)

            # Fetch all tools for the app first
            logger.info(f"Loading {app_name} tools for actions: {selected_actions}")
            all_raw_tools = client.tools.get_raw_composio_tools(
                toolkits=[app_name.lower()],
                limit=100  # Get all available
            )

            if not all_raw_tools:
                self.status = f"⚠️ No tools found for {app_name}. Make sure you've connected this app in Composio."
                return []

            # Filter to only selected actions
            raw_tools = [
                tool for tool in all_raw_tools
                if tool.name in selected_actions
            ]

            if not raw_tools:
                self.status = f"⚠️ None of the selected actions were found. Try selecting different actions."
                return []

            # Create execute function with entity bound
            def execute_with_user(slug: str, arguments: dict):
                logger.info(f"Executing {slug} for entity {entity_id}")
                return client.tools.execute(
                    slug=slug,
                    arguments=arguments,
                    user_id=entity_id,
                    dangerously_skip_version_check=True
                )

            # Wrap tools for LangChain
            provider = LangchainProvider()
            langchain_tools = provider.wrap_tools(raw_tools, execute_with_user)

            # Build friendly status message
            tool_names = [self._format_action_name(t.name) for t in langchain_tools]

            if len(tool_names) <= 5:
                tools_display = ", ".join(tool_names)
            else:
                tools_display = ", ".join(tool_names[:4]) + f" +{len(tool_names) - 4} more"

            self.status = f"✓ {len(langchain_tools)} {app_name} actions ready: {tools_display}"

            return langchain_tools

        except Exception as e:
            self.status = f"❌ Error loading tools: {str(e)}"
            logger.error(f"Composio error for {app_name}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return []


class ComposioAllMyAppsComponent(Component):
    """
    All My Connected Apps - Load tools from ALL your connected apps at once.

    Perfect for agents that need access to multiple integrations.
    Just drag, connect, and go - no configuration needed!
    """

    display_name = "All My Connected Apps"
    description = "Load tools from ALL your connected Composio apps automatically"
    icon = "layers"
    name = "ComposioAllApps"

    inputs = [
        # No required inputs! Everything is auto-detected.
        StrInput(
            name="entity_id",
            display_name="Entity ID",
            info="Pre-configured. Only change if using a custom entity.",
            value="default",
            advanced=True,
        ),
        SecretStrInput(
            name="composio_api_key",
            display_name="Composio API Key",
            info="Pre-configured from environment. Leave blank.",
            required=False,
            advanced=True,
        ),
        IntInput(
            name="tool_limit",
            display_name="Tools Per App",
            value=10,
            range_spec=RangeSpec(min=1, max=30),
            info="Maximum tools to load per connected app",
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Tools",
            name="tools",
            method="get_all_tools",
        ),
    ]

    def get_all_tools(self) -> List[Tool]:
        """
        Auto-detect and load tools from ALL connected apps.
        """
        api_key = self.composio_api_key or os.environ.get("COMPOSIO_API_KEY")
        if not api_key:
            self.status = "Setup needed: Add COMPOSIO_API_KEY to your environment variables."
            return []

        entity_id = self.entity_id or "default"

        try:
            from composio import Composio
            from composio_langchain import LangchainProvider
        except ImportError as e:
            self.status = f"Composio SDK not installed: {e}"
            return []

        try:
            client = Composio(api_key=api_key)

            # Get all connected apps for this entity
            logger.info(f"Discovering connected apps for entity {entity_id}...")

            try:
                # Try to get connected accounts to determine which apps are available
                connections = client.connected_accounts.get(entity_id=entity_id)
                if connections:
                    app_names = list(set(conn.app_name.lower() for conn in connections if hasattr(conn, 'app_name')))
                    logger.info(f"Found connected apps: {app_names}")
                else:
                    # Fallback to common apps
                    app_names = ["gmail", "googlecalendar", "slack"]
                    logger.info("No connections found, using default apps")
            except Exception as e:
                # Fallback to common apps if connection detection fails
                logger.warning(f"Could not detect connected apps: {e}")
                app_names = ["gmail", "googlecalendar", "slack"]

            if not app_names:
                self.status = "No connected apps found. Connect apps in your Composio dashboard first."
                return []

            # Fetch tools for all connected apps
            raw_tools = client.tools.get_raw_composio_tools(
                toolkits=app_names,
                limit=self.tool_limit * len(app_names)
            )

            if not raw_tools:
                self.status = f"No tools found for connected apps: {', '.join(app_names)}"
                return []

            def execute_with_user(slug: str, arguments: dict):
                return client.tools.execute(
                    slug=slug,
                    arguments=arguments,
                    user_id=entity_id,
                    dangerously_skip_version_check=True
                )

            provider = LangchainProvider()
            langchain_tools = provider.wrap_tools(raw_tools, execute_with_user)

            self.status = f"Ready! {len(langchain_tools)} tools from {len(app_names)} apps: {', '.join(app_names)}"
            return langchain_tools

        except Exception as e:
            self.status = f"Error: {str(e)}"
            logger.error(f"Composio all-apps error: {e}")
            return []


class ComposioMultiAppToolsComponent(Component):
    """
    My Connected Apps (Custom Selection) - Choose specific apps to load.

    For advanced users who want to specify exactly which apps to use.
    """

    display_name = "My Connected Apps (Custom)"
    description = "Load tools from specific apps you choose"
    icon = "settings"
    name = "ComposioMultiTools"

    inputs = [
        MultilineInput(
            name="app_names",
            display_name="Apps to Load",
            info="Enter app names separated by commas (e.g., gmail, slack, notion)",
            value="gmail",
        ),
        StrInput(
            name="entity_id",
            display_name="Entity ID",
            value="default",
            advanced=True,
        ),
        SecretStrInput(
            name="composio_api_key",
            display_name="Composio API Key",
            required=False,
            advanced=True,
        ),
        IntInput(
            name="tool_limit",
            display_name="Tools Per App",
            value=10,
            range_spec=RangeSpec(min=1, max=30),
            advanced=True,
        ),
    ]

    outputs = [
        Output(
            display_name="Tools",
            name="tools",
            method="get_tools",
        ),
    ]

    def get_tools(self) -> List[Tool]:
        """Fetch tools from specified Composio apps."""
        api_key = self.composio_api_key or os.environ.get("COMPOSIO_API_KEY")
        if not api_key:
            self.status = "Setup needed: Add COMPOSIO_API_KEY to environment."
            return []

        entity_id = self.entity_id or "default"
        app_names_raw = self.app_names or "gmail"
        app_names = [name.strip().lower() for name in app_names_raw.split(",") if name.strip()]

        if not app_names:
            self.status = "Enter at least one app name."
            return []

        try:
            from composio import Composio
            from composio_langchain import LangchainProvider
        except ImportError as e:
            self.status = f"Composio SDK not installed: {e}"
            return []

        try:
            client = Composio(api_key=api_key)

            raw_tools = client.tools.get_raw_composio_tools(
                toolkits=app_names,
                limit=self.tool_limit * len(app_names)
            )

            if not raw_tools:
                self.status = f"No tools found for: {', '.join(app_names)}"
                return []

            def execute_with_user(slug: str, arguments: dict):
                return client.tools.execute(
                    slug=slug,
                    arguments=arguments,
                    user_id=entity_id,
                    dangerously_skip_version_check=True
                )

            provider = LangchainProvider()
            langchain_tools = provider.wrap_tools(raw_tools, execute_with_user)

            self.status = f"Ready! {len(langchain_tools)} tools from: {', '.join(app_names)}"
            return langchain_tools

        except Exception as e:
            self.status = f"Error: {str(e)}"
            logger.error(f"Composio multi-app error: {e}")
            return []
