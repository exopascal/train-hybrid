<script setup lang="ts">
import { ref } from 'vue'

const faqs = [
  {
    question: 'Brauche ich Vorerfahrung, um mit Train Hybrid zu starten?',
    answer: 'Nein. Du bekommst alles, was du brauchst – fertige Trainingspläne, klare Übungsanleitungen, jede Einheit vorstrukturiert. Du musst nicht wissen, was zu tun ist. Du musst es nur tun.',
  },
  {
    question: 'Wie viel Zeit muss ich wirklich einplanen?',
    answer: '2 Einheiten die Woche. 5 Wochen lang. Das reicht für deine ersten Erfolge – mehr braucht\'s nicht, um wieder spürbar stärker zu werden.',
  },
  {
    question: 'Wie bleibe ich motiviert?',
    answer: 'Die Einheiten sind kurz, abwechslungsreich und machen Bock – kein stumpfes Abarbeiten. Du merkst den Fortschritt schon nach den ersten Sessions, und genau das hält dich dran.',
  },
  {
    question: 'Brauche ich das EXOPEK Pro Gerät zwingend?',
    answer: 'Um Krafttraining zeiteffizient in deinen Alltag zu integrieren, ist Arbeit gegen Widerstand entscheidend. Mit reinem Körpergewicht geht das – ist aber komplizierter und deutlich weniger effizient. Das EXOPEK Pro macht genau das einfach: Widerstand, überall verfügbar, ohne Umwege.',
  },
  {
    question: 'Warum ist Krafttraining für Ausdauersportler wichtig?',
    answer: 'Krafttraining macht dich insgesamt fitter und belastbarer – stärkere Muskeln, stabilere Gelenke, ein Bewegungsapparat, der hohe Trainingsumfänge besser wegsteckt. Für Ausdauersportler heißt das: bessere Kraftübertragung, weniger Verletzungen, mehr Leistung im Hauptsport. Und der Effekt bleibt nicht auf den Sport beschränkt – er trägt dich auch durch den Alltag.',
  },
]

const openIndex = ref<number | null>(null)

const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section class="home-faq">
    <div class="home-faq__inner">
      <h2 class="home-faq__title">FAQs</h2>
      <dl class="home-faq__list">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="home-faq__item"
          :class="{ 'is-open': openIndex === i }"
        >
          <dt>
            <button
              class="home-faq__trigger"
              type="button"
              :aria-expanded="openIndex === i"
              @click="toggle(i)"
            >
              <span class="home-faq__question">{{ faq.question }}</span>
              <span class="home-faq__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
          </dt>
          <dd class="home-faq__answer" :hidden="openIndex !== i">
            <div class="home-faq__answer-inner">
              {{ faq.answer }}
            </div>
          </dd>
        </div>
      </dl>
      <NuxtLink to="/faq" class="home-faq__more btn-main">Weitere Informationen</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.home-faq {
  background: #f5f5f0;
  padding: 3rem 1.5rem 4rem;
}

.home-faq__inner {
  max-width: 780px;
  margin: 0 auto;
}

.home-faq__title {
  margin: 0 0 2rem;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  color: #0f172a;
}

.home-faq__list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.home-faq__item {
  border-bottom: 1px dashed #b0b0b0;
}

.home-faq__item:first-of-type {
  border-top: 1px dashed #b0b0b0;
}

.home-faq__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
  padding: 1.25rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.home-faq__question {
  font-family: var(--font-heading);
  font-size: clamp(0.95rem, 1.4vw, 1.05rem);
  font-weight: 700;
  line-height: 1.35;
  color: #0f172a;
}

.home-faq__icon {
  flex-shrink: 0;
  color: #0f172a;
  transition: transform 0.25s ease;
}

.home-faq__item.is-open .home-faq__icon {
  transform: rotate(180deg);
}

.home-faq__answer {
  margin: 0;
}

.home-faq__answer[hidden] {
  display: none;
}

.home-faq__answer-inner {
  padding: 0 0 1.25rem;
  font-size: 1rem;
  line-height: 1.65;
  color: #475569;
}

.home-faq__more {
  display: flex;
  width: fit-content;
  margin: 2rem auto 0;
}
</style>
