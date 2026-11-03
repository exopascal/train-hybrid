<script setup lang="ts">
import { computed, ref } from 'vue'
import { QUESTIONS, TYPEN, computeResult, type StressTypId } from '~/data/stresstyp'

type Stage = 'intro' | 'quiz' | 'email' | 'done'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOTAL = QUESTIONS.length

const stage = ref<Stage>('intro')
const currentQ = ref(0)
const answers = ref<Record<string, StressTypId>>({})
const feedback = ref('')
const email = ref('')
const consent = ref(false)
const busy = ref(false)
const emailError = ref('')
let advanceTimer: ReturnType<typeof setTimeout> | null = null

const question = computed(() => QUESTIONS[currentQ.value]!)
const result = computed(() => computeResult(answers.value))
const typ = computed(() => TYPEN[result.value])
const progressPct = computed(() => {
  if (stage.value === 'intro') return 0
  if (stage.value === 'email' || stage.value === 'done') return 100
  return Math.round((currentQ.value / TOTAL) * 100)
})

function select(type: StressTypId) {
  if (advanceTimer) return
  answers.value[question.value.id] = type
  feedback.value = TYPEN[type].name
  advanceTimer = setTimeout(() => {
    feedback.value = ''
    advanceTimer = null
    if (currentQ.value < TOTAL - 1) {
      currentQ.value++
    } else {
      stage.value = 'email'
    }
  }, 900)
}

function back() {
  if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; feedback.value = '' }
  if (stage.value === 'email') { stage.value = 'quiz'; return }
  if (stage.value === 'quiz' && currentQ.value > 0) { currentQ.value--; return }
  if (stage.value === 'quiz') stage.value = 'intro'
}

async function submit() {
  emailError.value = ''
  if (!EMAIL_RE.test(email.value.trim())) {
    emailError.value = 'Bitte gib eine gültige E-Mail-Adresse ein.'
    return
  }
  if (!consent.value) {
    emailError.value = 'Bitte stimme zu, um dein Ergebnis zu erhalten.'
    return
  }
  busy.value = true
  try {
    await $fetch('/api/stresstyp', {
      method: 'POST',
      body: { email: email.value.trim(), result: result.value, answers: answers.value },
    })
  } catch { /* show done regardless */ }
  busy.value = false
  stage.value = 'done'
}
</script>

<template>
  <div class="st-wrap">
    <div class="st-card">

      <!-- Progress bar -->
      <div v-if="stage !== 'intro'" class="st-progress">
        <div class="st-progress__bar">
          <div class="st-progress__fill" :style="{ width: progressPct + '%' }"></div>
        </div>
        <span v-if="stage === 'quiz'" class="st-progress__label">
          Frage {{ currentQ + 1 }} von {{ TOTAL }}
        </span>
        <span v-else class="st-progress__label">Fast fertig</span>
      </div>

      <!-- Feedback flash -->
      <Transition name="st-flash">
        <div v-if="feedback" class="st-flash">{{ feedback }}</div>
      </Transition>

      <!-- INTRO -->
      <div v-if="stage === 'intro'" class="st-body st-body--center">
        <p class="st-eyebrow">Kostenloser Quiz</p>
        <h1 class="st-title">Welcher Stresstyp bist du?</h1>
        <p class="st-lead">6 Fragen. Dein persönliches Ergebnis kommt direkt per Mail.</p>
        <button class="btn-main" type="button" @click="stage = 'quiz'">
          Quiz starten
        </button>
      </div>

      <!-- QUIZ -->
      <div v-else-if="stage === 'quiz'" class="st-body">
        <Transition name="st-slide" mode="out-in">
          <div :key="question.id" class="st-question">
            <h2 class="st-question__text">{{ question.text }}</h2>
            <div class="st-options">
              <button
                v-for="opt in question.options"
                :key="opt.type"
                type="button"
                class="st-option"
                :class="{ 'is-selected': answers[question.id] === opt.type }"
                @click="select(opt.type)"
              >
                {{ opt.text }}
              </button>
            </div>
          </div>
        </Transition>
        <button class="st-back" type="button" @click="back">← Zurück</button>
      </div>

      <!-- EMAIL -->
      <div v-else-if="stage === 'email'" class="st-body">
        <div class="st-result-teaser">
          <p class="st-eyebrow">Dein Ergebnis</p>
          <h2 class="st-title">{{ typ.name }}</h2>
          <p class="st-lead">{{ typ.subtitle }}</p>
        </div>
        <div class="st-email-form">
          <label class="st-label" for="st-email">
            Wo sollen wir dein vollständiges Ergebnis hinschicken?
          </label>
          <input
            id="st-email"
            v-model="email"
            class="st-field"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="deine@email.de"
            @keydown.enter="submit"
          />
          <label class="st-consent">
            <input v-model="consent" type="checkbox" />
            <span>
              Ich stimme zu, dass Train Hybrid mir mein Ergebnis und passende Inhalte per Mail schickt.
              Abmeldung jederzeit möglich.
            </span>
          </label>
          <p v-if="emailError" class="st-error">{{ emailError }}</p>
          <button class="btn-main" type="button" :disabled="busy" @click="submit">
            {{ busy ? 'Wird gesendet…' : 'Ergebnis per Mail erhalten' }}
          </button>
        </div>
        <button class="st-back" type="button" @click="back">← Zurück</button>
      </div>

      <!-- DONE -->
      <div v-else class="st-body st-body--center">
        <div class="st-done-icon">✓</div>
        <h2 class="st-title">Dein Ergebnis ist unterwegs.</h2>
        <p class="st-lead">
          Schau in dein Postfach – wir haben dir alles über deinen Stresstyp und was dir wirklich helfen würde geschickt.
        </p>
        <p class="st-muted">Nicht gefunden? Schau kurz im Spam-Ordner nach.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.st-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-comfortable) var(--spacing-standard);
  background: var(--color-background-secondary);
}

