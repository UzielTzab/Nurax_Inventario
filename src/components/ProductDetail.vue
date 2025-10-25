<template>
  <Transition name="slide">
    <aside v-if="product" class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-50">
      <div class="p-8">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
            <p class="text-sm text-gray-500">{{ product.sku }}</p>
          </div>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <img :src="product.image" alt="" class="w-full h-48 object-cover rounded-lg shadow-md">

        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-xs text-gray-500 uppercase">Cantidad</p>
            <p class="text-lg font-semibold text-gray-900">{{ product.quantity }} Unidades</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-xs text-gray-500 uppercase">Precio</p>
            <p class="text-lg font-semibold text-gray-900">{{ product.price }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-xs text-gray-500 uppercase">Proveedor</p>
            <p class="text-sm font-semibold text-gray-900">{{ product.supplier }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-xs text-gray-500 uppercase">Última Actualización</p>
            <p class="text-sm font-semibold text-gray-900">20/07/2023</p>
          </div>
        </div>

        <div class="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">Añadir al Inventario</h4>
          <div class="flex items-center">
            <input type="number" value="1" class="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <button class="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md flex items-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir
            </button>
          </div>
        </div>

        <div class="mt-6 flex space-x-3">
          <button class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
            Editar
          </button>
          <button class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
            Eliminar
          </button>
        </div>
      </div>
    </aside>
  </Transition>

  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="product" @click="$emit('close')" class="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  product: Object
});
defineEmits(['close']);
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
