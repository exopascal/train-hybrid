<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const cards = [
  {
    body: "Behalte deine Routine und erreiche ein neues Leistungsniveau.",
    image: "/krafttraining-ausdauersportler-mobil-outdoor-hybrid.jpg",
    alt: "Ausdauersportlerin beim hybriden Training im Freien",
  },
    {
    body: "Train Hybrid steht für strukturierte Progression und messbaren Fortschritt.",
    image: "/krafttraining-outdoorsport-joggen-laufen-gravelbike.jpg",
    alt: "Strukturiertes Hybrid-Training im Outdoor-Setting",
  },
  {
    body: "Verbessere deine Bewegungsqualität und fühle dich spürbar stabiler.",
    image: "/krafttraining-outdoor-laufen-gehen-gravel.jpg",
    alt: "Bewegung zwischen Straße, Gelände und Alltag",
  },
   {
    body: "Trainiere gelenkschonend durch elastischen Widerstand.",
    image: "/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg",
    alt: "Athletisches Krafttraining mit elastischem Widerstand",
  },
  {
    body: "Zeiteffizientes Training, das sich in deine Routine integrieren lässt.",
    image: "/krafttraining-outdoorsport-joggen-laufen-gravelbike-ultrawide.jpg",
    alt: "Zeiteffizientes Hybrid-Training im Outdoor-Setting",
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const railRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isAutoplayActive = ref(false)
const hasCompletedCycle = ref(false)

let autoplayTimer: ReturnType<typeof setInterval> | null = null
const autoplayIntervalMs = 4000
let railTween: gsap.core.Tween | null = null
let autoplayTrigger: ScrollTrigger | null = null

const scrollToCard = (index: number, immediate = false) => {
  if (!railRef.value) return
  const cardsInRail = railRef.value.querySelectorAll<HTMLElement>(".thm-card")
  const targetCard = cardsInRail[index]
  if (!targetCard) return
  const railBounds = railRef.value.getBoundingClientRect()
  const cardBounds = targetCard.getBoundingClientRect()
  const targetScrollLeft = railRef.value.scrollLeft + (cardBounds.left - railBounds.left)

  railTween?.kill()

  if (immediate) {
    railRef.value.scrollLeft = targetScrollLeft
    return
  }

  railTween = gsap.to(railRef.value, {
    scrollLeft: targetScrollLeft,
    duration: 1.2,
    ease: "power3.inOut",
    overwrite: "auto",
  })
}

const startAutoplay = () => {
  if (autoplayTimer || cards.length < 2) return
  isAutoplayActive.value = true
  hasCompletedCycle.value = false
  autoplayTimer = setInterval(() => {
    if (activeIndex.value >= cards.length - 1) {
      hasCompletedCycle.value = true
      stopAutoplay()
      return
    }

    activeIndex.value += 1
  }, autoplayIntervalMs)
}

const stopAutoplay = () => {
  isAutoplayActive.value = false
  if (!autoplayTimer) return
  clearInterval(autoplayTimer)
  autoplayTimer = null
}

const goToCard = (index: number) => {
  activeIndex.value = index
}

const toggleAutoplay = () => {
  if (hasCompletedCycle.value) {
    activeIndex.value = 0
    nextTick(() => {
      scrollToCard(0, true)
      startAutoplay()
    })
    return
  }

  if (isAutoplayActive.value) {
    stopAutoplay()
    return
  }

  startAutoplay()
}

watch(activeIndex, (index) => {
  scrollToCard(index)
})

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  await nextTick()
  scrollToCard(0, true)

  if (sectionRef.value) {
    autoplayTrigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: "top 75%",
      once: true,
      onEnter: () => {
        startAutoplay()
      },
    })
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
  autoplayTrigger?.kill()
  autoplayTrigger = null
  railTween?.kill()
  railTween = null
})
</script>

