<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'
import SportSwitch from '~/components/design-system-ui-components/SportSwitch.vue'

type IntroVariant = 'a' | 'b'

const VARIANT_STORAGE_KEY = 'train-hybrid-home-intro-variant'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    headlineStart?: string
    headlineAccent?: string
    subhead?: string
    variant?: IntroVariant
  }>(),
  {
    eyebrow: 'Krafttraining fuer Ausdauersportler',
    headlineStart: 'Mach dein Ausdauertraining',
    headlineAccent: 'kraftvoller.',
    subhead: 'Train Hybrid integriert Krafttraining systematisch in deine Ausdauerroutine.',
    variant: 'a',
  },
)

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const textBlockRef = ref<HTMLElement | null>(null)
const audienceRef = ref<HTMLElement | null>(null)
const audienceInnerRef = ref<HTMLElement | null>(null)
const marqueeTopRef = ref<HTMLElement | null>(null)
const marqueeBottomRef = ref<HTMLElement | null>(null)
const introVariant = ref<IntroVariant>(props.variant)
let cleanupAnimation: (() => void) | null = null

const { sportMode, setSportMode } = useSportMode()

// ── Scroll lock + button feedback ───────────────────────────────────────────
let scrollLocked    = false
let gsapInstance: any = null
let mainST: any     = null   // stored ScrollTrigger instance
let heroTween: any  = null   // stored animateToHero tween
let lockTimeoutId: ReturnType<typeof setTimeout> | null = null
let shakeDebounce:  ReturnType<typeof setTimeout> | null = null
let isShaking       = false

const clearLockTimeout = () => {
  if (lockTimeoutId) { clearTimeout(lockTimeoutId); lockTimeoutId = null }
}

// ── Button animations ────────────────────────────────────────────────────────

const pulseButtons = () => {
  const el = audienceInnerRef.value
  if (!el || !gsapInstance) return
  gsapInstance.timeline()
    .to(el, { scale: 1.04, duration: 0.22, ease: 'power2.out' })
    .to(el, { scale: 1,    duration: 0.18, ease: 'power2.in' })
    .to(el, { scale: 1.025,duration: 0.16, ease: 'power2.out' })
    .to(el, { scale: 1,    duration: 0.14, ease: 'power2.in' })
}

const shakeButtons = () => {
  const el = audienceInnerRef.value
  if (!el || !gsapInstance || isShaking) return
  isShaking = true
  gsapInstance.to(el, {
    x: 9, duration: 0.07, ease: 'power1.inOut', yoyo: true, repeat: 5,
    onComplete: () => { gsapInstance.set(el, { x: 0 }); isShaking = false },
  })
}

const preventScroll = (e: Event) => {
  e.preventDefault()
  if (shakeDebounce) return
  shakeDebounce = setTimeout(() => { shakeButtons(); shakeDebounce = null }, 80)
}

// ── Lock / unlock ────────────────────────────────────────────────────────────

const lockScroll = () => {
  if (scrollLocked) return
  scrollLocked = true
  window.addEventListener('wheel',     preventScroll, { passive: false })
  window.addEventListener('touchmove', preventScroll, { passive: false })
  pulseButtons()
}

// Silent unlock: no animation — used when user scrolls back up manually
const silentUnlock = () => {
  if (!scrollLocked) return
  scrollLocked = false
  window.removeEventListener('wheel',     preventScroll)
  window.removeEventListener('touchmove', preventScroll)
  if (shakeDebounce) { clearTimeout(shakeDebounce); shakeDebounce = null }
}

const animateToHero = () => {
  const overlay = document.querySelector('.home-page__overlay') as HTMLElement | null
  if (!overlay || !gsapInstance) return

  // Kill any running hero tween first
  if (heroTween) { heroTween.kill(); heroTween = null }

  // Disable ScrollTrigger scrub so it doesn't fight the programmatic scroll
  if (mainST) mainST.disable()

  const targetY = overlay.offsetTop
  const proxy   = { y: window.scrollY }

  heroTween = gsapInstance.to(proxy, {
    y: targetY,
    duration: 1.4,
    ease: 'power3.inOut',
    onUpdate() { window.scrollTo(0, proxy.y) },
    onComplete() {
      heroTween = null
      // Re-enable scrub after landing
      if (mainST) { mainST.enable(); mainST.refresh() }
    },
  })
}

