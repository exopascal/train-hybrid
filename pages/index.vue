<template>
  <div class="home-page">
    <!-- HERO -->
    <HeroSplitSection />

    <!-- ERFOLGSGESCHICHTEN -->
    <SuccessStoriesSection />

    <!-- PROGRAMM-INHALTE 2×2 GRID -->
    <FeatureGrid />

    <!-- FAQ -->
    <HomeFAQSection />

    <!-- ÜBER MICH -->
    <UeberMichSection />
  </div>
</template>

<script setup lang="ts">
import HeroSplitSection from '~/components/HeroSplitSection.vue'
import FeatureGrid from '~/components/FeatureGrid.vue'
import HomeFAQSection from '~/components/HomeFAQSection.vue'
import SuccessStoriesSection from '~/components/SuccessStoriesSection.vue'
import UeberMichSection from '~/components/UeberMichSection.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* ── Shared layout ── */
.section-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-section) var(--container-padding-inline);
}

.section-container--narrow {
  max-width: 52rem;
}

.section-eyebrow {
  margin: 0 0 var(--spacing-comfortable);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
}

</style>
