<script setup lang="ts">
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"
import AnalysisCtaButton from "~/components/design-system-ui-components/AnalysisCtaButton.vue"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
    headline?: string
    subline?: string
    outcomes?: string[]
    benefits?: string[]
    priceAmount?: string
    pricePeriod?: string
    priceNote?: string
    badgeLabel?: string
    guaranteeHeadline?: string
    guaranteeNoteTitle?: string
    guaranteeNoteBody?: string
    guaranteeTitle?: string
    guaranteeBody?: string
    ctaLabel?: string
    ctaSubtext?: string
    downsellLabel?: string
    downsellHref?: string
  }>(),
  {
    bgStyle: "light",
    headline: "Du trainierst Ausdauer. Jetzt integrieren wir Kraft.",
    subline: "In 12 Wochen zu einem neuen Leistungsniveau.",
    outcomes: [
      "Muskelaufbau in deiner Routine.",
      "Klare Progression statt Zufall",
      "Objektiv messbare Belastbarkeit",
      "Ein Trainingssystem, das über 12 Wochen hinaus funktioniert",
    ],
    benefits: [
      "EXOPEK Pro (UVP 295 €)",
      "Persönliches Onboarding (20 Min)",
      "2 Meilenstein-Checks. Je 30 Min",
      "Hybrid Coach im Chat",
      "Abgestimmtes Train Hybrid Protokoll",
      "Abschluss-Review & nächste Schritte (15 Min)",
    ],
    badgeLabel: "TRAIN HYBRID PROTOKOLL",
    priceAmount: "697 €",
    pricePeriod: "für 12 Wochen",
    priceNote: "Kein Abo. Kein Risiko.",
    guaranteeTitle: "Garantie",
    guaranteeHeadline: "12‑Wochen‑Fortschritts‑Garantie",
    guaranteeBody:
      "Wenn du das Protokoll vollständig umsetzt\nund nach 12 Wochen keinen messbaren Fortschritt erzielst,\nwiederholen wir den Zyklus kostenlos. Ohne Diskussion.",
    guaranteeNoteTitle: "Dein Risiko: 0",
    guaranteeNoteBody: "Unser Commitment: 100%",
    ctaLabel: "Hybrid-Analyse starten",
    ctaSubtext: "3 Minuten. Klare Einordnung. Kein Verkaufsdruck.",
    downsellLabel: "Du willst selbstständig starten? → EXOPEK Pro + Trainings-PDF ansehen",
    downsellHref: "#",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])
</script>

<template>
  <section :class="[sectionClass, 'angebot-section']">
    <div class="angebot-shell">
      <div class="angebot-card">
        <div class="angebot-content">
          <div class="angebot-badge">
            <span class="angebot-badge__dot" aria-hidden="true"></span>
            <span>{{ props.badgeLabel }}</span>
          </div>

          <h2 class="angebot-title">
            {{ props.headline }}
          </h2>
          <p class="angebot-subline">
            {{ props.subline }}
          </p>

          <div class="angebot-benefits">
            <h3 class="angebot-benefits__title">Was du bekommst</h3>
            <div class="angebot-benefits__grid">
              <div
                v-for="(benefit, index) in props.benefits"
                :key="`benefit-${index}`"
                class="angebot-benefit"
              >
                <div class="angebot-benefit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" aria-label="">
                    <path
                      d="M7 7h10v10H7z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 9h10"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <path
                      d="M9 7V5h6v2"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <p class="angebot-benefit__text">{{ benefit }}</p>
              </div>
            </div>
          </div>

          <div class="angebot-guarantee">
            <div class="angebot-guarantee__label">Null Risiko. Volle Struktur.</div>
            <div class="angebot-guarantee__card">
              <div class="angebot-guarantee__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" aria-label="Garantie">
                  <path
                    d="M12 2l7 3v6c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.2 12.2l1.9 1.9 3.8-3.8"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="angebot-guarantee__content">
                <div class="angebot-guarantee__eyebrow">{{ props.guaranteeTitle }}</div>
                <div class="angebot-guarantee__title">{{ props.guaranteeHeadline }}</div>
                <p class="angebot-guarantee__body">{{ props.guaranteeBody }}</p>
              </div>
              <div class="angebot-guarantee__note">
                <div class="angebot-guarantee__note-title">{{ props.guaranteeNoteTitle }}</div>
                <div class="angebot-guarantee__note-body">{{ props.guaranteeNoteBody }}</div>
              </div>
            </div>
          </div>

          <div class="angebot-price">
            <div class="angebot-price__value">{{ props.priceAmount }}</div>
            <div class="angebot-price__period">{{ props.pricePeriod }}</div>
            <div class="angebot-price__note">{{ props.priceNote }}</div>
          </div>

          <div class="angebot-cta">
            <p class="angebot-cta__label">150€ Integrationsbonus sichern</p>
            <AnalysisCtaButton :label="props.ctaLabel" variant="shine" />
            <p class="angebot-cta__subtext">{{ props.ctaSubtext }}</p>
            <a class="angebot-downsell" :href="props.downsellHref">
              {{ props.downsellLabel }}
            </a>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.angebot-section {
  --color-background: var(--color-brand-light);
  --color-background-secondary: var(--color-brand-light);
  --color-text-primary: var(--color-brand-dark);
  --color-text-secondary: var(--color-brand-secondary);
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
}

.angebot-shell {
  min-height: 100vh;
  padding: var(--spacing-4xl) var(--container-padding);
  display: flex;
  align-items: center;
  justify-content: center;
}

.angebot-card {
  width: 100%;
  max-width: 64rem;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: var(--color-background);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.08);
}

