<script setup lang="ts">
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!
</script>

<template>
  <div>
    <h2 class="fb-title fb-title--long" tabindex="-1">{{ q.title }}</h2>
    <Options :name="q.id" :options="['Ja', 'Nein']" cols :model-value="store.answers[q.id]?.antwort" @update:model-value="store.setField(q.id, 'antwort', $event)" />
    <div v-if="store.answers[q.id]?.antwort === 'Ja'" class="fb-block">
      <label class="fb-label" :for="`${q.id}-was`">{{ q.follow }}</label>
      <textarea :id="`${q.id}-was`" class="fb-field" rows="3" :value="store.answers[q.id]?.was || ''" @input="store.setField(q.id, 'was', ($event.target as HTMLTextAreaElement).value)" />
    </div>
  </div>
</template>
