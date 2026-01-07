<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { BxPlusMedical, FaDeleteLeft } from '@kalimahapps/vue-icons'
import { useAuthStore } from '../stores/auth'
import { useTeimerStore } from '../stores/teimer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const teimerStore = useTeimerStore()

// Computed
const splitTimes = computed(() => {
  return teimerStore.activeTimers.map((t, index) => {
    let totalSecs = t.hours * 3600 + t.minutes * 60 + t.seconds
    if (teimerStore.isChainActive && index === teimerStore.currentTimerIndex && totalSecs >= 0) {
      totalSecs += 1
    }
    const h = Math.floor(totalSecs / 3600)
    const m = Math.floor((totalSecs % 3600) / 60)
    const s = totalSecs % 60
    return {
      h: String(h).padStart(2, '0'),
      m: String(m).padStart(2, '0'),
      s: String(s).padStart(2, '0')
    }
  })
})

const totalSecondsPerRow = (timer: any) =>
  timer.inputHours * 3600 + timer.inputMinutes * 60 + timer.inputSeconds
const currentSecondsPerRow = (timer: any) => timer.hours * 3600 + timer.minutes * 60 + timer.seconds

const getTimerProgress = (index: number) => {
  const timer = teimerStore.activeTimers[index]
  const total = totalSecondsPerRow(timer)
  const current = currentSecondsPerRow(timer)
  if (total === 0) return 0
  return (current / total) * 100
}

const handleTimeInput = (
  timer: any,
  field: 'inputHours' | 'inputMinutes' | 'inputSeconds',
  event: Event
) => {
  const target = event.target as HTMLInputElement
  let val = target.value.replace(/\D/g, '') // Only digits
  if (val.length > 2) val = val.slice(-2) // Keep last 2 digits
  timer[field] = parseInt(val) || 0

  // Constrain minutes and seconds
  if (field !== 'inputHours' && timer[field] > 59) {
    timer[field] = 59
  }
}

// Watchers
watch(
  () => teimerStore.activeTimers,
  (newVal) => {
    if (!teimerStore.isChainActive) {
      newVal.forEach((t) => {
        t.hours = t.inputHours
        t.minutes = t.inputMinutes
        t.seconds = t.inputSeconds
      })
    }
  },
  { deep: true }
)

onMounted(() => {
  if (authStore.user) teimerStore.fetchChains()
})

onBeforeUnmount(() => {
  teimerStore.stopAllTimers()
})
</script>

