<script setup lang="ts">
defineProps<{ modelValue?: number; name: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div>
    <div class="fb-scale5">
      <label v-for="n in 5" :key="n" class="fb-opt">
        <input type="radio" :name="name" :value="n" :checked="modelValue === n" @change="emit('update:modelValue', n)" />
        <span class="fb-opt__face">{{ n }}</span>
      </label>
    </div>
    <div class="fb-scale-labels"><span>1 gar nicht</span><span>5 sehr</span></div>
  </div>
</template>
