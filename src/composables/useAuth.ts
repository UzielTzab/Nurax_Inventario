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

      // ✅ REMOVIDO: authService.saveTokens()
      // Backend ahora envía tokens en HttpOnly cookies (secure, no localStorage)

      const userRes = await authService.fetchUser();
      if (!userRes.success || !userRes.data) {
        console.error('Error en fetchUser:', userRes.error, userRes.status);
        await authService.logout();
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
  const logout = async (): Promise<void> => {
    // Cerrar estado local de inmediato para cortar la UI protegida.
    isAuthenticated.value = false;
    currentUser.value = null;

    // Evita que el guard dispare checkSession mientras se invalida la cookie.
    sessionPromise = Promise.resolve();

    try {
      await authService.logout();
    } finally {
      // Permitir futuras validaciones de sesión (refresh/login nuevo).
      sessionPromise = null;
    }
  };

  // ── checkSession: valida sesión contra backend (con HttpOnly cookie) ────
  const checkSession = async (): Promise<void> => {
    // ✅ SIMPLIFICADO: Ya NO verificamos localStorage
    // Simplemente preguntamos al backend si el usuario está autenticado
    // Backend valida el access_token en la cookie HttpOnly
    const userRes = await authService.fetchUser();
    if (userRes.success && userRes.data) {
      isAuthenticated.value = true;
      currentUser.value = userRes.data;
    } else {
      // Backend retornó 401 o error → usuario no autenticado
      isAuthenticated.value = false;
      currentUser.value = null;
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
