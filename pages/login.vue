<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="onSubmit">
      <h1 class="login-title">Geschützter Bereich</h1>
      <p class="login-subtitle">Bitte melde dich an, um fortzufahren.</p>

      <label class="login-field">
        <span>Benutzername</span>
        <input v-model="username" type="text" name="username" autocomplete="username" required />
      </label>

      <label class="login-field">
        <span>Passwort</span>
        <input v-model="password" type="password" name="password" autocomplete="current-password" required />
      </label>

      <p v-if="error" class="login-error">{{ error }}</p>

      <button class="btn-main login-submit" type="submit" :disabled="loading">
        {{ loading ? 'Prüfe…' : 'Anmelden' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

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
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #eeecea;
}

.login-card {
  width: 100%;
  max-width: 22rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2.5rem;
  border-radius: var(--radius-lg, 1rem);
  background: #fff;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.login-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.login-subtitle {
  margin: -0.75rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.login-field input {
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid #d8d5d1;
  font-size: 1rem;
}

.login-field input:focus {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 1px;
}

.login-error {
  margin: 0;
  color: #dc2626;
  font-size: 0.9rem;
}

.login-submit {
  width: 100%;
  margin-top: 0.25rem;
}
</style>
