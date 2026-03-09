/**
 * shifts.service.ts
 * Servicio especializado para todas las peticiones relacionadas con turnos
 */

import apiClient from './api';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface Shift {
  id: number;
  user: number;
  starting_cash: number | string;
  expected_cash: number | string | null;
  actual_cash: number | string | null;
  difference: number | string | null;
  status?: 'open' | 'closed';
  opened_at: string;
  closed_at: string | null;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE TURNOS
// ════════════════════════════════════════════════════════════════════════════

class ShiftsService {
  /**
   * Obtiene el listado de todos los turnos
   */
  async getShifts() {
    return apiClient.get<Shift[]>('/shifts/');
  }

  /**
   * Obtiene un turno específico por ID
   */
  async getShift(id: number | string) {
    return apiClient.get<Shift>(`/shifts/${id}/`);
  }

  /**
   * Abre un nuevo turno con efectivo inicial
   */
  async openShift(starting_cash: number) {
    return apiClient.post<Shift>('/shifts/open/', { starting_cash });
  }

  /**
   * Cierra un turno abierto
   */
  async closeShift(id: number, expected_cash: number, actual_cash: number) {
    return apiClient.post<Shift>(`/shifts/${id}/close/`, {
      expected_cash,
      actual_cash,
    });
  }
}

// Exportar la instancia del servicio (singleton)
export const shiftsService = new ShiftsService();
