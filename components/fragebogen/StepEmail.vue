<script setup lang="ts">
import { computed } from 'vue'
import { useFragebogenStore } from '~/stores/fragebogen'

const store = useFragebogenStore()
const a = computed(() => store.answers.s14 || {})
const hint = computed(() => {
  const m = String(a.value.email || '').trim()
  if (m && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) return 'Bitte prüfe die E-Mail-Adresse.'
  if (m && !a.value.consent) return 'Bitte bestätige die Einwilligung, wenn du deine E-Mail-Adresse angibst.'
  return 'Die E-Mail-Adresse ist freiwillig. Du kannst auch ohne sie abschicken.'
})
</script>

<template>
  <div>
    <h2 class="fb-title" tabindex="-1">Zum Schluss, wenn du magst</h2>
    <p class="fb-lead">Wenn du magst, melde ich mich für ein kurzes Gespräch oder schicke dir die Ergebnisse.</p>
    <input class="fb-field" type="email" autocomplete="email" inputmode="email" placeholder="deine@email.de" aria-label="E-Mail-Adresse (freiwillig)" :value="a.email || ''" @input="store.setField('s14', 'email', ($event.target as HTMLInputElement).value)" />
    <label class="fb-check">
      <input type="checkbox" :checked="!!a.consent" @change="store.setField('s14', 'consent', ($event.target as HTMLInputElement).checked)" />
      <span>Ich bin einverstanden, dass du mir per E-Mail schreibst und dafür meine E-Mail-Adresse speicherst. Ich kann das jederzeit widerrufen.</span>
    </label>
    <p class="fb-privacy">{{ hint }}</p>
  </div>
</template>
