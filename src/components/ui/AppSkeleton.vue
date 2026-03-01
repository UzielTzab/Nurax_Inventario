<template>
  <!-- Single skeleton block -->
  <span
    v-if="!inline"
    class="skeleton"
    :style="{
      width: width,
      height: height,
      borderRadius: rounded ? '9999px' : radius,
    }"
  />
  <span
    v-else
    class="skeleton skeleton--inline"
    :style="{
      width: width,
      height: height,
      borderRadius: rounded ? '9999px' : radius,
    }"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?:   string
  height?:  string
  rounded?: boolean
  radius?:  string
  inline?:  boolean
}>(), {
  width:   '100%',
  height:  '1rem',
  rounded: false,
  radius:  '8px',
  inline:  false,
})
</script>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--skeleton-base,  #e5e7eb) 25%,
    var(--skeleton-shine, #f3f4f6) 50%,
    var(--skeleton-base,  #e5e7eb) 75%
  );
  background-size: 300% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  flex-shrink: 0;
}
.skeleton--inline { display: inline-block; }

@keyframes shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position:   0% 50%; }
}
</style>