<template>
  <!-- Add Timer Button (Grid Item) -->
  <button v-if="!teimerStore.isChainActive" class="add-timer-btn" @click="teimerStore.addTimer">
    <BxPlusMedical />
    <span>{{ t('chain.addTimer') }}</span>
  </button>
  <div class="chain-view">
    <!-- Timer List -->
    <div class="timer-grid">
      <div v-for="(timer, index) in teimerStore.activeTimers" :key="index" class="timer-wrapper">
        <!-- Explosion Particles -->
        <div v-if="timer.isExploding" class="explosion-particles">
          <div
            v-for="i in 12"
            :key="i"
            class="particle"
            :style="`--angle: ${i * 30}deg; --delay: 0.15s; --duration: ${0.4 + (i % 3) * 0.2}s`"
          ></div>
          <div
            v-for="i in 12"
            :key="i"
            class="particle2"
            :style="`--angle: ${i * 64}deg; --delay: 0.15s; --duration: ${0.4 + (i % 3) * 0.2}s`"
          ></div>
          <div
            v-for="i in 12"
            :key="i"
            class="particle2"
            :style="`--angle: ${i * 18}deg; --delay: 0.15s; --duration: ${0.4 + (i % 3) * 0.2}s`"
          ></div>
        </div>

        <div
          class="timer-card"
          :class="{
            active: teimerStore.isChainActive && index === teimerStore.currentTimerIndex,
            completed: teimerStore.isChainActive && index < teimerStore.currentTimerIndex,
            pending: teimerStore.isChainActive && index > teimerStore.currentTimerIndex,
            exploding: timer.isExploding
          }"
        >
          <div class="card-header">
            <input
              v-if="!teimerStore.isChainActive"
              v-model="timer.label"
              :placeholder="t('chain.timerName')"
              class="label-input"
            />
            <h3 v-else class="label-display">
              {{ timer.label || `${t('chain.timer')} ${index + 1}` }}
            </h3>
            <button
              class="remove-btn"
              @click="teimerStore.removeTimer(index)"
              v-if="!teimerStore.isChainActive && teimerStore.activeTimers.length > 1"
            >
              <FaDeleteLeft />
            </button>
          </div>

          <div class="card-content">
            <div v-if="teimerStore.isChainActive" class="time-display">
              <span class="time-part">{{ splitTimes[index].h }}</span>
              <span class="time-separator">:</span>
              <span class="time-part">{{ splitTimes[index].m }}</span>
              <span class="time-separator">:</span>
              <span class="time-part">{{ splitTimes[index].s }}</span>
            </div>
            <div v-else class="time-inputs">
              <div class="input-field">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="String(timer.inputHours).padStart(2, '0')"
                  @input="(e) => handleTimeInput(timer, 'inputHours', e)"
                  @blur="timer.inputHours = Math.min(99, Math.max(0, timer.inputHours))"
                  maxlength="2"
                />
              </div>
              <span class="time-separator">:</span>
              <div class="input-field">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="String(timer.inputMinutes).padStart(2, '0')"
                  @input="(e) => handleTimeInput(timer, 'inputMinutes', e)"
                  @blur="timer.inputMinutes = Math.min(59, Math.max(0, timer.inputMinutes))"
                  maxlength="2"
                />
              </div>
              <span class="time-separator">:</span>
              <div class="input-field">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="String(timer.inputSeconds).padStart(2, '0')"
                  @input="(e) => handleTimeInput(timer, 'inputSeconds', e)"
                  @blur="timer.inputSeconds = Math.min(59, Math.max(0, timer.inputSeconds))"
                  maxlength="2"
                />
              </div>
            </div>
          </div>

          <div class="card-progress">
            <div class="progress-fill" :style="{ width: getTimerProgress(index) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chain-view {
  padding: 24px;
  /* max-width: 1400px; */
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 600px) {
  .chain-view {
    padding: 12px 8px;
  }
}

/* Timer Grid */
.timer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  width: 90svw;
}

@media (max-width: 640px) {
  .timer-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Case: Only one timer (Large View) */
.timer-grid:has(> .timer-wrapper:only-child) {
  grid-template-columns: 1fr;
  max-width: 900px;
  margin: 0 auto;
}

.timer-grid:has(> .timer-wrapper:only-child) .timer-card {
  min-height: 450px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: transparent;
  box-shadow: none;
  gap: 32px;
}

@media (max-width: 600px) {
  .timer-grid:has(> .timer-wrapper:only-child) .time-display,
  .timer-grid:has(> .timer-wrapper:only-child) .time-inputs {
    flex-direction: column;
    gap: 0px;
  }

  .timer-grid:has(> .timer-wrapper:only-child) .time-separator {
    display: none !important;
  }
}

.timer-grid:has(> .timer-wrapper:only-child) .card-header {
  justify-content: center;
}

.timer-grid:has(> .timer-wrapper:only-child) .card-content {
  flex: 0 1 auto;
}

.timer-wrapper {
  position: relative;
  display: flex;
}

.timer-card {
  background: rgba(var(--text-primary), 0.03);
  border-radius: 32px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 200px;
  box-shadow: 0 0 0px 2px rgba(var(--secondary-rgb), 0.15);
  width: 100%;
}

.timer-card.exploding {
  animation: explosion-shrink 0.1s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
  pointer-events: none;
}

@keyframes explosion-shrink {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* Particles */
.explosion-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
  z-index: 10;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--main);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  opacity: 0;
  z-index: 1;
  animation: particle-fly var(--duration) ease-out var(--delay) forwards;
}
.particle2 {
  position: absolute;
  width: 9px;
  height: 9px;
  background: #f00;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  opacity: 0;
  z-index: 0;
  animation: particle-fly var(--duration) ease-out var(--delay) forwards;
}

@keyframes particle-fly {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(calc(cos(var(--angle)) * 120px), calc(sin(var(--angle)) * 120px)) scale(0);
    opacity: 0;
  }
}

