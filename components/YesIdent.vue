<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createHeadlineSplitText } from "~/utils/gsapHeadlineSplitText"
import ButtonShine from "~/components/ButtonShine.vue"

type TargetCard = {
  id: string
  title: string
  body: string
}

const props = withDefaults(
  defineProps<{
    kicker?: string
    headline?: string
    subhead?: string
    cards?: TargetCard[]
  }>(),
  {
    kicker: "Krafttraining für Ausdauersportler ohne Fitnessstudio.",
    headline: "Hybrid Training: Kraft in deiner Ausdauer-Routine.",
    subhead: "4 Schritte. 10–15 Minuten. In deiner Einheit. „EXOPEK macht Widerstand so schnell verfügbar, dass du ihn als kurze Intervalle in deine Ausdauer-Routine integrieren kannst.",
    cards: [
      {
        id: "01",
        title: "Du bleibst in deiner Routine.",
        body:
          "Kein neuer Trainingsblock. Keine Ausreden. Krafttraining dort, wo du ohnehin trainierst.",
      },
      {
        id: "02",
        title: "Der Widerstand. Auf deinem Rücken.",
        body:
          "EXOPEK bringt elastischen Widerstand direkt in deine Routine – zuschaltbar in Sekunden. zuschaltbar in Sekunden. Aufsetzen. Zuschalten. Trainieren.",
      },
      {
        id: "03",
        title: "Leicht getragen. Schwer trainiert.",
        body:
          "2,3 kg Eigengewicht. Bis zu 252 kg elastischer Widerstand. EXOPEK skaliert mit deinen Erfolgen – vom Kraftintervall auf der Runde bis zur vollwertigen Krafteinheit. Überall.",
      },
      {
        id: "04",
        title: "Stabil in die Zukunft.",
        body:
          "Geschwindigkeit bringt dich voran. Belastbarkeit hält dich im Spiel. 1 % Muskelverlust pro Jahr. Wenn du nichts tust.Krafttraining ist kein Add-on. Es ist eine Grundlage.",
      },
    ],
  },
)

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let cleanupHeadline: (() => void) | null = null
let mm: gsap.MatchMedia | null = null

const ACTIVE = "#ff6a1a"
const INACTIVE = "#a3a3a3"

function setActiveId(ids: HTMLElement[], index: number) {
  ids.forEach((el, i) => el && (el.style.color = i === index ? ACTIVE : INACTIVE))
}

onMounted(() => {
  if (!process.client) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (!sectionRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  nextTick(() => {
    if (!sectionRef.value) return

    const headline = sectionRef.value.querySelector<HTMLElement>(".HeadlineGsapSplitText")
    cleanupHeadline = createHeadlineSplitText(headline)

    ctx = gsap.context(() => {
      const section = sectionRef.value!
      const headlineBlock = section.querySelector<HTMLElement>(".headline-block")
      const cardsPinWrap = section.querySelector<HTMLElement>(".cardsPinWrap")
      const cardsWrap = section.querySelector<HTMLElement>(".cardsWrap")
      const cards = Array.from(section.querySelectorAll<HTMLElement>(".yes-ident-card"))
      const ids = cards
        .map((card) => card.querySelector<HTMLElement>(".yes-ident-id"))
        .filter((el): el is HTMLElement => Boolean(el))

      if (!headlineBlock || !cardsPinWrap || !cardsWrap || cards.length < 4) return

      const [c1, c2, c3, c4] = cards

      gsap.set(c1, { opacity: 1, yPercent: 0, scale: 1, zIndex: 4 })
      gsap.set(c2, { opacity: 1, yPercent: 10, scale: 0.985, zIndex: 3 })
      gsap.set(c3, { opacity: 0, yPercent: 18, scale: 0.97, zIndex: 2 })
      gsap.set(c4, { opacity: 0, yPercent: 18, scale: 0.97, zIndex: 1 })

      setActiveId(ids, 0)

      mm = gsap.matchMedia()

      const buildTimelines = (start: string, endFactor: number, offsetIn: number) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              endTrigger: cardsPinWrap,
              end: "top 35%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(headlineBlock, { opacity: 0, y: -120, ease: "none" }, 0)
          .to(c1, { yPercent: -6, ease: "none" }, 0)

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: cardsPinWrap,
            start,
            end: `+=${(cards.length - 1) * endFactor}%`,
            scrub: true,
            pin: cardsPinWrap,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.addLabel("catch", 0)
        tl.to(c1, { yPercent: 0, scale: 1, duration: 0.4 }, "catch")
        tl.to(c2, { yPercent: offsetIn, scale: 0.985, duration: 0.4 }, "catch")

        tl.addLabel("step1", 0)
        tl.to(c1, { opacity: 0, yPercent: -20, scale: 0.98, duration: 0.8 }, "step1")
        tl.to(c2, { yPercent: 0, scale: 1, duration: 0.8 }, "step1+=0.05")
        tl.call(() => setActiveId(ids, 1), [], "step1+=0.1")

        tl.addLabel("step2", 1)
        tl.to(c2, { opacity: 0, yPercent: -20, scale: 0.98, duration: 0.9 }, "step2")
        tl.to(c3, { opacity: 1, yPercent: 0, scale: 1, duration: 0.9 }, "step2+=0.02")
        tl.call(() => setActiveId(ids, 2), [], "step2+=0.08")

        tl.addLabel("step3", 2)
        tl.to(c3, { opacity: 0, yPercent: -20, scale: 0.98, duration: 0.9 }, "step3")
        tl.to(c4, { opacity: 1, yPercent: 0, scale: 1, duration: 0.9 }, "step3+=0.02")
        tl.call(() => setActiveId(ids, 3), [], "step3+=0.08")
      }

      mm.add("(min-width: 768px)", () => {
        buildTimelines("top 20%", 120, 10)
      })

      mm.add("(max-width: 767px)", () => {
        buildTimelines("top 10%", 100, 14)
      })

      ScrollTrigger.refresh()
    }, sectionRef)
  })
})

