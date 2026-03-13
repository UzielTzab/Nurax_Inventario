<template>
  <div class="login-container">
    <!-- Lado Izquierdo: Branding -->
    <div class="branding-section">
      <!-- Blobs de fondo -->
      <div class="blob blob-top-left"></div>
      <div class="blob blob-mid"></div>
      <div class="blob blob-bottom-right"></div>

      <!-- Grid de puntos decorativo -->
      <div class="dot-grid"></div>

      <!-- Forma geométrica decorativa -->
      <div class="geo-ring geo-ring-1"></div>
      <div class="geo-ring geo-ring-2"></div>

      <div class="branding-content">

        <!-- Badge superior -->
        <div class="trust-badge" data-aos="fade-down" data-aos-delay="100">
          <span class="trust-dot"></span>
          <span>Plataforma certificada &amp; segura</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="badge-shield">
            <path fill-rule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- Imagen con glow y tarjetas flotantes -->
        <div class="image-stage" data-aos="fade-up" data-aos-delay="180">
          <!-- Glow de fondo de imagen -->
          <div class="image-glow"></div>

          <!-- Imagen principal -->
          <div class="character-wrapper">
            <img
              src="/images/feature_inventory.png"
              alt="Personaje trabajando"
              class="character-image"
              @error="onImgError"
            />
            <div v-if="imgError" class="character-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
                <rect x="40" y="130" width="120" height="8" rx="4" fill="#a5b4a0"/>
                <rect x="55" y="100" width="90" height="65" rx="6" fill="#4a7c59"/>
                <rect x="60" y="106" width="80" height="50" rx="3" fill="#6fb08b"/>
                <ellipse cx="100" cy="88" rx="20" ry="20" fill="#f5c5a3"/>
                <rect x="80" y="108" width="40" height="28" rx="4" fill="#e07b54"/>
              </svg>
            </div>
          </div>

          <!-- Tarjeta flotante: Ventas del día -->
          <div class="stat-card stat-card-tl" data-aos="fade-right" data-aos-delay="400">
            <div class="stat-icon-wrap stat-green">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2a1 1 0 0 1 .967.744L14.146 7H17a1 1 0 0 1 .917 1.4l-1.5 3.5a1 1 0 0 1-.917.6H9a1 1 0 0 1-.917-.6l-1.5-3.5A1 1 0 0 1 7.5 7H10.5l1.287-4.256A1 1 0 0 1 12 2ZM6.5 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm8.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">+248</span>
              <span class="stat-label">Ventas hoy</span>
            </div>
            <span class="stat-trend">↑ 12%</span>
          </div>

          <!-- Tarjeta flotante: Stock actualizado -->
          <div class="stat-card stat-card-br" data-aos="fade-left" data-aos-delay="500">
            <div class="stat-icon-wrap stat-teal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                <path fill-rule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">1,840</span>
              <span class="stat-label">Productos activos</span>
            </div>
          </div>

          <!-- Pill de uptime -->
          <div class="uptime-pill" data-aos="zoom-in" data-aos-delay="600">
            <span class="uptime-dot"></span> 99.9% uptime
          </div>
        </div>

        <!-- Textos hero -->
        <div class="hero-text" data-aos="fade-up" data-aos-delay="320">
          <h1 class="hero-title">
            Gestión
            <span class="hero-title-highlight">Inteligente</span>
          </h1>
          <p class="hero-description">Administra tu inventario y ventas con la potencia de Nurax.</p>
        </div>

        <!-- Strip de features -->
        <div class="features-strip" data-aos="fade-up" data-aos-delay="420">
          <div class="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
            </svg>
            <span>Control en tiempo real</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
            </svg>
            <span>Reportes visuales</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" />
            </svg>
            <span>Multi-usuario seguro</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Lado Derecho: Formulario -->
    <div class="form-section">
      <div class="form-container">

        <!-- Logo / Icono -->
        <div class="form-logo" data-aos="fade-down" data-aos-delay="100">
          <div class="logo-badge">
             <!-- Leaf icon -->
            <img src="/images/nurax_logo.png" alt="Leaf Icon" class="logo-icon">
          </div>
        </div>

        <!-- Encabezado -->
        <div class="form-header" data-aos="fade-up" data-aos-delay="150">
          <h2 class="form-title">Bienvenido a Nurax</h2>
          <p class="form-subtitle">Ingresa tus credenciales para acceder al panel.</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="login-form">

          <!-- Email -->
          <div class="form-group" data-aos="fade-up" data-aos-delay="200">
            <AppInput
              id="email"
              v-model="email"
              type="email"
              label="Correo Electrónico"
              placeholder="nombre@empresa.com"
              autocomplete="email"
              :error="loginError ? ' ' : ''"
              @input="loginError = ''"
              required
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 6 10-6"/>
                </svg>
              </template>
            </AppInput>
          </div>

          <!-- Contraseña -->
          <div class="form-group" data-aos="fade-up" data-aos-delay="250">
            <div class="password-label-row">
              <span class="form-label">Contraseña</span>
              <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
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
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </template>
            </AppInput>
          </div>

          <!-- Recordar dispositivo -->
          <!-- <div class="form-options" data-aos="fade-up" data-aos-delay="300">
            <label class="checkbox-label">
              <span class="checkbox-custom" :class="{ 'checked': rememberMe }" @click="rememberMe = !rememberMe">
                <svg v-show="rememberMe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="checkbox-text">Recordar dispositivo por 30 días</span>
            </label>
          </div> -->

          <!-- Botón Login -->
          <AppButton
            type="submit"
            variant="fill"
            class="w-full mt-4"
            data-aos="fade-up"
            data-aos-delay="350"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else class="loading-spinner"></span>
            <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="button-arrow ml-2 w-5 h-5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </AppButton>

          <!-- Error de credenciales -->
          <transition name="shake-error">
            <div v-if="loginError" class="login-error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="error-icon">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
              </svg>
              <span>{{ loginError }}</span>
            </div>
          </transition>

          <!-- Separador -->
          <div class="divider" data-aos="fade-up" data-aos-delay="400">
            <span class="divider-text">O continúa con</span>
          </div>

          <!-- Social Buttons -->
          <div class="social-buttons" data-aos="fade-up" data-aos-delay="450">
            <!-- <button type="button" class="social-btn">
              <!-- Google Icon -->
              <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="social-icon">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button> --> 

            <!-- <button type="button" class="social-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="social-icon">
                <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
              </svg>
              <span>Microsoft</span>
            </button> -->
          </div>
        </form>

        <!-- Registro -->
        <div class="register-link" data-aos="fade-up" data-aos-delay="500">
          <p>¿No tienes una cuenta? <a href="#" class="contact-link">Contactar Soporte</a></p>
        </div>
      </div>

      <!-- Footer -->
      <div class="form-footer" data-aos="fade-up" data-aos-delay="550">
        <p>© 2024 Nurax Systems. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import { useLoadingScreen } from '@/composables/useLoadingScreen'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const { login } = useAuth()
