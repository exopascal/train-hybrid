<template>
  <header ref="headerRef" :class="['site-header', { 'is-scrolled': isScrolled }]">
    <div class="container">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <span class="logo-text">Train Hybrid</span>
        </NuxtLink>

        <nav ref="navRef" class="nav-menu" :class="{ 'is-open': menuOpen }">
          <NuxtLink to="/" :ref="setNavLinkRef" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/blog" :ref="setNavLinkRef" class="nav-link">Blog</NuxtLink>
          <NuxtLink to="/kontakt" :ref="setNavLinkRef" class="nav-link">Kontakt</NuxtLink>
        </nav>

        <button
          class="menu-toggle"
          @click="toggleMenu"
          aria-label="Toggle navigation menu"
        >
          <span class="menu-icon"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const headerRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const navLinkRefs = ref<HTMLElement[]>([])
const menuOpen = ref(false)
const isScrolled = ref(false)
let gsap: any = null
let introTimeline: any = null
let removeScrollListener: (() => void) | null = null
let ticking = false

const setNavLinkRef = (el: Element | null) => {
  if (!el) return
  navLinkRefs.value.push(el as HTMLElement)
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// Close menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  menuOpen.value = false
})

watch(menuOpen, (isOpen) => {
  if (!process.client || !gsap || !headerRef.value) return
  if (isOpen) {
    gsap.to(headerRef.value, { yPercent: 0, duration: 0.2, overwrite: "auto" })
    if (window.innerWidth <= 768 && navRef.value) {
      gsap.fromTo(
        navRef.value,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.22, ease: "power2.out", overwrite: "auto" },
      )
    }
  }
})

const updateHeaderHeight = () => {
  if (!headerRef.value) return
  const height = headerRef.value.offsetHeight
  document.documentElement.style.setProperty("--header-height", `${height}px`)
}

onMounted(() => {
  if (!process.client) return
  updateHeaderHeight()
  window.addEventListener("resize", updateHeaderHeight)

  const initAnimation = async () => {
    const gsapModule = await import("gsap")
    gsap = gsapModule.gsap || gsapModule.default || gsapModule
    if (!headerRef.value) return

    gsap.set(headerRef.value, { y: -24, opacity: 0 })
    introTimeline = gsap.timeline()
    introTimeline.to(headerRef.value, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      ease: "power3.out",
    })
    if (navLinkRefs.value.length) {
      introTimeline.from(
        navLinkRefs.value,
        {
          y: -10,
          opacity: 0,
          duration: 0.34,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.26",
      )
    }
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

  window.addEventListener("scroll", onScroll, { passive: true })
  removeScrollListener = () => {
    window.removeEventListener("scroll", onScroll)
  }

  initAnimation()
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeaderHeight)
  removeScrollListener?.()
  removeScrollListener = null
  introTimeline?.kill()
  introTimeline = null
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: #ffffff;
  backdrop-filter: blur(0px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  padding: 0.85rem 0;
  transition: background 0.25s ease, backdrop-filter 0.25s ease, border-color 0.25s ease,
    padding 0.25s ease;
}

.site-header.is-scrolled {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.12);
  padding: 0.65rem 0;
}

.site-header :deep(.container) {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #0f172a;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.nav-link {
  color: rgba(15, 23, 42, 0.9);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--color-brand-accent);
}

.nav-link.router-link-active {
  color: var(--color-brand-accent);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-brand-accent);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background: #0f172a;
  position: relative;
  transition: background var(--transition-fast);
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #0f172a;
  left: 0;
  transition: all var(--transition-fast);
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  top: 8px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: rgba(9, 13, 21, 0.94);
    flex-direction: column;
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-lg);
    transform: translateY(-100%);
    opacity: 0;
    transition: all var(--transition-normal);
    pointer-events: none;
  }

  .nav-menu.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .menu-toggle {
    display: block;
  }

  .nav-link.router-link-active::after {
    display: none;
  }
}
</style>
