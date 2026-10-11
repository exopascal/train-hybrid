<script setup lang="ts">
import AudienceSelectionBanner from '~/components/AudienceSelectionBanner.vue'
import AudienceStrip from '~/components/AudienceStrip.vue'
import ChatWidget from '~/components/ChatWidget.vue'
import ContextualIntegratio from '~/components/ContextualIntegratio.vue'
import CookieBanner from '~/components/CookieBanner.vue'
import PerformanceIntro from '~/components/design-system-section-components/PerformanceIntro.vue'
import AudienceSwitch from '~/components/design-system-ui-components/AudienceSwitch.vue'
import SportSwitch from '~/components/design-system-ui-components/SportSwitch.vue'
import SportToggle from '~/components/layout/SportToggle.vue'
import { ref } from 'vue'

const audience = ref(null)

const components = [
  'AudienceSelectionBanner',
  'AudienceStrip',
  'ChatWidget',
  'ContextualIntegratio',
  'CookieBanner',
  'PerformanceIntro',
  'AudienceSwitch',
  'SportSwitch',
  'SportToggle',
]
</script>

<template>
  <div class="dev-page">
    <header class="dev-header">
      <h1>Ungenutzte Komponenten</h1>
      <p>Diese Komponenten werden nirgends verwendet. Entscheide was bleibt oder ins Archiv kommt.</p>
      <ul class="dev-toc">
        <li v-for="name in components" :key="name">
          <a :href="`#${name}`">{{ name }}</a>
        </li>
      </ul>
    </header>

    <section class="dev-section" id="AudienceSelectionBanner">
      <div class="dev-label">AudienceSelectionBanner <code>components/AudienceSelectionBanner.vue</code></div>
      <div class="dev-preview">
        <AudienceSelectionBanner :audience="audience" @update:audience="audience = $event" />
      </div>
    </section>

    <section class="dev-section" id="AudienceStrip">
      <div class="dev-label">AudienceStrip <code>components/AudienceStrip.vue</code></div>
      <div class="dev-preview">
        <AudienceStrip />
      </div>
    </section>

    <section class="dev-section" id="ChatWidget">
      <div class="dev-label">ChatWidget <code>components/ChatWidget.vue</code></div>
      <div class="dev-preview">
        <ChatWidget />
      </div>
    </section>

    <section class="dev-section" id="ContextualIntegratio">
      <div class="dev-label">ContextualIntegratio <code>components/ContextualIntegratio.vue</code></div>
      <div class="dev-preview">
        <ContextualIntegratio />
      </div>
    </section>

    <section class="dev-section" id="CookieBanner">
      <div class="dev-label">CookieBanner <code>components/CookieBanner.vue</code></div>
      <div class="dev-preview">
        <CookieBanner />
      </div>
    </section>

    <section class="dev-section" id="PerformanceIntro">
      <div class="dev-label">PerformanceIntro <code>components/design-system-section-components/PerformanceIntro.vue</code></div>
      <div class="dev-preview">
        <PerformanceIntro />
      </div>
    </section>

    <section class="dev-section" id="AudienceSwitch">
      <div class="dev-label">AudienceSwitch <code>components/design-system-ui-components/AudienceSwitch.vue</code></div>
      <div class="dev-preview">
        <AudienceSwitch :model-value="audience" @update:model-value="audience = $event" />
      </div>
    </section>

    <section class="dev-section" id="SportSwitch">
      <div class="dev-label">SportSwitch <code>components/design-system-ui-components/SportSwitch.vue</code></div>
      <div class="dev-preview">
        <SportSwitch />
      </div>
    </section>

    <section class="dev-section" id="SportToggle">
      <div class="dev-label">SportToggle <code>components/layout/SportToggle.vue</code></div>
      <div class="dev-preview">
        <SportToggle />
      </div>
    </section>
  </div>
</template>

<style scoped>
.dev-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 6rem;
  font-family: var(--font-sans);
}

.dev-header {
  padding: 2rem 0 3rem;
  border-bottom: 2px solid var(--color-brand-accent);
  margin-bottom: 3rem;
}

.dev-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 0.5rem;
}

.dev-header p {
  color: var(--color-text-secondary);
  margin: 0 0 1.5rem;
}

.dev-toc {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.dev-toc a {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-background-secondary);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-decoration: none;
}

.dev-toc a:hover {
  background: var(--color-brand-accent);
  color: #fff;
}

.dev-section {
  margin-bottom: 5rem;
}

.dev-label {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed var(--color-text-muted);
}

.dev-label code {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.dev-preview {
  border: 1px solid var(--color-background-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
</style>
