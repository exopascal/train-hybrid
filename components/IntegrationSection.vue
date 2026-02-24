<script setup lang="ts">
import { nextTick } from "vue"
import ButtonShine from "~/components/ButtonShine.vue"
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"
import { createHeadlineSplitText } from "~/utils/gsapHeadlineSplitText"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitType from "split-type"

const sectionRef = ref<HTMLElement | null>(null)
const headlineRef = ref<HTMLElement | null>(null)
const subheadRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const benefitsRef = ref<HTMLElement | null>(null)

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    headline?: string
    seoHead?: string
    subhead?: string
    body?: string
    listHead?: string
    lineOne?: string
    lineTwo?: string
    lineThree?: string
    lineFour?: string
  }>(),
  {
    bgStyle: "night",
    headline: "Ausdauer hält dich leistungsfähig. Muskeln halten dich belastbar.",
    seoHead: "KRAFTTRAINING FUR AUSDAUERSPORTLER: INTEGRIERTES HYBRID TRAINING OHNE EXTRA EINHEITEN.",
    subhead: "Du trainierst vielleicht genug. Aber nicht vollständig",
    body:
      "Deine Herz-Kreislauf-Fitness und eine hohe VO₂max sind zentrale Faktoren im Ausdauertraining – egal ob du regelmäßig läufst, Rad fährst oder einfach aktiv bleiben willst. Doch ohne gezieltes Krafttraining fehlt die muskuläre Basis für Stabilität, Kraftübertragung und Gelenkschutz. Genau hier setzt unser Hybrid Training für Ausdauersportler an. Wir integrieren effektives Krafttraining für Läufer und Radfahrer direkt in deine bestehende Ausdauer-Routine – beim Laufen oder Radsport - egal ob Rennrad oder Gravelbike. So verbindest du Krafttraining und Ausdauertraining sinnvoll miteinander, steigerst deine Belastbarkeit im Alltag, entwickelst langfristige athletische Stabilität und schaffst die Grundlage für anspruchsvolle Ziele wie Marathon oder Halbmarathon.",
    listHead: "Deine Vorteile:",
    lineOne:
      "Mehr Muskelmasse.",
    lineTwo:
      "Mehr Stabilität.",
    lineThree:
      "Mehr Belastbarkeit.",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
let cleanupHeadline: (() => void) | null = null
let cleanupSubhead: (() => void) | null = null
let cleanupBody: (() => void) | null = null
let cleanupBenefits: (() => void) | null = null

const rotatingWords = ["jung.", "stark.", "stabil."] as const
const rotatingIndex = ref(0)
const rotatingRef = ref<HTMLElement | null>(null)
const benefitsLineRef = ref<HTMLSpanElement | null>(null)
const benefitsLabelTextRef = ref<HTMLSpanElement | null>(null)
const rotatingReady = ref(false)
const benefitsAnimated = ref(false)
let rotateTimer: ReturnType<typeof setInterval> | null = null
let cleanupRotate: (() => void) | null = null

const animateBenefitsLabel = () => {
  if (benefitsLineRef.value || benefitsLabelTextRef.value) {
    const tl = gsap.timeline()
    if (benefitsLineRef.value) {
      tl.fromTo(
        benefitsLineRef.value,
        { rotation: 0, transformOrigin: "left bottom" },
        { rotation: 10, duration: 0.5, ease: "power2.out" },
      )
    }
    if (benefitsLabelTextRef.value) {
      tl.to(
        benefitsLabelTextRef.value,
        {
          x: 32,
          duration: 0.4,
          ease: "power2.out",
          onStart: () => {
            benefitsLabelTextRef.value?.classList.add("is-italic")
          },
        },
        ">0.05",
      )
    }
  }
}

const animateRotatingWord = () => {
  if (!process.client || !rotatingRef.value) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  cleanupRotate?.()
  const split = new SplitType(rotatingRef.value, { types: "chars" })
  const animation = gsap.fromTo(
    split.chars,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.28, stagger: 0.02, ease: "power3.out" },
  )
  cleanupRotate = () => {
    animation.kill()
    split.revert()
  }
}

const rotateWord = () => {
  if (!process.client || !rotatingRef.value) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  gsap.to(rotatingRef.value, {
    opacity: 0,
    y: -6,
    duration: 0.2,
    ease: "power2.in",
    onComplete: async () => {
      rotatingIndex.value = (rotatingIndex.value + 1) % rotatingWords.length
      await nextTick()
      gsap.set(rotatingRef.value, { opacity: 1, y: 0 })
      animateRotatingWord()
      if (rotatingIndex.value === 1 && !benefitsAnimated.value) {
        benefitsAnimated.value = true
        animateBenefitsLabel()
      }
    },
  })
}

