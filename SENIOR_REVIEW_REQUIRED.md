# SENIOR_REVIEW_REQUIRED

Diese Datei markiert sicherheits- und datenrelevante Stellen, die vor produktivem Einsatz durch einen Senior-Entwickler freigegeben werden müssen.

Suchmarker im Code: `Jan Sugint`

## Review Pflichtstellen

1. Datenquellen für RAG (Governance)
- Datei: `server/api/chat.post.ts`
- Marker: `RED-FLAG ... [Jan Sugint]`
- Warum: Der Chat nutzt neben `knowledge/recipes` auch `content/blog` als Retrieval-Quelle.
- Prüfen:
  - Sind alle eingebundenen Inhalte fachlich freigegeben?
  - Gibt es Inhalte, die nicht in den Chat-Kontext dürfen?
  - Ist die Source-Strategie (public vs. non-public) korrekt?

2. Modell-Kontextübergabe (Prompting / Data Exposure)
- Datei: `server/providers/openai.ts`
- Marker: `RED-FLAG ... [Jan Sugint]`
- Warum: Hier wird der extrahierte Kontext an das LLM übergeben.
- Prüfen:
  - Umfang und Granularität des Kontexts
  - Keine sensiblen Daten im Kontext
  - Systemregeln und Antwortgrenzen passend

3. Rendering von Bot-Antworten (`v-html`)
- Datei: `components/ChatWidget.vue`
- Marker: `RED-FLAG ... [Jan Sugint]`
- Warum: Assistant-Ausgaben werden als HTML gerendert.
- Prüfen:
  - Sanitizer-Policy (`DOMPurify`) ausreichend restriktiv
  - Erlaubte Tags/Attribute minimal halten
  - Keine unsicheren HTML-Ausnahmen

4. Mailchimp-Integration (Lead-Daten / DSGVO)
- Datei: `server/api/mailchimp-subscribe.post.ts` (noch zu erstellen)
- Marker: `RED-FLAG ... [Jan Sugint]`
- Warum: Alle Analyse-Antworten (Bewegungsprofil, Frequenz, Kraft, Zeit, Gear-Budget, Investmentrahmen) werden als Merge Fields an Mailchimp übertragen und einem Lead-Datensatz zugeordnet.
- Prüfen:
  - Ist die Datenschutzerklärung auf Mailchimp-Nutzung und Profiling ausgerichtet?
  - Ist eine explizite Einwilligung (Checkbox) vor dem E-Mail-Submit rechtlich notwendig (DSGVO Art. 6 / 7)?
  - Welche Merge Fields dürfen gespeichert werden – insbesondere Gear-Budget und Investmentrahmen (finanzielle Daten)?
  - Double-Opt-In aktiviert in der Mailchimp Audience?
  - API Key sicher in Serverumgebung, nicht im Client-Bundle?
  - `.env` enthält echten OpenAI Key – sicherstellen dass keine `.env`-Werte in Build-Outputs landen (Cloudflare Workers / Nuxt public runtimeConfig prüfen)

## Freigabeprotokoll

- Status: `OPEN`
- Reviewer (Senior): `________________________`
- Datum: `________________________`
- Ergebnis: `APPROVED / CHANGES REQUIRED`
- Notizen:
  - 
  - 

