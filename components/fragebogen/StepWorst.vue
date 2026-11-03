<script setup lang="ts">
import { computed } from 'vue'
import type { FbScreen } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const props = defineProps<{ screen: FbScreen }>()
const store = useFragebogenStore()
const q = props.screen.q!

const prevSelected = computed<string[]>(() => {
  const prev = q.followFrom ? store.answers[q.followFrom] : undefined
  const list: string[] = prev?.auswahl ?? prev ?? []
  return list.filter((x: string) => x !== q.exclusive)
})

const chosen = computed(() => store.answers[q.id]?.punkt)
const warum = computed(() => store.answers[q.id]?.warum ?? '')
</script>

<template>
  <div>
    <h2 class="fb-title fb-title--long" tabindex="-1">{{ q.title }}</h2>
    <template v-if="prevSelected.length">
      <Options
        :name="`${q.id}-p`"
        :options="prevSelected"
        :model-value="chosen"
        @update:model-value="store.setField(q.id, 'punkt', $event)"
      />
      <div class="fb-block">
        <label class="fb-label" :for="`${q.id}-warum`">Warum nervt dich das am meisten?</label>
        <textarea
          :id="`${q.id}-warum`"
          class="fb-field"
          rows="4"
          :value="warum"
          @input="store.setField(q.id, 'warum', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </template>
    <p v-else class="fb-lead">Bitte wähle zuerst aus, was auf dich zutrifft.</p>
  </div>
</template>
