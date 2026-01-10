# RAG Implementation Masterplan for Teach Charlie AI

**Date**: 2026-01-10
**Status**: PARTIALLY IMPLEMENTED - Keyword Fallback Working
**Priority**: Phase 2 Feature (Post-MVP)
**Approach**: Option B - Use Langflow's Built-in Components (with keyword fallback)

---

## Current Implementation Status (2026-01-10)

### What's Working ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Knowledge Source UI | ✅ Complete | Paste Text, Upload File, Add URL all working |
| File Storage | ✅ Complete | Per-user storage in uploads/knowledge/{user_id}/ |
| Database Schema | ✅ Complete | knowledge_source_ids column added to agent_components |
| Knowledge Search Tool | ✅ Complete | KnowledgeRetrieverComponent with keyword matching |
| Keyword-Based Search | ✅ Complete | Relevance scoring, chunking, top-k retrieval |
| Graceful Fallback | ✅ Complete | Auto-fallback when RAG ingestion fails |
| E2E Tests | ✅ Complete | All 3 source types tested and passing |

### What Needs Work ⚠️

| Feature | Status | Issue |
|---------|--------|-------|
| RAG Ingestion Flow | ❌ Failing | Template doesn't match Langflow's expected format |
| Vector Storage | ❌ Not Used | Chroma configured but ingestion fails |
| Semantic Search | ❌ Not Working | Falls back to keyword matching |
| OpenAI Embeddings | ❌ Not Used | Ingestion fails before embeddings run |

### Technical Details of Failure

When creating the RAG ingestion flow in Langflow, we get:
```
LangflowClientError: Document ingestion failed: RetryError
```

**Root Cause**: The manually created flow template (`templates/rag/ingest_documents.json`) doesn't exactly match Langflow's internal component structure. The node definitions, particularly for Chroma and OpenAIEmbeddings, need to be exported from a working Langflow flow rather than hand-crafted.

### Recommended Fix (Future)

1. **Export Real Template from Langflow**:
   - Create a working RAG ingestion flow manually in Langflow UI
   - Export the flow as JSON
   - Use the exported JSON as the template (with parameterization)

2. **Or Use Langflow API to Build Flow**:
   - Use `langflow.create_flow()` with minimal template
   - Add nodes programmatically via Langflow's node API
   - This ensures components match Langflow's expected format

---

## Executive Summary

### Original Plan (SUPERSEDED)
The original plan proposed building custom `VectorStoreService`, `EmbeddingClient`, and extensive backend infrastructure. After codebase analysis, this approach was found to:
- Violate "wrapper not fork" philosophy
- Require 19-20 days of work (too long for timeline)
- Rebuild functionality Langflow already provides

### New Plan: Langflow-Native RAG
Use Langflow's **built-in RAG components** via flow templates. This approach:
- Respects "wrapper not fork" philosophy
- Requires only 5-7 days of work
- Leverages proven, tested Langflow components
- No new backend services or database migrations needed

### Key Insight
**Langflow already has all the RAG components we need:**
- `File` component (document loading)
- `SplitText` component (chunking with overlap)
- `OpenAIEmbeddings` / `OllamaEmbeddings` (embedding generation)
- `Chroma` / `AstraDB` (vector storage & retrieval)
- `ParseData` component (result formatting)

We just need to create the right **flow templates** that use these components.

---

## Architecture Comparison

### OLD Approach (Custom Infrastructure) - REJECTED
```
Backend Services:
├── VectorStoreService (NEW)     ❌ Unnecessary
├── EmbeddingClient (NEW)        ❌ Unnecessary
├── ChunkingService (NEW)        ❌ Unnecessary
└── RAGConfig schema (NEW)       ❌ Overkill for MVP

Database Changes:
├── text_chunks table (NEW)      ❌ Unnecessary
├── embedding_model column       ❌ Unnecessary
└── chunk_metadata columns       ❌ Unnecessary

Problems:
- 19-20 days of work
- Violates "wrapper not fork"
- Rebuilds what Langflow provides
- Complex for solo founder to debug
```

