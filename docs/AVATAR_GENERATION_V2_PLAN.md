# Avatar Generation V2: GPT Image Edit Approach

**Created**: 2026-01-07
**Status**: Planning
**Objective**: Generate consistent job-based avatar variants from a canonical base dog image

---

## Executive Summary

Replace the current DALL-E 3 text-to-image approach with OpenAI's **Image Edit API** using a canonical base dog image. This ensures all avatars maintain the same dog identity while varying only the job-specific accessory.

### Key Changes from V1
| Aspect | V1 (Current) | V2 (Proposed) |
|--------|--------------|---------------|
| API | `/v1/images/generations` (DALL-E 3) | `/v1/images/edits` (GPT Image) |
| Model | `dall-e-3` | `gpt-image-1` |
| Input | Text prompt only | Base image + prompt |
| Consistency | Variable (each gen is unique) | High (same base preserved) |
| Output | Temporary URL (~1hr expiry) | Base64 → stored permanently |
| Background | White (inconsistent) | Transparent PNG |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                  │
│  CreateAgentPage.tsx / EditAgentPage.tsx                        │
│         │                                                        │
│         │ POST /api/v1/avatars/dog                              │
│         │ { "job": "support", "size": "1024x1024" }             │
│         ▼                                                        │
├─────────────────────────────────────────────────────────────────┤
│                     FastAPI Backend                              │
│                                                                  │
│  ┌─────────────────┐    ┌──────────────────────┐                │
│  │ avatars.py      │───▶│ dog_avatar_service   │                │
│  │ (API endpoint)  │    │                      │                │
│  └─────────────────┘    │ - Load base image    │                │
│                         │ - Build prompt       │                │
│                         │ - Call OpenAI Edit   │                │
│                         │ - Validate output    │                │
│                         │ - Cache & store      │                │
│                         └──────────┬───────────┘                │
│                                    │                             │
│                                    ▼                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Storage Layer                         │    │
│  │  MVP: Local filesystem (static/avatars/)                │    │
│  │  Prod: S3/R2/GCS bucket                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │     OpenAI Images Edit API     │
              │  POST /v1/images/edits         │
              │  - model: gpt-image-1          │
              │  - input_fidelity: high        │
              │  - background: transparent     │
              └───────────────────────────────┘
```

---

## File Structure

```
LangflowSaaS/
├── assets/
│   └── avatars/
│       ├── dog_base.png              # Canonical base image (512x512 or 1024x1024)
│       └── generated/                # Cached generated variants (gitignored)
│           ├── support_1024x1024_v1.png
│           ├── developer_1024x1024_v1.png
│           └── ...
│
├── src/backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── avatars.py            # NEW: Avatar generation endpoint
│   │   │   └── __init__.py           # Register new router
│   │   │
│   │   ├── services/
│   │   │   ├── avatar_service.py     # KEEP: Legacy DALL-E 3 (deprecated)
│   │   │   └── dog_avatar_service.py # NEW: GPT Image Edit service
│   │   │
│   │   └── config.py                 # Add avatar settings
│   │
│   └── static/
│       └── avatars/                  # Served via /static/avatars/
│
└── docs/
    └── AVATAR_GENERATION_V2_PLAN.md  # This file
```

---

## Implementation Details

### 1. Job → Accessory Mapping (20 jobs)

```python
JOB_ACCESSORIES = {
    # Core business roles
    "support": "tiny headset with mic",
    "developer": "simple square glasses",
    "data": "small abstract node/sparkle near head (minimal)",
    "manager": "minimal flat cap",
    "sales": "small tie",
    "security": "small shield badge on collar",
    "designer": "small beret",
    "product": "tiny sticky note on ear (outline only)",
    "marketing": "small megaphone icon floating near head (outline only)",
    "finance": "tiny coin icon near collar (outline only)",
    "legal": "small scales-of-justice icon near collar (outline only)",
    "hr": "small heart badge on collar (outline only)",
    "ops": "tiny gear icon near head (outline only)",
    "qa": "tiny checkmark badge on collar",
    "research": "tiny monocle (no hand)",

    # Professional services
    "doctor": "tiny stethoscope draped around neck (no hands)",
    "teacher": "small graduation cap",
    "pilot": "simple aviator cap with goggles on top",
    "chef": "small chef hat (toque)",
    "artist": "small paintbrush behind ear (no hand holding it)",

    # Fallback
    "default": "",  # No accessory, just the base dog
}
```

### 2. Prompt Template

```python
PROMPT_PREFIX = """Edit the input image.
Preserve the exact same dog head shape, ear shape, face proportions, and stroke weight from the input.
Minimal monoline icon, rounded caps and joins, outline-only.
No hands, no arms, no paws, no limbs, no props held by the dog.
No fills, no shading, no gradients, no shadows, no 3D.
Add ONLY the accessory described below; do not add any other objects.
Centered composition, friendly, clean, modern app icon.
Transparent background."""

