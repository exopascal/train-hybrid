<script setup lang="ts">
const featured = {
  question:
    "Hindert Ausdauertraining nicht das Muskelkrafttraining, da zwei unterschiedliche Muskelfasern angesprochen werden?",
  shortAnswer:
    "Nein – es blockiert Krafttraining nicht. Entscheidend sind Dosierung und Struktur, nicht die Fasertyp-Story.",
  points: [
    "Ausdauertraining betont Typ-II-Fasern, Krafttraining rekrutiert stärker Typ-I-Fasern – beide werden in der Praxis gemeinsam genutzt.",
    "Der Interference Effect entsteht vor allem bei viel Umfang + hoher Intensität + zu wenig Erholung – nicht automatisch durch Ausdauer vs. Kraft.",
    "Für Ausdauersportler geht es selten um maximalen Muskelaufbau, sondern um Kraftübertragung, Stabilität, Ökonomie und Robustheit.",
  ],
  takeaway:
    "Die Frage ist nicht ob Krafttraining passt, sondern wie du es so integrierst, dass es deine Ausdauerleistung unterstützt.",
}

const faqGroups = [
  {
    title: "Performance & Nutzen",
    intro:
      "Viele Ausdauersportler denken primär in VO2max, Laktatschwelle und Ökonomie. Daraus entstehen Fragen wie:",
    items: [
      "Verbessert Krafttraining wirklich meine Ausdauerleistung?",
      "Verbessert es meine Lauf- oder Radökonomie?",
      "Bringt mir das messbare Vorteile im Wettkampf?",
      "Kann ich dadurch schneller werden oder länger durchhalten?",
    ],
  },
  {
    title: "Trainingsstruktur",
    intro:
      "Ein häufiges Denkmuster lautet: Krafttraining gehört ins Gym. Ausdauertraining gehört nach draußen.",
    items: [
      "Sollte ich Kraft und Ausdauer nicht lieber trennen?",
      "Ist Concurrent Training nicht problematisch?",
      "Stört Krafttraining meine Regeneration?",
      "Kann Krafttraining meine Ausdauerleistung kurzfristig verschlechtern?",
    ],
  },
  {
    title: "Trainingsökonomie",
    intro: "Zeit ist für viele Athleten der limitierende Faktor.",
    items: [
      "Warum nicht einfach zweimal pro Woche ins Gym gehen?",
      "Ist Hybridtraining wirklich zeiteffizienter?",
      "Bringen kurze Kraftreize während des Trainings überhaupt etwas?",
      "Ist es sinnvoll, während eines Laufs Kraftübungen zu machen?",
    ],
  },
  {
    title: "Biomechanik",
    intro: "Leistungsorientierte Ausdauersportler interessieren sich stark für Bewegungsökonomie.",
    items: [
      "Verbessert Krafttraining meine Laufökonomie?",
      "Verbessert es meine Kraftübertragung (Force Transmission)?",
      "Hilft es gegen muskuläre Dysbalancen?",
      "Kann es Verletzungen reduzieren?",
    ],
  },
  {
    title: "Elastischer Widerstand",
    intro: "Beim Einsatz von Widerstandsbändern entstehen oft zusätzliche Zweifel.",
    items: [
      "Warum elastischer Widerstand statt Gewichten?",
      "Ist der Widerstand überhaupt hoch genug?",
      "Ist das Training progressiv genug?",
      "Trainiere ich damit wirklich Kraft oder eher Stabilität?",
    ],
  },
  {
    title: "Trainingspraxis",
    intro: "Hier wird es konkret.",
    items: [
      "Soll ich wirklich während meines Laufs Kraftübungen machen?",
      "Muss ich dafür stehen bleiben?",
      "Wie integriere ich das in eine Radeinheit?",
      "Wie oft sollte ich das machen?",
    ],
  },
  {
    title: "Wissenschaftliche Fragen",
    intro: "Ambitionierte Ausdauersportler denken oft evidenzbasiert.",
    items: [
      "Was sagt die Studienlage zu Krafttraining für Ausdauersportler?",
      "Welche Art von Krafttraining bringt am meisten?",
      "Maximalkraft oder plyometrisches Training?",
      "Wie beeinflusst Krafttraining die Laufökonomie?",
    ],
  },
]

