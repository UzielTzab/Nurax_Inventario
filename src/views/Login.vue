<template>
  <div class="login-shell">
    <section class="login-aside" aria-label="Beneficios de Nurax">
      <div class="aside-content">
        <div class="aside-copy">
          <p class="aside-kicker">Inventario, ventas y equipo sincronizados</p>
          <h1>El control total de tu negocio, en un solo lugar.</h1>
          <p>Rápido, seguro y siempre sincronizado.</p>
        </div>

        <div class="aside-visual device-stack">
          <picture>
            <source media="(max-width: 1024px)" srcset="/images/hero_dashboard_tablet.png">
            <img src="/images/hero_dashboard.png" alt="Persona revisando el panel de ventas de Nurax en una tablet">
          </picture>
        </div>
      </div>
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
            type="text"
            label="Correo o Nombre de Usuario"
            placeholder="Ej: correo@tienda.com o galileo_maria"
            autocomplete="username"
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
            <span v-if="!isLoading">Iniciar Sesión</span>
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

      <p class="login-footer">© {{ currentYear }} Onux Technologies. Todos los derechos reservados.</p>
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
const currentYear = new Date().getFullYear()

const emailOrUsernameSchema = z.string()
  .trim()
  .min(1, 'Ingresa tu correo o nombre de usuario.')
  .refine((value) => {
    if (value.includes('@')) {
      return z.string().email().safeParse(value).success
    }

    return /^[a-zA-Z0-9._-]{3,50}$/.test(value)
  }, 'Ingresa un correo válido o un nombre de usuario como galileo_maria.')

const loginSchema = z.object({
  email: emailOrUsernameSchema,
  password: z.string().min(1, 'Ingresa tu contraseña.')
})

/**
 * Convierte mensajes de error del backend (en inglés técnico) a texto
 * amigable en español para cualquier usuario.
 */
const humanizeError = (raw: string): string => {
  const r = raw.toLowerCase()
  if (r.includes('no active account') || r.includes('credentials') || r.includes('invalid') || r.includes('unauthorized')) {
    return 'El correo, usuario o contraseña que ingresaste no son correctos. Revísalos e intenta de nuevo.'
  }
  if (r.includes('account') && r.includes('inactiv')) {
    return 'Tu cuenta está inactiva. Contacta con soporte para reactivarla.'
  }
  if (r.includes('not found') || r.includes('does not exist')) {
    return 'No encontramos una cuenta con esos datos. Verifica el correo o usuario.'
  }
  if (r.includes('too many') || r.includes('throttle') || r.includes('rate limit')) {
    return 'Demasiados intentos fallidos. Espera unos minutos antes de intentarlo de nuevo.'
  }
  if (r.includes('network') || r.includes('fetch') || r.includes('connection') || r.includes('timeout')) {
    return 'No pudimos conectar con el servidor en estos momentos, por favor contacta con soporte.'
  }
  // Si ya viene en español o es un mensaje corto legible, lo mostramos tal cual.
  if (r.length < 100 && !r.includes('http') && /[áéíóúñ,. ]/.test(raw)) return raw
  // Fallback genérico amigable.
  return 'Algo salió mal al iniciar sesión. Verifica tus datos e intenta de nuevo.'
}

const handleLogin = async () => {
  loginError.value = ''
  
  const validationResult = loginSchema.safeParse({ email: email.value, password: password.value })
  
  if (!validationResult.success) {
    loginError.value = validationResult.error.issues[0]?.message || 'Correo, usuario o contraseña no válidos.'
    return
  }
  
  isLoading.value = true
  try {
    const credentials = validationResult.data
    const result = await login(credentials.email, credentials.password)
    
    if (result.success && result.role) {
      console.log('Login exitoso. Rol:', result.role)
      // Redirigir al dashboard según el rol.
      const dashboardPath = result.role === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
      await router.push(dashboardPath)
    } else {
      loginError.value = humanizeError(result.error || '')
    }
  } catch (error) {
    console.error('Error en login:', error)
    loginError.value = 'No pudimos conectar con el servidor en estos momentos, por favor contacta con soporte.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-shell {
  --login-brand: var(--color-brand-main, #e6ab17);
  --login-brand-dark: #c97c0a;
  --login-ink: #1f2937;
  --login-muted: #6b7280;
  --login-card: #ffffff;
  --login-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 1fr);
  background: #f9fafb;
}

.login-aside {
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.28), transparent 24rem),
    linear-gradient(135deg, var(--login-brand) 0%, #dd9914 48%, var(--login-brand-dark) 100%);
  position: relative;
  z-index: 10;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: clamp(3rem, 5vw, 4.5rem);
}

