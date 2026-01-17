#!/usr/bin/env python3
"""
Mission Validation Script

Validates mission definitions against schema and educational principles.
Usage: python validate_mission.py <mission_dict_or_file>

Or import and use programmatically:
    from validate_mission import validate_mission
    errors = validate_mission(mission_dict)
"""

import re
import sys
import json
from typing import Any, Dict, List, Optional


# Valid enum values
VALID_CATEGORIES = ["skill_sprint", "applied_build"]
VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"]
VALID_STEP_TYPES = ["info", "action"]
VALID_PHASES = ["works", "reliable", "connected"]

# Langflow component categories
LANGFLOW_CATEGORIES = [
    "input & output",
    "data sources",
    "models & agents",
    "memories",
    "tools",
    "processing",
    "utilities",
    "custom",
]

# Known Langflow components (partial list - extend as needed)
KNOWN_COMPONENTS = [
    "ChatInput",
    "ChatOutput",
    "Agent",
    "OpenAIModel",
    "AnthropicModel",
    "PromptTemplate",
    "TextInput",
    "TextOutput",
    "File",
    "URL",
    "AstraDB",
    "Pinecone",
    "Calculator",
    "SearchAPI",
    "PythonREPL",
    "Memory",
    "ConversationMemory",
]

# Course components (custom to Teach Charlie)
COURSE_COMPONENTS = [
    "Mission Brief",
    "RAG Kit",
    "Memory Kit",
    "Ship Pack",
    "Metrics Panel",
]

# ID pattern: L###-slug or ORG###-slug
ID_PATTERN = re.compile(r"^(L|ORG)\d{3}-[a-z][a-z0-9-]{1,40}$")


class ValidationError:
    """Represents a single validation error."""

    def __init__(self, field: str, message: str, severity: str = "error"):
        self.field = field
        self.message = message
        self.severity = severity  # "error", "warning", "info"

    def __str__(self):
        icon = {"error": "❌", "warning": "⚠️", "info": "ℹ️"}.get(self.severity, "•")
        return f"{icon} [{self.field}] {self.message}"


