<script setup lang="ts">
/** 1-10 Slider. Zeigt "–", bis der Regler bewegt oder angetippt wurde. */
const props = defineProps<{
  modelValue?: number
  label?: string
  aria: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function set(e: Event) {
  emit('update:modelValue', Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div>
    <div class="fb-row-label">
      <span v-if="label">{{ label }}</span>
      <output class="fb-val">{{ props.modelValue ?? '–' }}</output>
    </div>
    <input type="range" class="fb-range" min="1" max="10" step="1" :value="props.modelValue ?? 5" :aria-label="aria" @input="set" @click="set" />
    <slot />
  </div>
</template>
