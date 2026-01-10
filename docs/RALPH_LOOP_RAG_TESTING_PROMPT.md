# Ralph Loop Prompt for RAG E2E Testing

**Purpose**: This document contains the optimized prompt for running ralph-loop to comprehensively test and fix RAG capabilities.

---

## How to Use

1. Restart Claude Code for maximum context window
2. Copy the prompt below
3. Run: `/ralph-loop "<paste prompt>" --max-iterations 100 --completion-promise "COMPLETE"`

---

## The Prompt

```
You are tasked with comprehensive E2E testing of the RAG (Retrieval-Augmented Generation) capabilities in Teach Charlie AI using the Playwright MCP server.

## Context

Read these files to understand the system:
- /Users/adamcognigy/LangflowSaaS/docs/RAG_E2E_TESTING_PLAN.md (comprehensive test plan)
- /Users/adamcognigy/LangflowSaaS/src/frontend/e2e/helpers/selectors.ts (existing selectors)
- /Users/adamcognigy/LangflowSaaS/src/frontend/e2e/helpers/test-data.ts (test data patterns)

## Your Mission

Test ALL RAG functionality exhaustively using the Playwright MCP browser tools. When tests fail, fix the underlying code issues. Continue iterating until ALL tests pass.

## Testing Phases

### Phase 1: Knowledge Source Management (Complete these first)
1. Upload different file types (PDF, TXT, DOCX, MD, CSV)
2. Add URL-based knowledge sources
3. Paste text as knowledge sources
4. Verify sources appear in Browse tab with correct status
5. Test file size limits (10MB max)
6. Test deletion of sources
7. Test selection/deselection in modal

### Phase 2: Agent Creation with RAG
1. Create agent with Knowledge Search tool selected
2. Verify knowledge modal opens when clicking tool
3. Upload files during agent creation flow
4. Verify knowledge_source_ids saved to database
5. Test selecting multiple knowledge sources
6. Verify agent creation completes with workflow

### Phase 3: Playground Chat with RAG
1. Ask questions that should be answered from knowledge
2. Verify responses contain information from uploaded content
3. Test multi-turn conversations with knowledge context
4. Test knowledge + calculator tool combination
5. Test knowledge + web search combination
6. Test fallback when content not in knowledge

### Phase 4: Edit Agent Knowledge
1. Load existing agent, verify knowledge sources pre-selected
2. Add new knowledge sources, save, verify persisted
3. Remove knowledge sources, save, verify removed
4. Verify changes reflected in playground behavior

### Phase 5: Persistence and State
1. Refresh page, verify sources still present
2. Create agent, close browser, reopen, verify knowledge works
3. Test that knowledge is user/project scoped

### Phase 6: Error Handling
1. Test upload of unsupported file types
2. Test invalid URLs
3. Test empty file uploads
4. Test very large files (>10MB)
5. Verify graceful error messages

## Testing Protocol

For each test:
1. Use mcp__plugin_playwright_playwright__browser_navigate to go to the page
2. Use mcp__plugin_playwright_playwright__browser_snapshot to see current state
3. Interact with elements using mcp__plugin_playwright_playwright__browser_click, browser_type, browser_fill_form
4. For file uploads, use mcp__plugin_playwright_playwright__browser_file_upload
5. Take screenshots on failures with mcp__plugin_playwright_playwright__browser_take_screenshot
6. Wait for async operations with mcp__plugin_playwright_playwright__browser_wait_for

## Test Data

Use these files for testing (create them if they don't exist):
- /Users/adamcognigy/LangflowSaaS/src/frontend/e2e/fixtures/test-knowledge.txt
- /Users/adamcognigy/LangflowSaaS/src/frontend/e2e/fixtures/test-knowledge.pdf (if available)

Text content for test-knowledge.txt:
```
ACME Corporation Employee Handbook

Vacation Policy: All employees receive 15 days paid vacation per year.
Sick Leave: Employees receive 10 days sick leave per year.
Remote Work: Employees may work remotely up to 3 days per week.
Dress Code: Business casual is required Monday-Thursday. Casual Friday is observed.
Performance Reviews: Annual reviews are conducted in December.
```

## Fixing Issues

When a test fails:
1. Analyze the failure carefully (screenshot, console, network)
2. Read the relevant source code files
3. Fix the root cause (don't use fake fallbacks or mocks)
4. Re-run the failing test to verify the fix
5. Continue to next test

## Critical Rules

- NO fake data or mocks - all tests must hit real endpoints
- NO skipping tests - every test must pass
- NO fallback workarounds - fix actual bugs
- Document all fixes made
- Take screenshots of failures for debugging
- Run each test multiple times if flaky to confirm fix

## Progress Tracking

Track progress in a todo list:
- [ ] Phase 1: Knowledge Source Management (8 tests)
- [ ] Phase 2: Agent Creation with RAG (6 tests)
- [ ] Phase 3: Playground Chat with RAG (6 tests)
- [ ] Phase 4: Edit Agent Knowledge (4 tests)
- [ ] Phase 5: Persistence and State (3 tests)
- [ ] Phase 6: Error Handling (5 tests)

## Completion Criteria

You are DONE when ALL of the following are true:
1. All Phase 1-6 tests pass consistently
2. No flaky tests (run each 2-3 times to confirm)
3. All fixes are committed to the codebase
4. No fake/mock data used
5. Summary of all fixes documented

When ALL above criteria are met, output: <promise>COMPLETE</promise>

## If Stuck After 30 Iterations

If progress stalls:
1. Document what's blocking (specific error, missing feature)
2. List all attempted fixes
3. Suggest what human intervention might be needed
4. Output: <promise>BLOCKED</promise>

## Start Now

Begin by:
1. Reading the test plan document
2. Navigating to http://localhost:3001
3. Taking a snapshot of the current state
4. Starting with Phase 1, Test 1: Upload a text file
```