### NEW Approach (Langflow-Native) - APPROVED
```
Backend Changes:
├── template_mapping.py          ✅ Minor updates
├── workflow_service.py          ✅ Minor updates
└── templates/rag_agent.json     ✅ NEW template file

Database Changes:
└── None required!               ✅ Uses existing schema

Benefits:
- 5-7 days of work
- Respects "wrapper not fork"
- Uses proven Langflow components
- Langflow handles embedding/storage/retrieval
- Easy to debug (it's just a flow template)
```

---

## Part 1: Langflow RAG Components (What We're Using)

### Available Components in Langflow

| Component | Purpose | Key Parameters |
|-----------|---------|----------------|
| **File** | Load PDF, TXT, DOCX, CSV, etc. | `path`, supports 40+ file types |
| **URL** | Fetch web content | `url`, recursive crawling |
| **SplitText** | Chunk documents | `chunk_size`, `chunk_overlap`, `separator` |
| **OpenAIEmbeddings** | Generate embeddings | `model`, `api_key` |
| **OllamaEmbeddings** | Local embeddings | `model` (all-minilm, nomic-embed) |
| **Chroma** | Vector store (local) | `collection_name`, `persist_directory` |
| **AstraDB** | Vector store (cloud) | `token`, `database`, `collection` |
| **ParseData** | Format retrieved chunks | `template`, `separator` |
| **Prompt** | Build LLM prompt | `template` with variables |

### Two-Flow Architecture Pattern

Based on research from open-source projects, the industry-standard pattern is:

```
FLOW 1: Ingestion (runs once per document upload)
┌─────────────────────────────────────────────────────────────┐
│  File/URL → SplitText → Embeddings → VectorStore (Ingest)  │
└─────────────────────────────────────────────────────────────┘

FLOW 2: Retrieval (runs on each chat message)
┌─────────────────────────────────────────────────────────────┐
│  ChatInput → Embeddings → VectorStore (Search) → Parser    │
│      ↓                                              ↓       │
│      └──────────────→ Prompt ←──────────────────────┘       │
│                          ↓                                  │
│                    Agent/LLM → ChatOutput                   │
└─────────────────────────────────────────────────────────────┘
```

### Simplified Single-Flow Pattern (For MVP)

Langflow's Chroma component supports both ingestion and retrieval in one flow:

```
┌─────────────────────────────────────────────────────────────┐
│ INGESTION SIDE:                                             │
│   File → SplitText → [Chroma ingestion input]               │
│                                                             │
│ RETRIEVAL SIDE:                                             │
│   ChatInput → Embeddings → [Chroma search input]            │
│                                 ↓                           │
│                          [Chroma results] → Parser          │
│                                                 ↓           │
│   ChatInput ──────────────────→ Prompt ←────────┘           │
│                                    ↓                        │
│                               Agent → ChatOutput            │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 2: Implementation Plan

### Phase 1: Create RAG Flow Templates (Days 1-2)

#### Task 1.1: Create Ingestion Template
**File**: `templates/rag/ingest_documents.json`

```
Purpose: Process uploaded documents into vector store
Components: File → SplitText → OpenAIEmbeddings → Chroma

Configurable:
- File path (injected at runtime)
- Collection name (user/workflow-specific)
- Chunk size (default: 1000)
- Chunk overlap (default: 200)
- Embedding model (default: text-embedding-3-small)
```

#### Task 1.2: Create RAG Agent Template
**File**: `templates/rag_agent.json`

```
Purpose: Chat agent with vector retrieval
Components: ChatInput → Embeddings → Chroma → Parser → Prompt → Agent → ChatOutput

