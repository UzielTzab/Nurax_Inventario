import { defineStore } from 'pinia'
import { ref } from 'vue'

interface InventoryItem {
  productId: string
  quantity: number
  location: string
  lastUpdated: string
}

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref<InventoryItem[]>([])
  const isLoading = ref(false)

  const fetchInventory = async () => {
    isLoading.value = true
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // const response = await inventoryService.getAll()
      // inventory.value = response.data
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateInventory = async (_productId: string, _quantity: number) => {
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // await inventoryService.update(productId, { quantity })
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  const getLowStockItems = () => {
    // TODO: Implementar lógica cuando API esté lista
    return inventory.value.filter(item => item.quantity < 10)
  }

  return {
    inventory,
    isLoading,
    fetchInventory,
    updateInventory,
    getLowStockItems
  }
})
