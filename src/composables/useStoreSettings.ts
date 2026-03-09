/**
 * useStoreSettings
 * Composable singleton que obtiene la configuración de la tienda
 * Se carga una sola vez y se mantiene en caché en la aplicación
 *
 * Exporta:
 * - settings: Configuración de la tienda (readonly)
 * - isLoaded: Indica si se ha cargado (readonly)
 * - loadSettings(): Carga o retorna configuración en caché
 * - reloadSettings(): Fuerza una recarga desde la API
 */

import { ref, readonly } from 'vue';
import { storeSettingsService, type StoreSettings } from '@/services/store-settings.service';

// Re-exportar tipos para conveniencia
export type { StoreSettings };

// ════════════════════════════════════════════════════════════════════════════
// Estado módulo-level (singleton compartido entre todos los consumidores)
// ════════════════════════════════════════════════════════════════════════════

const settings = ref<StoreSettings>({
  store_name: '',
  currency_symbol: '$ MXN',
  address: '',
  phone: '',
  ticket_message: '¡Gracias por su preferencia!',
  logo_url: '',
});

const isLoaded = ref(false);
let loadPromise: Promise<void> | null = null;

// ════════════════════════════════════════════════════════════════════════════
// Composable
// ════════════════════════════════════════════════════════════════════════════

export const useStoreSettings = () => {
  /**
   * Obtiene la configuración una sola vez (cached).
   * Las siguientes llamadas retornan inmediatamente.
   * Seguro llamar desde múltiples componentes en paralelo
   */
  const loadSettings = (): Promise<void> => {
    if (isLoaded.value) return Promise.resolve();
    if (loadPromise) return loadPromise;

    loadPromise = storeSettingsService.getStoreSettings()
      .then((res) => {
        if (res.success && res.data) {
          settings.value = {
            store_name: res.data.store_name || '',
            currency_symbol: res.data.currency_symbol || '$ MXN',
            address: res.data.address || '',
            phone: res.data.phone || '',
            ticket_message: res.data.ticket_message || '¡Gracias por su preferencia!',
            logo_url: res.data.logo_url || '',
          };
          isLoaded.value = true;
        }
      })
      .catch(() => {
        // Silencioso - los valores por defecto permanecen
        console.warn('No se pudo cargar la configuración de la tienda');
      })
      .finally(() => {
        loadPromise = null;
      });

    return loadPromise;
  };

  /**
   * Fuerza una recarga de la configuración desde la API
   */
  const reloadSettings = () => {
    isLoaded.value = false;
    loadPromise = null;
    return loadSettings();
  };

  /**
   * Actualiza la configuración en API y recarga localmente
   */
  const updateSettings = async (updatedData: Partial<StoreSettings>) => {
    try {
      const response = await storeSettingsService.updateStoreSettings(updatedData);
      if (response.success && response.data) {
        settings.value = {
          store_name: response.data.store_name || settings.value.store_name,
          currency_symbol: response.data.currency_symbol || settings.value.currency_symbol,
          address: response.data.address || settings.value.address,
          phone: response.data.phone || settings.value.phone,
          ticket_message: response.data.ticket_message || settings.value.ticket_message,
          logo_url: response.data.logo_url || settings.value.logo_url,
        };
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Error al actualizar configuración' };
      }
    } catch (err: any) {
      console.error('Error updating store settings:', err);
      return { success: false, error: err.message || 'Error de conexión' };
    }
  };

  return {
    settings: readonly(settings),
    isLoaded: readonly(isLoaded),
    loadSettings,
    reloadSettings,
    updateSettings,
  };
};
