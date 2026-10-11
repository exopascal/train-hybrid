<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import DOMPurify from "dompurify"
import MarkdownIt from "markdown-it"
import { useHybridAnalysisStore } from "~/stores/hybridAnalysis"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const props = defineProps<{
  answers: Record<string, string | number>
  name?: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "discard-profile"): void
}>()

const hybridAnalysisStore = useHybridAnalysisStore()
const analysisAnswers = computed(() => {
  if (Object.keys(props.answers ?? {}).length > 0) {
    return props.answers
  }
  return hybridAnalysisStore.answers
})

const input = ref("")
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const messagesRef = ref<HTMLDivElement | null>(null)
const hasChatted = ref(false)

// ─── Greeting ────────────────────────────────────────────────────────────────

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Guten Morgen"
  if (hour >= 12 && hour < 17) return "Guten Tag"
  if (hour >= 17 && hour < 22) return "Guten Abend"
  return "Späte Stunde"
})

const sportLabel = computed(() => {
  const m = String(analysisAnswers.value?.movement ?? "")
  if (m === "Ich fahre Gravel" || m === "Ich fahre Rennrad") return "Radfahrer"
  if (m === "Ich laufe regelmäßig") return "Läufer"
  if (m === "Ich kombiniere Ausdauer & Kraft") return "Hybrid-Athlet"
  return "Athlet"
})

const greeting = computed(() => {
  const name = props.name?.trim()
  return name
    ? `${timeGreeting.value}, ${name}.`
    : `${timeGreeting.value}, ${sportLabel.value}.`
})

// ─── Sport icon ──────────────────────────────────────────────────────────────

const isCyclist = computed(() => {
  const m = String(analysisAnswers.value?.movement ?? "")
  return m === "Ich fahre Gravel" || m === "Ich fahre Rennrad"
})

const isRunner = computed(() => {
  const m = String(analysisAnswers.value?.movement ?? "")
  return m === "Ich laufe regelmäßig"
})

const hasAnalysisProfile = computed(() => Object.keys(analysisAnswers.value ?? {}).length > 0)

const normalizeMovement = (value: string) => {
  if (value === "Ich fahre Gravel") return "Gravel"
  if (value === "Ich fahre Rennrad") return "Road"
  if (value === "Ich laufe regelmäßig") return "Run"
  if (value === "Ich kombiniere Ausdauer & Kraft") return "Hybrid"
  if (value === "Ich bin draußen aktiv") return "Outdoor"
  if (value === "Ich will gerade erst starten") return "Starter"
  return value || "Unknown"
}

const normalizeFrequency = (value: string) => {
  if (value === "1-2 Einheiten") return "Low"
  if (value === "3-4 Einheiten") return "Medium"
  if (value === "5+ Einheiten") return "High"
  if (value === "Unregelmäßig") return "Irregular"
  return value || "Unknown"
}

const normalizeStrength = (value: string) => {
  if (value === "Gar nicht") return "None"
  if (value === "Unregelmäßig / ohne Plan") return "Unstructured"
  if (value === "1-2x pro Woche") return "Regular"
  if (value === "Strukturiert mit System") return "Structured"
  if (value === "Ich hatte Beschwerden / Unsicherheiten") return "Limited"
  return value || "Unknown"
}

const normalizeInvestment = (value: string) => {
  if (value === "Unter 300 €") return "Low"
  if (value === "300-700 €") return "Mid"
  if (value === "700-1.500 €") return "High"
  if (value === "Über 1.500 €") return "Premium"
  return value || "Open"
}

const profileStats = computed(() => {
  const answers = analysisAnswers.value ?? {}
  return [
    { label: "Mode", value: normalizeMovement(String(answers.movement ?? "")) },
    { label: "Load", value: normalizeFrequency(String(answers.frequency ?? "")) },
    { label: "Strength", value: normalizeStrength(String(answers.strength ?? "")) },
    { label: "Budget", value: normalizeInvestment(String(answers.investment ?? "")) },
  ]
})

const profileCompletion = computed(() => {
  const trackedKeys = ["movement", "frequency", "strength", "time", "investment"]
  const completed = trackedKeys.filter((key) => Boolean(analysisAnswers.value?.[key])).length
  return Math.round((completed / trackedKeys.length) * 100)
})

const retentionChoice = ref<"save" | "session" | null>(null)

function chooseRetention(choice: "save" | "session") {
  retentionChoice.value = choice
}

