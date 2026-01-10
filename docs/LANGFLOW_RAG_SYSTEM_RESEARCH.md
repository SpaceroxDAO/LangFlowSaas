# Langflow-Based RAG System Research

**Repository**: https://github.com/myusegtr/Langflow-based-RAG-system
**Research Date**: 2026-01-10
**Purpose**: Understand RAG implementation patterns for Teach Charlie AI platform

---

## Executive Summary

This repository demonstrates a production-ready RAG (Retrieval-Augmented Generation) system built with Langflow and Astra DB. The implementation shows two distinct architectural patterns:
1. **Document QA Flow** - Direct file ingestion to vector store with semantic retrieval
2. **Agent-Based Multi-Tool Flow** - Combines URL fetching, PDF processing, and agent reasoning

Key takeaways for Teach Charlie AI:
- Two-flow architecture separates data ingestion from query handling
- Astra DB provides managed vector storage with automatic embedding generation
- URL fetching enables web content as a knowledge source
- Agent patterns enable multi-source querying with tool composition

---

## Architecture Overview

### Flow 1: Document QA Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│    File     │───►│  SplitText  │───►│   AstraDB       │
│  Component  │    │  (Chunker)  │    │  Vector Store   │
└─────────────┘    └─────────────┘    └────────┬────────┘
                                               │
                                               ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│    Chat     │◄───│   Google    │◄───│    Prompt       │
│   Output    │    │  Generative │    │   Template      │
└─────────────┘    │     AI      │    └────────┬────────┘
                   └─────────────┘             │
                                               │
                   ┌─────────────┐    ┌────────┴────────┐
                   │    Chat     │───►│    Parser       │
                   │    Input    │    │  (Formatter)    │
                   └─────────────┘    └─────────────────┘
```

### Flow 2: Agent-Based Multi-Tool Pipeline

```
┌─────────────┐                      ┌─────────────────┐
│  PDF/File   │───►┌───────────┐───►│                 │
│   Upload    │    │  Parser   │    │                 │
└─────────────┘    └───────────┘    │                 │
                                    │     Agent       │
┌─────────────┐    ┌───────────┐    │   (Groq LLM)    │
│    URL      │───►│    URL    │───►│                 │
│   Input     │    │  Loader   │    │   + Tools:      │
└─────────────┘    └───────────┘    │   - Calculator  │
                                    │   - URL Fetcher │
                                    │   - Doc Parser  │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Chat Output    │
                                    └─────────────────┘
```

---

## Key Components & Configuration

### 1. Document Ingestion

#### File Component
- **Supported Formats**: PDF, CSV, TXT, and 40+ other formats via Docling
- **Processing**: Parallel processing with configurable workers
- **Output**: Raw text or structured data for downstream processing

#### SplitText Component (Text Chunker)
```json
{
  "chunk_size": 1000,
  "chunk_overlap": 200,
  "separator": "\n"
}
```

**Best Practices**:
- Chunk size of 1000 characters balances context vs. retrieval precision
- 200 character overlap prevents context loss at chunk boundaries
- Newline separator respects natural document structure

#### Parser Component
- Template: `"Text: {text}"`
- Converts DataFrame/Data objects to plain text
- Essential for normalizing different input formats

### 2. Vector Storage (Astra DB)

#### Configuration Parameters
| Parameter | Value | Notes |
|-----------|-------|-------|
| Database | `mydb` | User-created Astra DB instance |
| Collection | `footwear` (example) | Up to 8 collections supported |
| Region | `us-east-2` | AWS region for production |
| Search Type | Similarity | Semantic matching |
| Number of Results | 4 | Top-k retrieved documents |

#### Embedding Options

**Option A: Astra Vectorize (Recommended)**
- Automatic embedding generation at ingestion time
- Uses `$vectorize` keyword in data
- No separate embedding component needed
- Supported models: OpenAI, NVIDIA, etc.

**Option B: Bring Your Own Embeddings**
- Separate embedding component in Langflow
- More control but additional complexity
- Must match collection's vector dimensions

#### Embedding Models Used in Repository
- **NVIDIA NV-Embed-QA**: Used in Document QA flow
- **OpenAI text-embedding-3-small**: Common alternative

### 3. URL/Web Content Fetching

#### URL Component Configuration
```json
{
  "recursive_crawling": true,
  "depth_control": "configurable",
  "domain_containment": true,
  "async_loading": true,
  "output_format": "text (HTML stripped)",
  "parser": "BeautifulSoup"
}
```

**Features**:
- Recursive link crawling with configurable depth
- Domain restriction to prevent external crawling
- HTML-to-text conversion via BeautifulSoup
- Async loading for performance

### 4. LLM Configuration

#### Google Generative AI (Primary)
```json
{
  "model": "gemini-1.5-pro",
  "temperature": 0.1,
  "max_output_tokens": 500,
  "system_message": "Search vector store for document-specific queries"
}
```

#### Groq (Agent Flow)
```json
{
  "model": "deepseek-r1-distill-llama-70b",
  "max_iterations": 15,
  "tools": ["calculator", "url_fetcher", "document_parser", "current_date"]
}
```

### 5. Prompt Template Pattern

```
Template Variables: {context}, {question}

