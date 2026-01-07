import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { useAuthStore } from './stores/auth'
import { i18n } from './i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)

const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
})
