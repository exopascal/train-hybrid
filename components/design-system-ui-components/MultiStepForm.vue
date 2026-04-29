<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import InvestmentSlider from "~/components/design-system-ui-components/InvestmentSlider.vue"

type StepType = "choice" | "slider"

type Step = {
  id: string
  type: StepType
  question: string
  options?: string[]
  microFeedback: string
  key: string
  min?: number
  max?: number
  step?: number
  minLabel?: string
  maxLabel?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    mode?: "popup" | "inline"
    headline?: string
    subline?: string
    startCta?: string
    steps?: Step[]
    regularPrice?: number
    discountAmount?: number
    primaryCta?: string
    secondaryCta?: string
  }>(),
  {
    modelValue: false,
    mode: "popup",
    headline: "Hybrid-Analyse starten",
    subline:
      "Qualifiziere dich für deinen Integrationsvorteil\nund sichere dir bis zu 150 € auf dein 12-Wochen-Protokoll.",
    startCta: "Hybrid-Setup jetzt prüfen",
    regularPrice: 697,
    discountAmount: 150,
    primaryCta: "Hybrid-Protokoll starten",
    secondaryCta: "Strategiegesprach vereinbaren",
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "complete", payload: Record<string, string | number>): void
  (e: "cta"): void
  (e: "secondary"): void
}>()

const defaultSteps: Step[] = [
  {
    id: "movement",
    type: "choice",
    question: "Was beschreibt deine aktuelle Bewegung am besten?",
    options: [
      "Ich fahre Gravel",
      "Ich fahre Rennrad",
      "Ich laufe regelmäßig",
      "Ich kombiniere Ausdauer & Kraft",
      "Ich bin draußen aktiv",
      "Ich will gerade erst starten",
    ],
    microFeedback: "Bewegungsprofil erkannt.",
    key: "movement",
  },
  {
    id: "frequency",
    type: "choice",
    question: "Wie oft trainierst du aktuell pro Woche?",
    options: ["1-2 Einheiten", "3-4 Einheiten", "5+ Einheiten", "Unregelmäßig"],
    microFeedback: "Trainingsumfang registriert.",
    key: "frequency",
  },
  {
    id: "strength",
    type: "choice",
    question: "Wie integrierst du aktuell Krafttraining?",
    options: [
      "Gar nicht",
      "Unregelmäßig / ohne Plan",
      "1-2x pro Woche",
      "Strukturiert mit System",
      "Ich hatte Beschwerden / Unsicherheiten",
    ],
    microFeedback: "Kraftstatus erfasst.",
    key: "strength",
  },
  {
    id: "time",
    type: "choice",
    question:
      "Wie viel Zeit kannst du pro Woche realistisch in strukturierte Kraftintegration investieren?",
    options: ["30 Minuten", "60 Minuten", "90 Minuten", "120+ Minuten"],
    microFeedback: "Wochenrahmen definiert.",
    key: "time",
  },
  {
    id: "gear",
    type: "slider",
    question: "Wie viel hast du bisher ungefähr für Sportbekleidung und Ausrüstung ausgegeben?",
    microFeedback: "Investitionsprofil ergänzt.",
    key: "gear",
    min: 0,
    max: 10000,
    step: 250,
    minLabel: "0 €",
    maxLabel: "10.000 €+",
  },
  {
    id: "investment",
    type: "choice",
    question:
      "Wie viel bist du bereit, in den nächsten 12 Wochen in deine sportliche Entwicklung zu investieren?",
    options: ["Unter 300 €", "300-700 €", "700-1.500 €", "Über 1.500 €"],
    microFeedback: "Rahmen erfasst. Setup wird berechnet...",
    key: "investment",
  },
]

const baseSteps = computed(() => props.steps?.length ? props.steps : defaultSteps)
const steps = computed(() => {
  if (answers.movement === "Ich will gerade erst starten" && answers.equipment === "Nein") {
    return baseSteps.value.filter((step) => step.id !== "gear")
  }
  return baseSteps.value
})
const totalSteps = computed(() => steps.value.length)

const stage = ref<"start" | "step" | "loading" | "result">("start")
const currentStep = ref(0)
const microFeedback = ref("")
let advanceTimer: ReturnType<typeof setTimeout> | null = null
let feedbackTimer: ReturnType<typeof setTimeout> | null = null
const answers = reactive<Record<string, string | number>>({
  gear: 1000,
  equipment: "",
})

const statusTexts = [
  "Setup wird ermittelt...",
  "Profil wird aufgebaut...",
  "Trainingsrahmen wird definiert...",
  "Fast geschafft...",
]

