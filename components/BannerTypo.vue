<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

const props = withDefaults(
  defineProps<{
    text?: string
    topText?: string
    bottomText?: string
    repeatCount?: number
  }>(),
  {
    text: "STABIL IN DIE ZUKUNFT.",
    repeatCount: 10,
  },
)

const topTrackRef = ref<HTMLDivElement | null>(null)
const bottomTrackRef = ref<HTMLDivElement | null>(null)

const startMarquee = () => {
  topTrackRef.value?.classList.add("is-running")
  bottomTrackRef.value?.classList.add("is-running")
}

const topLineText = computed(() => props.topText ?? props.text)
const bottomLineText = computed(() => props.bottomText ?? props.text)
const repeatedTopText = computed(() =>
  Array.from({ length: props.repeatCount }, () => topLineText.value),
)
const repeatedBottomText = computed(() =>
  Array.from({ length: props.repeatCount }, () => bottomLineText.value),
)

onMounted(() => {
  if (!process.client) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  startMarquee()
})
</script>

<template>
  <section class="marquee">
    <div ref="topTrackRef" class="marquee-track is-top" aria-hidden="true">
      <span v-for="(item, idx) in repeatedTopText" :key="`top-${idx}`">
        {{ item }}
      </span>
    </div>
    <div ref="bottomTrackRef" class="marquee-track is-bottom" aria-hidden="true">
      <span v-for="(item, idx) in repeatedBottomText" :key="`bottom-${idx}`">
        {{ item }}
      </span>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  width: 100%;
  background: var(--color-brand-accent);
  color: var(--color-text-light);
  overflow: hidden;
  padding: 1.2rem 0;
}

.marquee-track {
  display: flex;
  gap: 3.25rem;
  white-space: nowrap;
  width: max-content;
  animation: marquee-left 26s linear infinite;
  animation-play-state: paused;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1;
}

.marquee-track.is-running {
  animation-play-state: running;
}

.marquee-track.is-bottom {
  animation-name: marquee-right;
  border-top: 2px solid color-mix(in srgb, var(--color-text-light) 85%, transparent);
  margin-top: 12px;
  padding-top: 12px;
}

.marquee-track.is-top {
  border-bottom: 2px solid color-mix(in srgb, var(--color-text-light) 85%, transparent);
  padding-bottom: 12px;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes marquee-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
