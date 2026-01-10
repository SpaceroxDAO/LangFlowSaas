# Agentic RAG in Langflow using Docling - Research Documentation

**Repository**: https://github.com/nikolozGobejiShvili/Agentic-RAG-in-Langflow-using-Docling
**Research Date**: 2026-01-10
**Purpose**: Document agentic patterns, Docling integration, and novel RAG approaches for potential integration into Teach Charlie AI

---

## Executive Summary

This project implements a **Windows-compatible, CPU-only RAG system** that combines:
- **Docling** for robust PDF-to-Markdown extraction
- **TF-IDF + TruncatedSVD** for embeddings (no GPU required)
- **ChromaDB** for persistent vector storage
- **Langflow** for visual workflow building
- **Groq LLM** for low-latency inference

The key innovation is **accessibility-first design**: avoiding GPU dependencies and platform-specific DLLs to maximize compatibility on commodity hardware.

---

## 1. Docling PDF Ingestion

### What is Docling?

[Docling](https://github.com/docling-project/docling) is an open-source document conversion toolkit from IBM, now donated to the Linux Foundation. It provides:

- **Multi-format support**: PDF, DOCX, PPTX, XLSX, HTML, images, audio files
- **AI-powered layout understanding**: Uses computer vision models (not OCR) to identify page elements
- **Structure preservation**: Maintains document hierarchy (headings, sections, tables, figures)
- **Multiple export formats**: Markdown, HTML, JSON, DocTags

### Implementation in This Project

The project uses a **dual-parser strategy** with automatic fallback:

```python
def _read_docling(pdf_path: str) -> str:
    try:
        from docling.document_converter import DocumentConverter
        conv = DocumentConverter()
        res = conv.convert_single(pdf_path)
        return res.render_as_markdown()
    except Exception:
        return ""

def _read_pymupdf(pdf_path: str) -> str:
    try:
        import fitz
        txts: List[str] = []
        with fitz.open(pdf_path) as doc:
            for p in doc:
                txts.append(p.get_text("text"))
        return "\n\n".join(txts).strip()
    except Exception:
        return ""

def _read_pdf(pdf_path: str) -> Tuple[str, str]:
    txt = _read_docling(pdf_path)
    if txt and len(txt) > 50:
        return txt, "docling"
    txt = _read_pymupdf(pdf_path)
    return txt, "pymupdf"
```

**Key Pattern**: Docling is primary, PyMuPDF is fallback. This handles:
- **Complex PDFs**: Docling's AI understands layouts, tables, figures
- **Scanned PDFs**: PyMuPDF can handle simpler extractions when Docling fails
- **Graceful degradation**: System never crashes on problematic documents

### Metadata Preservation

Each document retains rich metadata for source attribution:

```python
meta = {
    "source": os.path.abspath(path),
    "title": os.path.splitext(os.path.basename(path))[0],
    "parser": parser,  # "docling" or "pymupdf"
}
```

---

## 2. Structured Chunking Strategies

### Header-Aware Splitting

The project uses **RecursiveCharacterTextSplitter** with markdown-aware separators:

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150,
    separators=["\n## ", "\n### ", "\n", " ", ""]
)
chunks = splitter.split_documents(base_docs)
```

**Chunking Hierarchy**:
1. `\n## ` - Split on H2 headers first (major sections)
2. `\n### ` - Then H3 headers (subsections)
3. `\n` - Paragraph breaks
4. ` ` - Word boundaries
5. `""` - Character-level (last resort)

**Rationale**: By respecting markdown headers, chunks maintain semantic coherence. A chunk about "Installation" won't arbitrarily merge with "Configuration" content.

### Chunk Metadata

Each chunk receives a unique identifier for citation:

```python
for i, d in enumerate(chunks):
    d.metadata["chunk_id"] = i
```

This enables precise source attribution in responses.

---

## 3. Vector Search Implementation

### TF-IDF + TruncatedSVD (LSA) Embeddings

Instead of neural embeddings (requiring GPU or ONNX), this project uses classical NLP:

```python
class SklearnTfidfEmbeddings(Embeddings):
    """TF-IDF -> TruncatedSVD to dense vectors (LSA)."""

    def __init__(self, model_path: str, fit_corpus: Optional[List[str]] = None, n_components: int = 384):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.decomposition import TruncatedSVD
        import joblib

        if fit_corpus is not None:
            vec = TfidfVectorizer(max_features=50000, ngram_range=(1, 2), dtype=float)
            X = vec.fit_transform(fit_corpus)
            k = min(n_components, max(2, X.shape[1] - 1))
            svd = TruncatedSVD(n_components=k, random_state=42)
            _ = svd.fit_transform(X)
            joblib.dump({"vectorizer": vec, "svd": svd}, model_path)
            self._vec, self._svd = vec, svd
        else:
            bundle = joblib.load(model_path)
            self._vec, self._svd = bundle["vectorizer"], bundle["svd"]

    def _embed(self, texts: Iterable[str]) -> List[List[float]]:
        X = self._vec.transform(list(texts))
        Xr = self._svd.transform(X)
        return Xr.astype(np.float32).tolist()
```

