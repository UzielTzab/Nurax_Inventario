<template>
  <div class="login-container">
    <!-- Lado Izquierdo: Branding -->
    <div class="branding-section">
      <!-- Decorative blobs -->
      <div class="blob blob-top-left"></div>
      <div class="blob blob-bottom-right"></div>

      <div class="branding-content" data-aos="fade-right" data-aos-delay="100">
        <!-- Character illustration -->
        <div class="character-wrapper" data-aos="fade-up" data-aos-delay="200">
          <img
            src="/worker_3d.png"
            alt="Personaje trabajando"
            class="character-image"
            @error="onImgError"
          />
          <!-- Fallback SVG si no carga la imagen -->
          <div v-if="imgError" class="character-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
              <!-- Simplified desk+person SVG fallback -->
              <rect x="40" y="130" width="120" height="8" rx="4" fill="#a5b4a0"/>
              <rect x="55" y="100" width="90" height="65" rx="6" fill="#4a7c59"/>
              <rect x="60" y="106" width="80" height="50" rx="3" fill="#6fb08b"/>
              <ellipse cx="100" cy="88" rx="20" ry="20" fill="#f5c5a3"/>
              <rect x="80" y="108" width="40" height="28" rx="4" fill="#e07b54"/>
            </svg>
          </div>
        </div>

        <!-- Textos -->
        <div class="hero-text" data-aos="fade-up" data-aos-delay="350">
          <h1 class="hero-title">Gestión Inteligente</h1>
          <p class="hero-description">Administra tu inventario y ventas con la potencia de Nurax.</p>
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
            <img src="/public/nurax_logo.png" alt="Leaf Icon" class="logo-icon">
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
            <label for="email" class="form-label">Correo Electrónico</label>
            <div class="input-wrapper" :class="{ 'input-focused': emailFocused }">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m2 7 10 6 10-6"/>
              </svg>
              <input
                id="email"
                v-model="email"
                type="text"
                placeholder="nombre@empresa.com"
                class="form-input"
                @focus="emailFocused = true"
                @blur="emailFocused = false"
                required
              />
            </div>
          </div>

          <!-- Contraseña -->
          <div class="form-group" data-aos="fade-up" data-aos-delay="250">
            <div class="password-label-row">
              <label for="password" class="form-label">Contraseña</label>
              <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="input-wrapper" :class="{ 'input-focused': passwordFocused }">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="form-input"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
                required
              />
              <button type="button" @click="showPassword = !showPassword" class="toggle-password" tabindex="-1">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Recordar dispositivo -->
          <div class="form-options" data-aos="fade-up" data-aos-delay="300">
            <label class="checkbox-label">
              <span class="checkbox-custom" :class="{ 'checked': rememberMe }" @click="rememberMe = !rememberMe">
                <svg v-show="rememberMe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="checkbox-text">Recordar dispositivo por 30 días</span>
            </label>
          </div>

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
            <button type="button" class="social-btn">
              <!-- Google Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="social-icon">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>

            <button type="button" class="social-btn">
              <!-- Microsoft Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="social-icon">
                <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
              </svg>
              <span>Microsoft</span>
            </button>
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
import AOS from 'aos'
import 'aos/dist/aos.css'

const { login } = useAuth()
const { showLoadingScreen } = useLoadingScreen()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)
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
  email: z.string().min(1, 'El correo electrónico es requerido.').email('Por favor ingresa un correo con formato válido.'),
  password: z.string().min(1, 'La contraseña es requerida.')
})

const handleLogin = async () => {
  loginError.value = ''
  
  const validationResult = loginSchema.safeParse({ email: email.value, password: password.value })
  
  if (!validationResult.success) {
    loginError.value = validationResult.error.issues[0]?.message || 'Correo o contraseña no válidos.'
    return
  }
  
  isLoading.value = true
  try {
    // 2. Real API login
    const result = await login(email.value, password.value)
    
    if (result.success && result.role) {
      console.log('✅ Login exitoso! Rol:', result.role)
      showLoadingScreen(result.email!, result.role)
    } else {
      loginError.value = result.error || 'Usuario o contraseña incorrectos.'
    }
  } catch (error) {
    console.error('❌ Error en login:', error)
    loginError.value = 'Ocurrió un error de conexión. Intenta de nuevo.'
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
  background: linear-gradient(160deg, #e8f5ef 0%, #c8e8d8 40%, #d4edd9 70%, #e0f0e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

/* Blobs decorativos */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.blob-top-left {
  width: 280px;
  height: 280px;
  background: rgba(34, 197, 94, 0.25);
  top: -80px;
  left: -80px;
  animation: blobPulse 6s ease-in-out infinite alternate;
}

.blob-bottom-right {
  width: 220px;
  height: 220px;
  background: rgba(6, 64, 43, 0.12);
  bottom: -60px;
  right: -60px;
  animation: blobPulse 8s ease-in-out infinite alternate-reverse;
}

@keyframes blobPulse {
  from { transform: scale(1) translate(0, 0); }
  to   { transform: scale(1.15) translate(10px, -10px); }
}

.branding-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  z-index: 2;
  text-align: center;
}

/* Ilustración personaje */
.character-wrapper {
  position: relative;
  width: 340px;
  max-width: 90%;
  animation: floatY 4s ease-in-out infinite;
}

@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

.character-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  mix-blend-mode: multiply;
  filter: drop-shadow(0 20px 40px rgba(6, 64, 43, 0.15));
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

/* Textos branding */
.hero-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a3d2b;
  margin: 0;
  letter-spacing: -0.3px;
}

.hero-description {
  font-size: 1rem;
  color: #4a7a5c;
  margin: 0;
  line-height: 1.5;
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
  width: 34px;
  height: 34px;
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
  background: linear-gradient(135deg, #e8f5ef, #c8e8d8);
  border: 1px solid rgba(34, 197, 94, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(6, 64, 43, 0.1);
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
  border-color: #06402B;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
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
  grid-template-columns: 1fr 1fr;
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
    padding: 2.5rem 2rem;
    min-height: 280px;
  }

  .character-wrapper {
    width: 220px;
  }

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
    padding: 2rem 1.5rem 3rem;
  }

  .character-wrapper {
    width: 180px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

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
