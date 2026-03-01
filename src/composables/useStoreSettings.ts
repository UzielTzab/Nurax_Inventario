/**
 * useStoreSettings — Singleton composable that loads /api/store/ once
 * and exposes the settings reactively to any component that imports it.
 */
import { ref, readonly } from 'vue';
import apiClient from '@/services/api';

export interface StoreSettings {
  store_name: string;
  currency_symbol: string;
  address: string;
  phone: string;
  ticket_message: string;
  logo_url: string;
}

// ── Module-level state (shared across all consumers) ──────────────────────────
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

// ──────────────────────────────────────────────────────────────────────────────
export const useStoreSettings = () => {
  /**
   * Fetches once. Subsequent calls return immediately (already loaded).
   * Safe to call from multiple components in parallel — only one HTTP request.
   */
  const loadSettings = (): Promise<void> => {
    if (isLoaded.value) return Promise.resolve();
    if (loadPromise) return loadPromise;

    loadPromise = apiClient.get<StoreSettings>('/store/').then((res) => {
      if (res.success && res.data) {
        settings.value = {
          store_name:      res.data.store_name      || '',
          currency_symbol: res.data.currency_symbol || '$ MXN',
          address:         res.data.address         || '',
          phone:           res.data.phone           || '',
          ticket_message:  res.data.ticket_message  || '¡Gracias por su preferencia!',
          logo_url:        res.data.logo_url        || '',
        };
        isLoaded.value = true;
      }
    }).catch(() => {
      // Silent fail — defaults remain in place, ticket still prints
    }).finally(() => {
      loadPromise = null;
    });

    return loadPromise;
  };

  /**
   * Call this to force a re-fetch (e.g. after saving settings)
   */
  const reloadSettings = () => {
    isLoaded.value = false;
    loadPromise = null;
    return loadSettings();
  };

  return {
    settings: readonly(settings),
    isLoaded: readonly(isLoaded),
    loadSettings,
    reloadSettings,
  };
};
