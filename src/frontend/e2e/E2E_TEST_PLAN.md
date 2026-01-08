# Comprehensive E2E Test Plan for Teach Charlie AI

## Overview

This document outlines a comprehensive end-to-end test suite covering the complete agent lifecycle, from creation to chat to editing, including advanced features.

## Test Categories

### 1. Agent Creation Flow (Complete 3-Step Wizard)
**Route:** `/create?project=:projectId`

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| C001 | Complete agent creation | Full 3-step wizard: Identity → Coaching → Tricks → Finish | Critical |
| C002 | Step 1 validation | Name and persona validation (min 10 chars for persona) | High |
| C003 | Step 2 validation | Instructions validation (min 10 chars) | High |
| C004 | Tool selection | Select multiple tools (Web Search, Calculator, URL Reader) | Medium |
| C005 | Avatar generation | Click "Generate" button and verify avatar displays | Medium |
| C006 | Navigation between steps | Back/Next buttons work correctly | High |
| C007 | API key error handling | Shows error if no API key configured | Critical |

### 2. Chat Playground Tests
**Routes:** `/playground/:agentId` and `/playground/workflow/:workflowId`

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| P001 | Chat message flow | Send message → Loading state → Receive response | Critical |
| P002 | Message persistence | Messages appear in conversation history | High |
| P003 | Error handling | Shows "Failed to send" on API errors | Critical |
| P004 | Clear chat | Clear chat button clears all messages | Medium |
| P005 | Multi-turn conversation | Multiple messages in same conversation | High |
| P006 | Markdown rendering | Assistant messages render markdown | Low |

### 3. Agent Edit Flow
**Route:** `/edit/:agentId`

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| E001 | Load existing agent | Agent data populates form fields | Critical |
| E002 | Edit identity | Modify name and persona, save | High |
| E003 | Edit instructions | Modify instructions, save | High |
| E004 | Toggle tools | Select/deselect tools, verify changes save | Medium |
| E005 | Save validation | Shows error for invalid inputs | High |
| E006 | Navigate to chat | "Back to Chat" link works | Medium |

### 4. Advanced Editor Modal
**Triggered from:** Edit page "Advanced Settings → Configure" button

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| A001 | Open modal | Click Configure → Modal opens | High |
| A002 | Provider selection | Change provider (OpenAI, Anthropic, Google) | High |
| A003 | Model selection | Model dropdown updates based on provider | High |
| A004 | Temperature slider | Adjust temperature, verify value updates | Medium |
| A005 | Toggle settings | Enable/disable Chat History, Verbose mode | Medium |
| A006 | Save settings | Save button persists changes | High |
| A007 | Reset to defaults | Reset button restores default values | Low |

### 5. Visual Flow Editor
**Route:** `/canvas/:agentId`

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| F001 | Load canvas | Langflow iframe loads successfully | High |
| F002 | Complexity levels | Level 1-4 buttons change UI mode | Medium |
| F003 | Open in new tab | "Open Full Editor" link works | Low |
| F004 | Educational overlay | Level 1 shows "Peek Mode" overlay | Low |

### 6. Persistence Tests
**Verify data persists across page reloads**

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| D001 | Agent persists | Created agent appears in project list | Critical |
| D002 | Edits persist | Modified agent shows updated values | High |
| D003 | Workflow created | Creating agent also creates associated workflow | High |
| D004 | Deletion works | Delete agent removes from list | Medium |
| D005 | Duplicate agent | Duplicated agent appears in list | Low |

### 7. Settings Integration
**Route:** `/settings`

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| S001 | API key configuration | Add/update API key for OpenAI | Critical |
| S002 | Provider selection | Set default AI provider | High |
| S003 | Settings used in agent | New agents use configured provider | Critical |

### 8. Error Handling
**Various routes**

| Test ID | Test Name | Description | Priority |
|---------|-----------|-------------|----------|
| X001 | Invalid API key | User-friendly error for 401 responses | Critical |
| X002 | Network timeout | Graceful handling of slow/failed requests | High |
| X003 | 404 handling | Non-existent agent shows error page | Medium |

## Test Data Requirements

### Default Test User
```
User ID: a36c791d-b36b-44b7-abc1-feaafb6a8d40
Header: x-dev-user-id (for dev mode auth bypass)
```

### Test Agent Data
```json
{
  "name": "E2E Test Agent",
  "who": "A helpful assistant for testing purposes",
  "rules": "Be helpful, concise, and always mention you are a test agent",
  "tools": ["web_search", "calculator"]
}
```

## Critical Path Tests

The following tests must pass before any deployment:

1. **C001** - Agent creation works end-to-end
2. **P001** - Chat sends and receives messages
3. **S001** - API key can be configured
4. **S003** - New agents use the configured provider
5. **D001** - Created agents persist in database

## UI Selectors Reference

### CreateAgentPage
- Name input: `input[placeholder="Charlie"]` or `[data-tour="agent-name"]`
- Persona textarea: `textarea` with placeholder containing "Golden Retriever"
- Instructions textarea: `[data-tour="agent-rules"]`
- Tools grid: `[data-tour="agent-tools"]`
- Next button: `button` containing "Next Step"
- Create button: `button` containing "Finish & Create Agent"

### EditAgentPage
- Name input: `.bg-white input[type="text"]` first input
- Persona textarea: first textarea
- Instructions textarea: second textarea
- Advanced Settings button: `button` containing "Configure"
- Save button: `button` containing "Save & Preview"
- Flow Editor link: `a[href*="/canvas/"]`

### PlaygroundPage
- Chat input: `textarea[placeholder*="message"]`
- Send button: `button` with send icon (next to textarea)
- Loading indicator: `.animate-bounce` dots
- Messages: `.prose` for assistant, `.bg-violet-500` for user
- Clear chat: button containing "Clear chat"

### AdvancedEditorModal
- Provider select: first `select` in modal
- Model select: second `select` in modal
- Temperature slider: `input[type="range"]`
- Save button: `button` containing "Save Settings"
- Close button: `button` with X icon

### LangflowCanvasViewer
- Level buttons: `button` containing 1, 2, 3, 4
- Open Full Editor link: `a` containing "Open Full Editor"
- Langflow iframe: `iframe[title*="Flow Canvas"]`

## Running the Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/comprehensive.spec.ts

# Run with UI
npx playwright test --headed

# Run specific test
npx playwright test -g "should create agent and chat"

# Generate report
npx playwright show-report
```

## Environment Variables

```bash
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:8000
```
