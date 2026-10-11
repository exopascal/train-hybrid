# Hybrid Profile Backend EU Architecture

## Zweck

Diese Spezifikation beschreibt ein Zielbild für ein zentrales Backend-Profil im größeren Train-Hybrid-Ökosystem.

Das Zielbild soll folgende Anforderungen erfüllen:

- geräteübergreifende Verfügbarkeit der Hybrid-Analyse
- gemeinsamer Datenstand für Web, Chat und Mobile App
- serverseitige Ableitung von Profilfeldern und CRM-Tags
- DSGVO-taugliche Trennung von Produktprofil und Marketing-Sync
- europäisches Hosting als Grundvoraussetzung

## Status

Das ist bewusst eine Architekturidee und kein bestätigter Ist-Zustand.

Was ich lokal im Projekt sehe:

- Es gibt aktuell Chat-Serverlogik in [server/api/chat.post.ts](/Users/pascal/Dev/train-hybrid/server/api/chat.post.ts).
- Es gibt derzeit noch keinen implementierten Hybrid-Profile-Backend-Endpoint.
- Im `yarn.lock` tauchen Azure-Pakete auf. Das ist nur ein Indiz, dass Azure im erweiterten Umfeld eine Rolle spielen könnte.

Wichtige Einordnung:

- Aus dem Repo allein lässt sich nicht sicher belegen, wie Jan Sugint die Infra aktuell real betreibt.
- Diese Spezifikation beschreibt daher ein belastbares Soll-Modell, unabhängig vom aktuellen Stand.

## Architekturprinzip

Pinia bleibt nur lokaler Runtime-State.

Die eigentliche systemweite Wahrheit soll ein zentrales Backend-Profil sein.

```text
Web MultiStepForm
  -> Backend Hybrid Profile
  -> Pinia Hydration

Mobile App
  -> Backend Hybrid Profile
  -> App State Hydration

Chat Agent
  -> Backend Hybrid Profile
  -> normalisierter Chat-Kontext

CRM Sync
  -> Backend Hybrid Profile
  -> Mailchimp Tags / Merge Fields
```

## Kerngedanke

Nicht der Client erzeugt die endgültige Wahrheit, sondern das Backend.

Damit gilt:

- Wenn ein Nutzer auf Web die Hybrid-Analyse abschließt, wird ein Profil serverseitig gespeichert.
- Wenn derselbe Nutzer später die Mobile App öffnet, wird genau dieses Profil wieder geladen.
- Der Chat-Agent nutzt denselben Profildatensatz.
- Mailchimp erhält serverseitig abgeleitete Tags und wenige stabile Felder.

## Empfohlene Datenobjekte

### 1. Hybrid Profile

```ts
type HybridProfile = {
  profileId: string
  userId: string | null
  leadId: string | null
  email: string | null
  locale: string | null
  region: 'eu' | 'unknown'
  analysisVersion: number
  analysisCompletedAt: string | null
  answers: Record<string, string | number>
  derivedProfile: {
    sportType: 'cycling' | 'running' | 'hybrid' | 'general'
    trainingFrequency: 'low' | 'medium' | 'high' | 'irregular' | 'unknown'
    strengthStatus: 'none' | 'unstructured' | 'regular' | 'structured' | 'limited'
    budgetBand: 'low' | 'mid' | 'high' | 'premium' | 'unknown'
    equipmentLevel: 'none' | 'entry' | 'mid' | 'high' | 'unknown'
    onboardingIntent: 'starter' | 'active' | 'performance'
  }
  crmTags: string[]
  consent: {
    productProfiling: boolean
    marketing: boolean
    updatedAt: string | null
  }
  createdAt: string
  updatedAt: string
}
```

### 2. Identity Link

```ts
type HybridIdentityLink = {
  profileId: string
  userId: string | null
  email: string | null
  mailchimpSubscriberId: string | null
  mobileAppUserId: string | null
  webSessionId: string | null
}
```

### 3. Chat Context Snapshot

```ts
type HybridChatContext = {
  profileId: string
  summary: string
  answers: Record<string, string | number>
  derivedProfile: Record<string, string | number | boolean | null>
  crmTags: string[]
  updatedAt: string
}
```

## Backend-Schnittstellen

### Analyse speichern

```http
POST /api/hybrid-analysis
```

Pflichtzweck:

- Analyse serverseitig persistieren
- Profil aktualisieren
- derived profile berechnen
- CRM-Tags erzeugen

### Analyse laden

```http
GET /api/hybrid-analysis?profileId=hp_123
```

Wird genutzt für:

- Web-Hydration
- Mobile-App-Hydration
- Chat-Kontext

### Chat

Zielzustand:

```http
POST /api/chat
```

Request:

```json
{
  "message": "Wie sollte ich trainieren?",
  "profileId": "hp_123"
}
```

Der Server lädt dann selbst:

1. Hybrid Profile
2. Chat Context Snapshot
3. Wissensquellen

### CRM Sync

Keine direkte UI-zu-Mailchimp-Integration.

Empfohlen:

```http
POST /internal/crm/mailchimp-sync
```

Auslöser:

- Analyse abgeschlossen
- E-Mail bekannt
- Marketing-Freigabe vorhanden

## Hosting-Zielbild EU