// Full unlock with hero animation — called on button click / skip
const unlockScroll = () => {
  if (!scrollLocked) return
  silentUnlock()
  animateToHero()
}

const handleSkip = () => unlockScroll()

// When sport mode is set externally → unlock
watch(sportMode, (newMode) => {
  if (newMode !== null) unlockScroll()
})

const testimonials = [
  { name: 'Mara', sport: 'Marathon', quote: 'Beine stabiler, Läufe fühlen sich leichter an.' },
  { name: 'Jonas', sport: 'Radsport', quote: 'Mehr Druck am Berg, weniger Ermüdung.' },
  { name: 'Lea', sport: 'Triathlon', quote: 'Schulter stabil, Schwimmen bleibt sauber.' },
  { name: 'Tim', sport: 'Trailrunning', quote: 'Weniger Kniezwicken, mehr Kontrolle bergab.' },
  { name: 'Alina', sport: 'Ultra', quote: 'Mehr Stabilität in langen Belastungen.' },
  { name: 'Ben', sport: 'Gravel', quote: 'Körper bleibt ruhig, Output steigt.' },
]
const rowA = [...testimonials, ...testimonials]
const rowB = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()]

const hookLine = computed(() =>
  introVariant.value === 'a'
    ? 'Ohne Kraft. Lahmes Getriebe.'
    : 'Ohne Kraft bleibt Leistung liegen.',
)


onMounted(async () => {
  if (!process.client) return

  const storedValue = window.localStorage.getItem(VARIANT_STORAGE_KEY)
  if (storedValue === 'a' || storedValue === 'b') {
    introVariant.value = storedValue
  } else {
    const assignedVariant: IntroVariant = Math.random() < 0.5 ? 'a' : 'b'
    window.localStorage.setItem(VARIANT_STORAGE_KEY, assignedVariant)
    introVariant.value = assignedVariant
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const gsapModule = await import('gsap')
  const scrollTriggerModule = await import('gsap/ScrollTrigger')
  const gsap = gsapModule.gsap || gsapModule.default || gsapModule
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default || scrollTriggerModule

  gsap.registerPlugin(ScrollTrigger)
  gsapInstance = gsap
  ScrollTrigger.refresh()
  await nextTick()

  if (!sectionRef.value || !contentRef.value || !textBlockRef.value || !audienceRef.value || !marqueeTopRef.value || !marqueeBottomRef.value) return

  const ctx = gsap.context(() => {
    // Trigger auf die Section selbst → Animation startet beim ersten Scroll-Pixel,
    // unabhängig davon wann der Overlay kommt.
    // end '+=500' = Animation ist nach 500px Scroll fertig.
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '+=500',
        scrub: 0.55,
        onLeave: () => {
          // Scrub hat 0.55s Lag — kurz warten bis Animation visuell fertig
          lockTimeoutId = setTimeout(() => {
            lockTimeoutId = null
            if (sportMode.value === null) lockScroll()
          }, 650)
        },
        onEnterBack: () => {
          // User scrolled back up — clear any pending lock and undo silently
          clearLockTimeout()
          silentUnlock()
          if (heroTween) { heroTween.kill(); heroTween = null }
        },
      },
    })
    tl
      .to(contentRef.value, {
        scale: 1.04,
        transformOrigin: '50% 35%',
      }, 0)
      .to(textBlockRef.value, {
        opacity: 0,
        filter: 'blur(8px)',
        y: -24,
      }, 0.05)
      .fromTo(marqueeTopRef.value, {
        opacity: 0,
        y: -16,
      }, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      }, 0.05)
      .fromTo(marqueeBottomRef.value, {
        opacity: 0,
        y: 16,
      }, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      }, 0.05)
      .fromTo(audienceRef.value, {
        opacity: 0,
        y: 32,
        scale: 0.97,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power2.out',
      }, 0.05)
    mainST = tl.scrollTrigger
  }, sectionRef.value)

  cleanupAnimation = () => ctx.revert()
})

onBeforeUnmount(() => {
  unlockScroll()
  cleanupAnimation?.()
  cleanupAnimation = null
})
</script>

