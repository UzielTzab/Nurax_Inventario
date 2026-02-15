<template>
  <div class="pagination">
    <div class="pagination-info">
      Showing <strong>{{ startItem }}-{{ endItem }}</strong> of <strong>{{ total }}</strong> results
    </div>

    <div class="pagination-controls">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="pagination-number"
        :class="{ 'pagination-active': currentPage === page }"
        @click="$emit('update:currentPage', page)"
      >
        {{ page }}
      </button>

      <span v-if="showEllipsis" class="pagination-ellipsis">...</span>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </button>

      <button class="pagination-help" title="Help">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  pageSize: number;
  total: number;
}

const props = defineProps<Props>();

defineEmits<{
  'update:currentPage': [page: number];
}>();

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1);

const endItem = computed(() => {
  const end = props.currentPage * props.pageSize;
  return end > props.total ? props.total : end;
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 3;
  
  let start = Math.max(1, props.currentPage - 1);
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const showEllipsis = computed(() => {
  return totalPages.value > 3 && props.currentPage < totalPages.value - 1;
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-info strong {
  color: #111827;
  font-weight: 600;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn,
.pagination-number,
.pagination-help {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0.5rem;
  border: 1px solid var(--color-card-border);
  border-radius: 6px;
  background: var(--color-card-fill);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination-btn svg,
.pagination-help svg {
  width: 18px;
  height: 18px;
}

.pagination-btn:hover:not(:disabled),
.pagination-number:hover,
.pagination-help:hover {
  background: var(--color-background);
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-active {
  background: var(--color-brand-secondary) !important;
  border-color: var(--color-brand-secondary) !important;
  color: white !important;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: #6b7280;
  font-weight: 600;
}

.pagination-help {
  margin-left: 0.25rem;
  color: var(--color-brand-secondary);
  border-color: var(--color-brand-secondary);
}

@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pagination-info {
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
  }
}
</style>
