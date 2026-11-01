export default {
  seo: {
    title: "Der Atem-Start – Atemübungen für einen entspannten Start in den Tag",
    description:
      "Fünf Minuten Atemübungen am Morgen: ankommen, ruhig atmen, den Tag führen statt gejagt werden. Ohne Equipment, ohne Vorkenntnisse.",
    canonical: "/atem-start",
    ogTitle: "Der Atem-Start – Atemübungen für einen entspannten Start in den Tag",
    ogDescription:
      "Fünf Minuten Atemübungen am Morgen: ankommen, ruhig atmen, den Tag führen statt gejagt werden. Ohne Equipment, ohne Vorkenntnisse.",
  },
  sections: [
    {
      type: "hero",
      props: {
        eyebrow:
          "Atemübungen für einen entspannten Start in den Tag — 5 Minuten, im Bett oder am Fenster.",
        headline: "Du bist wach.<br>Und schon im Rückstand.",
        subhead:
          "Bevor Mails, Nachrichten und To-dos hereinkommen, gehört der erste Moment dir. Eine einfache Atemfolge. Kein Equipment, keine Vorkenntnisse.",
        ctaLabel: "Atem-Start öffnen",
        rightImgSrc: "/krafttraining-outdoor-laufen-gehen-gravel.jpg",
        rightImgAlt: "Ruhiger Start in den Tag im Freien",
      },
    },
    {
      type: "haltung",
      props: {
        bgStyle: "night",
        headlineOne: "Handy an. Kopf an. Puls oben.",
        headlineTwo: "Und du hattest noch nicht mal Kaffee.",
        body:
          "Die meisten starten im Reaktionsmodus: Nachrichten, Termine, Erwartungen anderer. Dein Körper schaltet auf Alarm, bevor der Tag begonnen hat.\nDein Atem ist der einzige Schalter, den du sofort bedienen kannst. Er kostet nichts und braucht keine App.",
        transition: "Fünf Minuten Atem. Dann gehört der Tag dir, nicht dem Handy.",
      },
    },
    {
      type: "yesIdent",
      props: {
        kicker: "Dein Zeitstrahl",
        headline: "Vom Hetzen zum Ankommen.",
        subhead: "Vier Bilder. Das erste kennst du. Das zweite beginnt morgen früh.",
        cards: [
          {
            id: "01",
            title: "Gestern: So lief dein Morgen bisher.",
            body:
              "Wecker, Handy, Stress. Du bist aufgestanden – aber noch nicht angekommen.",
          },
          {
            id: "02",
            title: "Heute: So kann es laufen, wenn du dich entscheidest.",
            body:
              "Du bleibst fünf Minuten liegen oder stehst am Fenster. Eine Hand am Bauch. Vier Sekunden ein, acht Sekunden aus.",
          },
          {
            id: "03",
            title: "Morgen: So wird dein Alltag aussehen.",
            body:
              "Du startest ruhig statt gehetzt. Dein Kopf ist klar, bevor die erste Nachricht reinkommt.",
          },
          {
            id: "04",
            title: "Status: So sehen dich andere.",
            body:
              "Du bist der Ruhepol am Frühstückstisch. Andere merken: Du führst den Tag – nicht umgekehrt.",
          },
        ],
      },
    },
    {
      type: "protocolTimeline",
      props: {
        bgStyle: "light",
        kicker: "Der Ablauf",
        headline: "4 Schritte. Etwa 5 Minuten.",
        subhead:
          "Stufe 2 ist optional und kommt erst, wenn Stufe 1 sich leicht anfühlt. Bei Unsicherheit oder Vorerkrankungen klär es vorher ärztlich ab.",
        weeks: [
          {
            week: "Schritt 1",
            title: "Ankommen",
            focus: "Aufwachen, bevor du losrennst.",
            deliverables: [
              "Auf den Rücken legen oder bequem sitzen",
              "Eine Hand auf den Bauch, eine auf die Brust",
              "Fünf ruhige Atemzüge, nur beobachten",
            ],
          },
          {
            week: "Schritt 2",
            title: "Stufe 1: 4 – 4 – 8 – 4",
            focus: "4 Sekunden ein, 4 halten, 8 aus, 4 Pause.",
            deliverables: [
              "Durch die Nase einatmen",
              "Lang und leise ausatmen",
              "6 Runden, im Kopf mitzählen",
            ],
          },
          {
            week: "Schritt 3",
            title: "Stufe 2: 4 – 8 – 12 – 4",
            focus: "4 Sekunden ein, 8 halten, 12 aus, 4 Pause.",
            deliverables: [
              "Erst nach einigen Tagen mit Stufe 1",
              "Bei Schwindel sofort normal weiteratmen",
              "3 bis 4 Runden reichen",
            ],
          },
          {
            week: "Schritt 4",
            title: "Aufrichten",
            focus: "Den Atem mit in den Tag nehmen.",
            deliverables: [
              "Zweimal tief durchatmen, Arme strecken",
              "Eine Sache festlegen, die heute zählt",
              "Dann erst das Handy",
            ],
          },
        ],
      },
    },
    {
      type: "closing",
      props: {
        bgStyle: "night",
        headline: "Fünf Minuten. Morgen früh.",
        subhead: "Der erste Atemzug gehört dir.",
        ctaLabel: "Mehr erfahren",
        note: "Gefällt dir das? Dann erzähle ich dir gern mehr.",
      },
    },
  ],
} as const
