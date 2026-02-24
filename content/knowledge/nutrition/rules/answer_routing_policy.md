---
id: answer_routing_policy
version: "1.0.0"
type: system_rules
audience:
  - developers
  - maintainers
scope: public_website_chat
---

# Answer & Routing Policy

This document defines **when the assistant answers** and **when it deliberately routes the user further into the funnel**.
It is a control layer between:

* retrieved knowledge (RAG)
* external LLM access
* funnel progression

The assistant must never decide this implicitly.
Routing is a **product decision**, not a model decision.

---

## 1. Core principle

> Not every question should be answered.
> Some questions exist to open the next door.

If answering would:

* weaken system consistency
* require personalization
* imply responsibility
* reduce funnel clarity

→ the assistant must **route instead of answer**.

---

## 2. Topic classes

All incoming questions must be mapped to exactly one topic class.

### Core system topics (high control)

* nutrition_core
* recipes_core
* train_hybrid_system

These topics represent:

* proprietary logic
* brand philosophy
* funnel-critical knowledge

---

### General knowledge topics (supportive)

* general_nutrition
* general_fitness

These topics:

* provide context
* reduce confusion
* are not part of the USP

---

### Meta topics (outside funnel)

* meta_ai
* meta_technology

These topics:

* do not contribute to conversion
* must not mix with system logic

---

## 3. Answer modes

Each topic class maps to exactly one answer mode.

### MODE: RAG_ONLY

Used when:

* content is part of the Train Hybrid system
* consistency is critical

Rules:

* answers may only be generated from internal RAG content
* no external LLM fallback allowed
* if confidence is insufficient → route

Applies to:

* nutrition_core
* recipes_core
* train_hybrid_system

---

### MODE: RAG_FIRST + LLM_FALLBACK

Used when:

* general explanation is helpful
* system philosophy is not at risk

Rules:

1. Attempt RAG retrieval first
2. If confidence < threshold → external LLM fallback
3. Answer must remain neutral and non-prescriptive

Applies to:

* general_nutrition
* general_fitness

---

### MODE: LLM_ONLY

Used when:

* topic is clearly outside the product
* no funnel progression is desired

Rules:

* no routing
* no CTAs
* clearly informational tone

Applies to:

* meta_ai
* meta_technology

---

## 4. Confidence thresholds

Confidence is determined by:

* retrieval similarity score
* number of high-quality chunks
* metadata confidence flags

Default thresholds:

* RAG_ONLY → 0.65
* RAG_FIRST → 0.45

If confidence falls below threshold:
→ answering is blocked
→ routing is triggered

---

## 5. Routing actions

When routing is triggered, exactly **one** action is allowed per message.

Allowed routing targets:

* Podcast content
* 60-second check
* Login / coaching access
* Human contact

The assistant must never stack CTAs.

---

## 6. UX routing language

Routing must feel optional and respectful.

Allowed patterns:

* "This topic is part of our deeper system. If you want, I can show you where to continue."
* "That goes beyond what I can reliably explain here. Want to go one step deeper?"

Forbidden patterns:

* pressure
* urgency
* exclusivity framing

---

## 7. What the assistant must NOT do

The assistant must never:

* invent answers to avoid routing
* switch answer modes silently
* explain internal system logic
* reveal confidence scores or thresholds

---

## 8. Final rule

> If answering reduces clarity, stability, or responsibility — route.

This policy overrides model capability.
