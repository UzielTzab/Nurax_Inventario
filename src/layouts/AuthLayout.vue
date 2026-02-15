<template>
  <div class="auth-layout">
    <div style="padding: 2rem; text-align: center;">
      <h1>AuthLayout - Testing</h1>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}</style>
