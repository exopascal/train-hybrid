<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Dot = { x: number; y: number; r: number; baseOpacity: number; speed: number; phase: number }
type Orb = { x: number; y: number; r: number; phase: number; speed: number }
type Particle = { routeIdx: number; t: number; speed: number; size: number; opacity: number; trail: Array<{ x: number; y: number; opacity: number }> }

const canvasRef = ref<HTMLCanvasElement | null>(null)
let frameId = 0
let dots: Dot[] = []
let particles: Particle[] = []
let colorAccent = { r: 249, g: 115, b: 22 }

const routePoints = [
  [{ x: 0, y: 620 }, { x: 180, y: 560 }, { x: 420, y: 470 }, { x: 650, y: 360 }, { x: 900, y: 255 }, { x: 1140, y: 175 }, { x: 1440, y: 92 }],
  [{ x: 50, y: 800 }, { x: 310, y: 680 }, { x: 560, y: 555 }, { x: 810, y: 430 }, { x: 1070, y: 310 }, { x: 1350, y: 210 }, { x: 1460, y: 178 }],
  [{ x: 300, y: 880 }, { x: 560, y: 630 }, { x: 880, y: 400 }, { x: 1250, y: 220 }, { x: 1440, y: 155 }],
] as const

const orbs: Orb[] = [
  { x: 0.24, y: 0.34, r: 220, phase: 0, speed: 0.00035 },
  { x: 0.72, y: 0.28, r: 180, phase: 2.1, speed: 0.00025 },
  { x: 0.54, y: 0.74, r: 160, phase: 4.2, speed: 0.00045 },
]

