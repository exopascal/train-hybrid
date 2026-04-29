<script setup lang="ts">
import { computed } from "vue"
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

type Audience = "runner" | "cyclist"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    lineOne?: string
    lineTwo?: string
    lineThree?: string
    seoHeadline?: string
    sentenceOne?: string
    sentenceTwo?: string
    audience?: Audience | null
  }>(),
  {
    bgStyle: "night",
    lineOne: "Herzgesundheit verlängert dein Leben.",
    lineTwo: "Muskelkraft bestimmt, wie du es lebst.",
    lineThree: "Belastbarkeit entsteht erst, wenn du beides trainierst.",
    seoHeadline:
      "MUSKELAUFBAU ALS AUSDAUERSPORTLER: EFFIZIENTES KRAFTTRAINING OHNE FITNESSSTUDIO.",
    sentenceOne: "Dein Herz-Kreislauf-System ist der Motor – im Lauftraining, im Radsport und in jeder Form von Ausdauertraining. Doch deine Muskulatur ist das Fahrwerk. Sie entscheidet über Stabilität, Kraftübertragung und Gelenkschutz. Ohne gezieltes Krafttraining für Läufer und Radfahrer entsteht langfristig struktureller Verschleiß – selbst bei regelmäßigem Ausdauertraining. Genau diese Lücke schließt unser Hybrid Training für Ausdauersportler. Wir integrieren effektives Krafttraining direkt in dein Laufen oder Radfahren – strukturiert, progressiv und ohne zusätzliche Trainingstage. So verbindest du Krafttraining und Ausdauertraining sinnvoll miteinander, steigerst deine Belastbarkeit und entwickelst eine Struktur, die Leistung langfristig trägt.",
    audience: null,
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])

const content = computed(() => {
  if (props.audience === "runner") {
    return {
      lineOne: "Jeder Lauf lebt von Stabilitaet.",
      lineTwo: "Jede stabile Landung spart Energie.",
      lineThree: "Mehr Kraft macht dich als Laeufer belastbarer.",
      sentenceOne:
        "Beim Laufen entscheidet nicht nur deine Ausdauer ueber Fortschritt, sondern wie sauber du bei jedem Schritt Kraft aufnimmst und wieder abgibst. Genau dort setzt gezieltes Krafttraining fuer Laeufer an: bessere Laufoekonomie, mehr Stabilitaet im Becken, weniger strukturelle Ueberlastung und eine Routine, die sich in dein bestehendes Lauftraining einfuegt.",
      sentenceTwo:
        "Train Hybrid verbindet Kraft und Lauftraining so, dass du nicht mehr machst, sondern sinnvoller trainierst.",
    }
  }

  if (props.audience === "cyclist") {
    return {
      lineOne: "Mehr Watt beginnt nicht nur am Pedal.",
      lineTwo: "Sie beginnt in Stabilitaet und Kraftuebertragung.",
      lineThree: "Mehr Kraft macht dich als Radfahrer belastbarer.",
      sentenceOne:
        "Im Radsport limitiert selten nur die Ausdauer. Haefig fehlt die stabile Basis fuer Druck aufs Pedal, Haltung unter Belastung und saubere Kraftuebertragung ueber laengere Einheiten. Genau dort setzt gezieltes Krafttraining fuer Radfahrer an: mehr Spannung im System, weniger Beschwerden und eine Athletik-Routine, die dein Radtraining unterstuetzt statt stoert.",
      sentenceTwo:
        "Train Hybrid integriert Krafttraining in dein bestehendes Setup, damit du robuster wirst, ohne weitere Trainingstage anzusammeln.",
    }
  }

  return {
    lineOne: props.lineOne,
    lineTwo: props.lineTwo,
    lineThree: props.lineThree,
    sentenceOne: props.sentenceOne,
    sentenceTwo: props.sentenceTwo,
  }
})
</script>

<template>
  <section :class="[sectionClass, 'identification-bg']">
    <div class="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-36">
      <div class="grid gap-12 text-left lg:grid-cols-[35%_65%] lg:gap-20">
        <div />
        <div class="w-full space-y-8">
          <div class="border-t border-white/15 pt-8">
            <p class="seo-headline scroll-fade">
              {{ props.seoHeadline }}
            </p>
            <div class="space-y-2 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              <p class="scroll-fade">{{ content.lineOne }}</p>
              <p class="scroll-fade">{{ content.lineTwo }}</p>
              <p v-if="content.lineThree" class="scroll-fade">{{ content.lineThree }}</p>
            </div>
          </div>
          <div class="space-y-2 text-lg text-white/70 sm:text-xl">
            <p class="scroll-fade">{{ content.sentenceOne }}</p>
            <p v-if="content.sentenceTwo" class="scroll-fade">{{ content.sentenceTwo }}</p>
          </div>
          <NuxtLink to="/blog" class="identification-blog-link scroll-fade">
            Hybrid Training für Ausdauersportler verstehen →
          </NuxtLink>
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

.identification-blog-link {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  padding-bottom: 2px;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.identification-blog-link:hover {
  color: rgba(255, 255, 255, 0.88);
  border-color: rgba(255, 255, 255, 0.75);
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
