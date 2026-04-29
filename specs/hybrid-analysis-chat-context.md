# Hybrid Analysis Chat Context

## Ziel

Diese Spezifikation beschreibt den Datenfluss zwischen:

1. Hybrid-Analyse
2. Pinia Store
3. Chat Agent
4. CRM/Marketing-Tags, z.B. Mailchimp

Ziel ist, dass die Ergebnisse der Hybrid-Analyse nicht nur im UI sichtbar sind, sondern:

- dem Chat Agent gezielt als Kontext mitgegeben werden
- in abgeleitete Nutzerprofile übersetzt werden
- als Tags und Merkmale für CRM-Prozesse nutzbar sind

## Aktueller Stand

Der aktuelle technische Stand im Projekt:

- Die Analyse-Antworten werden nach Abschluss in den Pinia Store `hybridAnalysis` geschrieben.
- Der Chat Agent sendet diese Antworten als `analysis` an `/api/chat`.
- Der Chat-Server fügt diese Daten als zusätzliche Kontextquelle `hybrid-analysis/current-session` hinzu.

Aktuell noch nicht vorhanden:

- abgeleitete Tags
- abgeleitete Persona-/Profilfelder
- Persistenz über Reload hinaus
- Übergabe an Mailchimp oder andere Systeme

## Source Of Truth

Die Hybrid-Analyse soll im Frontend zentral über Pinia geführt werden.

Wichtig:

- Pinia ist nur der aktive Client-State.
- Für geräteübergreifende Nutzung darf Pinia nicht die eigentliche Source of Truth sein.
- Die eigentliche Source of Truth muss serverseitig liegen.

Empfohlene Reihenfolge der Verantwortlichkeiten:

1. Backend-Datensatz pro User/Lead
2. Hydration in Web oder App
3. Pinia als lokaler Runtime-Cache

Aktueller Store:

- Datei: [stores/hybridAnalysis.ts](/Users/pascal/Dev/train-hybrid/stores/hybridAnalysis.ts)
- State:
  - `answers`
  - `completedAt`

Empfohlene Zielstruktur:

```ts
type HybridAnalysisAnswers = Record<string, string | number>

type HybridAnalysisDerivedProfile = {
  sportType: 'cycling' | 'running' | 'hybrid' | 'general'
  trainingFrequency: 'low' | 'medium' | 'high' | 'irregular' | 'unknown'
  strengthStatus: 'none' | 'unstructured' | 'regular' | 'structured' | 'limited'
  budgetBand: 'low' | 'mid' | 'high' | 'premium' | 'unknown'
  equipmentLevel: 'none' | 'entry' | 'mid' | 'high' | 'unknown'
  onboardingIntent: 'starter' | 'active' | 'performance'
}

type HybridAnalysisStoreState = {
  answers: HybridAnalysisAnswers
  derivedProfile: HybridAnalysisDerivedProfile | null
  crmTags: string[]
  chatContext: string | null
  completedAt: string | null
}
```

## Minimal Datenmodell

Die Rohdaten aus der Analyse bleiben unverändert erhalten.

Erwartete Answer-Keys:

- `movement`
- `frequency`
- `strength`
- `time`
- `gear`
- `investment`
- `equipment`

Diese Rohdaten sind die Basis für:

- Chat-Kontext
- CRM-Tags
- spätere Segmentierung

## Abgeleitete Profilfelder

Die Rohdaten sollen in stabile, technische Merkmale übersetzt werden.

Beispiel-Mapping:

