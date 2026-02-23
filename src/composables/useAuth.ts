import { ref } from 'vue';
import authService, { type UserProfileResponse } from '@/services/auth.service';

// Tipos de usuario
export type UserRole = 'admin' | 'cliente' | string;

export interface AuthUser extends UserProfileResponse {
  // Inherits id, username, name, email, role
}

// Estado global de autenticación
const isAuthenticated = ref(false);
const currentUser = ref<AuthUser | null>(null);

export function useAuth() {
  const login = async (email: string, password: string): Promise<{ success: boolean; email?: string; role?: UserRole; error?: string }> => {
    try {
      // 1. Obtener tokens
      const loginRes = await authService.login({ email, password });
      
      if (!loginRes.success || !loginRes.data) {
        return { success: false, error: loginRes.error || 'Credenciales incorrectas' };
      }

      // Guardar tokens en localStorage
      authService.saveTokens(loginRes.data.access, loginRes.data.refresh);

      // 2. Obtener perfil
      const userRes = await authService.fetchUser();
      if (!userRes.success || !userRes.data) {
        console.error('Error en fetchUser:', userRes.error, userRes.status);
        // Falló al obtener la info del usuario: Limpiar tokens y salir
        authService.logout();
        return { success: false, error: userRes.error || 'No se pudo obtener el perfil de usuario' };
      }

      // 3. Establecer estado completo
      isAuthenticated.value = true;
      currentUser.value = userRes.data;

      return { 
        success: true, 
        email: userRes.data.email, 
        role: userRes.data.role 
      };

    } catch (error: any) {
      return { success: false, error: error.message || 'Error inesperado en login' };
    }
  };

  const completeLogin = (user: AuthUser) => {
    isAuthenticated.value = true;
    currentUser.value = user;
  };

  const logout = () => {
    authService.logout();
    isAuthenticated.value = false;
    currentUser.value = null;
  };

  /**
   * Inicializa la sesión si hay un token válido guardado
   */
  const checkSession = async () => {
    if (localStorage.getItem('access_token')) {
      const userRes = await authService.fetchUser();
      if (userRes.success && userRes.data) {
        isAuthenticated.value = true;
        currentUser.value = userRes.data;
      } else {
        // Token expiado o inválido
        logout();
      }
    }
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    completeLogin,
    logout,
    checkSession
  };
}