Die Grundlage sollte in der EU liegen.

Empfohlenes Zielbild:

- App/API-Hosting in EU-Region
- Primärdatenbank in EU-Region
- Object Storage in EU-Region
- Secret Management in EU-Region
- Monitoring/Logging möglichst ebenfalls EU-gebunden oder datensparsam

## Azure als mögliche Zielplattform

Wenn Azure ohnehin im Umfeld von Jan Sugint verwendet wird, wäre ein mögliches EU-Zielbild:

- Azure App Service oder Container Apps in EU
- Azure Database for PostgreSQL in EU
- Azure Key Vault in EU
- Azure Storage in EU
- Azure App Configuration optional

Mögliche EU-Regionen:

- Germany West Central
- Germany North
- West Europe
- North Europe

Wichtige Einschränkung:

- Diese Regionen sind technische Optionen, keine automatische DSGVO-Freigabe.
- Verträge, Rollen und Datenflüsse müssen trotzdem sauber geregelt sein.

## Empfohlene Datenbankwahl

Für dieses Profilmodell ist eine relationale Datenbank naheliegend.

Empfehlung:

- PostgreSQL als Primärspeicher

Begründung:

- klare Profilrelationen
- gute Versionierung
- einfache API-Abfragen
- gute Kompatibilität mit Analytics- und CRM-Sync-Prozessen

Dokumentenspeicher wäre möglich, aber für dieses Modell nicht zwingend besser.

## Datenfluss im Betrieb

### Web

```text
MultiStepForm abgeschlossen
  -> POST /api/hybrid-analysis
  -> Backend speichert Profil
  -> Backend berechnet derivedProfile + crmTags
  -> Response
  -> Pinia hydratisiert aus Response
```

### Mobile App

```text
App Login / App Start
  -> GET /api/hybrid-analysis
  -> Backend liefert Profil
  -> App State wird hydratisiert
```

### Chat

```text
User fragt im Chat
  -> POST /api/chat mit profileId
  -> Backend lädt Profil
  -> Backend baut Chat-Kontext
  -> LLM-Antwort
```

### Mailchimp

```text
Profil aktualisiert
  -> Consent prüfen
  -> Mailchimp Payload bilden
  -> Tags + Merge Fields synchronisieren
```

## DSGVO-Modell

Europäische Server helfen, aber sie lösen nicht alles.

Wesentliche Architekturregeln:

- Produktprofil und Marketingzweck trennen
- nur erforderliche Daten speichern
- klare Consent-Felder führen
- Mailchimp-Sync nur serverseitig und freigabebasiert
- Lösch- und Auskunftsprozesse auf dem Backend-Profil aufsetzen

## Produktprofil vs. Marketingprofil

### Produktprofil

Zweck:

- Analyse
- App-Sync
- Chat-Personalisierung
- Nutzererlebnis

Typische Daten:

- Analyse-Antworten
- derived profile
- Zeitstempel
- interne IDs

### Marketingprofil

Zweck:

- Segmentierung
- Automationen
- E-Mail-Kommunikation

Typische Daten:

- Mailchimp Subscriber ID
- freigegebene Tags
- freigegebene Merge Fields
- Marketing Consent

Diese beiden Ebenen sollten logisch getrennt modelliert werden, auch wenn sie technisch aus demselben Profil abgeleitet werden.

## Consent-Logik

Empfohlene Minimaltrennung:

- `productProfiling`
- `marketing`

Regel:

- Produktprofil darf nur für die Produktfunktion verwendet werden.
- Marketing-Sync nur, wenn `marketing = true`.

## Synchronisationsstrategie

Empfehlung:

- Jede gespeicherte Analyse erhöht `analysisVersion`.
- Clients übernehmen immer den letzten serverseitigen Stand.
- Konflikte werden serverseitig aufgelöst.

Ein pragmatischer erster Ansatz:

- last-write-wins mit Version und Zeitstempel

Später möglich:

- feldbasierte Konfliktlösung
- Event-Historie

## Empfohlene Server-Module

- `server/api/hybrid-analysis.post.ts`
- `server/api/hybrid-analysis.get.ts`
- `server/api/chat.post.ts`
- `server/utils/hybridAnalysisProfile.ts`
- `server/utils/hybridAnalysisTags.ts`
- `server/utils/hybridAnalysisChatContext.ts`
- `server/utils/mailchimpSync.ts`
- `server/utils/consent.ts`

## Nächste sinnvolle Umsetzungsschritte

1. `profileId`-basiertes Backend-Modell definieren.
2. `POST /api/hybrid-analysis` als Stub implementieren.
3. `GET /api/hybrid-analysis` als Hydration-Endpoint implementieren.
4. Store-Hydration aus Backend vorbereiten.
5. Chat von direkter `analysis`-Payload auf `profileId` umstellen.
6. Mailchimp-Sync erst nach Consent und Senior Review freischalten.

## Entscheidung

Für das größere Ökosystem ist das sinnvolle Zielbild:

- EU-gehostetes zentrales Backend-Profil
- Pinia nur als lokaler Cache
- Mobile App und Web auf derselben Profilressource
- Chat liest denselben Kontext
- Mailchimp wird serverseitig aus kontrollierten Mappings gespeist
