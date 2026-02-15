import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  const login = async (email: string, _password: string) => {
    isLoading.value = true
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // const response = await authService.login(email, password)
      // user.value = response.data.user
      isAuthenticated.value = true
      return { success: true, email }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }
})