.login-aside::after {
  content: "";
  position: absolute;
  top: 30px;
  left: 30px;
  width: 280px;
  height: 280px;
  background-image: url('/images/nurax_logo_app_192.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.25;
  z-index: 0;
  pointer-events: none;
}

.login-aside::before {
  content: "";
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}

.login-aside::before {
  width: 34rem;
  height: 34rem;
  top: -12rem;
  right: -12rem;
}

.aside-content {
  position: relative;
  z-index: 1;
  width: min(100%, 680px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: clamp(2rem, 4vw, 3rem);
  min-height: 100%;
}

.aside-copy {
  color: #ffffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

}

.aside-kicker {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.aside-copy h1 {
  margin: 0;
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: 0;
}

.aside-copy p:not(.aside-kicker) {
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  font-weight: 400;
}

.aside-visual {
  width: min(100%, 560px);
  filter: drop-shadow(0 28px 34px rgba(92, 51, 6, 0.26));
  animation: floatHero 6s ease-in-out infinite;
  margin-top: auto;
  position: relative;
  z-index: 10;
}

.device-stack {
  position: relative;
  align-self: center;
  transform: translateY(20px);
  z-index: 20;
  margin-top: -100px;
}

.aside-visual img {
  display: block;
  width: 100%;
  height: auto;
}

.aside-visual picture {
  display: block;
  width: 100%;
}

.title-text-header {
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1.35;
  margin-bottom: 0.25rem;
}

.login-main {
  background: #fefefe37;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.9),   /* capa blanca con transparencia */
    rgba(255, 255, 255, 0.9)
  ),
  url('/images/mobile_art.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 2.5rem;
  gap: 1.5rem;
  height: 100%;
  overflow: visible;
  position: relative;
}

.login-card {
  width: 100%;
  max-width: 440px;
  max-height: calc(100vh - 120px);
  background: var(--login-card);
  border-radius: 24px;
  padding: 2.5rem 2.5rem 3rem;
  box-shadow: var(--login-shadow);
  border: 1px solid rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
}

.mobile-art-img {
  display: none;
}

.mobile-greeting {
  display: none;
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
  margin-bottom: 1.25rem;
}

.header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-copy p {
  margin: 0;
  color: var(--login-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.header-copy a {
  color: var(--login-brand);
  text-decoration: none;
  font-weight: 600;
}

.header-copy a:hover {
  color: var(--login-brand-dark);
  text-decoration: underline;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.login-form :deep(.app-input-focused) {
  border-color: var(--login-brand);
  box-shadow: 0 0 0 3px rgba(230, 171, 23, 0.18);
}

.login-form :deep(input) {
  height: 3rem !important;
  font-size: 1rem !important;
}

.login-form :deep(input::placeholder) {
  color: #9ca3af !important;
  font-size: 1rem !important;
}

.password-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  margin-bottom: -0.5rem;
}

.password-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--login-ink);
}

.forgot-link {
  font-size: 0.85rem;
  color: var(--login-brand);
  text-decoration: none;
  font-weight: 600;
}

.forgot-link:hover {
  text-decoration: underline;
  color: var(--login-brand-dark);
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
  color: #6b7280;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
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

@keyframes floatHero {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .login-shell {
    grid-template-columns: minmax(0, 44%) minmax(0, 56%);
  }

  .login-aside {
    padding: 3rem 2rem 2.5rem;
  }

  .aside-content {
    justify-content: space-between;
    gap: 2rem;
  }

  .aside-copy h1 {
    font-size: clamp(2.2rem, 4vw, 3rem);
  }

  .device-stack {
    width: min(494%, 560px);
    margin-right: -192px;
    align-self: flex-end;
    transform: translateX(180px) translateY(20px);
  }

  .login-main {
    padding: 2.5rem 1.75rem;
  }

  .login-card {
    max-width: 500px;
    padding: 2.5rem 2.25rem 2.75rem;
  }
}

@media (max-width: 767px) {
  .login-shell {
    grid-template-columns: minmax(0, 38%) minmax(0, 62%);
  }

  .login-aside {
    padding: 2rem 1rem 1.5rem;
  }

  .aside-content {
    gap: 1.5rem;
  }

  .aside-copy h1 {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
  }

  .login-main {
    padding: 1rem;
  }

  .login-card {
    padding: 1.75rem 1.25rem;
  }

  .device-stack {
    width: 220%;
    max-width: 400px;
    transform: translateX(25%) translateY(10px);
    margin-right: -10%;
    margin-top: -40px;
  }
}
</style>
