# Testing in the Playground

The Playground is where you test and refine your AI agent. Think of it as a training ground where you can safely see how Charlie responds before going live.

## Accessing the Playground

1. Open any agent from your dashboard
2. Click the **"Playground"** tab or button
3. Start chatting!

## The Playground Interface

### Chat Area
The main area where your conversation with Charlie happens. Messages appear in real-time with:

- **Your messages**: Shown on the right
- **Charlie's responses**: Shown on the left with streaming text
- **Tool usage**: Visual indicators when Charlie uses a tool

### Input Box
Type your message here. Press Enter or click Send to submit.

**Keyboard shortcuts:**
- `Enter` - Send message
- `Shift + Enter` - New line (for longer messages)

### Conversation Controls

- **Clear Chat**: Start a fresh conversation
- **Export**: Download the conversation as JSON
- **Settings**: Adjust playground settings

## Multi-Turn Conversations

Charlie remembers your entire conversation! This means you can:

```
You: What's your return policy?
Charlie: Our return policy allows returns within 30 days...

You: What about electronics?
Charlie: For electronics specifically, the same 30-day
         policy applies, but items must be unopened...

You: And what if it's defective?
Charlie: If an electronic item is defective, you have
         90 days to return it for a full refund...
```

Notice how Charlie understands "it" refers to electronics from the previous context.

## Testing Different Scenarios

### Happy Path Testing
Test the normal, expected use cases:

- "Hi, I need help with my order"
- "What are your business hours?"
- "How much does shipping cost?"

### Edge Case Testing
Test unusual or unexpected inputs:

- "asdfghjkl" (random text)
- "I want to speak to a human"
- Very long messages
- Empty messages

### Adversarial Testing
Test how Charlie handles attempts to break the rules:

- Asking about topics outside their scope
- Requesting inappropriate content
- Trying to confuse Charlie with contradictions

> **Tip:** If you find issues during testing, go back and update Charlie's rules before deploying!

## Understanding Charlie's Responses

### Streaming Responses
Charlie's responses appear word-by-word in real-time. This gives a more natural, conversational feel.

### Tool Indicators
When Charlie uses a tool (like searching your knowledge base), you'll see an indicator:

```
🔍 Searching knowledge base...

Based on our documentation, I found that...
```

### Confidence Signals
Well-trained Charlies will indicate when they're uncertain:

- "Based on what I know..." (confident)
- "I'm not entirely sure, but..." (uncertain)
- "I don't have information about that." (unknown)

## Debugging Common Issues

### Charlie Doesn't Use Tools
**Problem:** Charlie never searches the knowledge base.

**Solutions:**
1. Make sure tools are enabled in the agent settings
2. Add explicit instructions: "Always search the knowledge base before answering questions"
3. Check that knowledge sources are properly uploaded

### Responses Are Too Generic
**Problem:** Charlie gives vague, unhelpful answers.

**Solutions:**
1. Add more specific knowledge to the knowledge base
2. Be more specific in the job description
3. Lower the creativity setting for more focused responses

### Charlie Forgets Context
**Problem:** Charlie doesn't remember earlier parts of the conversation.

**Solutions:**
1. Check that conversation memory is enabled
2. For very long conversations, summarize periodically
3. This is expected for new chat sessions—memory resets

### Responses Are Too Long
**Problem:** Charlie writes novels when a sentence would do.

**Solutions:**
1. Add a rule: "Keep responses concise, under 3 sentences when possible"
2. Specify the format: "Use bullet points for lists"
3. Lower the creativity setting

## Best Practices

### 1. Test Like a Real User
Don't just type "test". Imagine you're a customer with a real question.

### 2. Document Your Tests
Keep a list of questions that work well and questions that don't. This helps you improve consistently.

### 3. Test Across Topics
Make sure Charlie handles all the subjects in their job description, not just the most common ones.

### 4. Check Tone Consistency
Is Charlie friendly throughout? Professional? Make sure the tone matches your brand.

### 5. Verify Tool Usage
If Charlie should search the knowledge base, make sure they actually do it (not just make up answers).

## Sharing Test Results

Need feedback from your team? You can:

1. **Export the conversation** - Download as JSON
2. **Screenshot** - Capture important exchanges
3. **Invite collaborators** - Share project access (Team plan)

## From Playground to Production

Once you're happy with Charlie's behavior in the Playground:

1. ✅ Test all common scenarios
2. ✅ Test edge cases
3. ✅ Verify tool usage
4. ✅ Check tone and accuracy
5. 🚀 Ready to [embed on your website](/resources/guides/embedding)!

---

Next: Learn how to make Charlie smarter with [Knowledge Sources](/resources/guides/knowledge-sources)!
