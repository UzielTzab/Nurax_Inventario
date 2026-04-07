import { z } from 'zod';

/**
 * ESQUEMA ZOD PARA VALIDACIONES
 * Responde a la pregunta: "¿Los datos son obligatorios hasta que no los llenes?"
 * SÍ - Zod valida en tiempo real y no permite avanzar hasta que estén completos
 */

export const Step1Schema = z.object({
  store_name: z
    .string()
    .min(1, 'El nombre de la tienda es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  tax_id: z
    .string()
    .max(50, 'El identificador fiscal no puede exceder 50 caracteres')
    .optional()
    .default('')
});

export const Step2Schema = z.object({
  niche: z
    .string()
    .min(1, 'Selecciona un nicho de negocio')
    .refine((value) => ['ELECTRONICA', 'ABARROTES', 'FARMACIA', 'FERRETERIA'].includes(value), {
      message: 'Selecciona un nicho de negocio'
    })
});

export const Step3Schema = z.object({
  include_supplier: z.boolean().default(true),
  supplier_name: z.string().max(200, 'El nombre es muy largo').optional().default(''),
  supplier_phone: z.string().max(50, 'El telefono es muy largo').optional().default('')
}).refine((data) => {
  if (!data.include_supplier) return true;
  return data.supplier_name.trim().length > 0;
}, {
  message: 'El nombre del proveedor es requerido si decides incluirlo',
  path: ['supplier_name']
});

export const Step4Schema = z.object({
  default_cash: z
    .number()
    .min(0, 'El fondo inicial no puede ser negativo')
});

export const OnboardingFormSchema = z.object({
  step1: Step1Schema,
  step2: Step2Schema,
  step3: Step3Schema,
  step4: Step4Schema
});

export type Step1FormData = z.infer<typeof Step1Schema>;
export type Step2FormData = z.infer<typeof Step2Schema>;
export type Step3FormData = z.infer<typeof Step3Schema>;
export type Step4FormData = z.infer<typeof Step4Schema>;
export type OnboardingFormData = z.infer<typeof OnboardingFormSchema>;

/**
 * Validar Step1
 */
export const validateStep1 = (data: any) => {
  try {
    return {
      success: true,
      data: Step1Schema.parse(data),
      errors: null
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      };
    }
    // Error genérico
    return {
      success: false,
      data: null,
      errors: [{ field: 'form', message: error.message || 'Error en validación' }]
    };
  }
};

/**
 * Validar Step2 (importación de Excel)
 */
export const validateStep2 = (data: any) => {
  try {
    return {
      success: true,
      data: Step2Schema.parse(data),
      errors: null
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      };
    }
    // Error genérico
    return {
      success: false,
      data: null,
      errors: [{ field: 'form', message: error.message || 'Error en validación' }]
    };
  }
};

/**
 * Validar Step3 (proveedor)
 */
export const validateStep3 = (data: any) => {
  try {
    return {
      success: true,
      data: Step3Schema.parse(data),
      errors: null
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'form', message: error.message || 'Error en validación' }]
    };
  }
};

/**
 * Validar Step4 (caja)
 */
export const validateStep4 = (data: any) => {
  try {
    return {
      success: true,
      data: Step4Schema.parse(data),
      errors: null
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'form', message: error.message || 'Error en validación' }]
    };
  }
};

/**
 * Validar formulario completo
 */
export const validateOnboardingForm = (data: any) => {
  try {
    return {
      success: true,
      data: OnboardingFormSchema.parse(data),
      errors: null
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      errors: error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }))
    };
  }
};
