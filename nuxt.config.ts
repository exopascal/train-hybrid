// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
  ],

  // Ensure the dev server binds to an overridable IPv4 host/port.
  // Leave port undefined unless explicitly provided so Nuxt can fall back
  // to a random available port when 3000 is already in use.
  devServer: {
    host: process.env.NUXT_HOST || '127.0.0.1',
    port: process.env.NUXT_PORT || process.env.PORT ? Number(process.env.NUXT_PORT || process.env.PORT) : undefined,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Vite configuration
  vite: {
    // Disable hash function that requires Node 21+
    build: {
      target: 'es2020',
    },
  },

  // Builder.io Configuration
  runtimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    public: {
      builderApiKey: process.env.BUILDER_API_KEY || '',
    },
  },

  // Cloudflare Pages Optimization
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/kurse', '/preise', '/team'],
    },
    routeRules: {
      '/pages/blog': { redirect: '/blog' },
      '/pages/blog/**': { redirect: '/blog' },
    },
  },

  // Hydration mismatch prevention
  experimental: {
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
    },
  },

  // Content configuration
  // Allow disabling content file watching for faster dev starts when needed.
  content: {
    watch: process.env.NUXT_CONTENT_WATCH !== 'false',
  },

  // Devtools can slow startup; allow opt-out via env.
  devtools: { enabled: process.env.NUXT_DEVTOOLS !== 'false' },

  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/MotionPathPlugin', 'split-type'],
    },
  },
})
