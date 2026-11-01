<script setup lang="ts">
import '~/assets/css/fragebogen.css'
import FragebogenFlow from '~/components/fragebogen/FragebogenFlow.vue'
import { useFragebogenStore } from '~/stores/fragebogen'

definePageMeta({ layout: false })
useHead({ title: 'Kurze Umfrage | Train Hybrid', meta: [{ name: 'robots', content: 'noindex' }] })

const store = useFragebogenStore()
const ready = ref(false)
onMounted(() => {
  store.init()
  ready.value = true
})
</script>

<template>
  <FragebogenFlow v-if="ready" />
  <main v-else class="fb" />
</template>
