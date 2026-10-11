# Dynamic Fields for Internal Linking

## Purpose
Define a stable field contract between:
- internal-linking agent output
- backend validation
- frontend rendering in blog article pages

The structure is designed for:
- inline links in article body
- one mid-article card
- one conversion card
- sticky sidebar related articles

## Dynamic Field Contract (Agent Output)

```json
{
  "article_id": "blog_001",
  "inline_links": [
    {
      "target_id": "blog_002",
      "anchor_text": "Laufökonomie",
      "placement_hint": "section_2"
    },
    {
      "target_id": "blog_004",
      "anchor_text": "Minimal Effective Dose",
      "placement_hint": "section_4"
    }
  ],
  "mid_article_card": {
    "type": "related_article",
    "target_id": "blog_003",
    "headline": "Warum Ausdauertraining dich nicht vor Muskelabbau schützt",
    "text": "Warum Ausdauer allein nicht reicht, um Muskulatur langfristig zu erhalten."
  },
  "conversion_card": {
    "type": "analysis_cta",
    "target_id": "page_analysis",
    "headline": "Finde heraus, wie viel Krafttraining du wirklich brauchst",
    "cta_label": "Hybrid-Analyse starten"
  },
  "related_articles": [
    "blog_002",
    "blog_003",
    "blog_004"
  ]
}
```

## Field Definitions

### article_id
- source article identifier
- must match backend source article mapping

### inline_links
- list of contextual inline links
- each object requires:
  - `target_id`
  - `anchor_text`
  - `placement_hint`

Allowed `placement_hint` values:
- `section_1`
- `section_2`
- `section_3`
- `section_4`
- `section_5`
- `read_45`
- `read_85`

### mid_article_card
- single contextual recommendation block
- used around mid-read depth
- required fields:
  - `type` (currently: `related_article`)
  - `target_id`
  - `headline`
  - `text`

### conversion_card
- single conversion block
- appears late in article flow
- required fields:
  - `type` (currently: `analysis_cta`)
  - `target_id`
  - `headline`
  - `cta_label`

### related_articles
- IDs for sidebar recommendations
- rendered in sticky right column

## Placement & Rendering Rules

## Inline links
- inject into relevant paragraphs by section mapping
- hard limits from `06-linking-limits.md` apply
- max 1 inline link per paragraph

## Mid-article card
- preferred placement: around `read_45`
- fallback: after section 2

## Conversion card
- preferred placement: around `read_85`
- fallback: after section 4 or before conclusion

## Sticky sidebar (right 40%)
- render `related_articles`
- max 3 cards by default
- if more provided, keep highest-ranked first 3

## Validation Rules (Backend)

The backend must validate before render:
- source `article_id` exists and is published
- all `target_id` exist and are published
- target types are allowed for requested field
- no self-linking (`target_id` != `article_id`)
- limits from `06-linking-limits.md` are respected
- only allowed fields are accepted (reject unknown fields)

If validation fails:
- drop invalid item
- keep valid items
- log reason per rejected item

## Allowed Target Type Mapping

- `inline_links.target_id`: `blog_article`, `hub_page`, `system_page`
- `mid_article_card.target_id`: `blog_article`, `hub_page`, `system_page`
- `conversion_card.target_id`: `analysis_page`
- `related_articles[]`: `blog_article`

## Clean Workflow

### Step 1: Input
System passes:
- article text/content sections
- article_id
- validated site index
- linking limits
- allowed field schema

### Step 2: Agent Recommendation
Agent returns structured dynamic fields only.

### Step 3: Backend Validation
Backend validates:
- targets exist
- limits are respected
- fields are allowed

### Step 4: Frontend Render
Frontend renders approved blocks:
- inline links in content
- mid article card (around 45%)
- conversion card (around 85%)
- sticky related articles on right side

## Output Discipline for Agent

The agent must return:
- JSON only
- no prose
- no extra keys
- no invented targets

If no valid recommendations are possible:
- return empty arrays/empty cards with valid schema
- do not hallucinate targets
