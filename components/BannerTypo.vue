<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const topTrackRef = ref<HTMLDivElement | null>(null)
const bottomTrackRef = ref<HTMLDivElement | null>(null)
let trigger: ScrollTrigger | null = null
let onFirstScroll: (() => void) | null = null

const startMarquee = () => {
  topTrackRef.value?.classList.add("is-running")
  bottomTrackRef.value?.classList.add("is-running")
}

onMounted(() => {
  if (!process.client) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  gsap.registerPlugin(ScrollTrigger)

  trigger = ScrollTrigger.create({
    trigger: "#integration-section",
    start: "top 100%",
    onEnter: () => {
      startMarquee()
    },
  })

  onFirstScroll = () => {
    if (trigger.isActive) {
      startMarquee()
    }
    if (onFirstScroll) {
      window.removeEventListener("scroll", onFirstScroll)
    }
  }

  window.addEventListener("scroll", onFirstScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (trigger) {
    trigger.kill()
    trigger = null
  }
  if (onFirstScroll) {
    window.removeEventListener("scroll", onFirstScroll)
    onFirstScroll = null
  }
})
</script>

<template>
  <section class="marquee">
    <div ref="topTrackRef" class="marquee-track is-top" aria-hidden="true">
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
    </div>
    <div ref="bottomTrackRef" class="marquee-track is-bottom" aria-hidden="true">
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
      <span>STABIL IN DIE ZUKUNFT.</span>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  width: 100%;
  background: #ff6a00;
  color: #fff;
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
  border-top: 2px solid rgba(255, 255, 255, 0.85);
  margin-top: 12px;
  padding-top: 12px;
}

.marquee-track.is-top {
  border-bottom: 2px solid rgba(255, 255, 255, 0.85);
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
