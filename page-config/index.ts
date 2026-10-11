import type { SectionType } from '~/sections/registry'

export type PageSection = {
  id?: string
  type: SectionType
  props?: Record<string, unknown>
}

export type PageConfig = {
  seo?: {
    title?: string
    description?: string
    canonical?: string
    ogTitle?: string
    ogDescription?: string
  }
  sections: PageSection[]
}

const pageModules = import.meta.glob('./*.ts', { eager: true })

export function getPageConfig(slug: string): PageConfig | null {
  const key = `./${slug}.ts`
  const mod = pageModules[key] as { default?: PageConfig } | undefined
  return mod?.default ?? null
}
