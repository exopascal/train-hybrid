#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

agents=(
  "Seo Agent:agents/ai/seo-agent.md"
  "Blog Agent:agents/ai/blog-agent.md"
  "Chat Agent:agents/ai/chat-agent.md"
)

# Template uses {name} and {file} placeholders.
# Example:
#   AGENT_CMD_TEMPLATE='codex --name "{name}" --instructions "{file}"'
AGENT_CMD_TEMPLATE=${AGENT_CMD_TEMPLATE:-"echo TODO: set AGENT_CMD_TEMPLATE to run '{name}' with '{file}'"}

for entry in "${agents[@]}"; do
  name="${entry%%:*}"
  rel="${entry#*:}"
  file="$ROOT_DIR/$rel"

  cmd="${AGENT_CMD_TEMPLATE//\{name\}/$name}"
  cmd="${cmd//\{file\}/$file}"

  echo "Launching: $cmd"
  eval "$cmd" &
done

wait
