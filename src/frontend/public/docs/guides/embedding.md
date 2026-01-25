# Embedding on Your Website

Put Charlie on any website with a simple code snippet! The embed widget lets visitors chat with your trained agent without leaving your site.

## What Is the Embed Widget?

The embed widget is a chat interface that:

- Appears as a chat bubble on your website
- Opens into a full chat experience
- Connects to your trained agent
- Works on desktop and mobile
- Requires zero coding to set up

## Getting the Embed Code

### Step 1: Enable Embedding

1. Navigate to your agent
2. Click **"Edit"** or **"Settings"**
3. Find the **"Embed"** section
4. Toggle **"Enable Embedding"** on

### Step 2: Configure Appearance

Customize how the widget looks:

| Option | Description | Default |
|--------|-------------|---------|
| Position | Corner of screen | Bottom right |
| Primary Color | Button and header color | Violet (#8B5CF6) |
| Title | Header text | "Chat with us" |
| Greeting | Initial message | "Hi! How can I help?" |
| Placeholder | Input hint | "Type a message..." |

### Step 3: Copy the Code

```html
<!-- Teach Charlie AI Widget -->
<script>
  window.teachCharlieSettings = {
    agentId: "your-agent-id",
    position: "bottom-right",
    primaryColor: "#8B5CF6"
  };
</script>
<script
  src="https://app.teachcharlie.ai/embed.js"
  async>
</script>
```

### Step 4: Add to Your Website

Paste the code just before the `</body>` tag on any page where you want the widget.

## Installation by Platform

### WordPress

**Option 1: Theme Files**
1. Go to Appearance → Theme Editor
2. Open `footer.php`
3. Paste the code before `</body>`
4. Save

**Option 2: Plugin**
1. Install "Insert Headers and Footers" plugin
2. Go to Settings → Insert Headers and Footers
3. Paste code in the "Footer" section
4. Save

### Shopify

1. Go to Online Store → Themes
2. Click Actions → Edit Code
3. Open `theme.liquid`
4. Paste code before `</body>`
5. Save

### Webflow

1. Go to Project Settings → Custom Code
2. Paste in "Footer Code" section
3. Save and publish

### Squarespace

1. Go to Settings → Advanced → Code Injection
2. Paste in "Footer" field
3. Save

### React/Next.js

```jsx
// components/ChatWidget.tsx
import { useEffect } from 'react';

export function ChatWidget() {
  useEffect(() => {
    // Configure widget
    window.teachCharlieSettings = {
      agentId: "your-agent-id",
      position: "bottom-right"
    };

    // Load script
    const script = document.createElement('script');
    script.src = "https://app.teachcharlie.ai/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
```

### HTML/Static Sites

Simply paste the code in your HTML file before `</body>`.

## Customization Options

### Full Configuration

```javascript
window.teachCharlieSettings = {
  // Required
  agentId: "your-agent-id",

  // Appearance
  position: "bottom-right", // or "bottom-left"
  primaryColor: "#8B5CF6",
  textColor: "#1F2937",
  backgroundColor: "#FFFFFF",

  // Content
  title: "Chat with Support",
  greeting: "Hi there! How can I help you today?",
  placeholder: "Type your message...",

  // Behavior
  openOnLoad: false,
  hideOnMobile: false,
  soundEnabled: true,

  // Advanced
  zIndex: 9999,
  containerSelector: null // CSS selector for custom container
};
```

### Dark Mode Support

```javascript
window.teachCharlieSettings = {
  agentId: "your-agent-id",
  darkMode: true,
  // Or auto-detect user preference:
  darkMode: "auto"
};
```

### Custom Launcher Button

Hide the default bubble and use your own button:

```javascript
window.teachCharlieSettings = {
  agentId: "your-agent-id",
  showLauncher: false
};

// Open chat programmatically
document.getElementById('myButton').onclick = function() {
  window.TeachCharlie.open();
};
```

## JavaScript API

Control the widget programmatically:

```javascript
// Open the chat
window.TeachCharlie.open();

// Close the chat
window.TeachCharlie.close();

// Toggle open/closed
window.TeachCharlie.toggle();

// Send a message programmatically
window.TeachCharlie.sendMessage("Hello!");

// Clear conversation
window.TeachCharlie.clearConversation();

// Update settings
window.TeachCharlie.updateSettings({
  primaryColor: "#10B981"
});

// Listen to events
window.TeachCharlie.on('open', () => console.log('Chat opened'));
window.TeachCharlie.on('close', () => console.log('Chat closed'));
window.TeachCharlie.on('message', (msg) => console.log('New message:', msg));
```

## Tracking & Analytics

### Built-in Analytics

View widget performance in your Teach Charlie AI dashboard:

- Chat sessions started
- Messages exchanged
- Common questions
- Resolution rates

### Google Analytics Integration

Track widget events in GA:

```javascript
window.teachCharlieSettings = {
  agentId: "your-agent-id",
  analytics: {
    google: true,
    googleId: "UA-XXXXX-X" // Optional, uses existing GA
  }
};
```

### Custom Event Tracking

```javascript
window.TeachCharlie.on('message', (event) => {
  // Your custom tracking code
  analytics.track('Chat Message', {
    userMessage: event.isUser,
    timestamp: event.timestamp
  });
});
```

## Security & Privacy

### Domain Restrictions

Limit which domains can use your widget:

1. Go to Agent Settings → Embed
2. Add allowed domains
3. Save

Only listed domains will load the widget.

### Rate Limiting

Protect against abuse:

- Automatic rate limiting per IP
- Configurable daily message limits
- Block specific IPs if needed

### Data Privacy

- Conversations stored securely
- GDPR compliance options
- Data retention controls in settings

## Troubleshooting

### Widget Doesn't Appear

**Causes:**
1. Script not loaded - check browser console for errors
2. Wrong agent ID - verify in embed settings
3. Domain not allowed - check domain restrictions
4. Ad blocker - some block chat widgets

### Widget Appears But Doesn't Work

**Causes:**
1. Agent disabled - check agent status
2. API key issues - verify in settings
3. Network error - check console for API errors

### Styling Conflicts

**Cause:** Your site's CSS conflicts with widget styles.

**Solutions:**
1. The widget uses shadow DOM to isolate styles
2. Adjust `zIndex` if widget appears behind elements
3. Use `containerSelector` for custom placement

### Slow Loading

**Solutions:**
1. Script loads asynchronously by default
2. Consider lazy loading on scroll
3. Preconnect to the API domain

## Best Practices

### Placement
- Bottom-right works best (conventional placement)
- Don't cover important content
- Test on mobile devices

### Greeting Message
- Be specific about what Charlie can help with
- Keep it short and friendly
- Mention key capabilities

### Response Time
- Test that Charlie responds quickly
- Optimize knowledge sources for faster retrieval
- Consider loading indicators

### Mobile Experience
- Test on various screen sizes
- Ensure keyboard doesn't cover the input
- Chat should be thumb-reachable

---

Need more integrations? Learn about [Connecting Tools (MCP Servers)](/resources/guides/mcp-servers)!
