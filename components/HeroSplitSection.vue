<script setup lang="ts">
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'
</script>

<template>
  <section class="hero-split">
    <div class="hero-split__grid">

      <!-- Left: coach / trainer portrait -->
      <div class="hero-split__col hero-split__col--left" aria-hidden="true">
        <div class="hero-split__img-wrap">
          <img
            src="/coach-pascal-krafttraining-experte.jpg"
            alt=""
            class="hero-split__img hero-split__img--coach"
            loading="eager"
            fetchpriority="high"
          />
          <div class="hero-split__img-fade hero-split__img-fade--left" />
        </div>
      </div>

      <!-- Center: text + CTA -->
      <div class="hero-split__center">
        <h1 class="hero-split__headline">
          Trainierst du Kraft,<br />oder nur Ausdauer?
        </h1>
        <p class="hero-split__subhead">
         Du läufst, du fährst Rad, du bist ständig in Bewegung. Trotzdem verlierst du Muskelmasse. 
        </p>
        <h2 class="hero-split__headline2">
        Ich zeige dir wie du Krafttraining nahtlos in deine Ausdauerroutine integrierst.
        </h2>
        <AnalysisCtaButton label="Kräftig drücken" variant="pill" />
      </div>

      <!-- Right: coach / trainer portrait -->
      <div class="hero-split__col hero-split__col--right" aria-hidden="true">
        <div class="hero-split__img-wrap">
          <img
            src="/coach-pascal-krafttraining-experte.jpg"
            alt=""
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
  </section>
</template>

<style scoped>
/* ── Shell ────────────────────────────────────────────────── */
.hero-split {
  position: relative;
  background: #eeecea;
  overflow: visible;
  z-index: 0;
}

/* ── 3-col grid ───────────────────────────────────────────── */
.hero-split__grid {
  display: grid;
  grid-template-columns: clamp(200px, 26vw, 360px) 1fr clamp(200px, 26vw, 360px);
  min-height: clamp(340px, 58vh, 680px);
  align-items: stretch;
}

/* ── Image columns ────────────────────────────────────────── */
.hero-split__col {
  position: relative;
  /* images protrude 80px below the section */
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

/* Coach portrait: keep head/upper body in frame */
.hero-split__img--coach {
  object-position: center 12%;
}

.hero-split__img--customer {
  object-position: center 12%;
}

/* gradient overlays — blends edges into section bg */
.hero-split__img-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-split__img-fade--left {
  background:
    linear-gradient(to right, #eeecea 0%, transparent 35%),
    linear-gradient(to bottom, #eeecea 0%, transparent 18%);
}

.hero-split__img-fade--right {
  background:
    linear-gradient(to left, #eeecea 0%, transparent 35%),
    linear-gradient(to bottom, #eeecea 0%, transparent 18%);
}

/* bottom fade — images bleed into the next section */
.hero-split__bottom-vignette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent 0%, #eeecea 100%);
  pointer-events: none;
  z-index: 2;
}

/* ── Center content ───────────────────────────────────────── */
.hero-split__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(2rem, 4vh, 4rem) clamp(1.25rem, 3vw, 3rem);
  gap: 1.5rem;
  min-width: 0;
  /* lift center block above the vignette */
  position: relative;
  z-index: 3;
}

.hero-split__headline {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(2.1rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: #0f172a;
  text-wrap: balance;
}

.hero-split__subhead {
  margin: 0;
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  font-weight: 400;
  line-height: 1.55;
  color: #64748b;
  text-wrap: balance;
  max-width: 34rem;
}

.hero-split__headline2 {
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  line-height: 1.3;
  color: #0f172a;
  text-wrap: balance;
  max-width: 34rem;
}

/* ── Mobile: hide image columns ───────────────────────────── */
@media (max-width: 860px) {
  .hero-split__grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .hero-split__col {
    display: none;
  }

  .hero-split__center {
    padding: 4rem 1.5rem;
  }

  .hero-split__bottom-vignette {
    display: none;
  }
}
</style>
