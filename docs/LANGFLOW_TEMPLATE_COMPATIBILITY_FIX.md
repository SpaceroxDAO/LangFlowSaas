# Langflow Template Compatibility Fix Guide

> **Last Updated**: 2026-01-17
> **Langflow Version**: 1.7.2
> **Purpose**: Comprehensive guide for fixing template compatibility issues

---

## Overview

When importing flow templates from external sources or different Langflow versions, four common compatibility issues can occur:

1. **Edge Rendering** - Edges don't display on canvas
2. **Handle String Format** - Spaces in JSON-like handle strings
3. **Agent Model Field** - Wrong field name/type for LLM configuration
4. **API Key Configuration** - Keys not loaded from user's stored credentials

---

## Issue 1: Edge ID Prefix

**Symptom**: Edges exist in data but don't render visually on canvas.

**Root Cause**: Different Langflow versions use different edge ID prefixes.

| Langflow Version | Edge ID Prefix |
|------------------|----------------|
| 1.7.2 (current)  | `reactflow__edge-` |
| Older versions   | `xy-edge__` |

**Fix**: Replace `xy-edge__` with `reactflow__edge-` in all edge IDs.

---

## Issue 2: Spaces in Handle Strings

**Symptom**: Edges exist with correct prefix but still don't render.

**Root Cause**: React Flow validates edges by matching `sourceHandle` and `targetHandle` strings **exactly**. Spaces after colons/commas cause mismatches.

Langflow uses Unicode character `œ` (\u0153) instead of quotes in handle strings:

| Working Format | Broken Format |
|----------------|---------------|
| `{œdataTypeœ:œAgentœ,œidœ:œAgent-abc123œ}` | `{œdataTypeœ: œAgentœ, œidœ: œAgent-abc123œ}` |

**Fix**: Remove all spaces after `:` and `,` in sourceHandle and targetHandle strings.

---

## Issue 3: Agent Model Field (CRITICAL)

**Symptom**: Flow runs but fails with error: `"Field model in Agent is not a valid field type: model"`

**Root Cause**: Different Langflow versions use different field names for the LLM configuration in Agent components.

| Field | Newer Templates | Langflow 1.7.2 |
|-------|-----------------|----------------|
| Name | `model` | `agent_llm` |
| Type | `"type": "model"` | `"type": "str"` |
| Input Type | `"_input_type": "ModelInput"` | `"_input_type": "DropdownInput"` |

**Fix**: Replace the `model` field with the correct `agent_llm` field structure.

### Correct `agent_llm` Field Structure for Langflow 1.7.2

```json
{
  "agent_llm": {
    "info": "The provider of the language model that the agent will use to generate responses.",
    "name": "agent_llm",
    "show": true,
    "type": "str",
    "value": "OpenAI",
    "toggle": false,
    "dynamic": false,
    "options": [
      "Anthropic",
      "Google Generative AI",
      "OpenAI",
      "IBM watsonx.ai",
      "Ollama"
    ],
    "advanced": false,
    "combobox": false,
    "required": false,
    "tool_mode": false,
    "title_case": false,
    "_input_type": "DropdownInput",
    "input_types": [],
    "placeholder": "",
    "display_name": "Model Provider",
    "dialog_inputs": {},
    "override_skip": false,
    "refresh_button": false,
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
    "real_time_refresh": true,
    "trace_as_metadata": true,
    "track_in_telemetry": true
  }
}
```

---

## Issue 4: API Key load_from_db

**Symptom**: Flow runs but prompts user for API key even though they configured it in Teach Charlie.

**Root Cause**: API key fields in templates have `load_from_db: false`, which means they don't load from Langflow's stored credentials.

**Fix**: Set `load_from_db: true` for all API key fields.

```json
{
  "api_key": {
    "load_from_db": true,
    "value": "",
    ...
  }
}
```

This applies to any field with "api_key" in its name, including:
- `api_key` (Agent, LanguageModelComponent)
- `openai_api_key` (OpenAIEmbeddings)
- `needle_api_key` (Needle)
- etc.

---

## Complete Fix Script

Save this as `fix_langflow_template.py` in the templates directory:

