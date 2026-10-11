# SportSwitch — Audience-Personalisierung & User Journey

## Was ist der SportSwitch?

Der `SportSwitch` ist die zentrale Komponente, über die sich ein Besucher als **Läufer** oder **Radfahrer** identifiziert. Diese eine Entscheidung personalisiert die gesamte Seite — Texte, CTAs, Marquee-Banner, Sektionsinhalte — und wird dauerhaft in `localStorage` gespeichert sowie als Tag in Mailchimp übertragen.

Runner steht immer links. Cyclist immer rechts. Konsistent auf allen Varianten.

---

## Varianten

```vue
<!-- Header: Toggle-Bubble mit GSAP-Animation -->
<SportSwitch variant="toggle" />

<!-- Hero / Banner: Pill-Buttons auf dunklem Hintergrund -->
<SportSwitch variant="pills" />
```

| Variante | Kontext | Stil |
|---|---|---|
| `toggle` | Header rechts | Sliding Bubble, Icon Runner / Cyclist |
| `pills` | IntroHero, Footer, CTA-Bereiche | Pill-Buttons, Label ausgeschrieben |

Kein `v-model` nötig. Der State ist global via `useSportMode` (`useState` — Nuxt SSR-safe). Jede Instanz von `SportSwitch` liest und schreibt denselben State. Eine Änderung im Header spiegelt sich sofort in der IntroHero wider und umgekehrt.

---

## Warum das das Nutzererlebnis fördert

### Sofortige Relevanz
Ein Läufer, der auf die Seite kommt, sieht ab dem Moment der Auswahl nur noch laufspezifische Headlines, CTAs und Argumente. Kein generisches "Ausdauersportler". Die Identifikation passiert einmalig — danach ist die Seite *seine* Seite.

### Niedrige Hürde, hohe Bindung
Die Auswahl kostet einen Klick. Sie signalisiert dem Nutzer, dass die Seite ihn versteht. Das Wiederkommen-Erlebnis (localStorage: Auswahl wird beim nächsten Besuch erinnert) verstärkt das Gefühl der Kontinuität.

### Journey-Momentum
Die Auswahl passiert prominent in der IntroHero — noch bevor der Nutzer weiterscrollt. Die Entscheidung, sich zu identifizieren, ist der erste aktive Schritt in der User Journey. Wer sich nicht entscheidet, bekommt den generischen Inhalt. Der Switch erzeugt sanften Druck ohne zu zwingen.

---

## Mailchimp-Integration

### Wie es funktioniert

Wenn ein Nutzer über ein Formular (Analyse-CTA, Newsletter) seine E-Mail hinterlässt, wird der aktuell gespeicherte `sport-mode` aus `localStorage` als **Merge Field** oder **Tag** an Mailchimp übergeben.

### Merge Field einrichten

In Mailchimp unter **Audience → Settings → Audience fields and \*|MERGE|\* tags** ein neues Feld anlegen:

| Einstellung | Wert |
|---|---|
| Field label | Sport Mode |
| Tag | `SPORTMODE` |
| Field type | Text |
| Default value | `general` |

Im Formular-Submit (z.B. im Analyse-CTA oder Newsletter-Formular) wird das Feld befüllt:

```ts
// Beispiel: beim Formular-Submit
const sportMode = localStorage.getItem('sport-mode') ?? 'general'

await $fetch('/api/mailchimp-subscribe', {
  method: 'POST',
  body: {
    email: formEmail,
    mergeFields: {
      SPORTMODE: sportMode, // 'runner' | 'cyclist' | 'general'
    },
  },
})
```

### Tags (für Segmentierung)

Zusätzlich zum Merge Field können Tags gesetzt werden — direkt via Mailchimp API:

```ts
tags: [
  { name: sportMode === 'runner' ? 'runner' : 'cyclist', status: 'active' },
  { name: 'train-hybrid-web', status: 'active' },
]
```

---

## User Journey Tags — Erklärung

Tags in Mailchimp beschreiben **wo im Funnel** sich ein Kontakt befindet und **wer er ist**. Sie ermöglichen zielgenaue Kampagnen.

### Sport-Identität

| Tag | Bedeutung | Wann gesetzt |
|---|---|---|
| `runner` | Hat sich als Läufer identifiziert | Bei Mailchimp-Eintrag, wenn `sport-mode = runner` |
| `cyclist` | Hat sich als Radfahrer identifiziert | Bei Mailchimp-Eintrag, wenn `sport-mode = cyclist` |
| `general` | Keine Auswahl getroffen | Fallback wenn Switch nie genutzt wurde |

### Funnel-Position

| Tag | Bedeutung | Wann gesetzt |
|---|---|---|
| `lead-cold` | Erster Kontakt, noch kein Interesse signalisiert | Newsletter-Eintrag ohne CTA-Interaktion |
| `lead-warm` | Hat Analyse-CTA geklickt oder Seite tief erkundet | Nach Klick auf "Hybrid-Analyse starten" |
| `lead-hot` | Hat Analyse ausgefüllt / aktiv angefragt | Nach Formular-Submit der Analyse |
| `protokoll-viewer` | Hat `/hybrid-protokoll` besucht | Kann via URL-Tracking gesetzt werden |
| `blog-reader` | Hat mindestens einen Blog-Artikel gelesen | Via Blog-Newsletter-Widget |

### Empfohlene Segmente in Mailchimp

| Segment | Filter | Kampagnen-Idee |
|---|---|---|
| Läufer, warm | `runner` + `lead-warm` | "Dein 12-Wochen-Plan für Läufer" |
| Radfahrer, kalt | `cyclist` + `lead-cold` | Kurzform-Content: Warum Kraft am Berg zählt |
| Alle, heiß | `lead-hot` | Direkte Protokoll-Empfehlung + Testimonials |
| Keine Auswahl | `general` + `lead-warm` | Re-Engagement: "Bist du Läufer oder Radfahrer?" |

---

## State-Architektur

```
localStorage ('sport-mode')
       ↕
useState ('sportMode')           ← Nuxt global reactive state
       ↓
useSportMode() composable
       ↓
┌──────────────┬──────────────────────────────────┐
│ SportSwitch  │  variant="toggle" im Header       │
│ SportSwitch  │  variant="pills" in IntroHero     │
│ HeroSection  │  headline / subhead / ctaLabel    │
│ BannerTypo   │  topText / bottomText             │
│ Identification│  laufspezifische Argumente       │
└──────────────┴──────────────────────────────────┘
```

Eine Änderung am Switch → alle Komponenten reagieren sofort. Kein Event-Bus, kein Pinia. Einfacher globaler State via Nuxt `useState`.
