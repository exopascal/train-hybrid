<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    lineOne?: string
    lineTwo?: string
    lineThree?: string
    sentenceOne?: string
    sentenceTwo?: string
  }>(),
  {
    bgStyle: "night",
    lineOne: "Ausdauertraining reicht nicht.",
    lineTwo: "Du brauchst Krafttraining.",
    sentenceOne: "Dein Herz-Kreislauf-System ist der Motor – im Lauftraining, im Radsport und in jeder Form von Ausdauertraining. Doch deine Muskulatur ist das Fahrwerk, das Stabilität, Kraftübertragung und Gelenkschutz ermöglicht. Ohne gezieltes Krafttraining für Läufer und Radfahrer entsteht langfristig struktureller Verschleiß – selbst bei regelmäßigem Ausdauertraining. Genau hier setzt unser Hybrid Training für Ausdauersportler an. Wir integrieren effektives Krafttraining direkt in dein Laufen oder Radfahren – beim Training auf der Straße, im Gelände oder im Alltag. So verbindest du Krafttraining und Ausdauertraining sinnvoll miteinander, steigerst deine Belastbarkeit und entwickelst nachhaltige athletische Stabilität.",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
</script>

<template>
  <section :class="[sectionClass, 'identification-bg']">
    <div class="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-36">
      <div class="grid gap-12 text-left lg:grid-cols-[40%_60%] lg:gap-20">
        <div />
        <div class="w-full space-y-8">
          <div class="border-t border-white/15 pt-8">
            <p class="seo-headline scroll-fade">
              MUSKELAUFBAU ALS AUSDAUERSPORTLER: EFFIZIENTES KRAFTTRAINING OHNE FITNESSSTUDIO.
            </p>
            <div class="space-y-2 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              <p class="scroll-fade">{{ props.lineOne }}</p>
              <p class="scroll-fade">{{ props.lineTwo }}</p>
              <p class="scroll-fade">{{ props.lineThree }}</p>
            </div>
          </div>
          <div class="space-y-2 text-lg text-white/70 sm:text-xl">
            <p class="scroll-fade">{{ props.sentenceOne }}</p>
            <p class="scroll-fade">{{ props.sentenceTwo }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.identification-bg {
  position: relative;
  background-image: url("/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg");
  background-size: cover;
  background-position: 50% 60%;
  background-repeat: no-repeat;
  height: 65vh;
}

.identification-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
}

.identification-bg > * {
  position: relative;
  z-index: 1;
}

@media (min-width: 1920px) and (min-aspect-ratio: 16/9) {
  .identification-bg {
    background-image: url("/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg");
    background-position: 50% 60%;
  }
}

.scroll-fade {
  animation: fadeInUp 0.9s ease-out both;
}

.seo-headline {
  font-size: 12px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 12px;
}

@supports (animation-timeline: view()) {
  .scroll-fade {
    animation-timeline: view();
    animation-range: entry 10% cover 30%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-fade {
    animation: none;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
