/**
 * API Configuration and Base Instance (Seguridad: HttpOnly Cookies)
 * 
 * ✅ IMPORTANTE: Tokens almacenados en HttpOnly cookies (NO en localStorage)
 * ✅ Browser envía cookies automáticamente con credentials: 'include'
 * ✅ XSS-safe: tokens NO accesibles desde JavaScript
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

  private async request<T>(
    method: string,
    endpoint: string,
    config?: RequestConfig & { body?: any }
  ): Promise<ApiResponse<T>> {
    try {
      // 1. Prepare URL with Query Params
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

      // ✅ NO inyectamos token manualmente
      // El navegador envía cookies HttpOnly automáticamente
      // (especialmente importante: credentials: 'include')

      // 3. Prepare Fetch Options con credentials
      const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',  // ← CRÍTICO: Envía cookies HttpOnly automáticamente
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

      // ✅ Handle 401 Unauthorized: Backend refrescará cookie automáticamente
      if (response.status === 401 && !endpoint.includes('/auth/login/')) {
        try {
          // Intentar refrescar el token (el backend lo maneja en cookies)
          const refreshUrl = new URL(`${this.baseUrl}/auth/refresh/`)
          const refreshResponse = await fetch(refreshUrl.toString(), {
            method: 'POST',
            credentials: 'include',  // ← Envía refresh_token cookie
            headers: { 'Content-Type': 'application/json' },
          })

          if (refreshResponse.ok) {
            // Backend actualizó el access_token en la cookie HttpOnly
            // Reintentar la petición original
            response = await fetch(url.toString(), fetchOptions)
          } else {
            // Refresh falló → usuario debe hacer login nuevamente
            console.error('[API] Token refresh failed')
            // Opcionalmente: window.location.href = '/auth/login'
          }
        } catch (e) {
          console.error('[API] Error refreshing token:', e)
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