Configurable:
- Collection name (same as ingestion)
- Number of results (default: 5)
- Search type (similarity, mmr)
- LLM provider (OpenAI, Anthropic)
```

#### Task 1.3: Export Component Templates from Langflow
- Start Langflow locally
- Build a working RAG flow manually
- Export as JSON
- Clean up and parameterize for template use

### Phase 2: Backend Integration (Days 3-4)

#### Task 2.1: Update template_mapping.py

```python
# Add new method for RAG template selection
def get_template_for_agent(
    self,
    selected_tools: List[str],
    knowledge_source_ids: List[str],
) -> str:
    """
    Select appropriate template based on agent configuration.

    Returns:
        - "agent_base" for simple agents
        - "rag_agent" for agents with knowledge sources
    """
    if knowledge_source_ids and len(knowledge_source_ids) > 0:
        return "rag_agent"
    return "agent_base"
```

#### Task 2.2: Update workflow_service.py

```python
# Modify create_from_agent to handle RAG flows
async def create_from_agent(self, user: User, data: WorkflowCreateFromAgent):
    component = await self._get_component(data.agent_component_id)

    # Determine template based on knowledge sources
    if component.knowledge_source_ids:
        # Step 1: Run ingestion flow to populate vector store
        await self._ingest_knowledge_sources(
            user=user,
            source_ids=component.knowledge_source_ids,
            collection_name=f"workflow_{workflow_id}",
        )

        # Step 2: Create chat flow with retrieval
        template_name = "rag_agent"
    else:
        template_name = "agent_base"

    # Create flow from template
    flow_data = self.mapper.create_flow_from_qa(
        template_name=template_name,
        collection_name=collection_name,  # Pass to RAG template
        ...
    )
```

#### Task 2.3: Add Ingestion Flow Runner

```python
async def _ingest_knowledge_sources(
    self,
    user: User,
    source_ids: List[str],
    collection_name: str,
) -> None:
    """
    Run ingestion flow to populate vector store with documents.

    Steps:
    1. Load ingestion template
    2. Configure with file paths from knowledge sources
    3. Run flow via Langflow API
    4. Wait for completion
    """
    # Get file paths for knowledge sources
    knowledge_service = KnowledgeService(self.session)
    sources = await knowledge_service.get_sources_by_ids(source_ids, user.id)

    file_paths = [
        knowledge_service.get_file_absolute_path(s)
        for s in sources
        if s.file_path
    ]

    # Load and configure ingestion template
    ingest_flow = self.mapper.load_template("rag/ingest_documents")
    ingest_flow = self.mapper.configure_ingestion(
        flow_data=ingest_flow,
        file_paths=file_paths,
        collection_name=collection_name,
        api_key=self._get_openai_key(user),
    )

    # Create and run ingestion flow
    flow_id = await self.langflow.create_flow(
        name=f"Ingest-{collection_name}",
        data=ingest_flow,
    )

    # Run flow to trigger ingestion
    await self.langflow.run_flow(flow_id, input_value="", session_id="ingest")

    # Optionally delete ingestion flow after completion
    await self.langflow.delete_flow(flow_id)
```

### Phase 3: Vector Store Configuration (Day 5)

#### Task 3.1: Configure Chroma Persistence

```yaml
# docker-compose.yml updates
services:
  langflow:
    volumes:
      - ./chroma_data:/app/chroma_data  # Persist vectors
    environment:
      - CHROMA_PERSIST_DIRECTORY=/app/chroma_data
```

#### Task 3.2: Collection Naming Strategy

```python
# Collection naming for user isolation
def get_collection_name(user_id: str, workflow_id: str) -> str:
    """
    Generate unique collection name for vector isolation.
    Format: tc_{user_id_prefix}_{workflow_id_prefix}
    """
    return f"tc_{user_id[:8]}_{workflow_id[:8]}"
```

#### Task 3.3: Configure Embedding API Keys

```python
# Inject OpenAI key into embedding nodes
def configure_embedding_node(node: Dict, api_key: str) -> Dict:
    template = node.get("data", {}).get("node", {}).get("template", {})
    if "openai_api_key" in template:
        template["openai_api_key"]["value"] = api_key
    return node
