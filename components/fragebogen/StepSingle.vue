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
    <Options :name="q.id" :options="q.opts!" :model-value="store.answers[q.id]" @update:model-value="store.setAnswer(q.id, $event)" />
  </div>
</template>