const { showLoadingScreen } = useLoadingScreen()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const imgError = ref(false)
const loginError = ref('')

const onImgError = () => {
  imgError.value = true
}

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 30
  })
})

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
    return 'No pudimos conectar con el servidor. Revisa tu internet e intenta de nuevo.'
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
      showLoadingScreen(result.email!, result.role)
    } else {
      loginError.value = humanizeError(result.error || '')
    }
  } catch (error) {
    console.error('❌ Error en login:', error)
    loginError.value = 'No pudimos conectar con el servidor. Revisa tu internet e intenta de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* =============================================
   LAYOUT PRINCIPAL
   ============================================= */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Inter', sans-serif;
}

/* =============================================
   LADO IZQUIERDO - BRANDING
   ============================================= */
.branding-section {
  background: linear-gradient(145deg, color-mix(in srgb, var(--color-brand-secondary) 90%, #000) 0%, color-mix(in srgb, var(--color-brand-secondary) 80%, #000) 30%, color-mix(in srgb, var(--color-brand-main) 60%, var(--color-brand-secondary)) 60%, color-mix(in srgb, var(--color-brand-secondary) 85%, #000) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2.5rem;
  position: relative;
  overflow: hidden;
}

/* Grid de puntos decorativo */
.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, color-mix(in srgb, var(--color-brand-main) 30%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}

/* Anillos geométricos decorativos */
.geo-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-brand-main) 15%, transparent);
  pointer-events: none;
  z-index: 0;
}

