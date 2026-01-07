"""
Avatar Prompt Testing Script

This script tests different DALL-E prompt templates to find ones that produce
consistent, on-brand dog avatars for Teach Charlie AI.

Usage:
    cd LangflowSaaS
    python scripts/test_avatar_prompts.py

Requirements:
    - OPENAI_API_KEY environment variable set
    - pip install httpx python-dotenv
"""
import asyncio
import httpx
import os
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OUTPUT_DIR = Path("scripts/avatar_test_results")
DALL_E_URL = "https://api.openai.com/v1/images/generations"

# Test descriptions (simulating different agent personas)
TEST_DESCRIPTIONS = [
    # Short names (what the code comment suggests works better)
    "Charlie",
    "Max",
    "Buddy",
    "Luna",
    # Medium descriptions
    "A friendly customer support dog",
    "A smart research assistant dog",
    "A helpful sales dog",
    # Long descriptions (what users actually enter)
    "A friendly Golden Retriever who is an expert in dog treats, bones, and finding the best parks",
    "A professional Border Collie that helps with scheduling and time management",
    "A cheerful Labrador that answers questions about cooking and recipes",
]

# Prompt templates to test
# Each template should produce consistent, recognizable results
PROMPT_TEMPLATES = {
    # Current (baseline)
    "v1_current": "Create a dog {description} icon thats black and white",

    # Simple improvements - more specific style
    "v2_lineart": "Simple black and white line art icon of a happy dog, minimal design, white background. The dog represents: {description}",

    "v3_geometric": "Geometric minimalist dog icon, black lines on white background, simple shapes, logo style. Dog personality: {description}",

    "v4_mascot": "Cute cartoon dog mascot head icon, simple black outlines, white background, friendly expression, flat design. Character: {description}",

    # More constrained prompts
    "v5_badge": "Black and white circular badge icon featuring a simple dog face, clean lines, minimalist style, centered composition, white background",

    "v6_silhouette": "Simple black dog silhouette icon on white background, clean minimal design, single solid shape, no details",

    # Highly specific prompts (ignoring description for consistency)
    "v7_standard_happy": "Simple black and white icon of a happy cartoon dog face, round head, floppy ears, tongue out, minimal lines, white background, flat vector style",

    "v8_standard_friendly": "Minimalist black line drawing of a friendly dog head icon, simple geometric shapes, circular face, pointy ears, dot eyes, white background",

    # Style-locked prompts
    "v9_emoji_style": "Dog emoji style icon, simple black outlines, white fill, cute round face, minimal detail, centered, white background",

    "v10_app_icon": "Mobile app icon of a dog, flat design, black and white only, simple shapes, rounded corners style, professional, clean",
}

# DALL-E settings to test
DALL_E_SETTINGS = [
    {"quality": "hd", "style": "vivid"},      # Current
    {"quality": "hd", "style": "natural"},    # More realistic
    {"quality": "standard", "style": "vivid"}, # Faster, more stylized
    {"quality": "standard", "style": "natural"}, # Faster, more realistic
]


async def generate_image(prompt: str, settings: dict) -> dict:
    """Call DALL-E API and return result."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            DALL_E_URL,
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                **settings,
            },
        )

        if response.status_code != 200:
            error = response.json().get("error", {})
            return {
                "success": False,
                "error": error.get("message", "Unknown error"),
                "revised_prompt": None,
                "url": None,
            }

        data = response.json()
        return {
            "success": True,
            "error": None,
            "revised_prompt": data["data"][0].get("revised_prompt"),
            "url": data["data"][0]["url"],
        }


async def download_image(url: str, filepath: Path) -> bool:
    """Download image from URL to local file."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                filepath.write_bytes(response.content)
                return True
    except Exception as e:
        print(f"  Failed to download: {e}")
    return False


async def test_single_prompt(
    template_name: str,
    template: str,
    description: str,
    settings: dict,
    output_dir: Path,
) -> dict:
    """Test a single prompt template with given description and settings."""
    # Build the prompt
    if "{description}" in template:
        prompt = template.format(description=description)
    else:
        prompt = template  # Some templates ignore description for consistency

    settings_str = f"{settings['quality']}_{settings['style']}"
    safe_desc = description[:30].replace(" ", "_").replace("/", "_")

    print(f"  Testing: {template_name} | {safe_desc} | {settings_str}")

    result = await generate_image(prompt, settings)

    test_result = {
        "template_name": template_name,
        "template": template,
        "description": description,
        "final_prompt": prompt,
        "settings": settings,
        "success": result["success"],
        "error": result["error"],
        "revised_prompt": result["revised_prompt"],
        "image_url": result["url"],
        "local_file": None,
    }

    # Download image if successful
    if result["success"] and result["url"]:
        filename = f"{template_name}_{safe_desc}_{settings_str}.png"
        filepath = output_dir / filename
        if await download_image(result["url"], filepath):
            test_result["local_file"] = str(filepath)
            print(f"    ✓ Saved: {filename}")
        else:
            print(f"    ✗ Failed to save image")
    else:
        print(f"    ✗ Error: {result['error']}")

    return test_result


