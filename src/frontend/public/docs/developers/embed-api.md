# Embed Widget API

The embed widget allows you to add a Teach Charlie AI chat interface to any website. This document covers the JavaScript API for advanced customization.

## Quick Start

```html
<script>
  window.teachCharlieSettings = {
    agentId: "your-agent-id"
  };
</script>
<script src="https://app.teachcharlie.ai/embed.js" async></script>
```

## Configuration Options

### Full Configuration

```javascript
window.teachCharlieSettings = {
  // Required
  agentId: "your-agent-id",

  // Appearance
  position: "bottom-right",      // "bottom-right" | "bottom-left"
  primaryColor: "#8B5CF6",       // Hex color for buttons/accents
  textColor: "#1F2937",          // Text color
  backgroundColor: "#FFFFFF",    // Chat background
  fontFamily: "Inter, sans-serif",
  borderRadius: 16,              // Border radius in pixels

  // Header
  title: "Chat with us",
  subtitle: "We usually respond instantly",
  avatarUrl: "/path/to/avatar.png",

  // Behavior
  greeting: "Hi! How can I help you today?",
  placeholder: "Type your message...",
  openOnLoad: false,
  hideOnMobile: false,
  soundEnabled: true,

  // Launcher
  showLauncher: true,
  launcherIcon: "chat",          // "chat" | "message" | "custom"
  launcherText: "",              // Text next to icon (optional)

  // Advanced
  zIndex: 9999,
  containerSelector: null,       // CSS selector for custom placement
  darkMode: "auto",              // true | false | "auto"

  // User identification (optional)
  user: {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    metadata: {
      plan: "pro"
    }
  }
};
```

### Configuration Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `agentId` | string | required | Your agent's unique ID |
| `position` | string | "bottom-right" | Widget position |
| `primaryColor` | string | "#8B5CF6" | Primary accent color |
| `title` | string | "Chat with us" | Header title |
| `greeting` | string | "Hi! How can I help?" | Initial bot message |
| `openOnLoad` | boolean | false | Open chat on page load |
| `showLauncher` | boolean | true | Show floating button |
| `darkMode` | string/boolean | "auto" | Dark mode setting |

## JavaScript API

### Global Object

After the script loads, `window.TeachCharlie` becomes available:

```javascript
// Wait for script to load
window.addEventListener('teachcharlie:ready', () => {
  console.log('TeachCharlie API ready');
});
```

### Methods

#### open()

Open the chat widget.

```javascript
window.TeachCharlie.open();
```

#### close()

Close the chat widget.

```javascript
window.TeachCharlie.close();
```

#### toggle()

Toggle the chat open/closed.

```javascript
window.TeachCharlie.toggle();
```

#### isOpen()

Check if chat is currently open.

```javascript
const isOpen = window.TeachCharlie.isOpen();
```

#### sendMessage(text)

Send a message programmatically.

```javascript
window.TeachCharlie.sendMessage("I need help with billing");
```

#### clearConversation()

Clear the current conversation.

```javascript
window.TeachCharlie.clearConversation();
```

#### updateSettings(options)

Update widget settings at runtime.

```javascript
window.TeachCharlie.updateSettings({
  primaryColor: "#10B981",
  title: "Need help?"
});
```

#### setUser(user)

Identify the current user.

```javascript
window.TeachCharlie.setUser({
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  metadata: {
    plan: "enterprise"
  }
});
```

#### destroy()

Remove the widget from the page.

```javascript
window.TeachCharlie.destroy();
```

### Events

Subscribe to events using `on()`:

```javascript
window.TeachCharlie.on('event-name', (data) => {
  console.log('Event received:', data);
});
```

#### Available Events

| Event | Data | Description |
|-------|------|-------------|
| `ready` | `{}` | Widget initialized |
| `open` | `{}` | Chat opened |
| `close` | `{}` | Chat closed |
| `message:sent` | `{text, timestamp}` | User sent message |
| `message:received` | `{text, timestamp}` | Bot responded |
| `typing:start` | `{}` | Bot started typing |
| `typing:end` | `{}` | Bot finished typing |
| `session:start` | `{sessionId}` | New chat session |
| `session:end` | `{sessionId}` | Session ended |
| `error` | `{message, code}` | Error occurred |

#### Event Examples

```javascript
// Track conversations
window.TeachCharlie.on('session:start', (data) => {
  analytics.track('Chat Started', {
    sessionId: data.sessionId
  });
});

// Log bot responses
window.TeachCharlie.on('message:received', (data) => {
  console.log('Bot said:', data.text);
});

// Handle errors
window.TeachCharlie.on('error', (data) => {
  console.error('Chat error:', data.message);
});
```

#### Unsubscribing

