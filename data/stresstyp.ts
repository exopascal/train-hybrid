export type StressTypId = 'weglaeufer' | 'gruebler' | 'durchhalter' | 'kuemmerer' | 'neustarter'

export interface StressTypOption {
  text: string
  type: StressTypId
}

export interface StressTypQuestion {
  id: string
  text: string
  options: StressTypOption[]
}

export interface StressTyp {
  id: StressTypId
  name: string
  subtitle: string
  intro: string
  insight: string
  need: string
}

export const QUESTIONS: StressTypQuestion[] = [
  {
    id: 'q1',
    text: 'Was geht dir nach einem langen Tag am häufigsten durch den Kopf?',
    options: [
      { text: 'Habe ich heute genug trainiert? Morgen laufe ich früh los.', type: 'weglaeufer' },
      { text: 'Was, wenn morgen etwas schiefgeht? Habe ich wirklich alles bedacht?', type: 'gruebler' },
      { text: 'Ich bin müde – aber ich kriege das alleine hin.', type: 'durchhalter' },
      { text: 'Hoffentlich waren alle zufrieden mit mir heute.', type: 'kuemmerer' },
      { text: 'Schon wieder nichts umgesetzt. Wann ändert sich das endlich?', type: 'neustarter' },
    ],
  },
  {
    id: 'q2',
    text: 'Dein Sporttag fällt aus. Was passiert in dir?',
    options: [
      { text: 'Er fällt eh oft aus, weil jemand anderes mich braucht.', type: 'kuemmerer' },
      { text: 'Das fühlt sich wie Versagen an – ich muss das schnell nachholen.', type: 'weglaeufer' },
      { text: 'Schon wieder. Das ist wahrscheinlich der Anfang vom Ende.', type: 'neustarter' },
      { text: 'Ich mache mir Sorgen, ob ich jetzt den Anschluss verliere.', type: 'gruebler' },
      { text: 'Kein Drama – ich schiebe es einfach still nach.', type: 'durchhalter' },
    ],
  },
  {
    id: 'q3',
    text: 'Du bist richtig platt. Was sagt deine innere Stimme?',
    options: [
      { text: '„Das schaffst du alleine. Noch ein bisschen."', type: 'durchhalter' },
      { text: '„Siehst du? Du ziehst sowieso nie etwas durch."', type: 'neustarter' },
      { text: '„Weitermachen – du hast noch Puffer."', type: 'weglaeufer' },
      { text: '„Du kannst jetzt nicht aufhören – da wartet noch jemand auf dich."', type: 'kuemmerer' },
      { text: '„Wenn du jetzt Pause machst, läuft etwas aus dem Ruder."', type: 'gruebler' },
    ],
  },
  {
    id: 'q4',
    text: 'Du hängst irgendwo fest. Was machst du als erstes?',
    options: [
      { text: 'Ich analysiere so lange, bis ich es alleine verstehe.', type: 'gruebler' },
      { text: 'Ich frage lieber, was die anderen brauchen, und stelle mich hinten an.', type: 'kuemmerer' },
      { text: 'Ich lenke mich ab – meistens durch Sport.', type: 'weglaeufer' },
      { text: 'Ich weiß, dass ich etwas tun sollte – aber ich komme nicht in Gang.', type: 'neustarter' },
      { text: 'Ich löse es allein. Nach Hilfe fragen liegt mir nicht.', type: 'durchhalter' },
    ],
  },
  {
    id: 'q5',
    text: 'Du hast eine Stunde unverplante Zeit. Was passiert?',
    options: [
      { text: 'Ich nehme mir vor zu trainieren, aber der Einstieg fällt schwer.', type: 'neustarter' },
      { text: 'Ich hole nach, was noch liegen geblieben ist.', type: 'durchhalter' },
      { text: 'Ich nutze sie zum Planen oder finde mich grübelnd wieder.', type: 'gruebler' },
      { text: 'Ich trainiere – das ist meine beste Zeit.', type: 'weglaeufer' },
      { text: 'Irgendwer findet sicher etwas, wofür er mich braucht.', type: 'kuemmerer' },
    ],
  },
  {
    id: 'q6',
    text: 'Was hält dich wirklich davon ab, dauerhaft gesünder zu leben?',
    options: [
      { text: 'Eigentlich nichts – ich trainiere ja schon viel.', type: 'weglaeufer' },
      { text: 'Mein Kopf schaltet auch beim Sport nicht ab.', type: 'gruebler' },
      { text: 'Ich habe schlicht keine Zeit für mich selbst.', type: 'kuemmerer' },
      { text: 'Ich versuche alles alleine durchzuziehen – bis es mich bricht.', type: 'durchhalter' },
      { text: 'Ich fange immer wieder an und höre wieder auf.', type: 'neustarter' },
    ],
  },
]

