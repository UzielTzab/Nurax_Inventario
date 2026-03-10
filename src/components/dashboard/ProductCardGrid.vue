<template>
  <div class="card-grid">
    <TransitionGroup name="card-appear" tag="div" class="card-grid-inner">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        :class="{ 'card-out-of-stock': product.stock === 0 }"
      >
        <!-- Image -->
        <div class="card-image-wrap">
          <img v-if="product.image" :src="product.image" :alt="product.name" class="card-image" />
          <div v-else class="card-image-empty">
            <PhotoIcon class="card-empty-icon" />
          </div>
          <Badge class="card-status-badge" :variant="getStatusVariant(product.stock)">
            {{ getStatusText(product.stock) }}
          </Badge>
        </div>

        <!-- Body -->
        <div class="card-body">
          <div class="card-top-row">
            <div class="card-titles">
              <h3 class="card-name">{{ product.name }}</h3>
              <span class="card-category">{{ (product as any).category_name || product.category }}</span>
            </div>
            <!-- Actions menu -->
            <div class="card-menu-wrap" :ref="el => setMenuRef(el as HTMLElement, product.id)">
              <button class="btn-card-dots" @click.stop="toggleMenu(product.id, $event)" :class="{ active: openMenuId === product.id }">
                <span></span><span></span><span></span>
              </button>
              <Teleport to="body">
                <Transition name="menu-pop">
                  <div
                    v-if="openMenuId === product.id"
                    class="card-dropdown teleported-card-dropdown"
                    :style="{ position:'fixed', top: ddPos.top, bottom: ddPos.bottom, left: ddPos.left, transformOrigin: ddPos.origin }"
                  >
                    <button class="dd-item" @click="handleEdit(product)">
                      <PencilSquareIcon class="dd-icon" /> Editar
                    </button>
                    <button class="dd-item dd-danger" @click="handleDelete(product)">
                      <TrashIcon class="dd-icon" /> Eliminar
                    </button>
                  </div>
                </Transition>
              </Teleport>
            </div>
          </div>

          <div class="card-meta">
            <div class="meta-item">
              <span class="meta-label">Precio</span>
              <span class="meta-value price-val">${{ formatPrice(product.price) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Stock</span>
              <span class="meta-value" :class="{ 'stock-zero': product.stock === 0, 'stock-low': product.stock > 0 && product.stock <= 10 }">{{ product.stock }}</span>
            </div>
            <div class="meta-item meta-sku">
              <span class="meta-label">SKU</span>
              <span class="meta-value">{{ product.sku }}</span>
            </div>
          </div>

          <button v-if="product.stock === 0" class="btn-restock-card" @click="$emit('restock', product)">
            <ArrowPathIcon class="restock-icon" />
            Reabastecer
          </button>
        </div>
      </div>
    </TransitionGroup>

    <div v-if="products.length === 0" class="empty-cards">
      <ArchiveBoxXMarkIcon class="empty-icon" />
      <h3>No se encontraron productos</h3>
      <p>Ajusta los filtros o agrega un nuevo producto</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { PhotoIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon, ArchiveBoxXMarkIcon } from '@heroicons/vue/24/outline';
import Badge from '../ui/Badge.vue';
import type { Product } from './ProductTable.vue';

defineProps<{ products: Product[] }>();
const emit = defineEmits<{
  edit: [product: Product];
  delete: [product: Product];
  restock: [product: Product];
}>();

// --- Menu logic ---
const openMenuId = ref<string | number | null>(null);
const menuRefs = new Map<string | number, HTMLElement>();
const ddPos = ref({ top: '0px', left: '0px', bottom: 'auto', origin: 'top right' });

const setMenuRef = (el: HTMLElement | null, id: string | number) => {
  if (el) menuRefs.set(id, el); else menuRefs.delete(id);
};

const toggleMenu = (id: string | number, e: MouseEvent) => {
  if (openMenuId.value === id) { openMenuId.value = null; return; }
  openMenuId.value = id;
  const btn = e.currentTarget as HTMLElement;
  const r = btn.getBoundingClientRect();
  const below = window.innerHeight - r.bottom;
  if (below < 120 && r.top > 120) {
    ddPos.value = { top: 'auto', bottom: `${window.innerHeight - r.top + 6}px`, left: `${r.right - 150}px`, origin: 'bottom right' };
  } else {
    ddPos.value = { top: `${r.bottom + 6}px`, bottom: 'auto', left: `${r.right - 150}px`, origin: 'top right' };
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (!openMenuId.value) return;
  const dd = document.querySelector('.teleported-card-dropdown');
  const wrap = menuRefs.get(openMenuId.value);
  if ((dd && dd.contains(e.target as Node)) || (wrap && wrap.contains(e.target as Node))) return;
  openMenuId.value = null;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const handleEdit = (p: Product) => { openMenuId.value = null; emit('edit', p); };
const handleDelete = (p: Product) => { openMenuId.value = null; emit('delete', p); };

const formatPrice = (v: number | string) => Number(v).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const getStatusVariant = (s: number): 'success' | 'warning' | 'danger' => s === 0 ? 'danger' : s <= 10 ? 'warning' : 'success';
const getStatusText = (s: number) => s === 0 ? 'Sin Stock' : s <= 10 ? 'Stock Bajo' : 'En Stock';
</script>

<style scoped>
.card-grid-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 1.5rem;
}

/* ── Card ── */
.product-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 22px;
  overflow: hidden;
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 16px -5px rgba(34, 125, 82, 0.06), 0 2px 6px -2px rgba(0,0,0,0.04);
  min-height: 380px;
  width: 80%;
}
.product-card:hover {
  box-shadow: 0 24px 48px -12px rgba(34, 125, 82, 0.12), 0 8px 20px -8px rgba(0,0,0,0.08);
  transform: translateY(-8px);
  border-color: #16a34a;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -8px rgba(0,0,0,0.12), 0 8px 16px -6px rgba(0,0,0,0.08);
}
.card-out-of-stock { border-color: var(--color-card-border); background: #fef5f5; }

/* ── Image area ── */
.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  overflow: hidden;
  border-bottom: 2px solid #227d52;
}
.card-image { width: 100%; height: 100%; object-fit: cover; }
.card-image-empty {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}
.card-empty-icon { width: 44px; height: 44px; color: #16a34a; }
.card-status-badge { position: absolute; top: 0.75rem; right: 0.75rem; font-size: 0.7rem; }

/* ── Body ── */
.card-body { padding: 1.25rem 1.25rem 1.375rem; flex: 1; display: flex; flex-direction: column; gap: 0.875rem; }
.card-top-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
.card-titles { min-width: 0; }
.card-name { font-size: 0.95rem; font-weight: 800; color: #06402B; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0.5px 1px rgba(6, 64, 43, 0.08); }
.card-category { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 500; }

/* ── Meta grid ── */
.card-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; padding-top: 0.625rem; border-top: 1.5px solid #f0fdf4; }
.meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
.meta-sku { grid-column: 1 / -1; padding-top: 0.375rem; border-top: 1.5px solid #f0fdf4; margin-top: 0.375rem; }
.meta-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.45px; color: #06402B; }
.meta-value { font-size: 0.875rem; font-weight: 700; color: var(--color-text-main); }
.price-val { color: #227d52; font-size: 0.95rem; font-weight: 800; }
.stock-zero { color: #dc2626; }
.stock-low { color: #ea580c; }

/* ── Restock button ── */
.btn-restock-card {
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.55rem 0.65rem; border-radius: 11px;
  background: #f0fdf4; border: 1.5px solid #16a34a; color: #16a34a;
  font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-restock-card:hover { background: #dcfce7; border-color: #15803d; color: #15803d; }
.restock-icon { width: 15px; height: 15px; }

/* ── Dots menu ── */
.card-menu-wrap { position: relative; }
.btn-card-dots {
  display: flex; align-items: center; justify-content: center; gap: 3px;
  width: 30px; height: 30px; background: transparent; border: none;
  border-radius: 8px; cursor: pointer; transition: background 0.15s; padding: 0;
}
.btn-card-dots span { display: block; width: 4px; height: 4px; border-radius: 50%; background: #9ca3af; transition: background 0.15s; }
.btn-card-dots:hover, .btn-card-dots.active { background: #f3f4f6; }
.btn-card-dots:hover span, .btn-card-dots.active span { background: #374151; }

.card-dropdown {
  background: white; border: 1px solid #e5e7eb; border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); min-width: 150px; z-index: 100; overflow: hidden;
}
.dd-item {
  display: flex; align-items: center; gap: 0.625rem; width: 100%; padding: 0.625rem 1rem;
  background: none; border: none; font-size: 0.875rem; color: #374151; cursor: pointer; text-align: left; transition: background 0.15s;
}
.dd-item:hover { background: #f9fafb; }
.dd-icon { width: 15px; height: 15px; flex-shrink: 0; color: #6b7280; }
.dd-danger { color: #ef4444; }
.dd-danger .dd-icon { color: #ef4444; }
.dd-danger:hover { background: #fef2f2; }

/* ── Transitions ── */
.menu-pop-enter-active, .menu-pop-leave-active { transition: all 0.15s ease; }
.menu-pop-enter-from, .menu-pop-leave-to { opacity: 0; transform: scale(0.92) translateY(-4px); }

.card-appear-enter-active { transition: all 0.3s ease; }
.card-appear-enter-from { opacity: 0; transform: translateY(12px); }

/* ── Empty ── */
.empty-cards { display: flex; flex-direction: column; align-items: center; padding: 4rem 2rem; color: #9ca3af; text-align: center; }
.empty-cards .empty-icon { width: 56px; height: 56px; margin-bottom: 1rem; }
.empty-cards h3 { font-size: 1.125rem; font-weight: 600; color: #6b7280; margin: 0 0 0.5rem; }
.empty-cards p { font-size: 0.875rem; margin: 0; }

@media (max-width: 768px) {
  .card-grid-inner { 
    grid-template-columns: repeat(3, 1fr); 
    gap: 0.9rem; 
    padding: 1.2rem; 
  }
  .product-card { min-height: 360px; }
  .card-name { font-size: 0.85rem; }
  .card-category { font-size: 0.7rem; }
  .card-body { padding: 1rem 1rem 1.15rem; gap: 0.65rem; }
  .card-meta { gap: 0.4rem; }
  .meta-label { font-size: 0.6rem; }
  .meta-value { font-size: 0.8rem; }
  .restock-icon { width: 13px; height: 13px; }
  .btn-restock-card { font-size: 0.75rem; padding: 0.4rem 0.5rem; }
  .card-status-badge { font-size: 0.6rem; padding: 0.15rem 0.35rem; }
}

@media (max-width: 640px) {
  .card-grid-inner { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 0.8rem; 
    padding: 1rem; 
  }
  .product-card { min-height: 340px; }
  .card-name { font-size: 0.8rem; }
}
</style>
