/**
 * Inhalte des Fragebogens (/fragebogen).
 * Alle Texte, Antwortoptionen und Preise stehen hier, die Logik liegt in stores/fragebogen.ts.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FbKind =
  | 'intro'
  | 'slider'
  | 'ratings'
  | 'single'
  | 'multi'
  | 'worst'
  | 'yesno'
  | 'reagiert'
  | 'long'
  | 'transition1'
  | 'term'
  | 'pairs'
  | 'ads'
  | 'headline'
  | 'transition2'
  | 'plan'
  | 'offer'
  | 'email'
  | 'thanks'

export interface FbQuestion {
  id: string
  kind: FbKind
  title: string
  required?: boolean
  lead?: string
  opts?: string[]
  /** Option, die alle anderen abwählt (z.B. "Noch nichts") */
  exclusive?: string
  /** Mehrfachauswahl mit zusätzlichem Freitextfeld */
  text?: boolean
  /** Id der Multi-Frage, deren Auswahl als Optionen angezeigt werden (kind: 'worst') */
  followFrom?: string
  /** Optionen untereinander statt im Grid */
  stack?: boolean
  /** Nachfrage bei "Ja" */
  follow?: string
  /** Slider-Beschriftungen links, Mitte, rechts */
  left?: string
  mid?: string
  right?: string
  /** Mehrere Slider auf einer Seite: [Feldname, Beschriftung] */
  rows?: [string, string][]
}

export interface FbTerm {
  key: string
  name: string
  def: string
}

export interface FbScreen {
  id: string
  kind: FbKind
  step?: number
  phase?: 1 | 2 | 3
  /** Begriff x von 4 */
  sub?: number
  /** Kein "Zurück" auf und vor dieser Seite */
  lock?: boolean
  q?: FbQuestion
  term?: FbTerm
}

/** Rückzahlungsbetrag der Schweinehund-Garantie (Platzhalter, z.B. '300 €') */
export const GARANTIE_BETRAG = 'xxx'

/** Lieferumfang mit Einzelpreisen in Cent */
export const LIEFERUMFANG = [
  { name: 'TMX Trigger Kissen', cent: 14995 },
  { name: 'TMX Dura', cent: 3495 },
  { name: 'EXOPEK Pro', cent: 30000 },
]

export const PREIS_OPTIONEN = ['1.500 €', '950 €', '600 €', 'Keiner davon']

export const TERMS: FbTerm[] = [
  { key: 'sarkopenie', name: 'Sarkopenie', def: 'Der altersbedingte Abbau von Muskelmasse und Muskelkraft.' },
  { key: 'longevity', name: 'Longevity', def: 'Wie du möglichst lange gesund und leistungsfähig bleibst.' },
  { key: 'nervensystem', name: 'Nervensystem regulieren', def: 'Deinem Körper helfen, von Anspannung wieder in Erholung zu kommen.' },
  { key: 'mindfulness', name: 'Mindfulness', def: 'Bewusst im Moment sein, z.B. durch Atem- und Körperübungen.' },
]

export const PAIRS: [string, string][] = [
  ['Muskelabbau', 'Sarkopenie'],
  ['Zur Ruhe kommen', 'Nervensystem regulieren'],
  ['Gesund alt werden', 'Longevity'],
]

export const SENTS = [
  { id: 'S1', text: 'Wusstest du, dass Stress deinen Muskelabbau beschleunigt?' },
  { id: 'S2', text: 'Du läufst, du bewegst dich und trotzdem verlierst du Muskeln und kommst nicht zur Ruhe.' },
  { id: 'S3', text: 'Dein Trainingsplan gegen Stress und Unruhe.' },
]

export const H1S = [
  { id: 'A', text: 'Dein Trainingsplan gegen Stress, Sarkopenie und Unruhe.' },
  { id: 'B', text: 'Mehr Muskeln, mehr Ausdauer, ein ruhiger Kopf. In einem Trainingsplan.' },
  { id: 'C', text: 'Du trainierst und bist trotzdem unzufrieden? Krafttraining, Ausdauer und Mindfulness effizient kombinieren.' },
]

export const H2_A = 'Kraft, Ausdauer und Mindfulness. In einem Trainingsplan, der in deinen Alltag passt.'

