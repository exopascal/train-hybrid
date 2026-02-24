<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    headlineOne?: string
    headlineTwo?: string
    body?: string
    transition?: string
  }>(),
  {
    bgStyle: "night",
    headlineOne: "Ausdauer hält dich fit.",
    headlineTwo: "Muskeln halten dich jung.",
    body:
      "Du bewegst dich regelmäßig. Das hält dein Herz-Kreislauf-System leistungsfähig.\nWas dabei oft fehlt, ist gezielte Kraft. Sie stabilisiert, schützt Gelenke\nund erhält Leistungsfähigkeit über die Jahre.",
    transition: "Deshalb wird Kraft bei uns nicht ergänzt – sondern integriert.",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
</script>

<template>
  <section :class="sectionClass">
    <div class="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
      <div class="space-y-8 text-left">
        <div class="space-y-2 text-3xl font-semibold leading-tight sm:text-4xl">
          <p>{{ props.headlineOne }}</p>
          <p>{{ props.headlineTwo }}</p>
        </div>

        <blockquote
          class="border-l border-white/15 pl-6 text-base leading-relaxed text-white/75 sm:text-lg"
        >
          <p class="whitespace-pre-line">{{ props.body }}</p>
        </blockquote>

        <p class="max-w-3xl text-base font-medium text-white/85 sm:text-lg">
          {{ props.transition }}
        </p>
      </div>
    </div>
  </section>
</template>