export const TYPEN: Record<StressTypId, StressTyp> = {
  weglaeufer: {
    id: 'weglaeufer',
    name: 'Der Wegläufer',
    subtitle: 'Du beweist deinen Wert über Leistung.',
    intro: 'Training ist dein Ventil – aber auch ein weiterer Leistungsbereich. Ein ausgefallener Lauf fühlt sich wie Versagen an. Du setzt Trainingsstress auf Alltagsstress und gibst deinem Körper so häufige Stressspitzen.',
    insight: 'Müde trotz Schlaf, stagnierende Leistung, Überlastungssyndrome – dein Körper zahlt die Rechnung für dein Tempo.',
    need: 'Krafttraining statt noch mehr Kilometer. Und Erholung als Teil des Trainingsplans – nicht als Schwäche, sondern als Leistung.',
  },
  gruebler: {
    id: 'gruebler',
    name: 'Der Grübler',
    subtitle: 'Du kannst nicht loslassen – weil Kontrolle sich sicher anfühlt.',
    intro: 'Du planst, durchdenkst und sicherst ab. Abends läuft dein Kopf weiter, auch wenn der Tag längst vorbei ist. Das Nervensystem schaltet nicht ab.',
    insight: 'Einschlafprobleme, Kopfschmerzen, angespannte Schultern – dein Körper ist permanent in Alarmbereitschaft.',
    need: 'Ein fester Abschaltpunkt zwischen Arbeit und Abend. Training, das volle Aufmerksamkeit fordert, damit der Kopf keinen Platz zum Grübeln hat.',
  },
  durchhalter: {
    id: 'durchhalter',
    name: 'Der Durchhalter',
    subtitle: 'Du zeigst keine Schwäche – bis nichts mehr geht.',
    intro: 'Nach außen stabil, innen unter Dauerdruck. Du machst dir extremen Druck, nimmst deine Grenzen kaum wahr und bemerkst es erst, wenn nichts mehr geht.',
    insight: 'Rücken- und Nackenprobleme, Zusammenbrüche nach stressigen Phasen, schlechte Regeneration – dein Körper trägt mehr, als du zugibst.',
    need: 'Körperwahrnehmung durch Body-Scans, Mobilität und Stabilität statt reiner Belastung. Und der Austausch mit anderen – weil du dort merkst, dass es okay ist zu spüren.',
  },
  kuemmerer: {
    id: 'kuemmerer',
    name: 'Der Kümmerer',
    subtitle: 'Für alle hast du Zeit – nur nicht für dich.',
    intro: 'Job, Familie, Freunde – du sagst Ja zu allem und allen. Dein Training ist das Erste, das gestrichen wird. Sich selbst etwas Gutes zu tun fühlt sich seltsam falsch an.',
    insight: 'Energieabfall, das Gefühl eingerostet zu sein, unregelmäßiges Training – weil du dich selbst nie ganz ernst nimmst.',
    need: 'Eine Minimaldosis Training, die immer reinpasst. Und die Überzeugung: Dein Termin mit dir ist genauso wichtig wie jeder andere.',
  },
  neustarter: {
    id: 'neustarter',
    name: 'Der Neustarter',
    subtitle: 'Du hast es schon oft versucht – und zweifelst deshalb an dir.',
    intro: 'Viele Anläufe, viele Abbrüche. Jede verpasste Einheit fühlt sich an wie gescheitert. Du wartest auf den perfekten Zeitpunkt und verlierst die Motivation, bevor Beständigkeit entstehen kann.',
    insight: 'Schneller Muskelkater, wenig Ausdauer, Frust nach den ersten Einheiten – das Muster wiederholt sich.',
    need: 'Kleine Schritte, die du sicher schaffst. Schnelle Erfolgserlebnisse. Und jemanden, der dich verbindlich hält – von außen.',
  },
}

export function computeResult(answers: Record<string, StressTypId>): StressTypId {
  const counts: Record<StressTypId, number> = {
    weglaeufer: 0, gruebler: 0, durchhalter: 0, kuemmerer: 0, neustarter: 0,
  }
  for (const v of Object.values(answers)) {
    if (v in counts) counts[v]++
  }
  const order: StressTypId[] = ['weglaeufer', 'gruebler', 'durchhalter', 'kuemmerer', 'neustarter']
  return order.reduce((best, t) => counts[t]! > counts[best]! ? t : best, order[0]!)
}