export const HAEUFIG = ['Nie', 'Selten', 'Manchmal', 'Oft', 'Fast immer']
export const ZEIT_PRO_WOCHE = ['Gar keine', 'Unter 1 Stunde', '1 bis 2 Stunden', '2 bis 4 Stunden', 'Mehr als 4 Stunden']
export const PROBIERT = ['Mehr Sport', 'Meditation', 'Atemübungen', 'Spazieren gehen', 'Lesen', 'Mich informieren', 'Noch nichts']
export const GESCHLECHT = ['Männlich', 'Weiblich', 'Divers', 'Keine Auskunft']
export const ALTER = ['Unter 25', '25 – 34', '35 – 44', '45 – 54', '55+']
export const ARBEITSSTUNDEN = ['Unter 30', '30 – 40', '40 – 50', 'Über 50']
export const TRAININGSORT = ['Draußen', 'Zuhause', 'Studio', 'Egal – Hauptsache es passt rein']

/** Phase 1: Fragen in eigener Sprache, ohne Fachbegriffe */
export const PHASE1: FbQuestion[] = [
  { id: 'geschlecht', kind: 'single', title: 'Welches Geschlecht hast du?', opts: GESCHLECHT },
  { id: 'alter', kind: 'single', title: 'Wie alt bist du?', opts: ALTER },
  { id: 'beruf', kind: 'long', title: 'Was machst du beruflich?' },
  { id: 'arbeitsstunden', kind: 'single', title: 'Wie viele Stunden arbeitest du in einer normalen Woche?', opts: ARBEITSSTUNDEN },
  { id: 's1', kind: 'slider', title: 'Wie voll ist dein Alltag gerade?', left: 'Luft, aber unruhig', mid: 'Voll, aber machbar', right: 'Kaum Luft zum Atmen' },
  { id: 'zufrieden', kind: 'ratings', title: 'Wie zufrieden bist du gerade?', rows: [['koerper', 'Mit deiner körperlichen Verfassung'], ['mental', 'Mit deiner mentalen Verfassung']] },
  { id: 'zufrieden2', kind: 'ratings', title: 'Und konkret?', rows: [['ausdauer', 'Wie zufrieden bist du mit deiner Ausdauer?'], ['kraft', 'Wie zufrieden bist du mit deiner Kraft?']] },
  { id: 's2', kind: 'multi', title: 'Wie trainierst du aktuell?', lead: 'Mehrfachauswahl möglich.', opts: ['Laufen', 'Radfahren', 'Krafttraining', 'Schwimmen', 'Anderes', 'Kaum'], exclusive: 'Kaum' },
  { id: 's2a', kind: 'single', title: 'Wie viel Zeit investierst du die Woche in dein Training?', opts: ZEIT_PRO_WOCHE },
  { id: 'trainingsort', kind: 'single', title: 'Wo trainierst du am liebsten?', opts: TRAININGSORT },
  { id: 's2c', kind: 'single', title: 'Wie viel Zeit investierst du die Woche in deine mentale Gesundheit?', opts: ZEIT_PRO_WOCHE },
  { id: 's2b', kind: 'yesno', title: 'Hast du trotz deines aktuellen Trainings Probleme?', follow: 'Wenn ja, welche?' },
  { id: 's3', kind: 'reagiert', title: 'Gibt es Momente, in denen du gestresst bist und deshalb überreagierst?' },
  { id: 's4', kind: 'multi', title: 'Was unternimmst du aktuell gegen Stress?', lead: 'Mehrfachauswahl möglich.', opts: PROBIERT, exclusive: 'Noch nichts' },
  { id: 's5', kind: 'yesno', title: 'Hast du dazu gegoogelt oder woanders nach Hilfe gesucht?', follow: 'Wenn ja, was?' },
  {
    id: 's4c', kind: 'multi', text: true, stack: true, title: 'Was trifft in den letzten 4 Wochen auf dich zu?', lead: 'Mehrfachauswahl möglich.',
    exclusive: 'Nichts davon',
    opts: [
      'Ich liege abends im Bett und mein Kopf läuft weiter',
      'Ich wache zu früh auf und denke an die Arbeit',
      'Ich trainiere viel Ausdauer, aber fühle mich schwächer als früher',
      'Ich trainiere viel Kraft, aber fühle mich unausgeglichen oder unfit',
      'Ich trainiere, um Stress abzubauen, bin danach aber eher platt als ruhig',
      'Ich habe öfter Rücken-, Nacken- oder Knieprobleme',
      'Ich lasse Training ganz ausfallen, wenn der Tag voll ist',
      'Ich weiß, dass ich was tun müsste, aber nicht, wo ich anfangen soll',
      'Nichts davon',
    ],
  },
  { id: 's4d', kind: 'worst', title: 'Welcher dieser Punkte nervt dich am meisten – und warum?', followFrom: 's4c' },
  { id: 's4e', kind: 'long', title: 'Wann hast du zuletzt gemerkt: „So geht das nicht weiter." – Was ist da passiert?' },
  { id: 's4f', kind: 'slider', title: 'Wie stark belastet dich das gerade?', left: 'Gar nicht', mid: '', right: 'Sehr stark' },
  {
    id: 's5b', kind: 'multi', text: true, stack: true, title: 'Was hält dich davon ab, dein Problem zu lösen?', lead: 'Mehrfachauswahl möglich.',
    opts: ['Keine Zeit', 'Zu müde, keine Energie', 'Mein Kopf ist zu voll', 'Ich weiß nicht, was für mich richtig ist', 'Ich habe keinen festen Plan', 'Ich bleibe nicht dran'],
  },
  { id: 's5e2', kind: 'single', title: 'Wie viel hast du bisher ungefähr für Training, Ausrüstung, Stressreduzierung, Kurse oder Ähnliches ausgegeben?', opts: ['Nichts', 'Unter 100 €', '100 bis 500 €', '500 bis 1.500 €', 'Über 1.500 €'] },
  { id: 's5f', kind: 'single', title: 'Wie viel bist du bereit, für deine physische und mentale Gesundheit zu investieren? Über einen Zeitraum von 5 Wochen?', opts: ['Unter 300 €', '300 bis 700 €', '700 bis 1.500 €', 'Über 1.500 €'] },
]

