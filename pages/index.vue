<template>
  <div class="home-page">
    <IntroHeroSection />
    <div class="intro-spacer" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import IntroHeroSection from '~/components/IntroHeroSection.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.intro-spacer {
  height: 100svh;
}
</style>
