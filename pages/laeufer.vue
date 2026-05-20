<template>
  <div class="audience-page">
    <HeroSection
      headline="12 Wochen. Mehr Kraft. Spuerbar staerker."
      subhead="Fuer Laeufer klar in die Routine integriert, damit Stabilitaet und Vortrieb unter Belastung nicht wegbrechen."
      cta-label="Analyse fuer Laeufer starten"
    />
    <BannerTypo />
    <PerformanceIntro />
    <TrainHybridMethod />
    <AnimatedHeaderProgressbar />
    <IntegrationSection />
    <IdentificationSection audience="runner" />
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
</template>

<script setup lang="ts">
import AnimatedHeaderProgressbar from '~/components/AnimatedHeaderProgressbar.vue'
import PerformanceIntro from '~/components/design-system-section-components/PerformanceIntro.vue'
import HeroSection from '~/components/HeroSection.vue'
import BannerTypo from '~/components/BannerTypo.vue'
import IdentificationSection from '~/components/IdentificationSection.vue'
import TrainHybridMethod from '~/components/TrainHybridMethod.vue'
import RucksackExopek from '~/components/RucksackExopek.vue'
import Angebot from '~/components/Angebot.vue'
import FAQSection from '~/components/FAQSection.vue'

const { setSportMode } = useSportMode()
setSportMode('runner')
</script>
