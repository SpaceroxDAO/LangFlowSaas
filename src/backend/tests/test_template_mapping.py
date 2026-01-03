"""
Template mapping service tests.
"""
import pytest
from app.services.template_mapping import TemplateMapper, TemplateMappingError


@pytest.fixture
def mapper():
    """Create a template mapper instance."""
    return TemplateMapper()


class TestSystemPromptGeneration:
    """Tests for system prompt generation."""

    def test_generate_basic_system_prompt(self, mapper: TemplateMapper):
        """Test generating a basic system prompt."""
        prompt = mapper.generate_system_prompt(
            who="A friendly bakery assistant",
            rules="Always be polite and know the menu",
            tricks="Answer questions about pastries and take orders",
        )

        assert "A friendly bakery assistant" in prompt
        assert "Always be polite" in prompt
        assert "Answer questions about pastries" in prompt
        assert "Your Rules and Knowledge" in prompt
        assert "Your Capabilities" in prompt

    def test_generate_system_prompt_strips_whitespace(self, mapper: TemplateMapper):
        """Test that system prompt handles whitespace correctly."""
        prompt = mapper.generate_system_prompt(
            who="  A test assistant  ",
            rules="\n\nSome rules\n\n",
            tricks="  Some tricks  ",
        )

        # Should not have leading/trailing whitespace
        assert not prompt.startswith(" ")
        assert not prompt.startswith("\n")


class TestAgentNameGeneration:
    """Tests for agent name generation."""

    def test_generate_name_from_assistant(self, mapper: TemplateMapper):
        """Test name generation from 'assistant' pattern."""
        name = mapper.generate_agent_name("A friendly bakery assistant")
        assert "Charlie" in name

    def test_generate_name_from_support(self, mapper: TemplateMapper):
        """Test name generation from 'support' pattern."""
        name = mapper.generate_agent_name("Customer support agent")
        # Should generate something sensible
        assert len(name) > 0

    def test_generate_name_fallback(self, mapper: TemplateMapper):
        """Test name generation fallback."""
        name = mapper.generate_agent_name("Something unusual")
        assert "Charlie" in name


class TestTemplateLoading:
    """Tests for template loading."""

    def test_load_support_bot_template(self, mapper: TemplateMapper):
        """Test loading the support_bot template."""
        template = mapper.load_template("support_bot")

        assert "name" in template
        assert "data" in template
        assert "nodes" in template["data"]
        assert "edges" in template["data"]

    def test_load_nonexistent_template_raises(self, mapper: TemplateMapper):
        """Test that loading a non-existent template raises an error."""
        with pytest.raises(TemplateMappingError):
            mapper.load_template("nonexistent_template")


class TestFlowCreation:
    """Tests for complete flow creation."""

    def test_create_flow_from_qa(self, mapper: TemplateMapper):
        """Test creating a complete flow from Q&A."""
        flow_data, system_prompt, agent_name = mapper.create_flow_from_qa(
            who="A helpful sales assistant for a shoe store",
            rules="Know all shoe sizes, be patient with customers",
            tricks="Recommend shoes, process returns, check inventory",
        )

        # Check flow data structure
        assert "data" in flow_data
        assert "nodes" in flow_data["data"]
        assert "edges" in flow_data["data"]

        # Check system prompt was generated
        assert "A helpful sales assistant" in system_prompt
        assert "shoe sizes" in system_prompt.lower()

        # Check agent name was generated
        assert len(agent_name) > 0
