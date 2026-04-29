// https://nuxt.com/docs/api/configuration/nuxt-config
const nitroPreset = process.env.NITRO_PRESET || 'cloudflare-pages'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
  ],

  // Ensure the dev server binds to an overridable IPv4 host/port.
  // Default to 3001 locally because 3000 is already reserved.
  devServer: {
    host: process.env.NUXT_HOST || '127.0.0.1',
    port: Number(process.env.NUXT_PORT || process.env.PORT || 3001),
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Vite configuration
  vite: {
    server: {
      hmr: {
        overlay: false,
      },
    },
    // Keep target conservative for broader runtime compatibility.
    build: {
      target: 'es2020',
    },
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/MotionPathPlugin', 'split-type'],
    },
  },

  // Cloudflare Pages Optimization
  nitro: {
    preset: nitroPreset,
    routeRules: {
      '/pages/blog': { redirect: '/blog' },
      '/pages/blog/**': { redirect: '/blog' },
      '/blog': {
        headers: {
          'cache-control': 'no-store',
        },
      },
      '/blog/**': {
        headers: {
          'cache-control': 'no-store',
        },
      },
    },
  },

  // Hydration mismatch prevention
  experimental: {
    // Work around Nuxt/Vite import-analysis failures for `#app-manifest`.
    appManifest: false,
    payloadExtraction: false,
  },

  // Global CSS
  css: ['~/assets/css/global.css'],

  // TypeScript Configuration
  typescript: {
    strict: true,
    typeCheck: false, // Disabled for dev performance
  },

  // App Configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Train Hybrid',
      meta: [
        { name: 'description', content: 'Train Hybrid - Fitness & Training' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/train-hybrid-logo.png' },
        { rel: 'apple-touch-icon', href: '/train-hybrid-logo.png' },
      ],
    },
  },

  // Content configuration
  // Allow disabling content file watching for faster dev starts when needed.
  content: {
    watch: process.env.NUXT_CONTENT_WATCH !== 'false',
  },

  // Devtools can slow startup; allow opt-out via env.
  devtools: { enabled: process.env.NUXT_DEVTOOLS !== 'false' },
})
