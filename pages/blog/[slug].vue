<script setup lang="ts">
const SITE_URL = "https://trainhybrid.de"
const AUTHOR_NAME = "Pascal Mo."

const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryContent("blog")
    .where({ _path: `/blog/${route.params.slug}` })
    .findOne()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" })
}

const canonical = `${SITE_URL}${post.value._path || ""}`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonical,
  },
  headline: post.value.title,
  description: post.value.description,
  datePublished: post.value.date,
  dateModified: post.value.date,
  author: { "@type": "Person", name: AUTHOR_NAME },
  publisher: { "@type": "Organization", name: "Train Hybrid" },
  articleSection: post.value.category,
  inLanguage: "de-DE",
}

useHead({
  link: [{ rel: "canonical", href: canonical }],
  script: [
    {
      key: "ldjson-blog",
      type: "application/ld+json",
      children: JSON.stringify(jsonLd),
    },
  ],
  __dangerouslyDisableSanitizersByTagID: {
    "ldjson-blog": ["children"],
  },
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
    <article class="prose prose-neutral max-w-none">
      <p class="text-xs uppercase tracking-[0.2em] text-neutral-500">
        {{ post?.category || "Train Hybrid" }}
      </p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
        {{ post?.title }}
      </h1>
      <p v-if="post?.description" class="mt-4 text-lg text-neutral-600">
        {{ post.description }}
      </p>
      <ContentRenderer v-if="post" :value="post" class="mt-8" />
    </article>
  </main>
</template>
