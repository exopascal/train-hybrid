<script setup lang="ts">
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'

defineProps<{
  modules: Array<{ title: string; text: string }>
  events: Array<{ date: string; name: string; meta: string }>
}>()
</script>

<template>
  <section class="trainingrad-section trainingrad-section--program">
    <div class="trainingrad-split">
      <div class="trainingrad-split__content">
        <p class="trainingrad-section__label" data-reveal>Trainingslogik</p>
        <h2 class="trainingrad-section__title" data-reveal>Mehr Watt kommt nicht nur aus Intervallen.</h2>
        <p class="trainingrad-section__copy" data-reveal>
          Gutes Krafttraining fuer Radfahrer verbessert die Kraftuebertragung, die Rumpfspannung,
          die Stabilitaet in der aerodynamischen Position und die Widerstandsfaehigkeit gegen muskulare Ermuedung.
          Mehr Watt kommt nicht nur aus der Lunge. Relevant ist auch, wie viel Kraft deine Beine sauber aufs Pedal bringen.
          Deshalb sind Unterkoerperkraft, ein belastbarer Core, Athletiktraining fuer den Schulterguertel
          und eine Struktur entscheidend, die den unteren Ruecken bei langer Vorneige nicht permanent zum Kompensationspunkt macht.
        </p>

        <div class="trainingrad-module-grid">
          <article v-for="module in modules" :key="module.title" class="trainingrad-module" data-reveal>
            <h3>{{ module.title }}</h3>
            <p>{{ module.text }}</p>
          </article>
        </div>
      </div>

      <aside class="trainingrad-panel" data-reveal>
        <p class="trainingrad-panel__eyebrow">SEO Fokus</p>
        <h3 class="trainingrad-panel__title">Krafttraining fuer Radfahrer mit klarer Suchintention.</h3>
        <p class="trainingrad-panel__text">
          Die Inhalte decken Keywords wie Krafttraining Radfahren, Athletiktraining Radfahrer,
          Stabi fuer Rennradfahrer, Core Training Radsport, unterer Ruecken Radfahren, Verletzungspraevention Radfahrer
          und mehr Watt durch Krafttraining ab, ohne in Keyword-Listen abzurutschen. Die Kernbotschaft bleibt klar:
          mehr in den Beinen, nicht nur in der Lunge.
        </p>
        <AnalysisCtaButton label="Analyse fuer dein Radtraining" variant="hero" />
      </aside>
    </div>

    <div class="trainingrad-events">
      <div>
        <p class="trainingrad-section__label" data-reveal>Bausteine</p>
        <h2 class="trainingrad-section__title trainingrad-section__title--small" data-reveal>So sieht die Integration aus.</h2>
      </div>

      <article v-for="event in events" :key="event.name" class="trainingrad-event" data-reveal>
        <p class="trainingrad-event__date">{{ event.date }}</p>
        <h3 class="trainingrad-event__name">{{ event.name }}</h3>
        <p class="trainingrad-event__meta">{{ event.meta }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.trainingrad-section {
  position: relative;
  z-index: 2;
  width: min(100%, var(--container-max-width));
  margin: 0 auto;
  padding: var(--spacing-4xl) var(--container-padding);
}

.trainingrad-section--program {
  padding-bottom: calc(var(--spacing-4xl) + var(--spacing-2xl));
}

.trainingrad-section__label,
.trainingrad-section__copy,
.trainingrad-module p,
.trainingrad-panel__text,
.trainingrad-event__meta {
  color: color-mix(in srgb, var(--color-text-light) 72%, var(--color-brand-light));
}

.trainingrad-section__label,
.trainingrad-panel__eyebrow,
.trainingrad-event__date {
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
}

.trainingrad-section__title,
.trainingrad-panel__title,
.trainingrad-module h3,
.trainingrad-event__name {
  color: var(--color-text-light);
}

.trainingrad-section__title {
  margin: 0 0 var(--spacing-lg);
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  line-height: 0.95;
}

.trainingrad-section__title--small {
  max-width: 28rem;
}

.trainingrad-section__copy,
.trainingrad-panel__text,
.trainingrad-module p,
.trainingrad-event__meta {
  margin: 0;
  line-height: 1.8;
}

.trainingrad-split {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.8fr);
  gap: var(--spacing-2xl);
  align-items: start;
}

.trainingrad-module-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-2xl);
}

.trainingrad-module,
.trainingrad-panel {
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 22%, transparent);
  border-radius: var(--radius-2xl);
  background: color-mix(in srgb, var(--color-background) 8%, transparent);
  backdrop-filter: blur(18px);
}

.trainingrad-module {
  padding: var(--spacing-xl);
}

.trainingrad-module h3,
.trainingrad-panel__title,
.trainingrad-event__name {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-2xl);
}

.trainingrad-panel {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-xl));
  padding: var(--spacing-2xl);
}

.trainingrad-panel__eyebrow {
  margin-bottom: var(--spacing-md);
}

.trainingrad-events {
  display: grid;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-4xl);
}

.trainingrad-event {
  padding-left: var(--spacing-xl);
  border-left: 2px solid var(--color-brand-accent);
}

.trainingrad-event__date {
  margin-bottom: var(--spacing-xs);
}

.trainingrad-event__name {
  font-size: clamp(1.7rem, 3vw, 2.2rem);
}

@media (max-width: 960px) {
  .trainingrad-split,
  .trainingrad-module-grid {
    grid-template-columns: 1fr;
  }

  .trainingrad-panel {
    position: static;
  }
}
</style>