const readAccentColor = () => {
  if (!process.client) return
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-brand-accent').trim()
  const match = accent.match(/^#([0-9a-f]{6})$/i)
  if (!match) return
  const hex = match[1]
  colorAccent = {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas || !process.client) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const seedDots = () => {
  if (!process.client) return
  dots = Array.from({ length: 180 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    baseOpacity: Math.random() * 0.12 + 0.03,
    speed: Math.random() * 0.0008 + 0.0003,
    phase: Math.random() * Math.PI * 2,
  }))
}

const seedParticles = () => {
  particles = Array.from({ length: 24 }, (_, index) => ({
    routeIdx: index % 3,
    t: Math.random(),
    speed: (Math.random() * 0.0008 + 0.0004) * (index % 3 === 2 ? 0.7 : 1),
    size: Math.random() * 2.3 + 0.8,
    opacity: Math.random() * 0.35 + 0.2,
    trail: [],
  }))
}

const lerpPoints = (pts: Array<{ x: number; y: number }>, t: number) => {
  const total = pts.length - 1
  const seg = Math.floor(t * total)
  const segT = t * total - seg
  const a = pts[Math.min(seg, total)]
  const b = pts[Math.min(seg + 1, total)]
  return { x: a.x + (b.x - a.x) * segT, y: a.y + (b.y - a.y) * segT }
}

const draw = (time: number) => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  orbs.forEach((orb) => {
    const pulse = Math.sin(time * orb.speed * 1000 + orb.phase) * 0.35 + 0.65
    const cx = orb.x * canvas.width + Math.sin(time * orb.speed * 500 + orb.phase) * 56
    const cy = orb.y * canvas.height + Math.cos(time * orb.speed * 420 + orb.phase) * 36
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r * pulse)
    gradient.addColorStop(0, `rgba(${colorAccent.r}, ${colorAccent.g}, ${colorAccent.b}, ${0.1 * pulse})`)
    gradient.addColorStop(0.4, `rgba(${colorAccent.r}, ${colorAccent.g}, ${colorAccent.b}, ${0.04 * pulse})`)
    gradient.addColorStop(1, `rgba(${colorAccent.r}, ${colorAccent.g}, ${colorAccent.b}, 0)`)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cx, cy, orb.r * pulse, 0, Math.PI * 2)
    ctx.fill()
  })

  dots.forEach((dot) => {
    const pulse = Math.sin(time * dot.speed * 1000 + dot.phase) * 0.5 + 0.5
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, dot.r * (0.75 + pulse * 0.3), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${colorAccent.r}, ${colorAccent.g}, ${colorAccent.b}, ${dot.baseOpacity * pulse})`
    ctx.fill()
  })

  particles.forEach((particle) => {
    particle.t += particle.speed
    if (particle.t > 1) particle.t = 0

    const scaled = routePoints[particle.routeIdx].map((point) => ({
      x: point.x * (canvas.width / 1440),
      y: point.y * (canvas.height / 900),
    }))
    const position = lerpPoints(scaled, particle.t)
    particle.trail.push({ x: position.x, y: position.y, opacity: particle.opacity })
    if (particle.trail.length > 16) particle.trail.shift()

    particle.trail.forEach((trailPoint, index) => {
      const factor = index / Math.max(particle.trail.length, 1)
      ctx.beginPath()
      ctx.arc(trailPoint.x, trailPoint.y, Math.max(0.2, particle.size * factor * 0.8), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${colorAccent.r}, ${Math.min(255, colorAccent.g + 30)}, ${Math.min(255, colorAccent.b + 40)}, ${factor * trailPoint.opacity * 0.6})`
      ctx.fill()
    })

    const glow = ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, particle.size * 3)
    glow.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`)
    glow.addColorStop(0.3, `rgba(${colorAccent.r}, ${colorAccent.g}, ${colorAccent.b}, ${particle.opacity * 0.65})`)
    glow.addColorStop(1, `rgba(${colorAccent.r}, ${colorAccent.g}, ${colorAccent.b}, 0)`)
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(position.x, position.y, particle.size * 3, 0, Math.PI * 2)
    ctx.fill()
  })

  frameId = window.requestAnimationFrame(draw)
}

onMounted(() => {
  readAccentColor()
  resizeCanvas()
  seedDots()
  seedParticles()
  frameId = window.requestAnimationFrame(draw)
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(frameId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div class="trainingrad-background" aria-hidden="true">
    <canvas ref="canvasRef" class="trainingrad-background__canvas" />
    <svg class="trainingrad-background__routes" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <path class="route route--ghost" d="M 100 700 Q 200 600 350 580 Q 500 560 600 480 Q 700 400 850 350 Q 1000 300 1100 200 Q 1200 150 1350 100" />
      <path class="route route--ghost" d="M 0 500 Q 150 480 280 420 Q 400 360 500 300 Q 650 220 750 180 Q 900 130 1050 90 Q 1200 50 1440 30" />
      <path class="route route--ghost" d="M 200 900 Q 300 820 450 750 Q 600 680 700 600 Q 800 520 950 460 Q 1100 400 1300 320 Q 1380 290 1440 270" />
      <path class="route route--main" d="M -20 620 Q 80 590 180 560 Q 300 525 420 470 Q 540 415 650 360 Q 780 300 900 255 Q 1020 210 1140 175 Q 1260 140 1380 110 Q 1420 100 1460 92" />
      <path class="route route--secondary" d="M 50 800 Q 180 740 310 680 Q 440 620 560 555 Q 690 488 810 430 Q 950 365 1070 310 Q 1200 255 1350 210 Q 1410 190 1460 178" />
      <path class="route route--running" d="M 300 880 Q 360 820 420 760 Q 490 690 560 630 Q 630 570 710 510 Q 790 450 880 400 Q 960 355 1050 310 Q 1150 260 1250 220 Q 1350 180 1440 155" />
      <circle class="hotspot" cx="420" cy="470" r="4" />
      <circle class="hotspot pulse" cx="810" cy="430" r="5" />
      <circle class="hotspot" cx="1140" cy="175" r="4" />
      <circle class="hotspot soft" cx="560" cy="555" r="3.5" />
      <circle class="hotspot soft" cx="950" cy="365" r="3.5" />
    </svg>
    <div class="trainingrad-background__overlay" />
  </div>
</template>

<style scoped>
.trainingrad-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-brand-secondary) 28%, transparent), transparent 42%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-brand-dark) 96%, black) 0%, color-mix(in srgb, var(--color-brand-dark) 90%, black) 100%);
}

.trainingrad-background__canvas,
.trainingrad-background__routes,
.trainingrad-background__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.trainingrad-background__routes {
  pointer-events: none;
}

.trainingrad-background__overlay {
  background:
    radial-gradient(ellipse 70% 60% at 50% 50%, color-mix(in srgb, var(--color-brand-dark) 45%, transparent) 0%, color-mix(in srgb, var(--color-brand-dark) 78%, transparent) 100%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-brand-dark) 18%, transparent) 0%, color-mix(in srgb, var(--color-brand-dark) 38%, transparent) 36%, color-mix(in srgb, var(--color-brand-dark) 76%, transparent) 100%);
}

.route {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.route--ghost {
  stroke: color-mix(in srgb, var(--color-brand-accent) 12%, var(--color-text-light));
  stroke-width: 1;
}

.route--main,
.route--secondary,
.route--running {
  stroke-dasharray: 2200;
  stroke-dashoffset: 2200;
  animation: drawRoute 3.4s ease-in-out forwards;
}

.route--main {
  stroke: var(--color-brand-accent);
  stroke-width: 2.4;
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--color-brand-accent) 70%, transparent));
}

.route--secondary {
  stroke: color-mix(in srgb, var(--color-brand-accent) 75%, var(--color-text-light));
  stroke-width: 1.8;
  opacity: 0.72;
  animation-delay: 0.35s;
}

.route--running {
  stroke: color-mix(in srgb, var(--color-brand-accent) 60%, var(--color-brand-secondary));
  stroke-width: 1.5;
  opacity: 0.66;
  animation-delay: 0.7s;
}

.hotspot {
  fill: var(--color-brand-accent);
  opacity: 0;
  animation: revealHotspot 0.45s ease-out forwards 1.4s;
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--color-brand-accent) 85%, transparent));
}

.hotspot.soft {
  animation-delay: 1.7s;
}

.hotspot.pulse {
  transform-origin: center;
  animation:
    revealHotspot 0.45s ease-out forwards 1.6s,
    pulseRing 2.4s ease-out infinite 2.1s;
}

@keyframes drawRoute {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes revealHotspot {
  to {
    opacity: 1;
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 0.95;
  }
  100% {
    transform: scale(3.2);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .route--main,
  .route--secondary,
  .route--running,
  .hotspot,
  .hotspot.pulse {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
  }
}
</style>
