<script setup lang="ts">
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    headline?: string
    subhead?: string
    ctaLabel?: string
    leftImgSrc?: string
    leftImgAlt?: string
    rightImgSrc?: string
    rightImgAlt?: string
    bgColor?: string
  }>(),
  {
    eyebrow: 'Funktionelles Krafttraining für Läufer, Radsportler und Triathleten — mehr Stabilität, weniger Verletzungen.',
    headline: 'Ausdauertraining alleine reicht nicht aus.',
    subhead: `Du läufst, du fährst Rad, du bewegst dich ständig. Das ist eine gute Grundlage. Du brauchst Krafttraining um stabil und leistungsfähig zu sein wenn's drauf ankommt — im Alltag, im Wettkampf, in den Momenten, die mehr fordern.`,
    ctaLabel: 'Kräftig drücken',
    leftImgSrc: '/coach-pascal-krafttraining-experte.jpg',
    leftImgAlt: '',
    rightImgSrc: '/kraft-trainieren-ausdauersport-coaching.png',
    rightImgAlt: 'Kraft trainieren Ausdauersport Coaching',
    bgColor: '#eeecea',
  },
)
</script>

<template>
  <section class="hero-split" :style="{ '--hero-bg': props.bgColor }">
    <div class="hero-split__grid">

      <!-- Left: portrait -->
      <div class="hero-split__col hero-split__col--left" aria-hidden="true">
        <div class="hero-split__img-wrap">
          <img
            :src="props.leftImgSrc"
            :alt="props.leftImgAlt"
            class="hero-split__img hero-split__img--coach"
            loading="eager"
            fetchpriority="high"
          />
          <div class="hero-split__img-fade hero-split__img-fade--left" />
        </div>
      </div>

      <!-- Center: text + CTA -->
      <div class="hero-split__center">
        <h1 v-if="props.eyebrow" class="hero-split__eyebrow">{{ props.eyebrow }}</h1>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h2 class="hero-split__headline" v-html="props.headline" />
        <p class="hero-split__subhead">{{ props.subhead }}</p>
        <AnalysisCtaButton :label="props.ctaLabel" variant="pill" />
      </div>

      <!-- Right: portrait -->
      <div class="hero-split__col hero-split__col--right" aria-hidden="true">
        <div class="hero-split__img-wrap">
          <img
            :src="props.rightImgSrc"
            :alt="props.rightImgAlt"
            class="hero-split__img hero-split__img--customer"
            loading="eager"
            fetchpriority="high"
          />
          <div class="hero-split__img-fade hero-split__img-fade--right" />
        </div>
      </div>

    </div>

    <!-- Bottom edge gradient so images bleed into next section -->
    <div class="hero-split__bottom-vignette" aria-hidden="true" />

    <!-- Mobile: full-width image below CTA -->
    <div class="hero-split__mobile-img" aria-hidden="true">
      <img
        :src="props.rightImgSrc"
        :alt="props.rightImgAlt"
        class="hero-split__mobile-img-el"
        loading="eager"
      />
      <div class="hero-split__mobile-img-fade" />
    </div>
  </section>
</template>

<style scoped>
.hero-split {
  --hero-bg: #eeecea;
  position: relative;
  background: var(--hero-bg);
  overflow: visible;
  z-index: 0;
}

.hero-split__grid {
  display: grid;
  grid-template-columns: clamp(200px, 26vw, 360px) 1fr clamp(200px, 26vw, 360px);
  min-height: clamp(340px, 58vh, 680px);
  align-items: stretch;
}

.hero-split__col {
  position: relative;
  padding-bottom: 80px;
}

.hero-split__img-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-split__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-split__img--coach {
  object-position: center 12%;
}

.hero-split__img--customer {
  object-position: center 12%;
}

.hero-split__img-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-split__img-fade--left {
  background:
    linear-gradient(to right, var(--hero-bg) 0%, transparent 35%),
    linear-gradient(to bottom, var(--hero-bg) 0%, transparent 18%);
}

.hero-split__img-fade--right {
  background:
    linear-gradient(to left, var(--hero-bg) 0%, transparent 35%),
    linear-gradient(to bottom, var(--hero-bg) 0%, transparent 18%);
}

.hero-split__bottom-vignette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent 0%, var(--hero-bg) 100%);
  pointer-events: none;
  z-index: 2;
}

.hero-split__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(2rem, 4vh, 4rem) clamp(1.25rem, 3vw, 3rem);
  gap: 1.5rem;
  min-width: 0;
  position: relative;
  z-index: 3;
}

.hero-split__eyebrow {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(0.9rem, 1.4vw, 1rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-brand-dark);
  text-wrap: balance;
  max-width: 34rem;
}

.hero-split__headline {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 3.5vw, 3rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--color-brand-dark);
  text-wrap: balance;
}

.hero-split__subhead {
  margin: 0;
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  font-weight: 400;
  line-height: 1.55;
  color: var(--color-text-secondary);
  text-wrap: balance;
  max-width: 34rem;
}

.hero-split__mobile-img {
  display: none;
}

@media (max-width: 860px) {
  .hero-split {
    height: 75vh;
    display: flex;
    flex-direction: column;
  }

  .hero-split__grid {
    grid-template-columns: 1fr;
    min-height: 0;
    flex-shrink: 0;
  }

  .hero-split__col {
    display: none;
  }

  .hero-split__center {
    padding: calc(var(--pre-header-height) + 1.5rem) 1.5rem 1rem;
    justify-content: center;
  }

  .hero-split__bottom-vignette {
    display: none;
  }

  .hero-split__mobile-img {
    display: block;
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .hero-split__mobile-img-el {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 12%;
    display: block;
  }

  .hero-split__mobile-img-fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--hero-bg) 0%, transparent 15%);
    pointer-events: none;
  }
}
</style>
