<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue"
import {
  sectionBackgroundStyles,
  type SectionBackgroundStyle,
} from "~/utils/sectionBackgrounds"

const props = withDefaults(
  defineProps<{
    bgStyle?: SectionBackgroundStyle
  }>(),
  {
    bgStyle: "night",
  },
)

const sectionClass = computed(() => sectionBackgroundStyles[props.bgStyle])

type RoutineItem = {
  name: string
  flow: string[]
  integration: string[]
  details?: string
  videoSrc: string
}

const items: RoutineItem[] = [
  {
    name: "Laufen",
    flow: ["Rhythmus finden, Puls stabil", "Steigung und Technik", "Locker auslaufen"],
    integration: ["Kraft in Pausen", "Fuss-/Kniestabi", "Kein Umplanen"],
    details: `
      <h3>🏃‍♂️ Laufen: Kraft statt Kilometer-Frust</h3>
      <p><strong>Laufökonomie maximieren. Gelenke schützen. Zeit sparen.</strong></p>
      <ul>
        <li><strong>Bessere Laufökonomie:</strong> Trainiere die Kraftentwicklung bei jedem Schritt.</li>
        <li><strong>Maximale Stabilität:</strong> Aktive Gesäß- und Rumpfmuskulatur schützt Knie und Hüfte.</li>
        <li><strong>Integrierter Reiz:</strong> Dein Lauf wird zur Kraft-Einheit – ohne dein Tempo zu drosseln.</li>
      </ul>
      <blockquote><strong>Dein Vorteil:</strong> Integriere spezifische Sprints oder Ausfallschritte direkt in deine Runde. <strong>Mehr Reiz in der gleichen Zeit.</strong></blockquote>
    `,
    videoSrc: "/trainhybrid-muskeltraining-background-video.mp4",
  },
  {
    name: "Bike",
    flow: ["Anrollen, Kadenz setzen", "Druck am Berg", "Ausrollen & Technik"],
    integration: ["Kraft im Warm-up", "Hinge statt Zusatz", "Beine bleiben frisch"],
    details: `
      <h3>🚴‍♂️ Bike: Mehr Watt, weniger Schmerz</h3>
      <p><strong>Kraftübertragung optimieren. Core-Stabilität sichern.</strong></p>
      <ul>
        <li><strong>Höhere Watt-Leistung:</strong> Erzeuge eine stabilere Basis für maximale Kraft auf dem Pedal.</li>
        <li><strong>Schmerzfrei fahren:</strong> Ein starker Rumpf verhindert das Einknicken und schützt den unteren Rücken.</li>
        <li><strong>Sprint-Power:</strong> Trainiere Explosivität direkt im Sattel, ohne Umweg ins Fitnessstudio.</li>
      </ul>
      <blockquote><strong>Dein Vorteil:</strong> Nutze den Widerstand für Kraft-Intervalle auf deinen Stammstrecken. Performance ohne Zusatzaufwand.</blockquote>
    `,
    videoSrc: "/trainhybrid-muskeltraining-krafttraining-background-video.mp4",
  },
  {
    name: "Alltag",
    flow: ["Einstieg & Rhythmus", "Fokus setzen", "Lockeres Auslaufen"],
    integration: ["Kraft in Pausen", "Fuss-/Kniestabi", "Kein Umplanen"],
    details: `
      <h3>🏠 Alltag: Minimal Effective Dose (MED)</h3>
      <p><strong>Nebenbei stärker werden. Haltung korrigieren.</strong></p>
      <ul>
        <li><strong>Passive Kraft:</strong> Sammle Muskelreize und verbrenne Kalorien beim Gehen oder Einkaufen.</li>
        <li><strong>Haltungskorrektur:</strong> Der EXOPEK aktiviert deine Rückenstrecker und wirkt dem „Schreibtisch-Buckel“ entgegen.</li>
        <li><strong>Longevity-Hack:</strong> Die einfachste Versicherung gegen Muskelschwund – direkt in deiner täglichen Routine.</li>
      </ul>
      <blockquote><strong>Dein Vorteil:</strong> Nutze jede Minute Bewegung für deine Fitness. Stark werden, während du dein Leben lebst.</blockquote>
    `,
    videoSrc: "/kraft-und-ausdauertraining-hybrid.mp4",
  },
]

const activeIndex = ref(-1)
const activeItem = computed(() => (activeIndex.value >= 0 ? items[activeIndex.value] : null))
const videoRef = ref<HTMLVideoElement | null>(null)

const onKey = (event: KeyboardEvent) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
  event.preventDefault()
  const direction = event.key === "ArrowRight" ? 1 : -1
  if (activeIndex.value === -1) {
    activeIndex.value = direction === 1 ? 0 : items.length - 1
    return
  }
  activeIndex.value = (activeIndex.value + direction + items.length) % items.length
}

const restartVideo = async () => {
  if (!videoRef.value || !activeItem.value) return
  videoRef.value.pause()
  videoRef.value.currentTime = 0
  videoRef.value.load()
  try {
    await videoRef.value.play()
  } catch {
    // Autoplay might be blocked by the browser.
  }
}

