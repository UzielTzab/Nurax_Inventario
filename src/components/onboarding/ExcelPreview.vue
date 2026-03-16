<template>
  <div class="preview-table-wrapper">
    <table class="preview-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in data.slice(0, 5)" :key="idx">
          <td v-for="col in columns" :key="`${idx}-${col}`">
            {{ row[col] || '—' }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="data.length > 5" class="preview-hint">
      Mostrando 5 de {{ data.length }} filas
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: any[];
  columns: string[];
}

defineProps<Props>();
</script>

<style scoped>
@import '@/styles/onboarding.css';

.preview-table-wrapper {
  margin-top: 1rem;
}

.preview-hint {
  margin: 0.75rem 0 0 0;
  font-size: 0.75rem;
  color: var(--color-wizard-text-grey);
  text-align: center;
}
</style>
