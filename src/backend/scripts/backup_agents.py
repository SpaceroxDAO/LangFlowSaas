#!/usr/bin/env python3
"""
Backup Agents Script

Exports all agents to individual JSON files for backup or migration.
Based on patterns from langflow-factory.

Usage:
    python -m scripts.backup_agents --output ./backup/agents/
    python -m scripts.backup_agents --project-id <uuid>
    python -m scripts.backup_agents --all

Environment Variables:
    DATABASE_URL: PostgreSQL connection string (optional, uses default if not set)
"""
import argparse
import asyncio
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


def get_database_url() -> str:
    """Get database URL from environment or use default."""
    return os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/teachcharlie"
    )


def sanitize_filename(name: str) -> str:
    """Convert agent name to safe filename."""
    # Remove special characters, replace spaces with underscores
    safe_name = "".join(c if c.isalnum() or c in " _-" else "" for c in name)
    safe_name = safe_name.replace(" ", "_").lower()
    return safe_name[:50]  # Limit length


def export_agent(agent_row: dict, output_dir: Path) -> str:
    """
    Export a single agent to JSON file.

    Args:
        agent_row: Agent data from database
        output_dir: Directory to write to

    Returns:
        Path to exported file
    """
    agent_id = str(agent_row["id"])
    agent_name = agent_row["name"] or "unnamed_agent"

    # Build export data
    export_data = {
        "id": agent_id,
        "name": agent_name,
        "description": agent_row.get("description"),
        "who": agent_row.get("who"),
        "rules": agent_row.get("rules"),
        "tools": agent_row.get("tools"),
        "system_prompt": agent_row.get("system_prompt"),
        "project_id": str(agent_row["project_id"]) if agent_row.get("project_id") else None,
        "user_id": str(agent_row["user_id"]) if agent_row.get("user_id") else None,
        "langflow_id": agent_row.get("langflow_id"),
        "created_at": agent_row["created_at"].isoformat() if agent_row.get("created_at") else None,
        "updated_at": agent_row["updated_at"].isoformat() if agent_row.get("updated_at") else None,
        "exported_at": datetime.utcnow().isoformat(),
        "export_version": "1.0.0",
    }

    # Generate filename
    safe_name = sanitize_filename(agent_name)
    short_id = agent_id[:8]
    filename = f"{safe_name}_{short_id}.json"

    # Write file
    file_path = output_dir / filename
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)

    return str(file_path)


def backup_agents(
    output_dir: str,
    project_id: str = None,
    user_id: str = None,
) -> dict:
    """
    Backup agents to JSON files.

    Args:
        output_dir: Directory to export to
        project_id: Optional project ID to filter by
        user_id: Optional user ID to filter by

    Returns:
        Summary dict with counts and file paths
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Connect to database
    engine = create_engine(get_database_url())
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Build query
        query = "SELECT * FROM agent_components WHERE 1=1"
        params = {}

        if project_id:
            query += " AND project_id = :project_id"
            params["project_id"] = project_id

        if user_id:
            query += " AND user_id = :user_id"
            params["user_id"] = user_id

        query += " ORDER BY created_at DESC"

        # Execute query
        result = session.execute(text(query), params)
        rows = result.mappings().all()

        # Export each agent
        exported_files = []
        errors = []

        for row in rows:
            try:
                file_path = export_agent(dict(row), output_path)
                exported_files.append(file_path)
                print(f"  Exported: {row['name']} -> {file_path}")
            except Exception as e:
                errors.append({"agent_id": str(row["id"]), "error": str(e)})
                print(f"  Error exporting {row['name']}: {e}")

        # Write summary
        summary = {
            "backup_time": datetime.utcnow().isoformat(),
            "total_agents": len(rows),
            "exported": len(exported_files),
            "errors": len(errors),
            "files": exported_files,
            "error_details": errors,
        }

        summary_path = output_path / "_backup_summary.json"
        with open(summary_path, "w") as f:
            json.dump(summary, f, indent=2)

        return summary

    finally:
        session.close()


def main():
    parser = argparse.ArgumentParser(
        description="Backup Teach Charlie agents to JSON files"
    )
    parser.add_argument(
        "--output", "-o",
        default="./backup/agents",
        help="Output directory for backup files (default: ./backup/agents)"
    )
    parser.add_argument(
        "--project-id", "-p",
        help="Filter by project ID"
    )
    parser.add_argument(
        "--user-id", "-u",
        help="Filter by user ID"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Backup all agents (default behavior)"
    )

    args = parser.parse_args()

    print(f"Backing up agents to: {args.output}")
    print("-" * 50)

    summary = backup_agents(
        output_dir=args.output,
        project_id=args.project_id,
        user_id=args.user_id,
    )

    print("-" * 50)
    print(f"Backup complete!")
    print(f"  Total agents: {summary['total_agents']}")
    print(f"  Exported: {summary['exported']}")
    print(f"  Errors: {summary['errors']}")
    print(f"  Summary: {args.output}/_backup_summary.json")


if __name__ == "__main__":
    main()
