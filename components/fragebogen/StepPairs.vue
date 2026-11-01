<script setup lang="ts">
import { computed } from 'vue'
import { PAIRS } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const store = useFragebogenStore()
const pairs = computed(() => PAIRS.map((pair, i) => (store.S?.seed.flips[i] ? [pair[1], pair[0]] : [pair[0], pair[1]])))
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">Welche Formulierung würdest du eher anklicken?</h2>
    <div v-for="(pair, i) in pairs" :key="i" class="fb-block">
      <div class="fb-label">Paar {{ i + 1 }} von 3</div>
      <Options :name="`s10-p${i + 1}`" :options="pair" cols :model-value="store.answers.s10?.[`p${i + 1}`]" @update:model-value="store.setField('s10', `p${i + 1}`, $event)" />
    </div>
  </div>
</template>
