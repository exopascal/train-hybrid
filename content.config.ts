import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        date: z.string().optional(),
        heroImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
})
