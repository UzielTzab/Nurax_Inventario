<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h1 class="logo">Nurax</h1>
        <p class="subtitle">Sistema de Inventario</p>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Email o Usuario</label>
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
            <button 
              type="button" 
              class="toggle-btn"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>

          <AppButton type="submit" variant="fill" :disabled="isLoading">
            {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
          </AppButton>
        </form>

        <p class="footer-text">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLoadingScreen } from '@/composables/useLoadingScreen'

const { showLoadingScreen } = useLoadingScreen()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  console.log('🔐 Login:', email.value)
  
  // Simulamos delay de login
  setTimeout(() => {
    showLoadingScreen(email.value)
    isLoading.value = false
  }, 1000)
}
</script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-box {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand-primary);
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: var(--color-brand-secondary);
  margin-bottom: 2rem;
  font-size: 0.875rem;
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

.form-group label {
  font-weight: 600;
  color: var(--color-brand-secondary);
  font-size: 0.875rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-card-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.toggle-btn {
  align-self: flex-end;
  background: none;
  border: none;
  color: var(--color-brand-primary);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0;
  text-decoration: underline;
}

.toggle-btn:hover {
  opacity: 0.8;
}

.btn-login {
  background: linear-gradient(135deg, var(--color-brand-primary) 0%, #16a34a 100%);
  color: white;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer-text {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.footer-text a {
  color: var(--color-brand-primary);
  text-decoration: none;
  font-weight: 600;
}

.footer-text a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .login-box {
    padding: 1.5rem;
  }
  
  .logo {
    font-size: 1.5rem;
  }
}
</style>
