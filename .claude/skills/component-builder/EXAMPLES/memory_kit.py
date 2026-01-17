"""
Memory Kit - Course Component for Teach Charlie AI

A simplified conversation memory component that wraps LangChain's
ConversationBufferWindowMemory with sensible defaults.

Usage in Mission L016 (Memory Basics):
- User drags Memory Kit onto canvas
- Connects output to Agent's memory input
- Agent now remembers conversation context

File Location: src/backend/langflow_components/memory_kit.py
"""

from langflow.custom import Component
from langflow.io import BoolInput, IntInput, Output, DropdownInput
from langchain.memory import ConversationBufferWindowMemory


class MemoryKit(Component):
    """
    Memory Kit - Give your agent the ability to remember conversations.

    This is a "course component" - a simplified wrapper around complex
    functionality designed for learners. It hides technical details
    while providing sensible defaults.
    """

    # Display configuration
    display_name = "Memory Kit"
    description = "Give your agent the ability to remember conversations. Connect to an Agent to enable context awareness."
    icon = "brain"
    name = "MemoryKit"

    # Inputs - minimal required, advanced hidden
    inputs = [
        DropdownInput(
            name="memory_style",
            display_name="Memory Style",
            info="How much should your agent remember?",
            options=[
                "Short-term (5 messages)",
                "Standard (10 messages)",
                "Long-term (20 messages)",
            ],
            value="Standard (10 messages)",
        ),
        BoolInput(
            name="include_system",
            display_name="Remember Instructions",
            info="Should memory include the agent's job description?",
            value=False,
            advanced=True,
        ),
        IntInput(
            name="custom_length",
            display_name="Custom Length",
            info="Override with specific number of messages to remember",
            value=0,
            advanced=True,
        ),
    ]

    # Single output - connects to Agent's memory input
    outputs = [
        Output(
            display_name="Memory",
            name="memory",
            method="build_memory",
        ),
    ]

    def _get_memory_length(self) -> int:
        """Convert friendly memory style to message count."""
        # If custom length set, use it
        if self.custom_length and self.custom_length > 0:
            return self.custom_length

        # Otherwise, map friendly names to values
        style_map = {
            "Short-term (5 messages)": 5,
            "Standard (10 messages)": 10,
            "Long-term (20 messages)": 20,
        }
        return style_map.get(self.memory_style, 10)

    def build_memory(self) -> ConversationBufferWindowMemory:
        """
        Build and return the memory component.

        This method is called when the flow is executed. It creates
        a ConversationBufferWindowMemory with the configured settings.
        """
        k = self._get_memory_length()

        memory = ConversationBufferWindowMemory(
            k=k,
            return_messages=True,  # Always return Message objects
            memory_key="chat_history",
            input_key="input",
            output_key="output",
        )

        # Log for debugging (visible in Langflow logs)
        self.log(f"Memory Kit initialized with {k} message capacity")

        return memory


# For testing outside Langflow
if __name__ == "__main__":
    # Quick test
    component = MemoryKit()
    component.memory_style = "Standard (10 messages)"

    memory = component.build_memory()
    print(f"Memory created with k={memory.k}")

    # Test adding messages
    memory.save_context(
        {"input": "Hello, I'm Adam"},
        {"output": "Hello Adam! Nice to meet you."}
    )
    memory.save_context(
        {"input": "What's my name?"},
        {"output": "Your name is Adam!"}
    )

    print("Chat history:", memory.load_memory_variables({})["chat_history"])
