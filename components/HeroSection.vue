<script setup lang="ts">
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'

const props = withDefaults(
  defineProps<{
    headline?: string
    subhead?: string
    ctaLabel?: string
    seoHeadline?: string
    videoMobileSrc?: string
    videoDesktopSrc?: string
  }>(),
  {
    headline: "12 Wochen. Mehr Kraft. Gleiche Routine.",
    subhead: "Krafttraining für Ausdauersportler – systematisch in dein bestehendes Training integriert.",
    ctaLabel: "Hybrid-Analyse starten",
    seoHeadline:
      "Krafttraining für Läufer & Radfahrer: Das Hybrid Training System mit EXOPEK.",
    videoMobileSrc: "/kraft-und-ausdauertraining-hybrid-mobil.mp4",
    videoDesktopSrc: "/kraft-und-ausdauertraining-hybrid.mp4",
  },
)
</script>

<template>
  <section class="hero-shell">
    <ClientOnly>
      <video
        class="absolute inset-0 z-0 h-full w-full object-cover"
        autoplay
        muted
        playsinline
        preload="metadata"
      >
        <source :src="props.videoMobileSrc" media="(max-width: 768px)" />
        <source :src="props.videoDesktopSrc" />
      </video>
    </ClientOnly>
    <div class="hero-overlay" />

    <div class="relative z-30 flex min-h-[82svh] w-full flex-col px-6 md:h-screen md:min-h-screen">
      <div class="hero-content-wrapper">
        <div class="hero-inner">
          <div class="hero-text flex w-full max-w-none flex-col items-start text-left md:w-[55%]">
            <div class="space-y-4">
              <h1 class="seo-headline text-[12px] font-light uppercase tracking-wide text-white/60">
                {{ props.seoHeadline }}
              </h1>
              <h2
                class="text-balance text-[2.4rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.7rem] md:text-[3rem] lg:text-[3.5rem]"
              >
                {{ props.headline }}
              </h2>
              <p class="text-[1.2rem] font-normal leading-tight text-white sm:text-[1.5rem] md:text-[1.8rem] lg:text-[2.2rem]">
                {{ props.subhead }}
              </p>
            </div>
            <AnalysisCtaButton
              class="mt-6"
              :label="props.ctaLabel"
              variant="hero"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-shell {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text-light);
  animation: fadeIn 0.6s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-shell {
    animation: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero-text h1 {
  color: var(--color-text-light) !important;
}

.hero-text p {
  color: var(--color-text-light) !important;
}

.hero-content-wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  z-index: 30;
}

.hero-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-text {
  opacity: 1 !important;
  text-shadow: 0 2px 12px color-mix(in srgb, var(--color-brand-dark) 60%, transparent);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--color-brand-dark) 45%, transparent);
  pointer-events: none;
  z-index: 10;
}

@media (max-width: 768px) {
  .hero-shell {
    min-height: 100svh;
  }
}
</style>
