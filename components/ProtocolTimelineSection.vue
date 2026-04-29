<script setup lang="ts">
import { computed } from "vue"
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

type ProtocolWeek = {
  week: string
  title: string
  focus: string
  deliverables: string[]
}

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    kicker?: string
    headline?: string
    subhead?: string
    weeks?: ProtocolWeek[]
  }>(),
  {
    bgStyle: "light",
    kicker: "12-Wochen-Fahrplan",
    headline: "Der genaue Ablauf deines Hybrid Protokolls.",
    subhead:
      "Jede Woche hat eine klare Funktion: integrieren, stabilisieren, steigern, absichern.",
    weeks: () => [],
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
</script>

<template>
  <section :class="[sectionClass, 'protocol-timeline']">
    <div class="mx-auto max-w-[1500px] px-6 py-20 sm:py-28">
      <div class="mx-auto max-w-3xl text-left">
        <p class="protocol-kicker">{{ props.kicker }}</p>
        <h2 class="protocol-title">{{ props.headline }}</h2>
        <p class="protocol-subhead">{{ props.subhead }}</p>
      </div>

      <div class="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="item in props.weeks"
          :key="`${item.week}-${item.title}`"
          class="protocol-card"
        >
          <div class="protocol-card__week">{{ item.week }}</div>
          <h3 class="protocol-card__title">{{ item.title }}</h3>
          <p class="protocol-card__focus">{{ item.focus }}</p>
          <ul class="protocol-card__list">
            <li v-for="point in item.deliverables" :key="point">{{ point }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.protocol-timeline {
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
}

.protocol-kicker {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.protocol-title {
  margin-top: var(--spacing-sm);
  font-family: var(--font-family-heading);
  font-size: clamp(2.4rem, 4vw, 4.2rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.protocol-subhead {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.protocol-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: var(--color-background);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
}

.protocol-card__week {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
}

.protocol-card__title {
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.protocol-card__focus {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.protocol-card__list {
  margin: 0;
  padding-left: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  color: var(--color-text-primary);
}
</style>
