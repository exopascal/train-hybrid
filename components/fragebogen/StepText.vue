<script setup lang="ts">
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!
</script>

<template>
  <div>
    <h2 class="fb-title fb-title--long" tabindex="-1">{{ q.title }}</h2>
    <p v-if="q.required" class="fb-req">Pflichtfeld</p>
    <textarea class="fb-field" rows="6" aria-label="Deine Antwort" :value="store.answers[q.id] || ''" @input="store.setAnswer(q.id, ($event.target as HTMLTextAreaElement).value)" />
  </div>
</template>
