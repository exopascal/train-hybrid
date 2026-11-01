<script setup lang="ts">
import { ref } from 'vue'
import { useFragebogenStore } from '~/stores/fragebogen'
import Week from './Week.vue'

const store = useFragebogenStore()
const copyHint = ref('')

async function copy() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(store.pending || {}, null, 2))
    copyHint.value = 'Kopiert.'
  } catch {
    copyHint.value = 'Kopieren war nicht möglich.'
  }
}
</script>

<template>
  <div v-if="store.saved">
    <p class="fb-eyebrow">Fertig</p>
    <h2 class="fb-title" tabindex="-1">Danke dir!</h2>
    <p class="fb-lead">Deine Antworten sind angekommen. Ich lese sie selbst durch.</p>
    <p class="fb-eyebrow">Dein Startplan</p>
    <Week />
    <p class="fb-lead">pro Woche, fünf Wochen lang. Danach liegen {{ store.plan.n * 5 }} Einheiten hinter dir, und Kraft, Ausdauer und Mindfulness gehören zu deinem Alltag.</p>
    <dl class="fb-sum">
      <dt>Zeit pro Woche</dt><dd>{{ store.plan.zeitLabel }}</dd>
      <dt>Einheiten pro Woche</dt><dd>{{ store.plan.n }}</dd>
      <dt>Plan</dt><dd>{{ store.plan.anders ? 'von dir angepasst' : 'wie vorgeschlagen' }}</dd>
    </dl>
    <p class="fb-note">
      {{ store.plan.usedDefault ? 'Du hast nicht alles angepasst. Ich habe mit unserer Empfehlung gerechnet: 2 Stunden in 3 Einheiten. ' : '' }}Das ist die Vorschau auf deinen individuellen Plan.
    </p>
  </div>
  <div v-else>
    <p class="fb-eyebrow">Das hat nicht geklappt</p>
    <h2 class="fb-title" tabindex="-1">Deine Antworten sind noch nicht gespeichert.</h2>
    <p class="fb-lead">Die Verbindung zum Speicher ist fehlgeschlagen. Deine Antworten liegen noch in diesem Browser. Versuche es noch einmal, oder kopiere sie und schick sie mir.</p>
    <div class="fb__nav">
      <button type="button" class="fb__ghost" @click="copy">Antworten kopieren</button>
      <button type="button" class="btn-main" :disabled="store.busy" @click="store.submit(true)">Nochmal versuchen</button>
    </div>
    <p class="fb-privacy">{{ copyHint }}</p>
  </div>
</template>
