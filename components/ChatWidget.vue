<script setup lang="ts">
import { computed, nextTick, ref } from "vue"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const isOpen = ref(false)
const isLoading = ref(false)
const input = ref("")
const messages = ref<ChatMessage[]>([])
const messageListRef = ref<HTMLDivElement | null>(null)
const greeting = "Moin, ich bin EXO der Agent von Train Hybrid. Wie kann ich dir helfen?"

const canSend = computed(() => input.value.trim().length > 0 && !isLoading.value)

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const sendToServer = async (content: string) => {
  isLoading.value = true
  try {
    const response = await $fetch<{ reply: string }>("/api/chat", {
      method: "POST",
      body: { message: content },
    })
    messages.value.push({ role: "assistant", content: response.reply })
  } catch (error) {
    messages.value.push({
      role: "assistant",
      content: "Es gab ein Problem. Bitte versuche es gleich noch einmal.",
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const sendMessage = async () => {
  if (!canSend.value) return
  const content = input.value.trim()
  input.value = ""
  messages.value.push({ role: "user", content })
  await scrollToBottom()
  await sendToServer(content)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== "Enter" || event.shiftKey) return
  event.preventDefault()
  sendMessage()
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    messages.value.push({ role: "assistant", content: greeting })
  }
}
</script>

<template>
  <div class="chat-widget">
    <button
      type="button"
      class="chat-widget__fab"
      @click="toggleOpen"
      aria-label="Chat öffnen"
    >
      Chat
    </button>

    <div v-if="isOpen" class="chat-widget__panel" role="dialog" aria-label="Chat">
      <div class="chat-widget__header">
        <div>
          <p class="chat-widget__title">Train Hybrid</p>
          <p class="chat-widget__subtitle">Schnelle Hilfe</p>
        </div>
        <button
          type="button"
          class="chat-widget__close"
          @click="isOpen = false"
          aria-label="Chat schließen"
        >
          ×
        </button>
      </div>

      <div ref="messageListRef" class="chat-widget__messages">
        <div
          v-for="(message, index) in messages"
          :key="`${message.role}-${index}`"
          :class="[
            'chat-widget__message',
            message.role === 'user' ? 'is-user' : 'is-assistant',
          ]"
        >
          {{ message.content }}
        </div>
        <div v-if="isLoading" class="chat-widget__message is-assistant">
          …
        </div>
      </div>

      <div class="chat-widget__input">
        <textarea
          v-model="input"
          class="chat-widget__textarea"
          rows="2"
          placeholder="Frage stellen…"
          :disabled="isLoading"
          @keydown="onKeydown"
        />
        <button
          type="button"
          class="chat-widget__send"
          :disabled="!canSend"
          @click="sendMessage"
        >
          Senden
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
}

.chat-widget__fab {
  background: linear-gradient(135deg, #ff7a1a 0%, #ff5a1f 100%);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 13px 24px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 14px 32px rgba(255, 106, 26, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.14) inset;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.chat-widget__fab:hover {
  transform: translateY(-2px) scale(1.02);
  filter: brightness(1.05);
  box-shadow: 0 18px 36px rgba(255, 106, 26, 0.52), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

.chat-widget__panel {
  position: absolute;
  right: 0;
  bottom: 56px;
  width: 100%;
  min-width: 35vw;
  max-width: 420px;
  height: 520px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 640px) {
  .chat-widget {
    right: 0;
    bottom: 0;
    width: 100%;
  }

  .chat-widget__fab {
    right: 16px;
    bottom: 16px;
    position: fixed;
  }

  .chat-widget__panel {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}

.chat-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.chat-widget__title {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}

.chat-widget__subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.chat-widget__close {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
}

.chat-widget__messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-widget__message {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.chat-widget__message.is-user {
  align-self: flex-end;
  background: #111827;
  color: #fff;
}

.chat-widget__message.is-assistant {
  align-self: flex-start;
  background: #e5e7eb;
  color: #111827;
}

.chat-widget__input {
  display: flex;
  gap: 10px;
  padding: 12px 14px 16px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.chat-widget__textarea {
  flex: 1;
  resize: none;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  background: #fff;
}

.chat-widget__textarea:disabled {
  background: #f3f4f6;
}

.chat-widget__send {
  border: none;
  border-radius: 12px;
  padding: 0 14px;
  background: #111827;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.chat-widget__send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
