<template>
  <div class="login-shell">
    <section class="login-aside">
    
    </section>

    <section class="login-main">
      <div class="login-card">
        <div class="login-brand">
          <img src="/images/nurax_logo.png" alt="Nurax" class="login-brand-logo">
          <span class="login-brand-name">Nurax</span>
        </div>
        <header class="login-header">

          <div class="header-copy">
            <span class="title-text-header">Ingresa a tu cuenta</span>
            <p>¿No tienes cuenta? <a href="/#contact">Contactar soporte</a></p>
          </div>
        </header>

        <form @submit.prevent="handleLogin" class="login-form">
          <AppInput
            id="email"
            v-model="email"
            type="email"
            label="Email"
            placeholder="nombre@ejemplo.com"
            autocomplete="email"
            :error="loginError ? ' ' : ''"
            @input="loginError = ''"
            required
          />

          <div class="password-row">
            <label class="password-label" for="password">Contraseña</label>
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>
          <AppInput
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            :error="loginError ? ' ' : ''"
            @input="loginError = ''"
            required
          />

          <AppButton
            type="submit"
            variant="fill"
            class="w-full"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Iniciar Sesion</span>
            <span v-else class="loading-spinner"></span>
          </AppButton>

          <transition name="shake-error">
            <div v-if="loginError" class="login-error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="error-icon">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
              </svg>
              <span>{{ loginError }}</span>
            </div>
          </transition>
        </form>
      </div>

      <p class="login-footer">© 2024 Onux Technologies. Todos los derechos reservados.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const loginError = ref('')

const loginSchema = z.object({
  email: z.string().min(1, 'Ingresa tu correo electrónico.').email('Ese correo no tiene un formato válido. Ej: nombre@empresa.com'),
  password: z.string().min(1, 'Ingresa tu contraseña.')
})

/**
 * Convierte mensajes de error del backend (en inglés técnico) a texto
 * amigable en español para cualquier usuario.
 */
const humanizeError = (raw: string): string => {
  const r = raw.toLowerCase()
  if (r.includes('no active account') || r.includes('credentials') || r.includes('invalid') || r.includes('unauthorized')) {
    return 'El correo o la contraseña que ingresaste no son correctos. Revísalos e intenta de nuevo.'
  }
  if (r.includes('account') && r.includes('inactiv')) {
    return 'Tu cuenta está inactiva. Contacta con soporte para reactivarla.'
  }
  if (r.includes('not found') || r.includes('does not exist')) {
    return 'No encontramos una cuenta con ese correo. Verifica que sea el correo correcto.'
  }
  if (r.includes('too many') || r.includes('throttle') || r.includes('rate limit')) {
    return 'Demasiados intentos fallidos. Espera unos minutos antes de intentarlo de nuevo.'
  }
  if (r.includes('network') || r.includes('fetch') || r.includes('connection') || r.includes('timeout')) {
    return 'No pudimos conectar con el servidor en estos momentos, por favor contacta con soporte.'
  }
  // Si ya viene en español o es un mensaje corto legible, lo mostramos tal cual
  if (r.length < 100 && !r.includes('http') && /[áéíóúñ,. ]/.test(raw)) return raw;
  // Fallback genérico amigable
  return 'Algo salió mal al iniciar sesión. Verifica tus datos e intenta de nuevo.'
}

const handleLogin = async () => {
  loginError.value = ''
  
  const validationResult = loginSchema.safeParse({ email: email.value, password: password.value })
  
  if (!validationResult.success) {
    loginError.value = validationResult.error.issues[0]?.message || 'Correo o contraseña no válidos.'
    return
  }
  
  isLoading.value = true
  try {
    const result = await login(email.value, password.value)
    
    if (result.success && result.role) {
      console.log('✅ Login exitoso! Rol:', result.role)
      // Redirigir al dashboard según el rol
      const dashboardPath = result.role === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
      await router.push(dashboardPath)
    } else {
      loginError.value = humanizeError(result.error || '')
    }
  } catch (error) {
    console.error('❌ Error en login:', error)
    loginError.value = 'No pudimos conectar con el servidor en estos momentos, por favor contacta con soporte.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
:root {
  --login-mint: #d9f6e6;
  --login-mint-strong: #bff0d6;
  --login-ink: #1f2937;
  --login-muted: #6b7280;
  --login-card: #ffffff;
  --login-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.login-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  background: #f7faf9;
}

.login-aside {
  background: var(--color-brand-main);
  position: relative;
  overflow: hidden;
}

.title-text-header {
  font-weight: 700;
  font-size: 1.1rem;
}

.login-main {
  background: #fefefe;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2.5rem 2.5rem;
  gap: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 600px;
  background: var(--login-card);
  border-radius: 20px;
  padding: 2.5rem 2.25rem;
  box-shadow: var(--login-shadow);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  color: var(--login-ink);
  font-size: 1.05rem;
}

.login-brand-logo {
  width: 48px;
  height: 48px;
}

.login-brand-name {
  font-weight: 500;
  font-size: 2.5rem;
  letter-spacing: 0.2px;
}

.login-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.header-logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #e6f7ef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-logo-img {
  width: 26px;
  height: 26px;
}

.header-copy{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-copy p {
  margin: 0;
  color: var(--login-muted);
  font-size: 0.9rem;
}

.header-copy a {
  color: #0f6a42;
  text-decoration: none;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.password-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.password-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--login-ink);
}

.forgot-link {
  font-size: 0.8rem;
  color: #0f6a42;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.login-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #dc2626;
}

.error-icon {
  width: 16px;
  height: 16px;
}

.login-footer {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.shake-error-enter-active {
  animation: shakeIn 0.4s ease;
}

.shake-error-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.shake-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes shakeIn {
  0% { opacity: 0; transform: translateX(-6px); }
  30% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes nebulaDrift {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.04) translate(18px, -10px); }
}


@media (max-width: 960px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-aside {
    min-height: 300px;
  }

  .login-main {
    padding-top: 2rem;
  }
}

@media (max-width: 600px) {
  .login-aside {
    padding: 3rem 1.5rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .password-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
}
</style>
