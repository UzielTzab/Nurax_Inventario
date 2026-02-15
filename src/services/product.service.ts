// import apiClient from './api'  // TODO: Uncomment when API is ready

interface ProductData {
  id?: string
  name: string
  sku: string
  price: number
  quantity: number
  description?: string
  category?: string
}

const productService = {
  /**
   * Obtener todos los productos
   */
  async getAll() {
    // TODO: Implementar cuando API esté lista
    // return apiClient.get('/products')
    return { success: true, data: [] }
  },

  /**
   * Obtener producto por ID
   */
  async getById(_id: string) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.get(`/products/${id}`)
    return { success: true, data: null }
  },

  /**
   * Crear nuevo producto
   */
  async create(product: ProductData) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.post('/products', product)
    return { success: true, data: product }
  },

  /**
   * Actualizar producto
   */
  async update(_id: string, updates: Partial<ProductData>) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.put(`/products/${id}`, updates)
    return { success: true, data: updates }
  },

  /**
   * Eliminar producto
   */
  async delete(_id: string) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.delete(`/products/${id}`)
    return { success: true }
  },

  /**
   * Buscar productos
   */
  async search(_query: string) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.get('/products/search', { params: { q: query } })
    return { success: true, data: [] }
  }
}

export default productService
