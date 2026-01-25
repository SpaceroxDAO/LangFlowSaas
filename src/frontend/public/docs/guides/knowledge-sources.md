# Adding Knowledge Sources

Knowledge sources make Charlie smarter by giving them information to reference. Think of it like giving a new employee a training manual!

## What Are Knowledge Sources?

Knowledge sources are documents, files, or content that Charlie can search when answering questions. Instead of making things up, Charlie looks up accurate information from your sources.

**Without knowledge sources:**
> "I don't have specific information about your product pricing."

**With knowledge sources:**
> "Based on our pricing guide, the Pro plan is $49/month and includes..."

## Types of Knowledge Sources

### 1. Plain Text
Copy and paste text directly into Teach Charlie AI.

**Best for:**
- FAQs
- Quick reference information
- Policies and guidelines

**Example:**
```
Return Policy:
- 30-day returns for most items
- Electronics must be unopened
- Refunds processed within 5-7 business days
```

### 2. File Upload
Upload documents from your computer.

**Supported formats:**
- PDF (`.pdf`)
- Text files (`.txt`)
- Markdown (`.md`)
- Word documents (`.docx`)
- CSV files (`.csv`)

**Best for:**
- Existing documentation
- Product manuals
- Training materials
- Data sheets

### 3. URL Fetching
Point Charlie to web pages to learn from.

**Best for:**
- Blog posts
- Help center articles
- Public documentation
- Product pages

> **Note:** URLs must be publicly accessible. Private or login-protected pages won't work.

## Adding Knowledge Sources

### Step 1: Open Agent Settings
1. Navigate to your agent
2. Click **"Edit"** or **"Settings"**
3. Find the **"Knowledge Sources"** section

### Step 2: Add Content

**For text:**
1. Click **"Add Text"**
2. Enter a name (e.g., "FAQ")
3. Paste your content
4. Click **"Save"**

**For files:**
1. Click **"Upload File"**
2. Select your file (max 10MB)
3. Wait for processing
4. Click **"Save"**

**For URLs:**
1. Click **"Add URL"**
2. Enter the full URL
3. Click **"Fetch"**
4. Review the extracted content
5. Click **"Save"**

### Step 3: Test It!
Go to the Playground and ask questions that require the knowledge you just added.

## How Charlie Searches Knowledge

When you ask a question, Charlie:

1. **Analyzes your question** - Understands what you're asking
2. **Searches knowledge sources** - Finds relevant information
3. **Retrieves context** - Pulls the most relevant passages
4. **Formulates response** - Combines knowledge with natural language

This is called **RAG** (Retrieval Augmented Generation) in AI terms, but you can think of it as Charlie checking their notes!

## Best Practices

### Organize Your Content
Break large documents into logical sections:

❌ One giant 100-page PDF
✅ Separate files for: Pricing, Features, FAQ, Policies

### Use Clear Headings
Charlie finds information faster when it's well-organized:

```markdown
## Return Policy

### Standard Returns
30-day return window for most items.

### Electronics Returns
Must be unopened with original packaging.
```

### Keep Content Updated
Outdated knowledge = wrong answers. Set a reminder to review and update your sources regularly.

### Remove Conflicting Information
If two sources say different things, Charlie might get confused. Ensure consistency across all sources.

### Add Context
Include metadata that helps Charlie understand the content:

```
Document: Product Pricing (Updated January 2024)
Audience: Sales team and customers
Note: All prices in USD
```

## Troubleshooting

### Charlie Doesn't Find the Right Information

**Possible causes:**
1. **Question phrasing** - Try asking differently
2. **Content isn't indexed** - Wait for processing to complete
3. **Content too vague** - Add more specific details to sources

### Charlie Makes Up Information

**Possible causes:**
1. **Information not in sources** - Add the missing content
2. **Creativity too high** - Lower the temperature setting
3. **Instructions unclear** - Add rule: "Only answer based on provided knowledge"

### File Upload Fails

**Possible causes:**
1. **File too large** - Maximum 10MB per file
2. **Unsupported format** - Use PDF, TXT, MD, DOCX, or CSV
3. **Corrupted file** - Try re-exporting from the source application

### URL Fetch Returns Partial Content

**Possible causes:**
1. **Dynamic content** - JavaScript-rendered pages may not fully load
2. **Login required** - Private pages can't be fetched
3. **Rate limiting** - Wait and try again

## Advanced: Knowledge Source Settings

### Search Threshold
Adjust how closely results must match the query:
- **Lower threshold** (0.5): More results, some may be less relevant
- **Higher threshold** (0.8): Fewer, more precise results

### Top-K Results
How many passages Charlie considers:
- **Low (3)**: Faster, uses most relevant only
- **High (10)**: Slower, considers more context

### Chunking Strategy
How documents are split for searching:
- **By paragraph**: Good for well-structured documents
- **By tokens**: Good for dense, technical content

## Example: Building a Support Knowledge Base

### Step 1: Gather Content
- FAQ document
- Product documentation
- Troubleshooting guides
- Policy documents

### Step 2: Upload in Sections
```
knowledge_sources/
├── FAQ.md
├── Product_Features.pdf
├── Troubleshooting_Guide.md
└── Policies/
    ├── Returns.txt
    └── Shipping.txt
```

### Step 3: Test Thoroughly
Ask questions from each document to verify:
- "What's your return policy?"
- "How do I reset my password?"
- "What features are in the Pro plan?"

### Step 4: Fill Gaps
If Charlie can't answer something, add that information to your sources!

---

Next: Learn about [Understanding Workflows](/resources/guides/workflows) to see how it all connects!
