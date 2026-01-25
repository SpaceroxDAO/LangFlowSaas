# Authentication

Teach Charlie AI uses [Clerk](https://clerk.com) for authentication. This guide covers how auth works and how to integrate with our API.

## Overview

All API requests (except public routes) require authentication via JWT tokens. Clerk handles:

- User signup and login
- Password reset and verification
- JWT token generation and validation
- Session management

## Authentication Flow

```
1. User signs in via Clerk (frontend)
2. Clerk returns JWT token
3. Frontend stores token in memory
4. API requests include token in Authorization header
5. Backend validates JWT against Clerk's JWKS
6. Request is processed with user context
```

## Frontend Authentication

### Setting Up Clerk

The frontend uses Clerk's React SDK:

```tsx
// src/App.tsx
import { ClerkProvider } from '@clerk/clerk-react';

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      {/* Your app */}
    </ClerkProvider>
  );
}
```

### Getting the Token

```tsx
import { useAuth } from '@clerk/clerk-react';

function ApiComponent() {
  const { getToken } = useAuth();

  const fetchData = async () => {
    const token = await getToken();

    const response = await fetch('/api/v1/agent-components', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  };
}
```

### Protected Routes

Use Clerk's `SignedIn` and `SignedOut` components:

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

## Backend Authentication

### JWT Validation

The backend validates JWTs using Clerk's JWKS (JSON Web Key Set):

```python
# Middleware validates token on every request
from app.middleware.auth import get_current_user

@router.get("/agents")
async def list_agents(user: User = Depends(get_current_user)):
    # user is automatically populated from JWT
    return await agent_service.list_for_user(user.id)
```

### Environment Variables

Required for JWT validation:

```env
CLERK_SECRET_KEY=sk_test_...
CLERK_JWKS_URL=https://your-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_ISSUER=https://your-domain.clerk.accounts.dev
```

### User Model

Users are synced from Clerk to our database:

```python
class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True)
    clerk_user_id = Column(String, unique=True, nullable=False)
    email = Column(String, nullable=False)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## API Authentication

### Required Headers

All protected endpoints require:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Making Authenticated Requests

**Using fetch:**

```javascript
const token = await clerk.session.getToken();

const response = await fetch('https://api.teachcharlie.ai/api/v1/agent-components', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**Using axios:**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.teachcharlie.ai'
});

api.interceptors.request.use(async (config) => {
  const token = await clerk.session.getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Error Responses

Authentication errors return appropriate HTTP status codes:

| Status | Meaning | Response |
|--------|---------|----------|
| 401 | No token or invalid token | `{"detail": "Not authenticated"}` |
| 403 | Token valid but insufficient permissions | `{"detail": "Not authorized"}` |

## Public Endpoints

Some endpoints don't require authentication:

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Health check |
| `POST /api/v1/embed/{token}/chat` | Embedded widget chat |
| `GET /api/v1/embed/{token}/config` | Widget configuration |
| `POST /webhooks/*` | Webhook receivers |

## Dev Mode

For local development without Clerk:

```env
AUTH_DEV_MODE=true
DEV_USER_ID=dev-user-123
DEV_USER_EMAIL=dev@example.com
```

When `AUTH_DEV_MODE=true`, the backend skips JWT validation and uses the configured dev user.

> **Warning:** Never enable dev mode in production!

## Webhook Authentication

Clerk sends webhooks for user events. Verify webhook signatures:

```python
from svix.webhooks import Webhook

@router.post("/webhooks/clerk")
async def clerk_webhook(request: Request):
    payload = await request.body()
    headers = dict(request.headers)

    wh = Webhook(os.environ["CLERK_WEBHOOK_SECRET"])
    event = wh.verify(payload, headers)

    # Process event
    if event["type"] == "user.created":
        await create_user(event["data"])
```

## Token Expiration

Clerk tokens have a default expiration of 60 seconds. The frontend SDK handles refresh automatically.

For server-to-server communication, use long-lived API keys (see below).

## API Keys (Coming Soon)

For automated integrations, API keys provide an alternative to JWT tokens:

```http
X-API-Key: tc_live_...
```

API keys will support:
- Read/write scopes
- Rate limiting
- Revocation
- Usage tracking

## Security Best Practices

### Frontend

1. **Never store tokens in localStorage** - Use Clerk's built-in session management
2. **Use HTTPS** - Always in production
3. **Implement CSRF protection** - Clerk handles this automatically

### Backend

1. **Validate on every request** - Don't cache auth decisions
2. **Use user_id for isolation** - Always filter queries by user
3. **Log auth failures** - For security monitoring
4. **Rotate secrets** - Change keys periodically

### Common Pitfalls

**Token in URL parameters:**
```
❌ GET /api/agents?token=xxx
✅ GET /api/agents (token in header)
```

**Trusting client-sent user IDs:**
```python
❌ user_id = request.json.get("user_id")
✅ user_id = current_user.id  # From validated JWT
```

## Troubleshooting

### "Not authenticated" Error

**Causes:**
1. Token expired - Frontend should refresh automatically
2. Wrong JWKS URL - Check environment variables
3. Clock skew - Server time differs from Clerk

**Debug:**
```bash
# Decode JWT to inspect claims (jwt.io)
# Check token expiration (exp claim)
# Verify issuer matches CLERK_ISSUER
```

### "Not authorized" Error

**Causes:**
1. User doesn't own the resource
2. Resource belongs to different project
3. Feature requires higher plan

**Debug:**
```python
# Check resource ownership
print(f"User: {current_user.id}")
print(f"Resource owner: {resource.user_id}")
```

### Dev Mode Not Working

1. Ensure `AUTH_DEV_MODE=true` in `.env`
2. Restart the backend server
3. Check DEV_USER_ID and DEV_USER_EMAIL are set

---

Next: [API Reference](/resources/developers/api-reference) for all available endpoints.