---

## Alternative: More Focused Prompt

If the full prompt is too broad, use this focused version for Phase 1 only:

```
Test the RAG knowledge source management in Teach Charlie AI using Playwright MCP.

## Setup
- Navigate to http://localhost:3001
- Ensure backend is running on port 8000
- Ensure Langflow is running on port 7860

## Tests to Complete

1. **Upload TXT File**
   - Navigate to /create
   - Complete Step 1 (name: "Test Agent", job: "A helpful assistant")
   - Complete Step 2 (rules: "Be helpful and friendly")
   - On Step 3, click Knowledge Search tool
   - In modal, go to Upload tab
   - Upload a .txt file
   - Verify file appears in Browse tab
   - Verify file is auto-selected

2. **Upload PDF File**
   - Same as above but with PDF
   - Verify file status is "ready"

3. **Add URL**
   - In modal, go to URL tab
   - Enter: https://en.wikipedia.org/wiki/Artificial_intelligence
   - Give it name: "AI Wikipedia"
   - Submit
   - Verify it appears in Browse tab

4. **Paste Text**
   - In modal, go to Text tab
   - Name: "Company Info"
   - Paste: "Our company was founded in 2020..."
   - Submit
   - Verify it appears in Browse tab

5. **Select Multiple Sources**
   - In Browse tab, select 2 sources
   - Close modal
   - Submit agent creation
   - Verify workflow created

6. **Chat Uses Knowledge**
   - Navigate to playground
   - Ask question about uploaded content
   - Verify response uses knowledge

## Fixing Protocol

For each failure:
1. Take screenshot
2. Read relevant code
3. Fix the bug (no mocks!)
4. Re-test
5. Proceed

## Completion

When all 6 tests pass: <promise>COMPLETE</promise>
If stuck after 20 iterations: <promise>BLOCKED</promise>
```

---

## Tips for Success

1. **Start Services First**: Ensure frontend (3001), backend (8000), and Langflow (7860) are running
2. **Test Files Ready**: Create test files in e2e/fixtures/ before starting
3. **Clear State**: Consider resetting test data between iterations
4. **Watch Console**: Check browser console for errors
5. **Network Tab**: Watch network requests for API failures
6. **Be Patient**: RAG operations can be slow (wait for async operations)

---

## Expected Iteration Pattern

Typical ralph-loop session for this task:

| Iteration | Activity |
|-----------|----------|
| 1-5 | Setup, first test runs, initial failures identified |
| 6-15 | Fix Knowledge modal issues (if any) |
| 16-25 | Fix file upload issues (if any) |
| 26-35 | Fix agent creation flow issues |
| 36-50 | Fix chat/RAG retrieval issues |
| 51-70 | Fix persistence issues |
| 71-90 | Fix edge cases and flaky tests |
| 91-100 | Final verification, all tests pass |

---

## Sample Test Output

Good test run output looks like:

```
Phase 1 Test 1: Upload TXT File
- Navigated to /create
- Filled Step 1: name="RAG Test Agent"
- Filled Step 2: rules="Be helpful"
- Clicked Knowledge Search tool
- Modal opened successfully
- Clicked Upload tab
- Uploaded test-knowledge.txt
- File appeared in Browse tab with status "ready"
- File auto-selected
PASS

Phase 1 Test 2: Upload PDF File
- Navigated to /create
...
```

Bad test output (needs fixing):

```
Phase 1 Test 1: Upload TXT File
- Navigated to /create
- Filled Step 1: name="RAG Test Agent"
- Filled Step 2: rules="Be helpful"
- Clicked Knowledge Search tool
- ERROR: Modal did not open
- Screenshot saved: failure-modal-not-opening.png
- Investigating...
- Found issue: Click event not reaching button due to overlay
- Fix: Dismiss tour overlay first
- Retrying...
PASS (after fix)
```
