<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <NuxtPage />
    </main>
    <Footer />
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import ChatWidget from '~/components/ChatWidget.vue'
</script>

<style>
.main-content {
  min-height: 60vh;
}
</style>
