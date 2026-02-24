<template>
  <div class="dynamic-page">
    <div class="not-found">
      <div class="container">
        <div class="not-found-content">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <NuxtLink to="/" class="btn btn-primary">Go Home</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Builder.io disabled: all dynamic slugs return 404.
</script>

<style scoped>
.dynamic-page {
  min-height: 100vh;
}

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  padding: var(--spacing-4xl) var(--spacing-xl);
}

.not-found-content h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.not-found-content p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
}

.btn {
  display: inline-block;
  padding: var(--button-padding-md);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-light);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

</style>
