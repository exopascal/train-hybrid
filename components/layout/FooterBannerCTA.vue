<template>
  <div v-if="isBlogArticleRoute" class="footer-banner-cta-wrap">
    <div ref="bannerRef" class="footer-banner-cta-inner">
      <NuxtLink
        to="/hybrid-protokoll"
        class="footer-banner-cta"
        aria-label="Jetzt deine Hybrid Analyse starten und bis zu 150€ Integrationsbonus sichern"
      >
        Jetzt deine Hybrid Analyse starten und bis zu 150€ Integrationsbonus sichern
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const isBlogArticleRoute = computed(() => route.path.startsWith('/blog/'))
const bannerRef = ref<HTMLElement | null>(null)

let trigger: any = null
let tween: any = null
let setupRaf: number | null = null

const waitForElement = (id: string, tries = 40): Promise<HTMLElement | null> =>
  new Promise((resolve) => {
    const run = (remaining: number) => {
      const el = document.getElementById(id)
      if (el) return resolve(el)
      if (remaining <= 0) return resolve(null)
      setupRaf = requestAnimationFrame(() => run(remaining - 1))
    }
    run(tries)
  })

const setupTrigger = async () => {
  if (!process.client) return

  trigger?.kill?.()
  trigger = null
  tween?.kill?.()
  tween = null

  const banner = bannerRef.value
  if (!banner) return

  const gsapModule = await import('gsap')
  const scrollTriggerModule = await import('gsap/ScrollTrigger')
  const gsap = gsapModule.gsap || gsapModule.default || gsapModule
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default || scrollTriggerModule
  gsap.registerPlugin(ScrollTrigger)

  gsap.set(banner, { autoAlpha: 0, pointerEvents: 'none' })
  if (!isBlogArticleRoute.value) return

  await nextTick()
  const tocElement = await waitForElement('article-toc')
  if (!tocElement) return

  const show = () => {
    banner.style.pointerEvents = 'auto'
    tween?.kill?.()
    tween = gsap.to(banner, { autoAlpha: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
  }

  const hide = () => {
    banner.style.pointerEvents = 'none'
    tween?.kill?.()
    tween = gsap.to(banner, { autoAlpha: 0, duration: 0.25, ease: 'power2.inOut', overwrite: 'auto' })
  }

  trigger = ScrollTrigger.create({
    trigger: tocElement,
    start: 'top top',
    onEnter: show,
    onLeaveBack: hide,
  })

  ScrollTrigger.refresh()
}

watch(
  () => [route.fullPath, bannerRef.value],
  () => {
    setupTrigger()
  },
  { immediate: true, flush: 'post' },
)

onMounted(() => {
  setupTrigger()
})

onBeforeUnmount(() => {
  trigger?.kill?.()
  trigger = null
  tween?.kill?.()
  tween = null
  if (setupRaf !== null) {
    cancelAnimationFrame(setupRaf)
    setupRaf = null
  }
})
</script>

<style scoped>
.footer-banner-cta-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--z-sticky) + 20);
  display: flex;
  justify-content: center;
}

.footer-banner-cta-inner {
  width: 100%;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.footer-banner-cta {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  background: var(--color-brand-accent);
  color: var(--color-text-light);
  border-radius: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 768px) {
  .footer-banner-cta {
    font-size: var(--font-size-sm);
    line-height: 1.3;
  }
}
</style>
