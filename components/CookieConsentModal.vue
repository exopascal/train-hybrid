<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'cookie-consent'
const open = ref(false)

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    open.value = true
  }
})

function accept() {
  localStorage.setItem(STORAGE_KEY, 'accepted')
  open.value = false
}

function decline() {
  localStorage.setItem(STORAGE_KEY, 'declined')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :dismissible="false"
    :ui="{
      content: 'max-w-lg',
      overlay: 'backdrop-blur-sm',
    }"
  >
    <template #content>
      <div class="cookie-modal">
        <div class="cookie-modal__icon">🍪</div>
        <h2 class="cookie-modal__headline">Diese Website verwendet Cookies</h2>
        <p class="cookie-modal__text">
          Wir nutzen Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten.
          Dazu gehören technisch notwendige Cookies sowie Cookies für Analyse und Marketing.
          Du kannst jederzeit deine Einstellungen anpassen.
        </p>
        <div class="cookie-modal__actions">
          <UButton
            class="btn-main"
            size="lg"
            @click="accept"
          >
            Alle akzeptieren
          </UButton>
          <UButton
            variant="ghost"
            size="lg"
            class="cookie-modal__decline"
            @click="decline"
          >
            Nur notwendige
          </UButton>
        </div>
        <p class="cookie-modal__legal">
          Mehr dazu in unserer
          <NuxtLink to="/datenschutz" class="cookie-modal__link" @click="accept">Datenschutzerklärung</NuxtLink>.
        </p>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.cookie-modal {
  padding: var(--spacing-spacious);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-standard);
}

.cookie-modal__icon {
  font-size: 2.5rem;
  line-height: 1;
}

.cookie-modal__headline {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.cookie-modal__text {
  font-size: var(--text-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 36rem;
}

.cookie-modal__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-narrow);
  width: 100%;
  max-width: 20rem;
}

.cookie-modal__decline {
  color: var(--color-text-secondary);
}

.cookie-modal__legal {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.cookie-modal__link {
  color: var(--color-brand-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
