<template>
  <aside class="w-64 bg-indigo-900 text-white flex flex-col">
    <div class="p-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </div>
    <nav class="flex-1 px-2 space-y-2">
      <a href="#" class="flex items-center px-4 py-2 text-gray-100 bg-indigo-600 rounded-md">
        <CubeIcon class="h-6 w-6 mr-3" />
        Productos
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600 hover:text-white rounded-md">
        <TruckIcon class="h-6 w-6 mr-3" />
        Proveedores
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600 hover:text-white rounded-md">
        <ChartBarIcon class="h-6 w-6 mr-3" />
        Reportes
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600 hover:text-white rounded-md">
        <Cog6ToothIcon class="h-6 w-6 mr-3" />
        Configuración
      </a>
    </nav>
    <div class="p-4 space-y-2">
      <button @click="$emit('openInventoryReceipt')" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition-colors">
        <TruckIcon class="h-5 w-5 mr-2" />
        Recibir Inventario
      </button>
      <button @click="$emit('openAddProduct')" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition-colors">
        <PlusIcon class="h-5 w-5 mr-2" />
        Nuevo Producto
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { CubeIcon, TruckIcon, ChartBarIcon, Cog6ToothIcon, PlusIcon } from '@heroicons/vue/24/outline';

defineEmits<{
  openAddProduct: [];
  openInventoryReceipt: [];
}>();
</script>
