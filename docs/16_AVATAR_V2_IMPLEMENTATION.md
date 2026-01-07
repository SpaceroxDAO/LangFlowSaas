# Avatar Generation V2: Implementation Document

**Created**: 2026-01-07
**Status**: Implementation Ready
**Model**: gpt-image-1 (verified working)

---

## Base Image Analysis

The canonical base dog image has these characteristics:

```
┌─────────────────────────────────────┐
│                                     │
│         ╭───────────────╮           │
│        ╭╯   ●       ●   ╰╮          │  ← Floppy ears
│       ╭╯                 ╰╮         │
│       │        ◉          │         │  ← Dot eyes, filled nose
│       │       ╰─╯         │         │  ← Simple smile
│       ╰╮                 ╭╯         │
│         ╰───────────────╯           │
│              │     │                │  ← Neck/body lines
│             ╭╯     ╰╮               │
│            ╯         ╰              │  ← Small paw curves
│                                     │
└─────────────────────────────────────┘
```

**Style Properties:**
- Monoline strokes (~3-4px weight at 1024px)
- Rounded caps and joins
- Black stroke (#333 or similar) on white background
- Centered composition
- Friendly, approachable expression
- Lucide-react / app icon aesthetic

**Note on Paws:** The base image has small paw curves at the bottom. This is acceptable as the canonical form. The "no limbs" constraint means:
- Do NOT add arms/hands that could hold props
- Do NOT add full body/legs
- Accessories attach to head/neck/collar area only

---

## Technical Architecture

### File Structure

```
LangflowSaaS/
├── assets/
│   └── avatars/
│       └── dog_base.png              # Canonical base (USER MUST SAVE HERE)
│
├── src/backend/
│   ├── static/
│   │   └── avatars/                  # Generated images (gitignored)
│   │       ├── .gitkeep
│   │       └── dog_v1_support_1024x1024_transparent.png
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py           # Add avatars router
│   │   │   └── avatars.py            # NEW: Avatar endpoints
│   │   │
│   │   └── services/
│   │       └── dog_avatar_service.py # NEW: GPT Image Edit service
│   │
│   └── app/main.py                   # Mount static files
```

### API Endpoint

```
POST /api/v1/avatars/dog

Request:
{
  "job": "support",           # Required: job type from mapping
  "size": "1024x1024",        # Optional: default 1024x1024
  "background": "transparent", # Optional: default transparent
  "regenerate": false         # Optional: bypass cache
}

Response:
{
  "job": "support",
  "size": "1024x1024",
  "background": "transparent",
  "image_url": "/static/avatars/dog_v1_support_1024x1024_transparent.png",
  "cached": false,
  "prompt_version": "v1",
  "model": "gpt-image-1",
  "needs_review": false
}
```

---

## Prompt Engineering

### Global Prefix (Always Applied)

```python
PROMPT_PREFIX = """Edit the input image.
Preserve the exact same dog head shape, ear shape, face proportions, and stroke weight from the input.
Minimal monoline icon, rounded caps and joins, outline-only.
No hands, no arms, no paws, no limbs, no props held by the dog.
No fills, no shading, no gradients, no shadows, no 3D.
Add ONLY the accessory described below; do not add any other objects.
Centered composition, friendly, clean, modern app icon.
Transparent background."""
```

### Retry Prefix (After First Failure)

```python
RETRY_ADDITION = """
CRITICAL: Do NOT add any new body parts. Keep ONLY the existing head, ears, neck, and upper body from the input.
ABSOLUTELY NO additional limbs, arms, hands, or paws beyond what exists in the input image."""
```

### Job → Accessory Mapping

| Job | Accessory Description |
|-----|----------------------|
| support | tiny headset with mic |
| developer | simple square glasses |
| data | small abstract node/sparkle near head (minimal) |
| manager | minimal flat cap |
| sales | small tie |
| security | small shield badge on collar |
| designer | small beret |
| product | tiny sticky note on ear (outline only) |
| marketing | small megaphone icon floating near head (outline only) |
| finance | tiny coin icon near collar (outline only) |
| legal | small scales-of-justice icon near collar (outline only) |
| hr | small heart badge on collar (outline only) |
| ops | tiny gear icon near head (outline only) |
| qa | tiny checkmark badge on collar |
| research | tiny monocle (no hand) |
| doctor | tiny stethoscope draped around neck (no hands) |
| teacher | small graduation cap |
| pilot | simple aviator cap with goggles on top |
| chef | small chef hat (toque) |
| artist | small paintbrush behind ear (no hand holding it) |
| default | (no accessory - base dog only) |

---

## OpenAI API Integration

### Endpoint

```
POST https://api.openai.com/v1/images/edits
Content-Type: multipart/form-data
```

### Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| model | gpt-image-1 | Required for high-quality edits |
| image | dog_base.png | Multipart file upload |
| prompt | (constructed) | See prompt engineering section |
| size | 1024x1024 | Also supports 1536x1024, 1024x1536 |
| n | 1 | Single image per request |
| response_format | b64_json | Returns base64, not URL |

### Response Format

```json
{
  "created": 1704567890,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

### Parameters to Test

These parameters may or may not be supported - will test during implementation:
- `input_fidelity: "high"` - Preserve input features
- `background: "transparent"` - Transparent output
- `output_format: "png"` - PNG format

If not supported, we'll rely on the prompt to achieve these effects.

---

## Caching Strategy

### Cache Key Format

```
dog_v{PROMPT_VERSION}_{job}_{size}_{background}.png

Examples:
- dog_v1_support_1024x1024_transparent.png
- dog_v1_developer_1024x1024_transparent.png
- dog_v1_default_1024x1024_transparent.png
```

### Cache Behavior

1. **Cache Hit**: File exists → return URL immediately
2. **Cache Miss**: Generate → validate → save → return URL
3. **Regenerate**: Bypass cache check → generate new → overwrite → return URL

### Prompt Versioning

When prompt template changes significantly:
1. Increment `PROMPT_VERSION` (v1 → v2)
2. Old cached images remain (won't be served for new requests)
3. New requests generate fresh images with new version
4. Optionally clean up old version files

---

## Validation Pipeline

### 1. Transparency Check

```python
def validate_transparency(image_bytes: bytes) -> bool:
    """Check if PNG has alpha channel with actual transparency."""
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGBA":
        return False
    # Check that some pixels are actually transparent
    alpha = img.getchannel("A")
    return alpha.getextrema()[0] < 255  # Min alpha < 255 means transparency exists
```

### 2. Style Check (Basic)

```python
def validate_style(image_bytes: bytes) -> bool:
    """Basic heuristic: image should be mostly stroke (dark) and background (light/transparent)."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    pixels = list(img.getdata())

    # Count pixel types
    transparent = sum(1 for r, g, b, a in pixels if a < 128)
    dark = sum(1 for r, g, b, a in pixels if a >= 128 and r < 100 and g < 100 and b < 100)
    light = sum(1 for r, g, b, a in pixels if a >= 128 and r > 200 and g > 200 and b > 200)

    total = len(pixels)
    # Good monoline icon: mostly transparent/light background with some dark strokes
    return (transparent + light) / total > 0.85
```

### 3. Retry Logic

```python
async def generate_with_retry(job: str, ...) -> tuple[bytes, bool]:
    """Generate avatar, retry once if validation fails."""

    # First attempt
    prompt = build_prompt(job, retry=False)
    image_bytes = await call_openai_edit(prompt)

    if validate_transparency(image_bytes) and validate_style(image_bytes):
        return image_bytes, False  # (data, needs_review=False)

    # Retry with stronger prompt
    prompt = build_prompt(job, retry=True)
    image_bytes = await call_openai_edit(prompt)

    if validate_transparency(image_bytes) and validate_style(image_bytes):
        return image_bytes, False

    # Still failing - flag for review but return anyway
    return image_bytes, True  # (data, needs_review=True)
```

---

## Error Handling

| Error | Response | Action |
|-------|----------|--------|
| Base image not found | 500 | Log error, return friendly message |
| Invalid job type | 400 | Return list of valid jobs |
| OpenAI API error | 502 | Log full error, return friendly message |
| Rate limited | 429 | Return retry-after header |
| Validation failed twice | 200 | Return image with `needs_review: true` |

---

## Cost Analysis

| Operation | Cost |
|-----------|------|
| gpt-image-1 edit (1024x1024) | ~$0.04-0.08 |
| Pre-generate all 21 jobs | ~$0.84-1.68 |
| Average user (2 agents) | $0 (cached) |
| Regeneration request | ~$0.04-0.08 |

**Monthly estimate (100 users):**
- Most requests hit cache: ~$1-5/month
- With moderate regenerations: ~$10-20/month

---

## Implementation Checklist

### Phase 1: Core Service
- [ ] Create `dog_avatar_service.py`
- [ ] Implement job→accessory mapping
- [ ] Implement prompt builder
- [ ] Implement OpenAI API call
- [ ] Implement base64 decode and save

### Phase 2: API Endpoint
- [ ] Create `avatars.py` router
- [ ] Add POST /api/v1/avatars/dog endpoint
- [ ] Register router in main.py
- [ ] Configure static file serving

### Phase 3: Caching
- [ ] Implement cache key generation
- [ ] Implement file-based cache check
- [ ] Implement regenerate parameter

### Phase 4: Validation
- [ ] Implement transparency check
- [ ] Implement style check
- [ ] Implement retry logic
- [ ] Add needs_review flag

### Phase 5: Testing
- [ ] Test with "support" job
- [ ] Test with "developer" job
- [ ] Test with "default" (no accessory)
- [ ] Test cache hit
- [ ] Test regenerate
- [ ] Generate all 21 variants

---

## User Action Required

**Before implementation can be tested:**

1. Save the base dog image to: `assets/avatars/dog_base.png`
2. Ensure it's a PNG file (not JPEG or other format)
3. Recommended: 512x512 or 1024x1024 resolution

The implementation will fail gracefully if the base image is not found, with a clear error message.
