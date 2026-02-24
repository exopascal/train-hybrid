<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"
import { createHeadlineSplitText } from "~/utils/gsapHeadlineSplitText"
import { computed, onBeforeUnmount, onMounted, nextTick, reactive, ref } from "vue"

const sectionRef = ref<HTMLElement | null>(null)
let cleanupHeadline: (() => void) | null = null
const svgEl = ref<SVGSVGElement | null>(null)
const routeBase = ref<SVGPathElement | null>(null)
const routeDraw = ref<SVGPathElement | null>(null)
const arrowEl = ref<SVGGElement | null>(null)

type Pt = { x: number; y: number }
const stations = reactive<Pt[]>([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
])

const stationEls = ref<SVGCircleElement[]>([])
function setStationRef(el: Element | null, i: number) {
  if (!el) return
  stationEls.value[i] = el as SVGCircleElement
}

const routeD =
  "M 110 320 " +
  "C 140 150, 320 90, 480 135 " +
  "C 640 185, 700 80, 830 140 " +
  "C 950 205, 970 330, 860 410 " +
  "C 760 475, 740 560, 610 560 " +
  "C 470 560, 400 500, 300 515 " +
  "C 180 535, 90 460, 110 320 Z"

let tl: any = null
let initTimer: ReturnType<typeof setTimeout> | null = null
let destroyed = false
const activeStep = ref(-1)
let scrollTrigger: any = null

const setActiveStep = (index: number) => {
  activeStep.value = index
}

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    headline?: string
    subhead?: string
  }>(),
  {
    bgStyle: "night",
    headline: "12‑Wochen<br><span class=\"no-break\">Hybrid Training</span>",
    subhead: "Struktur. Progression. Integration.",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])

onMounted(() => {
  if (!sectionRef.value) return
  const headline = sectionRef.value.querySelector<HTMLElement>(".HeadlineGsapSplitText")
  cleanupHeadline = createHeadlineSplitText(headline)
})

onBeforeUnmount(() => {
  cleanupHeadline?.()
  cleanupHeadline = null
})

onMounted(() => {
  if (!process.client) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  let attempts = 0
  const init = async () => {
    if (destroyed) return
    await nextTick()
    const path = routeDraw.value
    if (!path || !routeBase.value || !arrowEl.value) {
      attempts += 1
      if (attempts < 6) {
        initTimer = setTimeout(init, 80)
      }
      return
    }

    const gsapMod = await import("gsap")
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod
    const { ScrollTrigger } = await import("gsap/ScrollTrigger")
    const { MotionPathPlugin } = await import("gsap/MotionPathPlugin")
    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)

    const length = path.getTotalLength()

    const stops = [0.02, 0.12, 0.24, 0.36, 0.5, 0.64, 0.78, 0.92]
    stops.forEach((t, i) => {
      const pt = path.getPointAtLength(length * t)
      stations[i].x = pt.x
      stations[i].y = pt.y
    })

    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    gsap.set(arrowEl.value, {
      x: stations[0].x,
      y: stations[0].y,
      rotation: 0,
      transformOrigin: "50% 50%",
    })

    stationEls.value.forEach((c) => {
      gsap.set(c, { transformOrigin: "50% 50%", scale: 1 })
    })

    tl = gsap.timeline()
    tl.set(path, { strokeDashoffset: length })
    tl.call(() => setActiveStep(0), [], 0)

    for (let i = 1; i < stops.length; i++) {
      const end = stops[i]
      const prev = stops[i - 1]

      tl.to(arrowEl.value, {
        duration: 1.2,
        ease: "none",
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: prev,
          end,
        },
      })

      tl.to(
        path,
        {
          strokeDashoffset: length * (1 - end),
          duration: 1.2,
          ease: "none",
        },
        "<"
      )

      const station = stationEls.value[i]
      if (station) {
        tl.to(
          station,
          { scale: 1.35, duration: 0.12, ease: "power2.out" },
          "-=0.08"
        ).to(station, { scale: 1, duration: 0.22, ease: "power2.inOut" })
      }

      tl.call(() => setActiveStep(i), [], "-=0.2")

      tl.to({}, { duration: 0.12 })
    }

    tl.to(arrowEl.value, {
      duration: 1.35,
      ease: "none",
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start: stops[stops.length - 1],
        end: 1.02,
      },
    })

    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 1.35,
        ease: "none",
      },
      "<"
    )

    tl.call(() => setActiveStep(stops.length - 1))

    scrollTrigger = ScrollTrigger.create({
      animation: tl,
      trigger: sectionRef.value,
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    })
  }
  init()
})

