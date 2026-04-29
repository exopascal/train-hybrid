<template>
  <header
    ref="headerRef"
    :class="[
      'site-header',
      {
        'is-scrolled': isScrolled,
        'is-blog-fixed': props.forceVisible,
        'is-not-sticky': props.disableSticky,
      },
    ]"
  >
    <div ref="backdropRef" class="menu-backdrop" @click="emit('close-menu')"></div>

    <aside
      id="site-menu-panel"
      ref="menuPanelRef"
      class="menu-panel"
      :aria-hidden="(!props.menuOpen).toString()"
      aria-label="Hauptnavigation"
    >
      <div class="menu-panel__inner">
        <div class="menu-panel__top">
          <p class="menu-eyebrow">Navigation</p>
          <div ref="menuCloseDockRef" class="menu-close-dock"></div>
        </div>
        <nav class="menu-nav">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="menu-link"
            @click.prevent="handleMenuLinkClick(item.to)"
          >
            <span class="menu-link__label">{{ item.label }}</span>
            <span class="menu-link__copy">{{ item.copy }}</span>
          </NuxtLink>
        </nav>

        <AnalysisCtaButton
          class="menu-cta"
          label="Hybrid-Analyse starten"
          variant="sidebar"
          @open="emit('close-menu')"
        />
      </div>
    </aside>

    <div class="container">
      <div class="header-content">
        <div ref="leftRef" class="header-left">
          <div ref="headerBurgerDockRef" class="header-burger-dock">
            <div ref="burgerCarrierRef" class="burger-carrier">
              <button
                ref="burgerButtonRef"
                class="header-burger"
                type="button"
                :aria-expanded="props.menuOpen.toString()"
                aria-controls="site-menu-panel"
                :aria-label="props.menuOpen ? 'Close menu' : 'Open menu'"
                @click="emit('toggle-menu')"
              >
                <span class="burger-icon" :class="{ 'is-open': props.menuOpen }" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>

        <NuxtLink ref="logoRef" to="/" class="logo" aria-label="Train Hybrid Home" @click="emit('close-menu')">
          <img class="logo-image" src="/train-hybrid-logo.png" alt="Train Hybrid" />
        </NuxtLink>

        <div ref="rightRef" class="header-right">
          <SportToggle />
          <AnalysisCtaButton :label="headerCtaLabel" variant="header" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { navigateTo } from '#app'
import AnalysisCtaButton from '~/components/design-system-ui-components/AnalysisCtaButton.vue'
import SportToggle from '~/components/layout/SportToggle.vue'

const props = withDefaults(
  defineProps<{ forceVisible?: boolean; disableSticky?: boolean; menuOpen?: boolean }>(),
  {
    forceVisible: false,
    disableSticky: false,
    menuOpen: false,
  }
)

const emit = defineEmits<{
  (event: 'toggle-menu'): void
  (event: 'close-menu'): void
}>()

const menuItems = [
  {
    label: 'Hybrid-Protokoll',
    to: '/hybrid-protokoll',
    copy: 'Analyse und individueller Einstieg in dein Training.',
  },
  {
    label: 'Vorteile',
    to: '/hybrid-training-vorteile',
    copy: 'Warum die Kombination aus Kraft und Ausdauer sinnvoll ist.',
  },
  {
    label: 'Für Läufer',
    to: '/krafttraining-fuer-laeufer',
    copy: 'Einordnung, Nutzen und praktische Umsetzung.',
  },
  {
    label: 'Für Radfahrer',
    to: '/krafttraining-fuer-radfahrer',
    copy: 'Spezifische Inhalte für Radsport und Performance.',
  },
] as const

const headerRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
const headerBurgerDockRef = ref<HTMLElement | null>(null)
const menuCloseDockRef = ref<HTMLElement | null>(null)
const burgerCarrierRef = ref<HTMLElement | null>(null)
const burgerButtonRef = ref<HTMLButtonElement | null>(null)
const menuPanelRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)
const isMobileViewport = ref(false)

let removeScrollListener: (() => void) | null = null
let removeKeydownListener: (() => void) | null = null
let ticking = false
let burgerFlipTimer: ReturnType<typeof setTimeout> | null = null
let mediaQueryList: MediaQueryList | null = null
let removeMediaQueryListener: (() => void) | null = null

const headerCtaLabel = computed(() =>
  isMobileViewport.value ? 'Analyse starten' : 'Hybrid-Analyse starten'
)

const handleMenuLinkClick = async (to: string) => {
  emit('close-menu')
  await navigateTo(to)
}

