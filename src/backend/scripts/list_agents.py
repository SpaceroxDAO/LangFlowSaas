#!/usr/bin/env python3
"""
List Agents Script

Lists all agents in the database with summary information.

Usage:
    python -m scripts.list_agents
    python -m scripts.list_agents --project-id <uuid>
    python -m scripts.list_agents --format json

Environment Variables:
    DATABASE_URL: PostgreSQL connection string
"""
import argparse
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


def format_date(dt) -> str:
    """Format datetime for display."""
    if not dt:
        return "N/A"
    now = datetime.utcnow()
    diff = now - dt
    if diff.days == 0:
        hours = diff.seconds // 3600
        if hours == 0:
            mins = diff.seconds // 60
            return f"{mins} min ago"
        return f"{hours}h ago"
    elif diff.days < 7:
        return f"{diff.days}d ago"
    else:
        return dt.strftime("%Y-%m-%d")


def list_agents(
    project_id: str = None,
    user_id: str = None,
    output_format: str = "table",
) -> list:
    """
    List agents from database.

    Args:
        project_id: Optional project ID to filter by
        user_id: Optional user ID to filter by
        output_format: "table" or "json"

    Returns:
        List of agent dicts
    """
    # Connect to database
    engine = create_engine(get_database_url())
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Build query with project join
        query = """
            SELECT
                ac.id,
                ac.name,
                ac.description,
                ac.created_at,
                ac.updated_at,
                ac.langflow_id,
                p.name as project_name,
                ac.project_id
            FROM agent_components ac
            LEFT JOIN projects p ON ac.project_id = p.id
            WHERE 1=1
        """
        params = {}

        if project_id:
            query += " AND ac.project_id = :project_id"
            params["project_id"] = project_id

        if user_id:
            query += " AND ac.user_id = :user_id"
            params["user_id"] = user_id

        query += " ORDER BY ac.updated_at DESC"

        # Execute query
        result = session.execute(text(query), params)
        rows = result.mappings().all()

        agents = []
        for row in rows:
            agent = {
                "id": str(row["id"]),
                "name": row["name"],
                "description": row["description"],
                "project_name": row["project_name"],
                "project_id": str(row["project_id"]) if row["project_id"] else None,
                "langflow_id": row["langflow_id"],
                "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None,
            }
            agents.append(agent)

        # Output
        if output_format == "json":
            print(json.dumps(agents, indent=2))
        else:
            # Table format
            if not agents:
                print("No agents found.")
                return agents

            # Print header
            print(f"{'ID':<10} {'Name':<25} {'Project':<20} {'Updated':<12}")
            print("-" * 70)

            for agent in agents:
                agent_id = agent["id"][:8] + "..."
                name = (agent["name"] or "Unnamed")[:23]
                if len(agent.get("name", "") or "") > 23:
                    name += ".."
                project = (agent["project_name"] or "None")[:18]
                if len(agent.get("project_name", "") or "") > 18:
                    project += ".."

                # Parse updated_at for relative time
                updated = "N/A"
                if agent["updated_at"]:
                    from datetime import datetime
                    dt = datetime.fromisoformat(agent["updated_at"])
                    updated = format_date(dt)

                print(f"{agent_id:<10} {name:<25} {project:<20} {updated:<12}")

            print("-" * 70)
            print(f"Total: {len(agents)} agents")

        return agents

    finally:
        session.close()


def main():
    parser = argparse.ArgumentParser(
        description="List Teach Charlie agents"
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
        "--format", "-f",
        choices=["table", "json"],
        default="table",
        help="Output format (default: table)"
    )

    args = parser.parse_args()

    list_agents(
        project_id=args.project_id,
        user_id=args.user_id,
        output_format=args.format,
    )


if __name__ == "__main__":
    main()
