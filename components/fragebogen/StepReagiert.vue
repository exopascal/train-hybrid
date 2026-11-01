<script setup lang="ts">
import { HAEUFIG, type FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!
</script>

<template>
  <div>
    <h2 class="fb-title fb-title--long" tabindex="-1">{{ q.title }}</h2>
    <p class="fb-req">Pflichtfeld</p>
    <Options :name="`${q.id}-u`" :options="HAEUFIG" cols :model-value="store.answers[q.id]?.ueberreagiert" @update:model-value="store.setField(q.id, 'ueberreagiert', $event)" />
    <div class="fb-block">
      <div class="fb-label">Bereust du manchmal, wie du reagiert hast?</div>
      <Options :name="`${q.id}-b`" :options="HAEUFIG" cols :model-value="store.answers[q.id]?.bereut" @update:model-value="store.setField(q.id, 'bereut', $event)" />
    </div>
  </div>
</template>