```python
#!/usr/bin/env python3
"""
Langflow Template Compatibility Fixer

Fixes three common issues when importing templates into Langflow 1.7.2:
1. Edge ID prefix (xy-edge__ -> reactflow__edge-)
2. Handle string spaces (removes spaces after : and ,)
3. Agent model field (model -> agent_llm)

Usage:
    python fix_langflow_template.py <template.json>
    python fix_langflow_template.py --all  # Fix all JSON files in current directory
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

    summary = {
        "file": template_path,
        "edges_fixed": edge_results["edges_fixed"],
        "handles_fixed": edge_results["handles_fixed"],
        "agents_fixed": agents_fixed,
        "total_changes": edge_results["edges_fixed"] + edge_results["handles_fixed"] + agents_fixed
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

    for edge in edges:
        if edge.get('id', '').startswith('xy-edge__'):
            issues.append(f"Edge {edge['id'][:50]}... has wrong prefix")
        if 'sourceHandle' in edge and (': ' in str(edge['sourceHandle']) or ', ' in str(edge['sourceHandle'])):
            issues.append(f"Edge has spaces in sourceHandle")
        if 'targetHandle' in edge and (': ' in str(edge['targetHandle']) or ', ' in str(edge['targetHandle'])):
            issues.append(f"Edge has spaces in targetHandle")

    # Check agent nodes
    if 'data' in data and 'nodes' in data['data']:
        nodes = data['data']['nodes']
    elif 'nodes' in data:
        nodes = data['nodes']
    else:
        nodes = []

    for node in nodes:
        node_type = node.get('data', {}).get('type', '')
        if node_type == 'Agent':
            template = node.get('data', {}).get('node', {}).get('template', {})
            if 'model' in template:
                model_field = template['model']
                if model_field.get('type') == 'model' or model_field.get('_input_type') == 'ModelInput':
                    issues.append(f"Agent {node.get('id', 'unknown')} has wrong model field format")

    return {
        "file": template_path,
        "issues": issues,
        "issue_count": len(issues),
        "needs_fixing": len(issues) > 0
    }


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python fix_langflow_template.py <template.json>       # Fix single file")
        print("  python fix_langflow_template.py --all                 # Fix all JSON files")
        print("  python fix_langflow_template.py --analyze <file>      # Analyze without fixing")
        print("  python fix_langflow_template.py --analyze-all         # Analyze all JSON files")
        sys.exit(1)

    if sys.argv[1] == '--all':
        # Fix all JSON files in current directory
        json_files = list(Path('.').glob('*.json'))
        print(f"Found {len(json_files)} JSON files\n")

        total_changes = 0
        for json_file in json_files:
            result = fix_template(str(json_file))
            if result["total_changes"] > 0:
                print(f"Fixed {json_file.name}:")
                print(f"  - Edges: {result['edges_fixed']}")
                print(f"  - Handles: {result['handles_fixed']}")
                print(f"  - Agents: {result['agents_fixed']}")
                total_changes += result["total_changes"]
            else:
                print(f"No issues in {json_file.name}")

        print(f"\nTotal changes: {total_changes}")

    elif sys.argv[1] == '--analyze-all':
        # Analyze all JSON files
        json_files = list(Path('.').glob('*.json'))
        print(f"Analyzing {len(json_files)} JSON files\n")

        files_with_issues = 0
        for json_file in json_files:
            result = analyze_template(str(json_file))
            if result["needs_fixing"]:
                files_with_issues += 1
                print(f"\n{json_file.name} - {result['issue_count']} issues:")
                for issue in result["issues"][:5]:  # Show first 5 issues
                    print(f"  - {issue}")
                if result["issue_count"] > 5:
                    print(f"  ... and {result['issue_count'] - 5} more")

        print(f"\n{files_with_issues}/{len(json_files)} files need fixing")

    elif sys.argv[1] == '--analyze':
        if len(sys.argv) < 3:
            print("Usage: python fix_langflow_template.py --analyze <file>")
            sys.exit(1)
        result = analyze_template(sys.argv[2])
        print(f"Analysis of {result['file']}:")
        print(f"Issues found: {result['issue_count']}")
        for issue in result["issues"]:
            print(f"  - {issue}")

    else:
        # Fix single file
        result = fix_template(sys.argv[1])
        print(f"Fixed {result['file']}:")
        print(f"  - Edges fixed: {result['edges_fixed']}")
        print(f"  - Handles fixed: {result['handles_fixed']}")
        print(f"  - Agents fixed: {result['agents_fixed']}")
        print(f"  - Total changes: {result['total_changes']}")


if __name__ == "__main__":
    main()
```

---

## Step-by-Step Plan for Fixing All Templates

### Phase 1: Inventory & Analysis

```bash
# Navigate to templates directory
cd src/backend/templates/langflow/

# Run analysis on all templates
python fix_langflow_template.py --analyze-all > template_analysis_report.txt
```

### Phase 2: Backup

```bash
# Create backup before fixing
mkdir -p backups/$(date +%Y%m%d)
cp *.json backups/$(date +%Y%m%d)/
```

### Phase 3: Apply Fixes

```bash
# Fix all templates
python fix_langflow_template.py --all
```

### Phase 4: Verification

For each template:
1. Create a new flow from the template in Langflow UI
2. Verify edges render visually on canvas
3. Test in playground to confirm workflow executes
4. Check for any error messages

### Phase 5: Document Results

Create a checklist tracking:
- [ ] Template name
- [ ] Issues found (edges/handles/agents)
- [ ] Fixes applied
- [ ] Visual verification passed
- [ ] Playground test passed

---

## Quick Reference: Issue Detection

### How to Tell if a Template Has Issues

**Edge Issues**:
```bash
# Check for wrong edge prefix
grep -l "xy-edge__" *.json
```

**Handle Space Issues**:
```bash
# Check for spaces in handles (rough check)
grep -l '": "œ' *.json
```

**Agent Model Field Issues**:
```bash
# Check for wrong model field type
grep -l '"type": "model"' *.json
```

---

## Related Files

- Template location: `src/backend/templates/langflow/`
- Fix script: `src/backend/templates/langflow/fix_langflow_template.py`
- Old edge-only doc: `docs/LANGFLOW_EDGE_RENDERING_FIX.md`
- Component standards: `docs/04_LANGFLOW_COMPONENT_STANDARDS.md`