```

### Phase 4: Testing & Polish (Days 6-7)

#### Task 4.1: Manual Testing
- Upload PDF, test retrieval
- Upload DOCX, test retrieval
- Upload multiple files, test combined retrieval
- Test with different query types (exact match, paraphrase, conceptual)

#### Task 4.2: E2E Tests
```typescript
// e2e/tests/rag-flow.spec.ts
test('should retrieve relevant content from uploaded PDF', async () => {
  // Upload knowledge source
  // Create agent with knowledge source
  // Publish agent
  // Chat and verify relevant retrieval
});
```

#### Task 4.3: Error Handling
- Handle Chroma connection failures
- Handle embedding API errors
- Handle large file processing timeouts

---

## Part 3: Flow Template Details

### 3.1 Ingestion Flow Template Structure

```json
{
  "name": "Document Ingestion",
  "description": "Ingest documents into vector store",
  "data": {
    "nodes": [
      {
        "id": "File-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "File",
          "node": {
            "template": {
              "path": {
                "value": "{file_path}",
                "type": "file"
              },
              "silent_errors": {
                "value": false
              }
            }
          }
        }
      },
      {
        "id": "SplitText-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "SplitText",
          "node": {
            "template": {
              "chunk_size": {"value": 1000},
              "chunk_overlap": {"value": 200},
              "separator": {"value": "\n"}
            }
          }
        }
      },
      {
        "id": "OpenAIEmbeddings-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "OpenAIEmbeddings",
          "node": {
            "template": {
              "model": {"value": "text-embedding-3-small"},
              "openai_api_key": {"value": "{api_key}"}
            }
          }
        }
      },
      {
        "id": "Chroma-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "Chroma",
          "node": {
            "template": {
              "collection_name": {"value": "{collection_name}"},
              "persist_directory": {"value": "/app/chroma_data"},
              "allow_duplicates": {"value": false}
            }
          }
        }
      }
    ],
    "edges": [
      {"source": "File-{unique_id}", "target": "SplitText-{unique_id}"},
      {"source": "SplitText-{unique_id}", "target": "Chroma-{unique_id}"},
      {"source": "OpenAIEmbeddings-{unique_id}", "target": "Chroma-{unique_id}"}
    ]
  }
}
```

### 3.2 RAG Agent Flow Template Structure

```json
{
  "name": "RAG Agent",
  "description": "Agent with knowledge retrieval",
  "data": {
    "nodes": [
      {
        "id": "ChatInput-{unique_id}",
        "type": "genericNode",
        "data": {"type": "ChatInput"}
      },
      {
        "id": "OpenAIEmbeddings-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "OpenAIEmbeddings",
          "node": {
            "template": {
              "model": {"value": "text-embedding-3-small"},
              "openai_api_key": {"value": "{api_key}"}
            }
          }
        }
      },
      {
        "id": "Chroma-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "Chroma",
          "node": {
            "template": {
              "collection_name": {"value": "{collection_name}"},
              "persist_directory": {"value": "/app/chroma_data"},
              "number_of_results": {"value": 5},
              "search_type": {"value": "similarity"}
            }
          }
        }
      },
      {
        "id": "ParseData-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "ParseData",
          "node": {
            "template": {
              "template": {"value": "Document: {text}\nSource: {source}"},
              "sep": {"value": "\n\n---\n\n"}
            }
          }
        }
      },
      {
        "id": "Prompt-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "Prompt",
          "node": {
            "template": {
              "template": {
                "value": "You are {agent_persona}.\n\n## Context from Knowledge Base:\n{context}\n\n## Your Instructions:\n{agent_rules}\n\n## User Question:\n{question}\n\nAnswer based on the context above. If the answer is not in the context, say so honestly."
              }
            }
          }
        }
      },
      {
        "id": "Agent-{unique_id}",
        "type": "genericNode",
        "data": {
          "type": "Agent",
          "node": {
            "template": {
              "agent_llm": {"value": "{llm_provider}"},
              "model_name": {"value": "{model_name}"},
              "api_key": {"value": "{api_key}"},
              "system_prompt": {"value": "{system_prompt}"}
            }
          }
        }
      },
      {
        "id": "ChatOutput-{unique_id}",
        "type": "genericNode",
        "data": {"type": "ChatOutput"}
      }
    ],
    "edges": [
      {"source": "ChatInput-{unique_id}", "target": "OpenAIEmbeddings-{unique_id}"},
      {"source": "OpenAIEmbeddings-{unique_id}", "target": "Chroma-{unique_id}"},
      {"source": "Chroma-{unique_id}", "target": "ParseData-{unique_id}"},
      {"source": "ParseData-{unique_id}", "target": "Prompt-{unique_id}", "targetHandle": "context"},
      {"source": "ChatInput-{unique_id}", "target": "Prompt-{unique_id}", "targetHandle": "question"},
      {"source": "Prompt-{unique_id}", "target": "Agent-{unique_id}"},
      {"source": "Agent-{unique_id}", "target": "ChatOutput-{unique_id}"}
    ]
  }
}
```

---

## Part 4: Configuration Options

### Default Configuration (Sensible Defaults)

| Setting | Default | Rationale |
|---------|---------|-----------|
| Chunk Size | 1000 chars | Balances context and precision |
| Chunk Overlap | 200 chars (20%) | Prevents context loss at boundaries |
| Embedding Model | text-embedding-3-small | Best cost/quality ratio |
| Number of Results | 5 | Enough context without overwhelming |
| Search Type | similarity | Simple, fast, good for MVP |
| Vector Store | Chroma (local) | Zero config, free, persistent |

### Future Advanced Options (Phase 3)

| Setting | Options | UI Element |
|---------|---------|------------|
| Chunk Strategy | recursive, semantic, paragraph | Dropdown |
| Chunk Size | 256-4096 | Slider |
| Chunk Overlap | 0-500 | Slider |
| Embedding Provider | OpenAI, Ollama, HuggingFace | Dropdown |
| Number of Results | 1-20 | Slider |
| Search Type | similarity, mmr, hybrid | Dropdown |
| Similarity Threshold | 0.0-1.0 | Slider |

---

## Part 5: File Handling Strategy

### Current File Storage
```
uploads/
└── knowledge/
    └── {user_id}/
        └── {hash}.{ext}  # e.g., 21890f625a6e.docx