```ts
movement:
- "Ich fahre Gravel" -> sportType = "cycling"
- "Ich fahre Rennrad" -> sportType = "cycling"
- "Ich laufe regelmäßig" -> sportType = "running"
- "Ich kombiniere Ausdauer & Kraft" -> sportType = "hybrid"
- sonst -> sportType = "general"

frequency:
- "1-2 Einheiten" -> trainingFrequency = "low"
- "3-4 Einheiten" -> trainingFrequency = "medium"
- "5+ Einheiten" -> trainingFrequency = "high"
- "Unregelmäßig" -> trainingFrequency = "irregular"

strength:
- "Gar nicht" -> strengthStatus = "none"
- "Unregelmäßig / ohne Plan" -> strengthStatus = "unstructured"
- "1-2x pro Woche" -> strengthStatus = "regular"
- "Strukturiert mit System" -> strengthStatus = "structured"
- "Ich hatte Beschwerden / Unsicherheiten" -> strengthStatus = "limited"

investment:
- "Unter 300 €" -> budgetBand = "low"
- "300-700 €" -> budgetBand = "mid"
- "700-1.500 €" -> budgetBand = "high"
- "Über 1.500 €" -> budgetBand = "premium"
```

## Chat Agent Kontext

Der Chat Agent soll nicht nur Rohdaten erhalten, sondern einen normalisierten Kontextblock.

Empfohlenes Ziel:

```json
{
  "analysis": {
    "answers": {
      "movement": "Ich fahre Rennrad",
      "frequency": "3-4 Einheiten",
      "strength": "Gar nicht",
      "time": "60 Minuten",
      "gear": 2500,
      "investment": "700-1.500 €"
    },
    "derivedProfile": {
      "sportType": "cycling",
      "trainingFrequency": "medium",
      "strengthStatus": "none",
      "budgetBand": "high",
      "equipmentLevel": "high",
      "onboardingIntent": "performance"
    },
    "crmTags": [
      "analysis_completed",
      "sport_cycling",
      "freq_medium",
      "strength_none",
      "budget_high"
    ]
  }
}
```

## Chat-Prompting-Regel

Der Chat Agent soll diese Daten gezielt nutzen.

Empfohlene Regel:

- Wenn Analyse-Daten vorhanden sind, antworte personalisiert anhand des Analyseprofils.
- Wenn Analyse-Daten fehlen, antworte generisch.
- Wenn Rohdaten und Wissensquellen widersprüchlich wirken, priorisiere die aktuelle Nutzeranalyse für die Personalisierung und die Wissensquellen für fachliche Aussagen.

## CRM / Mailchimp Tags

Die Tags sollen technisch stabil, englisch und systemfreundlich sein.

Empfohlene Basistags:

- `analysis_completed`
- `analysis_started`
- `sport_cycling`
- `sport_running`
- `sport_hybrid`
- `sport_general`
- `freq_low`
- `freq_medium`
- `freq_high`
- `freq_irregular`
- `strength_none`
- `strength_unstructured`
- `strength_regular`
- `strength_structured`
- `strength_limited`
- `budget_low`
- `budget_mid`
- `budget_high`
- `budget_premium`
- `equipment_none`
- `equipment_entry`
- `equipment_mid`
- `equipment_high`
- `intent_starter`
- `intent_active`
- `intent_performance`

## Mailchimp-Felder vs. Tags

Empfehlung für Mailchimp:

- Tags für Segmentierung und Automationen
- Merge Fields für wenige stabile Kernwerte

Empfohlene Merge Fields:

- `SPORTTYPE`
- `TRNFREQ`
- `STRSTAT`
- `BUDGET`
- `ANLDATE`

Empfohlene Tags:

- alle verhaltens- und segmentbezogenen Marker
- alles, was sich in Journeys und Automationen gut verwenden lässt

## Empfohlener Datenfluss

```text
MultiStepForm
  -> raw answers
  -> Pinia store
  -> persist to backend profile/session
  -> derive profile
  -> build crm tags
  -> build chat context
  -> AgentChat request
  -> /api/chat

optional danach:
  -> lead submit
  -> Mailchimp sync
  -> tags + merge fields
  -> mobile app hydrate from same backend profile
```

## Geräteübergreifendes Modell

Wenn die Daten auf Web, Mobile App und im Chat identisch verfügbar sein sollen, braucht ihr ein gemeinsames Profilobjekt im Backend.

Empfohlenes Modell:

