#!/usr/bin/env python3
"""
Fix old workflows that were created before the LLM settings fix.
Updates workflows to use the user's configured API provider and key.
"""
import asyncio
import sys
sys.path.insert(0, '/Users/adamcognigy/LangflowSaaS/src/backend')

from sqlalchemy import select
from app.database import async_session_maker
from app.models.workflow import Workflow
from app.models.user_settings import UserSettings
from app.services.template_mapping import LLM_PROVIDER_CONFIGS

USER_ID = "a36c791d-b36b-44b7-abc1-feaafb6a8d40"

async def fix_workflows():
    async with async_session_maker() as session:
        # Get user settings
        stmt = select(UserSettings).where(UserSettings.user_id == USER_ID)
        result = await session.execute(stmt)
        settings = result.scalar_one_or_none()

        if not settings:
            print("No user settings found!")
            return

        provider = settings.default_llm_provider or "openai"
        api_keys = settings.api_keys_encrypted or {}
        api_key_data = api_keys.get(provider, {})
        api_key = api_key_data.get("key") if isinstance(api_key_data, dict) else None

        print(f"User settings: provider={provider}, has_key={bool(api_key)}")

        if not api_key:
            print("No API key configured!")
            return

        config = LLM_PROVIDER_CONFIGS.get(provider, LLM_PROVIDER_CONFIGS["openai"])

        # Get all workflows for user
        stmt = select(Workflow).where(Workflow.user_id == USER_ID)
        result = await session.execute(stmt)
        workflows = result.scalars().all()

        print(f"Found {len(workflows)} workflows")

        fixed_count = 0
        for workflow in workflows:
            if not workflow.flow_data:
                continue

            nodes = workflow.flow_data.get("data", {}).get("nodes", [])
            needs_fix = False

            for node in nodes:
                node_data = node.get("data", {})
                if node_data.get("type") == "Agent":
                    template = node_data.get("node", {}).get("template", {})
                    current_llm = template.get("agent_llm", {}).get("value", "")
                    current_key = template.get("api_key", {}).get("value", "")

                    # Check if it's using a placeholder or wrong provider
                    if current_key in ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GOOGLE_API_KEY", ""] or \
                       current_llm != config["agent_llm"]:
                        needs_fix = True
                        print(f"  Workflow '{workflow.name}' needs fix:")
                        print(f"    Current: {current_llm}, key={current_key[:20]}...")

                        # Update to correct settings
                        if "agent_llm" in template:
                            template["agent_llm"]["value"] = config["agent_llm"]
                        if "model_name" in template:
                            template["model_name"]["value"] = config["model_name"]
                            template["model_name"]["options"] = config["model_options"]
                        if "api_key" in template:
                            template["api_key"]["value"] = api_key
                            template["api_key"]["display_name"] = f"{config['agent_llm']} API Key"
                        if "base_url" in template and config.get("base_url"):
                            template["base_url"]["value"] = config["base_url"]

                        print(f"    Updated: {config['agent_llm']}, key={api_key[:20]}...")

            if needs_fix:
                # Mark as modified
                from sqlalchemy.orm.attributes import flag_modified
                flag_modified(workflow, "flow_data")
                fixed_count += 1

        if fixed_count > 0:
            await session.commit()
            print(f"\nFixed {fixed_count} workflows!")
        else:
            print("\nNo workflows needed fixing.")

if __name__ == "__main__":
    asyncio.run(fix_workflows())
