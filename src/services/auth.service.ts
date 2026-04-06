import apiClient from './api'

export interface LoginData {
  email: string
  password: string
}

export interface LoginBackendResponse {
  access: string
  refresh: string
}

export interface StoreProfileResponse {
  id: number
  store_name: string
  currency_symbol: string
  address: string
  phone: string
  ticket_message: string
  logo_url?: string
  company_name: string
  ticket_name: string
  is_first_setup_completed: boolean
  updated_at: string
}

export interface UserProfileResponse {
  id: number
  username: string
  name: string
  email: string
  role: 'admin' | 'cliente'
  avatar_url?: string
  store_profile?: StoreProfileResponse | null
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
    const res = await apiClient.get<UserProfileResponse>('/v1/accounts/users/me/')
    return res
  },

  /**
   * 3. Subir / actualizar foto de perfil
   */
  async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar_file', file);
    // Pass FormData as body — backend maneja el archivo en PATCH /me/
    const res = await apiClient.patch<UserProfileResponse>('/v1/accounts/users/me/', formData);
    return res;
  },

  /**
   * Registrar nuevo usuario
   */
  async register(data: LoginData & { name: string; username: string }) {
    // Endpoint: POST /v1/accounts/users/register/
    return apiClient.post('/v1/accounts/users/register/', {
      email: data.email,
      username: data.username,
      name: data.name,
      password: data.password,
      password_confirm: data.password
    })
  },

  /**
   * Cerrar sesión (Backend limpia las cookies HttpOnly)
   * ✅ SEGURO: No manipulamos localStorage
   */
  async logout() {
    // Backend establece cookies con Max-Age=0 para expirarlas
    // No necesitamos limpiar localStorage (¡no hay tokens allí!)
    try {
      await apiClient.post('/auth/logout/', {})
    } catch (e) {
      // Aunque falle, el usuario se desconecta localmente
      console.error('[Auth] Logout failed:', e)
    }
    return { success: true }
  },

  /**
   * Verificar token (Opcional, si tienes endpoint Verify)
   */
  async verifyToken() {
    // Backend verifica cookie access_token directamente
    return apiClient.post('/auth/verify/', {})
  },

  /**
   * 4. Cambiar contraseña del usuario logueado
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const res = await apiClient.patch('/v1/accounts/users/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    })
    return res
  }
}

export default authService