RETRY_PROMPT_ADDITION = """
ABSOLUTELY NO LIMBS: remove any arms/hands/paws; show head/neck only."""

def build_prompt(job: str, retry: bool = False) -> str:
    accessory = JOB_ACCESSORIES.get(job, JOB_ACCESSORIES["default"])
    prompt = PROMPT_PREFIX
    if retry:
        prompt += RETRY_PROMPT_ADDITION
    if accessory:
        prompt += f"\nAccessory: {accessory}"
    return prompt
```

### 3. API Request Structure

```python
# OpenAI Images Edit API - Multipart Form Data
async def call_image_edit_api(
    base_image_path: Path,
    prompt: str,
    size: str = "1024x1024",
) -> bytes:
    """
    Call OpenAI /v1/images/edits endpoint.
    Returns PNG image bytes (decoded from base64).
    """
    async with httpx.AsyncClient(timeout=120.0) as client:
        with open(base_image_path, "rb") as f:
            files = {"image": ("dog_base.png", f, "image/png")}
            data = {
                "model": "gpt-image-1",
                "prompt": prompt,
                "size": size,
                "n": 1,
                "response_format": "b64_json",  # GPT Image returns base64
            }
            # Note: input_fidelity and background may need to go in data
            # depending on API support

            response = await client.post(
                "https://api.openai.com/v1/images/edits",
                headers={"Authorization": f"Bearer {api_key}"},
                files=files,
                data=data,
            )

    if response.status_code != 200:
        raise ValueError(f"API error: {response.text}")

    result = response.json()
    b64_data = result["data"][0]["b64_json"]
    return base64.b64decode(b64_data)
```

### 4. Caching Strategy

```python
PROMPT_VERSION = "v1"  # Bump when prompt changes

def get_cache_key(job: str, size: str, background: str) -> str:
    """Generate cache key for avatar variant."""
    return f"dog_{PROMPT_VERSION}_{job}_{size}_{background}"

def get_cache_path(cache_key: str) -> Path:
    """Get filesystem path for cached avatar."""
    return GENERATED_DIR / f"{cache_key}.png"

async def get_or_generate_avatar(
    job: str,
    size: str = "1024x1024",
    background: str = "transparent",
    regenerate: bool = False,
) -> tuple[Path, bool]:
    """
    Get cached avatar or generate new one.
    Returns (path, was_cached).
    """
    cache_key = get_cache_key(job, size, background)
    cache_path = get_cache_path(cache_key)

    if cache_path.exists() and not regenerate:
        return cache_path, True

    # Generate new avatar
    prompt = build_prompt(job)
    image_bytes = await call_image_edit_api(BASE_IMAGE_PATH, prompt, size)

    # Validate and potentially retry
    if not validate_avatar(image_bytes):
        prompt = build_prompt(job, retry=True)
        image_bytes = await call_image_edit_api(BASE_IMAGE_PATH, prompt, size)

    # Save to cache
    cache_path.write_bytes(image_bytes)
    return cache_path, False
```

### 5. Validation Functions

```python
from PIL import Image
import io

def validate_transparency(image_bytes: bytes) -> bool:
    """Check if image has transparency (alpha channel)."""
    img = Image.open(io.BytesIO(image_bytes))
    return img.mode == "RGBA" and img.getchannel("A").getextrema()[0] < 255

