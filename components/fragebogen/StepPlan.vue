<script setup lang="ts">
import { EINHEITEN, ZEIT } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'
import Week from './Week.vue'

const store = useFragebogenStore()
const passt = ['passt', 'anders'].map((v) => ({ v, l: v === 'passt' ? 'Ja, das passt für mich' : 'Ich brauche etwas anderes' }))
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">Das ist dein Startplan.</h2>
    <p class="fb-lead">Fünf Wochen. Kraft, Ausdauer und Mindfulness, in einem Plan, der in deinen Alltag passt.</p>
    <Week />
    <p class="fb-hint">Wir empfehlen, mit 2 Stunden pro Woche zu starten.</p>
    <div class="fb-block">
      <div class="fb-label">Passt das für dich?</div>
      <Options name="plan-passt" :options="passt" :model-value="store.answers.plan?.passt" @update:model-value="store.setField('plan', 'passt', $event)" />
    </div>
    <template v-if="store.answers.plan?.passt === 'anders'">
      <div class="fb-block">
        <div class="fb-label">Wie viel Zeit hast du pro Woche?</div>
        <Options name="plan-zeit" cols :options="ZEIT" :model-value="store.answers.plan?.zeit" @update:model-value="store.setField('plan', 'zeit', $event)" />
      </div>
      <div class="fb-block">
        <div class="fb-label">Wie viele Einheiten?</div>
        <Options name="plan-einheiten" cols :options="EINHEITEN" :model-value="store.answers.plan?.einheiten" @update:model-value="store.setField('plan', 'einheiten', $event)" />
      </div>
    </template>
  </div>
</template>