const resetSelection = () => {
  activeIndex.value = -1
}

watch(activeIndex, async () => {
  if (!activeItem.value) return
  await nextTick()
  await restartVideo()
})

onMounted(() => {
  if (activeItem.value) {
    restartVideo()
  }
})
</script>

<template>
  <section :class="[sectionClass, 'section-context-switch relative min-h-[95vh] bg-white']">
    <div class="mx-auto flex min-h-[95vh] max-w-[1500px] flex-col justify-center px-6 py-16 sm:py-20 lg:py-24">
      <div class="mb-12 space-y-3 pl-12 text-left text-neutral-900">
        <p class="text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
          Widerstand der dich begleitet.
        </p>
        <p class="text-2xl text-neutral-600 sm:text-3xl lg:text-4xl">
          Mit dem EXOPEK Pro trainierst du dort, wo du ohnehin bist.
        </p>
      </div>

      <div
        class="relative flex min-h-[62vh] items-center overflow-hidden rounded-[2.75rem] bg-black/90 shadow-[0_50px_110px_-80px_rgba(0,0,0,0.85)]"
      >
        <Transition name="fade-video" mode="out-in">
          <video
            v-if="activeItem"
            :key="activeItem.videoSrc"
            ref="videoRef"
            class="absolute inset-0 h-full w-full object-cover"
            autoplay
            muted
            playsinline
            preload="metadata"
            poster="/krafttraining-outdoorsport-joggen-laufen-gravelbike.jpg"
          >
            <source :src="activeItem.videoSrc" />
          </video>
        </Transition>
        <div
          v-if="!activeItem"
          class="absolute inset-0 bg-cover"
          style="background-image: url('/krafttraining-outdoorsport-joggen-laufen-gravelbike.jpg'); background-position: center right;"
        />
        <div class="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-black/50" />

        <button
          v-if="activeItem"
          type="button"
          class="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-lg font-semibold text-white/80 transition hover:border-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Schliessen"
          @click="resetSelection"
        >
          ×
        </button>

        <div class="relative z-10 w-full px-8 py-10 text-white sm:px-10 lg:w-[55%] lg:px-12">
          <div class="space-y-6 text-left">
            <div
              class="space-y-3"
              role="tablist"
              aria-label="Ausdauerroutine Auswahl"
              @keydown="onKey"
            >
              <div v-for="(item, index) in items" :key="item.name" class="space-y-3">
                <button
                  type="button"
                  role="tab"
                  :aria-selected="activeIndex === index"
                  :aria-controls="`routine-panel-${index}`"
                  :id="`routine-tab-${index}`"
                  class="group flex w-full items-center justify-between rounded-full bg-black/55 px-5 py-3 text-left text-base font-semibold text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-md transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:text-lg"
                  :class="
                    activeIndex === index
                      ? 'bg-black/70 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22),0_16px_40px_-30px_rgba(0,0,0,0.7)]'
                      : ''
                  "
                  @click="activeIndex = index"
                >
                  <span class="flex items-center gap-3">
                    <span
                      class="h-2.5 w-2.5 rounded-full"
                      :class="activeIndex === index ? 'bg-amber-400/90' : 'bg-white/35'"
                    />
                    {{ item.name }}
                  </span>
                  <span
                    class="text-xs uppercase tracking-[0.25em] text-white/40 transition group-hover:text-white/60"
                  >
                    <span
                      class="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-lg font-light text-white/85 transition group-hover:border-white/70 group-hover:text-white"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </span>
                </button>

                <div
                  class="overflow-hidden rounded-3xl bg-black/55 px-5 text-sm text-white/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-md transition-all"
                  :class="activeIndex === index ? 'max-h-[520px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'"
                  role="tabpanel"
                  :id="`routine-panel-${index}`"
                  :aria-labelledby="`routine-tab-${index}`"
                >
                  <div v-if="item.details" class="routine-details" v-html="item.details"></div>
                  <template v-else>
                    <p class="text-white/85">
                      {{ item.flow[0] }}. {{ item.flow[1] }}. {{ item.flow[2] }}.
                    </p>
                    <p class="mt-2 text-white/60">
                      {{ item.integration[0] }}. {{ item.integration[1] }}. {{ item.integration[2] }}.
                    </p>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-video-enter-active,
.fade-video-leave-active {
  transition: opacity 0.35s ease;
}

.fade-video-enter-from,
.fade-video-leave-to {
  opacity: 0;
}

.routine-details :deep(h3) {
  font-size: 1.05rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.routine-details :deep(h4) {
  margin-top: 0.8rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.routine-details :deep(p) {
  margin-top: 0.6rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
}

.routine-details :deep(ul) {
  margin-top: 0.6rem;
  padding-left: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  list-style: disc;
}

.routine-details :deep(li) {
  margin-top: 0.35rem;
}

.routine-details :deep(blockquote) {
  margin-top: 0.8rem;
  padding-left: 0.9rem;
  border-left: 2px solid rgba(255, 255, 255, 0.35);
  color: rgba(255, 255, 255, 0.8);
}
</style>