async def run_focused_test():
    """
    Run a focused test with just a few prompt variations.
    Good for quick iteration on prompt design.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_dir = OUTPUT_DIR / f"focused_{timestamp}"
    test_dir.mkdir(exist_ok=True)

    print(f"\n{'='*60}")
    print("FOCUSED AVATAR PROMPT TEST")
    print(f"Output directory: {test_dir}")
    print(f"{'='*60}\n")

    # Just test a few key combinations
    test_templates = ["v1_current", "v5_badge", "v7_standard_happy", "v9_emoji_style"]
    test_descriptions = ["Charlie", "A friendly customer support dog"]
    test_settings = [{"quality": "hd", "style": "vivid"}]

    results = []

    for template_name in test_templates:
        template = PROMPT_TEMPLATES[template_name]
        for description in test_descriptions:
            for settings in test_settings:
                result = await test_single_prompt(
                    template_name, template, description, settings, test_dir
                )
                results.append(result)
                # Small delay to avoid rate limiting
                await asyncio.sleep(1)

    # Save results
    results_file = test_dir / "results.json"
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Test complete! Results saved to: {results_file}")
    print(f"Images saved to: {test_dir}")
    print(f"{'='*60}\n")

    # Summary
    successful = sum(1 for r in results if r["success"])
    print(f"Success rate: {successful}/{len(results)}")

    return results


async def run_comprehensive_test():
    """
    Run a comprehensive test of all prompt templates.
    Warning: This will make many API calls and cost money!
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_dir = OUTPUT_DIR / f"comprehensive_{timestamp}"
    test_dir.mkdir(exist_ok=True)

    print(f"\n{'='*60}")
    print("COMPREHENSIVE AVATAR PROMPT TEST")
    print(f"Output directory: {test_dir}")
    print(f"{'='*60}\n")

    # Use standard settings for comparison
    settings = {"quality": "hd", "style": "vivid"}

    results = []

    for template_name, template in PROMPT_TEMPLATES.items():
        print(f"\nTesting template: {template_name}")
        print(f"  Template: {template[:60]}...")

        for description in TEST_DESCRIPTIONS[:3]:  # Limit to 3 descriptions
            result = await test_single_prompt(
                template_name, template, description, settings, test_dir
            )
            results.append(result)
            await asyncio.sleep(1)

    # Save results
    results_file = test_dir / "results.json"
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Test complete! Results saved to: {results_file}")
    print(f"{'='*60}\n")

    return results


def print_menu():
    """Print menu options."""
    print("\nAvatar Prompt Testing Options:")
    print("1. Focused test (8 images, ~$0.32)")
    print("2. Comprehensive test (~30 images, ~$1.20)")
    print("3. Custom single prompt test")
    print("4. Exit")
    print()


async def test_custom_prompt():
    """Test a custom prompt interactively."""
    print("\nEnter your custom prompt template:")
    print("(Use {description} as placeholder for the agent description)")
    template = input("> ")

    print("\nEnter test description:")
    description = input("> ")

    print("\nSelect quality (hd/standard):")
    quality = input("> ") or "hd"

    print("\nSelect style (vivid/natural):")
    style = input("> ") or "vivid"

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    result = await test_single_prompt(
        "custom",
        template,
        description,
        {"quality": quality, "style": style},
        OUTPUT_DIR,
    )

    print("\nResult:")
    print(f"  Success: {result['success']}")
    if result["revised_prompt"]:
        print(f"  DALL-E revised prompt: {result['revised_prompt'][:100]}...")
    if result["local_file"]:
        print(f"  Image saved to: {result['local_file']}")


async def main():
    """Main entry point."""
    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY environment variable not set")
        print("Set it with: export OPENAI_API_KEY=your-key-here")
        return

    print("\n" + "="*60)
    print("TEACH CHARLIE AI - Avatar Prompt Tester")
    print("="*60)

    while True:
        print_menu()
        choice = input("Select option: ").strip()

        if choice == "1":
            await run_focused_test()
        elif choice == "2":
            confirm = input("This will cost ~$1.20. Continue? (y/n): ")
            if confirm.lower() == "y":
                await run_comprehensive_test()
        elif choice == "3":
            await test_custom_prompt()
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Invalid option")


if __name__ == "__main__":
    asyncio.run(main())
