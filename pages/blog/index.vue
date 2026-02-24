<template>
  <main class="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-32">
    <div class="space-y-10">
      <div class="space-y-3">
        <h1 class="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
          Blog
        </h1>
        <p class="text-lg text-neutral-600 sm:text-xl">
          Klarer Kontext, klare Prinzipien.
        </p>
      </div>
      <ContentList path="/blog" :query="{ sort: [{ date: -1 }] }" v-slot="{ list }">
        <div class="grid gap-6">
          <NuxtLink
            v-for="post in list"
            :key="post._path"
            :to="post._path"
            class="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400"
          >
            <p class="text-xs uppercase tracking-[0.2em] text-neutral-500">
              {{ post.category || "Train Hybrid" }}
            </p>
            <h2 class="mt-3 text-2xl font-semibold text-neutral-900">
              {{ post.title }}
            </h2>
            <p class="mt-2 text-neutral-600">
              {{ post.description || post.excerpt || "" }}
            </p>
          </NuxtLink>
          <div v-if="!list.length" class="text-neutral-500">
            Noch keine Beiträge.
          </div>
        </div>
      </ContentList>
    </div>
  </main>
</template>
