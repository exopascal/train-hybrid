# PAGE GENERATOR PROMPT

Ziel: Erzeuge eine SEO-Unterseite basierend auf keyword-map.json.

Input:
- slug

Regeln:
1. Lies seo-agent.md
2. Lies keyword-map.json
3. Wenn slug nicht existiert → STOP
4. Erzeuge ausschließlich page-config/<slug>.ts
5. Nur erlaubte section types aus sectionRegistry
6. Kein zusätzlicher Text
7. Nur valides TypeScript
8. Nutze nur die folgenden section types:
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

SEO:
- Primäres Keyword aus keyword-map.json
- Suchintention berücksichtigen
- Nur freigegebene interne Links

Struktur:
1. Hero
2. Problem oder Einordnung
3. Lösung oder Methode
4. Beweis, Routine oder Framework
5. Angebot oder FAQ
