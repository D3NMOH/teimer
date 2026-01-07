<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TeimerChain from './components/TeimerChain.vue'
import {
  BxUserCircle,
  BxLogOut,
  BxMenu,
  BxMenuAltLeft,
  FaPlay,
  FaPause,
  FaStop,
  FaFloppyDisk,
  BxX,
  FaDeleteLeft,
  BxPlusMedical,
  BxColorFill
} from '@kalimahapps/vue-icons'
import TeimerAuth from './components/TeimerAuth.vue'
import AppLogo from './components/AppLogo.vue'
import TeLogo from './components/TeLogo.vue'
import { useAuthStore } from './stores/auth'
import { useTeimerStore } from './stores/teimer'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const authStore = useAuthStore()
const teimerStore = useTeimerStore()

const locales = [
  { code: 'de', name: 'DE' },
  { code: 'en', name: 'EN' },
  { code: 'uk', name: 'UA' },
  { code: 'ru', name: 'RU' }
]

const setLocale = (code: string) => {
  locale.value = code
  localStorage.setItem('teimer-locale', code)
}

const showAuthModal = ref(false)
const showSidebar = ref(false)

const userEmail = computed(() => authStore.user?.email || '')
const isLoggedIn = computed(() => !!authStore.user)

const colors = [
  { primary: '#1de9b6', secondary: '#00bfa5', tertiary: '#00695c' },
  { primary: '#ff6565', secondary: '#ff5050', tertiary: '#7a0000' },
  { primary: '#ffcc00', secondary: '#ff9900', tertiary: '#7a5c00' },
  { primary: '#2196f3', secondary: '#1976d2', tertiary: '#0d47a1' },
  { primary: '#00c853', secondary: '#009624', tertiary: '#003d00' },
  { primary: '#ab47bc', secondary: '#8e24aa', tertiary: '#4a148c' },
  { primary: '#ffab00', secondary: '#ff6d00', tertiary: '#7a1b00' }
]

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0'
}

const darkenColor = (hex: string, percent: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const f = (val: number) => Math.max(0, Math.floor(val * (1 - percent / 100)))
  const toHex = (val: number) => val.toString(16).padStart(2, '0')
  return `#${toHex(f(r))}${toHex(f(g))}${toHex(f(b))}`
}

const colorInput = ref<HTMLInputElement | null>(null)

const handleCustomColor = (e: Event) => {
  const hex = (e.target as HTMLInputElement).value
  const colorObj = {
    primary: hex,
    secondary: darkenColor(hex, 15),
    tertiary: darkenColor(hex, 30)
  }
  setThemeColor(colorObj)
}

const setThemeColor = (colorObj: (typeof colors)[0]) => {
  const { primary, secondary, tertiary } = colorObj

  // Set Primary (Main)
  document.documentElement.style.setProperty('--primary', primary)
  document.documentElement.style.setProperty('--primary-rgb', hexToRgb(primary))

  // Set Secondary
  document.documentElement.style.setProperty('--secondary', secondary)
  document.documentElement.style.setProperty('--secondary-rgb', hexToRgb(secondary))

  // Set Tertiary
  document.documentElement.style.setProperty('--tertiary', tertiary)
  document.documentElement.style.setProperty('--tertiary-rgb', hexToRgb(tertiary))

  // Persistence
  localStorage.setItem('teimer-theme', JSON.stringify(colorObj))
}

