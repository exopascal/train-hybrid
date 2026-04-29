<template>
  <main class="dynamic-page">
    <component
      v-for="section in resolvedSections"
      :key="section.key"
      :is="section.component"
      v-bind="section.props"
    />
  </main>
</template>

<script setup lang="ts">
import { createError } from 'h3'
import { getPageConfig } from '~/page-config'
import { sectionRegistry } from '~/sections/registry'

const slug = 'krafttraining-fuer-laeufer'
const page = getPageConfig(slug)

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const resolvedSections = page.sections.map((section, index) => {
  const component = sectionRegistry[section.type]
  if (!component) {
    throw createError({
      statusCode: 500,
      statusMessage: `Unknown section type: ${section.type}`,
    })
  }

  return {
    key: section.id ?? `${section.type}-${index}`,
    component,
    props: section.props ?? {},
  }
})

useSeoMeta({
  title: page.seo?.title,
  description: page.seo?.description,
  ogTitle: page.seo?.ogTitle ?? page.seo?.title,
  ogDescription: page.seo?.ogDescription ?? page.seo?.description,
})
</script>
