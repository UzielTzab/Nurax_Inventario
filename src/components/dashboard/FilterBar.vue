<template>
  <div class="filter-bar">
    <div class="spacer"></div>
    <!-- Vista Toggle -->
    <div class="view-toggle">
      <button
        class="view-btn"
        :class="{ 'view-active': view === 'list' }"
        @click="$emit('update:view', 'list')"
        title="List View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
      </button>
      <button
        class="view-btn"
        :class="{ 'view-active': view === 'grid' }"
        @click="$emit('update:view', 'grid')"
        title="Grid View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zM4.25 11A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zM13.25 2A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zM13.25 11A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Re-export Filters type to avoid breaking Dashboard.vue imports
export interface Filters {
  category: string;
  supplier: string;
  priceRange: string;
}

interface Props {
  filters: Filters;
  view: 'list' | 'grid';
}

defineProps<Props>();

defineEmits<{
  'update:view': [view: 'list' | 'grid'];
}>();

</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.spacer {
  flex: 1;
}

/* Removed filter styles */

/* Removed filter inputs and reset button styles */

.view-toggle {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.view-btn {
  padding: 0.5rem;
  background: white;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn svg {
  width: 18px;
  height: 18px;
}

.view-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.view-active {
  background: var(--color-brand-secondary) !important;
  color: white !important;
}

.view-btn:not(:last-child) {
  border-right: 1px solid #e5e7eb;
}

@media (max-width: 1024px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left,
  .filters-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