<template>
  <section ref="sectionRef" class="thm-section">
    <div class="thm-container">
      <div class="thm-header">
        <div>
          <p class="thm-kicker">Die Highlights</p>
          <h2 class="thm-title">Train Hybrid. Move Freely.</h2>
        </div>
        <button type="button" class="thm-link">Das Hybrid Protokoll</button>
      </div>

      <div ref="railRef" class="thm-rail">
        <article
          v-for="(card, index) in cards"
          :key="card.body"
          class="thm-card"
          :class="{ 'is-active': index === activeIndex }"
        >
          <div class="thm-card__copy">
            <p class="thm-card__text">{{ card.body }}</p>
          </div>
          <div class="thm-card__media">
            <img class="thm-card__image" :src="card.image" :alt="card.alt" loading="lazy" />
          </div>
        </article>
      </div>

      <div class="thm-controls">
        <div class="thm-dots">
          <button
            v-for="(_, index) in cards"
            :key="index"
            type="button"
            class="thm-dot"
            :class="{
              'is-active': index === activeIndex,
              'is-progressing': index === activeIndex && isAutoplayActive && !hasCompletedCycle,
            }"
            :aria-label="`Gehe zu Highlight ${index + 1}`"
            :aria-pressed="(index === activeIndex).toString()"
            @click="goToCard(index)"
          ></button>
        </div>
        <button
          type="button"
          class="thm-play"
          :aria-label="
            hasCompletedCycle
              ? 'Slider neu starten'
              : isAutoplayActive
                ? 'Autoplay pausieren'
                : 'Autoplay starten'
          "
          @click="toggleAutoplay"
        >
          <span v-if="hasCompletedCycle" class="thm-restart" aria-hidden="true">
            <span class="thm-restart__arc"></span>
            <span class="thm-restart__head"></span>
          </span>
          <span v-if="isAutoplayActive" class="thm-pause" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
          <span v-else-if="!hasCompletedCycle" class="thm-play__triangle" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.thm-section {
  background: color-mix(in srgb, var(--color-background-secondary) 72%, var(--color-background));
  color: var(--color-brand-dark);
  height: 90vh;
  height: 90svh;
  overflow: hidden;
}

.thm-container {
  max-width: var(--container-max-width);
  height: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: var(--spacing-4xl) var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.thm-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 20%;
  height: 20%;
  gap: var(--spacing-md);
}

.thm-kicker {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.thm-title {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.thm-link {
  border: none;
  background: transparent;
  color: var(--color-info);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  padding: 0;
  cursor: pointer;
}

.thm-rail {
  display: grid;
  gap: var(--spacing-lg);
  grid-auto-flow: column;
  grid-auto-columns: calc(100% - 12rem);
  min-height: 70%;
  height: 70%;
  overflow-x: auto;
  padding-left: 0;
  padding-right: 0;
  -webkit-overflow-scrolling: touch;
}

.thm-rail::-webkit-scrollbar {
  display: none;
}

.thm-rail {
  scrollbar-width: none;
}

.thm-card {
  display: grid;
  grid-template-columns: minmax(0, 35%) minmax(0, 65%);
  align-items: stretch;
  gap: var(--spacing-xl);
  background: color-mix(in srgb, var(--color-background) 94%, var(--color-background-secondary));
  border-radius: var(--radius-2xl);
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 6%, transparent);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  min-height: 100%;
  height: 100%;
  overflow: hidden;
}

.thm-card__copy {
  align-self: center;
  max-width: none;
  padding: var(--spacing-2xl) var(--spacing-xl) var(--spacing-2xl) var(--spacing-2xl);
}

.thm-card__text {
  margin: 0;
  font-size: clamp(1.6rem, 2.25vw, 2.25rem);
  font-weight: var(--font-weight-semibold);
  line-height: 1.14;
  color: var(--color-text-primary);
}

.thm-card__media {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
  min-height: 100%;
  height: 100%;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-background-secondary) 80%, var(--color-background));
  border-top-left-radius: var(--spacing-xl);
  border-bottom-left-radius: var(--spacing-xl);
}

