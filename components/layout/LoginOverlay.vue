<template>
  <div class="login-overlay">
    <div class="login-card">
          <div class="login-logo">
            <img src="/train-hybrid-logo.png" alt="Train Hybrid" class="login-logo-img" />
          </div>

          <h1 class="login-title">Geschützter Bereich</h1>
          <p class="login-subtitle">Melde dich an, um fortzufahren.</p>

          <form class="login-form" @submit.prevent="onSubmit">
            <label class="login-field">
              <span class="login-label">Benutzername</span>
              <input
                v-model="username"
                type="text"
                name="username"
                autocomplete="username"
                placeholder="Benutzername"
                required
                class="login-input"
              />
            </label>

            <label class="login-field">
              <span class="login-label">Passwort</span>
              <input
                v-model="password"
                type="password"
                name="password"
                autocomplete="current-password"
                placeholder="••••••••"
                required
                class="login-input"
              />
            </label>

            <p v-if="error" class="login-error">{{ error }}</p>

            <button type="submit" class="btn-main login-submit" :disabled="loading">
              {{ loading ? 'Prüfe…' : 'Anmelden' }}
            </button>
          </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    window.location.href = redirect
  } catch {
    error.value = 'Benutzername oder Passwort ist falsch.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-overlay {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: color-mix(in srgb, var(--color-brand-primary) 85%, var(--color-brand-dark));
}

.login-card {
  background: #fff;
  border-radius: var(--radius-2xl);
  padding: 2.5rem 2.25rem;
  box-shadow:
    0 32px 64px rgba(15, 23, 42, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.login-logo-img {
  height: 3rem;
  width: auto;
  object-fit: contain;
}

.login-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-brand-dark);
  text-align: center;
  line-height: var(--line-height-tight);
}

.login-subtitle {
  margin: -0.5rem 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.25rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.login-label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.login-input {
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-md);
  border: 1.5px solid #e2e8f0;
  font-size: var(--text-base);
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-background);
  transition: border-color var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
  width: 100%;
}

.login-input::placeholder {
  color: var(--color-text-muted);
}

.login-input:focus {
  outline: none;
  border-color: var(--color-brand-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-accent) 18%, transparent);
}

.login-error {
  margin: 0;
  color: var(--color-error);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.login-submit {
  width: 100%;
  margin-top: 0.25rem;
  font-size: var(--text-base);
}

.login-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
