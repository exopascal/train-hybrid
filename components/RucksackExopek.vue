<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const props = withDefaults(
  defineProps<{
    headline?: string
    body?: string
    rightHeadline?: string
    imageSrc?: string
    logoSrc?: string
  }>(),
  {
    headline: "Leicht getragen.\nStark trainiert.\nDas ist EXOPEK.",
    rightHeadline: "2,3 kg Eigengewicht. 252kg elastischer Widerstand. Leistung unter Widerstand.",
    body:
      "EXOPEK Pro integriert effektives Krafttraining direkt in dein Lauf- oder Radtraining – ohne zusätzliche Einheiten im Fitnessstudio. Mit nur 2,3 kg Eigengewicht erzeugt das System bis zu 252 kg elastischen Widerstand. Du trägst es wie einen Rucksack und setzt gezielte Widerstandsreize während deiner normalen Bewegung. Das verändert dein Training spürbar. Mehr muskuläre Stabilität. Effizientere Kraftübertragung. Höhere Belastbarkeit im Ausdauertraining. Weniger struktureller Verschleiß bei regelmäßiger Beanspruchung. Krafttraining wird nicht ergänzt. Es wird integriert – beim Laufen, im Radsport, im Alltag. EXOPEK Pro ersetzt dein Ausdauertraining nicht. Es ergänzt es strukturell – für mehr Substanz, mehr Widerstandsfähigkeit und nachhaltige athletische Entwicklung.",
    imageSrc: "/krafttraining-ausdauersportler-mobil-outdoor-hybrid.jpg",
    logoSrc: "/Exopek_Logo_Wortmarke-Bildmarke_weiss.png",
  },
)

const rightHeadlineLineRefs = ref<HTMLElement[]>([])
let headlineAnimation: gsap.core.Tween | null = null

const setRightHeadlineLineRef = (el: HTMLElement | null) => {
  if (!el) return
  rightHeadlineLineRefs.value.push(el)
}

const rightHeadlineParts = computed(() => {
  const text = props.rightHeadline?.trim() ?? ""
  if (!text) return []
  return (
    text
      .match(/[^.!?]+(?:[.!?]+|$)/g)
      ?.map((part) => part.trim())
      .filter(Boolean) ?? [text]
  )
})

const headlineParts = computed(() => {
  const text = props.headline?.trim() ?? ""
  if (!text) return []
  return text.split("\n").map((part) => part.trim()).filter(Boolean)
})

onMounted(() => {
  if (!process.client) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  gsap.registerPlugin(ScrollTrigger)
  if (rightHeadlineLineRefs.value.length) {
    headlineAnimation = gsap.from(rightHeadlineLineRefs.value, {
      opacity: 0,
      y: 18,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: rightHeadlineLineRefs.value[0],
        start: "top 80%",
        toggleActions: "play none none none",
      },
    })
  }
})

onBeforeUnmount(() => {
  headlineAnimation?.scrollTrigger?.kill()
  headlineAnimation?.kill()
  headlineAnimation = null
})
</script>

<template>
  <section class="rucksack-exopek">
    <div class="rucksack-exopek__inner">
      <div class="rucksack-exopek__right">
        <img
          v-if="props.logoSrc"
          class="rucksack-exopek__logo"
          :src="props.logoSrc"
          alt="EXOPEK Logo"
        />
          <h2 class="rucksack-exopek__headline">
            <span v-for="(line, index) in headlineParts" :key="`hl-${index}`">
              {{ line }}
              <br v-if="index < headlineParts.length - 1" />
            </span>
          </h2>
        <div class="rucksack-exopek__image">
          <img
            v-if="props.imageSrc"
            :src="props.imageSrc"
            alt="EXOPEK Produktbild"
          />
          <div v-else class="rucksack-exopek__placeholder">
            Bild folgt
          </div>
        </div>
      </div>
      <div class="rucksack-exopek__left">
        <div class="rucksack-exopek__left-content">
          <h3 class="HeadlineGsapSplitText rucksack-exopek__right-headline">
            <span
              v-for="(line, index) in rightHeadlineParts"
              :key="`rhs-${index}`"
              :ref="setRightHeadlineLineRef"
              class="rucksack-exopek__right-line"
            >
              {{ line }}
              <br v-if="index < rightHeadlineParts.length - 1" />
            </span>
          </h3>
          <p class="rucksack-exopek__body">
            {{ props.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rucksack-exopek {
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: stretch;
  padding: 5rem 0;
}

.rucksack-exopek__inner {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.rucksack-exopek__left {
  display: flex;
  align-items: flex-end;
}

.rucksack-exopek__left-content {
  max-width: 640px;
  padding-top: 0;
  padding-bottom: 1rem;
}

.rucksack-exopek__headline {
  font-size: clamp(2.5rem, 4vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color:  #ffffff;
}

.rucksack-exopek__body {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}

.rucksack-exopek__right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.5rem;
  padding-top: 2rem;
}

.rucksack-exopek__logo {
  width: min(220px, 70vw);
  height: auto;
  display: block;
}

.rucksack-exopek__right-headline {
  font-size: clamp(2.2rem, 3.4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0;
  max-width: 60%;
  padding-bottom: 1rem;
  color: #ffffff;
}

.rucksack-exopek__right-line {
  display: block;
  white-space: nowrap;
  word-break: keep-all;
  hyphens: none;
}

.rucksack-exopek__image {
  width: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rucksack-exopek__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rucksack-exopek__placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}
</style>
