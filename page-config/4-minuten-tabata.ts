export default {
  seo: {
    title: "Der 4-Minuten-Tabata – Puls hoch, Kopf frei",
    description:
      "20 Sekunden Vollgas, 10 Sekunden Pause, 8 Runden. Ein Tabata-Training für Ausdauersportler und Vielbeschäftigte – ohne Geräte, in vier Minuten.",
    canonical: "/4-minuten-tabata",
    ogTitle: "Der 4-Minuten-Tabata – Puls hoch, Kopf frei",
    ogDescription:
      "20 Sekunden Vollgas, 10 Sekunden Pause, 8 Runden. Ein Tabata-Training für Ausdauersportler und Vielbeschäftigte – ohne Geräte, in vier Minuten.",
  },
  sections: [
    {
      type: "hero",
      props: {
        eyebrow:
          "4-Minuten-Tabata für Ausdauersportler und Vielbeschäftigte — 20 Sekunden Vollgas, 10 Sekunden Pause.",
        headline: "Keine Zeit?<br>Du hast vier Minuten.",
        subhead:
          "8 Runden. Puls hoch, Kopf frei. Vor dem Frühstück, zwischen zwei Terminen oder als Einstieg in deine Einheit. Ohne Geräte, ohne Anfahrt, ohne Ausrede.",
        ctaLabel: "4 Minuten starten",
      },
    },
    {
      type: "haltung",
      props: {
        bgStyle: "night",
        headlineOne: "Der Tag ist voll. Der Kopf auch.",
        headlineTwo: "Training passiert, wenn alles andere erledigt ist. Also nie.",
        body:
          "Lange Einheiten brauchen lange Zeitfenster. Die kommen nicht.\nVier Minuten schon: während das Wasser kocht, vor der Dusche, im Hotelzimmer.",
        transition: "Vier Minuten sind kein Kompromiss. Sie sind der Anfang.",
      },
    },
    {
      type: "yesIdent",
      props: {
        kicker: "Dein Zeitstrahl",
        headline: "Von „alles oder nichts“ zu „jetzt“.",
        subhead: "Vier Bilder. Such dir das aus, das du sein willst.",
        cards: [
          {
            id: "01",
            title: "Gestern: So lief dein Training bisher.",
            body:
              "Entweder 60 Minuten oder gar nichts. Meistens: gar nichts.",
          },
          {
            id: "02",
            title: "Heute: So kann es laufen, wenn du dich entscheidest.",
            body:
              "Timer an. 20 Sekunden alles geben, 10 Sekunden atmen. Acht Mal. Du bist fertig, bevor die Ausrede anfängt.",
          },
          {
            id: "03",
            title: "Morgen: So wird dein Alltag aussehen.",
            body:
              "Vier Minuten werden so selbstverständlich wie Zähneputzen. Du startest in den Tag, als hättest du schon etwas für dich getan.",
          },
          {
            id: "04",
            title: "Status: So sehen dich andere.",
            body:
              "Du bist der, der auch im vollen Kalender Zeit für sich findet. Das merken die anderen – an deiner Ruhe, nicht an deinem Stress.",
          },
        ],
      },
    },
    {
      type: "protocolTimeline",
      props: {
        bgStyle: "light",
        kicker: "Der Ablauf",
        headline: "8 Übungen. 20 Sekunden Vollgas. 10 Sekunden Pause.",
        subhead:
          "Acht Runden à 30 Sekunden ergeben vier Minuten. Wenn du gesundheitlich unsicher bist, klär es vorher ärztlich ab.",
        weeks: [
          {
            week: "Runde 1",
            title: "Hohe Knie",
            focus: "Den Puls hochholen.",
            deliverables: [
              "Knie bis Hüfthöhe",
              "Aufrecht bleiben",
              "Leise: marschieren statt laufen",
            ],
          },
          {
            week: "Runde 2",
            title: "Tempo-Kniebeugen",
            focus: "Beine unter Last.",
            deliverables: [
              "Schnell runter, schnell hoch",
              "Brust offen, Fersen am Boden",
              "Leise: ohne Sprung",
            ],
          },
          {
            week: "Runde 3",
            title: "Mountain Climber",
            focus: "Rumpf und Herz zugleich.",
            deliverables: [
              "Hände unter den Schultern",
              "Knie abwechselnd zur Brust",
              "Leise: langsamer im Wechsel",
            ],
          },
          {
            week: "Runde 4",
            title: "Skater",
            focus: "Seitlich antreten.",
            deliverables: [
              "Weit zur Seite springen",
              "Stand kurz stabilisieren",
              "Leise: seitlicher Schritt ohne Sprung",
            ],
          },
          {
            week: "Runde 5",
            title: "Hampelmann",
            focus: "Ganzkörper in Bewegung.",
            deliverables: [
              "Arme und Beine im Takt",
              "Weich landen",
              "Leise: ein Bein nach dem anderen",
            ],
          },
          {
            week: "Runde 6",
            title: "Schattenboxen",
            focus: "Oberkörper dazu.",
            deliverables: [
              "Fester Stand, Knie leicht gebeugt",
              "Schnelle Schläge im Wechsel",
              "Aus der Hüfte drehen",
            ],
          },
          {
            week: "Runde 7",
            title: "Fersen zum Gesäß",
            focus: "Die Rückseite aktivieren.",
            deliverables: [
              "Fersen Richtung Gesäß",
              "Aufrechter Oberkörper",
              "Zügig im Wechsel",
            ],
          },
          {
            week: "Runde 8",
            title: "Burpee ohne Sprung",
            focus: "Der Abschluss.",
            deliverables: [
              "Hände auf den Boden, Füße zurück",
              "Zurück in den Stand, aufrichten",
              "Alles geben – es ist die letzte Runde",
            ],
          },
        ],
      },
    },
    {
      type: "closing",
      props: {
        bgStyle: "night",
        headline: "Vier Minuten. Jetzt.",
        subhead: "Der Rest des Tages darf warten.",
        ctaLabel: "Mehr erfahren",
        note: "Gefällt dir das? Dann erzähle ich dir gern mehr.",
      },
    },
  ],
} as const
