<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    headline?: string
    subhead?: string
  }>(),
  {
    bgStyle: "charcoal",
    headline: "Was ist dir dein Körper wert, wenn er langfristig belastbar bleiben soll?",
    subhead: "Wähle dein Hybrid-Niveau",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])

const cardRefs = ref<HTMLElement[]>([])
const cleanupHoverHandlers: Array<() => void> = []
const setCardRef = (el: HTMLElement | null) => {
  if (!el) return
  cardRefs.value.push(el)
}

onMounted(async () => {
  await nextTick()
  const gsapModule = await import("gsap")
  const gsap = gsapModule.gsap

  cardRefs.value.forEach((card) => {
    const onEnter = () => {
      cardRefs.value.forEach((other) => {
        if (other !== card) {
          other.classList.add("is-dim")
        }
      })
      card.classList.add("is-hover")
      gsap.killTweensOf(card)
      gsap.to(card, {
        y: -8,
        scale: 1.03,
        duration: 0.22,
        ease: "power2.out",
      })
    }

    const onLeave = () => {
      cardRefs.value.forEach((other) => {
        other.classList.remove("is-dim")
      })
      card.classList.remove("is-hover")
      gsap.killTweensOf(card)
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.22,
        ease: "power2.out",
      })
    }

    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mouseleave", onLeave)
    cleanupHoverHandlers.push(() => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mouseleave", onLeave)
    })
  })
})

onBeforeUnmount(() => {
  cleanupHoverHandlers.forEach((cleanup) => cleanup())
})
</script>

<template>
  <section :class="[sectionClass, 'angebot-light']">
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:py-32">
      <div class="space-y-6 text-left">
        <p class="angebot-headline text-4xl font-semibold leading-tight sm:text-5xl pb-8">
          {{ props.headline }}
        </p>
        <p class="text-lg text-white/70 sm:text-xl">
          {{ props.subhead }}
        </p>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-3">
        <article
          :ref="setCardRef"
          class="angebot-card flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <div class="space-y-2">
            <h3 class="text-2xl font-semibold text-black">Train Hybrid</h3>
            <p class="text-sm uppercase tracking-[0.2em] text-white/60">Für Selbstständige.</p>
            <p class="text-white/70">
              Du möchtest die Methode eigenständig umsetzen.
            </p>
          </div>
          <div class="mt-6 h-px w-full bg-white/10"></div>
          <p class="mt-6 text-sm uppercase tracking-[0.2em] text-white/60">Enthalten</p>
          <ul class="offer-list mt-4 space-y-2 text-sm text-white/80 sm:text-base">
            <li>
              <span class="offer-check">✅</span>
              <span>EXOPEK Pro</span>
            </li>
            <li>
              <span class="offer-check">✅</span>
              <span>kostenlose 12-Wochen Train Hybrid PDF</span>
            </li>
          </ul>
          <p class="mt-6 text-sm uppercase tracking-[0.2em] text-white/60">Nicht enthalten</p>
          <div class="mt-6 text-sm text-white/60">
            ❌ Kein Onboarding.
            <br />
            ❌ Kein Feedback.
            <br />
            ❌ Kein persönlicher Kontakt.
              <br />
            ❌ Keine Checkpoints.
          </div>
          <div class="mt-6 text-2xl font-semibold text-white">295 € einmalig</div>
        </article>

        <article
          :ref="setCardRef"
          class="angebot-card flex h-full flex-col rounded-3xl border border-white/30 bg-white/10 p-6 sm:p-8"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-semibold text-black">Hybrid Training Protokoll</h3>
            </div>
             <p class="text-sm uppercase tracking-[0.2em] text-white/60">Inklusive persönlicher Betreuung.</p>
            <p class="text-white/70">
              12 Wochen Struktur. Klare Progression. Messbare Belastbarkeit.
            </p>
            <div class="mt-6 rounded-2xl border border-white/30 bg-white/10 p-4">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Garantie
            </p>
            <p class="mt-3 text-base font-semibold text-white">
             Wenn du den Zyklus vollständig umsetzt und nach 12 Wochen keine Erfolge erzielt hast, wiederholen wir ihn vollständig — kostenlos.
            </p>
          </div>
          </div>
          <div class="mt-6 h-px w-full bg-white/10"></div>
          <p class="mt-6 text-sm uppercase tracking-[0.2em] text-white/60">Zustzlich enthalten</p>
          <ul class="offer-list mt-4 space-y-2 text-sm text-white/80 sm:text-base">
            <li>
              <span class="offer-check">✅</span>
              <span>Persönliches Onboarding</span>
            </li>
            <li>
              <span class="offer-check">✅</span>
              <div>
                <span>4 strukturierte 20-Minuten Performance-Checkpoints</span>
                <ul class="offer-sublist mt-2 space-y-1 text-sm text-white/70 sm:text-base">
                </ul>
              </div>
            </li>
            <li>
              <span class="offer-check">✅</span>
              <span>Progression erfolgt nur nach Checkpoint-Freigabe</span>
            </li>
            <li>
              <span class="offer-check">✅</span>
              <span>Abschlussbewertung &amp; nächste Trainingsstrategie</span>
            </li>
          </ul>
          <div class="mt-6 text-2xl font-semibold text-white">497 € für 12 Wochen</div>
          <a
            href="#erstgespraech"
            class="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Kostenloses Erstgespräch vereinbaren
          </a>
        </article>

        <article
          :ref="setCardRef"
          class="angebot-card flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <div class="space-y-2">
            <h3 class="text-2xl font-semibold text-black">Personal Hybrid Training</h3>
            <p class="text-sm uppercase tracking-[0.2em] text-white/60">Noch 3 Plätze verfügbar.</p>
            <p class="text-white/70">
              Persönliche Trainingssteuerung
              <br />
              für maximale Wirkung.
            </p>
          </div>
          <div class="mt-6 h-px w-full bg-white/10"></div>
          <p class="mt-6 text-sm uppercase tracking-[0.2em] text-white/60">Zusätzlich enthalten</p>
          <ul class="offer-list mt-4 space-y-2 text-sm text-white/80 sm:text-base">
            <li>
              <span class="offer-check">✅</span>
              <span>Individuelle Planung</span>
            </li>
            <li>
              <span class="offer-check">✅</span>
              <span>12 Personal Trainings</span>
            </li>
            <li>
              <span class="offer-check">✅</span>
              <span>Kontinuierliche Betreuung</span>
            </li>
          </ul>
          <a
            href="#bewerbung"
            class="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Jetzt bewerben
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
<style scoped>
.angebot-light {
  background: #f1f5f9;
  color: #0f172a;
}

