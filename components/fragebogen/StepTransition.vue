<script setup lang="ts">
import { computed } from 'vue'
import { H1S, H2_A, type FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const pick = computed(() => H1S.find((h) => h.id === store.answers.h1test) ?? H1S[0]!)
</script>

<template>
  <div v-if="screen.kind === 'transition1'">
    <p class="fb-eyebrow">Phase 2</p>
    <h2 class="fb-title" tabindex="-1">Jetzt zeige ich dir ein paar Begriffe und Sätze.</h2>
    <p class="fb-lead">Sag einfach, was du spontan denkst.</p>
  </div>
  <div v-else>
    <p class="fb-eyebrow">Das Train Hybrid Protokoll</p>
    <h1 class="fb-h1" tabindex="-1">{{ pick.text }}</h1>
    <h2 v-if="pick.id === 'A'" class="fb-sub">{{ H2_A }}</h2>
    <p class="fb-lead">Du trainierst und bist trotzdem noch unzufrieden?</p>
    <p class="fb-lead">
      Spätestens seit der Longevity-Debatte wird das, was wissenschaftlich schon lange klar ist, populär:
      <strong>Kraft, Ausdauer und Mindfulness</strong> zusammen. Genau dafür haben wir Train Hybrid entwickelt.
    </p>
    <p class="fb-lead">Hier ist dein Startplan. Du siehst ihn gleich.</p>
  </div>
</template>
