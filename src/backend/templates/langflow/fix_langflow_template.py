#!/usr/bin/env python3
"""
Langflow Template Compatibility Fixer

Fixes four common issues when importing templates into Langflow 1.7.2:
1. Edge ID prefix (xy-edge__ -> reactflow__edge-)
2. Handle string spaces (removes spaces after : and ,)
3. Agent model field (model -> agent_llm)
4. API key load_from_db (ensures user's stored API keys are used)

Usage:
    python fix_langflow_template.py <template.json>
    python fix_langflow_template.py --all  # Fix all JSON files in current directory
    python fix_langflow_template.py --analyze-all  # Analyze without fixing
"""

import json
import sys
import os
from pathlib import Path


# Correct agent_llm field structure for Langflow 1.7.2
AGENT_LLM_FIELD = {
    "info": "The provider of the language model that the agent will use to generate responses.",
    "name": "agent_llm",
    "show": True,
    "type": "str",
    "value": "OpenAI",
    "toggle": False,
    "dynamic": False,
    "options": [
        "Anthropic",
        "Google Generative AI",
        "OpenAI",
        "IBM watsonx.ai",
        "Ollama"
    ],
    "advanced": False,
    "combobox": False,
    "required": False,
    "tool_mode": False,
    "title_case": False,
    "_input_type": "DropdownInput",
    "input_types": [],
    "placeholder": "",
    "display_name": "Model Provider",
    "dialog_inputs": {},
    "override_skip": False,
    "refresh_button": False,
    "external_options": {
        "fields": {
            "data": {
                "node": {
                    "icon": "CornerDownLeft",
                    "name": "connect_other_models",
                    "display_name": "Connect other models"
                }
            }
        }
    },
    "options_metadata": [
        {"icon": "Anthropic"},
        {"icon": "GoogleGenerativeAI"},
        {"icon": "OpenAI"},
        {"icon": "WatsonxAI"},
        {"icon": "Ollama"}
    ],
    "real_time_refresh": True,
    "trace_as_metadata": True,
    "track_in_telemetry": True
}


def fix_edges(data: dict) -> dict:
    """Fix edge ID prefix and handle string spaces."""
    # Find edges in either format
    if 'data' in data and 'edges' in data['data']:
        edges = data['data']['edges']
    elif 'edges' in data:
        edges = data['edges']
    else:
        return {"edges_fixed": 0, "handles_fixed": 0}

    edges_fixed = 0
    handles_fixed = 0

    for edge in edges:
        # Fix 1: Change edge ID prefix
        if edge.get('id', '').startswith('xy-edge__'):
            edge['id'] = edge['id'].replace('xy-edge__', 'reactflow__edge-', 1)
            edges_fixed += 1

        # Fix 2: Remove spaces in sourceHandle
        if 'sourceHandle' in edge and isinstance(edge['sourceHandle'], str):
            original = edge['sourceHandle']
            edge['sourceHandle'] = original.replace(', ', ',').replace(': ', ':')
            if edge['sourceHandle'] != original:
                handles_fixed += 1

        # Fix 3: Remove spaces in targetHandle
        if 'targetHandle' in edge and isinstance(edge['targetHandle'], str):
            original = edge['targetHandle']
            edge['targetHandle'] = original.replace(', ', ',').replace(': ', ':')
            if edge['targetHandle'] != original:
                handles_fixed += 1

    return {"edges_fixed": edges_fixed, "handles_fixed": handles_fixed}


def fix_agent_model_field(data: dict) -> int:
    """Replace 'model' field with 'agent_llm' in Agent components."""
    # Find nodes in either format
    if 'data' in data and 'nodes' in data['data']:
        nodes = data['data']['nodes']
    elif 'nodes' in data:
        nodes = data['nodes']
    else:
        return 0

    agents_fixed = 0

    for node in nodes:
        # Check if this is an Agent component
        node_type = node.get('data', {}).get('type', '')
        if node_type != 'Agent':
            continue

        template = node.get('data', {}).get('node', {}).get('template', {})
        if not template:
            continue

        # Check if it has the wrong 'model' field
        if 'model' in template:
            model_field = template['model']
            # Verify it's the problematic format
            if model_field.get('type') == 'model' or model_field.get('_input_type') == 'ModelInput':
                # Remove the old model field
                del template['model']
                # Add the correct agent_llm field
                template['agent_llm'] = AGENT_LLM_FIELD.copy()
                agents_fixed += 1

                # Also update field_order if it exists
                field_order = node.get('data', {}).get('node', {}).get('field_order', [])
                if 'model' in field_order:
                    idx = field_order.index('model')
                    field_order[idx] = 'agent_llm'

    return agents_fixed


