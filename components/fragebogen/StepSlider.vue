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
    <p class="fb-lead">Schieb den Regler auf den Punkt, der am besten passt. 1 bis 10.</p>
    <Slider :model-value="store.answers[q.id]" :aria="`${q.title} 1 bis 10`" @update:model-value="store.setAnswer(q.id, $event)">
      <div class="fb-scale-labels fb-scale-labels--3"><span>{{ q.left }}</span><span>{{ q.mid }}</span><span>{{ q.right }}</span></div>
    </Slider>
  </div>
</template>