```javascript
const handler = (data) => console.log(data);

// Subscribe
window.TeachCharlie.on('open', handler);

// Unsubscribe
window.TeachCharlie.off('open', handler);
```

## Custom Launcher

Hide the default launcher and use your own button:

```html
<button id="custom-chat-button">
  Chat with Support
</button>

<script>
  window.teachCharlieSettings = {
    agentId: "your-agent-id",
    showLauncher: false  // Hide default launcher
  };

  document.getElementById('custom-chat-button').onclick = () => {
    window.TeachCharlie.toggle();
  };
</script>
```

## Custom Container

Place the chat in a specific element instead of floating:

```html
<div id="chat-container" style="width: 400px; height: 600px;"></div>

<script>
  window.teachCharlieSettings = {
    agentId: "your-agent-id",
    containerSelector: "#chat-container",
    showLauncher: false
  };
</script>
```

## Styling

### CSS Variables

Override styles with CSS variables:

```css
:root {
  --tc-primary: #10B981;
  --tc-primary-hover: #059669;
  --tc-background: #F9FAFB;
  --tc-text: #111827;
  --tc-text-muted: #6B7280;
  --tc-border: #E5E7EB;
  --tc-border-radius: 12px;
  --tc-font-family: 'Inter', sans-serif;
}
```

### Custom CSS

Target widget elements with these selectors:

```css
/* Launcher button */
.teachcharlie-launcher {
  /* your styles */
}

/* Chat window */
.teachcharlie-chat {
  /* your styles */
}

/* Message bubbles */
.teachcharlie-message {
  /* your styles */
}

.teachcharlie-message--user {
  /* user message styles */
}

.teachcharlie-message--bot {
  /* bot message styles */
}

/* Input area */
.teachcharlie-input {
  /* your styles */
}
```

## Context & Metadata

### Page Context

Pass current page info to the conversation:

```javascript
window.teachCharlieSettings = {
  agentId: "your-agent-id",
  context: {
    page: window.location.pathname,
    referrer: document.referrer,
    product: "Widget Pro",
    category: "Pricing"
  }
};
```

This context is available to the agent and can influence responses.

### Dynamic Context

Update context as users navigate:

```javascript
// When user views a product
window.TeachCharlie.updateSettings({
  context: {
    product: "Enterprise Plan",
    price: "$199/mo"
  }
});
```

## Multiple Widgets

For advanced use cases, create multiple widget instances:

```javascript
// First widget
const support = TeachCharlie.create({
  agentId: "support-agent",
  position: "bottom-right"
});

// Second widget
const sales = TeachCharlie.create({
  agentId: "sales-agent",
  position: "bottom-left"
});

// Control independently
support.open();
sales.close();
```

## Security

### Domain Restrictions

Configure allowed domains in your agent settings. The widget won't load on unauthorized domains.

### Content Security Policy

Add to your CSP headers:

```
script-src 'self' https://app.teachcharlie.ai;
frame-src 'self' https://app.teachcharlie.ai;
connect-src 'self' https://api.teachcharlie.ai;
```

### Rate Limiting

Embedded widgets are rate limited per IP:
- 30 messages per minute
- 500 messages per day per IP

## Error Handling

```javascript
window.TeachCharlie.on('error', (error) => {
  switch (error.code) {
    case 'RATE_LIMITED':
      console.log('Too many messages, please wait');
      break;
    case 'AGENT_UNAVAILABLE':
      console.log('Chat is temporarily unavailable');
      break;
    case 'NETWORK_ERROR':
      console.log('Connection issue, retrying...');
      break;
    default:
      console.error('Chat error:', error.message);
  }
});
```

## Analytics Integration

### Google Analytics

```javascript
window.teachCharlieSettings = {
  agentId: "your-agent-id",
  analytics: {
    google: true
  }
};

// Events automatically tracked:
// - teachcharlie_open
// - teachcharlie_message_sent
// - teachcharlie_message_received
// - teachcharlie_session_start
```

### Custom Analytics

```javascript
window.TeachCharlie.on('message:sent', (data) => {
  // Segment
  analytics.track('Chat Message Sent', data);

  // Mixpanel
  mixpanel.track('Chat Message', { direction: 'sent', ...data });
});
```

## Troubleshooting

### Widget Not Loading

1. Check browser console for errors
2. Verify `agentId` is correct
3. Confirm domain is allowlisted
4. Check for JavaScript errors blocking execution

### Chat Not Responding

1. Check network tab for API errors
2. Verify agent is enabled and not paused
3. Check rate limits haven't been exceeded

### Styling Issues

1. Check for CSS conflicts
2. Try increasing `zIndex`
3. Use browser inspector to debug

---

Need more help? See the full [API Reference](/resources/developers/api-reference).