.thm-card__media::before {
  content: "";
  position: absolute;
  inset: auto 10% 8% 10%;
  height: 18%;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-brand-accent) 14%, transparent);
  filter: blur(24px);
}

.thm-card__image {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  min-height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 0;
}

.thm-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10%;
  height: 10%;
  gap: 0.75rem;
}

.thm-dots {
  display: inline-flex;
  align-items: center;
  width: auto;
  min-width: 11.5rem;
  gap: 0.75rem;
  justify-content: center;
  padding: 0.95rem 1.5rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-background) 82%, var(--color-background-secondary));
}

.thm-dot {
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-text-primary) 38%, transparent);
  cursor: pointer;
  overflow: hidden;
  transition: width var(--transition-fast), background var(--transition-fast);
}

.thm-dot.is-active {
  width: 1.9rem;
  background: color-mix(in srgb, var(--color-text-primary) 18%, transparent);
}

.thm-dot.is-active::after {
  content: "";
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--color-text-primary) 72%, transparent);
  transform: scaleX(1);
  transform-origin: left center;
}

.thm-dot.is-progressing::after {
  transform: scaleX(0);
  animation: thm-dot-progress 4000ms linear forwards;
}

.thm-play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.9rem;
  height: 2.9rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-background) 88%, var(--color-background-secondary));
  cursor: pointer;
}

.thm-play__triangle {
  width: 0;
  height: 0;
  margin-left: 0.125rem;
  border-top: 0.45rem solid transparent;
  border-bottom: 0.45rem solid transparent;
  border-left: 0.7rem solid var(--color-text-primary);
}

.thm-pause {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.thm-pause span {
  display: block;
  width: 0.25rem;
  height: 0.875rem;
  border-radius: var(--radius-full);
  background: var(--color-text-primary);
}

.thm-restart {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.05rem;
  height: 1.05rem;
}

.thm-restart__arc {
  width: 1rem;
  height: 1rem;
  border: 0.16rem solid var(--color-text-primary);
  border-right-color: transparent;
  border-radius: 50%;
  transform: rotate(-25deg);
}

.thm-restart__head {
  position: absolute;
  top: 0.02rem;
  right: 0.02rem;
  width: 0;
  height: 0;
  border-top: 0.22rem solid transparent;
  border-bottom: 0.22rem solid transparent;
  border-left: 0.32rem solid var(--color-text-primary);
  transform: rotate(20deg);
}

@keyframes thm-dot-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

@media (max-width: 900px) {
  .thm-card {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .thm-card__copy {
    max-width: none;
  }

  .thm-card__media {
    min-height: 12rem;
  }
}

@media (max-width: 640px) {
  .thm-container {
    gap: var(--spacing-lg);
  }

  .thm-header {
    align-items: flex-start;
    min-height: 20%;
    height: 20%;
    gap: var(--spacing-sm);
  }

  .thm-title {
    font-size: 2.35rem;
  }

  .thm-rail {
    grid-auto-columns: calc(100% - 3.5rem);
    grid-auto-rows: 100%;
    padding-left: 0;
    padding-right: 0;
  }

  .thm-card {
    box-sizing: border-box;
    gap: var(--spacing-lg);
    min-height: 100% !important;
    height: 100%;
    max-height: 100%;
    padding: var(--spacing-lg);
    grid-template-columns: 1fr;
  }

  .thm-card__text {
    font-size: 1.45rem;
  }

  .thm-card__copy {
    padding: 0;
  }

  .thm-card__media {
    flex: 0 0 auto;
    min-height: 7rem;
    max-height: 7rem;
    justify-content: flex-end;
    border-top-left-radius: var(--radius-xl);
    border-bottom-left-radius: var(--radius-xl);
  }

  .thm-card__image {
    max-width: 10rem;
    max-height: 6.5rem;
    border-radius: var(--radius-xl);
  }

  .thm-dots {
    padding: 0.75rem 1rem;
  }

  .thm-play {
    width: 2.75rem;
    height: 2.75rem;
  }
}
</style>
