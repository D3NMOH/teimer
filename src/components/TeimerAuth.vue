<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'
import { BxX } from '@kalimahapps/vue-icons'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineOptions({
  name: 'TeimerAuth'
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const isSignUp = ref(false)
const errorMsg = ref('')

const emit = defineEmits(['close'])

async function handleAuth() {
  loading.value = true
  errorMsg.value = ''

  try {
    if (isSignUp.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      alert('Check your email for the confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      emit('close')
    }
  } catch (error: any) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-overlay" @click.self="emit('close')">
    <div class="auth-modal">
      <button class="close-btn" @click="emit('close')">
        <BxX />
      </button>

      <div class="modal-header">
        <h2>{{ isSignUp ? t('app.createAccount') : t('app.welcome') }}</h2>
        <p>
          {{ isSignUp ? t('app.join') : t('app.access') }}
        </p>
      </div>

      <form @submit.prevent="handleAuth" class="auth-form">
        <div class="input-group">
          <label>{{ t('app.email') }}</label>
          <input v-model="email" type="email" required placeholder="name@example.com" />
        </div>
        <div class="input-group">
          <label>{{ t('app.password') }}</label>
          <input v-model="password" type="password" required placeholder="••••••••" />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button class="submit-btn" :disabled="loading">
          <span v-if="loading">{{ t('app.loading') }}</span>
          <span v-else>{{ isSignUp ? t('app.createAccount') : t('app.signIn') }}</span>
        </button>
      </form>

      <div class="modal-footer">
        <p>
          {{ isSignUp ? t('app.alreadyHave') : t('app.dontHave') }}
          <button class="toggle-link" @click="isSignUp = !isSignUp">
            {{ isSignUp ? t('app.signIn') : t('app.createOne') }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.auth-modal {
  background: var(--app-bg);
  width: 100%;
  max-width: 400px;
  border-radius: 28px;
  padding: 40px;
  position: relative;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(var(--main-rgb), 0.1);
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(var(--main-rgb), 0.05);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.close-btn:hover {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.modal-header h2 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.modal-header p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-left: 4px;
}

.input-group input {
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid rgba(var(--main-rgb), 0.05);
  background: rgba(var(--main-rgb), 0.02);
  color: var(--text-primary);
  font-size: 15px;
  transition: var(--transition);
}

.input-group input:focus {
  outline: none;
  border-color: var(--main);
  background: var(--app-bg);
}

.error-msg {
  color: #ff4444;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.submit-btn {
  background: var(--main);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 8px;
  box-shadow: 0 10px 20px rgba(var(--main-rgb), 0.2);
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(var(--main-rgb), 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-footer {
  margin-top: 32px;
  text-align: center;
}

.modal-footer p {
  font-size: 14px;
  color: var(--text-secondary);
}

.toggle-link {
  background: transparent;
  border: none;
  color: var(--main);
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 4px;
}
</style>
