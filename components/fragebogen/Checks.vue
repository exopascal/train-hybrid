<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string[]
  options: string[]
  /** Option, die alle anderen abwählt */
  exclusive?: string
  /** Optionen untereinander statt im Grid */
  stack?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const chosen = computed(() => props.modelValue ?? [])

function toggle(value: string, checked: boolean) {
  let next = chosen.value.filter((v) => v !== value)
  if (checked) {
    next = props.exclusive && value === props.exclusive ? [value] : [...next.filter((v) => v !== props.exclusive), value]
  }
  emit('update:modelValue', next)
}
</script>

<template>
  <div :class="['fb-options', stack ? 'fb-options--stack' : 'fb-options--cols']">
    <label v-for="o in options" :key="o" class="fb-opt">
      <input type="checkbox" :value="o" :checked="chosen.includes(o)" @change="toggle(o, ($event.target as HTMLInputElement).checked)" />
      <span class="fb-opt__face">{{ o }}</span>
    </label>
  </div>
</template>
