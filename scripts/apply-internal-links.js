#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = process.cwd();
const SITE_INDEX_PATH = path.join(ROOT_DIR, 'data', 'site-index', 'site-index.json');
const BLOG_DIR = path.join(ROOT_DIR, 'content', 'blog');
const SUGGESTIONS_DIR = path.join(ROOT_DIR, 'output', 'internal-linking');
const OUTPUT_DIR = path.join(ROOT_DIR, 'content', 'blog-linked');
const DEFAULT_RELATED_IMAGE = '/typo-first-bg.jpg';

function parseArgs(argv) {
  const arg = argv.find((item) => item.startsWith('--article-id='));
  if (!arg) return { articleId: null };
  const value = arg.split('=')[1] || '';
  return { articleId: value.trim() || null };
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) {
    return { frontmatter: '', body: markdown };
  }

  const endIndex = markdown.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { frontmatter: '', body: markdown };
  }

  const frontmatter = markdown.slice(0, endIndex + 5);
  const body = markdown.slice(endIndex + 5);
  return { frontmatter, body };
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractFrontmatterValue(frontmatter, key) {
  const regex = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(regex);
  if (!match) return null;
  const value = match[1].trim().replace(/^["']|["']$/g, '');
  return value || null;
}

async function loadArticleMetaMap() {
  const files = await fs.readdir(BLOG_DIR);
  const metaMap = new Map();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const articleId = path.basename(file, '.md');
    const fullPath = path.join(BLOG_DIR, file);
    const markdown = await fs.readFile(fullPath, 'utf8');
    const { frontmatter } = parseFrontmatter(markdown);

    const heroImage = extractFrontmatterValue(frontmatter, 'heroImage')
      || extractFrontmatterValue(frontmatter, 'image')
      || extractFrontmatterValue(frontmatter, 'coverImage')
      || DEFAULT_RELATED_IMAGE;

    metaMap.set(articleId, { heroImage });
  }

  return metaMap;
}

function isWordChar(char) {
  return /[\p{L}\p{N}_]/u.test(char);
}

function findCandidateIndex(body, anchorText) {
  const escaped = escapeRegex(anchorText);
  const regex = new RegExp(escaped, 'giu');
  let match = regex.exec(body);

  while (match) {
    const start = match.index;
    const end = start + match[0].length;

    const before = start > 0 ? body[start - 1] : '';
    const after = end < body.length ? body[end] : '';

    const wordBoundaryOk = (!before || !isWordChar(before)) && (!after || !isWordChar(after));

    const lineStart = body.lastIndexOf('\n', start) + 1;
    const lineEndRaw = body.indexOf('\n', end);
    const lineEnd = lineEndRaw === -1 ? body.length : lineEndRaw;
    const line = body.slice(lineStart, lineEnd);

    // Skip replacements in markdown link definitions/inline links when anchor already appears in []
    const alreadyLinked = line.includes(`[${match[0]}](`);

    if (wordBoundaryOk && !alreadyLinked) {
      return { start, end, text: match[0] };
    }

    match = regex.exec(body);
  }

  return null;
}

function insertInlineLink(body, targetId, anchorText) {
  const found = findCandidateIndex(body, anchorText);
  if (!found) {
    return { body, inserted: false };
  }

  const link = `[${found.text}](/blog/${targetId})`;
  const updated = `${body.slice(0, found.start)}${link}${body.slice(found.end)}`;
  return { body: updated, inserted: true };
}

function insertMidArticleCard(body, card) {
  const paragraphs = body.split(/\n\s*\n/);
  const safeHeadline = escapeHtml(card.headline);
  const targetUrl = `/blog/${card.target_id}`;
  const safeImageSrc = escapeHtml(card.image_src || DEFAULT_RELATED_IMAGE);
  const safeImageAlt = escapeHtml(card.headline);

  const cardBlock = [
    '<div class="inline-related-card">',
    '  <div class="inline-related-card__content">',
    '    <p class="inline-related-card__eyebrow">Weiterführender Artikel</p>',
    `    <a class="inline-related-card__breadcrumb" href="${targetUrl}">${targetUrl}</a>`,
    `    <a class="inline-related-card__title" href="${targetUrl}">${safeHeadline}</a>`,
    '  </div>',
    `  <a class="inline-related-card__image-link" href="${targetUrl}" aria-label="${safeHeadline}">`,
    `    <img class="inline-related-card__image" src="${safeImageSrc}" alt="${safeImageAlt}" loading="lazy">`,
    '  </a>',
    '</div>'
  ].join('\n');

  if (paragraphs.length < 2) {
    return `${body.trimEnd()}\n\n${cardBlock}\n`;
  }

  const insertAfter = Math.max(1, Math.floor(paragraphs.length / 3));
  const left = paragraphs.slice(0, insertAfter).join('\n\n').trimEnd();
  const right = paragraphs.slice(insertAfter).join('\n\n').trimStart();

  return `${left}\n\n${cardBlock}\n\n${right}`;
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === 'ENOENT') return null;
    throw error;
  }
}

