# Output Format

The agent must return structured recommendations only.

## Required format

```json
{
  "article_id": "article_001",
  "recommended_links": [
    {
      "target_id": "page_014",
      "link_type": "context_link",
      "anchor_text": "Train Hybrid System",
      "reason": "core_system_page",
      "priority": 10
    },
    {
      "target_id": "page_002",
      "link_type": "cta_link",
      "anchor_text": "Hybrid Analysis",
      "reason": "conversion_path",
      "priority": 9
    }
  ]
}