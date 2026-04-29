<script setup lang="ts">
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'
import AudienceSwitch from '~/components/design-system-ui-components/AudienceSwitch.vue'

type Audience = 'runner' | 'cyclist'

const props = defineProps<{
  audience: Audience | null
}>()

const emit = defineEmits<{
  (event: 'update:audience', value: Audience): void
}>()
</script>

<template>
  <section class="audience-banner">
    <div class="audience-banner__inner">
      <p class="audience-banner__label">
        Bist du aktuell eher auf dem Rad oder mit Laufschuhen unterwegs?
      </p>
      <div class="audience-banner__controls">
        <AnalysisCtaButton
          class="audience-banner__cta"
          label="Hybrid-Analyse starten"
          variant="header"
        />
        <AudienceSwitch
          :model-value="props.audience"
          @update:model-value="emit('update:audience', $event)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.audience-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: calc(var(--z-sticky) + 5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 var(--spacing-lg) calc(var(--spacing-md) + env(safe-area-inset-bottom));
  color: var(--color-text-light);
  pointer-events: none;
}

.audience-banner__inner {
  width: min(100%, 60rem);
  padding: 0.875rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  border-radius: var(--radius-full);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-brand-accent) 96%, white) 0%,
    color-mix(in srgb, var(--color-brand-accent) 78%, var(--color-brand-secondary)) 100%
  );
  box-shadow: 0 1rem 2rem color-mix(in srgb, var(--color-brand-accent) 28%, transparent);
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.audience-banner__controls {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.audience-banner__label {
  margin-bottom: 0;
  flex: 1 1 auto;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: 1.25;
  letter-spacing: 0;
  color: color-mix(in srgb, var(--color-text-light) 94%, transparent);
  text-wrap: balance;
}

@media (max-width: 768px) {
  .audience-banner {
    padding: 0 var(--spacing-md) calc(var(--spacing-md) + env(safe-area-inset-bottom));
  }

  .audience-banner__inner {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.875rem;
    border-radius: var(--radius-2xl);
  }

  .audience-banner__controls {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .audience-banner__cta {
    width: 100%;
  }

  .audience-banner__label {
    text-align: center;
    font-size: var(--font-size-base);
  }
}
</style>
