<script setup lang="ts">
import { ref } from 'vue'
import MultiStepForm from '~/components/design-system-ui-components/MultiStepForm.vue'
import AgentChat from '~/components/AgentChat.vue'
import { useHybridAnalysisStore } from '~/stores/hybridAnalysis'

const isFormOpen = ref(false)
const isAgentOpen = ref(false)
const formAnswers = ref<Record<string, string | number>>({})
const store = useHybridAnalysisStore()

function open() {
  isFormOpen.value = true
}

function onFormComplete(answers: Record<string, string | number>) {
  formAnswers.value = answers
  store.setAnswers(answers)
}

function onFormCta() {
  isFormOpen.value = false
  isAgentOpen.value = true
}

function discardProfile() {
  formAnswers.value = {}
  store.clearAnswers()
}
</script>

<template>
  <div class="pre-header">
    <button class="pre-header__inner" type="button" @click="open">
      <span class="pre-header__badge">NEU</span>
      <span class="pre-header__text">
        <strong>Hybrid-Analyse:</strong>
        Finde in 2 Minuten deinen personalisierten Plan
      </span>
      <span class="pre-header__arrow" aria-hidden="true">→</span>
    </button>

    <MultiStepForm
      v-model="isFormOpen"
      @complete="onFormComplete"
      @cta="onFormCta"
    />

    <AgentChat
      v-if="isAgentOpen"
      :answers="formAnswers"
      @discard-profile="discardProfile"
      @close="isAgentOpen = false"
    />
  </div>
</template>

<style scoped>
.pre-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: calc(var(--z-sticky) + 10);
  height: var(--pre-header-height);
  background: var(--color-brand-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pre-header__inner {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  max-width: var(--container-max-width, 1200px);
  padding: 0 var(--container-padding-inline, 1.5rem);
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: clamp(0.78rem, 1.2vw, 0.9rem);
  line-height: 1;
  transition: opacity 0.15s ease;
}

.pre-header__inner:hover {
  opacity: 0.88;
}

.pre-header__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  background: #000;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.pre-header__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pre-header__text strong {
  font-weight: 700;
}

.pre-header__arrow {
  font-size: 1rem;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.pre-header__inner:hover .pre-header__arrow {
  transform: translateX(3px);
}

@media (max-width: 480px) {
  .pre-header__text {
    font-size: 0.75rem;
  }

  .pre-header__badge {
    display: none;
  }
}
</style>
