<script setup lang="ts">
type BlogPost = {
  _path: string
  title?: string
  description?: string
  excerpt?: string
  category?: string
  date?: string
  heroImage?: string
  tags?: string[]
}

const ALLOWED_CATEGORIES = new Set(["Ausdauer", "Kraft", "Praxis", "Laufen", "Radfahren"])

const normalizeCategory = (value?: string) => {
  const safe = (value || "").trim()
  if (ALLOWED_CATEGORIES.has(safe)) return safe
  if (safe === "Wissen" || safe === "Training") return "Praxis"
  return "Praxis"
}

const { data: posts } = await useAsyncData("blog-index-posts", () =>
  queryContent("blog")
    .sort({ date: -1 })
    .find()
    .then((entries) => entries.filter((entry) => entry._path?.startsWith("/blog/")) as BlogPost[]),
)

const formattedDate = (value?: string) => {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed)
}

const latestPosts = computed(() => (posts.value || []).slice(0, 4))

const topCategories = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts.value || []) {
    const key = normalizeCategory(post.category)
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
})
</script>

<template>
  <main class="px-6 py-10 sm:py-14 lg:px-10 lg:py-16">
    <div class="mx-auto max-w-[1400px] space-y-10">
      <section class="relative w-full overflow-hidden rounded-2xl border border-white/35 bg-[linear-gradient(135deg,rgba(255,107,0,0.92),rgba(255,133,48,0.84))] px-6 py-7 text-white shadow-[0_22px_60px_-30px_rgba(255,107,0,0.75)] backdrop-blur-sm sm:px-8 sm:py-8">
        <div class="pointer-events-none absolute -top-20 left-12 h-48 w-48 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl"></div>
        <div class="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div class="max-w-3xl space-y-2">
            <p class="text-xs uppercase tracking-[0.2em] text-white">Hybrid Analyse</p>
            <h2 class="text-2xl font-semibold leading-tight text-white sm:text-3xl">
              Jetzt 150€ Integrationsbonus sichern. Einfach Hybrid-Analyse starten.
            </h2>
            <p class="text-sm text-white sm:text-base">
              Individueller Plan statt Ratespiel: direkt umsetzbar für Ausdauer plus Kraft.
            </p>
          </div>
          <NuxtLink
            to="/hybrid-protokoll"
            class="inline-flex items-center justify-center rounded-md border-2 border-white bg-neutral-900 px-9 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white ring-4 ring-white/40 shadow-[0_22px_50px_-16px_rgba(0,0,0,0.75)] transition hover:-translate-y-1 hover:ring-white/60 hover:shadow-[0_30px_60px_-18px_rgba(0,0,0,0.85)]"
          >
            Analyse starten
          </NuxtLink>
        </div>
      </section>

      <div class="grid gap-8 lg:grid-cols-4 lg:gap-10">
        <section class="space-y-6 lg:col-span-3">
          <div class="space-y-2">
            <h1 class="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
              Train Hybrid Blog
            </h1>
            <p class="text-lg text-neutral-600 sm:text-xl">
              Alles zu Train Hybrid und mehr zum Thema Ausdauer, Kraft, Praxis und Laufen.
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <NuxtLink
              v-for="post in posts || []"
              :key="post._path"
              :to="post._path"
              class="group space-y-3"
            >
              <div class="overflow-hidden bg-neutral-100">
                <img
                  :src="post.heroImage || '/typo-first-bg.jpg'"
                  :alt="post.title || 'Blog Bild'"
                  class="h-[260px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <p class="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
                {{ normalizeCategory(post.category) }}
              </p>
              <h2 class="text-3xl font-semibold leading-tight text-neutral-900">
                {{ post.title }}
              </h2>
              <p class="text-sm text-neutral-500">
                {{ formattedDate(post.date) }}
              </p>
            </NuxtLink>

            <div v-if="!(posts && posts.length)" class="text-neutral-500">
              Noch keine Beiträge.
            </div>
          </div>
        </section>

        <aside class="lg:col-span-1">
          <div class="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-neutral-500">Das könnte dich auch interessieren</p>
              <h3 class="mt-2 text-2xl font-semibold text-neutral-900">Empfohlene Artikel</h3>
            </div>

            <div class="space-y-3 border-t border-neutral-200 pt-4">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Neu veröffentlicht</p>
              <NuxtLink
                v-for="post in latestPosts"
                :key="`latest-${post._path}`"
                :to="post._path"
                class="block border-b border-neutral-200 pb-3 last:border-b-0"
              >
                <p class="text-sm font-semibold text-neutral-900">{{ post.title }}</p>
                <p class="mt-1 text-xs text-neutral-500">{{ formattedDate(post.date) }}</p>
              </NuxtLink>
            </div>

            <div class="space-y-3 border-t border-neutral-200 pt-4">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Top Kategorien</p>
              <div class="space-y-2">
                <div
                  v-for="[name, count] in topCategories"
                  :key="`cat-${name}`"
                  class="flex items-center justify-between text-sm text-neutral-700"
                >
                  <span>{{ name }}</span>
                  <span class="font-semibold text-neutral-900">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>
