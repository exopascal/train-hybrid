<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">Train Hybrid</h3>
          <p class="footer-text">
            Dein Fitnessstudio für eine gesunde und aktive Lebensweise.
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">Links</h4>
          <nav class="footer-nav">
            <NuxtLink to="/" class="footer-link">Home</NuxtLink>
            <NuxtLink to="/kurse" class="footer-link">Kurse</NuxtLink>
            <NuxtLink to="/preise" class="footer-link">Preise</NuxtLink>
            <NuxtLink to="/team" class="footer-link">Team</NuxtLink>
          </nav>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">Kontakt</h4>
          <nav class="footer-nav">
            <NuxtLink to="/kontakt" class="footer-link">Kontakt</NuxtLink>
            <NuxtLink to="/impressum" class="footer-link">Impressum</NuxtLink>
            <NuxtLink to="/datenschutz" class="footer-link">Datenschutz</NuxtLink>
          </nav>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">Social Media</h4>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <span>FB</span>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <span>IG</span>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <span>YT</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} Train Hybrid. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: #f1f5f9;
  color: #0f172a;
  padding: var(--spacing-section) 0 var(--spacing-comfortable);
}

.footer-inner {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-spacious);
  margin-bottom: var(--spacing-spacious);
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-cozy);
}

.footer-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-narrow);
}

.footer-text {
  color: rgba(15, 23, 42, 0.72);
  line-height: var(--line-height-relaxed);
}

.footer-heading {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: #0f172a;
  margin-bottom: var(--spacing-narrow);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-narrow);
}

.footer-link {
  color: rgba(15, 23, 42, 0.72);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-default);
  font-size: var(--text-base);
}

.footer-link:hover {
  color: var(--color-brand-accent);
}

.social-links {
  display: flex;
  gap: var(--spacing-cozy);
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: all var(--duration-fast) var(--ease-default);
}

.social-link:hover {
  background: var(--color-brand-accent);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(15, 23, 42, 0.14);
  padding-top: var(--spacing-comfortable);
  text-align: center;
}

.copyright {
  color: rgba(15, 23, 42, 0.72);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-comfortable);
  }
}
</style>
