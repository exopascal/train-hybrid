<template>
  <div class="home-page">
    <HeroSection />
    <AnimatedHeaderProgressbar />
    <IntegrationSection />
    <BannerTypo />
    <IdentificationSection />
    <ProofSection />
    <RoutineSection />
    <RucksackExopek />
    <FrameworkSection />
    <Angebot />
  </div>
</template>

<script setup lang="ts">
import AnimatedHeaderProgressbar from '~/components/AnimatedHeaderProgressbar.vue'
import HeroSection from '~/components/HeroSection.vue'
import BannerTypo from '~/components/BannerTypo.vue'
import IdentificationSection from '~/components/IdentificationSection.vue'
import RucksackExopek from '~/components/RucksackExopek.vue'
import Angebot from '~/components/Angebot.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
