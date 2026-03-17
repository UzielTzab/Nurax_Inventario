import { z } from 'zod';

/**
 * ESQUEMA ZOD PARA VALIDACIONES
 * Responde a la pregunta: "¿Los datos son obligatorios hasta que no los llenes?"
 * SÍ - Zod valida en tiempo real y no permite avanzar hasta que estén completos
 */

export const Step1Schema = z.object({
  store_name: z
    .string()
    .min(1, 'El nombre del negocio es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  ticket_name: z
    .string()
    .min(1, 'El nombre del ticket es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
});

export const Step3Schema = z.object({
  address: z
    .string()
    .max(300, 'La dirección no puede exceder 300 caracteres')
    .optional()
    .default(''),
  phone: z
    .string()
    .max(30, 'El teléfono no puede exceder 30 caracteres')
    .optional()
    .default(''),
  ticket_message: z
    .string()
    .max(500, 'El mensaje no puede exceder 500 caracteres')
    .optional()
    .default('')
});

export const Step2Schema = z.object({
  excelFile: z
    .instanceof(File)
    .optional()
    .nullable(),
  products: z
    .array(z.object({
      name: z.string().min(1, 'Nombre requerido'),
      sku: z.string().min(1, 'SKU requerido'),
      category_name: z.string().optional(),
      stock: z.number().nonnegative().optional(),
      price: z.number().nonnegative().optional(),
      supplier_name: z.string().optional()
    }))
    .optional()
    .default([]),
  columnMappings: z.object({
    name: z.string(),
    sku: z.string(),
    category: z.string().optional(),
    stock: z.string().optional(),
    price: z.string().optional(),
    supplier: z.string().optional()
  })
});

export const OnboardingFormSchema = z.object({
  step1: Step1Schema,
  step2: Step2Schema.partial() // step2 puede ser parcial en el formulario
});

export type Step1FormData = z.infer<typeof Step1Schema>;
export type Step2FormData = z.infer<typeof Step2Schema>;
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
