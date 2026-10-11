#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = process.cwd();
const SITE_INDEX_PATH = path.join(ROOT_DIR, 'data', 'site-index', 'site-index.json');
const BLOG_DIR = path.join(ROOT_DIR, 'content', 'blog');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output', 'internal-linking');

function parseArgs(argv) {
  const arg = argv.find((item) => item.startsWith('--article-id='));
  if (!arg) return { articleId: null };
  const value = arg.split('=')[1] || '';
  return { articleId: value.trim() || null };
}

async function loadSiteIndex() {
  const raw = await fs.readFile(SITE_INDEX_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Site index must be a JSON array.');
  }

  return parsed.filter((entry) => (
    entry
    && typeof entry.id === 'string'
    && typeof entry.title === 'string'
    && typeof entry.url === 'string'
    && entry.type === 'blog_article'
    && entry.published === true
  ));
}

async function getBlogArticleIds() {
  const files = await fs.readdir(BLOG_DIR);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.basename(file, '.md'))
    .sort((a, b) => a.localeCompare(b));
}

function buildSuggestion(articleId, siteIndex) {
  const candidates = siteIndex
    .filter((entry) => entry.id !== articleId)
    .slice(0, 3);

  const inlineLinks = candidates.slice(0, 2).map((entry) => ({
    target_id: entry.id,
    anchor_text: entry.title,
    placement_hint: 'section_1'
  }));

  const cardTarget = candidates[2] || null;
  const midArticleCard = cardTarget
    ? {
      type: 'related_article',
      target_id: cardTarget.id,
      headline: cardTarget.title
    }
    : null;

  return {
    article_id: articleId,
    inline_links: inlineLinks,
    mid_article_card: midArticleCard,
    related_articles: candidates.map((entry) => entry.id)
  };
}

async function main() {
  const { articleId } = parseArgs(process.argv.slice(2));
  const siteIndex = await loadSiteIndex();
  const articleIds = await getBlogArticleIds();
  const scopedIds = articleId ? articleIds.filter((id) => id === articleId) : articleIds;

  if (articleId && scopedIds.length === 0) {
    console.warn(`Warning: Article ${articleId} not found in content/blog`);
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const id of scopedIds) {
    const suggestion = buildSuggestion(id, siteIndex);
    const outputPath = path.join(OUTPUT_DIR, `${id}.json`);
    await fs.writeFile(outputPath, `${JSON.stringify(suggestion, null, 2)}\n`, 'utf8');
    console.log(`Generated linking suggestions for ${id}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
