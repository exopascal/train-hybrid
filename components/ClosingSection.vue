<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    headline?: string
    subhead?: string
    ctaLabel?: string
    note?: string
  }>(),
  {
    bgStyle: "night",
    headline: "Train Hybrid.",
    subhead: "Kraft im Ausdauertraining.",
    ctaLabel: "Zusammenarbeit anfragen",
    note: "Diese Seite erklärt kein Training. Sie ordnet es ein.",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
</script>

<template>
  <section :class="sectionClass">
    <div class="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
      <div class="space-y-6 text-left">
        <div class="space-y-2">
          <p class="text-4xl font-semibold leading-tight sm:text-5xl">
            {{ props.headline }}
          </p>
          <p class="text-lg text-white/75 sm:text-xl">
            {{ props.subhead }}
          </p>
        </div>

        <div class="space-y-3">
          <a
            id="cta"
            href="#cta"
            class="inline-flex w-fit items-center justify-center rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:shadow-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {{ props.ctaLabel }}
          </a>
          <p class="text-xs uppercase tracking-[0.2em] text-white/50">
            {{ props.note }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
