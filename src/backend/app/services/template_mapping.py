"""
Template mapping service for converting Q&A answers to Langflow flows.

This is the core logic that transforms user-friendly questions
into a working AI agent configuration with tools.
"""
import copy
import json
import random
import re
import string
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from app.config import settings


class TemplateMappingError(Exception):
    """Exception raised when template mapping fails."""

    pass


# Mapping of tool IDs to their template file names
TOOL_MAPPING = {
    "web_search": "web_search",
    "calculator": "calculator",
    "url_reader": "url_reader",
    "google_maps": "google_maps",
}


class TemplateMapper:
    """
    Maps user Q&A answers to Langflow flow configurations.

    The 3-step Q&A approach:
    1. Who is Charlie? (agent identity/role)
    2. What are his rules? (constraints/knowledge)
    3. What tricks does he know? (capabilities/tools)

    These are combined into a system prompt and injected into an Agent flow template,
    with selected tools dynamically added as connected components.
    """

    def __init__(self, templates_dir: str = None):
        if templates_dir:
            self.templates_dir = Path(templates_dir)
        else:
            # Default to templates directory relative to this file
            self.templates_dir = Path(__file__).parent.parent.parent / "templates"

        self.tools_dir = self.templates_dir / "tools"

    def _generate_node_id(self, component_type: str) -> str:
        """Generate a unique node ID for a component."""
        suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
        return f"{component_type}-{suffix}"

    def generate_system_prompt(
        self,
        who: str,
        rules: str,
        tools_description: str = "",
    ) -> str:
        """
        Generate a system prompt from Q&A answers.

        Args:
            who: Answer to "Who is Charlie? What kind of job does he have?"
            rules: Answer to "What are the rules to his job?"
            tools_description: Description of available tools (auto-generated)

        Returns:
            A well-structured system prompt
        """
        # Clean up inputs
        who = who.strip()
        rules = rules.strip()

        # Generate the system prompt
        system_prompt = f"""You are {who}.

## Your Rules and Knowledge
{rules}

## Important Guidelines
- Always stay in character as described above
- Be helpful, friendly, and professional
- If you don't know something, admit it honestly
- Keep responses concise but informative
- Ask clarifying questions when needed
- Use your available tools when they can help answer questions"""

        if tools_description:
            system_prompt += f"""

## Your Tools
You have access to the following tools:
{tools_description}
Use these tools when appropriate to provide accurate, up-to-date information."""

        return system_prompt.strip()

    def generate_agent_name(self, who: str) -> str:
        """
        Generate a friendly agent name from the 'who' description.

        Args:
            who: Answer to "Who is Charlie?"

        Returns:
            A short, friendly name for the agent
        """
        # Extract key words
        who_lower = who.lower()

        # Common role patterns
        role_patterns = [
            (r"(?:a|an)\s+(\w+)\s+assistant", r"\1 Charlie"),
            (r"(?:a|an)\s+(\w+)\s+agent", r"\1 Charlie"),
            (r"(?:a|an)\s+(\w+)\s+helper", r"\1 Charlie"),
            (r"(?:a|an)\s+(\w+)\s+bot", r"\1 Charlie"),
            (r"(\w+)\s+support", r"\1 Support Charlie"),
            (r"(\w+)\s+expert", r"\1 Expert Charlie"),
        ]

        for pattern, replacement in role_patterns:
            match = re.search(pattern, who_lower)
            if match:
                name = re.sub(pattern, replacement, who_lower)
                # Capitalize words
                return " ".join(word.capitalize() for word in name.split()[:3])

        # Default: use first few words
        words = who.split()[:3]
        return " ".join(words) + " Charlie" if words else "My Charlie"

    def load_template(self, template_name: str = "agent_base") -> Dict[str, Any]:
        """
        Load a flow template from the templates directory.

        Args:
            template_name: Name of the template (without .json extension)

        Returns:
            Template data as dictionary
        """
        template_path = self.templates_dir / f"{template_name}.json"

        if not template_path.exists():
            raise TemplateMappingError(
                f"Template '{template_name}' not found at {template_path}"
            )

        try:
            with open(template_path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise TemplateMappingError(f"Invalid template JSON: {e}")

    def load_tool_template(self, tool_id: str) -> Optional[Dict[str, Any]]:
        """
        Load a tool component template.

        Args:
            tool_id: Tool identifier (e.g., 'web_search', 'calculator')

        Returns:
            Tool template data or None if not found
        """
        if tool_id not in TOOL_MAPPING:
            return None

        tool_file = TOOL_MAPPING[tool_id]
        tool_path = self.tools_dir / f"{tool_file}.json"

        if not tool_path.exists():
            return None

        try:
            with open(tool_path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return None

    def _create_tool_edge(
        self,
        tool_node_id: str,
        tool_type: str,
        tool_output: Dict[str, Any],
        agent_node_id: str,
    ) -> Dict[str, Any]:
        """
        Create an edge connecting a tool to the Agent's tools input.

        Args:
            tool_node_id: The ID of the tool node
            tool_type: The component type of the tool
            tool_output: The output definition from tool template
            agent_node_id: The ID of the Agent node

        Returns:
            Edge definition dictionary
        """
        output_name = tool_output.get("name", "component_as_tool")
        output_types = tool_output.get("output_types", ["Tool"])

        return {
            "animated": False,
            "className": "",
            "data": {
                "sourceHandle": {
                    "dataType": tool_type,
                    "id": tool_node_id,
                    "name": output_name,
                    "output_types": output_types
                },
                "targetHandle": {
                    "fieldName": "tools",
                    "id": agent_node_id,
                    "inputTypes": ["Tool"],
                    "type": "other"
                }
            },
            "id": f"edge-{tool_node_id}-to-agent",
            "source": tool_node_id,
            "sourceHandle": json.dumps({
                "dataType": tool_type,
                "id": tool_node_id,
                "name": output_name,
                "output_types": output_types
            }),
            "target": agent_node_id,
            "targetHandle": json.dumps({
                "fieldName": "tools",
                "id": agent_node_id,
                "inputTypes": ["Tool"],
                "type": "other"
            })
        }

    def inject_tools(
        self,
        flow_data: Dict[str, Any],
        selected_tools: List[str],
        agent_node_id: str,
    ) -> Tuple[Dict[str, Any], str]:
        """
        Inject tool components into the flow.

        Args:
            flow_data: The flow template data
            selected_tools: List of tool IDs to add
            agent_node_id: The ID of the Agent node to connect tools to

        Returns:
            Tuple of (modified flow_data, tools_description for system prompt)
        """
        if not selected_tools:
            return flow_data, ""

        tools_description_parts = []
        y_offset = 350  # Starting Y position for tools (below Agent)

        for tool_id in selected_tools:
            tool_template = self.load_tool_template(tool_id)
            if not tool_template:
                continue

            # Generate unique node ID
            component_type = tool_template["component_type"]
            node_id = self._generate_node_id(component_type)

            # Create node from template
            node = copy.deepcopy(tool_template["node"])

            # Update IDs in the node
            node["id"] = node_id
            node["data"]["id"] = node_id

            # Update position (stack tools vertically to the left of Agent)
            node["position"] = {"x": 100, "y": y_offset}
            y_offset += 150  # Space between tools

            # Add node to flow
            flow_data["data"]["nodes"].append(node)

            # Create edge connecting tool to Agent
            edge_output = tool_template.get("edge_output", {
                "name": "component_as_tool",
                "output_types": ["Tool"]
            })
            edge = self._create_tool_edge(
                tool_node_id=node_id,
                tool_type=component_type,
                tool_output=edge_output,
                agent_node_id=agent_node_id,
            )
            flow_data["data"]["edges"].append(edge)

            # Build tools description for system prompt
            display_name = tool_template.get("display_name", tool_id)
            description = tool_template.get("description", "")
            tools_description_parts.append(f"- {display_name}: {description}")

        tools_description = "\n".join(tools_description_parts)
        return flow_data, tools_description

    def inject_system_prompt(
        self,
        template: Dict[str, Any],
        system_prompt: str,
    ) -> Tuple[Dict[str, Any], str]:
        """
        Inject the system prompt into the Agent template.

        Args:
            template: Flow template data
            system_prompt: Generated system prompt

        Returns:
            Tuple of (modified template, agent_node_id)
        """
        # Deep copy to avoid modifying the original
        flow_data = copy.deepcopy(template)

        # Find and update the Agent node
        nodes = flow_data.get("data", {}).get("nodes", [])
        edges = flow_data.get("data", {}).get("edges", [])
        agent_node_id = None

        # First pass: find all nodes and generate new IDs
        id_mapping = {}  # old_id -> new_id

        for node in nodes:
            node_data = node.get("data", {})
            node_type = node_data.get("type", "")
            old_id = node.get("id")

            if node_type == "Agent":
                # Update system_prompt field
                template_fields = node_data.get("node", {}).get("template", {})
                if "system_prompt" in template_fields:
                    template_fields["system_prompt"]["value"] = system_prompt

                # Generate new unique ID for this agent
                new_id = self._generate_node_id("Agent")
                id_mapping[old_id] = new_id
                node["id"] = new_id
                node["data"]["id"] = new_id
                agent_node_id = new_id

            elif node_type == "ChatInput":
                new_id = self._generate_node_id("ChatInput")
                id_mapping[old_id] = new_id
                node["id"] = new_id
                node["data"]["id"] = new_id

            elif node_type == "ChatOutput":
                new_id = self._generate_node_id("ChatOutput")
                id_mapping[old_id] = new_id
                node["id"] = new_id
                node["data"]["id"] = new_id

        # Second pass: update all edges with new IDs
        for edge in edges:
            old_source = edge.get("source")
            old_target = edge.get("target")

            if old_source in id_mapping:
                new_source = id_mapping[old_source]
                edge["source"] = new_source
                edge["data"]["sourceHandle"]["id"] = new_source
                # Update sourceHandle JSON string
                edge["sourceHandle"] = edge["sourceHandle"].replace(old_source, new_source)

            if old_target in id_mapping:
                new_target = id_mapping[old_target]
                edge["target"] = new_target
                edge["data"]["targetHandle"]["id"] = new_target
                # Update targetHandle JSON string
                edge["targetHandle"] = edge["targetHandle"].replace(old_target, new_target)

        return flow_data, agent_node_id

    def create_flow_from_qa(
        self,
        who: str,
        rules: str,
        tricks: str = "",
        selected_tools: List[str] = None,
        template_name: str = "agent_base",
    ) -> Tuple[Dict[str, Any], str, str]:
        """
        Create a complete flow configuration from Q&A answers.

        Args:
            who: Answer to "Who is Charlie?"
            rules: Answer to "What are his rules?"
            tricks: Answer to "What tricks does he know?" (legacy, kept for compatibility)
            selected_tools: List of tool IDs to add (e.g., ['web_search', 'calculator'])
            template_name: Template to use (default: agent_base)

        Returns:
            Tuple of (flow_data, system_prompt, agent_name)
        """
        selected_tools = selected_tools or []

        # Load template
        template = self.load_template(template_name)

        # Inject system prompt placeholder and get agent node ID
        flow_data, agent_node_id = self.inject_system_prompt(template, "")

        # Inject tools and get tools description
        flow_data, tools_description = self.inject_tools(
            flow_data,
            selected_tools,
            agent_node_id,
        )

        # Generate system prompt with tools description
        system_prompt = self.generate_system_prompt(who, rules, tools_description)

        # Update the agent's system prompt with the full version
        for node in flow_data.get("data", {}).get("nodes", []):
            if node.get("data", {}).get("type") == "Agent":
                template_fields = node["data"].get("node", {}).get("template", {})
                if "system_prompt" in template_fields:
                    template_fields["system_prompt"]["value"] = system_prompt

        # Generate agent name
        agent_name = self.generate_agent_name(who)

        return flow_data, system_prompt, agent_name


# Singleton instance
template_mapper = TemplateMapper()
