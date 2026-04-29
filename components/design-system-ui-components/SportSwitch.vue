<script setup lang="ts">
/**
 * SportSwitch — kanonische Audience-Selection-Komponente
 *
 * Verwaltet den Runner/Cyclist-State intern via useSportMode (global useState).
 * Kein v-model nötig — Änderungen propagieren automatisch an alle Stellen,
 * die useSportMode konsumieren.
 *
 * Varianten:
 *   toggle  → Sliding-Bubble im Header-Stil (GSAP-animiert)
 *   pills   → Pill-Buttons auf dunklem Hintergrund (Hero, Banner)
 */
import { gsap } from 'gsap'
import type { SportMode } from '~/composables/useSportMode'

type Variant = 'toggle' | 'pills'

const props = withDefaults(
  defineProps<{ variant?: Variant }>(),
  { variant: 'toggle' },
)

const { sportMode, setSportMode, toggleSportMode } = useSportMode()

// ── Toggle variant refs & animation ─────────────────────────────────────────

const trackRef    = ref<HTMLElement | null>(null)
const bubbleRef   = ref<HTMLElement | null>(null)
const runnerRef   = ref<HTMLElement | null>(null)
const cyclistRef  = ref<HTMLElement | null>(null)

let bubbleOffset  = 0
let isAnimating   = false
let isLocalChange = false

const getBubbleX = (mode: SportMode | null) =>
  mode === 'cyclist' ? bubbleOffset : 0

