<template>
  <section class="contextual-integratio">
    <div class="contextual-integratio__overlay"></div>
    <div class="contextual-integratio__content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.contextual-integratio {
  position: relative;
  height: 55vh;
  background-image: url("/krafttraining-muskeltraining-ausdauersport-outdoor-hybrid.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.contextual-integratio__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.contextual-integratio__content {
  position: relative;
  z-index: 1;
  height: 100%;
}
</style>
