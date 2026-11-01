export default {
  seo: {
    title: "Die 12-Minuten-Krafteinheit – Kraft ohne Studio, ohne Ausrede",
    description:
      "30 Sekunden Power, 20 Sekunden Pause, 7 Übungen, 2 Runden. Eine Krafteinheit für Ausdauersportler und Vielbeschäftigte – zu Hause, ohne Geräte.",
    canonical: "/12-minuten-krafteinheit",
    ogTitle: "Die 12-Minuten-Krafteinheit – Kraft ohne Studio, ohne Ausrede",
    ogDescription:
      "30 Sekunden Power, 20 Sekunden Pause, 7 Übungen, 2 Runden. Eine Krafteinheit für Ausdauersportler und Vielbeschäftigte – zu Hause, ohne Geräte.",
  },
  sections: [
    {
      type: "hero",
      props: {
        eyebrow:
          "12-Minuten-Krafteinheit für Ausdauersportler und Vielbeschäftigte — zu Hause, ohne Geräte.",
        headline: "Du hast keine 90 Minuten.<br>Du brauchst sie nicht.",
        subhead:
          "30 Sekunden Power. 20 Sekunden Pause. 7 Übungen, 2 Runden. Zwölf Minuten, die in jeden Tag passen – und Kraft aufbauen, die dein Laufen und Radfahren trägt.",
        ctaLabel: "12 Minuten starten",
      },
    },
    {
      type: "haltung",
      props: {
        bgStyle: "night",
        headlineOne: "Der Plan war immer: nächste Woche.",
        headlineTwo: "Die nächste Woche kam nie.",
        body:
          "Du läufst. Du fährst Rad. Dein Kalender ist voll. Und Krafttraining? Steht seit Monaten auf der Liste – direkt unter „irgendwann“.\nDein Problem ist nicht dein Wille. Dein Problem ist, dass du Krafttraining für eine Stunde Studio hältst. Stunden hast du nicht. Zwölf Minuten schon.",
        transition: "Zwölf Minuten brauchen keinen Termin. Nur einen Entschluss.",
      },
    },
    {
      type: "yesIdent",
      props: {
        kicker: "Dein Zeitstrahl",
        headline: "Vom „irgendwann“ zum „heute“.",
        subhead: "Vier Bilder. Eines davon kennst du schon. Die anderen darfst du dir holen.",
        cards: [
          {
            id: "01",
            title: "Gestern: So lief dein Training bisher.",
            body:
              "Ausdauer, Ausdauer, Ausdauer. Krafttraining blieb der Vorsatz, den du jedes Jahr neu aufgeschrieben hast.",
          },
          {
            id: "02",
            title: "Heute: So kann es laufen, wenn du dich entscheidest.",
            body:
              "Timer an. 30 Sekunden alles geben, 20 Sekunden atmen. Wohnzimmer, Flur, Garten. Zwölf Minuten später hast du erledigt, was du seit Monaten aufschiebst.",
          },
          {
            id: "03",
            title: "Morgen: So wird dein Alltag aussehen.",
            body:
              "Du gehst die Treppe hoch, ohne darüber nachzudenken. Dein Körper fühlt sich an wie einer, dem du vertrauen kannst – auf der Runde und im Alltag.",
          },
          {
            id: "04",
            title: "Status: So sehen dich andere.",
            body:
              "Du bist der, der es durchzieht – ohne Drama, ohne Wochenende im Studio. Deine Familie merkt: Du bist da und trainierst trotzdem.",
          },
        ],
      },
    },
    {
      type: "protocolTimeline",
      props: {
        bgStyle: "light",
        kicker: "Der Ablauf",
        headline: "7 Übungen. 2 Runden. 12 Minuten.",
        subhead:
          "Jede Übung: 30 Sekunden Power, 20 Sekunden Pause. Erst alle sieben durch, dann noch einmal von vorn. Wenn du gesundheitlich unsicher bist, klär es vorher ärztlich ab.",
        weeks: [
          {
            week: "Übung 1",
            title: "Kniebeuge",
            focus: "Der Start in die Beine.",
            deliverables: [
              "Füße schulterbreit, Brust offen",
              "Tief runter, kraftvoll hoch",
              "Knie folgen den Zehen",
            ],
          },
          {
            week: "Übung 2",
            title: "Liegestütz",
            focus: "Oberkörper wach machen.",
            deliverables: [
              "Hände unter den Schultern",
              "Körper bleibt eine Linie",
              "Zu schwer? Hände auf Sofa oder Tisch",
            ],
          },
          {
            week: "Übung 3",
            title: "Ausfallschritt im Wechsel",
            focus: "Beine einzeln fordern.",
            deliverables: [
              "Großer Schritt, aufrechter Oberkörper",
              "Hinteres Knie sinkt Richtung Boden",
              "Seitenwechsel ohne Pause",
            ],
          },
          {
            week: "Übung 4",
            title: "Hüftheben",
            focus: "Kraft aus der Rückseite.",
            deliverables: [
              "Rückenlage, Füße aufgestellt",
              "Becken hoch, Gesäß fest",
              "Oben kurz halten",
            ],
          },
          {
            week: "Übung 5",
            title: "Step-up",
            focus: "Treppe statt Studio.",
            deliverables: [
              "Stufe oder stabiler Stuhl",
              "Ganzer Fuß auf der Stufe",
              "Nach 15 Sekunden das Bein wechseln",
            ],
          },
          {
            week: "Übung 6",
            title: "Unterarmstütz",
            focus: "Die Mitte unter Spannung.",
            deliverables: [
              "Ellbogen unter den Schultern",
              "Bauch und Gesäß fest",
              "Nicht ins Hohlkreuz fallen",
            ],
          },
          {
            week: "Übung 7",
            title: "Rückenstrecker",
            focus: "Der Gegenspieler zum Sitzen.",
            deliverables: [
              "Bauchlage, Arme nach vorn",
              "Brust und Beine leicht anheben",
              "Nacken lang, Blick zum Boden",
            ],
          },
        ],
      },
    },
    {
      type: "closing",
      props: {
        bgStyle: "night",
        headline: "Zwölf Minuten. Heute.",
        subhead: "Mehr brauchst du für den Anfang nicht.",
        ctaLabel: "Mehr erfahren",
        note: "Gefällt dir das? Dann erzähle ich dir gern mehr.",
      },
    },
  ],
} as const
