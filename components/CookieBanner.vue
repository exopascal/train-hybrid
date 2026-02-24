<script setup lang="ts">
import { computed, onMounted } from "vue"

const CONSENT_KEY = "th_chat_memory_consent"
const consentState = useState<"granted" | "denied" | "unknown">(
  "chatMemoryConsent",
  () => "unknown"
)

const visible = computed(() => consentState.value === "unknown")

onMounted(() => {
  if (consentState.value !== "unknown") return
  const stored = localStorage.getItem(CONSENT_KEY)
  if (stored === "granted" || stored === "denied") {
    consentState.value = stored
  }
})

const setConsent = (value: "granted" | "denied") => {
  consentState.value = value
  localStorage.setItem(CONSENT_KEY, value)
}
</script>

<template>
  <div v-if="visible" class="cookie-banner" role="dialog" aria-live="polite">
    <div class="cookie-banner__content">
      <p class="cookie-banner__title">Cookies & Memory</p>
      <p class="cookie-banner__text">
        Wenn du zustimmst, darf ich mir Chat-Inhalte merken, um dir
        individuellere Antworten zu geben.
      </p>
    </div>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-banner__accept" @click="setConsent('granted')">
        Zustimmen
      </button>
      <button type="button" class="cookie-banner__decline" @click="setConsent('denied')">
        Ablehnen
      </button>
    </div>
  </div>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 20px;
  z-index: 60;
  background: #111827;
  color: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.cookie-banner__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cookie-banner__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.cookie-banner__text {
  margin: 0;
  font-size: 13px;
  color: #e5e7eb;
}

.cookie-banner__actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.cookie-banner__actions button {
  border-radius: 999px;
  border: 1px solid #fff;
  padding: 6px 14px;
  font-size: 12px;
  cursor: pointer;
}

.cookie-banner__accept {
  background: #fff;
  color: #111827;
}

.cookie-banner__decline {
  background: transparent;
  color: #fff;
}

@media (max-width: 640px) {
  .cookie-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .cookie-banner__actions {
    width: 100%;
  }
}
</style>
