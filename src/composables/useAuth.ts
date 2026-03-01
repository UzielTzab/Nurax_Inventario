import { ref } from 'vue';
import authService, { type UserProfileResponse } from '@/services/auth.service';

// Tipos de usuario
export type UserRole = 'admin' | 'cliente' | string;

export interface AuthUser extends UserProfileResponse {
  // Inherits id, username, name, email, role, avatar_url
}

// ─── Estado global de autenticación (módulo singleton) ───────────────────────
const isAuthenticated = ref(false);
const currentUser = ref<AuthUser | null>(null);

/**
 * sessionPromise: se crea la PRIMERA vez que se llama initSession().
 * Esto garantiza que checkSession() solo llame al backend UNA vez,
 * aunque el router guard y App.vue lo llamen al mismo tiempo.
 *
 * Flujo en refresh:
 *   Router guard → await initSession() ──┐
 *                                        ├── checkSession() se ejecuta 1 sola vez
 *   App.vue onMounted → await initSession() ──┘
 *   → isAuthenticated = true → guard permite la navegación ✅
 */
let sessionPromise: Promise<void> | null = null;
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth() {

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; email?: string; role?: UserRole; error?: string }> => {
    try {
      const loginRes = await authService.login({ email, password });

      if (!loginRes.success || !loginRes.data) {
        return { success: false, error: loginRes.error || 'Credenciales incorrectas' };
      }

      authService.saveTokens(loginRes.data.access, loginRes.data.refresh);

      const userRes = await authService.fetchUser();
      if (!userRes.success || !userRes.data) {
        console.error('Error en fetchUser:', userRes.error, userRes.status);
        authService.logout();
        return { success: false, error: userRes.error || 'No se pudo obtener el perfil de usuario' };
      }

      isAuthenticated.value = true;
      currentUser.value = userRes.data;
      // Marcar la promise como ya resuelta para futuros usos
      sessionPromise = Promise.resolve();

      return {
        success: true,
        email: userRes.data.email,
        role: userRes.data.role,
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error inesperado en login' };
    }
  };

  // ── Complete Login (desde pantalla de carga) ──────────────────────────────
  const completeLogin = (user: AuthUser) => {
    isAuthenticated.value = true;
    currentUser.value = user;
    sessionPromise = Promise.resolve();
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    authService.logout();
    isAuthenticated.value = false;
    currentUser.value = null;
    // Reset promise → el próximo login arrancará checkSession de cero
    sessionPromise = null;
  };

  // ── checkSession: restaura sesión desde token guardado ───────────────────
  const checkSession = async (): Promise<void> => {
    if (localStorage.getItem('access_token')) {
      const userRes = await authService.fetchUser();
      if (userRes.success && userRes.data) {
        isAuthenticated.value = true;
        currentUser.value = userRes.data;
      } else {
        // Token expirado o inválido → limpiar todo
        logout();
      }
    }
  };

  /**
   * initSession(): devuelve siempre la MISMA promise.
   * El router guard y App.vue pueden llamarlo sin duplicar la petición al backend.
   */
  const initSession = (): Promise<void> => {
    if (!sessionPromise) {
      sessionPromise = checkSession();
    }
    return sessionPromise;
  };

  // ── Avatar ────────────────────────────────────────────────────────────────
  const updateAvatarUrl = async (
    file: File,
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    const res = await authService.updateAvatar(file);
    if (res.success && res.data?.avatar_url) {
      if (currentUser.value) {
        currentUser.value.avatar_url = res.data.avatar_url;
      }
      return { success: true, url: res.data.avatar_url };
    }
    return { success: false, error: res.error || 'No se pudo subir la foto' };
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    completeLogin,
    logout,
    checkSession,
    initSession,
    updateAvatarUrl,
  };
}