const keyCards = [
  {
    title: "Warum sollte ich Krafttraining in mein Ausdauertraining integrieren – statt es separat zu machen?",
    body:
      "Das ist der größte mentale Widerstand vieler Ausdauersportler. Wenn diese Frage sauber beantwortet ist, lösen sich viele weitere Zweifel automatisch.",
  },
  {
    title: "Warum elastischer Widerstand und nicht klassisches Krafttraining?",
    body:
      "Hier zählen Variable Resistance, Bewegungsspezifität und die Integration in natürliche Bewegungsabläufe – ohne extra Wege, ohne Setup, ohne Gym-Zwang.",
  },
  {
    title: "Ist Hybridtraining wirklich effektiv oder nur ein Trend?",
    body:
      "Diese Frage entscheidet, ob Athleten das Konzept ernst nehmen oder als Gimmick abtun. Die Antwort muss messbar, plausibel und praktisch sein.",
  },
]

</script>

<template>
  <section id="faq" class="faq-section">
    <div class="faq-container">
      <div class="faq-hero">
        <h2 class="faq-title">Fragen, die sich jeder Ausdauersportler stellt.</h2>
        <p class="faq-sub">
          Ausdauersportler bewerten Trainingsmethoden meist rational: Performance, Ökonomie, Evidenz.
          Train Hybrid beantwortet genau diese Fragen – ohne Umwege.
        </p>
      </div>

      <div class="faq-featured">
        <h3 class="faq-featured__question">{{ featured.question }}</h3>
        <p class="faq-featured__answer">{{ featured.shortAnswer }}</p>
        <ul class="faq-featured__list">
          <li v-for="item in featured.points" :key="item">{{ item }}</li>
        </ul>
        <p class="faq-featured__takeaway">{{ featured.takeaway }}</p>
      </div>

      <div class="faq-keys">
        <h3 class="faq-keys__title">Die drei entscheidenden Fragen für Train Hybrid</h3>
        <div class="faq-keys__grid">
          <article v-for="item in keyCards" :key="item.title" class="faq-key">
            <h4>{{ item.title }}</h4>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>

      <div class="faq-accordion">
        <details v-for="group in faqGroups" :key="group.title" class="faq-item">
          <summary class="faq-summary">{{ group.title }}</summary>
          <div class="faq-panel">
            <p class="faq-panel__intro">{{ group.intro }}</p>
            <div class="faq-subaccordion">
              <details v-for="item in group.items" :key="item" class="faq-subitem">
                <summary class="faq-subsummary">{{ item }}</summary>
                <div class="faq-subpanel">
                  <p>
                    Diese Frage wird im Train Hybrid Protokoll systematisch eingeordnet und in ein
                    messbares Vorgehen ubersetzt.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </details>
      </div>

    </div>
  </section>
</template>

<style scoped>
.faq-section {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}

.faq-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-4xl) var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
}

.faq-hero {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 760px;
}

.faq-title {
  font-family: var(--font-family-heading);
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.faq-sub {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.faq-featured {
  background: var(--color-background);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.faq-featured__question {
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: var(--font-weight-semibold);
}

.faq-featured__answer {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.faq-featured__list {
  margin: 0;
  padding: 0 0 0 var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.faq-featured__takeaway {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.faq-item {
  background: var(--color-background);
  border-radius: var(--radius-xl);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.faq-summary {
  list-style: none;
  cursor: pointer;
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.faq-summary::marker {
  display: none;
}

.faq-summary::after {
  content: "+";
  font-size: var(--font-size-xl);
  color: var(--color-brand-accent);
  transition: transform var(--transition-fast);
}

.faq-item[open] .faq-summary::after {
  transform: rotate(45deg);
}

.faq-panel {
  padding: 0 var(--spacing-xl) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.faq-panel__intro {
  margin-top: var(--spacing-sm);
}

.faq-panel__list {
  margin: 0;
  padding-left: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.faq-subaccordion {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.faq-subitem {
  border-radius: var(--radius-lg);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: var(--color-background-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
}

.faq-subsummary {
  list-style: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-subsummary::marker {
  display: none;
}

.faq-subsummary::after {
  content: "+";
  color: var(--color-brand-accent);
  transition: transform var(--transition-fast);
}

.faq-subitem[open] .faq-subsummary::after {
  transform: rotate(45deg);
}

.faq-subpanel {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.faq-keys {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.faq-keys__title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: var(--font-weight-semibold);
}

.faq-keys__grid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.faq-key {
  background: var(--color-background);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.faq-key h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.faq-key p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

</style>
