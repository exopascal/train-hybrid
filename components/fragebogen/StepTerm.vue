<script setup lang="ts">
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Scale5 from './Scale5.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const id = props.screen.id
const term = props.screen.term!
</script>

<template>
  <div>
    <p class="fb-eyebrow">Begriff {{ screen.sub }} von 4</p>
    <h2 class="fb-term" tabindex="-1">{{ term.name }}</h2>
    <p class="fb-hint">{{ term.def }}</p>
    <div class="fb-block">
      <div class="fb-label">Klingt interessant</div>
      <Scale5 :name="`${id}-i`" :model-value="store.answers[id]?.interessant" @update:model-value="store.setField(id, 'interessant', $event)" />
    </div>
  </div>
</template>
