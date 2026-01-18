# Langflow Edge Rendering Fix Guide

> **Last Updated**: 2026-01-17
> **Langflow Version**: 1.7.2
> **Purpose**: Troubleshooting guide for when edges (connection lines) don't render on the canvas

---

## Problem: Edges Not Visible on Canvas

When importing a flow template or creating a workflow, sometimes the edge/connection lines between nodes don't render visually on the canvas, even though the nodes appear correctly.

**Symptoms:**
- Nodes display correctly on the canvas
- No visible connection lines between nodes
- Database shows edges exist (verify with: `SELECT COUNT(*) FROM flow WHERE data->'edges' IS NOT NULL`)
- Hovering over node handles shows no connections

---

## Root Cause

React Flow (Langflow's canvas library) validates edges by matching `sourceHandle` and `targetHandle` strings **exactly**. Two common format issues cause edges to fail silently:

### Issue 1: Wrong Edge ID Prefix

| Working Format | Broken Format |
|----------------|---------------|
| `reactflow__edge-` | `xy-edge__` |

### Issue 2: Spaces in Handle Strings

Langflow uses Unicode character `œ` (\u0153) instead of quotes in handle strings. The format must have **NO SPACES** after colons or commas:

| Working Format | Broken Format |
|----------------|---------------|
| `{œdataTypeœ:œAgentœ,œidœ:œAgent-abc123œ}` | `{œdataTypeœ: œAgentœ, œidœ: œAgent-abc123œ}` |

---

## The Fix

### Python Script to Fix Template Edges

Save this script and run it on your template JSON file:

```python
import json
import re
import sys

def fix_langflow_edges(template_path: str) -> None:
    """
    Fix edge format for Langflow 1.7.2 compatibility.

    Fixes two issues:
    1. Edge ID prefix: xy-edge__ -> reactflow__edge-
    2. Handle strings: Remove spaces after colons and commas
    """
    with open(template_path, 'r') as f:
        data = json.load(f)

    # Handle both flow export formats
    if 'data' in data and 'edges' in data['data']:
        edges = data['data']['edges']
    elif 'edges' in data:
        edges = data['edges']
    else:
        print("No edges found in template")
        return

    fixed_count = 0
    for edge in edges:
        modified = False

        # Fix 1: Change edge ID prefix
        if edge.get('id', '').startswith('xy-edge__'):
            edge['id'] = edge['id'].replace('xy-edge__', 'reactflow__edge-', 1)
            modified = True

        # Fix 2: Remove spaces in sourceHandle
        if 'sourceHandle' in edge and isinstance(edge['sourceHandle'], str):
            original = edge['sourceHandle']
            edge['sourceHandle'] = original.replace(', ', ',').replace(': ', ':')
            if edge['sourceHandle'] != original:
                modified = True

        # Fix 3: Remove spaces in targetHandle
        if 'targetHandle' in edge and isinstance(edge['targetHandle'], str):
            original = edge['targetHandle']
            edge['targetHandle'] = original.replace(', ', ',').replace(': ', ':')
            if edge['targetHandle'] != original:
                modified = True

        if modified:
            fixed_count += 1

    # Save the fixed template
    with open(template_path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Fixed {fixed_count} edges in {template_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_edges.py <template.json>")
        sys.exit(1)

    fix_langflow_edges(sys.argv[1])
```

### Usage

```bash
# Fix a single template
python fix_edges.py "Travel Planning Agents.json"

# Fix all templates in a directory
for f in *.json; do python fix_edges.py "$f"; done
```

---

## Verification Steps

### 1. Check Edge Count in Database

```sql
-- PostgreSQL
SELECT name,
       jsonb_array_length(data->'edges') as edge_count
FROM flow
WHERE name = 'Your Flow Name';
```

### 2. Verify Edge Format

```sql
-- Check edge ID format
SELECT data->'edges'->0->>'id' as first_edge_id
FROM flow WHERE name = 'Your Flow Name';

-- Should start with: reactflow__edge-
```

### 3. Visual Verification

1. Open the flow in Langflow canvas (`/flow/{flow_id}`)
2. Edges should appear as colored lines connecting nodes
3. Hover over node handles - tooltips should show connection info

---

## Working Edge Format Example

From a working Langflow 1.7.2 flow (Simple Agent):

```json
{
  "id": "reactflow__edge-Agent-ilYE4{œdataTypeœ:œAgentœ,œidœ:œAgent-ilYE4œ,œnameœ:œresponseœ,œoutput_typesœ:[œMessageœ]}-ChatOutput-TjfhN{œfieldNameœ:œinput_valueœ,œidœ:œChatOutput-TjfhNœ,œinputTypesœ:[œMessageœ],œtypeœ:œstrœ}",
  "source": "Agent-ilYE4",
  "target": "ChatOutput-TjfhN",
  "sourceHandle": "{œdataTypeœ:œAgentœ,œidœ:œAgent-ilYE4œ,œnameœ:œresponseœ,œoutput_typesœ:[œMessageœ]}",
  "targetHandle": "{œfieldNameœ:œinput_valueœ,œidœ:œChatOutput-TjfhNœ,œinputTypesœ:[œMessageœ],œtypeœ:œstrœ}",
  "type": "default"
}
```

**Key characteristics:**
- ID starts with `reactflow__edge-`
- No spaces after `:` or `,` in handle strings
- Uses `œ` character (Unicode \u0153) instead of quotes

---

## Common Mistakes to Avoid

1. **Don't** export flows from newer Langflow versions and import into 1.7.2 without checking edge format
2. **Don't** manually edit handle strings with regular JSON formatting (adds spaces)
3. **Don't** use `xy-edge__` prefix (that's from older versions)
4. **Don't** forget to set `ensure_ascii=False` when saving JSON (preserves `œ` character)

---

## Debugging Tips

### Check Browser Console

Open DevTools (F12) and look for React Flow warnings:
- "Edge not found" errors indicate handle mismatch
- "Invalid source/target" means node IDs are wrong

### Validate Handle String Matching

The `sourceHandle` must match exactly what the source node outputs. Compare:
1. Your edge's `sourceHandle` value
2. The source node's output handle definition

### Use SQL to Compare Working vs Broken

```sql
-- Extract and compare edge formats
SELECT
  name,
  data->'edges'->0->>'id' as edge_id,
  SUBSTRING(data->'edges'->0->>'sourceHandle', 1, 50) as source_handle_start
FROM flow
WHERE name IN ('Working Flow', 'Broken Flow');
```

---

## Related Files

- Template location: `src/backend/templates/langflow/`
- This doc: `docs/LANGFLOW_EDGE_RENDERING_FIX.md`
- Component standards: `docs/04_LANGFLOW_COMPONENT_STANDARDS.md`
