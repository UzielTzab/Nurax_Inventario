// import apiClient from './api'  // TODO: Uncomment when API is ready

interface LoginData {
  email: string
  password: string
}

// TODO: Use this when API integration is complete
// interface AuthResponse {
//   token: string
//   user: {
//     id: string
//     email: string
//     name: string
//   }
// }

// TODO: Remove _ignore comments when API is ready
const authService = {
  /**
   * Autenticar usuario
   */
  async login(credentials: LoginData) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.post<AuthResponse>('/auth/login', credentials)
    return { 
      success: true, 
      data: {
        token: 'placeholder_token',
        user: {
          id: '1',
          email: credentials.email,
          name: 'User'
        }
      }
    }
  },

  /**
   * Registrar nuevo usuario
   */
  async register(_data: LoginData & { name: string }) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.post<AuthResponse>('/auth/register', data)
    return { success: true, data: null }
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    // TODO: Implementar cuando API esté lista
    // return apiClient.post('/auth/logout')
    return { success: true }
  },

  /**
   * Verificar token
   */
  async verifyToken(_token: string) {
    // TODO: Implementar cuando API esté lista
    // return apiClient.get('/auth/verify', { 
    //   headers: { Authorization: `Bearer ${token}` } 
    // })
    return { success: true }
  }
}

export default authService
