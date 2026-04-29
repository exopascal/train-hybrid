<script setup lang="ts">
type Audience = 'runner' | 'cyclist'

const props = defineProps<{
  modelValue: Audience | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Audience): void
}>()

const options: Array<{ icon: string; label: string; value: Audience }> = [
  { icon: 'R', label: 'Team Hybrid Runners', value: 'runner' },
  { icon: 'C', label: 'Team Hybrid Cycling', value: 'cyclist' },
]
</script>

<template>
  <div class="audience-switch" role="radiogroup" aria-label="Sportart waehlen">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="audience-switch__option"
      :class="{ 'audience-switch__option--active': props.modelValue === option.value }"
      :aria-checked="props.modelValue === option.value"
      role="radio"
      @click="emit('update:modelValue', option.value)"
    >
      <span class="audience-switch__icon" aria-hidden="true">{{ option.icon }}</span>
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.audience-switch {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.audience-switch__option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid color-mix(in srgb, var(--color-text-light) 16%, transparent);
  border-radius: var(--radius-full);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-text-light) 18%, transparent) 0%, transparent 100%),
    color-mix(in srgb, var(--color-text-light) 7%, transparent);
  color: color-mix(in srgb, var(--color-text-light) 88%, transparent);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  transition: background var(--transition-fast), color var(--transition-fast),
    transform var(--transition-fast), box-shadow var(--transition-fast);
  white-space: nowrap;
  backdrop-filter: blur(18px) saturate(145%);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--color-text-light) 20%, transparent),
    0 0.5rem 1rem color-mix(in srgb, black 12%, transparent);
}

.audience-switch__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid color-mix(in srgb, currentColor 32%, transparent);
  border-radius: var(--radius-full);
  font-size: 0.625rem;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  background: color-mix(in srgb, var(--color-text-light) 10%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-text-light) 14%, transparent);
}

.audience-switch__option:hover {
  color: var(--color-text-light);
  transform: translateY(-1px);
}

.audience-switch__option--active {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-text-light) 95%, transparent) 0%, color-mix(in srgb, var(--color-background-secondary) 88%, transparent) 100%);
  color: var(--color-brand-dark);
  box-shadow:
    0 0.75rem 1.25rem color-mix(in srgb, black 14%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--color-text-light) 82%, transparent);
}

.audience-switch__option--active .audience-switch__icon {
  border-color: color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
  background: color-mix(in srgb, var(--color-background) 72%, transparent);
  box-shadow: none;
}

@media (max-width: 640px) {
  .audience-switch {
    width: 100%;
    justify-content: stretch;
  }

  .audience-switch__option {
    flex: 1 1 calc(50% - 0.25rem);
    justify-content: center;
  }
}
</style>
