<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { gsap } from "gsap"

type Milestone = {
  value: number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: number
    min: number
    max: number
    step: number
    sportType?: "gravel" | "road" | "run" | "hybrid" | "outdoor" | "starter"
    milestones?: Milestone[]
  }>(),
  {
    sportType: undefined,
    milestones: undefined,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void
}>()

const value = ref(props.modelValue)
const previousValue = ref(props.modelValue)
const digitRefs = ref<HTMLElement[]>([])
let rafId: number | null = null
let pendingValue = props.modelValue

const formattedValue = computed(() => formatCurrency(value.value))
const displayChars = computed(() => formattedValue.value.split(""))

const fillPercent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((value.value - props.min) / range) * 100))
})

const microcopy = computed(() => {
  const amount = value.value
  if (amount <= 300) return "Solider Start. Struktur macht jetzt den Unterschied."
  if (amount <= 1200) return "Gutes Setup. Kraftintegration bringt Stabilität rein."
  if (amount <= 3000) return "Ambitioniert. Jetzt lohnt sich ein klares Protokoll."
  if (amount <= 6000) return "Hochwertiges Setup. Die Integration entscheidet."
  return "Performance-Niveau. Struktur schlägt Zufall."
})

const effectiveMilestones = computed<Milestone[]>(() => {
  if (props.milestones?.length) return props.milestones
  if (props.max >= 10000) {
    return [
      { value: 1000, label: "Basis-Setup" },
      { value: 3000, label: "Solide Basis" },
      { value: 4500, label: "Ambitioniert" },
      { value: 7500, label: "Performance" },
      { value: 10000, label: "Wettkampf-Level" },
    ]
  }
  return [
    { value: 50, label: "Einsteiger-Setup" },
    { value: 250, label: "Solide Basis" },
    { value: 400, label: "Ambitioniert" },
    { value: 700, label: "Performance" },
    { value: 1000, label: "High-End" },
  ]
})

const milestonePositions = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return []
  return effectiveMilestones.value.map((milestone) => {
    const clamped = Math.min(props.max, Math.max(props.min, milestone.value))
    return {
      ...milestone,
      percent: ((clamped - props.min) / range) * 100,
      active: value.value >= clamped,
    }
  })
})

function setDigitRef(el: Element | null, index: number) {
  if (!el) return
  digitRefs.value[index] = el as HTMLElement
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function animateDigits(nextValue: number, prevValue: number) {
  const direction = nextValue >= prevValue ? -1 : 1
  displayChars.value.forEach((char, index) => {
    if (!/\d/.test(char)) return
    const digit = Number(char)
    const el = digitRefs.value[index]
    if (!el) return
    const offset = digit * 100
    gsap.to(el, {
      yPercent: direction === -1 ? -offset : -offset,
      duration: 0.3,
      ease: "power2.out",
    })
  })
}

watch(
  () => props.modelValue,
  (next) => {
    value.value = next
  },
)

watch(
  () => value.value,
  async (next) => {
    emit("update:modelValue", next)
    await nextTick()
    animateDigits(next, previousValue.value)
    previousValue.value = next
  },
)

onMounted(async () => {
  await nextTick()
  animateDigits(value.value, value.value)
})

function onInput(event: Event) {
  pendingValue = Number((event.target as HTMLInputElement).value)
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    value.value = pendingValue
    rafId = null
  })
}
</script>

