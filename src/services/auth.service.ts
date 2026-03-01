import apiClient from './api'

export interface LoginData {
  email: string
  password: string
}

export interface LoginBackendResponse {
  access: string
  refresh: string
}

export interface UserProfileResponse {
  id: number
  username: string
  name: string
  email: string
  role: 'admin' | 'cliente'
  avatar_url?: string
}

export interface UnifiedAuthResponse {
  success: boolean
  access?: string
  refresh?: string
  user?: UserProfileResponse
  error?: string
}

const authService = {
  /**
   * 1. Autenticar usuario (Obtiene Tokens)
   */
  async login(credentials: LoginData) {
    const res = await apiClient.post<LoginBackendResponse>('/auth/login/', credentials)
    return res
  },

  /**
   * 2. Obtener Perfil del Usuario Logueado
   */
  async fetchUser() {
    const res = await apiClient.get<UserProfileResponse>('/users/me/')
    return res
  },

  /**
   * 3. Subir / actualizar foto de perfil
   */
  async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar_file', file);
    // Pass FormData as body — ApiClient strips Content-Type so browser sets boundary
    const res = await apiClient.patch<{ avatar_url: string }>('/users/me/avatar/', formData);
    return res;
  },

  /**
   * Registrar nuevo usuario (Placeholder)
   */
  async register(data: LoginData & { name: string }) {
    // Cuando el endpoint esté listo
    return apiClient.post('/auth/register/', data)
  },

  /**
   * Cerrar sesión (limpia todo el almacenamiento local)
   */
  async logout() {
    // Clear all possible token storage locations
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    sessionStorage.clear()
    return { success: true }
  },

  /**
   * Verificar token (Opcional, si tienes endpoint Verify)
   */
  async verifyToken(token: string) {
    return apiClient.post('/auth/verify/', { token })
  },
  
  /**
   * Helpers Sync
   */
  saveTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }
}

export default authService
