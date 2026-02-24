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
      let response = await fetch(url.toString(), fetchOptions)

      // Handle 401 Unauthorized (Token expired) interception
      if (response.status === 401 && !endpoint.includes('/auth/login/') && !endpoint.includes('/auth/refresh/')) {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            // Intentar refrescar el token
            const refreshUrl = new URL(`${this.baseUrl}/auth/refresh/`)
            const refreshResponse = await fetch(refreshUrl.toString(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            })

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              const newAccessToken = refreshData.access
              localStorage.setItem('access_token', newAccessToken)
              
              // Actualizar el header de Authorization con el nuevo token
              headers['Authorization'] = `Bearer ${newAccessToken}`
              fetchOptions.headers = headers
              
              // Reintentar la petición original
              response = await fetch(url.toString(), fetchOptions)
            } else {
              // El refresh token expiró o es inválido
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              // Se podría agregar un window.location.href = '/login' si se desea forzar redirección
            }
          } catch (e) {
            console.error('[API] Error refreshing token:', e)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
          }
        } else {
          localStorage.removeItem('access_token')
        }
      }

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

// Prioriza VITE_API_BASE_URL para Netlify/Render, con fallback a VITE_API_URL o entorno local
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const apiClient = new ApiClient(API_URL)

export default apiClient
