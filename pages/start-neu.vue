<template>
  <div class="start-neu">
    <!-- ENTWURF neue Startseite (Train Hybrid + Mindfulness). Weitere Sektionen folgen. -->
    <FeatureGrid
      :items="mindfulnessFreebies"
      headline-accent="KOSTENLOSE"
      headline-rest="EINSTIEGE"
      :sub-lines="[
        'Kraft, Puls, Atem und Ruhe – vier kleine Einstiege, die in jeden Tag passen.',
        'Wähle den, der heute zu dir passt.',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import FeatureGrid from '~/components/FeatureGrid.vue'
import { mindfulnessFreebies } from '~/data/freebies'

useSeoMeta({ robots: 'noindex, nofollow' })
</script>