.angebot-light .text-white {
  color: #0f172a !important;
}

.angebot-light :is(.text-white\/70, .text-white\/60, .text-white\/80) {
  color: rgba(15, 23, 42, 0.7) !important;
}

.angebot-light .border-white\/10 {
  border-color: rgba(15, 23, 42, 0.12) !important;
}

.angebot-light :is(.border-white\/30, .border-white\/40) {
  border-color: rgba(15, 23, 42, 0.2) !important;
}

.angebot-light :is(.bg-white\/5, .bg-white\/10) {
  background: #ffffff !important;
}

.angebot-light .bg-white\/10.p-6,
.angebot-light .bg-white\/10.p-8 {
  background: #f8fafc !important;
}

.angebot-light .bg-white\/10.p-4 {
  background: rgba(15, 23, 42, 0.04) !important;
  border-color: rgba(15, 23, 42, 0.2) !important;
  box-shadow: none;
}

.angebot-light .bg-white\/10 {
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
}

.angebot-light .bg-white\/5 {
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
}

.angebot-light .h-px.bg-white\/10 {
  background: rgba(15, 23, 42, 0.12) !important;
}

.angebot-light .angebot-card {
  position: relative;
  transform-origin: center;
  box-shadow:
    0 12px 24px rgba(15, 23, 42, 0.08),
    0 0 0 1px var(--card-glow-line),
    0 0 10px var(--card-glow-soft),
    0 0 22px var(--card-glow-far);
}

.angebot-light .angebot-card::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 28px;
  border: 1px solid var(--card-glow-line);
  box-shadow: 0 0 10px var(--card-glow-soft);
  pointer-events: none;
}

.angebot-light .angebot-card {
  --card-glow-line: rgba(255, 106, 0, 0.2);
  --card-glow-soft: rgba(255, 106, 0, 0.14);
  --card-glow-far: rgba(255, 106, 0, 0.09);
  border-color: rgba(255, 106, 0, 0.3) !important;
}

.angebot-light .angebot-card:nth-of-type(1) {
  --card-glow-line: rgba(255, 160, 60, 0.2);
  --card-glow-soft: rgba(255, 160, 60, 0.14);
  --card-glow-far: rgba(255, 160, 60, 0.09);
  border-color: rgba(255, 160, 60, 0.3) !important;
}

.angebot-light .angebot-card:nth-of-type(3) {
  --card-glow-line: rgba(255, 80, 40, 0.2);
  --card-glow-soft: rgba(255, 80, 40, 0.14);
  --card-glow-far: rgba(255, 80, 40, 0.09);
  border-color: rgba(255, 80, 40, 0.3) !important;
}

.angebot-light .angebot-card.is-dim {
  --card-glow-line: rgba(15, 23, 42, 0);
  --card-glow-soft: rgba(15, 23, 42, 0);
  --card-glow-far: rgba(15, 23, 42, 0);
  border-color: rgba(15, 23, 42, 0.12) !important;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.angebot-headline {
  color: #020617 !important;
}


.offer-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.offer-sublist {
  margin-left: 26px;
}

.offer-sublist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.offer-check {
  display: inline-flex;
  line-height: 1.2;
  flex: 0 0 auto;
}
</style>
