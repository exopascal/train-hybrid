<script setup lang="ts">
import { ref } from 'vue'
import ButtonShine from '~/components/ButtonShine.vue'
import MultiStepForm from '~/components/design-system-ui-components/MultiStepForm.vue'
import { useHybridAnalysisStore } from '~/stores/hybridAnalysis'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: 'shine' | 'header' | 'hero' | 'sidebar'
  }>(),
  {
    label: 'Hybrid-Analyse starten',
    variant: 'header',
  }
)

const emit = defineEmits<{
  (e: 'open'): void
}>()

const isFormOpen = ref(false)
const formAnswers = ref<Record<string, string | number>>({})
const hybridAnalysisStore = useHybridAnalysisStore()

const openAnalysis = () => {
  isFormOpen.value = true
  emit('open')
}

function onFormComplete(answers: Record<string, string | number>) {
  formAnswers.value = answers
  hybridAnalysisStore.setAnswers(answers)
}

function onFormCta() {
  isFormOpen.value = false
}

function discardProfile() {
  formAnswers.value = {}
  hybridAnalysisStore.clearAnswers()
}
</script>

<template>
  <div :class="['analysis-cta-trigger', `analysis-cta-trigger--${props.variant}`]">
    <ButtonShine
      v-if="props.variant === 'shine'"
      :label="props.label"
      @click="openAnalysis"
    />
    <button
      v-else
      type="button"
      class="analysis-cta-button"
      @click="openAnalysis"
    >
      {{ props.label }}
    </button>

    <MultiStepForm
      v-model="isFormOpen"
      @complete="onFormComplete"
      @cta="onFormCta"
    />
  </div>
</template>

<style scoped>
.analysis-cta-trigger {
  display: inline-flex;
}

.analysis-cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    background var(--transition-fast), border-color var(--transition-fast);
}

.analysis-cta-button:hover {
  transform: translateY(-2px);
}

.analysis-cta-trigger--header .analysis-cta-button,
.analysis-cta-trigger--sidebar .analysis-cta-button {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-brand-accent);
  color: var(--color-text-light);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--color-brand-accent) 35%, transparent);
}

.analysis-cta-trigger--header .analysis-cta-button:hover,
.analysis-cta-trigger--sidebar .analysis-cta-button:hover {
  box-shadow: 0 14px 28px color-mix(in srgb, var(--color-brand-accent) 45%, transparent);
}

.analysis-cta-trigger--hero .analysis-cta-button {
  padding: 0.75rem 1.5rem;
  border-color: color-mix(in srgb, var(--color-background) 50%, transparent);
  background: color-mix(in srgb, var(--color-background) 10%, transparent);
  color: var(--color-text-light);
}

.analysis-cta-trigger--hero .analysis-cta-button:hover {
  background: color-mix(in srgb, var(--color-background) 20%, transparent);
}

@media (max-width: 768px) {
  .analysis-cta-trigger--header .analysis-cta-button,
  .analysis-cta-trigger--sidebar .analysis-cta-button {
    min-height: 2.625rem;
    padding: 0.375rem 0.75rem;
    font-size: var(--font-size-xs);
  }
}
</style>