function closeAgent() {
  if (retentionChoice.value === "session") {
    emit("discard-profile")
  }
  emit("close")
}

function startAccountFlow() {
  retentionChoice.value = "save"
  sendMessage("Ich möchte mein Profil sichern, appübergreifend synchronisieren und den 150 € Vorteil aktivieren. Was ist der nächste Schritt zur Kontoerstellung?")
}

// ─── Quick actions ───────────────────────────────────────────────────────────

const quickActions = [
  { label: "Onboarding starten", prompt: "Ich möchte jetzt mit dem Onboarding starten. Was sind meine ersten Schritte?" },
  { label: "Blog", href: "/blog" },
  { label: "Termin buchen", href: "#termin" },
  { label: "Mail schreiben", href: "mailto:hallo@exopek.de" },
  { label: "FAQ", href: "/#faq" },
]

function handleQuickAction(action: (typeof quickActions)[number]) {
  if ("href" in action) {
    window.location.href = action.href
    return
  }
  sendMessage(action.prompt)
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true })

const defaultLinkRender =
  markdown.renderer.rules.link_open ??
  ((tokens: any, idx: any, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options))

markdown.renderer.rules.link_open = (tokens: any, idx: any, options: any, env: any, self: any) => {
  tokens[idx].attrSet("target", "_blank")
  tokens[idx].attrSet("rel", "noopener noreferrer")
  return defaultLinkRender(tokens, idx, options, env, self)
}

function renderMarkdown(value: string) {
  const rawHtml = markdown.render((value || "").trim())
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "p", "ul", "ol", "li", "strong", "em", "a", "br", "code"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  })
}

