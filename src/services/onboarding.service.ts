import apiClient from './api';

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface OnboardingWizardPayload {
  tienda: {
    nombre: string;
    identificador_fiscal?: string;
    nicho: 'ELECTRONICA' | 'ABARROTES' | 'FARMACIA' | 'FERRETERIA' | 'MASCOTAS' | 'BELLEZA';
  };
  configuracion: {
    fondo_inicial_defecto: number;
  };
  proveedor_inicial: {
    incluir: boolean;
    nombre?: string;
    telefono?: string;
  };
}

class OnboardingService {
  /**
   * Completa el onboarding legacy.
   */
  async completeOnboarding(
    storeName: string,
    ticketName: string,
    address: string = '',
    phone: string = '',
    ticketMessage: string = ''
  ): Promise<OnboardingCompleteResponse> {
    try {
      const response = await apiClient.post<OnboardingCompleteResponse>(
        '/v1/accounts/store-profiles/onboarding-complete/',
        {
          store_name: storeName,
          ticket_name: ticketName,
          address,
          phone,
          ticket_message: ticketMessage
        }
      );

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || 'Onboarding completado exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: response.error || 'Error al completar onboarding',
        data: null
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error de conexion: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Wizard v2: crea tienda, configuracion inicial y proveedor.
   */
  async submitWizard(payload: OnboardingWizardPayload): Promise<OnboardingCompleteResponse> {
    try {
      const response = await apiClient.post<OnboardingCompleteResponse>(
        '/v1/onboarding/wizard/',
        payload
      );

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || 'Wizard completado exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: response.error || 'Error al completar el wizard',
        data: null
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error de conexion: ${error.message}`,
        data: null
      };
    }
  }
}

export const onboardingService = new OnboardingService();