const updateHeaderHeight = () => {
  if (!headerRef.value) return
  const height = headerRef.value.offsetHeight
  document.documentElement.style.setProperty('--header-height', `${height}px`)
}

const syncBurgerFlip = (open: boolean) => {
  if (!burgerCarrierRef.value || !headerBurgerDockRef.value || !menuCloseDockRef.value) return

  const target = open ? menuCloseDockRef.value : headerBurgerDockRef.value
  if (burgerCarrierRef.value.parentElement === target) return

  const state = Flip.getState(burgerCarrierRef.value)
  target.appendChild(burgerCarrierRef.value)

  Flip.from(state, {
    absolute: true,
    simple: true,
    duration: open ? 0.275 : 0.2,
    ease: open ? 'power3.out' : 'power2.inOut',
  })
}

const syncMenuAnimation = (open: boolean) => {
  if (!menuPanelRef.value || !backdropRef.value) return

  if (open) {
    backdropRef.value.style.pointerEvents = 'auto'
    menuPanelRef.value.style.pointerEvents = 'auto'
    gsap.to(backdropRef.value, {
      autoAlpha: 1,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    gsap.to(menuPanelRef.value, {
      autoAlpha: 1,
      xPercent: 0,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    return
  }

  gsap.to(backdropRef.value, {
    autoAlpha: 0,
    duration: 0.2,
    ease: 'power2.inOut',
    overwrite: 'auto',
    onComplete: () => {
      if (backdropRef.value) {
        backdropRef.value.style.pointerEvents = 'none'
      }
    },
  })
  gsap.to(menuPanelRef.value, {
    autoAlpha: 0,
    xPercent: -100,
    duration: 0.4,
    ease: 'power2.inOut',
    overwrite: 'auto',
    onComplete: () => {
      if (menuPanelRef.value) {
        menuPanelRef.value.style.pointerEvents = 'none'
      }
    },
  })
}

watch(
  () => props.menuOpen,
  (open) => {
    syncMenuAnimation(open)

    if (burgerFlipTimer) {
      clearTimeout(burgerFlipTimer)
      burgerFlipTimer = null
    }

    if (open) {
      syncBurgerFlip(true)
    } else {
      syncBurgerFlip(false)
    }

    if (open) {
      nextTick(() => {
        const firstLink = menuPanelRef.value?.querySelector<HTMLElement>('.menu-link')
        firstLink?.focus()
      })
      return
    }

    nextTick(() => {
      burgerButtonRef.value?.focus()
    })
  }
)

onMounted(() => {
  if (!process.client) return
  gsap.registerPlugin(Flip)

  mediaQueryList = window.matchMedia('(max-width: 768px)')
  const syncViewport = () => {
    isMobileViewport.value = mediaQueryList?.matches ?? false
  }
  syncViewport()
  mediaQueryList.addEventListener('change', syncViewport)
  removeMediaQueryListener = () => {
    mediaQueryList?.removeEventListener('change', syncViewport)
  }

  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight)

  if (menuPanelRef.value && backdropRef.value) {
    gsap.set(backdropRef.value, { autoAlpha: 0, pointerEvents: 'none' })
    gsap.set(menuPanelRef.value, { autoAlpha: 0, xPercent: -100, pointerEvents: 'none' })
  }

  if (burgerCarrierRef.value && headerBurgerDockRef.value) {
    headerBurgerDockRef.value.appendChild(burgerCarrierRef.value)
  }

  const handleScroll = () => {
    if (!headerRef.value) return
    const currentY = window.scrollY || 0
    isScrolled.value = currentY > 24
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      handleScroll()
      ticking = false
    })
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.menuOpen) {
      emit('close-menu')
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)

  removeScrollListener = () => {
    window.removeEventListener('scroll', onScroll)
  }

  removeKeydownListener = () => {
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
  removeMediaQueryListener?.()
  removeMediaQueryListener = null
  mediaQueryList = null
  removeScrollListener?.()
  removeScrollListener = null
  removeKeydownListener?.()
  removeKeydownListener = null
  if (burgerFlipTimer) {
    clearTimeout(burgerFlipTimer)
    burgerFlipTimer = null
  }
})
</script>

<style scoped>
.site-header {
  --menu-panel-width: min(28rem, 84vw);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: var(--z-sticky);
  background: transparent;
  backdrop-filter: blur(0px);
  border-bottom: 1px solid transparent;
  padding: 0.85rem 0;
  transition: background 0.25s ease, backdrop-filter 0.25s ease, border-color 0.25s ease,
    padding 0.25s ease;
}

.site-header.is-scrolled {
  background: color-mix(in srgb, var(--color-background) 85%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
  padding: 0.65rem 0;
}

.site-header.is-blog-fixed {
  position: sticky;
  top: 0;
  z-index: calc(var(--z-sticky) + 60);
  background: color-mix(in srgb, var(--color-background) 92%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
  padding: 0.65rem 0;
}

.site-header.is-not-sticky {
  position: absolute;
}

.site-header :deep(.container) {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-sticky) - 2);
  background: color-mix(in srgb, var(--color-brand-dark) 22%, transparent);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  height: 100dvh;
  z-index: calc(var(--z-sticky) + 40);
  width: var(--menu-panel-width);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-background) 96%, transparent) 0%,
    color-mix(in srgb, var(--color-background-secondary) 88%, transparent) 100%);
  border-right: 1px solid color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  box-shadow: var(--shadow-lg);
  filter: none;
  backdrop-filter: none;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: none;
  will-change: transform;
}