def fix_api_key_load_from_db(data: dict) -> int:
    """Set load_from_db=True for all API key fields so user's stored keys are used."""
    # Find nodes in either format
    if 'data' in data and 'nodes' in data['data']:
        nodes = data['data']['nodes']
    elif 'nodes' in data:
        nodes = data['nodes']
    else:
        return 0

    api_keys_fixed = 0

    for node in nodes:
        template = node.get('data', {}).get('node', {}).get('template', {})

        for field_name, field_data in template.items():
            if isinstance(field_data, dict):
                # Check if this is an API key field
                is_api_key = (
                    'api_key' in field_name.lower() or
                    field_name == 'api_key' or
                    field_name.endswith('_api_key')
                )

                if is_api_key:
                    # Check if load_from_db is False or missing
                    if not field_data.get('load_from_db', False):
                        field_data['load_from_db'] = True
                        api_keys_fixed += 1

    return api_keys_fixed


def fix_template(template_path: str, dry_run: bool = False) -> dict:
    """
    Fix all compatibility issues in a template file.

    Returns a summary of fixes made.
    """
    with open(template_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Apply all fixes
    edge_results = fix_edges(data)
    agents_fixed = fix_agent_model_field(data)
    api_keys_fixed = fix_api_key_load_from_db(data)

    summary = {
        "file": template_path,
        "edges_fixed": edge_results["edges_fixed"],
        "handles_fixed": edge_results["handles_fixed"],
        "agents_fixed": agents_fixed,
        "api_keys_fixed": api_keys_fixed,
        "total_changes": edge_results["edges_fixed"] + edge_results["handles_fixed"] + agents_fixed + api_keys_fixed
    }

    # Save if changes were made and not dry run
    if summary["total_changes"] > 0 and not dry_run:
        with open(template_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    return summary


def analyze_template(template_path: str) -> dict:
    """
    Analyze a template file for compatibility issues without fixing.

    Returns a report of issues found.
    """
    with open(template_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    issues = []

    # Check edges
    if 'data' in data and 'edges' in data['data']:
        edges = data['data']['edges']
    elif 'edges' in data:
        edges = data['edges']
    else:
        edges = []

    edge_prefix_issues = 0
    handle_space_issues = 0

    for edge in edges:
        if edge.get('id', '').startswith('xy-edge__'):
            edge_prefix_issues += 1
        if 'sourceHandle' in edge and (': ' in str(edge['sourceHandle']) or ', ' in str(edge['sourceHandle'])):
            handle_space_issues += 1
        if 'targetHandle' in edge and (': ' in str(edge['targetHandle']) or ', ' in str(edge['targetHandle'])):
            handle_space_issues += 1

    if edge_prefix_issues > 0:
        issues.append(f"{edge_prefix_issues} edges have wrong prefix (xy-edge__)")
    if handle_space_issues > 0:
        issues.append(f"{handle_space_issues} handles have spaces")

    # Check agent nodes
    if 'data' in data and 'nodes' in data['data']:
        nodes = data['data']['nodes']
    elif 'nodes' in data:
        nodes = data['nodes']
    else:
        nodes = []

    agent_model_issues = 0
    for node in nodes:
        node_type = node.get('data', {}).get('type', '')
        if node_type == 'Agent':
            template = node.get('data', {}).get('node', {}).get('template', {})
            if 'model' in template:
                model_field = template['model']
                if model_field.get('type') == 'model' or model_field.get('_input_type') == 'ModelInput':
                    agent_model_issues += 1

    if agent_model_issues > 0:
        issues.append(f"{agent_model_issues} Agent(s) have wrong model field format")

    # Check API key fields for load_from_db
    api_key_issues = 0
    for node in nodes:
        template = node.get('data', {}).get('node', {}).get('template', {})
        for field_name, field_data in template.items():
            if isinstance(field_data, dict):
                is_api_key = (
                    'api_key' in field_name.lower() or
                    field_name == 'api_key' or
                    field_name.endswith('_api_key')
                )
                if is_api_key and not field_data.get('load_from_db', False):
                    api_key_issues += 1

    if api_key_issues > 0:
        issues.append(f"{api_key_issues} API key field(s) missing load_from_db")

    return {
        "file": template_path,
        "issues": issues,
        "issue_count": len(issues),
        "edge_prefix_issues": edge_prefix_issues,
        "handle_space_issues": handle_space_issues,
        "agent_model_issues": agent_model_issues,
        "api_key_issues": api_key_issues,
        "needs_fixing": len(issues) > 0
    }


def main():
    if len(sys.argv) < 2:
        print("Langflow Template Compatibility Fixer")
        print("=" * 40)
        print()
        print("Usage:")
        print("  python fix_langflow_template.py <template.json>       # Fix single file")
        print("  python fix_langflow_template.py --all                 # Fix all JSON files")
        print("  python fix_langflow_template.py --analyze <file>      # Analyze without fixing")
        print("  python fix_langflow_template.py --analyze-all         # Analyze all JSON files")
        print()
        print("Issues fixed:")
        print("  1. Edge ID prefix (xy-edge__ -> reactflow__edge-)")
        print("  2. Handle string spaces (removes spaces after : and ,)")
        print("  3. Agent model field (model -> agent_llm)")
        print("  4. API key load_from_db (ensures user's stored API keys are used)")
        sys.exit(1)

    if sys.argv[1] == '--all':
        # Fix all JSON files in current directory
        json_files = [f for f in Path('.').glob('*.json') if not f.name.startswith('.')]
        print(f"Found {len(json_files)} JSON files\n")

        total_changes = 0
        files_fixed = 0
        for json_file in sorted(json_files):
            result = fix_template(str(json_file))
            if result["total_changes"] > 0:
                files_fixed += 1
                print(f"FIXED: {json_file.name}")
                print(f"       Edges: {result['edges_fixed']}, Handles: {result['handles_fixed']}, Agents: {result['agents_fixed']}, API Keys: {result['api_keys_fixed']}")
                total_changes += result["total_changes"]
            else:
                print(f"OK:    {json_file.name}")

        print()
        print("=" * 40)
        print(f"Total: {files_fixed}/{len(json_files)} files fixed, {total_changes} total changes")

    elif sys.argv[1] == '--analyze-all':
        # Analyze all JSON files
        json_files = [f for f in Path('.').glob('*.json') if not f.name.startswith('.')]
        print(f"Analyzing {len(json_files)} JSON files\n")

        files_with_issues = []
        files_ok = []

        for json_file in sorted(json_files):
            result = analyze_template(str(json_file))
            if result["needs_fixing"]:
                files_with_issues.append(result)
            else:
                files_ok.append(json_file.name)

        # Print files with issues
        if files_with_issues:
            print("FILES NEEDING FIXES:")
            print("-" * 40)
            for result in files_with_issues:
                print(f"\n{Path(result['file']).name}:")
                for issue in result["issues"]:
                    print(f"  - {issue}")

        # Print OK files
        if files_ok:
            print("\n\nFILES OK:")
            print("-" * 40)
            for name in files_ok:
                print(f"  {name}")

        print()
        print("=" * 40)
        print(f"Summary: {len(files_with_issues)} need fixing, {len(files_ok)} are OK")

    elif sys.argv[1] == '--analyze':
        if len(sys.argv) < 3:
            print("Usage: python fix_langflow_template.py --analyze <file>")
            sys.exit(1)
        result = analyze_template(sys.argv[2])
        print(f"Analysis of {Path(result['file']).name}:")
        print("-" * 40)
        if result["needs_fixing"]:
            print(f"Status: NEEDS FIXING")
            print(f"Issues found: {result['issue_count']}")
            for issue in result["issues"]:
                print(f"  - {issue}")
        else:
            print("Status: OK (no issues found)")

    else:
        # Fix single file
        if not os.path.exists(sys.argv[1]):
            print(f"Error: File not found: {sys.argv[1]}")
            sys.exit(1)

        result = fix_template(sys.argv[1])
        print(f"Fixed {Path(result['file']).name}:")
        print("-" * 40)
        print(f"  Edges fixed:    {result['edges_fixed']}")
        print(f"  Handles fixed:  {result['handles_fixed']}")
        print(f"  Agents fixed:   {result['agents_fixed']}")
        print(f"  API Keys fixed: {result['api_keys_fixed']}")
        print(f"  Total changes:  {result['total_changes']}")


if __name__ == "__main__":
    main()
