import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type HybridAnalysisAnswers = Record<string, string | number>

export const useHybridAnalysisStore = defineStore('hybridAnalysis', () => {
  const answers = ref<HybridAnalysisAnswers>({})
  const completedAt = ref<string | null>(null)

  const hasResults = computed(() => Object.keys(answers.value).length > 0)

  function setAnswers(nextAnswers: HybridAnalysisAnswers) {
    answers.value = { ...nextAnswers }
    completedAt.value = new Date().toISOString()
  }

  function clearAnswers() {
    answers.value = {}
    completedAt.value = null
  }

  return {
    answers,
    completedAt,
    hasResults,
    setAnswers,
    clearAnswers,
  }
})
