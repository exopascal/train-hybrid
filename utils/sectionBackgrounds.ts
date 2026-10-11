export type SectionBackgroundStyle = "light" | "night" | "charcoal" | "graphite"

export const sectionBackgroundStyles: Record<SectionBackgroundStyle, string> = {
  light: "bg-[var(--color-background)] text-[var(--color-text-primary)]",
  night: "bg-neutral-950 text-white",
  charcoal: "bg-neutral-900 text-white",
  graphite: "bg-zinc-900 text-white",
}
