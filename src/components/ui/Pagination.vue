<template>
  <div v-if="total > 0" class="pagination-wrapper">
    <!-- Left: info + page size -->
    <div class="pagination-left">
      <span class="pagination-info">
        {{ rangeStart }}–{{ rangeEnd }} de {{ total }}
      </span>
      <select class="page-size-select" :value="pageSize" @change="onPageSizeChange">
        <option v-for="s in pageSizes" :key="s" :value="s">{{ s }} por página</option>
      </select>
    </div>

    <!-- Right: page buttons -->
    <div class="pagination-right">
      <button class="page-btn" :disabled="currentPage <= 1" @click="goTo(currentPage - 1)" title="Página anterior">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/>
        </svg>
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="page-ellipsis">…</span>
        <button
          v-else
          class="page-btn"
          :class="{ 'page-btn--active': page === currentPage }"
          @click="goTo(page as number)"
        >{{ page }}</button>
      </template>

      <button class="page-btn" :disabled="currentPage >= totalPages" @click="goTo(currentPage + 1)" title="Página siguiente">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  currentPage: number
  pageSize: number
  total: number
  pageSizes?: number[]
}>(), {
  pageSizes: () => [10, 25, 50, 100]
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize':    [size: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const rangeStart = computed(() => Math.min((props.currentPage - 1) * props.pageSize + 1, props.total))
const rangeEnd   = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

// Build visible page numbers with ellipsis
const visiblePages = computed(() => {
  const total = totalPages.value
  const cur   = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (cur > 3)  pages.push('...')

  const start = Math.max(2, cur - 1)
  const end   = Math.min(total - 1, cur + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const goTo = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
}

const onPageSizeChange = (e: Event) => {
  const size = Number((e.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-card-border, #e5e7eb);
  background: var(--color-card-fill, #fff);
}

.pagination-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.pagination-info {
  font-size: 0.8125rem;
  color: #6b7280;
  white-space: nowrap;
}

.page-size-select {
  font-size: 0.8125rem;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}
.page-size-select:focus { border-color: var(--color-brand-main, #227d52); }

.pagination-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 0.4rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-family: inherit;
}
.page-btn svg { width: 16px; height: 16px; }
.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-btn--active {
  background: var(--color-brand-main, #227d52);
  border-color: var(--color-brand-main, #227d52);
  color: #fff;
}
.page-btn--active:hover {
  background: var(--color-brand-secondary, #06402B);
  border-color: var(--color-brand-secondary, #06402B);
}

.page-ellipsis {
  font-size: 0.875rem;
  color: #9ca3af;
  padding: 0 0.25rem;
  user-select: none;
}
</style>
