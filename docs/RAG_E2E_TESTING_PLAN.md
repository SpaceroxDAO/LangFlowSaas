# RAG E2E Testing Plan - Comprehensive Test Scenarios

**Created**: 2026-01-10
**Purpose**: Exhaustive E2E testing of RAG (Retrieval-Augmented Generation) capabilities in Teach Charlie AI
**Test Framework**: Playwright with MCP browser automation

---

## Table of Contents

1. [Overview](#overview)
2. [Test Categories](#test-categories)
3. [Knowledge Source Management Tests](#1-knowledge-source-management-tests)
4. [Agent Creation with RAG Tests](#2-agent-creation-with-rag-tests)
5. [Playground Chat with RAG Tests](#3-playground-chat-with-rag-tests)
6. [Canvas UI RAG Tests](#4-canvas-ui-rag-tests)
7. [Tool Combination Tests](#5-tool-combination-tests)
8. [Persistence and State Tests](#6-persistence-and-state-tests)
9. [Error Handling and Edge Cases](#7-error-handling-and-edge-cases)
10. [Cross-Browser and Performance Tests](#8-cross-browser-and-performance-tests)

---

## Overview

### What We're Testing

The RAG system allows users to:
1. Upload documents (PDF, TXT, DOCX, MD, CSV) as knowledge sources
2. Add URLs as knowledge sources (web page content fetched)
3. Paste text directly as knowledge sources
4. Select knowledge sources when creating agents
5. Chat with agents that can retrieve and reference uploaded knowledge
6. Use knowledge in combination with other tools (web search, calculator, etc.)

### Testing Surfaces

| Surface | Description |
|---------|-------------|
| **Agent Builder (3-step wizard)** | `/create` - Where users create agents with Q&A |
| **Agent Editor** | `/edit/{agentId}` - Single-page form for editing agents |
| **Playground (Chat)** | `/playground/workflow/{workflowId}` - Chat interface for testing agents |
| **Canvas UI** | `/canvas/{workflowId}` - Visual Langflow editor with RAG nodes |
| **Knowledge Modal** | Modal dialog for browsing, uploading, and selecting knowledge sources |
| **API Layer** | Backend endpoints for CRUD operations on knowledge sources |

### Key Components Under Test

| Component | File Location |
|-----------|--------------|
| Knowledge Sources Modal | `src/frontend/src/components/KnowledgeSourcesModal.tsx` |
| Create Agent Page | `src/frontend/src/pages/CreateAgentPage.tsx` |
| Edit Agent Page | `src/frontend/src/pages/EditAgentPage.tsx` |
| Playground Page | `src/frontend/src/pages/PlaygroundPage.tsx` |
| Knowledge Service | `src/backend/app/services/knowledge_service.py` |
| Workflow Service | `src/backend/app/services/workflow_service.py` |
| File Service | `src/backend/app/services/file_service.py` |
| Knowledge API | `src/backend/app/api/knowledge_sources.py` |
| Files API | `src/backend/app/api/files.py` |

---

## Test Categories

### Priority Levels

| Priority | Description | Count |
|----------|-------------|-------|
| **P0 - Critical** | Core RAG functionality that must work | 15 tests |
| **P1 - High** | Important features for MVP launch | 25 tests |
| **P2 - Medium** | Edge cases and advanced scenarios | 20 tests |
| **P3 - Low** | Nice-to-have coverage | 10 tests |

### Test Naming Convention

```
[Category]_[Scenario]_[ExpectedBehavior]

Examples:
- KnowledgeSource_UploadPDF_ShowsInBrowseTab
- AgentChat_WithKnowledge_RetrievesRelevantChunks
- ToolCombo_WebSearchAndKnowledge_BothToolsWork
```

---

## 1. Knowledge Source Management Tests

### 1.1 File Upload Tests (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| KS-001 | Upload valid PDF file | 1. Open Knowledge Modal → Upload tab<br>2. Select PDF (< 10MB)<br>3. Wait for upload | File appears in Browse tab with "ready" status |
| KS-002 | Upload valid TXT file | Same as above with .txt file | File appears with correct mime type |
| KS-003 | Upload valid DOCX file | Same as above with .docx file | File appears, content extractable |
| KS-004 | Upload valid MD file | Same as above with .md file | File appears with markdown content |
| KS-005 | Upload valid CSV file | Same as above with .csv file | File appears with tabular content |
| KS-006 | Upload file > 10MB | Attempt to upload 15MB file | Error message: "File too large" |
| KS-007 | Upload unsupported format | Attempt to upload .exe file | Error message: "File type not supported" |
| KS-008 | Upload empty file | Upload 0-byte file | Error or graceful handling |
| KS-009 | Upload file with special chars in name | File named "résumé (1).pdf" | File stored with sanitized name |
| KS-010 | Upload multiple files sequentially | Upload PDF, then TXT, then DOCX | All 3 appear in Browse tab |

### 1.2 URL Addition Tests (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| KS-011 | Add valid HTTP URL | 1. Open Modal → URL tab<br>2. Enter valid URL<br>3. Submit | Source created with "pending" → "ready" status |
| KS-012 | Add valid HTTPS URL | Same with HTTPS URL | Source created successfully |
| KS-013 | Add URL with custom name | Enter URL + custom name | Source shows custom name, not URL |
| KS-014 | Add invalid URL | Enter "not-a-url" | Validation error before submission |
| KS-015 | Add URL that returns 404 | Enter valid URL that 404s | Source shows "error" status |
| KS-016 | Add URL with timeout | Enter slow-responding URL | Either timeout error or long-polling success |
| KS-017 | Add URL requiring auth | Enter URL behind login | Error status (cannot fetch protected content) |
| KS-018 | Add Wikipedia article URL | Enter Wikipedia article | Content extracted successfully |
| KS-019 | Add news article URL | Enter news site article | Content extracted (may vary by site) |
| KS-020 | Add PDF URL (direct link) | Enter URL ending in .pdf | PDF content downloaded and extracted |

### 1.3 Text Paste Tests (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| KS-021 | Paste short text | 1. Open Modal → Text tab<br>2. Paste "Hello world"<br>3. Submit | Source created with text content |
| KS-022 | Paste long text (100KB) | Paste ~100KB of text | Source created, content truncated if needed |
| KS-023 | Paste with name | Enter name + paste text | Source shows custom name |
| KS-024 | Paste without name | Paste text only | Source shows auto-generated name (first words or "Pasted Text") |
| KS-025 | Paste with markdown | Paste markdown-formatted text | Markdown preserved in content |
| KS-026 | Paste with code | Paste code snippet | Code preserved with formatting |
| KS-027 | Paste with special chars | Paste text with emojis/unicode | Characters preserved correctly |
| KS-028 | Paste empty | Submit with empty text | Validation error |

### 1.4 Browse and Selection Tests (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| KS-029 | View all sources in Browse | Open Modal → Browse tab | All user's sources listed |
| KS-030 | Select single source | Click checkbox on one source | Source selected, count shows "1 selected" |
| KS-031 | Select multiple sources | Check 3 different sources | All 3 selected, count shows "3 selected" |
| KS-032 | Deselect source | Uncheck previously checked source | Selection removed |
| KS-033 | Select all visible | Click "Select All" (if available) | All sources selected |
| KS-034 | Sources persist after modal close | Select sources → Close → Reopen | Same sources still selected |
| KS-035 | Auto-select newly uploaded | Upload file from modal | New source auto-selected |
| KS-036 | Filter/search sources | Type in search box | List filters to matching sources |

### 1.5 Delete Operations (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| KS-037 | Delete single source | Click delete on source | Confirmation → Source removed |
| KS-038 | Delete selected source | Select source then delete | Source removed from selection and list |
| KS-039 | Delete source used by agent | Delete source that's attached to agent | Warning or graceful handling |
| KS-040 | Delete all sources | Delete each source one by one | Empty state shown |

---

## 2. Agent Creation with RAG Tests

### 2.1 Basic Agent + Knowledge Creation (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| AC-001 | Create agent with 1 knowledge source | 1. Navigate to /create<br>2. Complete Step 1 & 2<br>3. Step 3: Click Knowledge Search<br>4. Select 1 source<br>5. Submit | Agent + Workflow created with knowledge_source_ids |
| AC-002 | Create agent with 3 knowledge sources | Same as above, select 3 sources | All 3 IDs saved to agent |
| AC-003 | Create agent with knowledge + web search | Select both Knowledge Search and Web Search tools | Both tools attached to agent |
| AC-004 | Knowledge modal opens on tool click | Step 3: Click Knowledge Search card | Modal opens to Browse tab |
| AC-005 | Knowledge modal shows existing sources | Have 5 sources pre-uploaded | All 5 visible in Browse tab |
| AC-006 | Selecting sources enables tool | No sources selected → select 1 | Tool card shows "selected" state |
| AC-007 | Deselecting all sources disables tool | Deselect all sources | Tool no longer highlighted |
| AC-008 | Cancel modal preserves prior selection | Select 2 → Cancel → Reopen | 2 still selected |
| AC-009 | Save modal updates selection | Select 2 → Save → Reopen | Selection saved, shows 2 selected |

### 2.2 Edit Agent Knowledge (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| AC-010 | Load existing agent with knowledge | Navigate to /edit/{id} with knowledge agent | Knowledge Search shows selected, correct sources loaded |
| AC-011 | Add knowledge to existing agent | Edit agent without knowledge → Add sources | knowledge_source_ids updated on save |
| AC-012 | Remove knowledge from agent | Edit agent → Deselect all sources → Save | knowledge_source_ids cleared |
| AC-013 | Replace knowledge sources | Remove old sources → Add new ones → Save | Only new sources attached |
| AC-014 | Knowledge persists after edit | Add knowledge → Save → Reload page | Same knowledge sources shown |

### 2.3 Upload During Agent Creation (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| AC-015 | Upload PDF during creation | Step 3 → Open modal → Upload tab → Upload PDF | PDF uploaded AND auto-selected |
| AC-016 | Upload then continue wizard | Upload file → Close modal → Submit | Agent created with uploaded file |
| AC-017 | Upload fails → continue anyway | Upload fails → Close modal → Submit without selection | Agent created without knowledge (graceful) |
| AC-018 | Add URL during creation | Step 3 → Open modal → URL tab → Add URL | URL source created and selected |
| AC-019 | Paste text during creation | Step 3 → Open modal → Text tab → Paste | Text source created and selected |
| AC-020 | Upload multiple file types | Upload PDF + TXT + DOCX | All 3 created and selected |

---

## 3. Playground Chat with RAG Tests

### 3.1 Basic RAG Retrieval (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PC-001 | Question about uploaded content | 1. Create agent with "ACME Handbook" PDF<br>2. Ask "What is the vacation policy?" | Response contains info from PDF |
| PC-002 | Multiple chunks retrieved | Ask question requiring multiple sections | Response synthesizes multiple chunks |
| PC-003 | Content not in knowledge | Ask about topic not in documents | Response says "I don't have information about that" or uses general knowledge |
| PC-004 | Exact quote retrieval | Ask for specific named entity from doc | Response includes exact text |
| PC-005 | Multi-document retrieval | 2 PDFs uploaded, question spans both | Response references both documents |

### 3.2 Knowledge + Tools Combined (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PC-006 | Knowledge + Calculator | "Based on the sales in my doc, what's 10% of $50,000?" | Uses knowledge for context + calculator for math |
| PC-007 | Knowledge + Web Search | "Compare my company policy to current market standards" | Uses knowledge + fetches web results |
| PC-008 | Knowledge + Weather | "What should I wear based on the dress code and today's weather?" | Uses knowledge for dress code + weather API |
| PC-009 | All tools together | Complex query requiring all tools | Agent orchestrates multiple tool calls |
| PC-010 | Tool priority (knowledge first) | Question answerable by both knowledge and web | Prefers knowledge source over web search |

### 3.3 Different File Type Retrieval (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PC-011 | PDF content retrieval | Upload PDF with tables/images/text | Text extracted and searchable |
| PC-012 | TXT content retrieval | Upload plain text file | Full content retrievable |
| PC-013 | DOCX content retrieval | Upload Word document | Formatted text extracted |
| PC-014 | MD content retrieval | Upload markdown file | Markdown sections indexed |
| PC-015 | CSV content retrieval | Upload CSV with data | Tabular data searchable |
| PC-016 | URL content retrieval | Add webpage URL | Web content searchable |
| PC-017 | Pasted text retrieval | Paste text manually | Pasted content searchable |

### 3.4 Multi-turn Conversations (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PC-018 | Follow-up questions | "What's the vacation policy?" → "How do I request it?" | Second response uses prior context + knowledge |
| PC-019 | Topic switch | Ask about Topic A → Ask about Topic B (both in docs) | Both answered from knowledge |
| PC-020 | Clarification | Vague question → Clarifying details | Agent uses clarification to refine search |
| PC-021 | Conversation persists | Chat → Close → Reopen | Previous messages and context preserved |
| PC-022 | New chat clears context | Click "New Chat" | Fresh conversation, but knowledge still works |

### 3.5 Canvas Playground Integration (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PC-023 | Chat in Canvas UI | Navigate to /canvas/{workflowId} → Use embedded playground | Chat works same as standalone playground |
| PC-024 | RAG nodes visible | View flow in Canvas | Knowledge retriever node visible in flow |
| PC-025 | Knowledge node connected | Check node connections | Retriever connected to agent node |
| PC-026 | Edit knowledge in Canvas | Modify retriever node settings | Changes reflected in chat behavior |

---

## 4. Canvas UI RAG Tests

### 4.1 RAG Flow Visualization (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| CV-001 | RAG template loads | Create agent with knowledge → View canvas | Flow includes RAG components |
| CV-002 | Knowledge Retriever node | Check for retriever node | Node visible with correct config |
| CV-003 | Vector store connection | Check node connections | Chroma/vector store properly connected |
| CV-004 | Embedding node | Check for embedding node | OpenAI embeddings node present |
| CV-005 | Document nodes | Check document processing | Document loader nodes visible |

### 4.2 Flow Modification (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| CV-006 | Modify chunk size | Edit retriever node → Change chunk size | New chunk size used in retrieval |
| CV-007 | Modify top_k results | Edit retriever → Change to 10 results | More results returned |
| CV-008 | Disconnect knowledge | Remove connection to retriever | Agent works without knowledge (fallback) |
| CV-009 | Add second retriever | Add another knowledge source manually | Both sources queried |
| CV-010 | Replace knowledge source | Point to different collection | New source used for retrieval |

---

## 5. Tool Combination Tests

### 5.1 Knowledge + Single Tool (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TC-001 | Knowledge + Calculator selected | Create agent with both | Both tools available in chat |
| TC-002 | Knowledge + Web Search selected | Create agent with both | Both tools work in chat |
| TC-003 | Knowledge + Weather selected | Create agent with both | Can check weather AND reference docs |
| TC-004 | Knowledge only (no other tools) | Create agent with only Knowledge Search | Agent answers from knowledge only |

### 5.2 Knowledge + Multiple Tools (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TC-005 | Knowledge + Calculator + Web Search | Create agent with all 3 | Agent can use any combination |
| TC-006 | All 4 tools selected | Knowledge + Calc + Web + Weather | All tools available |
| TC-007 | Tool switching in conversation | Use knowledge → Use calculator → Use knowledge again | Seamless tool transitions |
| TC-008 | Parallel tool use | Question requiring 2+ tools at once | Agent calls multiple tools |

### 5.3 Tool Deselection (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| TC-009 | Remove Knowledge Search later | Edit agent → Remove tool → Save | Knowledge no longer available |
| TC-010 | Remove other tools, keep knowledge | Edit → Remove calc/web → Save | Only knowledge works |
| TC-011 | Remove all tools | Edit → Remove all tools | Agent can only chat (no tools) |

---

## 6. Persistence and State Tests

### 6.1 Knowledge Source Persistence (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PS-001 | Sources persist after page refresh | Upload sources → Refresh → Check modal | Sources still present |
| PS-002 | Sources persist after logout/login | Upload → Logout → Login → Check | Sources still present |
| PS-003 | Sources tied to user | User A uploads → User B logs in | User B doesn't see A's sources |
| PS-004 | Sources tied to project | Upload in Project A → Switch to B | Sources not visible in Project B |
| PS-005 | Deleted sources stay deleted | Delete source → Refresh → Check | Source not in list |

### 6.2 Agent-Knowledge Association (P0)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PS-006 | Knowledge IDs saved to agent | Create agent with sources | knowledge_source_ids in database |
| PS-007 | Association persists after edit | Edit other fields → Save | knowledge_source_ids unchanged |
| PS-008 | Association loads on edit page | Navigate to edit page | Correct sources pre-selected |
| PS-009 | Duplicate agent copies sources | Duplicate agent | New agent has same source IDs |
| PS-010 | Export includes source IDs | Export agent to JSON | JSON contains knowledge_source_ids |
| PS-011 | Import restores source selection | Import JSON with source IDs | Agent linked to sources (if they exist) |

### 6.3 File Storage Persistence (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PS-012 | Uploaded files on disk | Upload PDF → Check storage path | File exists at uploads/knowledge/{user_id}/ |
| PS-013 | Files survive server restart | Upload → Restart backend → Check | Files still accessible |
| PS-014 | File deletion removes from disk | Delete source → Check storage | File removed from disk |
| PS-015 | Multiple uploads same name | Upload "doc.pdf" twice | Both stored (unique filenames) |

### 6.4 Workflow RAG Data Persistence (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| PS-016 | Chroma collection persists | Create RAG agent → Restart Langflow → Chat | Collection still queryable |
| PS-017 | Re-ingestion on update | Update knowledge sources → Recreate workflow | New sources ingested |
| PS-018 | Orphan collection cleanup | Delete agent with knowledge | Chroma collection cleaned up (if applicable) |

---

## 7. Error Handling and Edge Cases

### 7.1 Upload Errors (P1)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| EH-001 | Network error during upload | Simulate network failure | User-friendly error message |
| EH-002 | Server error during upload | Backend returns 500 | User-friendly error message |
| EH-003 | Timeout during upload | Very slow upload | Timeout message or retry option |
| EH-004 | Corrupted file upload | Upload corrupt PDF | Error: "Could not process file" |
| EH-005 | File with virus (if scanned) | Upload malicious file | Blocked with security message |

### 7.2 URL Fetch Errors (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| EH-006 | URL timeout | Add slow URL | Source shows "error" status |
| EH-007 | URL 404 | Add non-existent page URL | Error status with message |
| EH-008 | URL 500 | Add URL returning server error | Error status with message |
| EH-009 | URL with redirect loop | Add URL that redirects infinitely | Error after max redirects |
| EH-010 | URL blocked by CORS | Add URL that blocks fetching | Appropriate error handling |

### 7.3 RAG Retrieval Errors (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| EH-011 | OpenAI API failure | API key invalid/expired | Fallback to keyword search |
| EH-012 | Chroma unavailable | Vector store down | Graceful degradation message |
| EH-013 | Empty knowledge base | No chunks indexed | Agent says "no relevant info found" |
| EH-014 | Very large query | Submit 10,000 word question | Query truncated or handled |
| EH-015 | Unicode edge cases | Query with emojis/RTL text | Search still works |

### 7.4 Concurrent Access (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| EH-016 | Two users same source | User A and B add same URL | Both get their own copy |
| EH-017 | Delete while in use | Delete source while agent chatting | Chat continues with cached data |
| EH-018 | Rapid uploads | Upload 10 files quickly | All processed correctly |
| EH-019 | Rapid chat messages | Send 5 messages quickly | All responses generated |

### 7.5 Edge Cases (P2)

| Test ID | Scenario | Steps | Expected Result |
|---------|----------|-------|-----------------|
| EH-020 | Very small file (1 byte) | Upload 1-byte file | Handled gracefully |
| EH-021 | File exactly 10MB | Upload 10,485,760 bytes | Accepted or clear error |
| EH-022 | Filename 255 chars | Upload file with very long name | Name truncated safely |
| EH-023 | Unicode filename | Upload "文档.pdf" | Stored with safe filename |
| EH-024 | Document with only images | Upload PDF with no text | Appropriate handling (OCR or message) |
| EH-025 | Password-protected PDF | Upload encrypted PDF | Error: "Cannot process protected file" |

---

## 8. Cross-Browser and Performance Tests

### 8.1 Browser Compatibility (P3)

| Test ID | Scenario | Browser | Expected Result |
|---------|----------|---------|-----------------|
| CB-001 | Full workflow | Chrome | All features work |
| CB-002 | Full workflow | Firefox | All features work |
| CB-003 | Full workflow | Safari | All features work |
| CB-004 | Full workflow | Edge | All features work |

### 8.2 Performance Tests (P3)

| Test ID | Scenario | Metric | Expected Result |
|---------|----------|--------|-----------------|
| PF-001 | Modal open time | Time to interactive | < 500ms |
| PF-002 | File upload (1MB) | Upload + processing | < 10s |
| PF-003 | File upload (10MB) | Upload + processing | < 60s |
| PF-004 | URL fetch (fast site) | Fetch + processing | < 5s |
| PF-005 | RAG query response | Time to first token | < 5s |
| PF-006 | Large knowledge base (100 docs) | Query response | < 10s |
| PF-007 | Browse tab with 50 sources | Render time | < 1s |

---

## Test Data Requirements

### Sample Files Needed

| File Type | Name | Size | Content |
|-----------|------|------|---------|
| PDF | employee_handbook.pdf | ~500KB | Corporate policies, vacation, etc. |
| PDF | product_catalog.pdf | ~2MB | Product descriptions, prices |
| PDF | empty.pdf | ~1KB | Empty/minimal content |
| PDF | large.pdf | ~9MB | Large document near limit |
| PDF | protected.pdf | ~100KB | Password-protected |
| PDF | corrupted.pdf | ~50KB | Intentionally corrupted |
| TXT | notes.txt | ~10KB | Plain text notes |
| TXT | empty.txt | 0 bytes | Empty file |
| DOCX | report.docx | ~200KB | Formatted report |
| MD | readme.md | ~5KB | Markdown with headers/lists |
| CSV | sales_data.csv | ~50KB | Tabular sales data |
| CSV | large_data.csv | ~5MB | Large dataset |

### Sample URLs Needed

| URL Type | Example | Purpose |
|----------|---------|---------|
| Fast HTTPS | Wikipedia article | Normal fetch test |
| Slow response | httpbin.org/delay/5 | Timeout testing |
| 404 page | httpbin.org/status/404 | Error handling |
| 500 page | httpbin.org/status/500 | Server error test |
| Large page | Long Wikipedia article | Large content test |
| PDF URL | Direct link to PDF | PDF URL fetch |
| Protected | Page behind login | Auth error test |

### Sample Text Content

| Content Type | Description | Use Case |
|--------------|-------------|----------|
| Short text | 50 words | Minimal content test |
| Medium text | 500 words | Normal paste test |
| Long text | 10,000 words | Large paste test |
| Markdown | With formatting | Markdown preservation |
| Code snippet | Python/JS code | Code preservation |
| Unicode | Emojis, Chinese, Arabic | Unicode handling |

---

## Implementation Notes

### Playwright MCP Integration

The tests will use Playwright MCP server for browser automation:

```typescript
// Navigation
mcp__plugin_playwright_playwright__browser_navigate({ url: "http://localhost:3001/create" })

// Take snapshots
mcp__plugin_playwright_playwright__browser_snapshot()

// Click elements
mcp__plugin_playwright_playwright__browser_click({ element: "Knowledge Search button", ref: "button[data-tool='knowledge_search']" })

// Fill forms
mcp__plugin_playwright_playwright__browser_type({ element: "Agent name input", ref: "input[name='name']", text: "Test Agent" })

// File upload
mcp__plugin_playwright_playwright__browser_file_upload({ paths: ["/path/to/test.pdf"] })

// Wait for elements
mcp__plugin_playwright_playwright__browser_wait_for({ text: "File uploaded successfully" })

// Screenshot on failure
mcp__plugin_playwright_playwright__browser_take_screenshot({ filename: "test-failure.png" })
```

### Test Execution Order

1. **Setup**: Create test files, start services
2. **Knowledge Source Tests**: Upload/URL/Text management
3. **Agent Creation Tests**: Create agents with knowledge
4. **Chat Tests**: Test RAG retrieval in playground
5. **Canvas Tests**: Test visual flow editing
6. **Tool Combo Tests**: Multiple tools together
7. **Persistence Tests**: Refresh, restart, reload
8. **Error Tests**: Edge cases and failures
9. **Cleanup**: Delete test data

### Success Criteria

All P0 tests must pass for RAG feature to be considered complete.
P1 tests should pass before workshop/demo.
P2/P3 tests are nice-to-have for production hardening.

---

## Quick Reference: Test Count Summary

| Category | P0 | P1 | P2 | P3 | Total |
|----------|----|----|----|----|-------|
| Knowledge Source Management | 6 | 14 | 10 | 0 | 30 |
| Agent Creation with RAG | 9 | 11 | 0 | 0 | 20 |
| Playground Chat with RAG | 5 | 17 | 0 | 0 | 22 |
| Canvas UI RAG | 0 | 0 | 10 | 0 | 10 |
| Tool Combination | 0 | 8 | 3 | 0 | 11 |
| Persistence and State | 6 | 6 | 0 | 0 | 12 |
| Error Handling | 0 | 5 | 20 | 0 | 25 |
| Cross-Browser & Performance | 0 | 0 | 0 | 11 | 11 |
| **TOTAL** | **26** | **61** | **43** | **11** | **141** |

---

## Next Steps

1. Create test data files in `src/frontend/e2e/fixtures/knowledge-test-data/`
2. Implement tests in `src/frontend/e2e/tests/rag-comprehensive.spec.ts`
3. Add selectors to `src/frontend/e2e/helpers/selectors.ts`
4. Add test data to `src/frontend/e2e/helpers/test-data.ts`
5. Run tests with `npx playwright test tests/rag-comprehensive.spec.ts`
6. Use ralph-loop for iterative fixing until all pass