<template>
  <section ref="sectionRef" class="intro-hero">
    <!-- Testimonial marquee top -->
    <div ref="marqueeTopRef" class="intro-hero__marquee intro-hero__marquee--top" aria-hidden="true">
      <div class="intro-hero__marquee-track intro-hero__marquee-track--left">
        <article v-for="(item, i) in rowA" :key="`top-${i}`" class="intro-hero__testimonial">
          <p class="intro-hero__testimonial-quote">"{{ item.quote }}"</p>
          <span class="intro-hero__testimonial-meta">{{ item.name }} · {{ item.sport }}</span>
        </article>
      </div>
    </div>

    <div class="intro-hero__backdrop" aria-hidden="true">
      <div class="intro-hero__halo intro-hero__halo--left" />
      <div class="intro-hero__halo intro-hero__halo--right" />
      <div class="intro-hero__heatmap" />
    </div>

    <div ref="contentRef" class="intro-hero__content">
      <div ref="textBlockRef" class="intro-hero__text">
          <p class="intro-hero__eyebrow">
            {{ props.eyebrow }}
          </p>

          <h1 class="intro-hero__headline">
            <span>{{ props.headlineStart }}</span>
            <span class="intro-hero__headline-accent">{{ props.headlineAccent }}</span>
          </h1>

          <p class="intro-hero__hook">
            {{ hookLine }}
          </p>

          <p class="intro-hero__subhead">
            {{ props.subhead }}
          </p>

        <AnalysisCtaButton label="Hybrid-Analyse starten" variant="hero" />
      </div>
    </div>

    <!-- Testimonial marquee bottom -->
    <div ref="marqueeBottomRef" class="intro-hero__marquee intro-hero__marquee--bottom" aria-hidden="true">
      <div class="intro-hero__marquee-track intro-hero__marquee-track--right">
        <article v-for="(item, i) in rowB" :key="`bot-${i}`" class="intro-hero__testimonial">
          <p class="intro-hero__testimonial-quote">"{{ item.quote }}"</p>
          <span class="intro-hero__testimonial-meta">{{ item.name }} · {{ item.sport }}</span>
        </article>
      </div>
    </div>

    <div ref="audienceRef" class="intro-hero__audience" aria-live="polite">
      <div ref="audienceInnerRef" class="intro-hero__audience-inner">
        <p class="intro-hero__audience-question">
          Bist du aktuell eher auf dem Rad oder mit den Laufschuhen unterwegs?
        </p>
        <SportSwitch variant="pills" />
        <button type="button" class="intro-hero__skip" @click="handleSkip">
          Ich hab noch kein Team.
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro-hero {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  height: 100svh;
  background: var(--color-background);
  color: var(--color-text-primary);
}

.intro-hero__backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.intro-hero__halo {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  opacity: 0.55;
}

.intro-hero__halo--left {
  top: -18%;
  left: -12%;
  width: min(56rem, 70vw);
  height: min(56rem, 70vw);
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-secondary) 12%, transparent) 0%,
      transparent 68%
    );
}

.intro-hero__halo--right {
  right: -16%;
  bottom: -24%;
  width: min(52rem, 66vw);
  height: min(52rem, 66vw);
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-accent) 10%, transparent) 0%,
      transparent 70%
    );
}

.intro-hero__heatmap {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(
      circle at 18% 16%,
      color-mix(in srgb, var(--color-brand-secondary) 8%, transparent) 0,
      transparent 22%
    ),
    radial-gradient(
      circle at 84% 24%,
      color-mix(in srgb, var(--color-brand-accent) 7%, transparent) 0,
      transparent 18%
    ),
    repeating-radial-gradient(
      circle at 14% 12%,
      color-mix(in srgb, var(--color-brand-secondary) 7%, transparent) 0 1px,
      transparent 1px 10px
    ),
    repeating-radial-gradient(
      circle at 88% 76%,
      color-mix(in srgb, var(--color-brand-accent) 5%, transparent) 0 1px,
      transparent 1px 12px
    );
  opacity: 0.9;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.45));
}

.intro-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing-3xl) + var(--spacing-md));
  width: min(100%, var(--container-max-width));
  margin: 0 auto;
  padding:
    calc(var(--spacing-4xl) + var(--spacing-lg))
    var(--container-padding)
    var(--spacing-4xl);
  text-align: center;
}

