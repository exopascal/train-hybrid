<script setup lang="ts">
import { computed } from 'vue'
import { useFragebogenStore } from '~/stores/fragebogen'

const store = useFragebogenStore()
const label = (id: string, i: number) => {
  const s = store.screens[i]!
  return `${s.step ? s.step + '. ' : ''}${s.q?.title || s.term?.name || id}`
}
const items = computed(() => store.screens.map((s, i) => ({ i, id: s.id, text: label(s.id, i), mid: !s.step })))
</script>

<template>
  <div class="fb-dev">
    <div v-if="store.devOpen" class="fb-dev__list">
      <button v-for="it in items" :key="it.id" type="button" class="fb-dev__item" :class="{ 'fb-dev__item--mid': it.mid, 'fb-dev__item--on': it.i === store.idx }" @click="store.jump(it.i)">
        <span>{{ it.i + 1 }}</span><span>{{ it.text }}</span>
      </button>
    </div>
    <div class="fb-dev__bar">
      <button type="button" @click="store.jump(store.idx - 1)">←</button>
      <button type="button" @click="store.jump(store.idx + 1)">→</button>
      <button type="button" @click="store.setDevOpen(!store.devOpen)">{{ store.devOpen ? 'Liste zu' : 'Liste' }}</button>
      <button type="button" @click="store.setDev(false)">Dev aus</button>
    </div>
  </div>
</template>
