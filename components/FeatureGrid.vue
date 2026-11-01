<script setup lang="ts">
import { kraftFreebies, type FreebieItem } from '~/data/freebies'

withDefaults(
  defineProps<{
    items?: FreebieItem[]
    headlineAccent?: string
    headlineRest?: string
    subLines?: string[]
  }>(),
  {
    items: () => kraftFreebies,
    headlineAccent: 'KOSTENLOSE',
    headlineRest: 'EINSTIEGE',
    subLines: () => [
      'Ich zeige dir wie du Krafttraining nahtlos in deine Ausdauerroutine integrierst.',
      'Videos, Guides, Downloads & mehr für deinen Erfolg.',
    ],
  },
)
</script>

<template>
  <section class="feature-grid" aria-label="Train Hybrid Programm-Inhalte">
    <div class="feature-grid__header">
      <h2 class="feature-grid__headline"><span class="headline-gradient">{{ headlineAccent }}</span> {{ headlineRest }}</h2>
      <p class="feature-grid__sub">
        <template v-for="(line, i) in subLines" :key="i">
          <br v-if="i > 0" />{{ line }}
        </template>
      </p>
      <div class="feature-grid__divider" />
    </div>
    <div class="feature-grid__inner">
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="feature-card">
        <img :src="item.img" alt="" :class="['feature-card__img', item.imgClass]" loading="lazy" />
        <div class="feature-card__overlay" />
        <div class="feature-card__text">
          <h3 class="feature-card__title">{{ item.title }}</h3>
          <p class="feature-card__sub">{{ item.sub }}</p>
          <span class="feature-card__cta btn-main">{{ item.cta ?? 'Jetzt loslegen.' }}</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.feature-grid {
  background: #ffffff;
  padding: 1rem 0 1rem;
}

.feature-grid__header {
  padding: 2.5rem 1rem 1.5rem;
  text-align: center;
}

.feature-grid__headline {
  margin: 0 0 0.5rem;
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #0f172a;
}


.feature-grid__sub {
  margin: 0;
  font-size: clamp(0.9rem, 1.3vw, 1.05rem);
  line-height: 1.55;
  color: #64748b;
}

.feature-grid__divider {
  margin: 1.5rem auto 0;
  width: 50%;
  height: 2px;
  background: #d1d5db;
  border-radius: 2px;
}

/* ── Flex-wrap layout with explicit margin system ─────────── */
.feature-grid__inner {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

/* ── Single card ──────────────────────────────────────────── */
.feature-card {
  position: relative;
  overflow: hidden;
  /* height per row */
  height: clamp(220px, 28vw, 360px);
  border-radius: 12px;
  /* left cards: odd children */
  flex-shrink: 0;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

/* Left column (1st, 3rd) */
.feature-card:nth-child(odd) {
  width: calc(50% - 1.5rem);
  margin-left: 1rem;
  margin-right: 0.5rem;
}

/* Right column (2nd, 4th) */
.feature-card:nth-child(even) {
  width: calc(50% - 1.5rem);
  margin-left: 0.5rem;
  margin-right: 1rem;
}

/* Row gap — only between first and second row */
.feature-card:nth-child(1),
.feature-card:nth-child(2) {
  margin-bottom: 1rem;
}

/* ── Image ────────────────────────────────────────────────── */
.feature-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.55s ease;
}

.feature-card__img--product {
  object-position: center 30%;
}

.feature-card:hover .feature-card__img {
  transform: scale(1.04);
}

/* ── Dark overlay ─────────────────────────────────────────── */
.feature-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.92) 0%,
      rgba(0, 0, 0, 0.55) 50%,
      rgba(0, 0, 0, 0.15) 100%
    );
  pointer-events: none;
}

/* ── Text block ───────────────────────────────────────────── */
.feature-card__text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(1rem, 2.2vw, 1.6rem);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.feature-card__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.15;
  color: #ffffff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
}

.feature-card__sub {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
  max-width: 36ch;
}

.feature-card__cta {
  align-self: flex-start;
  margin-top: 0.6rem;
}

.feature-card:hover .feature-card__cta {
  transform: translateY(-2px);
}

/* ── Mobile ───────────────────────────────────────────────── */
@media (max-width: 640px) {
  .feature-grid {
    padding: 0.75rem 0;
  }

  .feature-card:nth-child(odd),
  .feature-card:nth-child(even) {
    width: calc(100% - 1.5rem);
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    height: 220px;
  }

  .feature-card:nth-child(1),
  .feature-card:nth-child(2),
  .feature-card:nth-child(3) {
    margin-bottom: 0.75rem;
  }

  .feature-card__title {
    font-size: 1.4rem;
  }

  .feature-card__sub {
    font-size: 1rem;
  }

  .feature-card__cta {
    margin-top: 0.4rem;
  }
}
</style>