.geo-ring-1 {
  width: 420px;
  height: 420px;
  top: -100px;
  right: -100px;
  border-color: color-mix(in srgb, var(--color-brand-main) 12%, transparent);
  animation: ringPulse 8s ease-in-out infinite;
}

.geo-ring-2 {
  width: 280px;
  height: 280px;
  bottom: -80px;
  left: -60px;
  border-color: color-mix(in srgb, var(--color-brand-main) 9%, transparent);
  animation: ringPulse 11s ease-in-out infinite reverse;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.07); opacity: 1; }
}

/* Blobs decorativos */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}

.blob-top-left {
  width: 260px;
  height: 260px;
  background: color-mix(in srgb, var(--color-brand-main) 25%, transparent);
  top: -60px;
  left: -60px;
  animation: blobPulse 7s ease-in-out infinite alternate;
}

.blob-mid {
  width: 180px;
  height: 180px;
  background: color-mix(in srgb, var(--color-brand-main) 18%, transparent);
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  animation: blobPulse 9s ease-in-out infinite alternate-reverse;
}

.blob-bottom-right {
  width: 240px;
  height: 240px;
  background: color-mix(in srgb, var(--color-brand-secondary) 55%, transparent);
  bottom: -80px;
  right: -60px;
  animation: blobPulse 10s ease-in-out infinite alternate;
}

@keyframes blobPulse {
  from { transform: scale(1) translate(0, 0); }
  to   { transform: scale(1.2) translate(12px, -12px); }
}

.branding-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 480px;
}

/* ── Badge superior ── */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  background: color-mix(in srgb, var(--color-brand-main) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-brand-main) 45%, transparent);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-brand-main) 80%, #fff);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.trust-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-brand-main);
  box-shadow: 0 0 6px var(--color-brand-main);
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}

.badge-shield {
  width: 13px;
  height: 13px;
  color: color-mix(in srgb, var(--color-brand-main) 80%, #fff);
}

/* ── Escenario de imagen ── */
.image-stage {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.image-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-brand-main) 35%, transparent) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: glowPulse 5s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

/* Ilustración personaje */
.character-wrapper {
  position: relative;
  width: 380px;
  max-width: 88%;
  animation: floatY 5s ease-in-out infinite;
  z-index: 2;
}

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
}

.character-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  mix-blend-mode: luminosity;
  filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.45)) brightness(1.05);
}

.character-placeholder {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-placeholder svg {
  width: 100%;
  height: 100%;
}

/* ── Tarjetas de stats flotantes ── */
.stat-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.85rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
  z-index: 10;
  min-width: 150px;
  animation: floatY 5s ease-in-out infinite;
}

.stat-card-tl {
  top: 10%;
  left: -10px;
  animation-delay: 0.5s;
}

.stat-card-br {
  bottom: 8%;
  right: -10px;
  animation-delay: 1.25s;
}

.stat-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap svg {
  width: 18px;
  height: 18px;
}

.stat-green {
  background: color-mix(in srgb, var(--color-brand-main) 28%, transparent);
  color: color-mix(in srgb, var(--color-brand-main) 90%, #fff);
}

.stat-teal {
  background: color-mix(in srgb, var(--color-brand-main) 22%, transparent);
  color: color-mix(in srgb, var(--color-brand-main) 75%, #9effdc);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}

.stat-trend {
  font-size: 0.72rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--color-brand-main) 85%, #fff);
  margin-left: auto;
  padding-left: 0.25rem;
}

/* ── Pill uptime ── */
.uptime-pill {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  z-index: 10;
}

.uptime-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-brand-main);
  box-shadow: 0 0 5px var(--color-brand-main);
  animation: pulseDot 2s ease-in-out infinite;
}

/* ── Textos branding ── */
.hero-text {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 1.1;
  text-shadow: 0 2px 30px rgba(0,0,0,0.3);
}

