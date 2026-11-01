<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useFragebogenStore } from '~/stores/fragebogen'
import FragebogenDev from './FragebogenDev.vue'
import StepAds from './StepAds.vue'
import StepEmail from './StepEmail.vue'
import StepHeadline from './StepHeadline.vue'
import StepIntro from './StepIntro.vue'
import StepMulti from './StepMulti.vue'
import StepOffer from './StepOffer.vue'
import StepPairs from './StepPairs.vue'
import StepPlan from './StepPlan.vue'
import StepRatings from './StepRatings.vue'
import StepReagiert from './StepReagiert.vue'
import StepSingle from './StepSingle.vue'
import StepSlider from './StepSlider.vue'
import StepTerm from './StepTerm.vue'
import StepText from './StepText.vue'
import StepThanks from './StepThanks.vue'
import StepTransition from './StepTransition.vue'
import StepYesNo from './StepYesNo.vue'

const store = useFragebogenStore()
const card = ref<HTMLElement | null>(null)
const taps = ref(0)
const confirmRestart = ref(false)
let tapTimer: ReturnType<typeof setTimeout> | undefined

const MAP: Record<string, any> = {
  intro: StepIntro, transition1: StepTransition, transition2: StepTransition, slider: StepSlider, ratings: StepRatings,
  single: StepSingle, multi: StepMulti, yesno: StepYesNo, reagiert: StepReagiert, long: StepText, term: StepTerm,
  pairs: StepPairs, ads: StepAds, headline: StepHeadline, plan: StepPlan, offer: StepOffer, email: StepEmail, thanks: StepThanks,
}
const comp = computed(() => (store.current ? MAP[store.current.kind] : null))
const phaseLabel = computed(() => (store.current?.phase ? `Phase ${store.current.phase} von 3 · Schritt ${store.current.step} von ${store.totalSteps}` : ''))
const nextLabel = computed(() => {
  const k = store.current?.kind
  if (k === 'intro') return 'Los geht’s'
  if (k === 'email') return store.busy ? 'Speichere …' : 'Abschicken'
  return 'Weiter'
})

function brandTap() {
  taps.value++
  clearTimeout(tapTimer)
  tapTimer = setTimeout(() => (taps.value = 0), 1500)
  if (taps.value >= 5) { taps.value = 0; store.setDev(!store.devOn) }
}
function restart() {
  if (!confirmRestart.value) {
    confirmRestart.value = true
    setTimeout(() => (confirmRestart.value = false), 3000)
    return
  }
  confirmRestart.value = false
  store.restart()
}

watch(() => store.idx, async () => {
  await nextTick()
  window.scrollTo({ top: 0 })
  card.value?.querySelector<HTMLElement>('[tabindex="-1"]')?.focus({ preventScroll: true })
})
</script>

<template>
  <main class="fb" :class="{ 'fb--dev': store.devOn }">
    <div class="fb__wrap">
      <div class="fb__brand">
        <button type="button" class="fb__ghost" aria-label="Train Hybrid" @click="brandTap">Train Hybrid</button>
        <span class="fb__dots" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div v-if="store.current?.step" class="fb__progress">
        <div class="fb__progress-label">{{ phaseLabel }}</div>
        <div class="fb__track"><div class="fb__bar" :style="{ width: `${store.progressPct}%` }" /></div>
      </div>
      <section ref="card" class="fb__card" aria-live="polite">
        <component :is="comp" v-if="comp && store.current" :key="store.current.id" :screen="store.current" />
      </section>
      <div v-if="store.current && store.current.kind !== 'thanks'" class="fb__nav">
        <button v-if="store.canBack" type="button" class="fb__ghost" @click="store.back()">Zurück</button>
        <button type="button" class="btn-main" :disabled="store.nextDisabled" @click="store.next()">{{ nextLabel }}</button>
      </div>
      <button v-if="store.idx > 0" type="button" class="fb__link" @click="restart">{{ confirmRestart ? 'Wirklich? Nochmal tippen' : 'Von vorn beginnen' }}</button>
    </div>
    <FragebogenDev v-if="store.devOn" />
  </main>
</template>
