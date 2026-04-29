<template>
  <button
    class="sport-toggle"
    role="switch"
    :aria-checked="sportMode === 'cyclist'"
    :aria-label="sportMode === 'runner' ? 'Zu Radfahrer wechseln' : 'Zu Läufer wechseln'"
    @click="handleToggle"
  >
    <span ref="trackRef" class="sport-toggle__track">
      <span ref="bubbleRef" class="sport-toggle__bubble" aria-hidden="true" />

      <!-- Runner slot -->
      <span ref="runnerSlotRef" class="sport-toggle__slot" aria-hidden="true">
        <svg
          class="sport-toggle__icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"
          />
        </svg>
      </span>

      <!-- Cyclist slot -->
      <span ref="cyclistSlotRef" class="sport-toggle__slot" aria-hidden="true">
        <svg
          class="sport-toggle__icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10 2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.8zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"
          />
        </svg>
      </span>
    </span>

    <!--
      LOTTIE INTEGRATION POINT
      Wenn du deine "Läufer wird Radfahrer"-Animation hast:
      1. yarn add lottie-web
      2. Lottie JSON nach /public/animations/sport-switch.json
      3. Den ref="lottieContainerRef" Block hier einkommentieren
      4. onMounted: lottieInstance = lottie.loadAnimation({ container: lottieContainerRef, ... })
      5. handleToggle: lottieInstance.setDirection(sportMode === 'cyclist' ? 1 : -1); lottieInstance.play()

      <span ref="lottieContainerRef" class="sport-toggle__lottie" aria-hidden="true" />
    -->
  </button>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { useSportMode, type SportMode } from '~/composables/useSportMode'

const { sportMode, toggleSportMode } = useSportMode()

const trackRef = ref<HTMLElement | null>(null)
const bubbleRef = ref<HTMLElement | null>(null)
const runnerSlotRef = ref<HTMLElement | null>(null)
const cyclistSlotRef = ref<HTMLElement | null>(null)

let bubbleOffset = 0
let isAnimating = false
let isLocalChange = false

const getBubbleXForMode = (mode: SportMode | null) =>
  mode === 'cyclist' ? bubbleOffset : 0

const animateFromNull = (toMode: SportMode) => {
  const toSlot = toMode === 'runner' ? runnerSlotRef.value : cyclistSlotRef.value
  const bubble = bubbleRef.value
  if (!toSlot || !bubble) return

  const direction = toMode === 'cyclist' ? 1 : -1
  const tl = gsap.timeline({ onComplete: () => { isAnimating = false } })

  // Bubble fades in at the target position
  tl.fromTo(bubble,
    { autoAlpha: 0, x: getBubbleXForMode(toMode) },
    { autoAlpha: 1, duration: 0.28, ease: 'power2.out' },
    0,
  )

  // New icon bounces in
  tl.fromTo(
    toSlot,
    { x: direction * -8, opacity: 0, scale: 0.55 },
    { x: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(2.2)' },
    0.06,
  )
}

const animateTransition = (fromMode: SportMode | null, toMode: SportMode) => {
  if (fromMode === null) {
    animateFromNull(toMode)
    return
  }

  const fromSlot = fromMode === 'runner' ? runnerSlotRef.value : cyclistSlotRef.value
  const toSlot = toMode === 'runner' ? runnerSlotRef.value : cyclistSlotRef.value
  const bubble = bubbleRef.value
  if (!fromSlot || !toSlot || !bubble) return

  const direction = toMode === 'cyclist' ? 1 : -1
  const tl = gsap.timeline({ onComplete: () => { isAnimating = false } })

  tl.to(bubble, {
    x: getBubbleXForMode(toMode),
    duration: 0.42,
    ease: 'power3.inOut',
  }, 0)

  tl.to(fromSlot, {
    x: direction * 6,
    opacity: 0,
    scale: 0.55,
    duration: 0.18,
    ease: 'power2.in',
  }, 0)

  tl.fromTo(
    toSlot,
    { x: direction * -8, opacity: 0, scale: 0.55 },
    { x: 0, opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(2.2)' },
    0.12,
  )
}

const handleToggle = () => {
  if (isAnimating) return
  isAnimating = true
  isLocalChange = true

  const prevMode = sportMode.value
  toggleSportMode()
  animateTransition(prevMode, sportMode.value as SportMode)
}

watch(sportMode, (newMode, oldMode) => {
  if (isLocalChange) {
    isLocalChange = false
    return
  }
  if (!newMode) return
  isAnimating = true
  animateTransition(oldMode, newMode)
})

onMounted(() => {
  if (!process.client) return

  const runnerEl = runnerSlotRef.value
  const cyclistEl = cyclistSlotRef.value
  const bubbleEl = bubbleRef.value
  if (!runnerEl || !cyclistEl || !bubbleEl) return

  bubbleOffset = cyclistEl.getBoundingClientRect().left - runnerEl.getBoundingClientRect().left

  if (sportMode.value === null) {
    // No selection yet: hide bubble, both icons at half opacity
    gsap.set(bubbleEl, { autoAlpha: 0, x: 0 })
    gsap.set([runnerEl, cyclistEl], { opacity: 0.5 })
  } else {
    gsap.set(bubbleEl, { autoAlpha: 1, x: getBubbleXForMode(sportMode.value) })
    const inactiveSlot = sportMode.value === 'runner' ? cyclistEl : runnerEl
    gsap.set(inactiveSlot, { opacity: 0.55 })
  }
})
</script>

<style scoped>
.sport-toggle {
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

.sport-toggle:focus-visible .sport-toggle__track {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 2px;
}

.sport-toggle__track {
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

.is-scrolled .sport-toggle__track {
  background: color-mix(in srgb, var(--color-brand-dark) 5%, transparent);
}

.sport-toggle:hover .sport-toggle__track {
  background: color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
}

.sport-toggle__bubble {
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

.sport-toggle__slot {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  will-change: transform, opacity;
}

.sport-toggle__icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-brand-dark);
  display: block;
}

/* Lottie overlay (once you have the animation file) */
.sport-toggle__lottie {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  width: 5rem;
  height: 5rem;
  pointer-events: none;
  opacity: 0;
}
</style>