**Design Choices**:
- **384-dimensional vectors**: Standard size for compatibility
- **50,000 max features**: Captures rich vocabulary without memory issues
- **Bigrams (1,2)**: Captures phrases like "machine learning" as single features
- **Joblib persistence**: Model saved to disk, no retraining on restart

### ChromaDB Integration

```python
def get_chroma_store(embedding_function: Optional[Embeddings] = None) -> Chroma:
    if embedding_function is None:
        embedding_function = get_embeddings()
    return Chroma(persist_directory=_ensure_vector_dir(), embedding_function=embedding_function)
```

**Persistence Pattern**: The vector store is saved to `./vectorstore/`, eliminating redundant embedding calculations on subsequent runs.

### Retrieval Strategy

The agent uses **MMR (Maximal Marginal Relevance)** for diverse retrieval:

```python
retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 4})
```

**Why MMR?** It balances:
- **Relevance**: Returns documents matching the query
- **Diversity**: Avoids redundant/similar chunks
- **Coverage**: Provides broader context for complex questions

---

## 4. Source-Grounded Response Patterns

### Prompt Engineering for Grounding

The system enforces source grounding through explicit prompting:

```python
QA_TEMPLATE = """You are a precise assistant. Use ONLY the provided context to answer.
If the answer is not in the context, say you don't know.

Context:
{context}

Question:
{question}

Answer in the user's language. Cite inline like [title #chunk_id] when applicable."""
```

**Key Constraints**:
1. **ONLY use provided context** - Prevents hallucination
2. **Say "don't know" if not found** - Honest uncertainty
3. **Inline citations** - Traceability to source chunks

### Document Formatting for Context

Retrieved chunks are formatted with metadata:

```python
DOCUMENT_PROMPT = PromptTemplate(
    input_variables=["page_content", "title", "chunk_id", "source"],
    template="[Title: {title} | Chunk: {chunk_id} | Source: {source}]\n{page_content}\n",
)
```

This gives the LLM structured context to cite from.

### Source Attribution in Output

```python
def print_sources(sources: List) -> None:
    if not sources:
        print("Sources: (none)")
        return
    print("Sources:")
    for i, doc in enumerate(sources, 1):
        m = doc.metadata or {}
        print(f" {i}. {m.get('title','?')} (# {m.get('chunk_id','?')}) - {m.get('source','')}")
```

Every response includes:
- Document title
- Chunk ID for verification
- Full source path

---

## 5. Programmatic Usage Outside Langflow UI

### HTTP API Client

The project provides a standalone CLI client for Langflow flows:

```python
def run_client(flow_id: str, base_url: str = "http://localhost:7860") -> None:
    print(f"Langflow: {base_url} | Flow: {flow_id}")
    while True:
        q = input("\nQuestion (empty to quit): ").strip()
        if not q:
            break
        url = f"{base_url}/api/v1/run/{flow_id}"
        payload = {"input_type": "chat", "output_type": "chat", "input_value": q}
        try:
            res = requests.post(url, json=payload, timeout=120)
            res.raise_for_status()
            _print_chat_output(res.json())
        except Exception as e:
            print(f"Request failed: {e}")
```

**API Endpoint**: `POST /api/v1/run/{flow_id}`

**Request Payload**:
```json
{
  "input_type": "chat",
  "output_type": "chat",
  "input_value": "What is machine learning?"
}
```

**Response Parsing**:
```python
def _print_chat_output(resp: dict) -> None:
    content = None
    for out in resp.get("outputs", []):
        for od in out.get("outputs", []):
            if od.get("type") == "chat":
                msgs = od.get("messages", [])
                if msgs:
                    content = msgs[-1].get("data", {}).get("content")
    print(content or json.dumps(resp, ensure_ascii=False, indent=2))
```

### Standalone Agent (No Langflow Required)

The `run_agent.py` script provides a **pure Python RAG agent** without Langflow:

```python
def run_agent():
    vectorstore = get_chroma_store()
    retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 4})
    llm = build_llm()

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={
            "prompt": qa_prompt,
            "document_prompt": DOCUMENT_PROMPT,
            "document_variable_name": "context",
        },
        return_source_documents=True,
    )

    while True:
        q = input("\n Question: ").strip()
        out = qa_chain.invoke({"query": q})
        print(out.get("result"))
        print_sources(out.get("source_documents", []))
```

**This is valuable** because it shows the RAG can work independently, with Langflow purely as an optional visual layer.

---

## 6. Agentic Patterns

### Chain Orchestration

The project uses LangChain's `RetrievalQA` as the orchestration layer:

```
User Query → Retriever (MMR search) → Document Formatter → Prompt Template → LLM → Response + Sources
```

### LLM Integration

The agent supports multiple LLM backends:

```python
def build_llm():
    if ChatGroq is None:
        from langchain_community.chat_models import ChatOpenAI
        os.environ["OPENAI_API_KEY"] = GROQ_API_KEY
        os.environ["OPENAI_API_BASE"] = "https://api.groq.com/openai/v1"
        return ChatOpenAI(temperature=0, model=MODEL_NAME)
    return ChatGroq(temperature=0, model=MODEL_NAME, api_key=GROQ_API_KEY)
```

