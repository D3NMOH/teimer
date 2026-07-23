import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api, type User, type Session } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)

  async function initialize() {
    const { data } = await api.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null

    api.auth.onAuthStateChange((_event, _session) => {
      session.value = _session
      user.value = _session?.user ?? null
    })
  }

  async function signOut() {
    await api.auth.signOut()
    user.value = null
    session.value = null
  }

  return { user, session, initialize, signOut }
})
