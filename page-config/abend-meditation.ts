export default {
  seo: {
    title: "Die Abend-Meditation – Den Tag loslassen, bevor du schlafen gehst",
    description:
      "Eine ruhige Meditation für den Abend: Atem, Körper, Gedanken. Für Ausdauersportler und Vielbeschäftigte, die abschalten wollen – ohne Esoterik.",
    canonical: "/abend-meditation",
    ogTitle: "Die Abend-Meditation – Den Tag loslassen, bevor du schlafen gehst",
    ogDescription:
      "Eine ruhige Meditation für den Abend: Atem, Körper, Gedanken. Für Ausdauersportler und Vielbeschäftigte, die abschalten wollen – ohne Esoterik.",
  },
  sections: [
    {
      type: "hero",
      props: {
        eyebrow:
          "Meditation am Abend für Ausdauersportler und Vielbeschäftigte — etwa 10 Minuten, um den Tag loszulassen.",
        headline: "Dein Körper ist im Bett.<br>Dein Kopf noch im Büro.",
        subhead:
          "Eine geführte Abfolge zum Abladen: Atem, Körper, Gedanken. Kein Räucherstäbchen, kein Esoterik-Gerede. Nur ein klarer Abschluss für den Tag.",
        ctaLabel: "Abend-Meditation öffnen",
        rightImgSrc: "/krafttraining-outdoor-laufen-gehen-gravel.jpg",
        rightImgAlt: "Ruhiger Abend nach dem Training",
      },
    },
    {
      type: "haltung",
      props: {
        bgStyle: "night",
        headlineOne: "Du hast den Tag überstanden.",
        headlineTwo: "Aber hast du ihn auch abgeschlossen?",
        body:
          "Mails, Gespräche, offene Punkte – sie kommen mit ins Bett. Du trainierst, du isst gut, du gehst früh schlafen. Und liegst trotzdem wach. Weil Körper und Kopf nicht zur gleichen Zeit Feierabend machen.\nDein Körper braucht ein Signal: Jetzt ist Schluss.",
        transition: "Zehn Minuten Abschluss. Dann darf der Tag gehen.",
      },
    },
    {
      type: "yesIdent",
      props: {
        kicker: "Dein Zeitstrahl",
        headline: "Vom Grübeln zum Loslassen.",
        subhead: "Vier Bilder. Dein Abend kann ein anderes zeigen als gestern.",
        cards: [
          {
            id: "01",
            title: "Gestern: So lief dein Abend bisher.",
            body:
              "Sofa, Handy, Serie. Müde, aber nicht wirklich abgeschaltet.",
          },
          {
            id: "02",
            title: "Heute: So kann es laufen, wenn du dich entscheidest.",
            body:
              "Licht gedimmt, Handy weg. Zehn Minuten, in denen nichts von dir verlangt wird.",
          },
          {
            id: "03",
            title: "Morgen: So wird dein Alltag aussehen.",
            body:
              "Du gehst ins Bett wie jemand, der seinen Tag abgeschlossen hat. Du wachst auf und bist bei dir.",
          },
          {
            id: "04",
            title: "Status: So sehen dich andere.",
            body:
              "Du bist der, der abschalten kann. Nach außen wirkt es wie Gelassenheit. Innen ist es ein Entschluss.",
          },
        ],
      },
    },
    {
      type: "protocolTimeline",
      props: {
        bgStyle: "light",
        kicker: "Der Ablauf",
        headline: "5 Schritte. Etwa 10 Minuten.",
        subhead:
          "Bequem sitzen oder liegen, Licht gedimmt, Handy außer Reichweite. Mehr brauchst du nicht.",
        weeks: [
          {
            week: "Schritt 1",
            title: "Ankommen",
            focus: "Den Körper hinlegen, den Tag draußen lassen.",
            deliverables: [
              "Bequeme Position, Augen schließen",
              "Drei tiefe Atemzüge mit hörbarem Ausatmen",
              "Merken: Jetzt ist nichts mehr zu tun",
            ],
          },
          {
            week: "Schritt 2",
            title: "Den Tag abladen",
            focus: "Offene Punkte ablegen, nicht lösen.",
            deliverables: [
              "Die drei größten Dinge des Tages kurz benennen",
              "Jedes in eine imaginäre Schublade legen",
              "Schublade zu – morgen früh wieder auf",
            ],
          },
          {
            week: "Schritt 3",
            title: "Den Körper durchgehen",
            focus: "Von den Füßen bis zum Kopf spüren.",
            deliverables: [
              "Füße, Waden, Oberschenkel, Becken",
              "Bauch, Brust, Schultern, Arme",
              "Nacken, Gesicht, Stirn – jeweils beim Ausatmen weich werden lassen",
            ],
          },
          {
            week: "Schritt 4",
            title: "Atem beobachten",
            focus: "Nichts verändern, nur zuschauen.",
            deliverables: [
              "Atem ohne Steuerung wahrnehmen",
              "Wandern die Gedanken, kehrst du ruhig zurück",
              "Zwei bis drei Minuten reichen",
            ],
          },
          {
            week: "Schritt 5",
            title: "Loslassen",
            focus: "Den Tag verabschieden.",
            deliverables: [
              "Ein Gedanke: Das war genug für heute",
              "Langsam die Finger und Zehen bewegen",
              "Augen öffnen oder direkt in den Schlaf gleiten",
            ],
          },
        ],
      },
    },
    {
      type: "closing",
      props: {
        bgStyle: "night",
        headline: "Zehn Minuten. Heute Abend.",
        subhead: "Der Tag darf jetzt gehen.",
        ctaLabel: "Mehr erfahren",
        note: "Gefällt dir das? Dann erzähle ich dir gern mehr.",
      },
    },
  ],
} as const
