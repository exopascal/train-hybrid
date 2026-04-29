<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
  }>(),
  {
    bgStyle: "night",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])

const testimonials = [
  { name: "Mara", sport: "Marathon", quote: "Beine stabiler, Läufe fühlen sich leichter an." },
  { name: "Jonas", sport: "Radsport", quote: "Mehr Druck am Berg, weniger Ermüdung." },
  { name: "Lea", sport: "Triathlon", quote: "Schulter stabil, Schwimmen bleibt sauber." },
  { name: "Tim", sport: "Trailrunning", quote: "Weniger Kniezwicken, mehr Kontrolle bergab." },
  { name: "Alina", sport: "Ultra", quote: "Mehr Stabilität in langen Belastungen." },
  { name: "Ben", sport: "Gravel", quote: "Körper bleibt ruhig, Output steigt." },
]

const rowA = [...testimonials, ...testimonials]
const rowB = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()]
</script>

<template>
  <section :class="[sectionClass, 'proof-section']">
    <div class="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div class="proof-header">
        <div class="proof-title">
          <span class="proof-accent">›</span>
          <h2>Echte Resultate.</h2>
        </div>
        <a class="proof-link" href="/blog">View all →</a>
      </div>

      <div class="proof-marquee">
        <div class="proof-row proof-row--left">
          <article v-for="(item, index) in rowA" :key="`a-${index}`" class="proof-card">
            <p class="proof-quote">“{{ item.quote }}”</p>
            <div class="proof-meta">
              <span class="proof-name">{{ item.name }}</span>
              <span class="proof-sep">•</span>
              <span>{{ item.sport }}</span>
            </div>
          </article>
        </div>
        <div class="proof-row proof-row--right">
          <article v-for="(item, index) in rowB" :key="`b-${index}`" class="proof-card">
            <p class="proof-quote">“{{ item.quote }}”</p>
            <div class="proof-meta">
              <span class="proof-name">{{ item.name }}</span>
              <span class="proof-sep">•</span>
              <span>{{ item.sport }}</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.proof-section {
  position: relative;
  overflow: hidden;
  background: rgba(251, 109, 62, 0.65);
}

.proof-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.proof-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 700;
}

.proof-title h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.proof-accent {
  color: #ff6a1a;
  font-size: 18px;
}

.proof-link {
  color: #ff6a1a;
  text-decoration: none;
  font-size: 14px;
}

.proof-marquee {
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
}

.proof-row {
  display: flex;
  gap: 16px;
  white-space: nowrap;
  width: max-content;
  animation: proof-left 28s linear infinite;
}

.proof-row--right {
  animation-name: proof-right;
}

.proof-card {
  min-width: 280px;
  max-width: 320px;
  border-radius: 16px;
  padding: 16px 18px;
  background: rgba(17, 24, 39, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  color: #fff;
}

.proof-quote {
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.8);
}

.proof-meta {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.proof-name {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.proof-sep {
  margin: 0 6px;
  color: rgba(255, 255, 255, 0.3);
}

@keyframes proof-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes proof-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .proof-card {
    min-width: 240px;
  }
  .proof-row {
    animation-duration: 22s;
  }
}
</style>