async function scrollToBottom() {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

async function sendMessage(text?: string) {
  const content = (text ?? input.value).trim()
  if (!content || isLoading.value) return

  input.value = ""
  hasChatted.value = true
  messages.value.push({ role: "user", content })
  isLoading.value = true
  await scrollToBottom()

  try {
    const res = await $fetch<{ reply: string }>("/api/chat", {
      method: "POST",
      body: {
        message: content,
        analysis: analysisAnswers.value,
      },
    })
    messages.value.push({ role: "assistant", content: res.reply })
  } catch {
    messages.value.push({
      role: "assistant",
      content: "Verbindung konnte nicht hergestellt werden. Bitte versuche es erneut.",
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const canSend = computed(() => input.value.trim().length > 0 && !isLoading.value)
</script>

<template>
  <Teleport to="body">
    <div class="agent-overlay">
      <button class="agent-close" type="button" aria-label="Schließen" @click="closeAgent">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="agent-shell" :class="{ 'agent-shell--chatting': hasChatted }">

        <!-- Welcome state header -->
        <div class="agent-header" :class="{ 'agent-header--compact': hasChatted }">
          <div class="agent-identity">
            <img
              src="/Exopek_Logo_Wortmarke-Bildmarke_weiss.png"
              alt="EXOPEK"
              class="agent-logo"
            />
            <span class="agent-identity__divider" aria-hidden="true"></span>
            <!-- Runner icon -->
            <svg v-if="isRunner" class="agent-sport-icon" viewBox="0 0 24 24" fill="currentColor" aria-label="Läufer">
              <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>
            </svg>
            <!-- Cyclist icon -->
            <svg v-else-if="isCyclist" class="agent-sport-icon" viewBox="0 0 24 24" fill="currentColor" aria-label="Radfahrer">
              <path d="M5 20.5A3.5 3.5 0 0 1 1.5 17 3.5 3.5 0 0 1 5 13.5 3.5 3.5 0 0 1 8.5 17 3.5 3.5 0 0 1 5 20.5M5 12a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m9.8-2H19V8.2h-3.2L13.86 4.93C13.57 4.43 13 4.1 12.4 4.1c-.47 0-.9.19-1.2.5L8.29 7.5C8 7.8 7.79 8.2 7.79 8.7c0 .57.27 1.02.71 1.3L11 11.59V16h1.8v-5.59l-2.25-1.53 1.85-1.88L14.8 10M19 20.5A3.5 3.5 0 0 1 15.5 17 3.5 3.5 0 0 1 19 13.5 3.5 3.5 0 0 1 22.5 17 3.5 3.5 0 0 1 19 20.5M19 12a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5z"/>
            </svg>
            <!-- Generic hybrid icon -->
            <svg v-else class="agent-sport-icon" viewBox="0 0 24 24" fill="currentColor" aria-label="Athlet">
              <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 5h2l2.5 4.5L17 13h-2l-1-2-1 3.5V20h-2v-5.5L10 11l-1 2H7l1.5-1.5L11 7z"/>
            </svg>
          </div>

          <h1 v-if="!hasChatted" class="agent-greeting">{{ greeting }}</h1>
        </div>

        <!-- Chat messages -->
        <div v-if="hasChatted" ref="messagesRef" class="agent-messages">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="agent-message"
            :class="`agent-message--${msg.role}`"
          >
            <div
              v-if="msg.role === 'assistant'"
              class="agent-message__content"
              v-html="renderMarkdown(msg.content)"
            />
            <div v-else class="agent-message__content">{{ msg.content }}</div>
          </div>
          <div v-if="isLoading" class="agent-message agent-message--assistant">
            <div class="agent-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Input area -->
        <div class="agent-input-area">
          <div v-if="hasAnalysisProfile" class="agent-profile-panel">
            <div class="agent-profile-panel__header">
              <div>
                <p class="agent-profile-panel__eyebrow">Profile Sync</p>
                <p class="agent-profile-panel__title">Hybrid analysis loaded</p>
              </div>
              <div class="agent-profile-panel__status">
                <span class="agent-profile-panel__dot" aria-hidden="true"></span>
                {{ profileCompletion }}%
              </div>
            </div>

            <div class="agent-profile-panel__grid">
              <div
                v-for="stat in profileStats"
                :key="stat.label"
                class="agent-profile-panel__cell"
              >
                <span class="agent-profile-panel__label">{{ stat.label }}</span>
                <strong class="agent-profile-panel__value">{{ stat.value }}</strong>
              </div>
            </div>

            <div class="agent-profile-panel__retention">
              <p class="agent-profile-panel__prompt">
                Willst du dieses Profil behalten und auf anderen Geräten weiterverwenden?
              </p>

              <div class="agent-profile-panel__actions">
                <button
                  type="button"
                  class="agent-profile-panel__action agent-profile-panel__action--primary"
                  :class="{ 'is-active': retentionChoice === 'save' }"
                  @click="chooseRetention('save')"
                >
                  Profil sichern
                </button>
                <button
                  type="button"
                  class="agent-profile-panel__action"
                  :class="{ 'is-active': retentionChoice === 'session' }"
                  @click="chooseRetention('session')"
                >
                  Nur diese Session
                </button>
              </div>

              <div v-if="retentionChoice === 'save'" class="agent-profile-panel__hook">
                <p class="agent-profile-panel__hook-title">Save progress. Unlock sync.</p>
                <p class="agent-profile-panel__hook-copy">
                  Für App-Sync, gespeicherte Analyse und den 150 € Integrationsvorteil brauchst du ein Konto.
                </p>
                <button
                  type="button"
                  class="agent-profile-panel__cta"
                  @click="startAccountFlow"
                >
                  Konto anlegen
                </button>
              </div>

              <p v-else-if="retentionChoice === 'session'" class="agent-profile-panel__ephemeral">
                Ohne Konto bleibt das Profil nur temporär aktiv und wird beim Schließen verworfen.
              </p>
            </div>
          </div>

          <div class="agent-input-box">
            <textarea
              v-model="input"
              class="agent-input"
              :placeholder="hasChatted ? 'Schreib eine Nachricht…' : 'Stell mir eine Frage oder wähle eine Option unten…'"
              rows="1"
              @keydown="onKeydown"
            />
            <button
              class="agent-send"
              type="button"
              :disabled="!canSend"
              @click="sendMessage()"
              aria-label="Senden"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Quick actions -->
          <div v-if="!hasChatted" class="agent-actions">
            <button
              v-for="action in quickActions"
              :key="action.label"
              type="button"
              class="agent-action"
              @click="handleQuickAction(action)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.agent-overlay {
  position: fixed;
  inset: 0;
  background: #141414;
  z-index: calc(var(--z-sticky) + 200);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-spacious);
}

.agent-close {
  position: absolute;
  top: var(--spacing-comfortable);
  right: var(--spacing-comfortable);
  background: transparent;
  border: 1px solid color-mix(in srgb, #fff 14%, transparent);
  border-radius: var(--radius-full);
  padding: var(--spacing-narrow);
  color: color-mix(in srgb, #fff 50%, transparent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default);
}

.agent-close:hover {
  border-color: color-mix(in srgb, #fff 30%, transparent);
  color: #fff;
}

.agent-shell {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-spacious);
}

.agent-shell--chatting {
  height: 100%;
  max-height: 80vh;
  justify-content: space-between;
  gap: var(--spacing-standard);
}

/* ─── Header ─────────────────────────────────────────────────────────────── */

.agent-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-comfortable);
}

.agent-header--compact {
  align-self: flex-start;
  gap: var(--spacing-narrow);
}

.agent-identity {
  display: flex;
  align-items: center;
  gap: var(--spacing-cozy);
}

.agent-logo {
  height: 2rem;
  width: auto;
  object-fit: contain;
  object-position: left center;
}

.agent-identity__divider {
  display: block;
  width: 1px;
  height: 1.5rem;
  background: color-mix(in srgb, #fff 20%, transparent);
}

.agent-sport-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: color-mix(in srgb, #fff 50%, transparent);
}

.agent-greeting {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: var(--font-weight-light, 300);
  color: color-mix(in srgb, #fff 90%, transparent);
  text-align: center;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

/* ─── Messages ───────────────────────────────────────────────────────────── */

.agent-messages {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-standard);
  padding-right: var(--spacing-tiny);
}

.agent-message--user {
  align-self: flex-end;
  max-width: 80%;
}

.agent-message--assistant {
  align-self: flex-start;
  max-width: 90%;
}

.agent-message--user .agent-message__content {
  background: color-mix(in srgb, #fff 10%, transparent);
  border: 1px solid color-mix(in srgb, #fff 12%, transparent);
  border-radius: var(--radius-xl);
  padding: var(--spacing-cozy) var(--spacing-standard);
  color: #fff;
  font-size: var(--text-base);
  line-height: var(--line-height-relaxed);
}

.agent-message--assistant .agent-message__content {
  color: color-mix(in srgb, #fff 80%, transparent);
  font-size: var(--text-base);
  line-height: var(--line-height-relaxed);
}

.agent-message--assistant .agent-message__content :deep(p) {
  margin-bottom: var(--spacing-narrow);
}

.agent-message--assistant .agent-message__content :deep(ul),
.agent-message--assistant .agent-message__content :deep(ol) {
  padding-left: var(--spacing-standard);
  margin-bottom: var(--spacing-narrow);
}

.agent-message--assistant .agent-message__content :deep(strong) {
  color: #fff;
}

/* ─── Typing indicator ───────────────────────────────────────────────────── */

.agent-typing {
  display: flex;
  gap: 5px;
  padding: var(--spacing-cozy) 0;
}

.agent-typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: color-mix(in srgb, #fff 40%, transparent);
  animation: agent-bounce 1.2s infinite;
}

.agent-typing span:nth-child(2) { animation-delay: 0.2s; }
.agent-typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes agent-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* ─── Input area ─────────────────────────────────────────────────────────── */

.agent-input-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-standard);
}

.agent-profile-panel {
  width: 100%;
  border: 1px solid color-mix(in srgb, #fff 12%, transparent);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-standard);
  background:
    linear-gradient(180deg, color-mix(in srgb, #fff 8%, transparent), color-mix(in srgb, #fff 3%, transparent)),
    radial-gradient(circle at top right, color-mix(in srgb, var(--color-brand-accent) 18%, transparent), transparent 38%);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #fff 3%, transparent);
}

.agent-profile-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-cozy);
  margin-bottom: var(--spacing-standard);
}

.agent-profile-panel__eyebrow {
  margin: 0 0 0.2rem;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, #fff 34%, transparent);
}

.agent-profile-panel__title {
  margin: 0;
  color: color-mix(in srgb, #fff 88%, transparent);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.agent-profile-panel__status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.7rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, #fff 8%, transparent);
  color: color-mix(in srgb, #fff 72%, transparent);
  font-size: 0.78rem;
  font-weight: var(--font-weight-semibold);
}

.agent-profile-panel__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--color-brand-accent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-brand-accent) 65%, transparent);
}

.agent-profile-panel__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-narrow);
}

.agent-profile-panel__cell {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 4.5rem;
  padding: var(--spacing-narrow) var(--spacing-cozy);
  border: 1px solid color-mix(in srgb, #fff 10%, transparent);
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, #fff 4%, transparent);
}

.agent-profile-panel__label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, #fff 34%, transparent);
}

.agent-profile-panel__value {
  color: #fff;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.15;
}

.agent-profile-panel__retention {
  margin-top: var(--spacing-standard);
  padding-top: var(--spacing-standard);
  border-top: 1px solid color-mix(in srgb, #fff 10%, transparent);
}

.agent-profile-panel__prompt {
  margin: 0 0 var(--spacing-cozy);
  color: color-mix(in srgb, #fff 82%, transparent);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.agent-profile-panel__actions {
  display: flex;
  gap: var(--spacing-narrow);
  flex-wrap: wrap;
}

.agent-profile-panel__action,
.agent-profile-panel__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, #fff 12%, transparent);
  background: color-mix(in srgb, #fff 5%, transparent);
  color: color-mix(in srgb, #fff 82%, transparent);
  padding: 0.55rem 1rem;
  font-size: 0.82rem;
  font-weight: var(--font-weight-semibold);
  transition: background var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default), transform var(--duration-fast) var(--ease-default);
}

.agent-profile-panel__action:hover,
.agent-profile-panel__cta:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, #fff 22%, transparent);
  color: #fff;
}

.agent-profile-panel__action.is-active,
.agent-profile-panel__action--primary {
  background: color-mix(in srgb, var(--color-brand-accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--color-brand-accent) 38%, transparent);
  color: #fff;
}

.agent-profile-panel__hook {
  margin-top: var(--spacing-cozy);
  padding: var(--spacing-cozy);
  border-radius: var(--radius-xl);
  border: 1px solid color-mix(in srgb, var(--color-brand-accent) 24%, transparent);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-brand-accent) 12%, transparent), color-mix(in srgb, #fff 3%, transparent));
}

.agent-profile-panel__hook-title {
  margin: 0 0 0.25rem;
  color: #fff;
  font-size: 0.9rem;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.02em;
}

.agent-profile-panel__hook-copy,
.agent-profile-panel__ephemeral {
  margin: var(--spacing-narrow) 0 0;
  color: color-mix(in srgb, #fff 68%, transparent);
  font-size: 0.82rem;
  line-height: 1.5;
}

.agent-profile-panel__cta {
  margin-top: var(--spacing-cozy);
  background: var(--color-brand-accent);
  border-color: transparent;
  color: #fff;
}

.agent-input-box {
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-narrow);
  background: color-mix(in srgb, #fff 7%, transparent);
  border: 1px solid color-mix(in srgb, #fff 12%, transparent);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-cozy) var(--spacing-cozy) var(--spacing-cozy) var(--spacing-comfortable);
  transition: border-color var(--duration-fast) var(--ease-default);
}

.agent-input-box:focus-within {
  border-color: color-mix(in srgb, #fff 25%, transparent);
}

.agent-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: var(--text-base);
  line-height: var(--line-height-relaxed);
  resize: none;
  max-height: 8rem;
  padding: 0;
}

.agent-input::placeholder {
  color: color-mix(in srgb, #fff 30%, transparent);
}

.agent-send {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-full);
  background: var(--color-brand-accent);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--duration-fast) var(--ease-default), opacity var(--duration-fast) var(--ease-default);
}

.agent-send:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.agent-send:not(:disabled):hover {
  background: color-mix(in srgb, var(--color-brand-accent) 80%, #fff);
}

/* ─── Quick actions ──────────────────────────────────────────────────────── */

.agent-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-narrow);
}

.agent-action {
  background: color-mix(in srgb, #fff 7%, transparent);
  border: 1px solid color-mix(in srgb, #fff 12%, transparent);
  border-radius: var(--radius-full);
  padding: var(--spacing-narrow) var(--spacing-standard);
  color: color-mix(in srgb, #fff 70%, transparent);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default);
  white-space: nowrap;
}

.agent-action:hover {
  background: color-mix(in srgb, #fff 12%, transparent);
  border-color: color-mix(in srgb, #fff 22%, transparent);
  color: #fff;
}

@media (max-width: 40rem) {
  .agent-overlay {
    padding: var(--spacing-standard);
  }

  .agent-close {
    top: var(--spacing-cozy);
    right: var(--spacing-cozy);
  }

  .agent-greeting {
    font-size: clamp(1.8rem, 7vw, 2.4rem);
  }

  .agent-profile-panel__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-profile-panel__actions {
    flex-direction: column;
  }

  .agent-actions {
    gap: var(--spacing-tiny);
  }

  .agent-action {
    font-size: var(--text-xs);
    padding: var(--spacing-tiny) var(--spacing-cozy);
  }
}
</style>
