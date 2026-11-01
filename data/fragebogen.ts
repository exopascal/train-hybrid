/**
 * Inhalte des Fragebogens (/fragebogen).
 * Alle Texte, Antwortoptionen und Preise stehen hier, die Logik liegt in stores/fragebogen.ts.
 */

export type FbKind =
  | 'intro'
  | 'slider'
  | 'ratings'
  | 'single'
  | 'multi'
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
  ['Zur Ruhe kommen', 'Nervensystem beruhigen'],
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

/** Phase 1: Fragen in eigener Sprache, ohne Fachbegriffe */
export const PHASE1: FbQuestion[] = [
  { id: 's1', kind: 'slider', title: 'Wie voll ist dein Alltag gerade?', left: 'Luft, aber unruhig', mid: 'Voll, aber machbar', right: 'Kaum Luft zum Atmen' },
  { id: 'zufrieden', kind: 'ratings', title: 'Wie zufrieden bist du gerade?', rows: [['koerper', 'Mit deiner körperlichen Verfassung'], ['mental', 'Mit deiner mentalen Verfassung']] },
  { id: 'zufrieden2', kind: 'ratings', title: 'Und konkret?', rows: [['ausdauer', 'Wie zufrieden bist du mit deiner Ausdauer?'], ['kraft', 'Wie zufrieden bist du mit deiner Kraft?']] },
  { id: 's2', kind: 'multi', title: 'Wie trainierst du aktuell?', lead: 'Mehrfachauswahl möglich.', opts: ['Laufen', 'Radfahren', 'Krafttraining', 'Schwimmen', 'Anderes', 'Kaum'], exclusive: 'Kaum' },
  { id: 's2a', kind: 'single', title: 'Wie viel Zeit investierst du die Woche in dein Training?', opts: ZEIT_PRO_WOCHE },
  { id: 's2c', kind: 'single', title: 'Wie viel Zeit investierst du die Woche in deine mentale Gesundheit?', opts: ZEIT_PRO_WOCHE },
  { id: 's2b', kind: 'yesno', title: 'Hast du trotz deines aktuellen Trainings Probleme?', follow: 'Wenn ja, welche?' },
  { id: 's3', kind: 'reagiert', required: true, title: 'Gibt es Momente, in denen du gestresst bist und deshalb überreagierst?' },
  { id: 's4', kind: 'multi', title: 'Was unternimmst du aktuell gegen Stress?', lead: 'Mehrfachauswahl möglich.', opts: PROBIERT, exclusive: 'Noch nichts' },
  { id: 's5', kind: 'yesno', title: 'Hast du dazu gegoogelt oder woanders nach Hilfe gesucht?', follow: 'Wenn ja, was?' },
  {
    id: 's5b', kind: 'multi', text: true, title: 'Was hält dich davon ab, dein Problem zu lösen?', lead: 'Mehrfachauswahl möglich.',
    opts: ['Keine Zeit', 'Zu müde, keine Energie', 'Mein Kopf ist zu voll', 'Ich weiß nicht, was für mich richtig ist', 'Ich habe keinen festen Plan', 'Ich bleibe nicht dran'],
  },
  { id: 's5d', kind: 'long', title: 'Wie müsste ein Programm aufgebaut sein, damit du dein Problem lösen kannst?' },
  { id: 's5e', kind: 'long', title: 'Was würde dir helfen, dieses Programm durchzuziehen?' },
  { id: 's5e2', kind: 'single', title: 'Wie viel hast du bisher ungefähr für Training, Ausrüstung, Stressreduzierung, Kurse oder Ähnliches ausgegeben?', opts: ['Nichts', 'Unter 100 €', '100 bis 500 €', '500 bis 1.500 €', 'Über 1.500 €'] },
  { id: 's5f', kind: 'single', title: 'Wie viel bist du bereit, in den nächsten 5 Wochen in deine sportliche Entwicklung zu investieren?', opts: ['Unter 300 €', '300 bis 700 €', '700 bis 1.500 €', 'Über 1.500 €'] },
]

export const SKEPSIS: FbQuestion = {
  id: 's12',
  kind: 'long',
  title: 'Was würde dich an einem Plan, der Kraft, Ausdauer und Achtsamkeit verbindet, am meisten stören oder skeptisch machen?',
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