def validate_mission(mission: Dict[str, Any]) -> List[ValidationError]:
    """
    Validate a mission definition.

    Returns a list of ValidationError objects.
    Empty list means mission is valid.
    """
    errors: List[ValidationError] = []

    # === REQUIRED FIELDS ===
    required_fields = [
        "id", "name", "description", "category", "difficulty",
        "estimated_minutes", "icon", "sort_order", "steps", "outcomes"
    ]

    for field in required_fields:
        if field not in mission:
            errors.append(ValidationError(field, f"Required field '{field}' is missing"))

    # If missing critical fields, return early
    if any(e.field in ["id", "steps", "category"] for e in errors):
        return errors

    # === ID FORMAT ===
    mission_id = mission.get("id", "")
    if not ID_PATTERN.match(mission_id):
        errors.append(ValidationError(
            "id",
            f"ID '{mission_id}' doesn't match pattern L###-slug or ORG###-slug"
        ))

    # === CATEGORY ===
    category = mission.get("category")
    if category not in VALID_CATEGORIES:
        errors.append(ValidationError(
            "category",
            f"Invalid category '{category}'. Must be one of: {VALID_CATEGORIES}"
        ))

    # === DIFFICULTY ===
    difficulty = mission.get("difficulty")
    if difficulty not in VALID_DIFFICULTIES:
        errors.append(ValidationError(
            "difficulty",
            f"Invalid difficulty '{difficulty}'. Must be one of: {VALID_DIFFICULTIES}"
        ))

    # === STEPS VALIDATION ===
    steps = mission.get("steps", [])

    # Step count by category
    if category == "skill_sprint":
        if len(steps) < 3:
            errors.append(ValidationError(
                "steps",
                f"Skill Sprint should have at least 3 steps, found {len(steps)}",
                "warning"
            ))
        if len(steps) > 4:
            errors.append(ValidationError(
                "steps",
                f"Skill Sprint should have max 4 steps, found {len(steps)}",
                "warning"
            ))
    elif category == "applied_build":
        if len(steps) < 5:
            errors.append(ValidationError(
                "steps",
                f"Applied Build should have at least 5 steps, found {len(steps)}",
                "warning"
            ))
        if len(steps) > 6:
            errors.append(ValidationError(
                "steps",
                f"Applied Build should have max 6 steps, found {len(steps)}",
                "warning"
            ))

    # Validate each step
    for i, step in enumerate(steps):
        step_prefix = f"steps[{i}]"

        # Required step fields
        if "id" not in step:
            errors.append(ValidationError(step_prefix, "Step missing 'id'"))
        elif step["id"] != i + 1:
            errors.append(ValidationError(
                f"{step_prefix}.id",
                f"Step ID should be {i + 1}, found {step['id']}"
            ))

        if "title" not in step:
            errors.append(ValidationError(step_prefix, "Step missing 'title'"))

        if "description" not in step:
            errors.append(ValidationError(step_prefix, "Step missing 'description'"))

        if "type" not in step:
            errors.append(ValidationError(step_prefix, "Step missing 'type'"))
        elif step["type"] not in VALID_STEP_TYPES:
            errors.append(ValidationError(
                f"{step_prefix}.type",
                f"Invalid step type '{step['type']}'. Must be: {VALID_STEP_TYPES}"
            ))

        # Optional phase validation
        if "phase" in step and step["phase"] not in VALID_PHASES:
            errors.append(ValidationError(
                f"{step_prefix}.phase",
                f"Invalid phase '{step['phase']}'. Must be: {VALID_PHASES}"
            ))

        # Check for vague descriptions
        desc = step.get("description", "")
        vague_terms = ["configure", "set up", "do this", "click here"]
        for term in vague_terms:
            if desc.lower() == term or desc.lower().startswith(term + "."):
                errors.append(ValidationError(
                    f"{step_prefix}.description",
                    f"Description is too vague: '{desc}'. Be specific about what and where.",
                    "warning"
                ))

    # === TIME VALIDATION ===
    minutes = mission.get("estimated_minutes", 0)
    if category == "skill_sprint":
        if minutes < 10 or minutes > 15:
            errors.append(ValidationError(
                "estimated_minutes",
                f"Skill Sprint should be 10-15 minutes, found {minutes}",
                "warning"
            ))
    elif category == "applied_build":
        if minutes < 30 or minutes > 45:
            errors.append(ValidationError(
                "estimated_minutes",
                f"Applied Build should be 30-45 minutes, found {minutes}",
                "warning"
            ))

    # === OUTCOMES ===
    outcomes = mission.get("outcomes", [])
    if len(outcomes) < 2:
        errors.append(ValidationError(
            "outcomes",
            f"Should have at least 2 outcomes, found {len(outcomes)}",
            "warning"
        ))
    if len(outcomes) > 4:
        errors.append(ValidationError(
            "outcomes",
            f"Should have max 4 outcomes, found {len(outcomes)}",
            "warning"
        ))

    # === CANVAS MODE VALIDATION ===
    canvas_mode = mission.get("canvas_mode", False)
    if canvas_mode:
        # Should have template_id
        if "template_id" not in mission:
            errors.append(ValidationError(
                "template_id",
                "canvas_mode=True but no template_id specified",
                "warning"
            ))

        # Validate component_pack if present
        component_pack = mission.get("component_pack", {})
        if component_pack:
            allowed = component_pack.get("allowed_components", [])
            for comp in allowed:
                if comp not in KNOWN_COMPONENTS and comp not in COURSE_COMPONENTS:
                    errors.append(ValidationError(
                        "component_pack.allowed_components",
                        f"Unknown component '{comp}'. May need to be created.",
                        "info"
                    ))

            allowed_cats = component_pack.get("allowed_categories", [])
            for cat in allowed_cats:
                if cat not in LANGFLOW_CATEGORIES:
                    errors.append(ValidationError(
                        "component_pack.allowed_categories",
                        f"Unknown category '{cat}'"
                    ))

            hidden_cats = component_pack.get("hidden_categories", [])
            for cat in hidden_cats:
                if cat not in LANGFLOW_CATEGORIES:
                    errors.append(ValidationError(
                        "component_pack.hidden_categories",
                        f"Unknown category '{cat}'"
                    ))

    # === PREREQUISITES VALIDATION ===
    prereqs = mission.get("prerequisites") or []
    for prereq in prereqs:
        if not ID_PATTERN.match(prereq):
            errors.append(ValidationError(
                "prerequisites",
                f"Prerequisite '{prereq}' doesn't match ID pattern"
            ))

    # === EDUCATIONAL PRINCIPLES ===

    # Check for technical jargon in user-facing text
    jargon_terms = {
        "system prompt": "job description",
        "temperature": "creativity",
        "llm": "agent or Charlie",
        "vector store": "reference library",
        "embedding": None,  # Just flag, no replacement
        "token": "attention span",
        "rag": "reference library",
        "api": "commands",
    }

    text_fields = [
        ("description", mission.get("description", "")),
        ("name", mission.get("name", "")),
    ]
    for step in steps:
        text_fields.append((f"steps[{step.get('id', '?')}].title", step.get("title", "")))
        text_fields.append((f"steps[{step.get('id', '?')}].description", step.get("description", "")))

    for field_name, text in text_fields:
        text_lower = text.lower()
        for jargon, friendly in jargon_terms.items():
            # Use word boundary check to avoid false positives (e.g., "Drag" matching "rag")
            pattern = r'\b' + re.escape(jargon) + r'\b'
            if re.search(pattern, text_lower):
                suggestion = f" Use '{friendly}' instead." if friendly else ""
                errors.append(ValidationError(
                    field_name,
                    f"Technical jargon '{jargon}' found.{suggestion}",
                    "warning"
                ))

    return errors