.angebot-card::before {
  content: "";
  position: absolute;
  top: calc(var(--spacing-4xl) * -0.6);
  left: 50%;
  width: calc(var(--spacing-4xl) * 8);
  height: calc(var(--spacing-4xl) * 5);
  transform: translateX(-50%);
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-brand-accent) 18%, transparent);
  filter: blur(calc(var(--spacing-4xl) * 0.55));
  opacity: 0.8;
}

.angebot-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 10%,
    color-mix(in srgb, var(--color-text-primary) 5%, transparent),
    transparent 55%
  );
  opacity: 0.35;
}

.angebot-content {
  position: relative;
  z-index: 1;
  padding: calc(var(--spacing-4xl) * 1.1) calc(var(--spacing-3xl) * 1.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.angebot-badge {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-lg);
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 14%, transparent);
  background: var(--color-background);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.25rem;
}

.angebot-badge__dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: var(--radius-full);
  background: var(--color-brand-accent);
}

.angebot-title {
  font-family: var(--font-family-heading);
  font-size: clamp(2.1rem, 3.7vw, 3.3rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.05;
  color: var(--color-text-primary);
}

.angebot-subline {
  white-space: pre-line;
  font-size: clamp(1.25rem, 2vw, 1.65rem);
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
  color: #f97316;
  margin-top: 2rem;
}

.angebot-benefits {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.angebot-benefits__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.angebot-benefits__grid {
  display: grid;
  gap: var(--spacing-lg);
}

.angebot-benefit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-xl);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: var(--color-background);
  box-shadow: var(--shadow-sm);
  text-align: center;
  min-width: 0;
}

.angebot-benefit__icon {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-brand-accent) 12%, transparent);
  color: var(--color-brand-accent);
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 35%, transparent);
  flex: 0 0 auto;
}

.angebot-benefit__icon svg {
  width: 1.4rem;
  height: 1.4rem;
}

.angebot-benefit__text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}


.angebot-price {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  align-items: center;
  margin-top: 2rem;
}

.angebot-price__value {
  font-size: clamp(2.1rem, 4.2vw, 3.1rem);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.angebot-price__period {
  margin-top: calc(var(--spacing-xs) * -0.5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.angebot-price__note {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.angebot-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: 2rem;
}

.angebot-cta__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.angebot-cta :deep(.button-shine) {
  width: min(28rem, 100%);
  padding: 1rem 2.6rem;
  font-size: 1rem;
  border-radius: 16px;
  background: var(--color-brand-accent);
  border-color: var(--color-brand-accent);
  color: #fff;
  box-shadow: 0 14px 28px rgba(255, 106, 26, 0.2);
}

.angebot-cta :deep(.button-shine:hover) {
  transform: translateY(-3px);
  background: color-mix(in srgb, var(--color-brand-accent) 92%, #ffffff);
  box-shadow: 0 18px 34px rgba(255, 106, 26, 0.26);
}

.angebot-cta__subtext {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.angebot-downsell {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--color-text-secondary) 35%, transparent);
  padding-bottom: 2px;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.angebot-downsell:hover {
  color: var(--color-text-primary);
  border-bottom-color: color-mix(in srgb, var(--color-text-primary) 55%, transparent);
}

.angebot-guarantee {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.angebot-guarantee__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.angebot-guarantee__label::before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background: var(--color-brand-accent);
}

.angebot-guarantee__card {
  display: grid;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-2xl);
  border: 2px solid color-mix(in srgb, var(--color-brand-accent) 80%, transparent);
  background: var(--color-background);
  box-shadow: 0 18px 40px color-mix(in srgb, var(--color-brand-accent) 18%, transparent);
  text-align: left;
  position: relative;
}

.angebot-guarantee__card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--radius-2xl);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-brand-accent) 10%, transparent),
    transparent 60%
  );
  opacity: 0.6;
  pointer-events: none;
}

.angebot-guarantee__icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-brand-accent) 12%, transparent);
  color: var(--color-brand-accent);
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 35%, transparent);
  position: relative;
  z-index: 1;
}

.angebot-guarantee__icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

.angebot-guarantee__eyebrow {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-brand-accent);
}

.angebot-guarantee__title {
  margin-top: var(--spacing-xs);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  position: relative;
  z-index: 1;
}

.angebot-guarantee__body {
  margin-top: var(--spacing-sm);
  white-space: pre-line;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  position: relative;
  z-index: 1;
}

.angebot-guarantee__note {
  align-self: flex-start;
  justify-self: end;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 45%, transparent);
  background: color-mix(in srgb, var(--color-brand-accent) 10%, transparent);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  max-width: 200px;
  position: relative;
  z-index: 1;
}

.angebot-guarantee__note-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.angebot-guarantee__note-body {
  margin-top: var(--spacing-xs);
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .angebot-content {
    padding: calc(var(--spacing-4xl) * 1.2) calc(var(--spacing-4xl) * 1.4);
  }

  .angebot-benefits__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .angebot-guarantee__card {
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
  }

  .angebot-guarantee__note {
    align-self: end;
  }
}

@media (max-width: 900px) {
  .angebot-guarantee__card {
    grid-template-columns: minmax(0, 1fr);
  }

  .angebot-guarantee__note {
    justify-self: start;
    max-width: none;
  }
}

@media (max-width: 640px) {
  .angebot-shell {
    min-height: auto;
  }

  .angebot-card::before {
    width: calc(var(--spacing-4xl) * 5);
    height: calc(var(--spacing-4xl) * 3.5);
  }
}
</style>
