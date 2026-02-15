/**
 * API Configuration and Base Instance
 * 
 * TODO: Configurar la URL de la API cuando esté lista
 * const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'
 */

interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    method: string,
    endpoint: string,
    _config?: RequestConfig & { body?: any }
  ): Promise<ApiResponse<T>> {
    try {
      // TODO: Implementar cuando API esté lista
      console.log(`[${method}] ${this.baseUrl}${endpoint}`)
      
      // Placeholder response
      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      return {
        success: false,
        error: String(error)
      }
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request('GET', endpoint, config)
  }

  post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request('POST', endpoint, { ...config, body })
  }

  put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request('PUT', endpoint, { ...config, body })
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request('DELETE', endpoint, config)
  }
}

// Crear instancia del cliente
const apiClient = new ApiClient(import.meta.env.VITE_API_URL || 'http://localhost:3000/api')

export default apiClient