<template>
  <div class="investment-slider">
    <div class="investment-display" aria-live="polite">
      <div class="investment-odometer" aria-label="Ausrüstungs-Investment in Euro">
        <span
          v-for="(char, index) in displayChars"
          :key="`char-${index}-${char}`"
          class="investment-char"
          :class="{ 'is-digit': /\d/.test(char) }"
        >
          <span v-if="/\d/.test(char)" class="digit-window">
            <span class="digit-stack" :ref="(el) => setDigitRef(el, index)">
              <span v-for="digit in 10" :key="digit" class="digit">{{ digit - 1 }}</span>
            </span>
          </span>
          <span v-else class="static-char">{{ char }}</span>
        </span>
      </div>
      <div class="investment-label">Dein Ausrüstungs-Investment</div>
    </div>

    <div class="investment-track">
      <input
        class="investment-range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        aria-label="Ausrüstungs-Investment in Euro"
        :style="{ '--fill': `${fillPercent}%` }"
        @input="onInput"
      />
      <div class="investment-milestones">
        <button
          v-for="(milestone, index) in milestonePositions"
          :key="milestone.value"
          type="button"
          class="milestone"
          :class="{
            'is-active': milestone.active,
            'is-first': index === 0,
            'is-last': index === milestonePositions.length - 1,
          }"
          :style="{ left: `${milestone.percent}%` }"
          @click="value = milestone.value"
        >
          {{ milestone.label }}
        </button>
      </div>
    </div>

    <div class="investment-meta">
      <span class="investment-min">{{ formatCurrency(min) }}</span>
      <span class="investment-max">{{ formatCurrency(max) }}+</span>
    </div>

    <p class="investment-microcopy">{{ microcopy }}</p>
  </div>
</template>

<style scoped>
.investment-slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.investment-display {
  min-height: calc(var(--spacing-4xl) * 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.investment-odometer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-heading);
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.investment-char {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0.6em;
}

.digit-window {
  height: 1.1em;
  overflow: hidden;
  display: inline-flex;
}

.digit-stack {
  display: flex;
  flex-direction: column;
  transform: translateY(0);
}

.digit {
  height: 1.1em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-char {
  padding: 0 0.05em;
}

.investment-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.investment-track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.investment-range {
  width: 100%;
  appearance: none;
  height: var(--spacing-sm);
  border-radius: var(--radius-full);
  background: linear-gradient(
      90deg,
      var(--color-brand-dark) 0%,
      var(--color-brand-accent) 100%
    )
    left / var(--fill) 100% no-repeat,
    color-mix(in srgb, var(--color-text-primary) 10%, transparent);
}

.investment-range::-webkit-slider-thumb {
  appearance: none;
  width: calc(var(--spacing-xl) * 1.05);
  height: calc(var(--spacing-xl) * 1.05);
  border-radius: var(--radius-full);
  background: var(--color-background);
  border: calc(var(--spacing-xs) / 2) solid var(--color-brand-accent);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-brand-accent) 30%, transparent);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.investment-range::-moz-range-thumb {
  width: calc(var(--spacing-xl) * 1.05);
  height: calc(var(--spacing-xl) * 1.05);
  border-radius: var(--radius-full);
  background: var(--color-background);
  border: calc(var(--spacing-xs) / 2) solid var(--color-brand-accent);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-brand-accent) 30%, transparent);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.investment-range:active::-webkit-slider-thumb,
.investment-range:active::-moz-range-thumb {
  transform: scale(1.08);
  box-shadow: 0 0 0 var(--spacing-sm) color-mix(in srgb, var(--color-brand-accent) 20%, transparent);
}

.investment-range:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-brand-accent) 60%, transparent);
  outline-offset: 4px;
}

.investment-milestones {
  position: relative;
  height: calc(var(--spacing-4xl) * 0.8);
  pointer-events: none;
}

.milestone {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  border: calc(var(--spacing-xs) / 4) solid
    color-mix(in srgb, var(--color-text-primary) 18%, transparent);
  background: var(--color-background);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-sm);
  pointer-events: auto;
}

.milestone.is-first {
  left: 0 !important;
  transform: translateX(0);
}

.milestone.is-last {
  left: 100% !important;
  transform: translateX(-100%);
}

.milestone.is-active {
  border-color: var(--color-brand-accent);
  color: var(--color-text-primary);
}

.investment-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.investment-microcopy {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
