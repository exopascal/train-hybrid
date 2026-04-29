<template>
  <div id="app">
    <Header
      :force-visible="isBlogRoute"
      :disable-sticky="isBlogArticleRoute"
      :menu-open="isMenuOpen"
      @toggle-menu="toggleMenu"
      @close-menu="closeMenu"
    />
    <div ref="contentBlurRef" class="content-blur-overlay" @click="closeMenu"></div>
    <div ref="contentShellRef" class="content-shell">
      <main class="main-content">
        <NuxtPage />
      </main>
      <FooterBannerCTA />
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from '#imports'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '~/components/layout/Header.vue'
import FooterBannerCTA from '~/components/layout/FooterBannerCTA.vue'
import Footer from '~/components/layout/Footer.vue'

const route = useRoute()
const contentShellRef = ref<HTMLElement | null>(null)
const contentBlurRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)

const isBlogRoute = computed(() => route.path === '/blog' || route.path.startsWith('/blog/'))
const isBlogArticleRoute = computed(() => route.path.startsWith('/blog/'))
const isMobileMenuViewport = () => process.client && window.matchMedia('(max-width: 768px)').matches

const getContentShift = () => {
  if (!process.client) return 0
  if (isMobileMenuViewport()) return 0
  const menuPanel = document.getElementById('site-menu-panel')
  if (!menuPanel) return 0
  return menuPanel.getBoundingClientRect().width
}

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
    if (process.client) window.scrollTo(0, 0)
  }
)

watch(isMenuOpen, async (open) => {
  if (!process.client) return
  await nextTick()

  const shell = contentShellRef.value
  const blurOverlay = contentBlurRef.value
  if (!shell || !blurOverlay) return

  gsap.to(shell, {
    left: open ? getContentShift() : 0,
    duration: open ? 0.55 : 0.4,
    ease: open ? 'power3.out' : 'power2.inOut',
    overwrite: 'auto',
  })

  gsap.to(blurOverlay, {
    autoAlpha: open && !isMobileMenuViewport() ? 1 : 0,
    duration: open ? 0.55 : 0.25,
    ease: open ? 'power2.out' : 'power2.inOut',
    overwrite: 'auto',
    onStart: () => {
      blurOverlay.style.pointerEvents = open && !isMobileMenuViewport() ? 'auto' : 'none'
    },
    onComplete: () => {
      if (!open || isMobileMenuViewport()) {
        blurOverlay.style.pointerEvents = 'none'
      }
      ScrollTrigger.refresh()
    },
  })

  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  if (!process.client || !contentShellRef.value || !contentBlurRef.value) return

  // Disable browser scroll restoration so the page always loads at the top
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  gsap.set(contentShellRef.value, { left: 0 })
  gsap.set(contentBlurRef.value, { autoAlpha: 0, pointerEvents: 'none' })
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style>
.content-shell {
  position: relative;
  min-height: 100vh;
  will-change: left;
}

.content-blur-overlay {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-sticky) - 50);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  cursor: default;
  backdrop-filter: blur(10px);
  background: color-mix(in srgb, var(--color-background) 12%, transparent);
}

@media (max-width: 768px) {
  .content-blur-overlay {
    backdrop-filter: none;
    background: transparent;
  }
}

.main-content {
  min-height: 60vh;
}
</style>