onBeforeUnmount(() => {
  destroyed = true
  if (scrollTrigger) {
    scrollTrigger.kill()
    scrollTrigger = null
  }
  if (initTimer) {
    clearTimeout(initTimer)
    initTimer = null
  }
  if (tl) {
    tl.kill()
    tl = null
  }
})
</script>

<template>
  <section ref="sectionRef" :class="[sectionClass, 'framework-light', 'framework-section']">
    <div class="framework-bg" aria-hidden="true">
      <ClientOnly>
        <svg
          ref="svgEl"
          class="routeSvg"
          viewBox="0 0 1000 600"
          role="img"
          aria-label="Abstract route loop animation"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="
                  1 0 0 0 0
                  0 0.6 0 0 0
                  0 0 0.2 0 0
                  0 0 0 1 0"
                result="colored"
              />
              <feMerge>
                <feMergeNode in="colored" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="1000" height="600" class="bg" />
          <rect x="0" y="0" width="1000" height="600" fill="url(#grid)" opacity="0.55" />

          <path ref="routeBase" :d="routeD" class="routeBase" />
          <path ref="routeDraw" :d="routeD" class="routeDraw" filter="url(#glow)" />

          <g class="stations">
            <g v-for="(p, i) in stations" :key="i">
              <circle
                :ref="(el) => setStationRef(el, i)"
                :cx="p.x"
                :cy="p.y"
                r="10"
                class="stationOuter"
              />
              <circle :cx="p.x" :cy="p.y" r="5" class="stationInner" />
            </g>
          </g>

          <g ref="arrowEl" class="arrow" filter="url(#glow)">
            <path d="M 0 -10 L 18 0 L 0 10 L 4 0 Z" class="arrowShape" />
          </g>
        </svg>
      </ClientOnly>
    </div>
    <div class="framework-shade" aria-hidden="true"></div>
    <div class="framework-content mx-auto max-w-[1500px] px-6 py-24 sm:py-32 lg:py-36">
      <div class="mb-12 space-y-3 pl-12 text-left text-neutral-900">
        <p class="text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
          Das Hybrid Training Protokoll
        </p>
        <p class="framework-subheadline text-2xl sm:text-3xl lg:text-4xl">
          Deine Routine bleibt. Der Widerstand kommt dazu. Mehr brauchst du nicht
        </p>
      </div>
      <div class="framework-box">
        <div class="framework-layout">
          <div class="framework-stack text-left">
          <p class="framework-line HeadlineGsapSplitText" v-html="props.headline"></p>
          <p class="framework-line framework-line--muted">
            {{ props.subhead }}
          </p>
          <p class="framework-body">
            Kilometer sammeln kann jeder. Belastbar werden nur die, die Widerstand integrieren. Wenn du Ausdauer ernst nimmst, muss dein Muskeltraining mithalten. EXOPEK macht Krafttraining zum Teil deiner bestehenden Routine. Nicht irgendwie. Irgendwo. Irgendwann. Sondern jetzt.
          </p>
        </div>
          <div class="framework-flow">
          <div class="flow-list">
            <div class="flow-item" :class="{ 'is-active': activeStep >= 0 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">01</span>
                  <p class="flow-title">Onboarding</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Analyse &amp; Anamnese deines aktuellen Trainings.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 1 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">02</span>
                  <p class="flow-title">Trainingswochen 1–4</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Systemintegration. Anatomische Anpassung. Strukturelle Stabilisierung.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 2 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">03</span>
                  <p class="flow-title">Meilenstein-Check</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Belastbarkeit überprüfen. Progression wird freigegeben.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 3 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">04</span>
                  <p class="flow-title">Trainingswochen 5–8</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Intensitätsaufbau. Kraftentwicklung unter Belastung. Volumensteuerung.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 4 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">05</span>
                  <p class="flow-title">Meilenstein-Check</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Anpassung des Mesozyklus. Feinjustierung von Intensität und Widerstand.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 5 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">06</span>
                  <p class="flow-title">Trainingswochen 9–11</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Intensivierung. Leistungsintegration in deine Ausdauer-Routine.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 6 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">07</span>
                  <p class="flow-title">Deload-Woche</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Regeneration. Superkompensation. Strukturelle Konsolidierung.</p>
              </div>
            </div>
            <div class="flow-item" :class="{ 'is-active': activeStep >= 7 }">
              <div class="flow-left">
                <div class="flow-header">
                  <span class="flow-check">08</span>
                  <p class="flow-title">Abschlussbewertung</p>
                </div>
              </div>
              <div class="flow-right">
                <p class="flow-text">Objektive Belastbarkeitsanalyse. Trainingsplanung.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<style scoped>