const currentStatusText = computed(() => {
  if (stage.value === "loading") return "Setup wird berechnet..."
  if (stage.value === "result") return "Profil abgeschlossen. Ergebnis bereit."
  return statusTexts[Math.min(currentStep.value, statusTexts.length - 1)]
})

const isPopup = computed(() => props.mode === "popup")
const isOpen = computed(() => (isPopup.value ? props.modelValue : true))

const progressClass = computed(() => {
  const step = stage.value === "start" ? 0 : Math.min(currentStep.value + 1, totalSteps.value)
  return `progress-step-${step}`
})

const formattedRegularPrice = computed(() => formatCurrency(props.regularPrice))
const formattedDiscount = computed(() => formatCurrency(props.discountAmount))
const entryPrice = computed(() => Math.max(props.regularPrice - props.discountAmount, 0))
const formattedEntryPrice = computed(() => formatCurrency(entryPrice.value))

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function resetFlow() {
  stage.value = "start"
  currentStep.value = 0
  microFeedback.value = ""
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) resetFlow()
  },
)

function close() {
  if (isPopup.value) emit("update:modelValue", false)
}

function start() {
  stage.value = "step"
  currentStep.value = 0
}

function triggerFeedbackAndAdvance(message: string) {
  microFeedback.value = message
  if (feedbackTimer) clearTimeout(feedbackTimer)
  if (advanceTimer) clearTimeout(advanceTimer)
  feedbackTimer = setTimeout(() => {
    microFeedback.value = ""
  }, 700)
  advanceTimer = setTimeout(() => {
    next()
  }, 1000)
}

function selectOption(option: string) {
  const step = steps.value[currentStep.value]
  answers[step.key] = option
  if (step.id === "movement") {
    if (option === "Ich will gerade erst starten") {
      answers.equipment = ""
      return
    }
    triggerFeedbackAndAdvance(step.microFeedback)
    return
  }
  triggerFeedbackAndAdvance(step.microFeedback)
}

function selectEquipment(option: "Ja" | "Nein") {
  answers.equipment = option
  triggerFeedbackAndAdvance("Equipment-Status erfasst.")
}

function nextFromSlider() {
  const step = currentStepData.value
  if (!step || step.type !== "slider") return
  if (!canProceedSlider.value) return
  triggerFeedbackAndAdvance(step.microFeedback)
}

function next() {
  if (stage.value !== "step") return
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value += 1
  } else {
    stage.value = "loading"
    setTimeout(() => {
      stage.value = "result"
      emit("complete", { ...answers })
    }, 2800)
  }
}

function prev() {
  if (stage.value !== "step") return
  if (currentStep.value > 0) currentStep.value -= 1
}

const currentStepData = computed(() => steps.value[currentStep.value])

const canProceedSlider = computed(() => {
  if (stage.value !== "step") return false
  const step = currentStepData.value
  if (!step || step.type !== "slider") return false
  return typeof answers[step.key] === "number"
})

const summaryItems = computed(() => {
  return [
    { label: "Aktuelle Trainingsfrequenz", value: answers.frequency || "-" },
    { label: "Kraftintegration", value: answers.strength || "-" },
    { label: "Zeitbudget", value: answers.time || "-" },
    { label: "Bewegungsprofil", value: answers.movement || "-" },
    { label: "Investmentrahmen", value: answers.investment || "-" },
    {
      label: "Ausrüstung",
      value:
        answers.movement === "Ich will gerade erst starten" && answers.equipment === "Nein"
          ? "-"
          : answers.gear
            ? `${formatCurrency(Number(answers.gear))}`
            : "-",
    },
  ]
})

const sliderScale = computed(() => {
  const movement = String(answers.movement || "")
  const groupA = ["Ich fahre Gravel", "Ich fahre Rennrad"]
  const groupB = [
    "Ich laufe regelmäßig",
    "Ich kombiniere Ausdauer & Kraft",
    "Ich bin draußen aktiv",
  ]

  if (groupA.includes(movement)) {
    return { min: 1000, max: 10000, step: 250 }
  }
  if (groupB.includes(movement) || (movement === "Ich will gerade erst starten" && answers.equipment === "Ja")) {
    return { min: 50, max: 1000, step: 50 }
  }
  return { min: 50, max: 1000, step: 50 }
})

watch(
  () => answers.movement,
  () => {
    if (answers.movement !== "Ich will gerade erst starten") {
      answers.equipment = ""
    }
    const scale = sliderScale.value
    answers.gear = scale.min
  },
)

watch(
  () => steps.value.length,
  () => {
    if (currentStep.value >= steps.value.length) {
      currentStep.value = Math.max(0, steps.value.length - 1)
    }
  },
)
</script>