.hero-title-highlight {
  background: linear-gradient(90deg, var(--color-brand-main), color-mix(in srgb, var(--color-brand-main) 70%, #fff), color-mix(in srgb, var(--color-brand-main) 45%, #fff));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.hero-description {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.6;
}

/* ── Strip de features ── */
.features-strip {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
}

.feature-item svg {
  width: 14px;
  height: 14px;
  color: color-mix(in srgb, var(--color-brand-main) 85%, #fff);
  flex-shrink: 0;
}

.feature-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

/* =============================================
   LADO DERECHO - FORMULARIO
   ============================================= */
.form-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 3rem 2rem;
  background: #ffffff;
  position: relative;
}

.form-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo-icon {
  width: 54px;
  height: 54px;
}

/* Logo badge */
.form-logo {
  display: flex;
  justify-content: center;
}

.logo-badge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-badge-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

/* Header */
.form-header {
  text-align: center;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem 0;
  letter-spacing: -0.4px;
}

.form-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* Fila label + forgot password */
.password-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Input wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.input-focused .input-icon {
  color: #06402B;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
  transition: color 0.2s;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 24px;
  font-size: 0.9375rem;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: #111827;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #c4c9d4;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-brand-main);
}

/* Error state — subtle red border when credentials fail */
.input-error .form-input {
  border-color: #fca5a5;
  background: #fff9f9;
}
.input-error .input-icon {
  color: #ef4444;
}

/* Toggle password */
.toggle-password {
  position: absolute;
  right: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.toggle-password:hover {
  color: #4b5563;
}

/* Forgot password */
.forgot-password {
  font-size: 0.8125rem;
  color: var(--color-brand-secondary, #22c55e);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.forgot-password:hover {
  opacity: 0.75;
}

/* Form options (checkbox) */
.form-options {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: white;
  flex-shrink: 0;
}

.checkbox-custom.checked {
  background: var(--color-brand-main, #06402B);
  border-color: var(--color-brand-main, #06402B);
}

.checkbox-custom svg {
  width: 12px;
  height: 12px;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #4b5563;
}

/* Botón Login */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--color-brand-main, #06402B);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.1px;
  margin-top: 0.25rem;
}

.login-button:hover:not(:disabled) {
  background: #0a5c3a;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(6, 64, 43, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-arrow {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.login-button:hover:not(:disabled) .button-arrow {
  transform: translateX(3px);
}

/* Spinner */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Login error */
.login-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #dc2626;
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #dc2626;
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
  0%   { opacity: 0; transform: translateX(-6px); }
  30%  { transform: translateX(6px); }
  60%  { transform: translateX(-4px); }
  80%  { transform: translateX(4px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  font-size: 0.8125rem;
  color: #9ca3af;
  white-space: nowrap;
}

/* Social buttons */
.social-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6875rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.social-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.social-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Registro */
.register-link {
  text-align: center;
}

.register-link p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.contact-link {
  color: #111827;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--color-brand-main, #06402B);
}

/* Footer */
.form-footer {
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  text-align: center;
}

.form-footer p {
  font-size: 0.75rem;
  color: #d1d5db;
  margin: 0;
}

/* =============================================
   RESPONSIVE
   ============================================= */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .branding-section {
    padding: 2rem 1.5rem 2.5rem;
    min-height: 320px;
  }

  .character-wrapper {
    width: 200px;
  }

  .stat-card-tl { left: 0; top: 5%; }
  .stat-card-br { right: 0; bottom: 5%; }

  .hero-title { font-size: 2rem; }
  .hero-description { font-size: 0.9rem; }

  .form-section {
    padding: 2.5rem 2rem 4rem;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    margin-top: -20px;
    z-index: 10;
  }

  .form-footer {
    bottom: 1rem;
  }
}

@media (max-width: 640px) {
  .branding-section {
    padding: 1.75rem 1rem 2.5rem;
  }

  .character-wrapper {
    width: 160px;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .hero-description {
    font-size: 0.85rem;
  }

  .stat-card { display: none; }
  .uptime-pill { display: none; }
  .features-strip { gap: 0.5rem; padding: 0.5rem 0.75rem; }
  .feature-divider { display: none; }
  .feature-item { font-size: 0.72rem; }

  .form-section {
    padding: 2rem 1.5rem 4rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .social-buttons {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .social-btn span {
    font-size: 0.8125rem;
  }
}
</style>
