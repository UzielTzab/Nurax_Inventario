/**
 * store-settings.service.ts
 * Servicio para obtener y gestionar la configuración de la tienda
 */

import apiClient from './api';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface StoreSettings {
  store_name: string;
  currency_symbol: string;
  address: string;
  phone: string;
  ticket_message: string;
  logo_url: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE CONFIGURACIÓN DE TIENDA
// ════════════════════════════════════════════════════════════════════════════

class StoreSettingsService {
  /**
   * Obtiene la configuración de la tienda
   */
  async getStoreSettings() {
    return apiClient.get<StoreSettings>('/v1/accounts/store-profiles/');
  }

  /**
   * Actualiza la configuración de la tienda
   */
  async updateStoreSettings(data: Partial<StoreSettings>) {
    return apiClient.patch<StoreSettings>('/v1/accounts/store-profiles/', data);
  }
}

// Exportar la instancia del servicio (singleton)
export const storeSettingsService = new StoreSettingsService();