<template>
  <ClientOnly>
    <Teleport v-if="isPopup" to="body">
      <div v-if="isOpen" class="analysis-overlay" @click.self="close">
        <div class="analysis-card" role="dialog" aria-modal="true">
          <button class="analysis-close" type="button" aria-label="Schließen" @click="close">×</button>
          <div class="analysis-progress">
            <div class="analysis-progress__bar" :class="progressClass"></div>
            <div class="analysis-progress__meta">
              Schritt {{ stage === "start" ? 0 : Math.min(currentStep + 1, totalSteps) }} von
              {{ totalSteps }}
            </div>
          </div>
          <div class="analysis-status">{{ currentStatusText }}</div>
          <div class="analysis-feedback-overlay" :class="{ 'is-active': microFeedback }">
            <div class="analysis-feedback-overlay__content">{{ microFeedback }}</div>
          </div>

          <div class="analysis-body">
            <div v-if="stage === 'start'" class="analysis-start">
              <h2 class="analysis-headline">{{ props.headline }}</h2>
              <p class="analysis-subline">{{ props.subline }}</p>
              <button class="analysis-primary" type="button" @click="start">
                {{ props.startCta }}
              </button>
            </div>

            <div v-else-if="stage === 'step'" class="analysis-step">
              <h3 class="analysis-question">{{ currentStepData.question }}</h3>

              <div v-if="currentStepData.type === 'choice'" class="analysis-options">
                <button
                  v-for="option in currentStepData.options"
                  :key="option"
                  type="button"
                  class="analysis-option"
                  :class="{ 'is-selected': answers[currentStepData.key] === option }"
                  @click="selectOption(option)"
                >
                  {{ option }}
                </button>
              </div>

              <div
                v-if="currentStepData.id === 'movement' && answers.movement === 'Ich will gerade erst starten'"
                class="analysis-followup"
              >
                <p class="analysis-followup__question">Hast du bereits Equipment?</p>
                <div class="analysis-followup__options">
                  <button
                    type="button"
                    class="analysis-option"
                    :class="{ 'is-selected': answers.equipment === 'Ja' }"
                    @click="selectEquipment('Ja')"
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    class="analysis-option"
                    :class="{ 'is-selected': answers.equipment === 'Nein' }"
                    @click="selectEquipment('Nein')"
                  >
                    Nein
                  </button>
                </div>
              </div>

              <div v-else-if="currentStepData.type === 'slider'" class="analysis-slider">
                <InvestmentSlider
                  v-model="answers[currentStepData.key]"
                  :min="sliderScale.min"
                  :max="sliderScale.max"
                  :step="sliderScale.step"
                />
              </div>

              <div class="analysis-nav">
                <button class="analysis-secondary" type="button" @click="prev" :disabled="currentStep === 0">
                  Zurück
                </button>
                <button
                  v-if="currentStepData.type === 'slider'"
                  class="analysis-primary"
                  type="button"
                  @click="nextFromSlider"
                  :disabled="!canProceedSlider"
                >
                  Weiter
                </button>
              </div>
            </div>

            <div v-else-if="stage === 'loading'" class="analysis-loading">
              <div class="analysis-spinner"></div>
              <p>Wir prüfen dein Profil und erstellen einen Vorschlag für deinen Trainingsstart.</p>
            </div>

            <div v-else class="analysis-result">
              <h3 class="analysis-question">So könnte dein Trainingsstart aussehen</h3>
              <div class="analysis-week">
                <div>
                  <strong>Woche 1</strong>
                  <ul>
                    <li>X Ausdauereinheiten</li>
                    <li>X Hybrid-Krafteinheiten</li>
                    <li>Fokus: Stabilität & Grundspannung</li>
                  </ul>
                </div>
                <div>
                  <strong>Woche 2</strong>
                  <ul>
                    <li>Progression</li>
                    <li>Anpassung Widerstand</li>
                    <li>Belastungssteuerung</li>
                  </ul>
                </div>
              </div>
              <p class="analysis-note">
                Basierend auf deinem Profil entwickeln wir daraus dein individuelles 12-Wochen-Protokoll mit
                klarer Progression, Meilensteinen und Deload.
              </p>

              <div class="analysis-summary">
                <div v-for="item in summaryItems" :key="item.label" class="analysis-summary__item">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>

              <div class="analysis-pricing">
                <div>
                  <span>Regulärer Preis</span>
                  <strong>{{ formattedRegularPrice }}</strong>
                </div>
                <div>
                  <span>Hybrid-Integrationsvorteil</span>
                  <strong>-{{ formattedDiscount }}</strong>
                </div>
                <div class="analysis-pricing__total">
                  <span>Dein Einstiegspreis</span>
                  <strong>{{ formattedEntryPrice }}</strong>
                </div>
              </div>

              <div class="analysis-cta">
                <button class="analysis-primary analysis-primary--full" type="button" @click="emit('cta')">
                  {{ props.primaryCta }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>

  <div v-if="!isPopup" class="analysis-inline">
    <div class="analysis-card">
      <div class="analysis-progress">
        <div class="analysis-progress__bar" :class="progressClass"></div>
        <div class="analysis-progress__meta">
          Schritt {{ stage === "start" ? 0 : Math.min(currentStep + 1, totalSteps) }} von {{ totalSteps }}
        </div>
      </div>
      <div class="analysis-status">{{ currentStatusText }}</div>
      <div class="analysis-feedback-overlay" :class="{ 'is-active': microFeedback }">
        <div class="analysis-feedback-overlay__content">{{ microFeedback }}</div>
      </div>

      <div class="analysis-body">
        <div v-if="stage === 'start'" class="analysis-start">
          <h2 class="analysis-headline">{{ props.headline }}</h2>
          <p class="analysis-subline">{{ props.subline }}</p>
          <button class="analysis-primary" type="button" @click="start">
            {{ props.startCta }}
          </button>
        </div>

        <div v-else-if="stage === 'step'" class="analysis-step">
          <h3 class="analysis-question">{{ currentStepData.question }}</h3>

          <div v-if="currentStepData.type === 'choice'" class="analysis-options">
            <button
              v-for="option in currentStepData.options"
              :key="option"
              type="button"
              class="analysis-option"
              :class="{ 'is-selected': answers[currentStepData.key] === option }"
              @click="selectOption(option)"
            >
              {{ option }}
            </button>
          </div>

          <div
            v-if="currentStepData.id === 'movement' && answers.movement === 'Ich will gerade erst starten'"
            class="analysis-followup"
          >
            <p class="analysis-followup__question">Hast du bereits Equipment?</p>
            <div class="analysis-followup__options">
              <button
                type="button"
                class="analysis-option"
                :class="{ 'is-selected': answers.equipment === 'Ja' }"
                @click="selectEquipment('Ja')"
              >
                Ja
              </button>
              <button
                type="button"
                class="analysis-option"
                :class="{ 'is-selected': answers.equipment === 'Nein' }"
                @click="selectEquipment('Nein')"
              >
                Nein
              </button>
            </div>
          </div>

          <div v-else-if="currentStepData.type === 'slider'" class="analysis-slider">
            <InvestmentSlider
              v-model="answers[currentStepData.key]"
              :min="sliderScale.min"
              :max="sliderScale.max"
              :step="sliderScale.step"
            />
          </div>

          <div class="analysis-nav">
            <button class="analysis-secondary" type="button" @click="prev" :disabled="currentStep === 0">
              Zurück
            </button>
            <button
              v-if="currentStepData.type === 'slider'"
              class="analysis-primary"
              type="button"
              @click="nextFromSlider"
              :disabled="!canProceedSlider"
            >
              Weiter
            </button>
          </div>
        </div>

        <div v-else-if="stage === 'loading'" class="analysis-loading">
          <div class="analysis-spinner"></div>
          <p>Wir prüfen dein Profil und erstellen einen Vorschlag für deinen Trainingsstart.</p>
        </div>

        <div v-else class="analysis-result">
          <h3 class="analysis-question">So könnte dein Trainingsstart aussehen</h3>
          <div class="analysis-week">
            <div>
              <strong>Woche 1</strong>
              <ul>
                <li>X Ausdauereinheiten</li>
                <li>X Hybrid-Krafteinheiten</li>
                <li>Fokus: Stabilität & Grundspannung</li>
              </ul>
            </div>
            <div>
              <strong>Woche 2</strong>
              <ul>
                <li>Progression</li>
                <li>Anpassung Widerstand</li>
                <li>Belastungssteuerung</li>
              </ul>
            </div>
          </div>
          <p class="analysis-note">
            Basierend auf deinem Profil entwickeln wir daraus dein individuelles 12-Wochen-Protokoll mit
            klarer Progression, Meilensteinen und Deload.
          </p>

          <div class="analysis-summary">
            <div v-for="item in summaryItems" :key="item.label" class="analysis-summary__item">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>

          <div class="analysis-pricing">
            <div>
              <span>Regulärer Preis</span>
              <strong>{{ formattedRegularPrice }}</strong>
            </div>
            <div>
              <span>Hybrid-Integrationsvorteil</span>
              <strong>-{{ formattedDiscount }}</strong>
            </div>
            <div class="analysis-pricing__total">
              <span>Dein Einstiegspreis</span>
              <strong>{{ formattedEntryPrice }}</strong>
            </div>
          </div>

          <div class="analysis-cta">
            <button class="analysis-primary analysis-primary--full" type="button" @click="emit('cta')">
              {{ props.primaryCta }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analysis-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-background-dark) 70%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--z-sticky) + 100);
  padding: var(--spacing-2xl);
}

