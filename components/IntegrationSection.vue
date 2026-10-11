<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
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
    headlineHtml?: string
    seoHead?: string
    subhead?: string
    body?: string
    rotatingWords?: string[]
    benefitsLabelTop?: string
    benefitsLabelBottom?: string
    benefitsItems?: string[]
    ctaLabel?: string
  }>(),
  {
    bgStyle: "light",
    headlineHtml:
      "Ausdauer hält<br> dich fit.<br> Muskeln halten<br> dich&nbsp;",
    seoHead: "KRAFTTRAINING FUR AUSDAUERSPORTLER: INTEGRIERTES TRAIN HYBRID OHNE EXTRA EINHEITEN.",
    subhead: "Kilometer sammeln kann jeder. Belastbar werden nur die, die Kraft integrieren.",
    body:
      "Deine Herz-Kreislauf-Fitness und eine hohe VO₂max sind zentrale Faktoren im Ausdauertraining – egal ob du regelmäßig läufst, Rad fährst oder einfach aktiv bleiben willst. Doch ohne gezieltes Krafttraining fehlt deinem Körper die strukturelle Basis für Stabilität, Kraftübertragung und Gelenkschutz. Genau hier setzt train hybrid für Ausdauersportler an. Wir integrieren effektives Krafttraining für Läufer, Radfahrer und aktive Menschen systematisch in die bestehende Ausdauer-Routine – ohne zusätzliche Trainingstage. So verbindest du Krafttraining und Ausdauertraining sinnvoll miteinander, steigerst deine Belastbarkeit im Alltag und entwickelst langfristige athletische Stabilität – die Grundlage für ambitionierte Ziele wie Marathon, Halbmarathon, lange Radrennen oder einfach Leistungsfähigkeit bis ins hohe Alter.",
    rotatingWords: ["jung.", "stark.", "stabil."],
    benefitsLabelTop: "TRAIN",
    benefitsLabelBottom: "HYBRID",
    benefitsItems: ["Mehr Muskelmasse.", "Mehr Stabilität.", "Mehr Belastbarkeit."],
    ctaLabel: "Mehr erfahren",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
const goToBlog = () => {
  navigateTo("/blog")
}
let cleanupHeadline: (() => void) | null = null
let cleanupSubhead: (() => void) | null = null
let cleanupBody: (() => void) | null = null
let cleanupBenefits: (() => void) | null = null
let benefitsTrigger: ScrollTrigger | null = null

const rotatingWords = computed(() => props.rotatingWords ?? [])
const rotatingIndex = ref(0)
const rotatingRef = ref<HTMLElement | null>(null)
const benefitsLineRef = ref<HTMLSpanElement | null>(null)
const benefitsLabelTextRef = ref<HTMLSpanElement | null>(null)
const rotatingReady = ref(false)
const benefitsAnimated = ref(false)
let rotateTimer: ReturnType<typeof setInterval> | null = null
let cleanupRotate: (() => void) | null = null
const currentRotatingWord = computed(
  () => rotatingWords.value[rotatingIndex.value] ?? "",
)

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
      rotatingIndex.value = (rotatingIndex.value + 1) % Math.max(rotatingWords.value.length, 1)
      await nextTick()
      gsap.set(rotatingRef.value, { opacity: 1, y: 0 })
      animateRotatingWord()
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

  if (sectionRef.value) {
    benefitsTrigger = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: () => {
        if (!sectionRef.value) return 0
        return sectionRef.value.offsetTop + window.innerHeight * 0.25
      },
      once: true,
      onEnter: () => {
        if (benefitsAnimated.value) return
        benefitsAnimated.value = true
        animateBenefitsLabel()
      },
    })
  }

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
  benefitsTrigger?.kill()
  benefitsTrigger = null
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
    :class="['bg-white', 'text-neutral-900', 'lg:h-[95vh]']"
  >
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:h-full lg:py-32">
      <div class="grid items-stretch gap-10 text-left lg:h-full lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div class="space-y-6 self-start">
        <div class="space-y-3">
          <p class="seo-headline">
            {{ props.seoHead }}
          </p>
            <p class="HeadlineGsapSplitText text-[4rem] font-semibold leading-tight">
              <span ref="headlineRef" v-html="props.headlineHtml"></span>
              <span
                :key="rotatingIndex"
                ref="rotatingRef"
                :class="[
                  'rotating-word font-semibold text-black',
                  rotatingReady ? 'is-ready' : 'is-hidden',
                ]"
              >
                {{ currentRotatingWord }}
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
              {{ props.benefitsLabelTop }}
              <span class="benefits-label__break"></span>
              {{ props.benefitsLabelBottom }}
            </span>
          </div>
          <div class="mt-4 flex flex-col gap-4 text-[2rem] font-semibold leading-tight text-black">
            <div v-for="(item, idx) in props.benefitsItems" :key="`${item}-${idx}`">
              {{ item }}
            </div>
          </div>
          <div class="mt-10">
            <ButtonShine :label="props.ctaLabel" @click="goToBlog" />
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
  background: var(--color-brand-accent);
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
  color: var(--color-text-secondary);
}
</style>
