<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    headline?: string
    subhead?: string
    ctaLabel?: string
  }>(),
  {
    headline: "Krafttraining für Ausdauersportler",
    subhead: "Mehr Ergebnis. Gleiche Routine.",
    ctaLabel: "Hybrid Training starten",
  },
)

const emit = defineEmits<{
  (e: "cta"): void
}>()
</script>

<template>
  <section class="relative h-screen overflow-hidden bg-white text-white">
    <ClientOnly>
      <video
        class="absolute inset-0 z-0 h-full w-full object-cover"
        autoplay
        muted
        playsinline
        preload="metadata"
      >
        <source src="/kraft-und-ausdauertraining-hybrid-mobil.mp4" media="(max-width: 768px)" />
        <source src="/kraft-und-ausdauertraining-hybrid.mp4" />
      </video>
    </ClientOnly>
    <div class="hero-overlay" />

    <div class="relative z-30 flex h-screen w-full flex-col px-6">
      <div class="hero-content-wrapper">
        <div class="hero-inner">
          <div class="hero-text flex max-w-xl flex-col items-start text-left">
          <div class="space-y-4">
            <h1 class="seo-headline text-[12px] font-light uppercase tracking-wide text-white/60">
              Krafttraining für Läufer & Radfahrer: Das Hybrid Training System mit EXOPEK.
            </h1>
            <h2
              class="text-balance text-[2.2rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.6rem] md:text-[3rem] lg:text-[5rem]"
              style="color: #ffffff;"
            >
              {{ props.headline }}
            </h2>
            <p class="text-[1.5rem] font-normal leading-tight text-white sm:text-[2rem] md:text-[2.4rem] lg:text-[3rem]" style="color: #ffffff;">
              {{ props.subhead }}
            </p>
          </div>
          <button
            type="button"
            class="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            @click="emit('cta')"
          >
            {{ props.ctaLabel }}
          </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  animation: fadeIn 0.6s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  section {
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
  color: #ffffff !important;
}

.hero-text p {
  color: #ffffff !important;
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
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: none;
  z-index: 10;
}
</style>