onMounted(async () => {

  const startRotation = () => {
    if (rotatingReady.value) return
    rotatingReady.value = true
    animateRotatingWord()
    rotateTimer = setInterval(rotateWord, 1200)
  }

  if (process.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    startRotation()
  }

  cleanupHeadline = createHeadlineSplitText(headlineRef.value, {
    onComplete: startRotation,
  })

  if (!process.client) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  gsap.registerPlugin(ScrollTrigger)

  await nextTick()
  if (!subheadRef.value) return

  const triggerEl = headlineRef.value ?? subheadRef.value
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  })

  timeline.from(subheadRef.value, {
    opacity: 0,
    y: 24,
    duration: 0.6,
    ease: "power3.out",
  }, 0.25)

  if (bodyRef.value) {
    timeline.from(bodyRef.value, {
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    }, 0.4)
  }

  if (benefitsRef.value) {
    timeline.from(benefitsRef.value, {
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    }, 0.4)
  }

  cleanupSubhead = () => {
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
  cleanupBody = cleanupSubhead
  cleanupBenefits = cleanupSubhead

})

onBeforeUnmount(() => {
  cleanupHeadline?.()
  cleanupHeadline = null
  cleanupSubhead?.()
  cleanupSubhead = null
  cleanupBody?.()
  cleanupBody = null
  cleanupBenefits?.()
  cleanupBenefits = null
  cleanupRotate?.()
  cleanupRotate = null
  if (rotateTimer) {
    clearInterval(rotateTimer)
    rotateTimer = null
  }
})
</script>

<template>
  <section
    id="integration-section"
    ref="sectionRef"
    :class="['bg-slate-100', 'text-neutral-900', 'lg:h-[95vh]']"
  >
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:h-full lg:py-32">
      <div class="grid items-stretch gap-10 text-left lg:h-full lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div class="space-y-6 self-start">
        <div class="space-y-3">
          <p class="seo-headline">
            {{ props.seoHead }}
          </p>
            <p class="HeadlineGsapSplitText text-[4rem] font-semibold leading-tight">
              <span ref="headlineRef">
                Ausdauer hält
                <br />
                dich fit.
                <br />
                Muskeln halten
                <br />
                dich&nbsp;
              </span>
              <span
                :key="rotatingIndex"
                ref="rotatingRef"
                :class="[
                  'rotating-word font-semibold text-black',
                  rotatingReady ? 'is-ready' : 'is-hidden',
                ]"
              >
                {{ rotatingWords[rotatingIndex] }}
              </span>
            </p>
            <p ref="subheadRef" class="text-xl font-semibold text-neutral-700 sm:text-2xl">
              {{ props.subhead }}
            </p>
          </div>
          <p ref="bodyRef" class="whitespace-pre-line text-base leading-relaxed text-neutral-700 sm:text-lg">
            {{ props.body }}
          </p>
        </div>

        <div ref="benefitsRef" class="flex h-full flex-col justify-end text-base sm:text-lg">
          <div class="benefits-label">
            <span
              ref="benefitsLineRef"
              class="benefits-label__line"
              aria-hidden="true"
            ></span>
            <span ref="benefitsLabelTextRef" class="benefits-label__text">
              HYBRID
              <span class="benefits-label__break"></span>
              TRAINING
            </span>
          </div>
          <div class="mt-4 flex flex-col gap-4 text-[2rem] font-semibold leading-tight text-black">
            <div>Mehr Muskelmasse.</div>
            <div>Mehr Stabilität.</div>
            <div>Mehr Belastbarkeit.</div>
          </div>
          <div class="mt-10">
            <ButtonShine label="Mehr erfahren" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rotating-word {
  display: inline-block;
}

.rotating-word.is-hidden {
  opacity: 0;
}

.rotating-word.is-ready {
  opacity: 1;
}

.benefits-label {
  display: flex;
  align-items: stretch;
  gap: 18px;
  margin-bottom: 22px;
}

.benefits-label__line {
  width: 3px;
  height: 100%;
  background: #ff6a00;
  border-radius: 999px;
}

.benefits-label__text {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #111;
  -webkit-text-stroke: 0;
  text-stroke: 0;
  text-transform: uppercase;
  font-style: normal;
  line-height: 1;
}

.benefits-label__break {
  display: block;
  height: 0;
}

.benefits-label__text.is-italic {
  font-style: italic;
  color: transparent;
  -webkit-text-stroke: 1px #111;
  text-stroke: 1px #111;
}

.seo-headline {
  font-size: 12px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(15, 23, 42, 0.6);
}
</style>