```ts
type HybridProfileRecord = {
  profileId: string
  userId: string | null
  leadId: string | null
  email: string | null
  externalIds: {
    mailchimpSubscriberId?: string | null
    appUserId?: string | null
    webSessionId?: string | null
  }
  analysis: {
    answers: Record<string, string | number>
    derivedProfile: Record<string, string | number | boolean | null>
    crmTags: string[]
    completedAt: string | null
    version: number
  }
  consent: {
    marketing: boolean
    profiling: boolean
    updatedAt: string | null
  }
  updatedAt: string
  createdAt: string
}
```

Damit gilt:

- Web schreibt nicht nur in Pinia, sondern zusätzlich ins Backend.
- Die Mobile App liest denselben Datensatz.
- Der Chat-Agent erhält denselben Datensatz oder einen abgeleiteten Kontext daraus.
- Mailchimp erhält nur die freigegebenen Felder und Tags.

## Interface Contracts

### 1. Analyse speichern

Web und Mobile App sollten dieselbe Schreibschnittstelle verwenden.

Empfohlener Endpoint:

```http
POST /api/hybrid-analysis
```

Request:

```json
{
  "profileId": "hp_123",
  "userId": "usr_123",
  "email": "athlet@example.com",
  "answers": {
    "movement": "Ich fahre Rennrad",
    "frequency": "3-4 Einheiten",
    "strength": "Gar nicht",
    "time": "60 Minuten",
    "gear": 2500,
    "investment": "700-1.500 €",
    "equipment": "Ja"
  },
  "client": {
    "platform": "web",
    "appVersion": "1.0.0"
  }
}
```

Response:

```json
{
  "profileId": "hp_123",
  "analysis": {
    "answers": {},
    "derivedProfile": {},
    "crmTags": [],
    "completedAt": "2026-03-31T10:00:00.000Z",
    "version": 3
  }
}
```

### 2. Analyse laden

Empfohlener Endpoint:

```http
GET /api/hybrid-analysis?profileId=hp_123
```

Diese Schnittstelle wird verwendet für:

- Web-Reload
- Mobile App Login/Hydration
- Chat-Kontext-Aufbau

### 3. Chat mit Analyse-Kontext

Der Chat sollte langfristig nicht nur ad hoc `analysis` aus dem Frontend bekommen, sondern serverseitig anhand einer Identität auflösen.

Empfohlener Zielzustand:

```http
POST /api/chat
```

Request:

```json
{
  "message": "Wie sollte ich in Woche 1 starten?",
  "profileId": "hp_123"
}
```

Serververhalten:

1. Profil laden
2. aktuelle Analyse laden
3. Chat-Kontext daraus bauen
4. Wissensquellen ergänzen
5. Antwort erzeugen

Der aktuelle Zwischenzustand im Projekt ist einfacher:

- Frontend sendet `analysis` direkt mit

Für das größere Ökosystem ist aber `profileId` oder `userId` die robustere Schnittstelle.

## Identity Resolution

Geräteübergreifend funktioniert nur mit stabiler Identität.

Empfohlene Identitätsreihenfolge:

1. `userId`
2. `profileId`
3. `email`
4. temporäre `webSessionId`

Regel:

- Vor Login kann mit `profileId` oder Session gearbeitet werden.
- Nach Login muss ein Merge auf den echten User erfolgen.
- Mobile App und Web müssen anschließend denselben `profileId`/`userId`-gebundenen Datensatz lesen.

## Sync-Regeln Web <-> Mobile

Empfohlene fachliche Regeln:

- Die letzte bestätigte Analyse-Version gewinnt.
- Jede gespeicherte Analyse erhöht `version`.
- Clients hydrieren immer den neuesten Stand.
- Pinia darf nie stillschweigend lokaler als das Backend werden.

Empfohlener Clientablauf:

1. App/Web startet
2. Profil aus Backend laden
3. Pinia damit hydratisieren
4. Nutzer ändert Analyse
5. Änderung an Backend senden
6. Response in Pinia zurückschreiben

