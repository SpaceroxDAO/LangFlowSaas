# Avatar Generation Strategy

**Last Updated**: 2026-01-07
**Status**: Testing Phase

## Current Implementation

### Location
- Backend service: `src/backend/app/services/avatar_service.py`
- API endpoint: `src/backend/app/api/agent_components.py` (lines 343-420)
- Frontend: `src/frontend/src/pages/CreateAgentPage.tsx` (lines 171-187)

### Current Prompt
```python
AVATAR_PROMPT_TEMPLATE = """Create a dog {description} icon thats black and white"""
```

### Current Settings
- Model: DALL-E 3
- Size: 1024x1024
- Quality: HD
- Style: Vivid

## Problem Statement

The current implementation produces **inconsistent** avatar styles because:

1. **Variable input length**: User personas range from short ("Charlie") to long ("A friendly Golden Retriever who is an expert in dog treats, bones, and finding the best parks")

2. **DALL-E 3 interpretation freedom**: The model rewrites prompts and takes creative liberty, producing:
   - Different art styles (realistic, cartoon, vector, sketch)
   - Different compositions (full body, portrait, icon, badge)
   - Different detail levels

3. **No style anchoring**: The prompt doesn't specify:
   - Exact art style
   - Composition constraints
   - Background treatment
   - Level of detail

## Goal

Create avatars that are:
- **Consistent**: Same visual style regardless of input
- **On-brand**: Match the playful, educational "dog trainer" theme
- **Icon-friendly**: Work well at small sizes (64x64 to 256x256)
- **Distinctive**: Different inputs produce recognizably different dogs

## Testing Approach

### Test Script
Run the avatar testing script:
```bash
cd LangflowSaaS
python scripts/test_avatar_prompts.py
```

### Prompt Templates Being Tested

| Version | Strategy | Template |
|---------|----------|----------|
| v1 | Current baseline | `Create a dog {description} icon thats black and white` |
| v5 | Ignore description | `Black and white circular badge icon featuring a simple dog face...` |
| v7 | Standard with personality hint | `Simple black and white icon of a happy cartoon dog face...` |
| v9 | Emoji-style | `Dog emoji style icon, simple black outlines...` |

### Key Variables to Test
1. **Input type**: Short name vs. full description
2. **Quality setting**: HD vs. Standard
3. **Style setting**: Vivid vs. Natural
4. **Prompt specificity**: Open-ended vs. heavily constrained

## Recommended Strategies

### Strategy A: Ignore User Input (Most Consistent)
Generate the same style of dog icon every time, ignoring the description.
- **Pros**: Perfect consistency
- **Cons**: All avatars look similar, less personalization

### Strategy B: Style-Locked with Color Variation
Use consistent style but vary a single attribute (e.g., color palette).
```python
AVATAR_PROMPT = """
Simple black and white line art dog mascot head icon.
Style: flat vector illustration, minimal lines, friendly expression.
Variation hint: {description}
"""
```

### Strategy C: Controlled Randomness
Use a small set of pre-defined dog "types" and randomly assign.
```python
DOG_TYPES = ["happy retriever", "smart border collie", "friendly labrador", ...]
# Map description keywords to dog type, or random selection
```

### Strategy D: Two-Step Generation
1. Use GPT-4 to extract key visual attributes from description
2. Build a highly constrained prompt from those attributes

## Implementation Recommendations

### Short-term (MVP)
1. Test prompt templates using `scripts/test_avatar_prompts.py`
2. Pick the best-performing template
3. Update `avatar_service.py` with winning prompt

### Medium-term
1. Consider switching to **DALL-E 2** for more predictable results
2. Or use a **fine-tuned model** on your specific icon style
3. Implement **local caching** to avoid regenerating similar avatars

### Long-term
1. Train a custom model on brand-consistent dog icons
2. Or use a **deterministic icon generator** (like DiceBear avatars)
3. Allow users to pick from a gallery instead of generating

## Cost Considerations

| Setting | Cost per Image |
|---------|----------------|
| DALL-E 3, HD, 1024x1024 | $0.040 |
| DALL-E 3, Standard, 1024x1024 | $0.040 |
| DALL-E 2, 1024x1024 | $0.020 |
| DALL-E 2, 512x512 | $0.018 |

For an MVP with ~100 users creating 2 agents each: ~$8-16 in avatar generation costs.

## Alternative: Pre-made Avatar Gallery

Instead of generating, consider:
1. Create 20-30 high-quality dog avatars manually
2. Let users pick from gallery
3. Use description to **suggest** matching avatars
4. Zero generation cost, perfect consistency

## Next Steps

1. [ ] Run focused test with `scripts/test_avatar_prompts.py` (option 1)
2. [ ] Review generated images for consistency
3. [ ] Pick winning prompt template
4. [ ] Update `avatar_service.py`
5. [ ] Test in UI with real user flows
