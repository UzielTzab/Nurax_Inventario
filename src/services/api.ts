/**
 * API Configuration and Base Instance
 */

export interface RequestConfig extends RequestInit {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private async request<T>(
    method: string,
    endpoint: string,
    config?: RequestConfig & { body?: any }
  ): Promise<ApiResponse<T>> {
    try {
      // 1. Prepare URL with Query Params if necessary
      let url = new URL(`${this.baseUrl}${endpoint}`)
      if (config?.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value))
        })
      }

      // 2. Prepare Headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config?.headers,
      }

      // Automatically inject Auth Token!
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // 3. Prepare Fetch Options
      const fetchOptions: RequestInit = {
        method,
        headers,
        ...config, // Will bring things like credentials, mode, etc if overridden
      }

      // Stringify JSON body if provided
      if (config?.body && typeof config.body !== 'string' && !(config.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(config.body)
      } else if (config?.body instanceof FormData) {
        // Remove Content-Type if FormData, so browser can set boundary automatically
        delete headers['Content-Type']
        fetchOptions.body = config.body
      }

      // 4. Do Request
      const response = await fetch(url.toString(), fetchOptions)

      // Get the response text first
      const responseText = await response.text()
      let data: any = null
      
      try {
        if (responseText) data = JSON.parse(responseText)
      } catch (e) {
        console.warn('Response is not JSON', responseText)
      }

      if (!response.ok) {
        // Format error elegantly
        const errorMessage = data?.detail || data?.message || response.statusText || 'Error en la petición'
        return {
          success: false,
          error: errorMessage,
          status: response.status,
          data: data // Sometimes APIs send validation errors in the body
        }
      }

      return {
        success: true,
        data: data as T,
        status: response.status,
      }
    } catch (error: any) {
      console.error('[API] fetch error:', error)
      return {
        success: false,
        error: error.message || 'Error de red o conexión',
      }
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, config)
  }

  post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { ...config, body })
  }

  put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, { ...config, body })
  }

  patch<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, { ...config, body })
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, config)
  }
}

// Configurado a localhost:8000 para apuntar al backend Django como pidió el cliente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const apiClient = new ApiClient(API_URL)

export default apiClient