## Mailchimp Schnittstelle

Mailchimp sollte nicht direkt aus dem UI beschrieben werden.

Empfohlene Architektur:

```text
MultiStepForm
  -> Pinia
  -> Backend profile update
  -> Backend derives tags
  -> Backend syncs Mailchimp
```

Gründe:

- einheitliche Datenlogik
- keine doppelten Regeln in Web und App
- bessere Governance
- Wiederverwendbarkeit für andere Systeme

## Mailchimp Payload

Empfohlene serverseitige Nutzdaten:

```json
{
  "email_address": "athlet@example.com",
  "status_if_new": "subscribed",
  "merge_fields": {
    "SPORTTYPE": "cycling",
    "TRNFREQ": "medium",
    "STRSTAT": "none",
    "BUDGET": "high",
    "ANLDATE": "2026-03-31"
  },
  "tags": [
    "analysis_completed",
    "sport_cycling",
    "freq_medium",
    "strength_none",
    "budget_high",
    "intent_performance"
  ]
}
```

## Tagging Governance

Tags dürfen nicht ungeprüft aus Freitext entstehen.

Regeln:

- Tags nur aus kontrollierten Mappings ableiten
- keine deutschsprachigen Freitext-Tags
- keine UI-Labels direkt als CRM-Tags verwenden
- Tag-Namen stabil halten, auch wenn sich UI-Texte ändern

Empfohlene Ownership:

- Mapping-Definition im Code
- fachliche Freigabe durch Marketing/CRM Owner
- technische Freigabe durch Engineering

## Privacy und Consent

Für CRM und geräteübergreifende Profildaten braucht ihr klare Consent-Regeln.

Mindestens zu trennen:

- Produkt-/Profiling-Daten
- Marketing-Kommunikation

Empfohlene Regel:

- Analyse speichern: möglich für Produktfunktion
- Mailchimp-Sync: nur bei entsprechender Marketing-/CRM-Freigabe

## Empfohlene zusätzliche Backend-Module

Für die nächste Systemstufe:

- `server/api/hybrid-analysis.post.ts`
- `server/api/hybrid-analysis.get.ts`
- `server/utils/hybridAnalysisProfile.ts`
- `server/utils/hybridAnalysisTags.ts`
- `server/utils/hybridAnalysisPersistence.ts`
- `server/utils/mailchimpSync.ts`

## Architekturentscheidung

Für das größere Ökosystem gilt:

- Pinia = lokaler Arbeitszustand
- Backend-Profil = systemweite Wahrheit
- Chat = liest normalisierten Profilkontext
- Mailchimp = abgeleitete Tags und wenige stabile Merge Fields
- Mobile App = liest und schreibt dieselbe Profilressource

## Nächste Implementierungsstufe

Empfohlene nächste Schritte im Code:

1. Store um `derivedProfile`, `crmTags` und `chatContext` erweitern.
2. Pure Mapping-Funktionen in `utils/` auslagern.
3. Chat nicht nur mit `answers`, sondern mit dem normalisierten Kontext füttern.
4. Optional Persistenz in `localStorage` ergänzen.
5. Bei Lead-Submit dieselben Tags an Mailchimp übergeben.

## Empfohlene Utility-Dateien

Für die nächste Ausbaustufe:

- `stores/hybridAnalysis.ts`
- `utils/hybridAnalysisProfile.ts`
- `utils/hybridAnalysisTags.ts`
- `utils/hybridAnalysisChatContext.ts`
- `server/api/chat.post.ts`

## Entscheidung

Pinia ist hier der richtige Einstieg.

Nicht nötig als erster Schritt:

- Vektorstore
- semantische Retrieval-Schicht für Analyseergebnisse
- komplexe Personalisierungs-Engine

Sinnvolle Reihenfolge:

1. Rohdaten sauber im Store
2. abgeleitete Profilfelder
3. CRM-Tags
4. Persistenz
5. externe Syncs
