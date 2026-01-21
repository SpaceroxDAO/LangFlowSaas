# Custom Langflow image with Composio support
# This extends the official Langflow image to add Composio SDK
FROM langflowai/langflow:latest

# Install Composio packages for the custom component
RUN pip install --no-cache-dir \
    composio \
    composio-langchain
