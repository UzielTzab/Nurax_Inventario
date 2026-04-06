import { reactive, ref } from 'vue'
import { z } from 'zod'
import authService from '@/services/auth.service'
import { useSnackbar } from '@/composables/useSnackbar'

interface PasswordForm {
  current: string
  new: string
  confirm: string
}

interface PasswordErrors {
  current: string
  new: string
  confirm: string
}

/** Schema Zod para validar el formulario de contraseña */
const passwordSchema = z
  .object({
    current: z.string().min(1, 'La contraseña actual es obligatoria'),
    new: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
      .regex(/[0-9]/, 'Debe incluir al menos un número'),
    confirm: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .superRefine((data, ctx) => {
    if (data.new && data.current && data.new === data.current) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['new'],
        message: 'La nueva contraseña no puede ser igual a la actual',
      });
    }
    if (data.confirm && data.new !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirm'],
        message: 'Las contraseñas no coinciden',
      });
    }
  });

export const useChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar()
  
  const passwordForm = reactive<PasswordForm>({
    current: '',
    new: '',
    confirm: ''
  })

  const passwordErrors = reactive<PasswordErrors>({
    current: '',
    new: '',
    confirm: ''
  })

  const isChangingPassword = ref(false)

  /**
   * Validar que los campos de contraseña sean válidos usando Zod
   */
  const validatePasswordFields = (): boolean => {
    // Limpiar errores previos
    passwordErrors.current = ''
    passwordErrors.new = ''
    passwordErrors.confirm = ''

    const result = passwordSchema.safeParse({
      current: passwordForm.current,
      new: passwordForm.new,
      confirm: passwordForm.confirm,
    })

    if (!result.success) {
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as 'current' | 'new' | 'confirm'
        if (field in passwordErrors && !passwordErrors[field]) {
          passwordErrors[field] = issue.message
        }
      })
      return false
    }

    return true
  }

  /**
   * Ejecutar cambio de contraseña
   */
  const changePassword = async (): Promise<boolean> => {
    // Validar con Zod — si hay errores se muestran y NO se llama al backend
    if (!validatePasswordFields()) return false

    isChangingPassword.value = true
    try {
      const response = await authService.changePassword(
        passwordForm.current,
        passwordForm.new,
        passwordForm.confirm
      )

      if (!response.success) {
        // El backend rechazó (ej. contraseña actual incorrecta)
        const errorMessage = response.error || 'Error al cambiar la contraseña'
        passwordErrors.current = errorMessage
        return false
      }

      // Éxito
      enqueueSnackbar({
        type: 'success',
        title: 'Contraseña actualizada',
        message: 'Tu contraseña fue cambiada exitosamente.',
        duration: 3000
      })

      // Limpiar formulario
      passwordForm.current = ''
      passwordForm.new = ''
      passwordForm.confirm = ''
      passwordErrors.current = ''
      passwordErrors.new = ''
      passwordErrors.confirm = ''

      return true
    } catch (error: any) {
      console.error('Error changing password:', error)
      enqueueSnackbar({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar al servidor para cambiar la contraseña.',
        duration: 3000
      })
      return false
    } finally {
      isChangingPassword.value = false
    }
  }

  /**
   * Limpiar errores de un campo
   */
  const clearFieldError = (field: keyof PasswordErrors) => {
    passwordErrors[field] = ''
  }

  return {
    passwordForm,
    passwordErrors,
    isChangingPassword,
    changePassword,
    validatePasswordFields,
    clearFieldError
  }
}
