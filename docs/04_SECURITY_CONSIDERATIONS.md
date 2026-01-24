# Security Considerations for Production

**Last Updated:** 2026-01-22
**Status:** Documentation for future implementation

This document captures security considerations identified during the multi-tenancy architecture review. These items should be addressed before public SaaS launch.

---

## 1. API Key Exposure

### Current State

API keys flow through the system as follows:

```
User enters API key in Settings UI
        ↓
Backend encrypts with Fernet → user_settings.api_keys_encrypted
        ↓ (encrypted at rest ✅)

When workflow is created/updated:
        ↓
Backend decrypts key → injects into flow_data as PLAINTEXT
        ↓
Stored in:
  1. workflow.flow_data (our DB) ← PLAINTEXT ❌
  2. Langflow's database ← PLAINTEXT ❌
  3. API responses to frontend ← PLAINTEXT ❌
  4. Visible in Langflow canvas UI ← PLAINTEXT ❌
```

### Risk Assessment

| Exposure Point | Risk Level | Notes |
|----------------|------------|-------|
| `user_settings.api_keys_encrypted` | Low | Fernet encrypted |
| `workflow.flow_data` (our DB) | Medium | Plaintext in JSON column |
| Langflow's database | Medium | Plaintext, shared DB |
| API response (`WorkflowResponse`) | Medium | Returned to frontend |
| Langflow canvas UI | Low | User sees their own key |

### Recommended Fixes

1. **Sanitize API responses** - Strip/mask API keys from `flow_data` before returning to frontend
   ```python
   def sanitize_flow_data(flow_data: dict) -> dict:
       """Remove/mask sensitive values before returning to frontend."""
       sanitized = copy.deepcopy(flow_data)
       for node in sanitized.get("data", {}).get("nodes", []):
           template = node.get("data", {}).get("node", {}).get("template", {})
           for field_name, field_data in template.items():
               if "api_key" in field_name.lower() or field_data.get("password"):
                   field_data["value"] = "••••••••" if field_data.get("value") else ""
       return sanitized
   ```

2. **Use environment variables in flows** - Instead of embedding keys, use Langflow's `{OPENAI_API_KEY}` syntax to reference server-side env vars

3. **Database encryption** - Enable encryption at rest for the `flow_data` JSON column

4. **Consider Langflow Global Variables** - Store keys in Langflow's global variable store with `load_from_db: true`

---

## 2. Langflow Port Exposure

### Current State (docker-compose.dev.yml)

```yaml
langflow:
  ports:
    - "7860:7860"  # Exposed to ALL interfaces

nginx:
  ports:
    - "7861:7861"  # Exposed to ALL interfaces
```

### Risk

If deployed to a server with these settings, anyone who knows a `langflow_flow_id` could:
- Access the flow directly via `http://server:7860/flow/{id}`
- Bypass our authentication entirely
- See API keys embedded in flows

### Recommended Fixes

**Option A: Localhost binding (simple)**
```yaml
langflow:
  ports:
    - "127.0.0.1:7860:7860"  # Localhost only

nginx:
  ports:
    - "127.0.0.1:7861:7861"  # Localhost only
```

**Option B: No port exposure (more secure)**
```yaml
langflow:
  # No ports exposed - only accessible via Docker network
  expose:
    - "7860"
```

Then proxy through your authenticated backend only.

**Option C: Firewall rules**
- Block ports 7860/7861 at infrastructure level
- Only allow access from your backend service

---

## 3. Workflow/Flow ID Access Control

### Current State

- Our backend validates `user_id` on all workflow queries ✅
- Langflow has NO user isolation ❌
- Flows in Langflow are accessible by ID alone

### Risk

If Langflow is exposed (see above), flow IDs could be enumerated or guessed.

### Recommended Fixes

1. **Never expose Langflow publicly** (see Section 2)

2. **Add authentication to canvas iframe**
   ```python
   # Generate short-lived token for canvas access
   canvas_token = generate_temp_token(user_id, flow_id, expires_in=3600)
   canvas_url = f"{langflow_url}/flow/{flow_id}?auth={canvas_token}"
   ```

3. **Validate tokens in nginx proxy**
   - nginx can validate the token before proxying to Langflow
   - Reject requests without valid tokens

---

## 4. Multi-Tenancy Limitations

### What IS Isolated (Safe for SaaS)

| Resource | Isolation Method |
|----------|------------------|
| Workflows | `user_id` column + query filter |
| Conversations | `user_id` column + query filter |
| Messages | Via conversation ownership |
| Projects | `user_id` column + query filter |
| API Keys | Per-user encrypted storage |
| Composio Connections | `entity_id = user.id` |
| Knowledge/RAG | Per-user collections |

### What is NOT Isolated (Limitations)

| Resource | Issue | Mitigation |
|----------|-------|------------|
| Custom Components | Shared Python files on disk | Platform-provided only, no user uploads |
| Langflow UI | No native user isolation | Hide via overlay, don't expose ports |
| Published Agents | Requires Langflow restart | Not offered in SaaS tier |

### Architectural Decision

For SaaS MVP, we accept these limitations:
- Users cannot create custom components (platform-provided only)
- Users cannot publish agents to the sidebar
- Full customization available in future "Enterprise" tier with dedicated containers

---

## 5. Composio OAuth Security

### Current State (Secure)

```
User connects via Connections page
        ↓
entity_id = str(user.id)  ← User's UUID
        ↓
OAuth token stored in Composio under that entity_id
        ↓
When workflow runs, tweaks inject entity_id = user.id
        ↓
Composio looks up connection by entity_id → finds only that user's auth
```

### Assessment

✅ **Properly isolated** - Each user's Composio connections are tied to their UUID
✅ **Persistent** - Tokens stored in Composio's cloud, survive sessions
✅ **Cannot access others** - entity_id mismatch prevents cross-user access

No changes needed for Composio integration.

---

## 6. Token/Usage Tracking

### Current State

Token usage is **estimated**, not actual:
```python
# workflow_service.py
estimated_tokens = (len(message) + len(response_text)) // 4
```

### Limitation

Langflow doesn't expose actual token counts from the underlying LLM.

### Options for Improvement

1. **Accept estimation** - Good enough for usage tiers (Free/Pro/Enterprise)
2. **Use tiktoken** - More accurate estimation (~90%)
3. **LLM provider dashboards** - If using platform API keys, track via OpenAI/Anthropic
4. **Langflow monitoring** - Investigate if Langflow has built-in usage tracking

---

## Implementation Priority

### Before Public Launch (Critical)

- [ ] Localhost-only Langflow ports in production docker-compose
- [ ] Sanitize `flow_data` in API responses (mask API keys)
- [ ] Document that Langflow must never be publicly exposed

### Post-Launch (Recommended)

- [ ] Database encryption for `flow_data` column
- [ ] Authentication tokens for canvas iframe access
- [ ] Audit logging for sensitive operations
- [ ] Rate limiting on Langflow proxy
- [ ] Investigate env var approach for API keys

### Future (Enterprise Tier)

- [ ] Dedicated Langflow container per organization
- [ ] Custom component support with isolated storage
- [ ] Full schema-based or container-based multi-tenancy

---

## References

- [Langflow Security Docs](https://docs.langflow.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- Multi-tenancy patterns researched:
  - Schema-based: [monkut/langflow-infra](https://github.com/monkut/langflow-infra)
  - RLS-based: [taylorelley/ai-tool-server](https://github.com/taylorelley/ai-tool-server)