def validate_and_print(mission: Dict[str, Any]) -> bool:
    """Validate and print results. Returns True if valid (no errors)."""
    errors = validate_mission(mission)

    if not errors:
        print("✅ Mission is valid!")
        return True

    # Group by severity
    by_severity = {"error": [], "warning": [], "info": []}
    for e in errors:
        by_severity[e.severity].append(e)

    # Print errors first
    if by_severity["error"]:
        print("\n🚫 ERRORS (must fix):")
        for e in by_severity["error"]:
            print(f"  {e}")

    if by_severity["warning"]:
        print("\n⚠️  WARNINGS (should fix):")
        for e in by_severity["warning"]:
            print(f"  {e}")

    if by_severity["info"]:
        print("\nℹ️  INFO:")
        for e in by_severity["info"]:
            print(f"  {e}")

    print(f"\nTotal: {len(by_severity['error'])} errors, {len(by_severity['warning'])} warnings, {len(by_severity['info'])} info")

    return len(by_severity["error"]) == 0


# Example mission for testing
EXAMPLE_MISSION = {
    "id": "L015-tool-basics",
    "name": "Tool Basics",
    "description": "Learn to give your agent new abilities by adding tools.",
    "category": "skill_sprint",
    "difficulty": "beginner",
    "estimated_minutes": 15,
    "icon": "wrench",
    "sort_order": 15,
    "canvas_mode": True,
    "template_id": "agent_base",
    "component_pack": {
        "allowed_components": ["ChatInput", "ChatOutput", "Agent", "Calculator"],
        "allowed_categories": ["input & output", "models & agents", "tools"],
        "hidden_categories": ["memories", "processing", "data sources"],
    },
    "steps": [
        {
            "id": 1,
            "title": "Explore the Toolbox",
            "description": "Look at the Tools category in the sidebar. These are abilities you can give your agent.",
            "type": "info",
            "phase": "works",
        },
        {
            "id": 2,
            "title": "Add a Calculator Tool",
            "description": "Drag the Calculator tool onto the canvas. This lets your agent do math calculations.",
            "type": "action",
            "phase": "works",
        },
        {
            "id": 3,
            "title": "Connect Tool to Agent",
            "description": "Connect the Calculator's output to the Agent's 'tools' input.",
            "type": "action",
            "phase": "works",
        },
        {
            "id": 4,
            "title": "Test the New Ability",
            "description": "Run your flow and ask: 'What is 15% of 230?'",
            "type": "action",
            "phase": "reliable",
        },
    ],
    "prerequisites": ["L010-build-first-agent"],
    "outcomes": [
        "Add tools to extend agent capabilities",
        "Connect tools to agents on the canvas",
        "Test tool-enabled agents",
    ],
}


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Load from file or JSON string
        arg = sys.argv[1]
        try:
            if arg.endswith(".json"):
                with open(arg) as f:
                    mission = json.load(f)
            else:
                mission = json.loads(arg)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading mission: {e}")
            sys.exit(1)
    else:
        # Use example mission
        print("No mission provided, using example mission...")
        print("-" * 50)
        mission = EXAMPLE_MISSION

    is_valid = validate_and_print(mission)
    sys.exit(0 if is_valid else 1)
