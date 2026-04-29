<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TrainingRadBackground from '~/components/trainingrad/TrainingRadBackground.vue'
import TrainingRadHero from '~/components/trainingrad/TrainingRadHero.vue'
import TrainingRadHighlights from '~/components/trainingrad/TrainingRadHighlights.vue'
import TrainingRadProgram from '~/components/trainingrad/TrainingRadProgram.vue'

const pageRef = ref<HTMLElement | null>(null)

const highlightCards = [
  {
    number: '01',
    title: 'Watt und Kraftuebertragung',
    text: 'Gezieltes Krafttraining fuer Radfahrer verbessert die Ansteuerung in Huefte, Rumpf und Beinachse. Das ist relevant fuer mehr Druck aufs Pedal, mehr Watt aus den Beinen und weniger Energieverlust.',
  },
  {
    number: '02',
    title: 'Unterer Ruecken und Core',
    text: 'Wenn der untere Ruecken beim Radfahren frueh dicht macht, fehlt oft nicht nur Mobilitaet, sondern vor allem stabile Kraft um Becken, Rumpf und Schulterguertel. Genau dort setzt das Training an.',
  },
  {
    number: '03',
    title: 'Verletzungspraevention im Radsport',
    text: 'Athletiktraining fuer Radfahrer adressiert Dysbalancen, Sitzpositionsstress und fehlende Stabilitaet. Das senkt das Risiko fuer Ueberlastungen in Knie, unterem Ruecken und Schulter.',
  },
] as const

const stats = [
  { value: 2, label: 'Krafteinheiten / Woche' },
  { value: 12, label: 'Wochen strukturierte Progression' },
  { value: 100, suffix: '%', label: 'Auf Radfahrer ausgerichtet' },
] as const

const modules = [
  {
    title: 'Unterkoerperkraft',
    text: 'Knie dominante und hueftdominante Muster fuer mehr Kraftentfaltung, bessere Beschleunigung und stabilen Druck an Anstiegen.',
  },
  {
    title: 'Core und Rotation',
    text: 'Anti-Rotation, Rumpfspannung und Atemmechanik fuer Stabilitaet in Unterlenker, Aero-Position und zur Entlastung des unteren Rueckens unter Ermuedung.',
  },
  {
    title: 'Lumbale Belastbarkeit',
    text: 'Gezielte Arbeit fuer Gesaess, hintere Kette und Beckenkontrolle, damit der untere Ruecken auf langen Ausfahrten nicht zum limitierenden Faktor wird.',
  },
  {
    title: 'Timing in der Woche',
    text: 'Krafttraining wird so platziert, dass Intervalle, lange Ausfahrten und Regeneration weiterhin zusammenpassen.',
  },
] as const

const events = [
  {
    date: 'Baustein 01',
    name: 'Analyse deiner aktuellen Radwoche',
    meta: 'Belastung, Ermuedungsmuster, limitierende Muskelgruppen und sinnvolle Platzierung von Krafttraining fuer Radfahrer.',
  },
  {
    date: 'Baustein 02',
    name: 'Progressives Athletiktraining fuer Rennradfahrer',
    meta: 'Kraft, Rumpfstabilitaet, Stabi Uebungen fuer Radfahrer, Gesaessarbeit und passende Dosierung ueber mehrere Wochen.',
  },
  {
    date: 'Baustein 03',
    name: 'Transfer auf die Strasse',
    meta: 'Ziel ist nicht Krafttraining um des Krafttrainings willen, sondern bessere Performance auf Anstiegen, im Wind und mit weniger Druck im unteren Ruecken.',
  },
] as const

let statTriggers: ScrollTrigger[] = []

onMounted(() => {
  if (!process.client || !pageRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  const revealItems = pageRef.value.querySelectorAll<HTMLElement>('[data-reveal]')
  revealItems.forEach((element, index) => {
    gsap.set(element, { opacity: 0, y: 28 })
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: index < 4 ? 0.12 * index : 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 84%',
        once: true,
      },
    })
  })

  const statItems = pageRef.value.querySelectorAll<HTMLElement>('[data-stat]')
  statItems.forEach((element) => {
    const valueNode = element.querySelector<HTMLElement>('.trainingrad-stat__value')
    const target = Number(element.dataset.target || 0)
    const suffix = element.dataset.suffix || ''
    if (!valueNode) return

    gsap.set(element, { opacity: 0, y: 22 })
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
        gsap.to({ value: 0 }, {
          value: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() {
            valueNode.textContent = `${Math.round((this.targets()[0] as { value: number }).value)}${suffix}`
          },
        })
      },
    })
    statTriggers.push(trigger)
  })
})

onBeforeUnmount(() => {
  statTriggers.forEach((trigger) => trigger.kill())
  statTriggers = []
})
</script>

<template>
  <main ref="pageRef" class="trainingrad-page">
    <TrainingRadBackground />
    <div class="trainingrad-page__content">
      <TrainingRadHero />
      <TrainingRadHighlights :cards="highlightCards" :stats="stats" />
      <TrainingRadProgram :modules="modules" :events="events" />
    </div>
  </main>
</template>

<style scoped>
.trainingrad-page {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
  --trainingrad-text: var(--color-text-light);
}

.trainingrad-page__content {
  position: relative;
  z-index: 1;
}
</style>
