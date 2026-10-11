# SCIENCE BLOG GENERATOR PROMPT

Ziel: Erzeuge einen wissenschaftlich fundierten, klar verständlichen und nutzenorientierten Blogartikel auf Basis bereitgestellter Studien.

Input:
- slug
- topic
- targetAudience
- source files

Regeln:
1. Lies science-blog-agent.md
2. Lies alle bereitgestellten Quellen vollständig
3. Wenn keine belastbaren Quellen vorliegen -> STOP
4. Erzeuge ausschließlich content/blog/<slug>.md
5. Kein zusätzlicher Text
6. Keine Halluzinationen
7. Nur Aussagen, die durch die Quellen gedeckt sind

Pflicht:
- Wissenschaftlich korrekt
- Klar verständlich
- Nutzenorientiert
- Keine werbliche Überhöhung
- Grenzen der Evidenz transparent benennen
- Kategorie im Frontmatter setzen (nur erlaubt):
  - `Ausdauer`
  - `Kraft`
  - `Praxis`
  - `Laufen`
  - `Radfahren`

Struktur:
1. Headline
2. Intro
3. Die wichtigsten Nutzen für den Leser
4. Was untersucht wurde
5. Was die Ergebnisse wirklich sagen
6. Was das praktisch bedeutet
7. Grenzen der Aussagekraft
8. Fazit
9. Am Ende immer ein Quellenverzeichnis im APA-Stil hinzufügen

## HUMAN STEERING INPUT (OPTIONAL)

The user may provide editorial steering before the article is generated.

This may include:

- headline ideas
- emphasis on specific findings
- sections to include or avoid
- specific interpretations to explore
- notes or highlighted passages from the study
- key insights the article should focus on

If steering instructions are provided:
- treat them as editorial guidance
- incorporate them where scientifically valid
- do not override scientific accuracy
- do not ignore them unless they contradict the evidence

If a steering instruction contradicts the study evidence:
clearly adjust the interpretation to remain scientifically correct.
