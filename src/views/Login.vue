<template>
  <div class="login-container">
    <!-- Lado Izquierdo: Branding -->
    <div class="branding-section">
      <div class="branding-content">
        <!-- Logo -->
        <div class="logo-container" data-aos="fade-up" data-aos-delay="100">
          <img src="/nurax_logo.png" alt="Logo" class="logo-image">
          <span class="logo-text">Nurax Inventario</span>
        </div>
        <!-- Título y descripción -->
        <div class="hero-content">
          <div>
            <h1 class="hero-title" data-aos="fade-up" data-aos-delay="200">
              Gestión inteligente
            </h1>
            <h1 class="highlight" data-aos="fade-up" data-aos-delay="200">
              para tu negocio.
            </h1>
          </div>
          <p class="hero-description" data-aos="fade-up" data-aos-delay="300">
            Controla tu inventario, ventas y clientes desde una plataforma unificada, rápida y segura.
          </p>
        </div>

        <!-- Footer -->
        <div class="branding-footer" data-aos="fade-up" data-aos-delay="400">
          <p>Powered by Onux.</p>
          <div class="footer-links">
            <a href="#">Términos</a>
            <span>·</span>
            <a href="#">Privacidad</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Lado Derecho: Formulario -->
    <div class="form-section">
      <div class="form-container">
        <!-- Header -->
        <div class="form-header" data-aos="fade-up" data-aos-delay="200">
          <h2 class="form-title">Bienvenido de nuevo</h2>
          <p class="form-subtitle">Ingresa tus credenciales para acceder al sistema.</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="form-group" data-aos="fade-up" data-aos-delay="200">
            <label for="email" class="form-label">Usuario o Correo Electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <input id="email" v-model="email" type="text" placeholder="nombre@empresa.com" class="form-input"
                required />
            </div>
          </div>

          <!-- Contraseña -->
          <div class="form-group" data-aos="fade-up" data-aos-delay="300">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clip-rule="evenodd" />
              </svg>
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                class="form-input" required />
              <button type="button" @click="showPassword = !showPassword" class="toggle-password">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  <path fill-rule="evenodd"
                    d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                    clip-rule="evenodd" />
                  <path
                    d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Recordarme y Olvidaste contraseña -->
          <div class="form-options" data-aos="fade-up" data-aos-delay="400">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
              <span>Recordarme</span>
            </label>
            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Botón de Login -->
          <button type="submit" class="login-button" data-aos="fade-up" data-aos-delay="500" :disabled="isLoading">
            <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              class="button-icon">
              <path fill-rule="evenodd"
                d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                clip-rule="evenodd" />
              <path fill-rule="evenodd"
                d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                clip-rule="evenodd" />
            </svg>
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>

        <!-- Security Badge -->
        <!-- <div class="security-badge" data-aos="fade-up" data-aos-delay="600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
          </svg>
          <span>Sistema Seguro</span>
          <p>Todas las transmisiones están encriptadas con seguridad TLS 1.3</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useLoadingScreen } from '@/composables/useLoadingScreen'
import { useRouter } from 'vue-router'
import AOS from 'aos'
import 'aos/dist/aos.css'

const { login } = useAuth()
const router = useRouter()
const { showLoadingScreen } = useLoadingScreen()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)

// Inicializar AOS cuando el componente se monta
onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  })
})

const handleLogin = async () => {
  isLoading.value = true

  try {
    // Intentar login
    const result = await login(email.value, password.value)

    if (result.success) {
      console.log('✅ Login exitoso! Mostrando pantalla de carga...')

      // Mostrar pantalla de carga
      showLoadingScreen(result.email)
    }
  } catch (error) {
    console.error('❌ Error en login:', error)
    // Aquí podrías mostrar un mensaje de error al usuario
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #ffffff;
}

/* ===== LADO IZQUIERDO: BRANDING ===== */
.branding-section {
  background: linear-gradient(135deg, rgba(94, 148, 199, 0.95) 0%, rgb(0, 0, 0) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

/* Imagen de fondo con animación de fade-in */
.branding-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=1600&fit=crop&q=80') center/cover;
  opacity: 0;
  animation: fadeInBackground 1.5s ease-out forwards;
  animation-delay: 0.3s;
  z-index: 0;
}

@keyframes fadeInBackground {
  from {
    opacity: 0;
    transform: scale(1.05);
  }

  to {
    opacity: 0.3;
    transform: scale(1);
  }
}

/* Overlay verde con efecto radial */
.branding-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

.branding-content {
  max-width: 500px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.logo-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 8px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--color-brand-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.1;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.highlight {
  color: var(--color-brand-primary);
  font-weight: 700;
  font-size: 2.5rem;
  margin: 0;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.branding-footer {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links {
  display: flex;
  gap: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-brand-secondary);
}

/* ===== LADO DERECHO: FORMULARIO ===== */
.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fafafa;
}

.form-container {
  width: 100%;
  max-width: 440px;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1f2e;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: 0.9375rem;
  color: #7893de;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  background: white;
  transition: all 0.2s;
  color: #1e293b;
}

.form-input::placeholder {
  color: #cbd5e1;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-brand-secondary);
  border-width: 1.5px;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #94a3b8;
  transition: color 0.2s;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

.toggle-password:hover {
  color: #64748b;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #475569;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-brand-secondary);
}

.forgot-password {
  color: var(--color-brand-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.forgot-password:hover {
  opacity: 0.8;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--color-brand-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background: var(--color-brand-accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.security-badge {
  margin-top: 2rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.security-badge svg {
  width: 20px;
  height: 20px;
  color: var(--color-brand-secondary);
}

.security-badge span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.security-badge p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .branding-section {
    display: none;
  }

  .form-section {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 640px) {
  .form-section {
    padding: 1.5rem 1rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-subtitle {
    font-size: 0.875rem;
  }
}
</style>
