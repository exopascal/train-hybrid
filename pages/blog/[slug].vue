<script setup lang="ts">
const SITE_URL = "https://trainhybrid.de"
const AUTHOR_NAME = "Pascal Mo."

const route = useRoute()
const slug = route.params.slug as string
const ALLOWED_CATEGORIES = new Set(["Ausdauer", "Kraft", "Praxis", "Laufen", "Radfahren"])

const normalizeCategory = (value?: string) => {
  const safe = (value || "").trim()
  if (ALLOWED_CATEGORIES.has(safe)) return safe
  if (safe === "Wissen" || safe === "Training") return "Praxis"
  return "Praxis"
}

const { data: post } = await useAsyncData(`blog-${slug}`, async () => {
  const linked = await queryContent("blog-linked")
    .where({ _path: `/blog-linked/${slug}` })
    .findOne()

  if (linked) return linked

  return queryContent("blog")
    .where({ _path: `/blog/${slug}` })
    .findOne()
})
const { data: relatedPosts } = await useAsyncData(`blog-related-${route.params.slug}`, async () => {
  const allPosts = (await queryContent("blog")
    .sort({ date: -1 })
    .find())
    .filter((entry: { _path?: string }) => entry._path?.startsWith("/blog/"))
  const fallback = allPosts
    .filter((entry: { _path?: string }) => entry._path !== `/blog/${route.params.slug}`)
    .slice(0, 4)

  try {
    const payload = await $fetch<{ related?: Array<{ id: string; title: string; url: string }> }>(
      `/api/internal-linking/${slug}`,
    )
    const relatedIds = Array.isArray(payload.related) ? payload.related : []

    if (!relatedIds.length) return fallback

    const byPath = new Map(allPosts.map((entry) => [entry._path, entry]))
    const resolved = relatedIds
      .map((entry) => byPath.get(entry.url) || {
        _path: entry.url,
        title: entry.title,
        category: "Praxis",
      })

    return resolved.length ? resolved : fallback
  } catch {
    return fallback
  }
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" })
}

const canonical = `${SITE_URL}/blog/${slug}`
const publishedDate = computed(() => {
  if (!post.value?.date) return null
  const date = new Date(post.value.date)
  if (Number.isNaN(date.getTime())) return post.value.date
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
})
const articleGroup = computed(() => normalizeCategory(post.value?.category as string | undefined))
const articleTopic = computed(() => (post.value?.breadcrumbTopic as string) || "Laufen")
const articleSubhead = computed(() => (post.value?.subhead as string) || "WISSEN FÜR DEIN TRAINING")
const articleHeaderHighlight = computed(() => (post.value?.headerHighlight as string) || "")
const articleImage = computed(() => (post.value?.heroImage as string) || "/typo-first-bg.jpg")
const articleImageAlt = computed(() => (post.value?.heroImageAlt as string) || post.value?.title || "Artikelbild")
const articleImageCredit = computed(() => post.value?.heroImageCredit as string | undefined)
const tocLinks = computed(() => {
  const links = (post.value?.body?.toc?.links || []) as Array<{ id: string; text: string }>
  return links
})

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
  <main class="px-6 py-20 sm:py-28 lg:py-32">
    <article class="mx-auto max-w-6xl">
      <nav class="flex items-center gap-3 text-sm text-neutral-500" aria-label="Breadcrumb">
        <NuxtLink to="/blog" class="transition hover:text-neutral-700">{{ articleGroup }}</NuxtLink>
        <span aria-hidden="true">›</span>
        <span>{{ articleTopic }}</span>
        <span aria-hidden="true">›</span>
        <span class="truncate text-neutral-700">{{ post?.title }}</span>
      </nav>

      <header class="mt-6 space-y-4 border-b border-neutral-200 pb-8">
        <p class="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
          {{ articleSubhead }}
        </p>
        <h1 class="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
          {{ post?.title }}
        </h1>
        <p v-if="post?.description" class="max-w-3xl text-lg text-neutral-600">
          {{ post.description }}
        </p>
        <p v-if="articleHeaderHighlight" class="max-w-3xl text-lg text-neutral-900">
          <strong>{{ articleHeaderHighlight }}</strong>
        </p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-neutral-600">
          <p class="font-semibold text-neutral-800">{{ AUTHOR_NAME }}</p>
          <p v-if="publishedDate">Veröffentlicht am {{ publishedDate }}</p>
        </div>
      </header>

      <figure class="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
        <img
          :src="articleImage"
          :alt="articleImageAlt"
          class="h-auto max-h-[540px] w-full object-cover"
          loading="lazy"
        />
        <figcaption
          v-if="articleImageCredit"
          class="border-t border-neutral-200 px-4 py-2 text-right text-xs text-neutral-500"
        >
          {{ articleImageCredit }}
        </figcaption>
      </figure>

      <section
        v-if="tocLinks.length"
        id="article-toc"
        class="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
        aria-label="Kapitelübersicht"
      >
        <h2 class="text-lg font-semibold text-neutral-900">In diesem Artikel</h2>
        <ul class="mt-4 space-y-2">
          <li v-for="link in tocLinks" :key="link.id">
            <a :href="`#${link.id}`" class="cursor-pointer text-neutral-700 underline-offset-4 transition hover:text-neutral-900 hover:underline">
              {{ link.text }}
            </a>
          </li>
        </ul>
      </section>

      <div class="mt-10 grid gap-10 lg:grid-cols-5">
        <div class="lg:col-span-3">
          <ContentRenderer
            v-if="post"
            :value="post"
            class="blog-content prose prose-neutral max-w-none"
          />
        </div>

        <aside class="lg:col-span-2">
          <div class="lg:sticky lg:top-24">
            <p class="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-700">
              mehr erfahren
            </p>
            <div class="mt-4 border-y border-neutral-900/20">
              <NuxtLink
                v-for="entry in relatedPosts"
                :key="entry._path"
                :to="entry._path"
                class="flex items-start justify-between gap-4 border-b border-neutral-900/20 py-5 last:border-b-0"
              >
                <div class="min-w-0 flex-1">
                  <p class="text-2xl font-semibold leading-tight text-neutral-900">
                    {{ entry.title }}
                  </p>
                  <p class="mt-3 text-sm font-semibold text-neutral-700">
                    Von {{ entry.author || AUTHOR_NAME }}
                  </p>
                </div>
                <img
                  :src="entry.heroImage || '/typo-first-bg.jpg'"
                  :alt="entry.title"
                  class="h-20 w-20 shrink-0 rounded-sm object-cover"
                  loading="lazy"
                />
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </article>
  </main>
</template>

<style scoped>
:deep(.blog-content .inline-related-card) {
  margin: var(--spacing-xl) 0;
  border-top: 1px solid var(--color-text-primary);
  border-bottom: 1px solid var(--color-text-primary);
  padding: var(--spacing-md) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

:deep(.blog-content .inline-related-card__content) {
  min-width: 0;
  flex: 1;
}

:deep(.blog-content .inline-related-card__eyebrow) {
  margin: 0;
  color: var(--color-brand-accent);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

:deep(.blog-content .inline-related-card__title) {
  display: inline-block;
  margin: var(--spacing-sm) 0 0;
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.25;
  text-decoration: none;
  cursor: pointer;
}

:deep(.blog-content .inline-related-card__title:hover) {
  color: var(--color-brand-secondary);
}

:deep(.blog-content .inline-related-card__breadcrumb) {
  display: inline-block;
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
  text-decoration: none;
}

:deep(.blog-content .inline-related-card__breadcrumb:hover) {
  color: var(--color-brand-secondary);
}

:deep(.blog-content .inline-related-card__image-link) {
  display: inline-flex;
  flex-shrink: 0;
  cursor: pointer;
}

:deep(.blog-content .inline-related-card__image) {
  width: 92px;
  height: 92px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

@media (max-width: 768px) {
  :deep(.blog-content .inline-related-card) {
    align-items: flex-start;
  }

  :deep(.blog-content .inline-related-card__image) {
    width: 72px;
    height: 72px;
  }

  :deep(.blog-content .inline-related-card__title) {
    font-size: var(--font-size-2xl);
  }

  :deep(.blog-content .inline-related-card__breadcrumb) {
    font-size: var(--font-size-xs);
  }
}
</style>
