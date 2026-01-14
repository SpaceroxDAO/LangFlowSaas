#!/usr/bin/env python3
"""
Backup Workflows Script

Exports all workflows to individual JSON files for backup or migration.
Includes the full Langflow flow data for each workflow.

Usage:
    python -m scripts.backup_workflows --output ./backup/workflows/
    python -m scripts.backup_workflows --project-id <uuid>

Environment Variables:
    DATABASE_URL: PostgreSQL connection string
    LANGFLOW_API_URL: Langflow API URL (default: http://localhost:7860)
"""
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

import httpx

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


def get_langflow_url() -> str:
    """Get Langflow API URL from environment."""
    return os.environ.get("LANGFLOW_API_URL", "http://localhost:7860")


def sanitize_filename(name: str) -> str:
    """Convert workflow name to safe filename."""
    safe_name = "".join(c if c.isalnum() or c in " _-" else "" for c in name)
    safe_name = safe_name.replace(" ", "_").lower()
    return safe_name[:50]


def fetch_langflow_flow(langflow_id: str) -> dict:
    """
    Fetch the full flow data from Langflow API.

    Args:
        langflow_id: The Langflow flow UUID

    Returns:
        Flow data dict or empty dict on error
    """
    try:
        url = f"{get_langflow_url()}/api/v1/flows/{langflow_id}"
        with httpx.Client(timeout=30.0) as client:
            response = client.get(url)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"    Warning: Could not fetch flow {langflow_id}: {response.status_code}")
                return {}
    except Exception as e:
        print(f"    Warning: Error fetching flow {langflow_id}: {e}")
        return {}


def export_workflow(workflow_row: dict, output_dir: Path, include_flow: bool = True) -> str:
    """
    Export a single workflow to JSON file.

    Args:
        workflow_row: Workflow data from database
        output_dir: Directory to write to
        include_flow: Whether to fetch and include full Langflow data

    Returns:
        Path to exported file
    """
    workflow_id = str(workflow_row["id"])
    workflow_name = workflow_row["name"] or "unnamed_workflow"

    # Build export data
    export_data = {
        "id": workflow_id,
        "name": workflow_name,
        "description": workflow_row.get("description"),
        "project_id": str(workflow_row["project_id"]) if workflow_row.get("project_id") else None,
        "user_id": str(workflow_row["user_id"]) if workflow_row.get("user_id") else None,
        "langflow_id": workflow_row.get("langflow_id"),
        "agent_component_id": str(workflow_row["agent_component_id"]) if workflow_row.get("agent_component_id") else None,
        "created_at": workflow_row["created_at"].isoformat() if workflow_row.get("created_at") else None,
        "updated_at": workflow_row["updated_at"].isoformat() if workflow_row.get("updated_at") else None,
        "exported_at": datetime.utcnow().isoformat(),
        "export_version": "1.0.0",
    }

    # Optionally fetch full Langflow flow data
    if include_flow and workflow_row.get("langflow_id"):
        flow_data = fetch_langflow_flow(workflow_row["langflow_id"])
        if flow_data:
            export_data["langflow_flow"] = flow_data

    # Generate filename
    safe_name = sanitize_filename(workflow_name)
    short_id = workflow_id[:8]
    filename = f"{safe_name}_{short_id}.json"

    # Write file
    file_path = output_dir / filename
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)

    return str(file_path)


def backup_workflows(
    output_dir: str,
    project_id: str = None,
    user_id: str = None,
    include_flow: bool = True,
) -> dict:
    """
    Backup workflows to JSON files.

    Args:
        output_dir: Directory to export to
        project_id: Optional project ID to filter by
        user_id: Optional user ID to filter by
        include_flow: Whether to include full Langflow flow data

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
        query = "SELECT * FROM workflows WHERE 1=1"
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

        # Export each workflow
        exported_files = []
        errors = []

        for row in rows:
            try:
                file_path = export_workflow(dict(row), output_path, include_flow)
                exported_files.append(file_path)
                print(f"  Exported: {row['name']} -> {file_path}")
            except Exception as e:
                errors.append({"workflow_id": str(row["id"]), "error": str(e)})
                print(f"  Error exporting {row['name']}: {e}")

        # Write summary
        summary = {
            "backup_time": datetime.utcnow().isoformat(),
            "total_workflows": len(rows),
            "exported": len(exported_files),
            "errors": len(errors),
            "include_flow_data": include_flow,
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
        description="Backup Teach Charlie workflows to JSON files"
    )
    parser.add_argument(
        "--output", "-o",
        default="./backup/workflows",
        help="Output directory for backup files (default: ./backup/workflows)"
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
        "--no-flow",
        action="store_true",
        help="Skip fetching full Langflow flow data (faster, smaller files)"
    )

    args = parser.parse_args()

    print(f"Backing up workflows to: {args.output}")
    if not args.no_flow:
        print(f"Including Langflow flow data from: {get_langflow_url()}")
    print("-" * 50)

    summary = backup_workflows(
        output_dir=args.output,
        project_id=args.project_id,
        user_id=args.user_id,
        include_flow=not args.no_flow,
    )

    print("-" * 50)
    print(f"Backup complete!")
    print(f"  Total workflows: {summary['total_workflows']}")
    print(f"  Exported: {summary['exported']}")
    print(f"  Errors: {summary['errors']}")
    print(f"  Summary: {args.output}/_backup_summary.json")


if __name__ == "__main__":
    main()
