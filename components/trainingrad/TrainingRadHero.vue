<script setup lang="ts">
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'

const focusAreas = [
  'Krafttraining fuer Radfahrer mit Fokus auf mehr Watt durch mehr Kraft in den Beinen',
  'Athletiktraining fuer Rennradfahrer zur Verletzungspraevention und besseren Sitzposition',
  'Core Training, Beinachsenstabilitaet und Entlastung fuer den unteren Ruecken auf langen Ausfahrten',
]
</script>

<template>
  <section class="trainingrad-hero">
    <div class="trainingrad-hero__inner">
      <p class="trainingrad-hero__eyebrow" data-reveal>Train Hybrid | Performance Page</p>
      <h1 class="trainingrad-hero__title" data-reveal>
        Training
        <span>Rad</span>
      </h1>
      <p class="trainingrad-hero__lead" data-reveal>
        Krafttraining fuer Radfahrer, Rennrad Athletik und intelligente Integration in deine Woche.
        Fuer mehr Watt durch Krafttraining, mehr Druck aus den Beinen statt nur mehr aus der Lunge,
        mehr Stabilitaet im Oberkoerper und weniger Leistungsabfall auf langen Einheiten.
      </p>

      <ul class="trainingrad-hero__list" data-reveal>
        <li v-for="area in focusAreas" :key="area">{{ area }}</li>
      </ul>

      <div class="trainingrad-hero__actions" data-reveal>
        <AnalysisCtaButton label="Bike-Analyse starten" variant="hero" />
        <a href="#trainingrad-konzept" class="trainingrad-hero__link">Zum Konzept</a>
      </div>

      <div class="trainingrad-hero__scroll" data-reveal>
        <span>Scroll</span>
        <div class="trainingrad-hero__line" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.trainingrad-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--header-height) + var(--spacing-4xl)) var(--container-padding) var(--spacing-4xl);
}

.trainingrad-hero__inner {
  width: min(100%, 72rem);
  display: grid;
  gap: var(--spacing-xl);
  text-align: center;
  justify-items: center;
}

.trainingrad-hero__eyebrow,
.trainingrad-hero__lead,
.trainingrad-hero__list li,
.trainingrad-hero__link,
.trainingrad-hero__scroll span {
  color: color-mix(in srgb, var(--color-text-light) 74%, var(--color-brand-light));
}

.trainingrad-hero__eyebrow {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
}

.trainingrad-hero__title {
  margin: 0;
  font-size: clamp(3.6rem, 11vw, 8rem);
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: var(--color-text-light);
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-brand-accent) 18%, transparent);
}

.trainingrad-hero__title span {
  display: block;
  color: var(--color-brand-accent);
}

.trainingrad-hero__lead {
  max-width: 48rem;
  margin: 0;
  font-size: clamp(1rem, 2.4vw, 1.25rem);
  line-height: 1.8;
}

.trainingrad-hero__list {
  width: min(100%, 58rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

.trainingrad-hero__list li {
  padding: var(--spacing-lg);
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 28%, transparent);
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--color-background) 8%, transparent);
  backdrop-filter: blur(16px);
  line-height: 1.7;
}

.trainingrad-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: center;
}

.trainingrad-hero__link {
  display: inline-flex;
  align-items: center;
  min-height: 3rem;
  padding: 0 var(--spacing-lg);
  border: 1px solid color-mix(in srgb, var(--color-text-light) 20%, transparent);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: var(--font-size-xs);
}

.trainingrad-hero__scroll {
  position: absolute;
  bottom: var(--spacing-xl);
  display: grid;
  justify-items: center;
  gap: var(--spacing-sm);
}

.trainingrad-hero__scroll span {
  font-size: var(--font-size-xs);
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.trainingrad-hero__line {
  width: 1px;
  height: 2.5rem;
  background: linear-gradient(180deg, var(--color-brand-accent), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% {
    opacity: 0.35;
    transform: scaleY(1);
  }
  50% {
    opacity: 1;
    transform: scaleY(1.16);
  }
}

@media (max-width: 900px) {
  .trainingrad-hero__list {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .trainingrad-hero__line {
    animation: none;
  }
}
</style>
