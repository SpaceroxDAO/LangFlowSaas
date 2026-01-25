# Webhooks

Webhooks allow you to receive real-time notifications when events occur in Teach Charlie AI. Configure endpoints to receive HTTP POST requests with event data.

## Overview

When an event occurs (like a new conversation or subscription change), we'll send an HTTP POST request to your configured webhook URL with details about the event.

## Setting Up Webhooks

### Via Dashboard

1. Go to **Dashboard → Settings → Webhooks**
2. Click **"Add Webhook"**
3. Enter your endpoint URL
4. Select events to subscribe to
5. Click **"Create"**

### Via API

```http
POST /api/v1/webhooks
```

```json
{
  "url": "https://yourapp.com/webhooks/teachcharlie",
  "events": ["conversation.created", "message.created"],
  "secret": "your_signing_secret"
}
```

## Event Types

### Conversation Events

| Event | Description |
|-------|-------------|
| `conversation.created` | New conversation started |
| `conversation.completed` | Conversation marked complete |
| `conversation.archived` | Conversation archived |

### Message Events

| Event | Description |
|-------|-------------|
| `message.created` | New message in conversation |
| `message.tool_used` | Agent used a tool |

### Agent Events

| Event | Description |
|-------|-------------|
| `agent.created` | New agent created |
| `agent.updated` | Agent configuration changed |
| `agent.deleted` | Agent deleted |
| `agent.published` | Agent published as component |

### Billing Events

| Event | Description |
|-------|-------------|
| `subscription.created` | New subscription started |
| `subscription.updated` | Plan changed |
| `subscription.canceled` | Subscription canceled |
| `invoice.paid` | Invoice payment succeeded |
| `invoice.failed` | Invoice payment failed |

### Embed Events

| Event | Description |
|-------|-------------|
| `embed.session_started` | Widget chat session began |
| `embed.session_ended` | Widget chat session ended |

## Webhook Payload

All webhooks follow this structure:

```json
{
  "id": "evt_abc123",
  "type": "conversation.created",
  "created_at": "2024-01-15T10:00:00Z",
  "data": {
    // Event-specific data
  }
}
```

### Example: conversation.created

```json
{
  "id": "evt_abc123",
  "type": "conversation.created",
  "created_at": "2024-01-15T10:00:00Z",
  "data": {
    "conversation_id": "conv_xyz789",
    "agent_id": "agent_456",
    "source": "playground",
    "metadata": {}
  }
}
```

### Example: message.created

```json
{
  "id": "evt_def456",
  "type": "message.created",
  "created_at": "2024-01-15T10:01:00Z",
  "data": {
    "message_id": "msg_123",
    "conversation_id": "conv_xyz789",
    "content": "Hello, I need help with...",
    "role": "user",
    "token_count": 15
  }
}
```

### Example: subscription.updated

```json
{
  "id": "evt_ghi789",
  "type": "subscription.updated",
  "created_at": "2024-01-15T10:00:00Z",
  "data": {
    "subscription_id": "sub_abc",
    "previous_plan": "free",
    "new_plan": "pro",
    "effective_date": "2024-01-15T00:00:00Z"
  }
}
```

## Verifying Webhooks

Always verify webhook signatures to ensure requests come from Teach Charlie AI.

### Signature Verification

Webhooks include a signature header:

```http
X-TeachCharlie-Signature: t=1705315200,v1=abc123...
```

The signature format is:
- `t` - Unix timestamp of when the webhook was sent
- `v1` - HMAC-SHA256 signature of `{timestamp}.{payload}`

### Verification Code

**Node.js:**

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).slice(2);
  const sig = parts.find(p => p.startsWith('v1=')).slice(3);

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  );
}
```

**Python:**

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    parts = dict(p.split('=') for p in signature.split(','))
    timestamp = parts['t']
    sig = parts['v1']

    expected = hmac.new(
        secret.encode(),
        f"{timestamp}.{payload.decode()}".encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(sig, expected)
```

### Timestamp Validation

Reject webhooks with timestamps older than 5 minutes to prevent replay attacks:

```javascript
const MAX_AGE = 5 * 60; // 5 minutes
const webhookAge = Math.floor(Date.now() / 1000) - parseInt(timestamp);

if (webhookAge > MAX_AGE) {
  throw new Error('Webhook too old');
}
```

## Responding to Webhooks

### Success Response

Return a 2xx status code within 30 seconds:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"received": true}
```

### Retry Behavior

If your endpoint fails or times out, we'll retry:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |
| 6 | 6 hours |

After 6 failed attempts, the webhook is marked as failed.

### Viewing Failed Webhooks

Check webhook delivery status in the dashboard:

1. Go to **Settings → Webhooks**
2. Click on your webhook
3. View **"Recent Deliveries"**
4. See success/failure status and retry history

## Best Practices

### 1. Respond Quickly

Process webhooks asynchronously:

```javascript
app.post('/webhooks', (req, res) => {
  // Immediately respond
  res.status(200).json({ received: true });

  // Process asynchronously
  processWebhookAsync(req.body);
});
```

### 2. Handle Duplicates

Webhooks may be delivered more than once. Use idempotency:

```javascript
async function handleWebhook(event) {
  // Check if already processed
  const existing = await db.webhookEvents.findOne({
    where: { eventId: event.id }
  });

  if (existing) {
    return; // Already processed
  }

  // Process and record
  await processEvent(event);
  await db.webhookEvents.create({ eventId: event.id });
}
```

### 3. Verify Signatures

Always verify signatures in production. Never skip this step.

### 4. Use HTTPS

Only configure HTTPS endpoints. We won't send webhooks to HTTP URLs.

### 5. Monitor Failures

Set up alerts for webhook failures so you can investigate promptly.

## Testing Webhooks

### Test Mode

In development, use a tunnel service like ngrok:

```bash
ngrok http 3000
# Use the https URL for your webhook
```

### Manual Testing

Trigger a test webhook via the dashboard:

1. Go to **Settings → Webhooks**
2. Click **"Send Test"**
3. Select an event type
4. View the response

### Local Development

Use the webhook payload examples above to simulate events locally.

## Webhook Security

### IP Allowlisting

Webhook requests come from these IP ranges:

```
# Add to your firewall allowlist
34.102.x.x/16
35.186.x.x/16
```

> IP ranges subject to change. We recommend signature verification over IP filtering.

### Secret Rotation

Rotate your webhook secret periodically:

1. Generate a new secret
2. Update your webhook to accept both old and new
3. Update the secret in Teach Charlie AI
4. Remove the old secret from your code

## Troubleshooting

### Not Receiving Webhooks

1. Check endpoint URL is correct
2. Verify endpoint is publicly accessible
3. Check for firewall blocking
4. Look for errors in the delivery log

### Signature Verification Failing

1. Ensure you're using the raw request body (not parsed JSON)
2. Check the secret matches what's configured
3. Verify timestamp is being parsed correctly

### Duplicate Events

1. Implement idempotency as described above
2. Check your processing logic isn't slow (causing retries)

---

Need help? Check the [API Reference](/resources/developers/api-reference) or contact support.