def validate_monoline_style(image_bytes: bytes) -> bool:
    """
    Basic heuristic: most non-transparent pixels should be dark (stroke).
    Returns True if style looks like monoline outline.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    pixels = list(img.getdata())

    non_transparent = [(r, g, b) for r, g, b, a in pixels if a > 128]
    if not non_transparent:
        return False

    # Check if most visible pixels are near-black (stroke) or near-white (background)
    dark_count = sum(1 for r, g, b in non_transparent if r < 80 and g < 80 and b < 80)
    light_count = sum(1 for r, g, b in non_transparent if r > 200 and g > 200 and b > 200)

    # Monoline should be mostly stroke (dark) with some light areas
    return (dark_count + light_count) / len(non_transparent) > 0.8

def validate_avatar(image_bytes: bytes) -> bool:
    """Run all validations. Returns True if avatar passes."""
    try:
        return validate_transparency(image_bytes) and validate_monoline_style(image_bytes)
    except Exception:
        return False
```

---

## API Endpoint Specification

### POST /api/v1/avatars/dog

**Request Body:**
```json
{
  "job": "support",
  "size": "1024x1024",
  "background": "transparent",
  "regenerate": false
}
```

**Response (Success):**
```json
{
  "job": "support",
  "size": "1024x1024",
  "background": "transparent",
  "image_url": "/static/avatars/dog_v1_support_1024x1024_transparent.png",
  "cached": true,
  "prompt_version": "v1",
  "model": "gpt-image-1",
  "needs_review": false
}
```

**Response (Error):**
```json
{
  "detail": "Failed to generate avatar: API error message"
}
```

---

## Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| `gpt-image-1` not accessible | High | Medium | Test first; fallback to DALL-E 3 with stronger prompt |
| `input_fidelity` param not supported | Medium | Low | Use raw HTTP instead of SDK; test parameter acceptance |
| Base image has paws (violates no-limbs) | Medium | Certain | Crop base image to head/neck only before use |
| API cost higher than DALL-E 3 | Low | Unknown | Aggressive caching; pre-generate common jobs |
| Style drift despite high fidelity | Medium | Medium | Strong prompt; retry logic; manual review flag |
| Organization verification required | High | Medium | Complete verification before implementation |

---

## Implementation Phases

### Phase 0: Validation (Before Coding)
- [ ] Verify `gpt-image-1` API access in OpenAI console
- [ ] Test `/v1/images/edits` endpoint with a simple edit
- [ ] Test `input_fidelity`, `background`, `output_format` parameters
- [ ] Prepare canonical base image (crop to head/neck if needed)

### Phase 1: Core Service (MVP)
- [ ] Create `dog_avatar_service.py` with GPT Image Edit logic
- [ ] Implement job→accessory mapping
- [ ] Implement prompt builder
- [ ] Implement basic file storage
- [ ] Create `POST /api/v1/avatars/dog` endpoint

### Phase 2: Caching & Storage
- [ ] Implement cache key generation
- [ ] Implement file-based caching
- [ ] Add `regenerate` parameter support
- [ ] Serve cached images via `/static/avatars/`

### Phase 3: Validation & Quality Control
- [ ] Implement transparency validation
- [ ] Implement monoline style validation (basic)
- [ ] Implement retry logic with stronger prompt
- [ ] Add `needs_review` flag for failed validations

### Phase 4: Frontend Integration
- [ ] Update `CreateAgentPage.tsx` to call new endpoint
- [ ] Update `EditAgentPage.tsx` to call new endpoint
- [ ] Handle job selection → avatar preview
- [ ] Add regenerate button

### Phase 5: Production Readiness
- [ ] Move storage to S3/R2
- [ ] Add rate limiting
- [ ] Add monitoring/logging
- [ ] Pre-generate all 20 job variants
- [ ] Deprecate V1 avatar service

---

## Testing Checklist

### Manual API Tests (Phase 0)
```bash
# Test 1: Basic edit API access
curl -X POST https://api.openai.com/v1/images/edits \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-1" \
  -F "image=@dog_base.png" \
  -F "prompt=Add a tiny headset with mic" \
  -F "size=1024x1024" \
  -F "response_format=b64_json"

# Test 2: Check if input_fidelity is accepted
# (Same as above but add -F "input_fidelity=high")
```

### Automated Tests (Phase 1+)
- [ ] Unit: `build_prompt()` returns correct format
- [ ] Unit: `get_cache_key()` generates unique keys
- [ ] Integration: Full generation flow works
- [ ] Validation: Generated images pass transparency check
- [ ] E2E: Frontend can request and display avatar

---

## Cost Estimation

| Operation | Estimated Cost | Notes |
|-----------|---------------|-------|
| GPT Image Edit (1024x1024) | ~$0.04-0.08 | Per generation |
| 20 jobs × 1 size pre-generated | ~$0.80-1.60 | One-time cost |
| User regeneration (10/day) | ~$0.40-0.80/day | With caching, most are free |

**Monthly estimate (100 users, 2 agents each):**
- With caching: ~$5-10/month
- Without caching: ~$8-16/month

---

## Open Questions

1. **Base image paws**: The provided base image shows paws. Should we:
   - (A) Crop to head/neck only?
   - (B) Accept as canonical and let the prompt handle it?
   - (C) Create a new base image without paws?

2. **Custom jobs**: What happens if user enters a job not in our mapping?
   - (A) Return base dog with no accessory
   - (B) Use AI to infer an appropriate accessory (risky)
   - (C) Show error and suggest from list

3. **Multiple sizes**: Do we need 512x512 for thumbnails?
   - (A) Generate at 1024x1024 and resize client-side
   - (B) Store multiple sizes per job

4. **Storage backend for MVP**:
   - (A) Local filesystem (simplest)
   - (B) SQLite blob storage
   - (C) Early S3/R2 integration

---

## Next Steps

1. **Immediate**: Test `gpt-image-1` API access
2. **If accessible**: Proceed with Phase 1 implementation
3. **If not accessible**: Complete OpenAI organization verification OR fallback to enhanced DALL-E 3 approach with stronger style locking
