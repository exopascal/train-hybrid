# Multi-Agent Setup

This folder contains agent role docs and a simple runner script to launch multiple agents locally.

## Agents
- `agents/ai/seo/seo-agent.md`
- `agents/ai/science-blog/science-blog-agent.md`
- `agents/ai/chat/chat-agent.md`
- `agents/ai/internal-linking/01-overview.md` (+ related internal-linking specs)

## Run (local)
Use the runner and provide a command template that your local agent CLI understands.

Example (template placeholders):
- `{name}` = agent name
- `{file}` = absolute path to agent instruction file

```bash
AGENT_CMD_TEMPLATE='codex --name "{name}" --instructions "{file}"' \
  ./agents/run-agents.sh
```

If you don’t set `AGENT_CMD_TEMPLATE`, the runner will print what it would run.

## Science Blog Pipeline Runner
After creating a science-based blog article, trigger internal linking immediately with:

```bash
bash scripts/run-science-blog-pipeline.sh --slug=<slug>
```

Optional build validation:

```bash
bash scripts/run-science-blog-pipeline.sh --slug=<slug> --build
```

Yarn shortcut:

```bash
yarn pipeline:science-blog --slug=<slug>
```

This pipeline:
- validates `content/blog/<slug>.md`
- validates `category` in frontmatter (`Ausdauer`, `Kraft`, `Praxis`, `Laufen`, `Radfahren`)
- generates `output/internal-linking/<slug>.json`
- copies JSON to `data/internal-linking/<slug>.json`
- generates `content/blog-linked/<slug>.md`

## Senior Developer Conflict Loop (Internal Linking)
When ranking or placement is not what you want, use this fast human-in-the-loop override:

1. Run pipeline once:
```bash
bash scripts/run-science-blog-pipeline.sh --slug=<slug>
```

2. Manually edit the generated suggestion file:
```bash
data/internal-linking/<slug>.json
```

3. Re-apply links for this single article:
```bash
node scripts/apply-internal-links.js --article-id=<slug>
```

4. Check result:
- `content/blog-linked/<slug>.md`
- `/blog/<slug>` in dev/live preview

5. Optional validation:
```bash
yarn build
```

Typical conflict fixes:
- force a specific `mid_article_card.target_id`
- replace weak `inline_links` anchors/targets
- remove noisy links to reduce density

Senior note:
- `Jan Sugint`: If editorial priority conflicts with auto-ranking, prefer explicit manual target pinning in `data/internal-linking/<slug>.json`.

## SEO Keyword Wizard
Interactive CLI to update keyword clusters and regenerate the overview.

```bash
node scripts/seo-keyword-wizard.js
```

## Git Hook: Commit Message Guard
If any files in `agents/` are staged, the commit message must contain `ai:`.

Setup (once per repo clone):
```bash
git config core.hooksPath .githooks
```

Example (passes):
```bash
git commit -m "refactor(ai): tighten linking constraints"
```
