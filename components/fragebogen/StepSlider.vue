<script setup lang="ts">
import { computed } from 'vue'
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Slider from './Slider.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!

const zone = computed<0 | 1 | 2>(() => {
  const v = store.answers[q.id] ?? 5
  if (v <= 3) return 0
  if (v >= 8) return 2
  return 1
})
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">{{ q.title }}</h2>
    <p class="fb-lead">Schieb den Regler auf den Punkt, der am besten passt. 1 bis 10.</p>
    <Slider :model-value="store.answers[q.id]" :aria="`${q.title} 1 bis 10`" @update:model-value="store.setAnswer(q.id, $event)">
      <div class="fb-scale-labels fb-scale-labels--3">
        <span :class="{ 'fb-scale-label--active': zone === 0 }">{{ q.left }}</span>
        <span :class="{ 'fb-scale-label--active': zone === 1 }">{{ q.mid }}</span>
        <span :class="{ 'fb-scale-label--active': zone === 2 }">{{ q.right }}</span>
      </div>
    </Slider>
  </div>
</template>
