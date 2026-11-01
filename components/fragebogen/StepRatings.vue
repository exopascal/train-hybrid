<script setup lang="ts">
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Slider from './Slider.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">{{ q.title }}</h2>
    <p class="fb-lead">Von 1 (gar nicht) bis 10 (sehr).</p>
    <div class="fb-rows">
      <Slider
        v-for="[field, label] in q.rows"
        :key="field"
        :label="label"
        :aria="`${label}, 1 bis 10`"
        :model-value="store.answers[q.id]?.[field]"
        @update:model-value="store.setField(q.id, field, $event)"
      >
        <div class="fb-scale-labels"><span>1 gar nicht</span><span>10 sehr</span></div>
      </Slider>
    </div>
  </div>
</template>
