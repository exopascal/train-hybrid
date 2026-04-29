---
name: write-science-article
description: Write a science-based blog article from provided studies, DOI links, PDFs, abstracts, or study summaries. Use this skill when the task is to transform scientific evidence into a clear, useful, benefit-oriented blog article for normal readers without distorting the evidence.
---

## WHEN TO USE THIS SKILL

Use this skill when:
- the user provides one or more scientific studies, DOI links, PDFs, abstracts, screenshots, or study summaries
- the task is to write a blog article from scientific evidence
- the article should be understandable, practical, and benefit-oriented
- the output should become a blog file at `content/blog/<slug>.md`
- optionally, the output should also become `content/blog-linked/<slug>.md` when explicitly requested

Do NOT use this skill when:
- the task is only to extract study data without writing an article
- the task is pure SEO page generation from keyword maps
- the task is internal linking only
- no scientific source is provided

## REQUIRED INPUT

You may receive:
- slug
- topic
- targetAudience
- source files, DOI links, study links, abstracts, screenshots, or study summaries
- optional HUMAN_STEERING instructions

If no usable scientific source is provided:
Return `ERROR_NO_STUDY_SOURCE`

If the source quality cannot be identified:
Return `ERROR_SOURCE_NOT_VERIFIABLE`

If the requested topic is not grounded in the provided evidence:
Return `ERROR_OUTSIDE_SOURCE_SCOPE`

## FILES TO FOLLOW

Read and follow these files before writing:
1. `agents/ai/science-blog/science-blog-agent.md`
2. `agents/ai/science-blog/science-blog-generator.md`
3. `agents/ai/science-blog/science-writing-guardrails.md`

If paths differ in the repository, use the equivalent science-blog files that contain:
- core agent logic
- generator workflow
- writing guardrails

## REPOSITORY AWARE PRECHECKS (MANDATORY)

Before writing, inspect repository conventions:

1. Read `AGENTS.md` in repo root and apply its rules.
2. Check how blog pages are rendered:
   - `pages/blog/index.vue`
   - `pages/blog/[slug].vue`
3. Check existing examples in:
   - `content/blog/`
   - `content/blog-linked/` (if present)

Then decide output target:

- Default: create `content/blog/<slug>.md` only.
- If user explicitly asks for linked variant: also create `content/blog-linked/<slug>.md`.
- Never assume both are required unless requested.

## TASK

Write a science-based blog article that:
- is scientifically correct
- is easy to understand
- is benefit-oriented
- explains practical relevance
- avoids exaggeration
- does not invent unsupported claims
- uses only the provided sources

## HUMAN STEERING

If the user provides HUMAN_STEERING, treat it as editorial guidance.

This may include:
- headline ideas
- focus points
- sections to include or avoid
- interpretations to explore
- highlighted findings
- tone guidance
- notes for specific sections

Follow HUMAN_STEERING where scientifically valid.

Do NOT follow steering that contradicts the evidence.
If steering conflicts with the evidence, adjust the interpretation so the final article remains scientifically correct.

## WRITING RULES

You must:
- simplify language without simplifying meaning
- explain technical terms in plain language
- translate findings into practical relevance
- clearly distinguish evidence, interpretation, and implication
- state limitations where necessary
- keep in-text citations minimal
- include a References section at the end in APA-style when possible
- assign one allowed category for breadcrumb/navigation:
  - `Ausdauer`
  - `Kraft`
  - `Praxis`
  - `Laufen`
  - `Radfahren`

You must NOT:
- invent findings
- overstate certainty
- confuse mechanism with outcome
- turn correlation into causation
- write hype copy
- make strong prescriptions that are not supported by the evidence
- add academic citation clutter throughout the article

## ARTICLE STRUCTURE

Default structure:
1. Headline
2. Intro
3. Die wichtigsten Nutzen für den Leser
4. Was untersucht wurde
5. Was die Ergebnisse wirklich sagen
6. Was das praktisch bedeutet
7. Grenzen der Aussagekraft
8. Fazit
9. References

Headlines may be popular-science and readable.

The article body must still:
- explain the study conditions
- specify the population where relevant
- describe the intervention or comparison where relevant
- mention relevant limitations
- avoid overstating certainty

## OUTPUT

Return ONLY the requested file content.

Default output path:
`content/blog/<slug>.md`

Optional second output path (only when requested):
`content/blog-linked/<slug>.md`

Frontmatter must include one valid category value:
- `category: "Ausdauer"` or
- `category: "Kraft"` or
- `category: "Praxis"` or
- `category: "Laufen"` or
- `category: "Radfahren"`

## VISIBILITY VALIDATION (MANDATORY AFTER WRITING)

After creating files, validate visibility assumptions:

1. Ensure slug matches filename exactly.
2. Ensure frontmatter includes:
   - `title`
   - `description`
   - `category`
   - `date` (ISO-like format `YYYY-MM-DD`)
3. Verify blog index query does not unintentionally include both `blog` and `blog-linked`.
4. If duplicates are likely due to prefix matching, recommend filtering by `_path.startsWith('/blog/')`.
5. Run `yarn build` when possible to confirm content is picked up.

## MANDATORY NEXT STEP: INTERNAL LINKING HANDOFF

Creating or updating this skill file is NOT a runtime trigger by itself.
The trigger is execution of an explicit next-step workflow.

After a science article is created, immediately start the internal-linking step.

Preferred one-command trigger:
`bash scripts/run-science-blog-pipeline.sh --slug=<slug>`

### Required handoff order

1. Load internal-linking specs:
   - `agents/ai/internal-linking/01-overview.md`
   - `agents/ai/internal-linking/02-site-index-rules.md`
   - `agents/ai/internal-linking/03-linking-rules.md`
   - `agents/ai/internal-linking/04-output-format.md`
   - `agents/ai/internal-linking/05-workflow-md`
   - `agents/ai/internal-linking/06-linking-limits.md`
   - `agents/ai/internal-linking/07-dynamic-fields.md`
2. Build internal-linking input from the just-created article:
   - article title
   - article slug
   - article text
   - main topic
   - target audience (if available)
3. Generate structured internal-link recommendations (JSON only).
4. Save output to:
   - `data/internal-linking/<slug>.json`
5. If `content/blog-linked/<slug>.md` exists, apply approved recommendations there.

### Output discipline for this handoff

- Never hallucinate URLs or targets.
- Use only validated, existing internal pages.
- Respect linking limits from `06-linking-limits.md`.
- Keep output machine-readable and deterministic.

No console explanations.
No strategy discussion.
No extra commentary.
