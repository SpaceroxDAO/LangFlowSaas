"""
Recovery script to restore agents from Langflow flows to PostgreSQL.

This script:
1. Fetches all flows from Langflow
2. Extracts agent metadata from flow data
3. Re-creates agent records in our PostgreSQL database
"""
import asyncio
import re
import uuid
from datetime import datetime, timezone

import httpx
from sqlalchemy import text


async def recover_agents():
    """Recover agents from Langflow flows."""
    from app.database import async_session_maker

    LANGFLOW_URL = "http://langflow:7860"
    DEV_USER_ID = "a36c791d-b36b-44b7-abc1-feaafb6a8d40"  # Our dev user

    print("🔍 Fetching flows from Langflow...")

    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{LANGFLOW_URL}/api/v1/flows/")
        flows = resp.json()

    print(f"📦 Found {len(flows)} total flows")

    # Filter flows that belong to our dev user (based on name pattern)
    user_flows = []
    for flow in flows:
        name = flow.get("name", "")
        flow_id = flow.get("id", "")

        # Skip flows that don't look like our agents
        # Our flow names contain the user_id: "Agent Name - user_id"
        if DEV_USER_ID in name:
            user_flows.append(flow)

    print(f"👤 Found {len(user_flows)} flows for dev user")

    async with async_session_maker() as session:
        # Check existing agents
        result = await session.execute(text("SELECT COUNT(*) FROM agents"))
        existing_count = result.scalar()
        print(f"📊 Currently {existing_count} agents in database")

        recovered = 0
        skipped = 0

        for flow in user_flows:
            flow_id = flow["id"]
            flow_name = flow["name"]

            # Check if this flow already has an agent record
            result = await session.execute(
                text("SELECT id FROM agents WHERE langflow_flow_id = :flow_id"),
                {"flow_id": flow_id}
            )
            if result.scalar():
                skipped += 1
                continue

            # Extract agent name (remove the user_id suffix)
            agent_name = flow_name.split(" - ")[0].strip()
            if not agent_name:
                agent_name = "Recovered Agent"

            # Get full flow data to extract system prompt
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"{LANGFLOW_URL}/api/v1/flows/{flow_id}")
                full_flow = resp.json()

            # Extract system prompt from Agent node
            system_prompt = ""
            nodes = full_flow.get("data", {}).get("nodes", [])
            for node in nodes:
                if node.get("data", {}).get("type") == "Agent":
                    template = node["data"].get("node", {}).get("template", {})
                    system_prompt = template.get("system_prompt", {}).get("value", "")
                    break

            # Parse Q&A from system prompt
            qa_who = "Recovered from Langflow"
            qa_rules = "Recovered from Langflow"
            qa_tricks = ""

            # Try to extract "who" from system prompt
            if system_prompt.startswith("You are "):
                who_match = re.match(r"You are ([^.]+)", system_prompt)
                if who_match:
                    qa_who = who_match.group(1)

            # Create agent record
            agent_id = str(uuid.uuid4())
            now = datetime.now(timezone.utc).isoformat()

            await session.execute(
                text("""
                    INSERT INTO agents (
                        id, user_id, name, description,
                        qa_who, qa_rules, qa_tricks, system_prompt,
                        langflow_flow_id, template_name, is_active,
                        created_at, updated_at
                    ) VALUES (
                        :id, :user_id, :name, :description,
                        :qa_who, :qa_rules, :qa_tricks, :system_prompt,
                        :langflow_flow_id, :template_name, :is_active,
                        :created_at, :updated_at
                    )
                """),
                {
                    "id": agent_id,
                    "user_id": DEV_USER_ID,
                    "name": agent_name,
                    "description": flow.get("description", ""),
                    "qa_who": qa_who,
                    "qa_rules": qa_rules,
                    "qa_tricks": qa_tricks,
                    "system_prompt": system_prompt or "No system prompt found",
                    "langflow_flow_id": flow_id,
                    "template_name": "agent_base",
                    "is_active": True,
                    "created_at": now,
                    "updated_at": now,
                }
            )

            recovered += 1
            print(f"  ✅ Recovered: {agent_name} ({flow_id[:8]}...)")

        await session.commit()

        print(f"\n📊 Recovery Summary:")
        print(f"   - Recovered: {recovered} agents")
        print(f"   - Skipped (already exist): {skipped}")
        print(f"   - Total in database now: {existing_count + recovered}")


if __name__ == "__main__":
    asyncio.run(recover_agents())
