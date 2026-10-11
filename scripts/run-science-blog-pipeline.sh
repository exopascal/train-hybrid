#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BLOG_DIR="$ROOT_DIR/content/blog"
LINKED_DIR="$ROOT_DIR/content/blog-linked"
SUGGESTIONS_DIR="$ROOT_DIR/output/internal-linking"
DATA_LINKING_DIR="$ROOT_DIR/data/internal-linking"

usage() {
  cat <<'EOF'
Usage:
  scripts/run-science-blog-pipeline.sh --slug=<slug> [--build]

What it does:
  1) Validate content/blog/<slug>.md exists
  2) Validate frontmatter category (Ausdauer | Kraft | Praxis | Laufen | Radfahren)
  3) Generate internal-link suggestions for this article
  4) Copy suggestion to data/internal-linking/<slug>.json
  5) Build content/blog-linked/<slug>.md from suggestions
  6) Optionally run yarn build
EOF
}

slug=""
run_build="false"

for arg in "$@"; do
  case "$arg" in
    --slug=*)
      slug="${arg#*=}"
      ;;
    --build)
      run_build="true"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$slug" ]]; then
  echo "Missing required argument: --slug=<slug>" >&2
  usage
  exit 1
fi

article_path="$BLOG_DIR/$slug.md"
if [[ ! -f "$article_path" ]]; then
  echo "Article not found: $article_path" >&2
  exit 1
fi

category_line="$(grep -E '^category:' "$article_path" | head -n 1 || true)"
category_value="$(echo "$category_line" | sed -E 's/^category:[[:space:]]*//; s/^\"//; s/\"$//; s/^[[:space:]]+|[[:space:]]+$//g')"
case "$category_value" in
  Ausdauer|Kraft|Praxis|Laufen|Radfahren)
    ;;
  *)
    echo "Invalid category in $article_path: '$category_value'" >&2
    echo "Allowed categories: Ausdauer, Kraft, Praxis, Laufen, Radfahren" >&2
    exit 1
    ;;
esac

mkdir -p "$SUGGESTIONS_DIR" "$DATA_LINKING_DIR" "$LINKED_DIR"

echo "[1/6] Category valid: $category_value"
echo "[2/6] Generate internal-link suggestions for $slug"
node "$ROOT_DIR/scripts/internal-linking-agent.js" --article-id="$slug"

suggestion_path="$SUGGESTIONS_DIR/$slug.json"
if [[ ! -f "$suggestion_path" ]]; then
  echo "Suggestion file not created: $suggestion_path" >&2
  exit 1
fi

echo "[3/6] Copy suggestion to data/internal-linking"
cp "$suggestion_path" "$DATA_LINKING_DIR/$slug.json"

echo "[4/6] Apply internal links to blog-linked variant"
node "$ROOT_DIR/scripts/apply-internal-links.js" --article-id="$slug"

linked_path="$LINKED_DIR/$slug.md"
if [[ ! -f "$linked_path" ]]; then
  echo "Linked article not created: $linked_path" >&2
  exit 1
fi

echo "[5/6] Done:"
echo "  Blog:        content/blog/$slug.md"
echo "  Suggestions: output/internal-linking/$slug.json"
echo "  Data JSON:   data/internal-linking/$slug.json"
echo "  Blog-linked: content/blog-linked/$slug.md"

if [[ "$run_build" == "true" ]]; then
  echo "[6/6] Run build"
  (cd "$ROOT_DIR" && yarn build)
fi
