<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-wrap">
        <img src="/train-hybrid-logo.png" alt="Train Hybrid" class="logo" />
      </div>
      <h1 class="title">Train Hybrid</h1>
      <p class="subtitle">Bitte melde dich an</p>

      <form class="form" @submit.prevent="handleSubmit">
        <div class="field">
          <label for="username">Benutzername</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="Benutzername"
            required
          />
        </div>
        <div class="field">
          <label for="password">Passwort</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Passwort"
            required
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading">Wird geprüft…</span>
          <span v-else>Anmelden</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    await navigateTo('/', { replace: true })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err?.data?.message ?? 'Anmeldung fehlgeschlagen'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-brand-dark);
  padding: 1rem;
}

.login-card {
  background: var(--color-brand-primary);
  border: 1px solid rgba(74, 106, 127, 0.3);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.logo-wrap {
  margin-bottom: 1rem;
}

.logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-light);
  margin: 0 0 0.25rem;
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}

.field input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(74, 106, 127, 0.4);
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  color: var(--color-text-light);
  font-size: var(--font-size-base);
  outline: none;
  transition: border-color 0.2s;
}

.field input::placeholder {
  color: rgba(148, 163, 184, 0.5);
}

.field input:focus {
  border-color: var(--color-brand-accent);
}

.error-msg {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin: 0;
}

.btn {
  background: var(--color-brand-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  opacity: 0.9;
}
</style>
