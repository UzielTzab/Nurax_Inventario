<template>
  <div class="login-container">
    <div class="branding-section">
      <div class="branding-content">
        <h1>Nurax Inventario</h1>
        <p>Gestión inteligente para tu negocio</p>
      </div>
    </div>

    <div class="form-section">
      <div class="form-container">
        <h2>Bienvenido de nuevo</h2>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Usuario o Correo</label>
            <input
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
            />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>

          <AppButton type="submit" variant="fill" :disabled="isLoading">
            {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
          </AppButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useLoadingScreen } from '@/composables/useLoadingScreen'

const { login } = useAuth()
const { showLoadingScreen } = useLoadingScreen()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    const result = await login(email.value, password.value)
    if (result.success) {
      console.log('✅ Login exitoso!')
      showLoadingScreen(result.email || '')
    } else {
      console.error('❌ Login falló')
    }
  } catch (error) {
    console.error('Error:', error)
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
  background: #fff;
}

.branding-section {
  background: linear-gradient(135deg, rgba(2, 3, 3, 0.95) 0%, rgba(255, 59, 10, 0.95) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.branding-content {
  text-align: center;
}

.branding-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.branding-content p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-container h2 {
  font-size: 1.875rem;
  margin-bottom: 0.5rem;
  color: var(--color-brand-secondary);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--color-brand-secondary);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--color-card-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--color-card-fill);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-group button {
  background: transparent;
  border: none;
  color: var(--color-brand-primary);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem;
  text-align: right;
}

.btn-login {
  background: var(--color-brand-primary);
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: #16a34a;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .branding-section {
    min-height: 200px;
  }
}
</style>
