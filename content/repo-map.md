---
id: repo_map_train_hybrid
version: 1.0.0
audience:
  - developers
  - maintainers
  - community
---

# Repo Map — Train Hybrid Chat + RAG + MCP-Ready

This repo is designed to be:
- RAG-first (content-driven)
- funnel-aware (routing policy)
- MCP-ready (agents + tools + contracts)

---

## 1) Content (source of truth)

### /content  (curated, human-maintained)
RAG corpus and system rules in Markdown.

- /content/system.md  
  Global assistant boundaries for public website chat.

- /content/knowledge/**  
  Public knowledge files (nutrition/endurance/strength).  
  **Must have frontmatter** (`type`, `access`, `topic_tags`).

- /content/recipes/**  
  Recipes and reusable meal components (protein anchors etc.).  
  **1 recipe per file** recommended.

- /content/rules/**  
  System-only policies (routing, safety, selection rules).  
  **Not used for user answers.**  
  Used by orchestrator/agents only.

- /content/locked/**  
  Restricted material (coaching logic).  
  **Never returned as answers**; only acknowledged + routed.

> Indexing rule: only `access: public` is eligible for direct answers.

---

## 2) Server runtime (Nuxt / Nitro)

### /server
Execution layer for the website chat.

- /server/api/chat.post.ts  
  Chat endpoint: receives user message → runs routing + retrieval + answer.

- /server/utils/rag.ts  
  Loading markdown, parsing frontmatter, chunking, retrieval scoring.

- /server/utils/routing.ts  
  Applies `answer_routing_policy.md` and decides answer vs route.

- /server/utils/safety.ts  
  Safety boundaries (nutrition: no diets prescribed, no medical advice etc.).

- /server/providers/* (optional)  
  LLM provider adapters (OpenAI, Anthropic, Gemini).  
  Must be replaceable without changing core system behavior.

---

## 3) MCP-Ready layer (future-proof)

### /agents
Agent architecture that can later be exposed as an MCP server.

- /agents/contracts/**  
  JSON Schemas for inputs/outputs (strict typing).
  Examples:
  - SearchRequest / SearchResponse
  - RouteDecision
  - AssistantReply

- /agents/tools/**  
  Tool wrappers (RAG search, doc fetch, policy eval).  
  Tools are deterministic and testable.

- /agents/subagents/**  
  Specialized agents (optional):
  - NutritionAgent
  - RecipeAgent
  - GeneralKnowledgeAgent
  - FunnelRouterAgent

- /agents/registry.ts  
  Routes tasks → agent → tools → result.  
  This becomes the heart of the MCP server later.

Principle:
> Contracts + Tools + Registry first. “Agent intelligence” second.

---

## 4) Tests & Golden Samples

### /tests
- /tests/golden/**  
  Golden samples: inputs + expected action + required/forbidden phrases.
- /tests/runner.ts  
  Runs golden samples locally/CI.

Goal:
> Refactors must not break routing, tone, and boundaries.

---

## 5) Docs

### /docs
- REPO_MAP.md (this file)
- BOT_PRD.md (optional, slim)
- SECURITY_DSGVO.md (data processing + privacy stance)
- MCP_PLAN.md (migration plan to full MCP server)

---

## 6) Non-negotiables (project rules)

- `access: locked` must never be answered.
- `/content/rules/**` must never be used as user-facing knowledge.
- Nutrition guidance must remain “structure over labels” (no diets prescribed).
- Routing decisions are product decisions, not model decisions.