```

### Langflow File Access

**Challenge**: Langflow runs in Docker, needs access to files.

**Solution**: Mount uploads directory as Docker volume:

```yaml
# docker-compose.yml
services:
  langflow:
    volumes:
      - ./uploads:/app/uploads:ro  # Read-only access to user files
```

**File Path in Template**:
```python
# Convert relative path to Docker path
def get_langflow_file_path(source: KnowledgeSource) -> str:
    """Convert backend file path to Langflow container path."""
    # source.file_path = "knowledge/abc123/file.pdf"
    return f"/app/uploads/{source.file_path}"
```

---

## Part 6: Implementation Timeline

### Day 1: Template Research & Creation
- [ ] Start Langflow locally
- [ ] Build working RAG flow manually in Langflow UI
- [ ] Test with sample PDF
- [ ] Export flow as JSON
- [ ] Clean up JSON for template use

### Day 2: Template Finalization
- [ ] Create `templates/rag/ingest_documents.json`
- [ ] Create `templates/rag_agent.json`
- [ ] Add parameterization for collection_name, api_key, file_paths
- [ ] Test templates load correctly in template_mapping.py

### Day 3: Backend Integration - Ingestion
- [ ] Add `_ingest_knowledge_sources()` to workflow_service.py
- [ ] Add `configure_ingestion()` to template_mapping.py
- [ ] Update docker-compose.yml for Chroma persistence
- [ ] Test ingestion flow runs successfully

### Day 4: Backend Integration - Retrieval
- [ ] Add template selection logic (agent_base vs rag_agent)
- [ ] Add `configure_rag_agent()` to template_mapping.py
- [ ] Connect ingestion collection to retrieval flow
- [ ] Test end-to-end: upload → ingest → chat → retrieval

### Day 5: Docker & Persistence
- [ ] Configure Chroma persist_directory
- [ ] Mount volumes correctly in docker-compose.yml
- [ ] Test persistence across container restarts
- [ ] Implement collection cleanup for deleted workflows

### Day 6: Testing
- [ ] Manual testing with various file types
- [ ] Test with multiple knowledge sources
- [ ] Test query relevance (semantic vs keyword)
- [ ] Write E2E test for RAG flow

### Day 7: Polish & Documentation
- [ ] Error handling for edge cases
- [ ] Update user-facing documentation
- [ ] Code cleanup and comments
- [ ] PR review and merge

---

## Part 7: Success Criteria

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Semantic Search | None | Working | "price" matches "cost" |
| File Types | Text only | PDF, DOCX, TXT | Upload and query each |
| Retrieval Accuracy | ~30% | >70% | Manual evaluation of 10 queries |
| Query Latency | N/A | <3 seconds | Measure chat response time |
| Vector Persistence | None | Yes | Restart container, query still works |

---

## Part 8: Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Langflow component API changes | Pin Langflow version, test before upgrades |
| Chroma performance issues | Start with local, migrate to Astra if needed |
| Large file processing timeouts | Add progress indicator, chunk processing |
| Embedding API costs | Use text-embedding-3-small (cheapest), add usage tracking |
| Docker volume permissions | Test volume mounts early, document required permissions |

---

## Part 9: What We're NOT Doing (Deferred to Phase 3)

| Feature | Why Deferred |
|---------|--------------|
| Custom VectorStoreService | Langflow handles this |
| Database schema changes | Not needed for templates |
| Embedding caching | Premature optimization |
| Advanced UI settings | MVP uses sensible defaults |
| Multiple embedding providers | OpenAI first, others later |
| Hybrid search | Similarity search sufficient for MVP |
| Citation tracking | Nice-to-have, not MVP |

---

## Appendix: Key Research Findings

### From Open-Source Projects

1. **Two-Flow Architecture** (Langflow RAG System)
   - Separate ingestion from retrieval
   - Don't re-embed on every query
   - Use session IDs for conversation continuity

2. **Chunking Best Practices** (Agentic RAG Docling)
   - Recursive splitting respects document structure
   - 1000 chars with 200 overlap is industry standard
   - Preserve metadata (source, page number) for citations

3. **Local Development** (RAG with Ollama)
   - Chroma works great for local dev
   - Ollama embeddings for workshops (no API costs)
   - Persistent storage via persist_directory

4. **Simplicity** (RAG-based LLM Pipeline)
   - 4 components handle entire pipeline
   - Don't over-engineer for MVP
   - AstraDB for production scaling

### From Codebase Analysis

1. **Template Mapping Works Well**
   - Rule-based, deterministic
   - Easy to add new templates
   - Node ID generation prevents conflicts

2. **Langflow Client Ready**
   - create_flow, run_flow, delete_flow all work
   - Retry logic with exponential backoff
   - Health checks before operations

3. **File Storage Ready**
   - Files already stored per-user
   - File paths tracked in KnowledgeSource model
   - Content extraction works for PDF, DOCX, TXT

---

## References

- [Langflow Factory](https://github.com/Empreiteiro/langflow-factory) - Component patterns
- [Langflow RAG System](https://github.com/myusegtr/Langflow-based-RAG-system) - Astra DB integration
- [Agentic RAG Docling](https://github.com/nikolozGobejiShvili/Agentic-RAG-in-Langflow-using-Docling) - PDF processing
- [RAG with Ollama](https://github.com/siddharthlanke/rag-pipeline-using-langflow) - Local LLMs
- [Official Langflow Docs](https://docs.langflow.org/) - Component reference
- [Langflow Vector Store RAG](https://docs.langflow.org/starter-projects-vector-store-rag) - Official template
