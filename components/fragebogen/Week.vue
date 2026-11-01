<script setup lang="ts">
import { useFragebogenStore } from '~/stores/fragebogen'

const store = useFragebogenStore()
</script>

<template>
  <div>
    <div class="fb-big">{{ store.plan.n }} × {{ store.plan.minuten }} <small>Min</small></div>
    <div class="fb-week" aria-label="Beispielwoche">
      <div v-for="d in store.plan.week" :key="d.day" class="fb-day">
        {{ d.day }}
        <div class="fb-slot" :class="d.pillar && `fb-slot--${d.pillar}`">{{ d.letter }}</div>
      </div>
    </div>
    <div class="fb-legend">
      <span><i class="fb-dot fb-dot--kraft" />K = Kraft</span>
      <span><i class="fb-dot fb-dot--ausdauer" />A = Ausdauer</span>
      <span><i class="fb-dot fb-dot--mind" />M = Mindfulness</span>
    </div>
  </div>
</template>
