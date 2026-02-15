import { ref } from 'vue';

// Estado global de autenticación
const isAuthenticated = ref(false);
const currentUser = ref<{ email: string } | null>(null);

export function useAuth() {
  const login = async (email: string, _password: string) => {
    // Aquí harías la llamada a tu API
    // Por ahora, simulamos un login exitoso después de 1.5 segundos
    return new Promise<{ success: boolean; email: string }>((resolve) => {
      setTimeout(() => {
        // Simulación: cualquier credencial es válida
        // NO cambiamos isAuthenticated aquí, lo haremos después de la pantalla de carga
        resolve({ success: true, email });
      }, 1500);
    });
  };

  const completeLogin = (email: string) => {
    isAuthenticated.value = true;
    currentUser.value = { email };
  };

  const logout = () => {
    isAuthenticated.value = false;
    currentUser.value = null;
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    completeLogin,
    logout,
  };
}
