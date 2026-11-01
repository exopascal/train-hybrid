<script setup lang="ts">
import { computed } from 'vue'
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Checks from './Checks.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!

/** Mit Freitext: { auswahl, text }, sonst nur die Liste der Auswahl */
const chosen = computed<string[] | undefined>(() => (q.text ? store.answers[q.id]?.auswahl : store.answers[q.id]))

function onChecks(list: string[]) {
  if (q.text) store.setField(q.id, 'auswahl', list)
  else store.setAnswer(q.id, list)
}
</script>

<template>
  <div>
    <h2 class="fb-title fb-title--long" tabindex="-1">{{ q.title }}</h2>
    <p class="fb-lead">{{ q.lead }}</p>
    <Checks :options="q.opts!" :exclusive="q.exclusive" :model-value="chosen" @update:model-value="onChecks" />
    <div v-if="q.text" class="fb-block">
      <label class="fb-label" :for="`${q.id}-text`">Oder in deinen Worten</label>
      <textarea :id="`${q.id}-text`" class="fb-field" rows="3" :value="store.answers[q.id]?.text || ''" @input="store.setField(q.id, 'text', ($event.target as HTMLTextAreaElement).value)" />
    </div>
  </div>
</template>
