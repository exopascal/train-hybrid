<template>
  <div class="home-page">
    <IntroHeroSection />
    <div class="intro-spacer" aria-hidden="true" />
    <div class="home-page__overlay">
      <HeroSection
        :headline="heroContent.headline"
        :subhead="heroContent.subhead"
        :cta-label="heroContent.ctaLabel"
      />
      <BannerTypo v-bind="firstBannerContent" />
      <PerformanceIntro />
      <TrainHybridMethod />
      <AnimatedHeaderProgressbar />
      <IntegrationSection />
      <IdentificationSection :audience="selectedAudience" />
      <ProofSection />
      <RoutineSection />
      <RucksackExopek />
      <FrameworkSection />
      <BannerTypo
        top-text="Nicht Irgendwie. Irgendwo. Irgendwann."
        bottom-text="Sondern jetzt."
      />
      <Angebot />
      <FAQSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedHeaderProgressbar from '~/components/AnimatedHeaderProgressbar.vue'
import PerformanceIntro from '~/components/design-system-section-components/PerformanceIntro.vue'
import HeroSection from '~/components/HeroSection.vue'
import IntroHeroSection from '~/components/IntroHeroSection.vue'
import BannerTypo from '~/components/BannerTypo.vue'
import IdentificationSection from '~/components/IdentificationSection.vue'
import TrainHybridMethod from '~/components/TrainHybridMethod.vue'
import RucksackExopek from '~/components/RucksackExopek.vue'
import Angebot from '~/components/Angebot.vue'
import FAQSection from '~/components/FAQSection.vue'

const { sportMode: selectedAudience, setSportMode } = useSportMode()

const heroContent = computed(() => {
  if (selectedAudience.value === 'runner') {
    return {
      headline: '12 Wochen. Mehr Kraft. Spuerbar staerker.',
      subhead: 'Fuer Laeufer klar in die Routine integriert, damit Stabilitaet und Vortrieb unter Belastung nicht wegbrechen.',
      ctaLabel: 'Analyse fuer Laeufer starten',
    }
  }

  if (selectedAudience.value === 'cyclist') {
    return {
      headline: '12 Wochen. Mehr Kraft. Spuerbar staerker.',
      subhead: 'Fuer Radfahrer systematisch integriert, damit Kraftuebertragung und Druck aufs Pedal nicht dem Zufall ueberlassen bleiben.',
      ctaLabel: 'Analyse fuer Radfahrer starten',
    }
  }

  return {
    headline: '12 Wochen. Mehr Kraft. Spuerbar staerker.',
    subhead: 'Ein 12-Wochen-System, das Krafttraining sauber in deine Ausdauerroutine integriert.',
    ctaLabel: 'Hybrid-Analyse starten',
  }
})

const firstBannerContent = computed(() => {
  if (selectedAudience.value === 'cyclist') {
    return { topText: 'Stabil ins Pedal.', bottomText: 'Mehr Watt treten.' }
  }
  return {}
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.intro-spacer {
  height: 100svh;
}

.home-page__overlay {
  position: relative;
  z-index: 20;
}
</style>
