<script setup lang="ts">
import TrainingRadPage from '~/components/trainingrad/TrainingRadPage.vue'

const SITE_URL = 'https://trainhybrid.de'
const canonical = `${SITE_URL}/trainingrad`
const title = 'Training Rad | Krafttraining fuer Radfahrer, mehr Watt und stabile Leistung'
const description = 'Training Rad von Train Hybrid: Krafttraining fuer Radfahrer, Athletiktraining fuer Rennradfahrer, Core Training und Verletzungspraevention fuer mehr Watt und stabile Performance.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: canonical,
})

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    {
      key: 'ldjson-trainingrad',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: canonical,
        description,
        inLanguage: 'de-DE',
        about: [
          'Krafttraining fuer Radfahrer',
          'Athletiktraining fuer Rennradfahrer',
          'Core Training im Radsport',
          'Verletzungspraevention fuer Radfahrer',
        ],
      }),
    },
  ],
  __dangerouslyDisableSanitizersByTagID: {
    'ldjson-trainingrad': ['children'],
  },
})
</script>

<template>
  <TrainingRadPage />
</template>