.analysis-inline {
  width: 100%;
}

.analysis-card {
  width: 100%;
  max-width: var(--container-max-width);
  min-height: 72vh;
  max-height: 90vh;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: var(--radius-2xl);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 12%, transparent);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2xl);
  position: relative;
  display: flex;
  flex-direction: column;
}

.analysis-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 18%, transparent);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  line-height: 1;
}

.analysis-progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: 1rem;
  margin-bottom: var(--spacing-lg);
}

.analysis-progress__bar {
  height: var(--spacing-xs);
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  position: relative;
  overflow: hidden;
}

.analysis-progress__bar::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 0;
  background: var(--color-brand-accent);
  border-radius: inherit;
  transition: width var(--transition-normal);
}

.progress-step-0::after { width: 0%; }
.progress-step-1::after { width: 16.66%; }
.progress-step-2::after { width: 33.33%; }
.progress-step-3::after { width: 50%; }
.progress-step-4::after { width: 66.66%; }
.progress-step-5::after { width: 83.33%; }
.progress-step-6::after { width: 100%; }

.analysis-progress__meta {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--color-text-secondary);
}

.analysis-status {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
}

.analysis-feedback-overlay {
  position: absolute;
  inset: var(--spacing-2xl);
  border-radius: var(--radius-2xl);
  background: color-mix(in srgb, var(--color-background) 88%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
  z-index: 2;
  text-align: center;
}

.analysis-feedback-overlay.is-active {
  opacity: 1;
}

.analysis-feedback-overlay__content {
  font-family: var(--font-family-heading);
  font-size: clamp(1.4rem, 2.6vw, 2.2rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.analysis-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 52vh;
  overflow: auto;
  padding-right: var(--spacing-xs);
}

.analysis-start,
.analysis-step,
.analysis-loading,
.analysis-result {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.analysis-headline {
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 3.6vw, 2.8rem);
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
}

.analysis-subline {
  white-space: pre-line;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xl);
}

.analysis-primary,
.analysis-secondary {
  border-radius: var(--radius-full);
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border: calc(var(--spacing-xs) / 4) solid transparent;
}

.analysis-primary {
  background: var(--color-brand-accent);
  color: var(--color-text-light);
  box-shadow: 0 var(--spacing-md) var(--spacing-lg)
    color-mix(in srgb, var(--color-brand-accent) 30%, transparent);
}

.analysis-secondary {
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-color: color-mix(in srgb, var(--color-text-primary) 16%, transparent);
}

.analysis-question {
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
}

.analysis-options {
  display: grid;
  gap: var(--spacing-md);
}

.analysis-followup {
  margin-top: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.analysis-followup__question {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.analysis-followup__options {
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.analysis-option {
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 14%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  background: var(--color-background);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.analysis-option.is-selected {
  border-color: var(--color-brand-accent);
  background: color-mix(in srgb, var(--color-brand-accent) 10%, transparent);
}

.analysis-slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.analysis-slider__input {
  width: 100%;
}

.analysis-slider__labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.analysis-slider__value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.analysis-nav {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.analysis-nav button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.analysis-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
}

.analysis-spinner {
  width: var(--spacing-3xl);
  height: var(--spacing-3xl);
  border-radius: var(--radius-full);
  border: calc(var(--spacing-xs) / 2) solid
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  border-top-color: var(--color-brand-accent);
  animation: spin 1s linear infinite;
}

.analysis-result {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.analysis-week {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing-4xl) * 2.5), 1fr));
  background: color-mix(in srgb, var(--color-brand-secondary) 6%, transparent);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
}

.analysis-week ul {
  margin: var(--spacing-sm) 0 0;
  padding-left: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.analysis-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.analysis-summary {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing-4xl) * 2), 1fr));
}

.analysis-summary__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: var(--color-background);
}

.analysis-pricing {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--color-brand-secondary) 8%, transparent);
}

.analysis-pricing__total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.analysis-cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.analysis-primary--full {
  width: 100%;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 40rem) {
  .analysis-card {
    padding: var(--spacing-xl);
  }

  .analysis-nav {
    flex-direction: column;
  }
}
</style>
