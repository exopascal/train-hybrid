<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    headline?: string
    imgSrc?: string
    imgAlt?: string
    paragraphs?: string[]
  }>(),
  {
    kicker: 'Über mich',
    headline: 'Über mich.',
    imgSrc: '/coach-pascal-krafttraining-experte.jpg',
    imgAlt: 'Pascal Hof – Train Hybrid Coach',
    paragraphs: () => [
      'Seit ich 13 bin, verdiene ich mit Training und Bewegung mein Geld — als Tanzlehrer, als Dance-Fitness-Ausbilder, heute im Fitnessbereich. 20 Jahre Erfahrung haben mir vor allem eines gezeigt: Training funktioniert nur, wenn es methodisch und durchdacht aufgebaut ist — und vor allem, wenn es motiviert, dabei zu bleiben.',
      'Mit meiner eigenen sportwissenschaftlichen Studie zum funktionellen Training mit Widerstandsbändern untermauere ich diese praktische Erfahrung. Was klar ist: Funktionelles Training mit Widerstandsbändern fordert dich bis in deine Tiefenmuskulatur und trainiert genau die Bewegungen, die du im Alltag und im Sport wirklich brauchst.',
      'Mit Train Hybrid bringe ich meine Erfahrung und mein Wissen in ein Trainingsmodell, das Ausdauersportlern zeigt, wie Krafttraining nahtlos integriert werden kann — ohne die bestehende Routine zu opfern. Dafür verzichte ich bewusst auf starre Trainingspläne. Stattdessen entwickle ich mit jedem Athleten ein System, das sich seinem Alltag anpasst — nicht umgekehrt.',
      'Ich freue mich darauf, dich kennenzulernen.',
    ],
  },
)
</script>

<template>
  <section class="ueber-mich">
    <div class="ueber-mich__inner">
      <p class="ueber-mich__kicker">{{ kicker }}</p>
      <div class="ueber-mich__grid">
        <div class="ueber-mich__img-wrap">
          <img
            :src="imgSrc"
            :alt="imgAlt"
            class="ueber-mich__img"
            loading="lazy"
          />
        </div>
        <div class="ueber-mich__content">
          <h2 class="ueber-mich__headline">{{ headline }}</h2>
          <p v-for="(p, i) in paragraphs" :key="i" class="ueber-mich__text">{{ p }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ueber-mich {
  background: #ffffff;
  padding: var(--spacing-section) var(--container-padding-inline);
}

.ueber-mich__inner {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.ueber-mich__kicker {
  text-align: center;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
  margin: 0 0 var(--spacing-spacious);
}

.ueber-mich__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-spacious);
  align-items: center;
}

.ueber-mich__img-wrap {
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--color-brand-dark);
}

.ueber-mich__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.ueber-mich__headline {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-standard);
}

.ueber-mich__text {
  font-size: var(--text-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-cozy);
}

.ueber-mich__text:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .ueber-mich__grid {
    grid-template-columns: 1fr;
  }

  .ueber-mich__img-wrap {
    aspect-ratio: 3 / 2;
  }
}
</style>