export const S5D: FbQuestion = { id: 's5d', kind: 'long', title: 'Wie müsste ein Programm aufgebaut sein, damit du dein Problem lösen kannst?' }
export const S5E: FbQuestion = { id: 's5e', kind: 'long', title: 'Was würde dir helfen, dieses Programm durchzuziehen?' }

export const SKEPSIS: FbQuestion = {
  id: 's12',
  kind: 'multi',
  stack: true,
  title: 'Stell dir ein Programm vor, das in 3x 30–40 min pro Woche Kraft- und Ausdauertraining mit kurzen Mindfulness-Meditationen und Entspannungsimpulsen verbindet. Was wäre dein erster Gedanke?',
  lead: 'Mehrfachauswahl möglich.',
  opts: [
    'Genau das suche ich',
    'Klingt gut, aber ich habe keine Zeit',
    'Klingt kompliziert',
    'Ich weiß nicht, ob ich das durchziehe',
    'Meditation ist nichts für mich',
    'Bringt das wirklich was?',
    'Brauche ich nicht',
    'Mich interessiert nur Kraft',
    'Mich interessiert nur Ausdauer',
    'Mich interessiert nur Meditation',
    'Mich interessieren nur Entspannungsimpulse',
  ],
}

/** Startplan */
export const ZEIT = [
  { v: 60, l: 'ca. 1 Stunde' },
  { v: 120, l: 'ca. 2 Stunden', sub: 'Empfehlung zum Start' },
  { v: 180, l: 'ca. 3 Stunden' },
  { v: 240, l: '4 Stunden oder mehr' },
]
export const EINHEITEN = [2, 3, 4, 5].map((n) => ({ v: n, l: `${n} Einheiten pro Woche` }))
export const PILLARS = { kraft: 'Kraft', ausdauer: 'Ausdauer', mind: 'Mindfulness' } as const
export const LETTER = { kraft: 'K', ausdauer: 'A', mind: 'M' } as const
export const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
export const PATTERN: Record<number, number[]> = { 2: [0, 3], 3: [0, 2, 5], 4: [0, 1, 3, 5], 5: [0, 1, 2, 4, 5] }

export function euro(cent: number): string {
  return `${(cent / 100).toLocaleString('de-DE', { minimumFractionDigits: cent % 100 ? 2 : 0, maximumFractionDigits: 2 })} €`
}