.menu-close-dock {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.menu-panel__inner {
  display: flex;
  height: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  flex-direction: column;
  gap: var(--spacing-xl);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: calc(var(--header-height) + var(--spacing-xl)) var(--spacing-xl) var(--spacing-xl);
}

.menu-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.menu-eyebrow {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.menu-link {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  border-bottom: 1px solid color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
  padding: var(--spacing-md) 0;
  color: var(--color-text-primary);
  cursor: pointer;
}

.menu-link:hover,
.menu-link:focus-visible {
  color: var(--color-brand-accent);
}

.menu-link__label {
  font-family: var(--font-family-heading);
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.menu-link__copy {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.menu-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  min-height: 3.25rem;
  border-radius: var(--radius-full);
  background: var(--color-brand-accent);
  color: var(--color-text-light);
  font-weight: var(--font-weight-semibold);
  padding: 0 var(--spacing-xl);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--color-brand-accent) 35%, transparent);
}

.header-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-left {
  justify-self: start;
}

.header-burger-dock {
  display: flex;
  align-items: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
}

.burger-carrier {
  display: inline-flex;
}

.header-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo {
  justify-self: center;
  text-decoration: none;
  cursor: pointer;
}

.logo-image {
  height: 44px;
  width: auto;
  display: block;
}

.header-burger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--color-brand-dark);
  cursor: pointer;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  transition: opacity var(--transition-fast), color var(--transition-fast);
}

.header-burger:hover,
.header-burger:focus-visible {
  opacity: 0.8;
  background: transparent;
  color: var(--color-brand-accent);
}

.burger-icon {
  position: relative;
  display: block;
  width: 18px;
  height: 2px;
  background: currentColor;
  transition: background var(--transition-fast);
}

.burger-icon::before,
.burger-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: currentColor;
  transition: transform var(--transition-normal), top var(--transition-normal), opacity var(--transition-fast);
}

.burger-icon::before {
  top: -6px;
}

.burger-icon::after {
  top: 6px;
}

.burger-icon.is-open {
  background: transparent;
}

.burger-icon.is-open::before {
  top: 0;
  transform: rotate(45deg);
}

.burger-icon.is-open::after {
  top: 0;
  transform: rotate(-45deg);
}

.header-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-brand-accent);
  color: var(--color-text-light);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border: none;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--color-brand-accent) 35%, transparent);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.header-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px color-mix(in srgb, var(--color-brand-accent) 45%, transparent);
}

@media (max-width: 768px) {
  .site-header {
    --menu-panel-width: 100vw;
  }

  .header-content {
    position: relative;
    grid-template-columns: auto 1fr auto;
    gap: var(--spacing-md);
  }

  .header-burger-dock {
    min-width: 2.25rem;
    min-height: 2.25rem;
  }

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .menu-backdrop {
    background: transparent;
  }

  .logo-image {
    height: 34px;
  }

  .menu-panel {
    inset: 0;
    width: var(--menu-panel-width);
    background: var(--color-background);
    border-right: none;
    box-shadow: none;
  }

  .menu-panel__inner {
    min-height: 100vh;
    min-height: 100dvh;
    padding:
      calc(var(--header-height) + var(--spacing-lg))
      var(--spacing-lg)
      calc(var(--spacing-xl) + env(safe-area-inset-bottom))
      var(--spacing-lg);
  }

  .header-burger {
    width: 2.25rem;
    height: 2.25rem;
  }

  .burger-icon,
  .burger-icon::before,
  .burger-icon::after {
    width: 16px;
  }

  .burger-icon::before {
    top: -5px;
  }

  .burger-icon::after {
    top: 5px;
  }

  .header-cta {
    padding: 0.375rem 0.75rem;
    font-size: var(--font-size-sm);
  }
}
</style>