onBeforeUnmount(() => {
  ctx?.revert()
  mm?.revert()
  mm = null
  cleanupHeadline?.()
  cleanupHeadline = null
})
</script>

<template>
  <section ref="sectionRef" class="flex min-h-[160vh] items-start justify-center bg-white text-neutral-900">
    <div class="mx-auto w-full max-w-[1500px] px-6 py-24">
      <div class="headline-block space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
          {{ props.kicker }}
        </p>
        <h2 class="HeadlineGsapSplitText text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          {{ props.headline }}
        </h2>
        <p class="text-base text-neutral-600 sm:text-lg">
          {{ props.subhead }}
        </p>
        <div class="pt-2">
          <ButtonShine label="Hybrid Training Protocol starten" />
        </div>
      </div>

      <div class="cardsPinWrap mt-12">
        <div class="cardsWrap">
        <article
          class="yes-ident-card rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)]"
        >
          <div class="flex h-full flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-1 items-center gap-6">
              <div class="yes-ident-icon">
                <span class="yes-ident-id text-2xl font-semibold text-orange-500">{{ props.cards[0].id }}</span>
              </div>
              <div class="space-y-2">
                <p class="text-2xl font-black text-neutral-900">{{ props.cards[0].title }}</p>
                <p class="text-sm text-neutral-600">{{ props.cards[0].body }}</p>
              </div>
            </div>
            <div class="yes-ident-media"></div>
          </div>
        </article>
        <article
          class="yes-ident-card rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)]"
        >
          <div class="flex h-full flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-1 items-center gap-6">
              <div class="yes-ident-icon">
                <span class="yes-ident-id text-2xl font-semibold text-orange-500">{{ props.cards[1].id }}</span>
              </div>
              <div class="space-y-2">
                <p class="text-2xl font-black text-neutral-900">{{ props.cards[1].title }}</p>
                <p class="text-sm text-neutral-600">{{ props.cards[1].body }}</p>
              </div>
            </div>
            <div class="yes-ident-media"></div>
          </div>
        </article>
        <article
          class="yes-ident-card rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)]"
        >
          <div class="flex h-full flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-1 items-center gap-6">
              <div class="yes-ident-icon">
                <span class="yes-ident-id text-2xl font-semibold text-orange-500">{{ props.cards[2].id }}</span>
              </div>
              <div class="space-y-2">
                <p class="text-2xl font-black text-neutral-900">{{ props.cards[2].title }}</p>
                <p class="text-sm text-neutral-600">{{ props.cards[2].body }}</p>
              </div>
            </div>
            <div class="yes-ident-media"></div>
          </div>
        </article>
        <article
          class="yes-ident-card rounded-3xl border border-neutral-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.35)]"
        >
          <div class="flex h-full flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-1 items-center gap-6">
              <div class="yes-ident-icon">
                <span class="yes-ident-id text-2xl font-semibold text-orange-500">{{ props.cards[3].id }}</span>
              </div>
              <div class="space-y-2">
                <p class="text-2xl font-black text-neutral-900">{{ props.cards[3].title }}</p>
                <p class="text-sm text-neutral-600">{{ props.cards[3].body }}</p>
              </div>
            </div>
            <div class="yes-ident-media"></div>
          </div>
        </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cardsPinWrap {
  position: relative;
  width: 100%;
}

.cardsWrap {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: flex-start;
}

.cardsWrap .yes-ident-card {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: min(100%, 1500px);
  inset: 0;
  height: 100%;
}

.yes-ident-icon {
  height: 64px;
  width: 64px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
}

.yes-ident-media {
  width: 44%;
  min-width: 220px;
  height: 70%;
  border-radius: 22px;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}

@media (max-width: 767px) {
  .cardsWrap {
    height: 70vh;
  }

  .yes-ident-media {
    width: 100%;
    height: 55%;
  }

  .yes-ident-icon {
    height: 56px;
    width: 56px;
    border-radius: 16px;
  }
}
</style>
