<script setup lang="ts">
import { computed } from 'vue'
import { SENTS } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const store = useFragebogenStore()
const options = computed(() => (store.S?.seed.sents ?? []).map((i) => ({ v: SENTS[i]!.id, l: SENTS[i]!.text })))
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">Auf welche Anzeige würdest du am ehesten klicken?</h2>
    <p class="fb-lead">Stell dir vor, du siehst diese drei Anzeigen in deinem Feed. Wähle die eine, auf die du klicken würdest.</p>
    <Options name="s11-k" :options="options" :model-value="store.answers.s11?.klick" @update:model-value="store.setField('s11', 'klick', $event)" />
  </div>
</template>
