"""
Template mapping service for converting Q&A answers to Langflow flows.

This is the core logic that transforms user-friendly questions
into a working AI agent configuration with tools.
"""
import copy
import json
import os
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
    # Primary tools
    "web_search": "tavily",            # Tavily - AI-optimized web search
    "calculator": "calculator",        # Math calculations
    "weather": "open_meteo",           # Open-Meteo - free weather API
    "knowledge_search": "knowledge_retriever",  # RAG - search uploaded documents
    # Legacy tools (kept for backwards compatibility)
    "duckduckgo": "web_search",        # DuckDuckGo - free but rate-limited
    "langsearch": "langsearch",        # LangSearch - AI-optimized web search
    "url_reader": "url_reader",
    "google_maps": "google_maps",
}

# LLM Provider configurations for the Agent component
LLM_PROVIDER_CONFIGS = {
    "openai": {
        "agent_llm": "OpenAI",
        "model_name": "gpt-4o-mini",
        "model_options": ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
        "base_url": "https://api.openai.com/v1",
        "api_key_field": "api_key",
    },
    "anthropic": {
        "agent_llm": "Anthropic",
        "model_name": "claude-3-haiku-20240307",
        "model_options": ["claude-3-haiku-20240307", "claude-3-5-sonnet-20241022", "claude-3-opus-20240229"],
        "base_url": "https://api.anthropic.com",
        "api_key_field": "api_key",
    },
    "google": {
        "agent_llm": "Google Generative AI",
        "model_name": "gemini-1.5-flash",
        "model_options": ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"],
        "base_url": "",
        "api_key_field": "api_key",
    },
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
                template = json.load(f)

            # Apply default values if specified in template
            default_values = template.get("default_values", {})
            if default_values:
                node_template = template.get("node", {}).get("data", {}).get("node", {}).get("template", {})
                for field_name, default_value in default_values.items():
                    if field_name in node_template:
                        node_template[field_name]["value"] = default_value

            return template
        except json.JSONDecodeError:
            return None

    def _langflow_handle_str(self, handle_dict: Dict[str, Any]) -> str:
        """
        Convert a handle dictionary to Langflow's special string format.

        Langflow uses 'œ' (Unicode \\u0153) instead of double quotes in
        stringified handles to avoid JSON escaping issues.
        """
        # Convert to JSON string with no spaces after separators
        json_str = json.dumps(handle_dict, separators=(',', ':'))
        # Replace double quotes with Langflow's special character œ
        return json_str.replace('"', 'œ')

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

        # Build handle dictionaries
        source_handle_dict = {
            "dataType": tool_type,
            "id": tool_node_id,
            "name": output_name,
            "output_types": output_types
        }
        target_handle_dict = {
            "fieldName": "tools",
            "id": agent_node_id,
            "inputTypes": ["Tool"],
            "type": "other"
        }

        # Convert to Langflow's special string format (using œ instead of ")
        source_handle_str = self._langflow_handle_str(source_handle_dict)
        target_handle_str = self._langflow_handle_str(target_handle_dict)

        # Build React Flow edge ID format
        edge_id = f"reactflow__edge-{tool_node_id}{source_handle_str}-{agent_node_id}{target_handle_str}"

        return {
            "animated": False,
            "className": "",
            "data": {
                "sourceHandle": source_handle_dict,
                "targetHandle": target_handle_dict
            },
            "id": edge_id,
            "selected": False,
            "source": tool_node_id,
            "sourceHandle": source_handle_str,
            "target": agent_node_id,
            "targetHandle": target_handle_str
        }

    def inject_tools(
        self,
        flow_data: Dict[str, Any],
        selected_tools: List[str],
        agent_node_id: str,
        knowledge_content: str = None,
    ) -> Tuple[Dict[str, Any], str]:
        """
        Inject tool components into the flow.

        Args:
            flow_data: The flow template data
            selected_tools: List of tool IDs to add
            agent_node_id: The ID of the Agent node to connect tools to
            knowledge_content: Combined content from knowledge sources (for knowledge_search tool)

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

            # Handle knowledge_search tool specially - inject knowledge content
            if tool_id == "knowledge_search" and knowledge_content:
                template_fields = node.get("data", {}).get("node", {}).get("template", {})
                if "knowledge_content" in template_fields:
                    template_fields["knowledge_content"]["value"] = knowledge_content

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

    def inject_llm_config(
        self,
        flow_data: Dict[str, Any],
        llm_provider: str,
        api_key: str,
    ) -> Dict[str, Any]:
        """
        Inject LLM provider configuration into the Agent node.

        Args:
            flow_data: The flow data to modify
            llm_provider: The LLM provider name (openai, anthropic, google)
            api_key: The actual API key to use

        Returns:
            Modified flow_data
        """
        # Normalize provider name
        provider = llm_provider.lower()
        config = LLM_PROVIDER_CONFIGS.get(provider)

        if not config:
            # Default to OpenAI if provider not recognized
            config = LLM_PROVIDER_CONFIGS["openai"]

        # Find and update the Agent node
        nodes = flow_data.get("data", {}).get("nodes", [])

        for node in nodes:
            node_data = node.get("data", {})
            if node_data.get("type") == "Agent":
                template_fields = node_data.get("node", {}).get("template", {})

                # Set the LLM provider
                if "agent_llm" in template_fields:
                    template_fields["agent_llm"]["value"] = config["agent_llm"]

                # Set the model name
                if "model_name" in template_fields:
                    template_fields["model_name"]["value"] = config["model_name"]
                    template_fields["model_name"]["options"] = config["model_options"]

                # Set the API key
                if "api_key" in template_fields and api_key:
                    template_fields["api_key"]["value"] = api_key
                    template_fields["api_key"]["display_name"] = f"{config['agent_llm']} API Key"

                # Set the base URL if applicable
                if "base_url" in template_fields and config.get("base_url"):
                    template_fields["base_url"]["value"] = config["base_url"]

                break

        return flow_data

    def inject_system_prompt(
        self,
        template: Dict[str, Any],
        system_prompt: str,
        agent_display_name: str = None,
    ) -> Tuple[Dict[str, Any], str]:
        """
        Inject the system prompt into the Agent template.

        Args:
            template: Flow template data
            system_prompt: Generated system prompt
            agent_display_name: Custom display name for the Agent node (optional)

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

                # Update display_name if custom name provided
                if agent_display_name:
                    node_data["node"]["display_name"] = agent_display_name

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
        llm_provider: str = "openai",
        api_key: str = None,
        agent_display_name: str = None,
        knowledge_content: str = None,
    ) -> Tuple[Dict[str, Any], str, str]:
        """
        Create a complete flow configuration from Q&A answers.

        Args:
            who: Answer to "Who is Charlie?"
            rules: Answer to "What are his rules?"
            tricks: Answer to "What tricks does he know?" (legacy, kept for compatibility)
            selected_tools: List of tool IDs to add (e.g., ['web_search', 'calculator'])
            template_name: Template to use (default: agent_base)
            llm_provider: LLM provider to use (openai, anthropic, google)
            api_key: The API key for the LLM provider
            agent_display_name: Custom display name for the Agent node in the canvas
            knowledge_content: Combined content from knowledge sources (for RAG)

        Returns:
            Tuple of (flow_data, system_prompt, agent_name)
        """
        selected_tools = selected_tools or []

        # Load template
        template = self.load_template(template_name)

        # Inject system prompt placeholder and get agent node ID
        # Also set the agent's display name if provided
        flow_data, agent_node_id = self.inject_system_prompt(
            template, "", agent_display_name=agent_display_name
        )

        # Inject LLM provider configuration (provider + API key)
        if api_key:
            flow_data = self.inject_llm_config(flow_data, llm_provider, api_key)

        # Inject tools and get tools description
        flow_data, tools_description = self.inject_tools(
            flow_data,
            selected_tools,
            agent_node_id,
            knowledge_content=knowledge_content,
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


    # ========== RAG Support Methods ==========

    def generate_collection_name(self, user_id: str, workflow_id: str) -> str:
        """
        Generate a unique collection name for Chroma vector store.

        Format: tc_{user_id[:8]}_{workflow_id[:8]}
        This ensures isolation between users and workflows.
        """
        user_prefix = str(user_id)[:8].replace("-", "")
        workflow_prefix = str(workflow_id)[:8].replace("-", "")
        return f"tc_{user_prefix}_{workflow_prefix}"

    def load_rag_template(self, template_type: str = "agent") -> Dict[str, Any]:
        """
        Load a RAG-specific template.

        Args:
            template_type: Either "agent" for the RAG agent flow,
                          or "ingest" for the document ingestion flow

        Returns:
            Template data as dictionary
        """
        if template_type == "ingest":
            template_path = self.templates_dir / "rag" / "ingest_documents.json"
        else:
            template_path = self.templates_dir / "rag_agent.json"

        if not template_path.exists():
            raise TemplateMappingError(
                f"RAG template '{template_type}' not found at {template_path}"
            )

        try:
            with open(template_path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise TemplateMappingError(f"Invalid RAG template JSON: {e}")

    def configure_ingestion_flow(
        self,
        flow_data: Dict[str, Any],
        file_paths: List[str],
        collection_name: str,
        openai_api_key: str,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ) -> Dict[str, Any]:
        """
        Configure the ingestion flow with actual values.

        Args:
            flow_data: The ingestion template data
            file_paths: List of file paths to ingest
            collection_name: Chroma collection name
            openai_api_key: OpenAI API key for embeddings
            chunk_size: Text chunk size
            chunk_overlap: Overlap between chunks

        Returns:
            Configured flow data
        """
        flow_data = copy.deepcopy(flow_data)

        # Generate unique IDs for this flow instance
        file_id = self._generate_node_id("File")[-5:]
        split_id = self._generate_node_id("Split")[-5:]
        embed_id = self._generate_node_id("Embed")[-5:]
        chroma_id = self._generate_node_id("Chroma")[-5:]

        # Replace placeholders in the flow
        flow_json = json.dumps(flow_data)
        flow_json = flow_json.replace("{{FILE_ID}}", file_id)
        flow_json = flow_json.replace("{{SPLIT_ID}}", split_id)
        flow_json = flow_json.replace("{{EMBED_ID}}", embed_id)
        flow_json = flow_json.replace("{{CHROMA_ID}}", chroma_id)
        flow_json = flow_json.replace("{{COLLECTION_NAME}}", collection_name)
        flow_json = flow_json.replace("{{OPENAI_API_KEY}}", openai_api_key)

        flow_data = json.loads(flow_json)

        # Update specific node values
        for node in flow_data.get("data", {}).get("nodes", []):
            node_type = node.get("data", {}).get("type", "")
            template = node.get("data", {}).get("node", {}).get("template", {})

            if node_type == "File":
                # Set file paths - use file_path field for server paths
                if "file_path" in template:
                    template["file_path"]["value"] = file_paths[0] if len(file_paths) == 1 else file_paths
                elif "path" in template:
                    template["path"]["value"] = file_paths

            elif node_type == "SplitText":
                if "chunk_size" in template:
                    template["chunk_size"]["value"] = chunk_size
                if "chunk_overlap" in template:
                    template["chunk_overlap"]["value"] = chunk_overlap

        return flow_data

    def configure_rag_agent_flow(
        self,
        flow_data: Dict[str, Any],
        collection_name: str,
        system_prompt: str,
        openai_api_key: str,
        llm_api_key: str,
        llm_provider: str = "openai",
        number_of_results: int = 5,
    ) -> Dict[str, Any]:
        """
        Configure the RAG agent flow with actual values.

        Args:
            flow_data: The RAG agent template data
            collection_name: Chroma collection name to search
            system_prompt: System prompt for the agent
            openai_api_key: OpenAI API key for embeddings
            llm_api_key: API key for the LLM
            llm_provider: LLM provider name
            number_of_results: Number of RAG results to retrieve

        Returns:
            Configured flow data
        """
        flow_data = copy.deepcopy(flow_data)

        # Generate unique IDs for this flow instance
        chat_input_id = self._generate_node_id("ChatInput")[-5:]
        chat_output_id = self._generate_node_id("ChatOutput")[-5:]
        embed_id = self._generate_node_id("Embed")[-5:]
        chroma_id = self._generate_node_id("Chroma")[-5:]
        parser_id = self._generate_node_id("Parser")[-5:]
        prompt_id = self._generate_node_id("Prompt")[-5:]
        agent_id = self._generate_node_id("Agent")[-5:]

        # Replace placeholders in the flow
        flow_json = json.dumps(flow_data)
        flow_json = flow_json.replace("{{CHAT_INPUT_ID}}", chat_input_id)
        flow_json = flow_json.replace("{{CHAT_OUTPUT_ID}}", chat_output_id)
        flow_json = flow_json.replace("{{EMBED_ID}}", embed_id)
        flow_json = flow_json.replace("{{CHROMA_ID}}", chroma_id)
        flow_json = flow_json.replace("{{PARSER_ID}}", parser_id)
        flow_json = flow_json.replace("{{PROMPT_ID}}", prompt_id)
        flow_json = flow_json.replace("{{AGENT_ID}}", agent_id)
        flow_json = flow_json.replace("{{COLLECTION_NAME}}", collection_name)
        flow_json = flow_json.replace("{{OPENAI_API_KEY}}", openai_api_key)
        flow_json = flow_json.replace("{{LLM_API_KEY}}", llm_api_key)
        flow_json = flow_json.replace("{{SYSTEM_PROMPT}}", system_prompt.replace('"', '\\"'))

        flow_data = json.loads(flow_json)

        # Update LLM configuration
        flow_data = self.inject_llm_config(flow_data, llm_provider, llm_api_key)

        # Update number of results
        for node in flow_data.get("data", {}).get("nodes", []):
            node_type = node.get("data", {}).get("type", "")
            template = node.get("data", {}).get("node", {}).get("template", {})

            if node_type == "Chroma":
                if "number_of_results" in template:
                    template["number_of_results"]["value"] = number_of_results

        return flow_data

    def should_use_rag_template(self, knowledge_source_ids: List[str] = None) -> bool:
        """
        Determine if RAG template should be used based on knowledge sources.

        For now, if knowledge sources are provided, we use the RAG template.
        Otherwise, we use the standard agent_base template.

        Args:
            knowledge_source_ids: List of knowledge source IDs

        Returns:
            True if RAG template should be used
        """
        return bool(knowledge_source_ids and len(knowledge_source_ids) > 0)

    def create_rag_flow_from_qa(
        self,
        who: str,
        rules: str,
        collection_name: str,
        openai_api_key: str,
        llm_provider: str = "openai",
        llm_api_key: str = None,
        agent_display_name: str = None,
        selected_tools: List[str] = None,
        number_of_results: int = 5,
    ) -> Tuple[Dict[str, Any], str, str]:
        """
        Create a RAG-enabled flow configuration from Q&A answers.

        This is similar to create_flow_from_qa but uses the RAG agent template
        which includes Chroma vector search.

        Args:
            who: Answer to "Who is Charlie?"
            rules: Answer to "What are his rules?"
            collection_name: Chroma collection name for this agent
            openai_api_key: OpenAI API key for embeddings
            llm_provider: LLM provider to use
            llm_api_key: The API key for the LLM provider
            agent_display_name: Custom display name for the Agent node
            selected_tools: List of additional tool IDs to add
            number_of_results: Number of RAG results to retrieve

        Returns:
            Tuple of (flow_data, system_prompt, agent_name)
        """
        selected_tools = selected_tools or []
        llm_api_key = llm_api_key or openai_api_key

        # Generate system prompt (including tools description if any)
        # For RAG, we modify the system prompt to indicate knowledge base access
        tools_description = ""
        if selected_tools:
            for tool_id in selected_tools:
                tool_template = self.load_tool_template(tool_id)
                if tool_template:
                    display_name = tool_template.get("display_name", tool_id)
                    description = tool_template.get("description", "")
                    tools_description += f"- {display_name}: {description}\n"

        # Add knowledge base to tools description
        rag_tool_description = "- Knowledge Base: Search through your uploaded documents to find relevant information\n"
        tools_description = rag_tool_description + tools_description

        system_prompt = self.generate_system_prompt(who, rules, tools_description.strip())

        # Load and configure RAG template
        template = self.load_rag_template("agent")
        flow_data = self.configure_rag_agent_flow(
            flow_data=template,
            collection_name=collection_name,
            system_prompt=system_prompt,
            openai_api_key=openai_api_key,
            llm_api_key=llm_api_key,
            llm_provider=llm_provider,
            number_of_results=number_of_results,
        )

        # Update agent display name if provided
        if agent_display_name:
            for node in flow_data.get("data", {}).get("nodes", []):
                if node.get("data", {}).get("type") == "Agent":
                    node["data"]["node"]["display_name"] = agent_display_name

        # TODO: Inject additional tools if selected_tools has non-RAG tools
        # For now, RAG template doesn't support additional tools

        # Generate agent name
        agent_name = self.generate_agent_name(who)

        return flow_data, system_prompt, agent_name


# Singleton instance
template_mapper = TemplateMapper()
