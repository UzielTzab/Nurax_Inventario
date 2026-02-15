import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // const response = await productService.getAll()
      // products.value = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (_product: Omit<Product, 'id'>) => {
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // const response = await productService.create(product)
      // products.value.push(response.data)
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const updateProduct = async (_id: string, _updates: Partial<Product>) => {
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // const response = await productService.update(id, updates)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (_id: string) => {
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // await productService.delete(id)
      // products.value = products.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return {
    products,
    isLoading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
})
