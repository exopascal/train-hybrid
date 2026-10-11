<script setup lang="ts">
import { computed } from "vue"

type Variant = "codex" | "gradient" | "exo"
type LabelStyle = "dots" | "shimmer" | "none"

const props = withDefaults(
  defineProps<{
    active?: boolean
    variant?: Variant
    height?: number // px
    speed?: number // seconds
    label?: string
    labelStyle?: LabelStyle
  }>(),
  {
    active: true,
    variant: "codex",
    height: 3,
    speed: 2,
    label: "Processing",
    labelStyle: "dots",
  },
)

const barStyle = computed(() => ({
  height: `${props.height}px`,
  "--ahp-speed": `${props.speed}s`,
}))
</script>

<template>
  <div
    v-show="active"
    class="ahp-root"
    :class="[`ahp--${variant}`]"
    :style="barStyle"
    aria-hidden="true"
  >
    <div class="ahp-track" />
    <div class="ahp-indicator" />
    <div class="ahp-label" :class="[`ahp-label--${labelStyle}`]">
      <span class="ahp-labelText">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.ahp-root {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.ahp-track {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background: var(--ahp-track, var(--color-border, rgba(255, 255, 255, 0.12)));
}

.ahp-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -35%;
  width: 35%;
  border-radius: 999px;
  background: var(--ahp-fill, currentColor);
  animation: ahp-slide var(--ahp-speed) linear infinite;
  will-change: transform;
}

.ahp-label {
  position: absolute;
  right: 12px;
  bottom: calc(100% + 8px);
  font-size: 12px;
  line-height: 1;
  opacity: 0.9;
  color: var(--ahp-label-color, var(--color-text-muted, rgba(255, 255, 255, 0.7)));
  letter-spacing: 0.02em;
  user-select: none;
  pointer-events: none;
}

.ahp-label--dots .ahp-labelText::after {
  content: "";
  display: inline-block;
  width: 1.4em;
  text-align: left;
  margin-left: 0.15em;
  animation: ahp-dots 1.2s steps(4, end) infinite;
}

@keyframes ahp-dots {
  0% {
    content: "";
  }
  25% {
    content: ".";
  }
  50% {
    content: "..";
  }
  75% {
    content: "...";
  }
  100% {
    content: "";
  }
}

.ahp-label--shimmer {
  --ahp-shimmer: var(--color-accent, #fca489);
}

.ahp-label--shimmer .ahp-labelText {
  position: relative;
  display: inline-block;
  color: var(--ahp-label-color, rgba(255, 255, 255, 0.55));
}

.ahp-label--shimmer .ahp-labelText::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    var(--ahp-shimmer),
    rgba(255, 255, 255, 0)
  );
  transform: translateX(-120%);
  mix-blend-mode: screen;
  opacity: 0.55;
  animation: ahp-shimmer 1.4s linear infinite;
  pointer-events: none;
}

@keyframes ahp-shimmer {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

.ahp-label--none {
  display: none;
}

@keyframes ahp-slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(420%);
  }
}

.ahp--codex {
  color: var(--ahp-codex, var(--color-accent, #fca489));
  --ahp-track: var(--color-border, rgba(255, 255, 255, 0.12));
  --ahp-fill: currentColor;
}

.ahp--gradient {
  --ahp-track: var(--color-border, rgba(255, 255, 255, 0.1));
  --ahp-fill: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    var(--color-accent, #fca489),
    rgba(255, 255, 255, 0)
  );
}

.ahp--gradient .ahp-indicator {
  background: var(--ahp-fill);
}

.ahp--exo {
  --ahp-track: rgba(255, 255, 255, 0.1);
  --ahp-fill: var(--color-accent-strong, var(--color-accent, #fca489));
}
</style>