@media (max-width: 600px) {
  .timer-card {
    min-height: 180px;
    gap: 16px;
    padding: 24px 16px;
  }
}

.timer-card.active {
  transform: scale(1.02);
  box-shadow: 0 17px 40px rgba(var(--secondary-rgb), 0.3);
}

.timer-card.completed {
  opacity: 0.6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.label-input {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  width: 80%;
}

.label-display {
  font-size: 14px;
  font-weight: 700;
  color: var(--main);
}

.remove-btn {
  font-size: 30px;
  background: transparent;
  border: none;
  color: #ff4444;
  cursor: pointer;
  opacity: 0;
  transition: var(--transition);
  @media (max-width: 640px) {
    opacity: 1;
  }
}

.timer-card:hover .remove-btn {
  opacity: 1;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: -1px;
}

.time-display,
.time-part,
.time-separator {
  font-weight: 800 !important;
  font-family: inherit;
}

.time-part {
  font-weight: 800 !important;
  font-family: inherit;
}

.time-display {
  font-size: clamp(40px, 8vw, 64px);
}

.timer-grid:has(> .timer-wrapper:only-child) .time-display {
  font-size: clamp(60px, 20vw, 120px);
  letter-spacing: -2px;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-separator {
  color: var(--main);
  font-size: clamp(40px, 8vw, 64px);
  font-weight: 800 !important;
  font-family: inherit;
  margin-top: -4px;
  padding-bottom: 5px;
  @media (max-width: 640px) {
    padding-bottom: 0;
  }
}

.timer-grid:has(> .timer-wrapper:only-child) .time-separator {
  font-size: clamp(60px, 20vw, 120px);
  padding-bottom: 15px;
}

.input-field {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-field input {
  width: clamp(60px, 12vw, 90px);
  background: transparent;
  border: none;
  text-align: center;
  font-size: clamp(40px, 8vw, 64px);
  font-weight: 800;
  color: var(--text-primary);
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
  padding: 0;
  outline: none;
  transition: var(--transition);
}

.timer-grid:has(> .timer-wrapper:only-child) .input-field input {
  width: clamp(100px, 30vw, 180px);
  font-size: clamp(60px, 20vw, 120px);
  letter-spacing: -2px;
}

.input-field input:focus {
  color: var(--main);
}

/* Chrome, Safari, Edge, Opera */
.input-field input::-webkit-outer-spin-button,
.input-field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Firefox */
.input-field input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.card-progress {
  height: 6px;
  background: rgba(var(--text-primary), 0.05);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
  width: 100%;
}

.timer-grid:has(> .timer-wrapper:only-child) .card-progress {
  max-width: 500px;
}

.progress-fill {
  height: 100%;
  background: var(--main);
  transition: width 1s linear;
}

/* Add Timer Btn */
.add-timer-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  border: 2px dashed rgba(var(--text-primary), 0.1);
  background: var(--main);
  border: none;
  background: var(--main);
  color: white;
  padding: 12px 24px;
  border-radius: 32px;
  display: flex;
  box-shadow: 0 8px 20px rgba(var(--main-rgb), 0.3);
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: var(--transition);
  text-wrap: nowrap;
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
}

.add-timer-btn:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 12px 28px rgba(var(--main-rgb), 0.4);
}

.add-timer-btn svg {
  font-size: 20px;
}

.add-timer-btn span {
  font-weight: 700;
  font-size: 16px;
}

/* Drawer */
.drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: var(--app-bg);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.drawer.open {
  right: 0;
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid rgba(var(--text-primary), 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.drawer-header h2 {
  font-size: 20px;
  font-weight: 800;
}

.new-chain-btn {
  background: rgba(var(--main-rgb), 0.1);
  color: var(--main);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.new-chain-btn:hover {
  background: var(--main);
  color: white;
}

.close-drawer {
  background: transparent;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.chain-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(var(--text-primary), 0.03);
  border-radius: 16px;
  cursor: pointer;
  transition: var(--transition);
}

.chain-item:hover {
  background: rgba(var(--main-rgb), 0.05);
  transform: translateX(-4px);
}

.chain-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.chain-title {
  font-weight: 700;
  font-size: 16px;
}

.timer-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ff4444;
  padding: 8px;
  cursor: pointer;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1999;
}
</style>
