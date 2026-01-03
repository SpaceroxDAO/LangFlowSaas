"""
Template mapping service for converting Q&A answers to Langflow flows.

This is the core logic that transforms user-friendly questions
into a working AI agent configuration.
"""
import json
import re
from pathlib import Path
from typing import Any, Dict, Tuple

from app.config import settings


class TemplateMappingError(Exception):
    """Exception raised when template mapping fails."""

    pass


class TemplateMapper:
    """
    Maps user Q&A answers to Langflow flow configurations.

    The 3-step Q&A approach:
    1. Who is Charlie? (agent identity/role)
    2. What are his rules? (constraints/knowledge)
    3. What tricks does he know? (capabilities)

    These are combined into a system prompt and injected into a flow template.
    """

    def __init__(self, templates_dir: str = None):
        if templates_dir:
            self.templates_dir = Path(templates_dir)
        else:
            # Default to templates directory relative to this file
            self.templates_dir = Path(__file__).parent.parent.parent / "templates"

    def generate_system_prompt(
        self,
        who: str,
        rules: str,
        tricks: str,
    ) -> str:
        """
        Generate a system prompt from Q&A answers.

        Args:
            who: Answer to "Who is Charlie? What kind of job does he have?"
            rules: Answer to "What are the rules to his job?"
            tricks: Answer to "What tricks does Charlie know?"

        Returns:
            A well-structured system prompt
        """
        # Clean up inputs
        who = who.strip()
        rules = rules.strip()
        tricks = tricks.strip()

        # Generate the system prompt
        system_prompt = f"""You are {who}.

## Your Rules and Knowledge
{rules}

## Your Capabilities
{tricks}

## Important Guidelines
- Always stay in character as described above
- Be helpful, friendly, and professional
- If you don't know something, admit it honestly
- Keep responses concise but informative
- Ask clarifying questions when needed
"""
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

    def load_template(self, template_name: str = "support_bot") -> Dict[str, Any]:
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

    def inject_system_prompt(
        self,
        template: Dict[str, Any],
        system_prompt: str,
    ) -> Dict[str, Any]:
        """
        Inject the system prompt into the template.

        This finds the Prompt component in the flow and sets its template value.

        Args:
            template: Flow template data
            system_prompt: Generated system prompt

        Returns:
            Modified template with injected system prompt
        """
        # Deep copy to avoid modifying the original
        import copy

        flow_data = copy.deepcopy(template)

        # Find and update the Prompt node
        nodes = flow_data.get("data", {}).get("nodes", [])

        for node in nodes:
            node_data = node.get("data", {})
            node_type = node_data.get("type", "")

            # Look for Prompt component
            if node_type == "Prompt":
                template_field = (
                    node_data.get("node", {})
                    .get("template", {})
                    .get("template", {})
                )
                if template_field:
                    template_field["value"] = system_prompt
                    break

        return flow_data

    def create_flow_from_qa(
        self,
        who: str,
        rules: str,
        tricks: str,
        template_name: str = "support_bot",
    ) -> Tuple[Dict[str, Any], str, str]:
        """
        Create a complete flow configuration from Q&A answers.

        Args:
            who: Answer to "Who is Charlie?"
            rules: Answer to "What are his rules?"
            tricks: Answer to "What tricks does he know?"
            template_name: Template to use

        Returns:
            Tuple of (flow_data, system_prompt, agent_name)
        """
        # Generate system prompt
        system_prompt = self.generate_system_prompt(who, rules, tricks)

        # Generate agent name
        agent_name = self.generate_agent_name(who)

        # Load template
        template = self.load_template(template_name)

        # Inject system prompt
        flow_data = self.inject_system_prompt(template, system_prompt)

        return flow_data, system_prompt, agent_name


# Singleton instance
template_mapper = TemplateMapper()
