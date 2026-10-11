<script setup lang="ts">
import { ref } from "vue"

export interface StoryItem {
  quote: string
  name: string
  imgSrc: string
  imgAlt?: string
  videoSrc?: string
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    headline?: string
    subline?: string
    items?: StoryItem[]
  }>(),
  {
    eyebrow: 'MEHR ERGEBNIS. GLEICHE ROUTINE.',
    headline: 'So habe ich <span class="headline-gradient">Krafttraining</span> in bestehende Routinen <span class="headline-gradient">integriert</span>.',
    subline: 'Deine Routine ist die nächste. Wann starten wir?',
    items: () => [
      {
        quote: '„Dank stärkerem Rücken kann ich meine Position länger halten."',
        name: 'Sascha V. aus Burgdorf · Rennradfahrer',
        imgSrc: '/krafttraining-rennradfahrer-thumbnail.jpg',
        imgAlt: '',
        videoSrc: '/rennradfahrer-krafttraining.mp4',
      },
      {
        quote: '„Die einzige Möglichkeit als junger Familienvater Kraft & Ausdauer zu trainieren."',
        name: 'Das bin ich. · In meiner Routine.',
        imgSrc: '/routine-krafttraining-beim-laufen.jpg',
        imgAlt: '',
        videoSrc: '/laufen-krafttraining-ausdauertraining.mp4',
      },
      {
        quote: '„Platzhalter Erfolgsgeschichte 3"',
        name: 'Name · Sportart',
        imgSrc: '/krafttraining-outdoorsport-joggen-laufen-gravelbike.jpg',
        imgAlt: '',
      },
    ],
  },
)

const videoRefs = ref<(HTMLVideoElement | null)[]>([])

function setVideoRef(el: HTMLVideoElement | null, index: number) {
  videoRefs.value[index] = el
}

function playVideo(index: number) {
  const video = videoRefs.value[index]
  if (!video) return
  video.muted = true
  video.play().catch(() => {})
}

function pauseVideo(index: number) {
  const video = videoRefs.value[index]
  if (!video) return
  video.pause()
  video.currentTime = 0
}
</script>

<template>
  <section class="stories">
    <div class="stories__header">
      <p class="stories__eyebrow">{{ props.eyebrow }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <h2 class="stories__headline" v-html="props.headline" />
      <p class="stories__subline">{{ props.subline }}</p>
    </div>
    <div class="stories__inner">

      <article
        v-for="(item, index) in props.items"
        :key="index"
        class="story-card"
        @mouseenter="item.videoSrc ? playVideo(index) : undefined"
        @mouseleave="item.videoSrc ? pauseVideo(index) : undefined"
      >
        <img :src="item.imgSrc" :alt="item.imgAlt ?? ''" class="story-card__img" loading="lazy" />
        <video
          v-if="item.videoSrc"
          :ref="(el) => setVideoRef(el as HTMLVideoElement | null, index)"
          class="story-card__video"
          :src="item.videoSrc"
          :muted="true"
          loop
          playsinline
          preload="metadata"
        />
        <div class="story-card__overlay" />
        <div class="story-card__text">
          <p class="story-card__quote">{{ item.quote }}</p>
          <span class="story-card__name">{{ item.name }}</span>
        </div>
      </article>

    </div>
  </section>
</template>

<style scoped>
.stories {
  background: #f5f5f0;
  padding: 2rem var(--container-padding-inline);
  padding-top: 5rem;
}

.stories__header {
  max-width: var(--container-max-width);
  margin: 0 auto 2rem;
  text-align: center;
}

.stories__eyebrow {
  margin: 0 0 0.75rem;
  font-size: clamp(1.5rem, 8vw, 4rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}

.stories__headline {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.stories__subline {
  margin: 0;
  font-size: clamp(0.95rem, 1.4vw, 1.1rem);
  color: var(--color-text-secondary);
}

.stories__inner {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.story-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: 9 / 16;
  cursor: pointer;
}

.story-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.55s ease, opacity 0.4s ease;
}

.story-card:hover .story-card__img {
  transform: scale(1.04);
}

.story-card:has(.story-card__video):hover .story-card__img {
  opacity: 0;
}

.story-card__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.story-card:hover .story-card__video {
  opacity: 1;
}

.story-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.4) 48%,
    rgba(0, 0, 0, 0.08) 100%
  );
  pointer-events: none;
}

.story-card__text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(1rem, 2.2vw, 1.6rem);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.story-card__quote {
  margin: 0;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  font-weight: 500;
  line-height: 1.5;
  color: #ffffff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.story-card__name {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 640px) {
  .stories__inner {
    grid-template-columns: repeat(3, 80vw);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .stories__inner::-webkit-scrollbar {
    display: none;
  }

  .story-card {
    scroll-snap-align: center;
  }
}
</style>
