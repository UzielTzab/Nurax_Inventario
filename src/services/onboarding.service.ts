import apiClient from './api';
import * as XLSX from 'xlsx';

export interface ProductFromExcel {
  name: string;
  sku: string;
  category_name?: string;
  stock?: number;
  price?: number;
  supplier_name?: string;
}

export interface BulkImportResponse {
  success: boolean;
  message: string;
  created_count: number;
  errors: any[];
  created_ids: number[];
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface OnboardingWizardPayload {
  tienda: {
    nombre: string;
    identificador_fiscal?: string;
    nicho: 'ELECTRONICA' | 'ABARROTES' | 'FARMACIA' | 'FERRETERIA';
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
   * Parsea un archivo Excel y extrae los datos de productos
   */
  async parseExcelFile(file: File): Promise<{
    products: any[];
    columns: string[];
    error?: string;
  }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0] as string];
      
      if (!worksheet) {
        return {
          products: [],
          columns: [],
          error: 'No se encontró hoja en el archivo'
        };
      }
      
      // Extraer datos como array de objetos
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];
      
      if (!data || data.length === 0) {
        return {
          products: [],
          columns: [],
          error: 'El archivo Excel está vacío'
        };
      }

      // Detectar columnas
      const columns = Object.keys(data[0] || {}) as string[];

      return {
        products: data,
        columns,
        error: undefined
      };
    } catch (error: any) {
      return {
        products: [],
        columns: [],
        error: `Error al procesar Excel: ${error.message}`
      };
    }
  }

  /**
   * Valida que las columnas necesarias existan en el Excel
   */
  validateProductColumns(products: any[], mappings: any): {
    valid: boolean;
    error?: string;
  } {
    if (!products || products.length === 0) {
      return { valid: false, error: 'No hay datos para importar' };
    }

    // Verificar que al menos el campo "name" esté mapeado
    if (!mappings.name || !products[0][mappings.name]) {
      return {
        valid: false,
        error: 'Debe mapear el campo "Nombre" del Excel'
      };
    }

    // Verificar que al menos el campo "sku" esté mapeado
    if (!mappings.sku || !products[0][mappings.sku]) {
      return {
        valid: false,
        error: 'Debe mapear el campo "SKU" del Excel'
      };
    }

    return { valid: true };
  }

  /**
   * Convierte los datos del Excel al formato esperado por la API
   */
  mapExcelToProducts(
    products: any[],
    mappings: any
  ): ProductFromExcel[] {
    return products.map(row => ({
      name: row[mappings.name],
      sku: row[mappings.sku],
      category_name: mappings.category ? row[mappings.category] : '',
      stock: mappings.stock ? parseInt(row[mappings.stock]) || 0 : 0,
      price: mappings.price ? parseFloat(row[mappings.price]) || 0 : 0,
      supplier_name: mappings.supplier ? row[mappings.supplier] : ''
    }));
  }

  /**
   * Importa productos en bulk a la API
   */
  async uploadProducts(products: ProductFromExcel[]): Promise<BulkImportResponse> {
    try {
      const response = await apiClient.post<BulkImportResponse>(
        '/v1/products/products/bulk-import/',
        { products }
      );

      if (response.success) {
        return response.data as BulkImportResponse;
      } else {
        return {
          success: false,
          message: response.error || 'Error al importar productos',
          created_count: 0,
          errors: [],
          created_ids: []
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Error de conexión: ${error.message}`,
        created_count: 0,
        errors: [],
        created_ids: []
      };
    }
  }

  /**
    * Completa el onboarding (legacy)
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
          address: address,
          phone: phone,
          ticket_message: ticketMessage
        }
      );

      if (response.success) {
        return {
          success: true,
          message: response.data?.message || 'Onboarding completado exitosamente',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.error || 'Error al completar onboarding',
          data: null
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Error de conexión: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Wizard v2 - crea tienda + categorias + proveedor
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
        message: `Error de conexión: ${error.message}`,
        data: null
      };
    }
  }
}

export const onboardingService = new OnboardingService();
