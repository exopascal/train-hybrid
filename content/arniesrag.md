---
id: arnies_rag_playbook
title: "ArniesRag — RAG Playbook (Train Hybrid / EXOPEK)"
version: "1.0.0"
audience:
  - developers
  - maintainers
  - community
purpose:
  - define RAG pipeline standards
  - reduce hallucinations
  - keep costs low
  - stay DSGVO-robust
stack: "Vue/Nuxt + optional n8n + vector store"
---

# ArniesRag — RAG Playbook

This document defines how we prepare, index, retrieve, and answer with RAG.
Goal: reliable answers, low hallucinations, low API cost, and clean funnel boundaries.

---

## 1. Data preparation (Markdown first)

Preferred format: Markdown (.md) with frontmatter metadata.

Rules:

* Remove redundant or irrelevant content.
* Prefer small, focused files over large monolithic documents.
* Clean scraped data (navigation, footers, repeated headers).

---

## 2. Vector database

After Markdown is prepared, documents are embedded and stored in a vector database.

Supported options:

* Supabase (pgvector)
* Qdrant
* FAISS (local)
* Pinecone

Choice depends on cost, hosting, and operational complexity.

---

## 3. Embeddings

Use one embeddings model consistently per index.

Common choice:

* OpenAI: text-embedding-3-small

Alternatives (local setups):

* nomic-embed-text

Rules:

* Same embedding model
* Same vector dimension
* Rebuild index if model changes

---

## 4. Chunking

Recommended chunk sizes:

* Long narrative text: 2000–5000 tokens
* Dense knowledge text: 800–2000 tokens
* Data-heavy or numeric text: 400–800 tokens

Overlap:

* 5–8% of chunk size

---

## 5. Top-K retrieval

Top-K defines how many chunks are retrieved.

Defaults:

* Start with Top-K = 4
* Increase to 10–20 for broader questions

Tradeoff:

* Higher Top-K increases accuracy but also cost and latency

---

## 6. Metadata

Each chunk should include metadata.

Recommended fields:

* id
* type (knowledge | recipe | rules | podcast | locked)
* access (public | teaser | locked)
* topic_tags
* source
* cta_href (optional)
* cta_label (optional)

---

## 7. Search method

### Similarity Search

* Default method
* Fast and reliable with good chunking

### Max Marginal Relevance (MMR)

* Improves diversity and reduces redundancy
* Recommended settings:

  * Lambda: 0.5–0.8
  * Top-K: 10–20

Optional:

* Minimum similarity score (e.g. > 0.25)

---

## 8. LLM temperature

Recommended:

* 0.2–0.4 for factual, grounded answers

Lower temperature reduces hallucinations.

---

## 9. Re-ranking

If retrieval quality is inconsistent:

* add a re-ranking step (e.g. via n8n)
* re-rank candidate chunks before answering

---

## 10. LLM choice

Model quality affects wording, not grounding.

Strong options:

* Claude (Sonnet / Opus)
* GPT-4o-class
* Gemini Pro-class

System must remain provider-agnostic.

---

## 11. Namespaces / collections

Separate data by domain.

Examples:

* nutrition_knowledge
* recipes
* podcasts
* train_hybrid_rules

This improves precision and prevents topic bleed.

---

## 12. Record manager

Use a record manager to avoid duplicates when updating the index.

Options:

* SQLite
* Supabase table

Track:

* document hash
* chunk IDs
* last update timestamp

---

## Additional strategies

### Contextual Retrieval

Enhance chunks with surrounding context during indexing.

### GraphRAG / LightRAG

Can improve holistic queries but require testing.

### Cache-Augmented Generation

Use caching when data does not need long-term storage.

### Structured data

Exact facts belong in SQL or spreadsheets, not vector stores.

---

## Do / Don’t (Train Hybrid website chat)

DO:

* Separate knowledge, recipes, and rules
* Require evidence before answering
* Route when confidence is low
* Respect access levels

DON’T:

* Invent training plans
* Personalize without consent
* Mix internal IDs with analytics or marketing IDs
* Train models on chat logs by default

---

## Testing checklist

* Test across topics
* Test low-confidence queries
* Tune chunk size and Top-K
* Compare similarity vs MMR
* Monitor cost and latency
