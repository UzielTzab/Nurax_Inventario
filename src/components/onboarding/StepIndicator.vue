<template>
  <div class="wizard-progress">
    <div class="progress-bar-wrapper">
      <div class="step-indicator">
        <div 
          v-for="step in totalSteps" 
          :key="step"
          class="step-dot"
          :class="{
            active: step === currentStep,
            completed: step < currentStep
          }"
        ></div>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>
    <div class="progress-step active">
      Paso {{ currentStep }} de {{ totalSteps }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const props = defineProps<Props>();

const progressPercentage = computed(() => {
  return ((props.currentStep - 1) / (props.totalSteps - 1)) * 100;
});
</script>

<style scoped>
@import '@/styles/onboarding.css';
</style>