.st-card {
  width: 100%;
  max-width: 640px;
  background: var(--color-background);
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 8%, transparent);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-spacious);
  position: relative;
  overflow: hidden;
}

.st-progress {
  margin-bottom: var(--spacing-comfortable);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-narrow);
}

.st-progress__bar {
  height: 4px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  overflow: hidden;
}

.st-progress__fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: var(--color-brand-accent);
  transition: width 400ms var(--ease-default);
}

.st-progress__label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.st-flash {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--color-background) 92%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-brand-accent);
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.st-flash-enter-active,
.st-flash-leave-active {
  transition: opacity 200ms ease;
}
.st-flash-enter-from,
.st-flash-leave-to {
  opacity: 0;
}

.st-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-standard);
  min-height: 360px;
}

.st-body--center {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.st-eyebrow {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-brand-accent);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.st-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin: 0;
}

.st-lead {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
  max-width: 48ch;
}

.st-question {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-standard);
}

.st-question__text {
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2.8vw, 1.4rem);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin: 0;
}

.st-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-cozy);
}

.st-option {
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 12%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--spacing-cozy) var(--spacing-standard);
  text-align: left;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  line-height: var(--line-height-relaxed);
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease, transform 120ms ease;
}

.st-option:hover {
  border-color: var(--color-brand-accent);
  background: color-mix(in srgb, var(--color-brand-accent) 5%, transparent);
}

.st-option.is-selected {
  border-color: var(--color-brand-accent);
  background: color-mix(in srgb, var(--color-brand-accent) 10%, transparent);
}

.st-option:active {
  transform: scale(0.98);
}

.st-back {
  background: none;
  border: none;
  padding: 0;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  align-self: flex-start;
  transition: color 150ms ease;
}

.st-back:hover {
  color: var(--color-text-secondary);
}

.st-result-teaser {
  padding: var(--spacing-standard);
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--color-brand-accent) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 20%, transparent);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-narrow);
}

.st-email-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-standard);
}

.st-label {
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.st-field {
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 18%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--spacing-cozy) var(--spacing-standard);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-background);
  width: 100%;
  outline: none;
  transition: border-color 150ms ease;
}

.st-field:focus {
  border-color: var(--color-brand-accent);
}

.st-consent {
  display: flex;
  gap: var(--spacing-cozy);
  align-items: flex-start;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  cursor: pointer;
}

.st-consent input {
  flex-shrink: 0;
  margin-top: 3px;
  accent-color: var(--color-brand-accent);
}

.st-error {
  font-size: var(--text-sm);
  color: var(--color-error);
  margin: 0;
}

.st-done-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
  color: var(--color-success);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.st-muted {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* Question slide transition */
.st-slide-enter-active,
.st-slide-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.st-slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.st-slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

@media (max-width: 480px) {
  .st-card {
    padding: var(--spacing-comfortable);
    border-radius: var(--radius-xl);
  }

  .st-wrap {
    padding: var(--spacing-standard) var(--spacing-cozy);
    align-items: flex-start;
    padding-top: var(--spacing-comfortable);
  }
}
</style>