Prompt Structure:
"Given the context above, answer the question.

Context: {context}

Question: {question}"
```

---

## Conversational QA Retrieval Pattern

### Two-Flow Architecture (Recommended)

**Load Data Flow** (runs once or periodically):
1. Accept document upload
2. Parse and chunk content
3. Generate embeddings
4. Store in vector database

**Retriever Flow** (handles each query):
1. Accept user question via Chat Input
2. Embed the question
3. Similarity search against vector store
4. Retrieve top-k chunks
5. Format retrieved context
6. Construct prompt with context + question
7. Send to LLM
8. Return response via Chat Output

### Session Management
- Langflow supports session persistence via `session_id`
- JavaScript client maintains conversation context
- Each session has isolated chat history

---

## Scaling Considerations & Limitations

### Known Limitations (from README)
1. **Token Limits**: "Large multi-page PDFs exceeded the token/quota limit"
   - **Mitigation**: Implement preprocessing and aggressive chunking

2. **Multi-Source Latency**: Multiple Astra DB retrievers increase response time
   - **Mitigation**: Use distinct retriever names (e.g., `FinanceRetriever`)
   - Consider query routing to specific collections

### Scaling Recommendations
1. **Periodic Re-ingestion**: Schedule document updates as source content changes
2. **Data Quality**: Clean, well-structured documents produce better results
3. **Embedding Dimension Matching**: Collection dimensions must match embedding model
4. **Hybrid Search**: Astra DB supports combining vector + lexical search

---

## Integration Patterns

### MCP Protocol Support
The repository mentions MCP (Model Context Protocol) integration, enabling:
- Langflow flows as callable tools for external applications
- API-first deployment patterns
- Integration with Claude and other MCP-compatible systems

### Embedded Chat
Langflow flows can be embedded via `<langflow-chat>` web components:
```html
<langflow-chat
  flow-id="your-flow-id"
  host="your-langflow-instance">
</langflow-chat>
```

### REST API / JavaScript Client
```javascript
import { LangflowClient } from '@datastax/langflow-client';

const client = new LangflowClient({
  apiKey: process.env.LANGFLOW_API_KEY,
  baseUrl: 'https://your-instance.langflow.astra.datastax.com'
});

const response = await client.runFlow({
  flowId: 'your-flow-id',
  input: 'What is the return policy?',
  sessionId: 'user-session-123'
});
```

---

## Application to Teach Charlie AI

### Immediate Opportunities

1. **Document-Based Agent Knowledge**
   - Allow users to upload PDFs/CSVs as agent knowledge base
   - Use SplitText chunking with 1000/200 configuration
   - Store in Astra DB per-project or per-agent

2. **URL Knowledge Sources**
   - Enable agents to reference website content
   - Use URL component for initial fetch
   - Optionally refresh periodically

3. **Template Enhancement**
   - Add RAG capability to existing templates
   - Pre-configure vector store connections
   - Use Astra Vectorize for simplified embedding

### Architecture Recommendations

**Per-User Collections**:
- Create Astra DB collection per user or project
- Isolates knowledge bases
- Enables usage tracking per collection

**Two-Flow Pattern**:
- Separate ingestion from querying
- Run ingestion on document upload
- Keep query flow lightweight

**Hybrid Approach**:
- Combine agent tools with RAG retrieval
- Use URL fetcher for dynamic web content
- Use vector store for static documents

---

## Repository File Reference

| File | Purpose | Size |
|------|---------|------|
| `Vector Store RAG1.json` | Document QA flow configuration | 192 KB |
| `Agent URL data fetch & PDF searching.json` | Agent multi-tool flow | 143 KB |
| `Astradb_RAG.PNG` | Architecture diagram | 143 KB |
| `Pdf_search_URL_data_fetch.PNG` | Agent flow diagram | 194 KB |

---

## Sources

- [Langflow-based-RAG-system Repository](https://github.com/myusegtr/Langflow-based-RAG-system)
- [Langflow Vector Stores Documentation](https://docs.langflow.org/components-vector-stores)
- [Vector Store RAG Starter Project](https://docs.langflow.org/starter-projects-vector-store-rag)
- [Create a Vector RAG Chatbot](https://docs.langflow.org/chat-with-rag)
- [Building ResumAI with Langflow & Astra DB](https://www.langflow.org/blog/building-resumai-langflow-astra-db-openai)
- [LangFlow RAG Tutorial Guide 2025](https://www.leanware.co/insights/langflow-rag-guide)
- [PDF RAG with LangFlow and Firecrawl](https://www.firecrawl.dev/blog/pdf-rag-system-langflow-firecrawl)
