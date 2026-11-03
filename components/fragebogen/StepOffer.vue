<script setup lang="ts">
import { computed } from 'vue'
import { GARANTIE_BETRAG, LIEFERUMFANG, PREIS_OPTIONEN, euro } from '~/data/fragebogen'
import { useFragebogenStore } from '~/stores/fragebogen'
import Options from './Options.vue'

const store = useFragebogenStore()
const gesamt = computed(() => LIEFERUMFANG.reduce((sum, x) => sum + x.cent, 0))
const a = computed(() => store.answers.angebot || {})

function onPreis(v: string | number) {
  store.setField('angebot', 'preis', v)
  if (v !== 'Keiner davon') store.setField('angebot', 'eigener', '')
}
</script>

<template>
  <div>
    <p class="fb-eyebrow">Gruppenprogramm</p>
    <h2 class="fb-title" tabindex="-1">Dein Programm.</h2>
    <dl class="fb-sum">
      <dt>Dauer</dt><dd>5 Wochen</dd>
      <dt>Umfang</dt><dd>2 Sessions / Woche<br />5 Wochen Trainingsplan mit Kombination aus Kraft/Ausdauer und Mindfulness<br />Zugriff auf aufgenommene Sessions<br />Zugriff auf Skool Community</dd>
    </dl>
    <div class="fb-stack">
      <div v-for="x in LIEFERUMFANG" :key="x.name" class="fb-stack__row"><span>{{ x.name }}</span><span>{{ euro(x.cent) }}</span></div>
      <div class="fb-stack__row fb-stack__row--total"><span>Gesamtwert</span><span>{{ euro(gesamt) }}</span></div>
    </div>
    <div class="fb-garantie">
      <p class="fb-eyebrow">Schweinehund-Garantie</p>
      <h3>Ziehe durch und gewinne dein Geld zurück!</h3>
      <p>Wenn du nach 5 Wochen Erfolge verbuchst, bekommst du {{ GARANTIE_BETRAG }} von uns zurück.</p>
      <p class="fb-garantie__q">Und wenn ich keinen Erfolg habe?</p>
      <p>Dann trainieren wir dich so lange, bis du erfolgreich bist und dein Geld zurückbekommst.</p>
    </div>
    <div class="fb-block">
      <div class="fb-label">Welcher Preis fühlt sich für dich gerechtfertigt an?</div>
      <Options name="angebot-preis" :options="PREIS_OPTIONEN" :model-value="a.preis" @update:model-value="onPreis" />
      <template v-if="a.preis === 'Keiner davon'">
        <label class="fb-label" for="angebot-eigener">Welcher Betrag wäre für dich gerechtfertigt?</label>
        <input id="angebot-eigener" class="fb-field" type="text" inputmode="numeric" autocomplete="off" placeholder="z. B. 400 €" :value="a.eigener || ''" @input="store.setField('angebot', 'eigener', ($event.target as HTMLInputElement).value)" />
      </template>
    </div>
  </div>
</template>