.framework-section {
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.framework-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.75;
  pointer-events: none;
}

.framework-shade {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #000000;
  opacity: 0.35;
  pointer-events: none;
}

.routeSvg {
  width: 100%;
  height: 100%;
  display: block;
}

.bg {
  fill: #070a10;
}

.routeBase {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.routeDraw {
  fill: none;
  stroke: rgba(255, 110, 64, 0.95);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.stationOuter {
  fill: rgba(7, 10, 16, 0.85);
  stroke: rgba(255, 255, 255, 0.28);
  stroke-width: 2;
}

.stationInner {
  fill: rgba(255, 110, 64, 0.95);
  opacity: 0.95;
}

.arrowShape {
  fill: rgba(255, 110, 64, 0.98);
}

.framework-content {
  position: relative;
  z-index: 1;
}

.framework-subheadline {
  color: #ffffff !important;
  opacity: 1 !important;
}

.framework-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 36px;
}

.framework-box {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 28px;
  padding: 56px 32px 32px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

.framework-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-left: 18px;
}

.framework-line {
  font-size: clamp(1.7rem, 3.2vw, 2.6rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.no-break {
  white-space: nowrap;
}

.framework-line--muted {
  color: rgba(15, 23, 42, 0.72);
  font-weight: 600;
}

.framework-body {
  margin-top: 22px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.75);
}

.framework-flow {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.flow-list {
  display: flex;
  flex-direction: column;
}

.flow-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.16);
}

.flow-item.is-active .flow-title {
  color: #ff6a1a;
  font-weight: 800;
}

.flow-item.is-active .flow-text {
  color: rgba(255, 106, 26, 0.9);
  font-weight: 600;
}

.flow-item.is-active .flow-check {
  border-color: rgba(255, 106, 26, 0.7);
  color: #ff6a1a;
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.flow-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  transition: color 0.2s ease, font-weight 0.2s ease;
}

.flow-text {
  font-size: 0.98rem;
  line-height: 1.6;
  color: rgba(15, 23, 42, 0.72);
  transition: color 0.2s ease, font-weight 0.2s ease;
}

.flow-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flow-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.3);
  color: #0f172a;
  font-size: 0.9rem;
  flex: 0 0 auto;
}

.framework-light {
  background: #f1f5f9;
  color: #0f172a;
}

@media (min-width: 1024px) {
  .framework-layout {
    grid-template-columns: minmax(0, 28%) minmax(0, 72%);
    gap: 48px;
  }

  .flow-item {
    grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .framework-stack {
    gap: 10px;
  }

  .framework-body {
    margin-top: 16px;
  }
}
</style>
