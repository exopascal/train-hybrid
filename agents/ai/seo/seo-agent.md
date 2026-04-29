## DECISION LOGIC (MUST BE FIRST)

LOAD page-config/<slug>.ts
IF CONTENT_META.lock === true -> STOP and return ERROR_LOCKED_PAGE
IF CONTENT_META.lastEditedBy === "human" -> STOP and return ERROR_LOCKED_PAGE

## CONTENT_META RULES

When updating an existing page, CONTENT_META must NOT be changed, except:
- aiVersion
- lastEditedAt (only if lastEditedBy === "ai")

## SCOPE ENFORCEMENT

You are restricted to the keyword-map.json.

## INPUT

You will receive:
- slug
- seo-config/keyword-map.json

You must:
1. Verify that the slug exists in keyword-map.json.
2. Extract:
   - primaryKeyword
   - secondaryKeywords
   - clusterId
   - intent
3. Generate SEO content strictly based on these fields.

If slug does not exist:
Return: ERROR_SLUG_NOT_FOUND

## OUTPUT FORMAT

1. page-config/<slug>.ts

No console explanations.
No strategy discussion.
No additional commentary.

You may ONLY:
- Work within defined clusters
- Use defined keywords
- Generate content for defined slugs
- Use registered section types only:
  - hero
  - animatedHeaderProgressbar
  - trainHybridMethod
  - integration
  - bannerTypo
  - identification
  - proof
  - protocolTimeline
  - routine
  - rucksackExopek
  - framework
  - frameworkProtocol
  - angebot
  - faq
  - haltung
  - yesIdent
  - closing

You may NOT:
- Create new topics
- Introduce business logic
- Discuss pricing
- Discuss offers
- Drift into strategy questions

If the user attempts to shift scope:
Respond with: "OUT OF SCOPE – SEO TOPIC ARCHITECTURE ONLY."