function normalizeInlineLinks(inlineLinks, articleId, siteIndexMap) {
  if (!Array.isArray(inlineLinks)) return [];

  const seen = new Set();
  const valid = [];

  for (const link of inlineLinks) {
    if (!link || typeof link.target_id !== 'string') continue;
    if (link.target_id === articleId) continue;
    if (seen.has(link.target_id)) continue;

    const target = siteIndexMap.get(link.target_id);
    if (!target) {
      console.warn(`Warning: Unknown target_id ${link.target_id} in ${articleId}`);
      continue;
    }

    const anchorText = typeof link.anchor_text === 'string' && link.anchor_text.trim()
      ? link.anchor_text.trim()
      : target.title;

    valid.push({
      target_id: link.target_id,
      anchor_text: anchorText,
      placement_hint: 'section_1'
    });
    seen.add(link.target_id);

    if (valid.length >= 2) break;
  }

  return valid;
}

function normalizeMidCard(midCard, articleId, siteIndexMap, articleMetaMap) {
  if (!midCard || typeof midCard.target_id !== 'string') return null;
  if (midCard.target_id === articleId) return null;

  const target = siteIndexMap.get(midCard.target_id);
  if (!target) {
    console.warn(`Warning: Unknown target_id ${midCard.target_id} in ${articleId}`);
    return null;
  }

  return {
    type: 'related_article',
    target_id: target.id,
    headline: typeof midCard.headline === 'string' && midCard.headline.trim()
      ? midCard.headline.trim()
      : target.title,
    image_src: articleMetaMap.get(target.id)?.heroImage || DEFAULT_RELATED_IMAGE
  };
}

async function loadSiteIndex() {
  const raw = await fs.readFile(SITE_INDEX_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Site index must be a JSON array.');
  }

  const map = new Map();
  for (const entry of parsed) {
    if (!entry || typeof entry.id !== 'string') continue;
    if (entry.type !== 'blog_article' || entry.published !== true) continue;
    if (typeof entry.title !== 'string' || typeof entry.url !== 'string') continue;
    map.set(entry.id, { id: entry.id, title: entry.title, url: entry.url });
  }

  return map;
}

async function getArticleIds(filterArticleId) {
  const files = await fs.readdir(BLOG_DIR);
  const ids = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.basename(file, '.md'))
    .sort((a, b) => a.localeCompare(b));

  if (!filterArticleId) return ids;
  return ids.filter((id) => id === filterArticleId);
}

async function processArticle(articleId, siteIndexMap, articleMetaMap) {
  const markdownPath = path.join(BLOG_DIR, `${articleId}.md`);
  const suggestionPath = path.join(SUGGESTIONS_DIR, `${articleId}.json`);

  const markdown = await fs.readFile(markdownPath, 'utf8');

  let suggestion;
  try {
    suggestion = await readJsonIfExists(suggestionPath);
  } catch {
    console.warn(`Warning: Invalid JSON for ${articleId}`);
    return;
  }

  if (!suggestion) {
    console.warn(`Warning: Missing suggestion file for ${articleId}`);
    return;
  }

  if (!suggestion || suggestion.article_id !== articleId) {
    console.warn(`Warning: Invalid JSON for ${articleId}`);
    return;
  }

  const { frontmatter, body } = parseFrontmatter(markdown);

  const inlineLinks = normalizeInlineLinks(suggestion.inline_links, articleId, siteIndexMap);
  const midCard = normalizeMidCard(suggestion.mid_article_card, articleId, siteIndexMap, articleMetaMap);
  let linkedBody = body;

  for (const inlineLink of inlineLinks) {
    const result = insertInlineLink(linkedBody, inlineLink.target_id, inlineLink.anchor_text);
    linkedBody = result.body;
    if (!result.inserted) {
      console.warn(`Warning: Could not place inline link "${inlineLink.anchor_text}" in ${articleId}`);
    }
  }

  if (midCard) {
    linkedBody = insertMidArticleCard(linkedBody, midCard);
  }

  const output = `${frontmatter}${linkedBody}`;
  const outputPath = path.join(OUTPUT_DIR, `${articleId}.md`);
  await fs.writeFile(outputPath, output, 'utf8');

  console.log(`Generated linked markdown for ${articleId}`);
}

async function main() {
  const { articleId } = parseArgs(process.argv.slice(2));

  const siteIndexMap = await loadSiteIndex();
  const articleMetaMap = await loadArticleMetaMap();
  if (siteIndexMap.size === 0) {
    throw new Error('No valid published blog articles found in site index.');
  }

  const articleIds = await getArticleIds(articleId);
  if (articleId && articleIds.length === 0) {
    console.warn(`Warning: Article ${articleId} not found in content/blog`);
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const id of articleIds) {
    await processArticle(id, siteIndexMap, articleMetaMap);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
