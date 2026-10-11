# Site Index Rules

## Rule 1: Only existing pages may be linked
The agent may only recommend links from the validated published site index.

It is forbidden to:
- invent URLs
- invent article titles
- invent draft pages
- invent temporary pages
- invent category pages that do not exist

## Rule 2: Only published pages are allowed
A page may only be used as a link target if it is:
- published = true
- indexable = true
- canonical = true

## Rule 3: Use IDs, not free URLs
The agent must recommend target pages by `target_id`, not by manually writing URLs.

Example:
- correct: `target_id: page_014`
- wrong: `/blog/best-hybrid-running-method`

## Rule 4: Only validated page types are allowed
Allowed page types:
- blog_article
- hub_page
- system_page
- product_page
- analysis_page
- athlete_story
- coach_page
- brand_page

## Rule 5: Prefer the primary authority page
If multiple pages are semantically close, prefer the main canonical authority page.

The agent must avoid linking to overlapping or competing pages when a stronger primary page exists.