**Primary**: Groq (fast inference with Llama 3.1)
**Fallback**: OpenAI-compatible endpoint

### Langflow Flow Structure

The visual flow in Langflow follows this pipeline:

```
Chat Input → Text Input → Chroma DB → Parser (Stringify) → Prompt Template → Groq → Type Convert → Chat Output
```

**Key Insight**: The Langflow UI uses the **same pre-built vector store** created by the ingestion script, avoiding redundant embedding calculations.

---

## 7. Novel Approaches to RAG

### 1. CPU-First Design Philosophy

This project deliberately avoids GPU dependencies:

| Traditional RAG | This Project |
|-----------------|--------------|
| Sentence-BERT embeddings | TF-IDF + SVD |
| Requires GPU/ONNX | Pure scikit-learn |
| Complex installation | `pip install` only |
| Platform issues (DLLs) | Cross-platform |

### 2. Dual-Parser Robustness

The Docling + PyMuPDF fallback ensures **no document is unprocessable**:
- Docling handles complex layouts, tables, figures
- PyMuPDF handles scanned/simple PDFs
- Parser metadata enables debugging which method worked

### 3. Custom Langflow Component

The `TfidfSvdEmbeddings` component bridges the standalone TF-IDF model with Langflow:

```python
class TfidfSvdEmbeddings(Component):
    display_name: str = "TF-IDF + SVD (local)"
    description: str = "Loads utils.SklearnTfidfEmbeddings from your repo"

    inputs = [
        StrInput(name="model_path", value="vectorstore/tfidf_svd.joblib"),
        StrInput(name="project_root", value="", advanced=True),
    ]

    def build_embeddings(self) -> Embeddings:
        SklearnTfidfEmbeddings = self._import_utils(root)
        return SklearnTfidfEmbeddings(model_path=model_path, fit_corpus=None)
```

**Pattern**: External scripts prepare data, Langflow consumes it through custom components.

### 4. Separation of Concerns

| Component | Responsibility |
|-----------|---------------|
| `ingest.py` | PDF → Markdown → Chunks → Vectors |
| `utils.py` | Embedding + ChromaDB utilities |
| `run_agent.py` | Standalone RAG CLI |
| `run_langflow_client.py` | Langflow HTTP client |
| `components/embeddings/tfidf_svd.py` | Langflow integration |

This **modular architecture** allows:
- Testing each component independently
- Using the RAG with or without Langflow
- Swapping components (e.g., different embeddings)

---

## 8. Dependencies

```
# Document Processing
langflow
docling
docling-core
docling-parse
pymupdf
pytesseract
pillow

# LangChain Integration
langchain
langchain-community
langchain-groq

# Vector Storage
chromadb
faiss-cpu
fastembed
tiktoken

# Utilities
python-dotenv
requests
```

---

## 9. Startup Configuration

### PowerShell Script (Windows)

```powershell
# Set environment variables
$env:LANGFLOW_AUTO_LOGIN = "true"
$env:GROQ_API_KEY = "your-key-here"

# Start Langflow with custom components
python -m langflow run --components-path ".\components" --host 0.0.0.0 --port 7860
```

**Key**: `--components-path` loads the custom TF-IDF embedding component.

---

## 10. Relevance to Teach Charlie AI

### Patterns to Consider

1. **Custom Component Architecture**: This project shows how to extend Langflow with custom components that bridge external functionality (TF-IDF models) into the visual editor.

2. **Programmatic API Usage**: The HTTP client pattern (`/api/v1/run/{flow_id}`) is directly applicable to Teach Charlie's playground integration.

3. **Source-Grounded Responses**: The citation pattern (chunk IDs, document titles) could enhance Charlie's trustworthiness for educational content.

4. **Fallback Strategies**: The Docling → PyMuPDF pattern is valuable for handling diverse user-uploaded documents.

### Implementation Recommendations

1. **For Document Upload Feature**: Consider Docling for extracting structured content from PDFs that educators upload as knowledge bases.

2. **For Playground Chat**: The `RetrievalQA` chain pattern with source attribution could make Charlie's responses more transparent.

3. **For Custom Components**: If adding new Langflow components, follow this project's pattern of external utilities + lightweight component wrappers.

---

## Sources

- [GitHub Repository: Agentic-RAG-in-Langflow-using-Docling](https://github.com/nikolozGobejiShvili/Agentic-RAG-in-Langflow-using-Docling)
- [Docling Official Documentation](https://docling-project.github.io/docling/)
- [Docling GitHub Repository](https://github.com/docling-project/docling)
- [Langflow Blog: Convert PDFs to Markdown with Docling](https://www.langflow.org/blog/convert-pdf-to-markdown-docling-langflow)
- [IBM Research: Docling for Generative AI](https://research.ibm.com/blog/docling-generative-AI)
- [IBM Granite-Docling Announcement](https://www.ibm.com/new/announcements/granite-docling-end-to-end-document-conversion)