const animateFromNull = (toMode: SportMode) => {
  const toSlot    = toMode === 'runner' ? runnerRef.value : cyclistRef.value
  const bubble    = bubbleRef.value
  if (!toSlot || !bubble) return

  const direction = toMode === 'cyclist' ? 1 : -1
  gsap.timeline({ onComplete: () => { isAnimating = false } })
    .fromTo(bubble,
      { autoAlpha: 0, x: getBubbleX(toMode) },
      { autoAlpha: 1, duration: 0.28, ease: 'power2.out' }, 0)
    .fromTo(toSlot,
      { x: direction * -8, opacity: 0, scale: 0.55 },
      { x: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(2.2)' }, 0.06)
}

const animateTransition = (fromMode: SportMode | null, toMode: SportMode) => {
  if (fromMode === null) { animateFromNull(toMode); return }

  const fromSlot  = fromMode === 'runner' ? runnerRef.value : cyclistRef.value
  const toSlot    = toMode  === 'runner' ? runnerRef.value : cyclistRef.value
  const bubble    = bubbleRef.value
  if (!fromSlot || !toSlot || !bubble) return

  const direction = toMode === 'cyclist' ? 1 : -1
  gsap.timeline({ onComplete: () => { isAnimating = false } })
    .to(bubble, { x: getBubbleX(toMode), duration: 0.42, ease: 'power3.inOut' }, 0)
    .to(fromSlot, { x: direction * 6, opacity: 0, scale: 0.55, duration: 0.18, ease: 'power2.in' }, 0)
    .fromTo(toSlot,
      { x: direction * -8, opacity: 0, scale: 0.55 },
      { x: 0, opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(2.2)' }, 0.12)
}

const handleToggleClick = () => {
  if (isAnimating) return
  isAnimating = true
  isLocalChange = true
  const prev = sportMode.value
  toggleSportMode()
  animateTransition(prev, sportMode.value as SportMode)
}

// React to external state changes (e.g. IntroHeroSection sets mode directly)
watch(sportMode, (newMode, oldMode) => {
  if (props.variant !== 'toggle') return
  if (isLocalChange) { isLocalChange = false; return }
  if (!newMode) return
  isAnimating = true
  animateTransition(oldMode, newMode)
})

onMounted(() => {
  if (props.variant !== 'toggle') return
  if (!process.client) return

  const bubble   = bubbleRef.value
  const runnerEl = runnerRef.value
  const cyclistEl = cyclistRef.value
  if (!bubble || !runnerEl || !cyclistEl) return

  bubbleOffset = cyclistEl.getBoundingClientRect().left - runnerEl.getBoundingClientRect().left

  if (sportMode.value === null) {
    gsap.set(bubble, { autoAlpha: 0, x: 0 })
    gsap.set([runnerEl, cyclistEl], { opacity: 0.5 })
  } else {
    gsap.set(bubble, { autoAlpha: 1, x: getBubbleX(sportMode.value) })
    const inactive = sportMode.value === 'runner' ? cyclistEl : runnerEl
    gsap.set(inactive, { opacity: 0.55 })
  }
})

// ── Pills variant ────────────────────────────────────────────────────────────

const pillOptions = [
  { label: 'Team Hybrid Runners', short: 'Läufer', value: 'runner' as SportMode },
  { label: 'Team Hybrid Cycling', short: 'Radfahrer', value: 'cyclist' as SportMode },
]
</script>

<template>
  <!-- ── Toggle ─────────────────────────────────────────────────────────── -->
  <button
    v-if="props.variant === 'toggle'"
    class="ss-toggle"
    role="switch"
    :aria-checked="sportMode === 'cyclist'"
    :aria-label="sportMode === 'runner' ? 'Zu Radfahrer wechseln' : 'Zu Läufer wechseln'"
    @click="handleToggleClick"
  >
    <span ref="trackRef" class="ss-toggle__track">
      <span ref="bubbleRef" class="ss-toggle__bubble" aria-hidden="true" />

      <!-- Runner — always left -->
      <span ref="runnerRef" class="ss-toggle__slot" aria-hidden="true">
        <svg class="ss-toggle__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
        </svg>
      </span>

      <!-- Cyclist — always right -->
      <span ref="cyclistRef" class="ss-toggle__slot" aria-hidden="true">
        <svg class="ss-toggle__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10 2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.8zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
        </svg>
      </span>
    </span>
  </button>

  <!-- ── Pills ──────────────────────────────────────────────────────────── -->
  <div
    v-else-if="props.variant === 'pills'"
    class="ss-pills"
    role="radiogroup"
    aria-label="Sportart wählen"
  >
    <button
      v-for="opt in pillOptions"
      :key="opt.value"
      type="button"
      class="ss-pills__option"
      :class="{ 'ss-pills__option--active': sportMode === opt.value }"
      :aria-checked="sportMode === opt.value"
      role="radio"
      @click="setSportMode(opt.value)"
    >
      <span class="ss-pills__label-full">{{ opt.label }}</span>
      <span class="ss-pills__label-short" aria-hidden="true">{{ opt.short }}</span>
    </button>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   Toggle variant
═══════════════════════════════════════════════════════════ */
.ss-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.ss-toggle:focus-visible .ss-toggle__track {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 2px;
}

.ss-toggle__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: 2.375rem;
  padding: 0.1875rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-brand-dark) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.ss-toggle:hover .ss-toggle__track {
  background: color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
}

.ss-toggle__bubble {
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
  width: calc(50% - 0.1875rem);
  height: calc(100% - 0.375rem);
  border-radius: var(--radius-full);
  background: var(--color-background, #fff);
  box-shadow:
    0 1px 3px color-mix(in srgb, var(--color-brand-dark) 12%, transparent),
    0 2px 8px color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
  pointer-events: none;
  will-change: transform;
}

.ss-toggle__slot {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  will-change: transform, opacity;
}

.ss-toggle__icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-brand-dark);
  display: block;
}

/* ═══════════════════════════════════════════════════════════
   Pills variant
═══════════════════════════════════════════════════════════ */
.ss-pills {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ss-pills__option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid color-mix(in srgb, var(--color-text-light) 16%, transparent);
  border-radius: var(--radius-full);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-text-light) 18%, transparent) 0%, transparent 100%),
    color-mix(in srgb, var(--color-text-light) 7%, transparent);
  color: color-mix(in srgb, var(--color-text-light) 88%, transparent);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
  backdrop-filter: blur(18px) saturate(145%);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--color-text-light) 20%, transparent),
    0 0.5rem 1rem color-mix(in srgb, black 12%, transparent);
  transition: background var(--transition-fast), color var(--transition-fast),
    transform var(--transition-fast), box-shadow var(--transition-fast);
  cursor: pointer;
}

.ss-pills__option:hover {
  color: var(--color-text-light);
  transform: translateY(-1px);
}

.ss-pills__option--active {
  background:
    linear-gradient(180deg,
      color-mix(in srgb, var(--color-text-light) 95%, transparent) 0%,
      color-mix(in srgb, var(--color-background-secondary) 88%, transparent) 100%);
  color: var(--color-brand-dark);
  box-shadow:
    0 0.75rem 1.25rem color-mix(in srgb, black 14%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--color-text-light) 82%, transparent);
}

/* Short label hidden on desktop, full label hidden on mobile */
.ss-pills__label-short { display: none; }

@media (max-width: 640px) {
  .ss-pills {
    width: 100%;
  }

  .ss-pills__option {
    flex: 1 1 calc(50% - 0.25rem);
  }

  .ss-pills__label-full  { display: none; }
  .ss-pills__label-short { display: inline; }
}
</style>
