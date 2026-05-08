/**
 * store-settings.service.ts
 * Servicio para obtener y gestionar la configuración de la tienda
 */

import apiClient from './api';
import type { UserProfileResponse } from './auth.service';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface StoreSettings {
  id: string;
  store_name: string;
  tax_id?: string;
  niche?: string;
  currency_symbol: string;
  address: string;
  phone: string;
  country_code?: string;
  ticket_message: string;
  logo_url: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE CONFIGURACIÓN DE TIENDA
// ════════════════════════════════════════════════════════════════════════════

class StoreSettingsService {
  private storeId: string | null = null;

  private normalizeStoreData(data: any): StoreSettings {
    return {
      id: String(data?.id ?? ''),
      store_name: data?.store_name ?? data?.name ?? '',
      tax_id: data?.tax_id ?? '',
      niche: data?.niche ?? '',
      currency_symbol: data?.currency_symbol ?? '$ MXN',
      address: data?.address ?? '',
      phone: data?.phone ?? '',
      country_code: data?.country_code ?? '+52',
      ticket_message: data?.ticket_message ?? 'Gracias por su preferencia!',
      logo_url: data?.logo_url ?? '',
    };
  }

  /**
   * Obtiene la configuración de la tienda
   */
  async getStoreSettings() {
    const res = await apiClient.get<UserProfileResponse>('/v1/accounts/users/me/');
    if (!res.success || !res.data?.store_profile) {
      return {
        success: false,
        error: res.error || 'Store profile no disponible',
        status: res.status,
      };
    }

    const normalized = this.normalizeStoreData(res.data.store_profile);
    this.storeId = normalized.id || null;
    return {
      success: true,
      data: normalized,
      status: res.status,
    };
  }

  /**
   * Actualiza la configuración de la tienda
   */
  async updateStoreSettings(data: Partial<StoreSettings> | FormData) {
    if (!this.storeId) {
      const loadRes = await this.getStoreSettings();
      if (!loadRes.success || !this.storeId) {
        return {
          success: false,
          error: loadRes.error || 'Store ID no disponible',
          status: loadRes.status,
        };
      }
    }

    const res = await apiClient.patch<any>(`/v1/accounts/stores/${this.storeId}/`, data);
    if (!res.success || !res.data) {
      return res as any;
    }

    const normalized = this.normalizeStoreData(res.data);
    this.storeId = normalized.id || this.storeId;
    return {
      success: true,
      data: normalized,
      status: res.status,
    };
  }
}

// Exportar la instancia del servicio (singleton)
export const storeSettingsService = new StoreSettingsService();
