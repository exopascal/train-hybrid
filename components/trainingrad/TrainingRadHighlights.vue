<script setup lang="ts">
defineProps<{
  cards: Array<{ number: string; title: string; text: string }>
  stats: Array<{ value: number; suffix?: string; label: string }>
}>()
</script>

<template>
  <section id="trainingrad-konzept" class="trainingrad-section">
    <div class="trainingrad-section__header">
      <p class="trainingrad-section__label" data-reveal>Das Konzept</p>
      <h2 class="trainingrad-section__title" data-reveal>
        Krafttraining fuer Rennradfahrer.
        <br>
        Sauber integriert.
      </h2>
      <p class="trainingrad-section__copy" data-reveal>
        Diese Unterseite kombiniert Suchintentionen wie Krafttraining Radfahrer, Athletiktraining Radsport,
        Stabi Uebungen fuer Radfahrer, Schmerzen unterer Ruecken Radfahren und Core Training fuer Rennradfahrer
        in eine klare Leistungslogik: mehr Watt durch Krafttraining, mehr Kraft pro Pedaltritt, mehr in den Beinen
        statt nur in der Lunge, bessere Haltung unter Ermuedung und planbare Progression ohne zusaetzliche Trainingstage.
      </p>
    </div>

    <div class="trainingrad-cards">
      <article v-for="card in cards" :key="card.number" class="trainingrad-card" data-reveal>
        <span class="trainingrad-card__number">{{ card.number }}</span>
        <h3 class="trainingrad-card__title">{{ card.title }}</h3>
        <p class="trainingrad-card__text">{{ card.text }}</p>
      </article>
    </div>

    <div class="trainingrad-stats">
      <article v-for="stat in stats" :key="stat.label" class="trainingrad-stat" data-stat :data-target="stat.value" :data-suffix="stat.suffix || ''">
        <span class="trainingrad-stat__value">0</span>
        <span class="trainingrad-stat__label">{{ stat.label }}</span>
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

.trainingrad-section__header {
  max-width: 50rem;
}

.trainingrad-section__label,
.trainingrad-section__copy,
.trainingrad-card__text,
.trainingrad-stat__label {
  color: color-mix(in srgb, var(--color-text-light) 72%, var(--color-brand-light));
}

.trainingrad-section__label {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xs);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
}

.trainingrad-section__title {
  margin: 0 0 var(--spacing-lg);
  font-size: clamp(2.5rem, 6vw, 4.75rem);
  line-height: 0.95;
  color: var(--color-text-light);
}

.trainingrad-section__copy {
  margin: 0;
  font-size: var(--font-size-lg);
  line-height: 1.8;
}

.trainingrad-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-3xl);
}

.trainingrad-card,
.trainingrad-stat {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 22%, transparent);
  border-radius: var(--radius-2xl);
  background: color-mix(in srgb, var(--color-background) 8%, transparent);
  backdrop-filter: blur(18px);
}

.trainingrad-card {
  padding: var(--spacing-2xl);
}

.trainingrad-card::before,
.trainingrad-stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-brand-accent), transparent);
}

.trainingrad-card__number {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: var(--font-weight-bold);
  color: color-mix(in srgb, var(--color-brand-accent) 18%, transparent);
}

.trainingrad-card__title {
  max-width: 15rem;
  margin: 0 0 var(--spacing-md);
  font-size: clamp(1.45rem, 2.8vw, 1.85rem);
  color: var(--color-text-light);
}

.trainingrad-card__text {
  margin: 0;
  line-height: 1.8;
}

.trainingrad-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: var(--spacing-3xl);
  padding: 1px;
  border-radius: var(--radius-2xl);
  background: color-mix(in srgb, var(--color-brand-accent) 26%, transparent);
}

.trainingrad-stat {
  padding: var(--spacing-2xl);
  text-align: center;
}

.trainingrad-stat__value {
  display: block;
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  color: var(--color-brand-accent);
  text-shadow: 0 0 28px color-mix(in srgb, var(--color-brand-accent) 22%, transparent);
}

.trainingrad-stat__label {
  display: block;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

@media (max-width: 900px) {
  .trainingrad-cards,
  .trainingrad-stats {
    grid-template-columns: 1fr;
  }

  .trainingrad-section__copy {
    font-size: var(--font-size-base);
  }
}
</style>
