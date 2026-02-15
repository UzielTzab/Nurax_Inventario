<template>
  <div class="filter-bar">
    <!-- Filtros -->
    <div class="filters-left">
      <div class="filter-label">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
        </svg>
        <span>Filtros:</span>
      </div>

      <select v-model="localFilters.category" class="filter-select" @change="emitFilters">
        <option value="">Categoria: Todos</option>
        <option value="audio">Audio</option>
        <option value="photography">Photography</option>
        <option value="wearable">Wearable</option>
        <option value="computing">Computing</option>
      </select>

      <select v-model="localFilters.supplier" class="filter-select" @change="emitFilters">
        <option value="">Proveedor: Todos</option>
        <option value="supplier1">Supplier 1</option>
        <option value="supplier2">Supplier 2</option>
        <option value="supplier3">Supplier 3</option>
      </select>

      <select v-model="localFilters.priceRange" class="filter-select" @change="emitFilters">
        <option value="">Rango de precio</option>
        <option value="0-100">$0 - $100</option>
        <option value="100-500">$100 - $500</option>
        <option value="500-1000">$500 - $1,000</option>
        <option value="1000+">$1,000+</option>
      </select>
    </div>

    <!-- Vista y Reset -->
    <div class="filters-right">
      <button class="btn-reset" @click="resetFilters">
        Reset
      </button>

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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Filters {
  category: string;
  supplier: string;
  priceRange: string;
}

interface Props {
  filters: Filters;
  view: 'list' | 'grid';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:filters': [filters: Filters];
  'update:view': [view: 'list' | 'grid'];
}>();

const localFilters = ref<Filters>({ ...props.filters });

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters };
}, { deep: true });

const emitFilters = () => {
  emit('update:filters', { ...localFilters.value });
};

const resetFilters = () => {
  localFilters.value = {
    category: '',
    supplier: '',
    priceRange: ''
  };
  emitFilters();
};
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

.filters-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-label svg {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.filter-select {
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--color-card-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--color-card-fill);
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  border-color: #d1d5db;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-brand-secondary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.filters-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-reset {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-card-border);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--color-card-fill);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #f9fafb;
  color: #374151;
}

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
