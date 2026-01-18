#!/usr/bin/env python3
"""
Langflow Template Upgrader

Upgrades old Langflow templates (lf_version 1.2.0) to be compatible with Langflow 1.7.2
by adding the missing 'code' field to each component.

The 'code' field contains the Python source code for each component type.

Usage:
    python upgrade_template.py <template.json>
    python upgrade_template.py --all  # Upgrade all JSON files
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Optional, Dict


# Component type to module path mapping
COMPONENT_PATHS = {
    # Input/Output components
    "ChatInput": "/app/.venv/lib/python3.12/site-packages/lfx/components/input_output/chat.py",
    "ChatOutput": "/app/.venv/lib/python3.12/site-packages/lfx/components/input_output/chat_output.py",
    # Models and Agents
    "Agent": "/app/.venv/lib/python3.12/site-packages/lfx/components/models_and_agents/agent.py",
    # Data sources
    "URLComponent": "/app/.venv/lib/python3.12/site-packages/lfx/components/data_source/url.py",
    "URL": "/app/.venv/lib/python3.12/site-packages/lfx/components/data_source/url.py",
    # Tools
    "CalculatorComponent": "/app/.venv/lib/python3.12/site-packages/lfx/components/utilities/calculator_core.py",
    "Calculator": "/app/.venv/lib/python3.12/site-packages/lfx/components/utilities/calculator_core.py",
    "CalculatorToolComponent": "/app/.venv/lib/python3.12/site-packages/lfx/components/tools/calculator.py",
    "SearchAPIComponent": "/app/.venv/lib/python3.12/site-packages/lfx/components/tools/search_api.py",
    "SearchAPI": "/app/.venv/lib/python3.12/site-packages/lfx/components/tools/search_api.py",
    "SearchComponent": "/app/.venv/lib/python3.12/site-packages/lfx/components/searchapi/search.py",
}

# Alternative paths for some components (tried if primary path fails)
COMPONENT_PATHS_ALT = {
    "CalculatorComponent": "/app/.venv/lib/python3.12/site-packages/lfx/components/tools/calculator.py",
    "Calculator": "/app/.venv/lib/python3.12/site-packages/lfx/components/tools/calculator.py",
}

# Container name for Docker
CONTAINER_NAME = "teachcharlie-langflow"


def get_component_code(component_type: str) -> Optional[str]:
    """
    Fetch the Python source code for a component type from the Langflow container.
    """
    path = COMPONENT_PATHS.get(component_type)
    if not path:
        # Try alternative paths
        path = COMPONENT_PATHS_ALT.get(component_type)

    if not path:
        print(f"  Warning: No path mapping for component type: {component_type}")
        return None

    try:
        result = subprocess.run(
            ["docker", "exec", CONTAINER_NAME, "cat", path],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            return result.stdout
        else:
            # Try alternative path
            alt_path = COMPONENT_PATHS_ALT.get(component_type)
            if alt_path and alt_path != path:
                result = subprocess.run(
                    ["docker", "exec", CONTAINER_NAME, "cat", alt_path],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if result.returncode == 0:
                    return result.stdout
            print(f"  Warning: Could not fetch code for {component_type}: {result.stderr}")
            return None
    except subprocess.TimeoutExpired:
        print(f"  Warning: Timeout fetching code for {component_type}")
        return None
    except Exception as e:
        print(f"  Warning: Error fetching code for {component_type}: {e}")
        return None


def create_code_field(code_content: str) -> dict:
    """Create the code field structure expected by Langflow 1.7.2."""
    return {
        "advanced": True,
        "dynamic": True,
        "fileTypes": [],
        "file_path": "",
        "info": "",
        "list": False,
        "load_from_db": False,
        "multiline": True,
        "name": "code",
        "password": False,
        "placeholder": "",
        "required": True,
        "show": True,
        "title_case": False,
        "type": "code",
        "value": code_content
    }


def upgrade_template(template_path: str, code_cache: Optional[Dict] = None) -> dict:
    """
    Upgrade a template by adding missing code fields.

    Returns a summary of changes made.
    """
    if code_cache is None:
        code_cache = {}

    with open(template_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Find nodes in either format
    if 'data' in data and 'nodes' in data['data']:
        nodes = data['data']['nodes']
    elif 'nodes' in data:
        nodes = data['nodes']
    else:
        return {"file": template_path, "nodes_upgraded": 0, "errors": ["No nodes found"]}

    nodes_upgraded = 0
    errors = []

    for node in nodes:
        node_data = node.get('data', {})
        node_info = node_data.get('node', {})
        template = node_info.get('template', {})

        # Get the component type
        component_type = node_data.get('type', '')
        if not component_type:
            continue

        # Check if code field already exists and has a value
        if 'code' in template and template['code'].get('value'):
            continue

        # Fetch or use cached code
        if component_type not in code_cache:
            print(f"  Fetching code for: {component_type}")
            code_content = get_component_code(component_type)
            code_cache[component_type] = code_content
        else:
            code_content = code_cache[component_type]

        if code_content:
            template['code'] = create_code_field(code_content)
            nodes_upgraded += 1
            print(f"  Added code to: {component_type}")
        else:
            errors.append(f"Could not get code for {component_type}")

    # Save updated template
    if nodes_upgraded > 0:
        with open(template_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    return {
        "file": template_path,
        "nodes_upgraded": nodes_upgraded,
        "errors": errors
    }


def check_docker_container() -> bool:
    """Check if the Langflow Docker container is running."""
    try:
        result = subprocess.run(
            ["docker", "ps", "--filter", f"name={CONTAINER_NAME}", "--format", "{{.Names}}"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return CONTAINER_NAME in result.stdout
    except Exception:
        return False


def main():
    if len(sys.argv) < 2:
        print("Langflow Template Upgrader")
        print("=" * 40)
        print()
        print("This script adds missing 'code' fields to old templates")
        print("by fetching component source code from the running Langflow container.")
        print()
        print("Usage:")
        print("  python upgrade_template.py <template.json>  # Upgrade single file")
        print("  python upgrade_template.py --all            # Upgrade all JSON files")
        print()
        print("Requirements:")
        print(f"  - Docker container '{CONTAINER_NAME}' must be running")
        sys.exit(1)

    # Check Docker container
    if not check_docker_container():
        print(f"Error: Docker container '{CONTAINER_NAME}' is not running.")
        print("Please start the container with: docker-compose up -d")
        sys.exit(1)

    # Cache for component code to avoid fetching same code multiple times
    code_cache = {}

    if sys.argv[1] == '--all':
        # Upgrade all JSON files in current directory
        json_files = [f for f in Path('.').glob('*.json') if not f.name.startswith('.')]
        print(f"Found {len(json_files)} JSON files\n")

        total_upgraded = 0
        files_changed = 0

        for json_file in sorted(json_files):
            print(f"Processing: {json_file.name}")
            result = upgrade_template(str(json_file), code_cache)
            if result["nodes_upgraded"] > 0:
                files_changed += 1
                total_upgraded += result["nodes_upgraded"]
                print(f"  Upgraded {result['nodes_upgraded']} nodes")
            if result["errors"]:
                for err in result["errors"]:
                    print(f"  Error: {err}")
            print()

        print("=" * 40)
        print(f"Total: {files_changed} files changed, {total_upgraded} nodes upgraded")

    else:
        # Upgrade single file
        template_path = sys.argv[1]
        if not Path(template_path).exists():
            print(f"Error: File not found: {template_path}")
            sys.exit(1)

        print(f"Upgrading: {template_path}")
        result = upgrade_template(template_path, code_cache)
        print()
        print("=" * 40)
        print(f"Nodes upgraded: {result['nodes_upgraded']}")
        if result["errors"]:
            print("Errors:")
            for err in result["errors"]:
                print(f"  - {err}")


if __name__ == "__main__":
    main()
