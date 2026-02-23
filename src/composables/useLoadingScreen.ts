import { ref } from 'vue'
import type { UserRole } from '@/composables/useAuth'

const isLoadingScreen = ref(false)
const loadingUserEmail = ref('')
const loadingUserRole = ref<UserRole>('cliente')

export const useLoadingScreen = () => {
  const showLoadingScreen = (email: string, role: UserRole = 'cliente') => {
    loadingUserEmail.value = email
    loadingUserRole.value = role
    isLoadingScreen.value = true
  }

  const completeLoadingScreen = () => {
    isLoadingScreen.value = false
    loadingUserEmail.value = ''
    loadingUserRole.value = 'cliente'
  }

  return {
    isLoadingScreen,
    loadingUserEmail,
    loadingUserRole,
    showLoadingScreen,
    completeLoadingScreen
  }
}