const handleSave = async () => {
  const res = await teimerStore.saveChain()
  if (res && !res.error) {
    teimerStore.notify(t('chain.saved'), 'success')
  } else if (res?.error) {
    teimerStore.notify(`${t('chain.error')}: ${res.error.message}`, 'error')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('teimer-theme')
  if (savedTheme) {
    try {
      setThemeColor(JSON.parse(savedTheme))
    } catch {
      setThemeColor(colors[0])
    }
  } else {
    setThemeColor(colors[0])
  }
})
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="logo desktop-logo">
        <AppLogo height="40" primaryColor="var(--text-primary)" secondaryColor="var(--main)" />
      </div>
      <div class="logo mobile-logo">
        <TeLogo height="32" primaryColor="var(--text-primary)" secondaryColor="var(--main)" />
      </div>

      <!-- Chain Controls in Topbar -->
      <div class="topbar-controls">
        <div class="chain-name-group">
          <input
            v-model="teimerStore.currentChainName"
            :placeholder="t('chain.placeholder')"
            class="topbar-input"
            :disabled="teimerStore.isChainActive"
          />
          <button
            v-if="isLoggedIn"
            class="topbar-btn save"
            @click="handleSave"
            :disabled="!teimerStore.currentChainName || teimerStore.isChainActive"
            :title="t('chain.save')"
          >
            <FaFloppyDisk />
          </button>
        </div>

        <div class="playback-controls">
          <button
            class="topbar-btn play"
            @click="teimerStore.toggleChain"
            :class="{ active: teimerStore.isChainActive && !teimerStore.isPaused }"
          >
            <FaPause v-if="teimerStore.isChainActive && !teimerStore.isPaused" />
            <FaPlay v-else />
          </button>
          <button
            v-if="teimerStore.isChainActive"
            class="topbar-btn stop"
            @click="teimerStore.stopChain"
          >
            <FaStop />
          </button>
        </div>
      </div>

      <div class="header-right">
        <button
          class="action-btn menu-toggle"
          @click="showSidebar = !showSidebar"
          :class="{ active: showSidebar }"
        >
          <BxMenu v-if="!showSidebar" />
          <BxMenuAltLeft v-else />
        </button>
      </div>
    </header>

    <main class="app-content">
      <TeimerChain />
    </main>

    <!-- Sidebar Panel -->
    <div
      class="sidebar-panel"
      :class="{ open: showSidebar }"
      :style="{
        boxShadow: !showSidebar ? 'none' : ''
      }"
    >
      <div class="sidebar-header">
        <div v-if="!isLoggedIn" class="auth-section">
          <button class="sidebar-auth-btn" @click="showAuthModal = true">
            <BxUserCircle />
          </button>
        </div>
        <div v-else class="user-info">
          <button class="sidebar-logout-btn" @click="authStore.signOut" :title="t('app.signOut')">
            <BxLogOut />
          </button>
          <span class="user-email">{{ userEmail }}</span>
        </div>

        <button @click="showSidebar = false" class="close-sidebar">
          <BxX />
        </button>
      </div>

      <div class="sidebar-content">
        <!-- Color Theme Section -->
        <div class="sidebar-section">
          <div class="section-label">{{ t('app.changeTheme') }}</div>
          <div class="color-picker-grid">
            <button
              v-for="color in colors"
              :key="color.primary"
              class="color-btn"
              :style="{ backgroundColor: color.primary }"
              @click="setThemeColor(color)"
              :title="color.primary"
            ></button>
            <button
              class="color-btn custom-picker-btn"
              @click="colorInput?.click()"
              title="Custom Color"
            >
              <BxColorFill />
              <input
                ref="colorInput"
                type="color"
                class="hidden-color-input"
                @input="handleCustomColor"
              />
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="section-label">{{ t('app.language') }}</div>
          <div class="sidebar-locales">
            <button
              v-for="loc in locales"
              :key="loc.code"
              class="sidebar-locale-btn"
              :class="{ active: locale === loc.code }"
              @click="setLocale(loc.code)"
            >
              {{ loc.name }}
            </button>
          </div>
        </div>

        <!-- Chain List Access -->
        <div class="sidebar-section" v-if="isLoggedIn">
          <div class="sidebar-header-inline">
            <div class="section-label">{{ t('app.savedChains') }}</div>
            <button
              class="new-chain-small-btn"
              @click="teimerStore.createNewChain"
              :title="t('app.newChain')"
            >
              <BxPlusMedical />
            </button>
          </div>

          <div class="sidebar-chain-list">
            <div v-if="teimerStore.loading" class="sidebar-loader">{{ t('app.loading') }}</div>
            <div v-else-if="teimerStore.chains.length === 0" class="sidebar-empty-hint">
              {{ t('chain.emptyHint') || 'No saved chains' }}
            </div>
            <div
              v-for="chain in teimerStore.chains"
              :key="chain.id"
              class="sidebar-chain-item"
              @click="(teimerStore.loadChain(chain), (showSidebar = false))"
            >
              <div class="sidebar-chain-info">
                <span class="sidebar-chain-title">{{ chain.name }}</span>
                <span class="sidebar-timer-count"
                  >{{ chain.timers.length }} {{ t('chain.timer') }}s</span
                >
              </div>
              <button class="sidebar-delete-btn" @click.stop="teimerStore.deleteChain(chain.id!)">
                <FaDeleteLeft />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSidebar" class="sidebar-overlay" @click="showSidebar = false"></div>

    <TeimerAuth v-if="showAuthModal" @close="showAuthModal = false" />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="teimerStore.toast.show" class="toast-notification" :class="teimerStore.toast.type">
        <div class="toast-content">
          <span class="toast-message">{{ teimerStore.toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
:root {
  --app-bg: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --header-height: 70px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --main: var(--secondary);
  --main-rgb: var(--secondary-rgb);
}

@media (prefers-color-scheme: dark) {
  :root {
    --app-bg: #121212;
    --text-primary: #f5f5f5;
    --text-secondary: #a0a0a0;
    --main: var(--primary);
    --main-rgb: var(--primary-rgb);
  }
}

.app-layout {
  min-height: 80svh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.app-header {
  height: var(--header-height);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(var(--app-bg), 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(var(--main-rgb), 0.1);
  @media screen and (max-width: 640px) {
    padding-inline: 5px;
  }
}

/* Topbar Controls */
.topbar-controls {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 40px;
  @media screen and (max-width: 640px) {
    margin: 0 10px;
  }
}

.logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.logo.mobile-logo {
  display: none;
  margin-left: 10px;
}

@media screen and (max-width: 640px) {
  .logo.desktop-logo {
    display: none;
  }
  .logo.mobile-logo {
    display: flex;
  }
}
.chain-name-group {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(var(--text-primary), 0.03);
  padding: 8px 16px;
  border-radius: 16px;
  flex: 1;
  max-width: 260px;
  border: 1px solid rgba(var(--text-primary), 0.05);
  transition: var(--transition);
}

.chain-name-group:focus-within {
  background: var(--app-bg);
  border-color: var(--main);
  box-shadow: 0 4px 12px rgba(var(--main-rgb), 0.1);
}

.topbar-input {
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  width: 100%;
  outline: none;
}

.topbar-btn {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: var(--transition);
}

.topbar-btn.save {
  background: transparent;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
}
.topbar-btn.save:hover:not(:disabled) {
  color: var(--main);
  transform: scale(1.1);
}

.playback-controls {
  display: flex;
  gap: 10px;
  padding-left: 10px;
  border-left: 1px solid rgba(var(--text-primary), 0.1);
}

.topbar-btn.play {
  background: var(--main);
  color: white;
  box-shadow: 0 8px 16px rgba(var(--main-rgb), 0.25);
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

.topbar-btn.play:hover {
  background: var(--main);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(var(--main-rgb), 0.35);
}

.topbar-btn.stop {
  background: rgba(var(--text-primary), 0.05);
  color: #ff4444;
}

.topbar-btn.stop:hover {
  background: #ff4444;
  color: white;
  box-shadow: 0 8px 16px rgba(255, 68, 68, 0.25);
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

/* Sidebar */
.sidebar-panel {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100%;
  background: var(--app-bg);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 2100;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.sidebar-panel.open {
  right: 0;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(var(--text-primary), 0.05);
}

.sidebar-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--main);
}

.close-sidebar {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.sidebar-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-auth-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: var(--main);
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 24px;
  cursor: pointer;
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

.user-info {
  display: flex;
  /* flex-direction: column; */
  gap: 16px;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(var(--text-primary), 0.03);
  border-radius: 12px;
}

.user-icon {
  font-size: 24px;
  color: var(--main);
}

.user-email {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: rgba(var(--main-rgb), 0.15);
  color: var(--main);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 15px;
  border-radius: 24px;
}

.sidebar-logout-btn,
.sidebar-theme-btn,
.sidebar-chains-btn {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(var(--text-primary), 0.1);
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  svg {
    font-size: 20px;
  }
}

.sidebar-logout-btn:hover {
  color: #ff4444;
  border-color: #ff4444;
}

.sidebar-header-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.new-chain-small-btn {
  background: rgba(var(--main-rgb), 0.1);
  color: var(--main);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.new-chain-small-btn:hover {
  background: var(--main);
  color: white;
  transform: scale(1.1);
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

.sidebar-chain-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.sidebar-chain-list::-webkit-scrollbar {
  width: 4px;
}

.sidebar-chain-list::-webkit-scrollbar-thumb {
  background: rgba(var(--text-primary), 0.1);
  border-radius: 2px;
}

.sidebar-chain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(var(--text-primary), 0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid transparent;
}

.sidebar-chain-item:hover {
  background: rgba(var(--main-rgb), 0.05);
  border-color: rgba(var(--main-rgb), 0.2);
  transform: translateX(4px);
}

.sidebar-chain-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.sidebar-chain-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
}

.sidebar-timer-count {
  font-size: 11px;
  color: var(--text-secondary);
}

.sidebar-delete-btn {
  font-size: 24px;
  background: transparent;
  border: none;
  color: #ff4444;
  padding: 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: var(--transition);
}

.sidebar-delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.sidebar-loader,
.sidebar-empty-hint {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  background: rgba(var(--text-primary), 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(var(--text-primary), 0.1);
}

/* Color Picker */
.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.color-btn {
  aspect-ratio: 1;
  border-radius: 12px;
  border: 4px solid transparent;
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
}

.color-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.color-btn.custom-picker-btn {
  background: linear-gradient(135deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff);
  box-shadow: inset 0 0 0px 26px var(--bg-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-mono);
  position: relative;
  overflow: hidden;
  background-size: 60px 60px;
  background-position: center;
}

.color-btn.custom-picker-btn svg {
  font-size: 38px;
}

.hidden-color-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.color-btn:active {
  transform: scale(0.95);
}

.sidebar-locales {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sidebar-locale-btn {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(var(--text-primary), 0.1);
  background: transparent;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--main);
}

.sidebar-locale-btn.active {
  background: var(--main);
  color: white;
  border-color: var(--main);
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2050;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  background: rgba(var(--main-rgb), 0.1);
  color: var(--main);
}

.action-btn.active {
  background: var(--main);
  color: white;
}

.app-content {
  margin-top: var(--header-height);
  flex: 1;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: var(--app-bg);
  border: 1px solid rgba(var(--main-rgb), 0.2);
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}
.toast-notification.success {
  border-left: 4px solid var(--main);
}
.toast-notification.error {
  border-left: 4px solid #ff4444;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

@media (max-width: 640px) {
  .sidebar-chains-btn {
    display: flex;
  }
}
</style>
