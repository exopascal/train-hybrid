<script setup lang="ts">
import { computed } from 'vue'
import { H1S } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const store = useFragebogenStore()
const options = computed(() => (store.S?.seed.h1 ?? []).map((i) => ({ v: H1S[i]!.id, l: H1S[i]!.text })))
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">Welche Überschrift spricht dich am meisten an?</h2>
    <p class="fb-lead">Das wäre die Überschrift ganz oben auf der Seite. Wähle die, die dich am meisten anspricht.</p>
    <Options name="h1test" :options="options" :model-value="store.answers.h1test" @update:model-value="store.setAnswer('h1test', $event)" />
  </div>
</template>
