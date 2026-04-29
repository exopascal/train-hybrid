<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const pillars = [
  {
    index: '01',
    title: 'Muskeltraining',
    text: 'Mehr Stabilitaet, mehr Kraftuebertragung, weniger strukturelle Schwaechen unter Belastung.',
  },
  {
    index: '02',
    title: 'Ausdauertraining',
    text: 'Mehr Kapazitaet, mehr Temporesistenz und eine Basis, die dich laenger leistungsfaehig haelt.',
  },
  {
    index: '03',
    title: 'Fuer deine Leistung',
    text: 'Beides zusammen schafft einen Koerper, der nicht nur fit ist, sondern Belastung wirklich traegt.',
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const imageWrapRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const trackWrapRef = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(async () => {
  if (!process.client) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.innerWidth < 768) return

  const gsapModule = await import('gsap')
  const stModule = await import('gsap/ScrollTrigger')
  const gsap = gsapModule.gsap || gsapModule.default || gsapModule
  const ScrollTrigger = stModule.ScrollTrigger || stModule.default || stModule

  gsap.registerPlugin(ScrollTrigger)
  await nextTick()

  if (!sectionRef.value || !imageWrapRef.value || !trackRef.value || !trackWrapRef.value) return

  const ctx = gsap.context(() => {
    const getDistance = () =>
      trackRef.value!.scrollWidth - trackWrapRef.value!.clientWidth + 48

    // Pinned horizontal scroll
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        invalidateOnRefresh: true,
      },
    }).to(trackRef.value, {
      x: () => -getDistance(),
      ease: 'none',
    })

    // Image fades out in first ~35% of scroll distance
    gsap.to(imageWrapRef.value, {
      opacity: 0,
      xPercent: -12,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: sectionRef.value,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${getDistance() * 0.35}`,
        invalidateOnRefresh: true,
      },
    })
  }, sectionRef.value)

  cleanup = () => ctx.revert()
})

onBeforeUnmount(() => {
  cleanup?.()
  cleanup = null
})
</script>

<template>
  <section ref="sectionRef" class="perf">
    <!-- Left panel -->
    <div class="perf__left">
      <div ref="imageWrapRef" class="perf__image-wrap" aria-hidden="true">
        <img
          class="perf__image"
          src="/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg"
          alt=""
          loading="lazy"
        />
      </div>

      <div class="perf__copy">
        <p class="perf__eyebrow">Worum es hier geht</p>
        <h2 class="perf__title">
          Muskeltraining trifft Ausdauertraining.
          <span class="perf__title-accent">Fuer deine Leistung.</span>
        </h2>
        <p class="perf__lead">
          <strong>Train Hybrid</strong> verbindet gezieltes Krafttraining mit intelligenter
          Ausdauerarbeit — als System fuer Menschen, die leistungsfaehiger und stabiler werden wollen.
        </p>
        <NuxtLink to="/hybrid-protokoll" class="perf__link">
          Das Hybrid-Protokoll ansehen
        </NuxtLink>
      </div>
    </div>

    <!-- Right panel: horizontal card track -->
    <div ref="trackWrapRef" class="perf__track-wrap">
      <div ref="trackRef" class="perf__track">
        <article v-for="pillar in pillars" :key="pillar.index" class="perf__card">
          <span class="perf__card-index">{{ pillar.index }}</span>
          <h3 class="perf__card-title">{{ pillar.title }}</h3>
          <p class="perf__card-text">{{ pillar.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.perf {
  position: relative;
  display: flex;
  align-items: stretch;
  height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background-secondary) 38%, var(--color-background)) 0%,
      var(--color-background) 100%
    );
}

/* ── Left panel ── */
.perf__left {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  width: 42%;
  padding: var(--spacing-4xl) var(--spacing-2xl) var(--spacing-4xl) clamp(var(--spacing-xl), 5vw, var(--spacing-4xl));
  overflow: hidden;
}

.perf__image-wrap {
  position: absolute;
  inset: 0;
  will-change: opacity, transform;
}

.perf__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

/* gradient so text stays legible over image */
.perf__left::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-background) 92%, transparent) 0%,
    color-mix(in srgb, var(--color-background) 60%, transparent) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.perf__copy {
  position: relative;
  z-index: 1;
}

.perf__eyebrow {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brand-secondary);
}

.perf__title {
  margin: 0;
  font-size: clamp(var(--font-size-2xl), 3.2vw, var(--font-size-5xl));
  line-height: 0.95;
  text-transform: uppercase;
}

.perf__title-accent {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--color-brand-accent);
}

.perf__lead {
  margin: var(--spacing-lg) 0 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
  max-width: 30rem;
}

.perf__link {
  display: inline-flex;
  align-items: center;
  margin-top: var(--spacing-xl);
  padding-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-brand-primary);
  border-bottom: 1px solid color-mix(in srgb, var(--color-brand-primary) 32%, transparent);
}

.perf__link:hover {
  color: var(--color-brand-accent);
  border-color: color-mix(in srgb, var(--color-brand-accent) 36%, transparent);
}

/* ── Right panel (track) ── */
.perf__track-wrap {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.perf__track {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl) var(--spacing-4xl) var(--spacing-2xl) var(--spacing-xl);
  will-change: transform;
}

.perf__card {
  flex-shrink: 0;
  width: clamp(300px, 36vw, 480px);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-3xl);
  border: 1px solid color-mix(in srgb, var(--color-text-muted) 22%, transparent);
  border-radius: var(--card-border-radius);
  background: color-mix(in srgb, var(--color-background-secondary) 60%, var(--color-background));
}

.perf__card-index {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.1em;
  color: var(--color-brand-accent);
}

.perf__card-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.1;
  text-transform: uppercase;
}

.perf__card-text {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}

/* ── Mobile: vertical layout, native horizontal card scroll ── */
@media (max-width: 767px) {
  .perf {
    height: auto;
    flex-direction: column;
    overflow: visible;
  }

  .perf__left {
    width: 100%;
    min-height: 60vw;
    padding: var(--spacing-3xl) var(--container-padding) var(--spacing-2xl);
  }

  .perf__track-wrap {
    overflow: visible;
  }

  .perf__track {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: var(--spacing-xl) var(--container-padding) var(--spacing-3xl);
  }

  .perf__card {
    scroll-snap-align: start;
    width: 80vw;
  }
}
</style>
