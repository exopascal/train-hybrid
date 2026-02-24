<script setup lang="ts">
import { ref } from "vue"
import { gsap } from "gsap"

type Props = {
  label?: string
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  label: "Button",
})

const emit = defineEmits<{
  (e: "click"): void
}>()

const shineRef = ref<HTMLSpanElement | null>(null)

const onHover = () => {
  if (!shineRef.value) return
  gsap.killTweensOf(shineRef.value)
  gsap.set(shineRef.value, { x: "-120%", opacity: 0.0 })
  gsap.to(shineRef.value, {
    x: "120%",
    opacity: 0.9,
    duration: 0.6,
    ease: "power2.out",
  })
}
</script>

<template>
  <button
    type="button"
    class="button-shine"
    @mouseenter="onHover"
    @focus="onHover"
    @click="emit('click')"
  >
    <span class="button-shine__label">{{ props.label }}</span>
    <span ref="shineRef" class="button-shine__shine" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.button-shine {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  border: 2px solid #ff6a1a;
  border-radius: 14px;
  color: #fff;
  background: #1c1f24;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  transition: all 0.25s ease;
}

.button-shine:hover {
  transform: translateY(-3px);
  background: #ff6a1a;
  color: #ffffff;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
}

.button-shine__label {
  position: relative;
  z-index: 2;
  color: #ffffff;
}

.button-shine__shine {
  position: absolute;
  top: -40%;
  left: 0;
  width: 50%;
  height: 180%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.35) 35%,
    rgba(255, 255, 255, 0) 70%
  );
  transform: translateX(-120%);
  opacity: 0;
  pointer-events: none;
}
</style>