.intro-hero__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  max-width: 58rem;
}

.intro-hero__eyebrow {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-text-secondary) 80%, transparent);
}

.intro-hero__headline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35ch;
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(2.75rem, 7vw, 6rem);
  font-weight: var(--font-weight-bold);
  line-height: 0.98;
  letter-spacing: -0.05em;
  text-wrap: balance;
}

.intro-hero__headline-accent {
  color: var(--color-brand-accent);
}

.intro-hero__hook {
  margin: 0;
  max-width: 46rem;
  font-family: var(--font-family-heading);
  font-size: clamp(1.55rem, 3.6vw, 3.35rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: color-mix(in srgb, var(--color-text-primary) 54%, white);
  text-wrap: balance;
}

.intro-hero__subhead {
  margin: 0;
  max-width: 42rem;
  font-size: clamp(1rem, 1.6vw, 1.35rem);
  line-height: 1.5;
  color: var(--color-text-secondary);
  text-wrap: balance;
}

.intro-hero__audience {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--container-padding);
  pointer-events: none;
  opacity: 0; /* GSAP animates this in */
}

.intro-hero__audience-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  width: min(100%, 44rem);
  padding: var(--spacing-2xl) var(--spacing-2xl);
  border-radius: var(--radius-2xl);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-brand-accent) 96%, white) 0%,
    color-mix(in srgb, var(--color-brand-accent) 78%, var(--color-brand-secondary)) 100%
  );
  box-shadow:
    0 1.5rem 4rem color-mix(in srgb, var(--color-brand-accent) 32%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 18%, transparent);
  pointer-events: auto;
  text-align: center;
}

.intro-hero__skip {
  margin-top: var(--spacing-sm);
  padding: 0;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1;
  color: color-mix(in srgb, var(--color-text-light) 45%, transparent);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.intro-hero__skip:hover {
  color: color-mix(in srgb, var(--color-text-light) 70%, transparent);
}

.intro-hero__audience-question {
  margin: 0;
  font-size: clamp(var(--font-size-xl), 3vw, var(--font-size-3xl));
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  color: var(--color-text-light);
  text-wrap: balance;
}

@media (max-width: 768px) {
  .intro-hero__content {
    gap: var(--spacing-3xl);
    padding-top: calc(var(--spacing-4xl) + var(--spacing-xl));
    padding-bottom: calc(var(--spacing-4xl) + var(--spacing-xl));
  }

  .intro-hero__text {
    gap: var(--spacing-md);
    max-width: 24rem;
  }

  .intro-hero__eyebrow {
    font-size: var(--font-size-xs);
    letter-spacing: 0.12em;
  }

  .intro-hero__headline {
    gap: 0.24ch;
    font-size: clamp(2.3rem, 12vw, 3.75rem);
  }

  .intro-hero__hook {
    font-size: clamp(1.4rem, 8.2vw, 2.15rem);
  }

  .intro-hero__subhead {
    max-width: 22rem;
    font-size: var(--font-size-base);
  }
}

/* ── Testimonial marquees ── */
.intro-hero__marquee {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
  opacity: 0; /* GSAP animates in */
}

.intro-hero__marquee--top {
  top: 0;
  padding-top: calc(var(--header-height) + 3rem);
  padding-bottom: 3rem;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-background) 80%, transparent),
    transparent
  );
}

.intro-hero__marquee--bottom {
  bottom: 0;
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-background) 80%, transparent),
    transparent
  );
}

.intro-hero__marquee-track {
  display: flex;
  gap: var(--spacing-md);
  width: max-content;
  animation: marquee-left 32s linear infinite;
}

.intro-hero__marquee-track--right {
  animation-name: marquee-right;
}

.intro-hero__testimonial {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 260px;
  max-width: 300px;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: color-mix(in srgb, var(--color-background-secondary) 55%, transparent);
  backdrop-filter: blur(10px);
}

.intro-hero__testimonial-quote {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.45;
  color: color-mix(in srgb, var(--color-text-primary) 80%, transparent);
}

.intro-hero__testimonial-meta {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: color-mix(in srgb, var(--color-text-secondary) 70%, transparent);
  letter-spacing: 0.04em;
}

@keyframes marquee-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes marquee-right {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}
</style>
