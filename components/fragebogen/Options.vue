<script setup lang="ts">
import { computed } from 'vue'

interface Opt { v: string | number; l: string; sub?: string; dot?: string }

const props = defineProps<{
  modelValue?: string | number | null
  options: (string | Opt)[]
  name: string
  cols?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

const items = computed<Opt[]>(() => props.options.map((o) => (typeof o === 'string' ? { v: o, l: o } : o)))
</script>

<template>
  <div class="fb-options" :class="{ 'fb-options--cols': cols }">
    <label v-for="o in items" :key="o.v" class="fb-opt">
      <input type="radio" :name="name" :value="o.v" :checked="String(modelValue) === String(o.v)" @change="emit('update:modelValue', o.v)" />
      <span class="fb-opt__face">
        <i v-if="o.dot" class="fb-dot" :class="`fb-dot--${o.dot}`" />
        <span>
          <span>{{ o.l }}</span>
          <small v-if="o.sub" class="fb-opt__sub">{{ o.sub }}</small>
        </span>
      </span>
    </label>
  </div>
</template>
