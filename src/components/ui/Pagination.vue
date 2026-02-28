<template>
  <div v-if="totalPages > 0" class="pagination">
   

    <!-- Controls -->
    <div class="pagination-controls">
      <!-- First page -->
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        title="Primera página"
        @click="go(1)"
      >
        <ChevronDoubleLeftIcon class="btn-icon" />
      </button>

      <!-- Prev page -->
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        title="Página anterior"
        @click="go(currentPage - 1)"
      >
        <ChevronLeftIcon class="btn-icon" />
      </button>

      <!-- Page numbers -->
      <template v-for="item in pageItems" :key="item">
        <span v-if="item === '...'" class="pagination-ellipsis">…</span>
        <button
          v-else
          class="pagination-number"
          :class="{ 'pagination-active': currentPage === item }"
          @click="go(item as number)"
        >
          {{ item }}
        </button>
      </template>

      <!-- Next page -->
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        title="Página siguiente"
        @click="go(currentPage + 1)"
      >
        <ChevronRightIcon class="btn-icon" />
      </button>

      <!-- Last page -->
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        title="Última página"
        @click="go(totalPages)"
      >
        <ChevronDoubleRightIcon class="btn-icon" />
      </button>
    </div>

    <!-- Page size selector -->
    <div class="pagination-size">
      <label for="page-size-select" class="size-label">Filas:</label>
      <select
        id="page-size-select"
        class="size-select"
        :value="pageSize"
        @change="onPageSizeChange"
      >
        <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline'

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  /** Current active page (1-indexed). Use v-model:current-page */
  currentPage: number
  /** Number of rows per page. Use v-model:page-size */
  pageSize: number
  /** Total number of items across ALL pages */
  total: number
  /** Page-size options shown in the dropdown */
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [5, 10, 20, 50],
})

// ── Emits ──────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
}>()

// ── Computed ───────────────────────────────────────────────────────────────
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

/**
 * Builds the array of page numbers to show, with ellipsis where needed.
 * Example for 10 pages at page 5: [1, '...', 4, 5, 6, '...', 10]
 */
const pageItems = computed<(number | '...')[]>(() => {
  const total = totalPages.value
  const cur = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | '...')[] = [1]

  if (cur > 3) items.push('...')

  const start = Math.max(2, cur - 1)
  const end = Math.min(total - 1, cur + 1)

  for (let i = start; i <= end; i++) items.push(i)

  if (cur < total - 2) items.push('...')

  items.push(total)

  return items
})

// ── Methods ────────────────────────────────────────────────────────────────
function go(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
}

function onPageSizeChange(e: Event) {
  const size = Number((e.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  // Return to first page when changing size
  emit('update:currentPage', 1)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Info */
.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
}

.pagination-info strong {
  color: #111827;
  font-weight: 600;
}

/* Controls */
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.pagination-btn,
.pagination-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 0.4rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  line-height: 1;
}

.btn-icon {
  width: 15px;
  height: 15px;
}

.pagination-btn:hover:not(:disabled),
.pagination-number:hover:not(.pagination-active) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination-active {
  background: var(--color-brand-main, #06402B) !important;
  border-color: var(--color-brand-main, #06402B) !important;
  color: white !important;
  font-weight: 700 !important;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 34px;
  color: #9ca3af;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

/* Page-size selector */
.pagination-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.size-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.size-select {
  padding: 0.35rem 0.6rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #374151;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}

.size-select:focus {
  border-color: var(--color-brand-main, #06402B);
}

/* Responsive */
@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .pagination-info {
    text-align: center;
  }
}
</style>
