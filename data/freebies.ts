export type FreebieItem = {
  to: string
  title: string
  sub: string
  img: string
  cta?: string
  imgClass?: string
}

/** Aktuelle Krafttraining-Einstiege (bisherige Startseite / Unterseite Krafttraining). */
export const kraftFreebies: FreebieItem[] = [
  {
    to: "/kraft-fundament",
    title: "Das Kraft-Fundament",
    sub: "Wenn du diese 3 Schritte umsetzt, baust du Kraft auf.",
    img: "/trainhybrid-muskeltraining-background-video-fallback.jpg",
  },
  {
    to: "/trainingstransformation",
    title: "Den Pace erhöhen.",
    sub: "Mit diesen Übungen kannst du schneller werden.",
    img: "/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg",
  },
  {
    to: "/5-wochen-kraft-protokoll",
    title: "Das 5-Wochen-Kraft-Protokoll",
    sub: "In nur 5 Wochen kommst du zu spürbar mehr Kraft.",
    img: "/krafttraining-ausdauersportler-mobil-outdoor-hybrid.jpg",
    imgClass: "feature-card__img--product",
  },
  {
    to: "/schweinehund-trick",
    title: "Der Schweinehund-Trick",
    sub: "So einfach und schnell bekämpfst du die 3 größten Motivationskiller.",
    img: "/krafttraining-outdoorsport-joggen-laufen-gravelbike.jpg",
  },
]

/** Einstiege für die neue Startseite: Train Hybrid + Mindfulness. */
export const mindfulnessFreebies: FreebieItem[] = [
  {
    to: "/12-minuten-krafteinheit",
    title: "Die 12-Minuten-Krafteinheit",
    sub: "Du hast keine 90 Minuten. Du brauchst sie nicht.",
    img: "/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg",
  },
  {
    to: "/4-minuten-tabata",
    title: "Der 4-Minuten-Tabata",
    sub: "Keine Zeit? Du hast vier Minuten.",
    img: "/krafttraining-outdoorsport-joggen-laufen-gravelbike.jpg",
  },
  {
    to: "/atem-start",
    title: "Der Atem-Start",
    sub: "Du bist wach. Und schon im Rückstand.",
    img: "/krafttraining-outdoor-laufen-gehen-gravel.jpg",
  },
  {
    to: "/abend-meditation",
    title: "Die Abend-Meditation",
    sub: "Dein Körper ist im Bett. Dein Kopf noch im Büro.",
    img: "/krafttraining-outdoorsport-joggen-laufen-gravelbike-ultrawide.jpg",
  },
]
