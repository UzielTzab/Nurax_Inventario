import { ref } from 'vue'

const isLoadingScreen = ref(false)
const loadingUserEmail = ref('')

export const useLoadingScreen = () => {
  const showLoadingScreen = (email: string) => {
    loadingUserEmail.value = email
    isLoadingScreen.value = true
  }

  const completeLoadingScreen = () => {
    isLoadingScreen.value = false
    loadingUserEmail.value = ''
  }

  return {
    isLoadingScreen,
    loadingUserEmail,
    showLoadingScreen,
    completeLoadingScreen
  }
}
