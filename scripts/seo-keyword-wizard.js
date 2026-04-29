#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'ai-agents', 'seo-config', 'keyword-map.json');
const MD_PATH = path.join(ROOT, 'ai-agents', 'seo-config', 'seo-keywords.md');

function loadJson() {
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveJson(data) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function generateMd(data) {
  const lines = [];
  lines.push('# SEO Keyword Overview');
  lines.push('');
  lines.push('Source of truth: `ai-agents/seo-config/keyword-map.json`');
  lines.push('');
  for (const cluster of data.clusters) {
    lines.push(`## Cluster: ${cluster.clusterId}`);
    lines.push(`- Pillar: ${cluster.pillar.slug}`);
    lines.push(`- Primary keyword: ${cluster.pillar.primaryKeyword}`);
    lines.push('- Secondary keywords:');
    for (const kw of cluster.keywords.secondary) {
      lines.push(`  - ${kw}`);
    }
    lines.push('- Pages:');
    for (const p of cluster.pages) {
      lines.push(`  - ${p}`);
    }
    lines.push('');
  }
  fs.writeFileSync(MD_PATH, lines.join('\n'), 'utf8');
}

function listClusters(data) {
  return data.clusters.map((c, i) => `${i + 1}. ${c.clusterId}`).join('\n');
}

function prompt(rl, q) {
  return new Promise((resolve) => rl.question(q, (ans) => resolve(ans.trim())));
}

function normalizeListInput(input) {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`Missing ${JSON_PATH}`);
    process.exit(1);
  }

  const data = loadJson();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('SEO Keyword Wizard');
  console.log('Select a cluster to edit:');
  console.log(listClusters(data));

  const idx = await prompt(rl, 'Cluster number: ');
  const index = Number(idx) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= data.clusters.length) {
    console.error('Invalid cluster.');
    rl.close();
    process.exit(1);
  }

  const cluster = data.clusters[index];
  console.log(`\nEditing ${cluster.clusterId}`);

  console.log(`Pillar slug: ${cluster.pillar.slug}`);
  const newPillar = await prompt(rl, 'New pillar slug (enter to keep): ');
  if (newPillar) cluster.pillar.slug = newPillar;

  console.log(`Pillar primary keyword: ${cluster.pillar.primaryKeyword}`);
  const newPillarKw = await prompt(rl, 'New pillar primary keyword (enter to keep): ');
  if (newPillarKw) cluster.pillar.primaryKeyword = newPillarKw;

  console.log(`\nPrimary keywords: ${cluster.keywords.primary.join(', ')}`);
  const addPrim = await prompt(rl, 'Add primary keywords (comma-separated, enter to skip): ');
  if (addPrim) {
    const add = normalizeListInput(addPrim);
    cluster.keywords.primary = Array.from(new Set([...cluster.keywords.primary, ...add]));
  }
  const removePrim = await prompt(rl, 'Remove primary keywords (comma-separated, enter to skip): ');
  if (removePrim) {
    const remove = new Set(normalizeListInput(removePrim));
    cluster.keywords.primary = cluster.keywords.primary.filter((k) => !remove.has(k));
  }

  console.log(`\nSecondary keywords: ${cluster.keywords.secondary.join(', ')}`);
  const addSec = await prompt(rl, 'Add secondary keywords (comma-separated, enter to skip): ');
  if (addSec) {
    const add = normalizeListInput(addSec);
    cluster.keywords.secondary = Array.from(new Set([...cluster.keywords.secondary, ...add]));
  }
  const removeSec = await prompt(rl, 'Remove secondary keywords (comma-separated, enter to skip): ');
  if (removeSec) {
    const remove = new Set(normalizeListInput(removeSec));
    cluster.keywords.secondary = cluster.keywords.secondary.filter((k) => !remove.has(k));
  }

  console.log(`\nPages: ${cluster.pages.join(', ')}`);
  const addPages = await prompt(rl, 'Add pages (comma-separated, enter to skip): ');
  if (addPages) {
    const add = normalizeListInput(addPages);
    cluster.pages = Array.from(new Set([...cluster.pages, ...add]));
  }
  const removePages = await prompt(rl, 'Remove pages (comma-separated, enter to skip): ');
  if (removePages) {
    const remove = new Set(normalizeListInput(removePages));
    cluster.pages = cluster.pages.filter((p) => !remove.has(p));
  }

  rl.close();

  saveJson(data);
  generateMd(data);

  console.log('\nUpdated:');
  console.log(`- ${JSON_PATH}`);
  console.log(`- ${MD_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
