import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'

export interface Timer {
  name: string
  label: string
  hours: number
  minutes: number
  seconds: number
  inputHours: number
  inputMinutes: number
  inputSeconds: number
  intervalId: number | null
  isExploding?: boolean
}

export interface TimerChain {
  id?: string
  name: string
  timers: Omit<Timer, 'hours' | 'minutes' | 'seconds' | 'intervalId' | 'isExploding'>[]
  user_id?: string
}

export const useTeimerStore = defineStore('teimer', () => {
  const chains = ref<TimerChain[]>([])
  const loading = ref(false)
  const authStore = useAuthStore()

  // Active Session State
  const currentChainId = ref<string | null>(null)
  const currentChainName = ref('')
  const activeTimers = ref<Timer[]>([
    {
      name: 'Timer 1',
      label: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      inputHours: 0,
      inputMinutes: 0,
      inputSeconds: 0,
      intervalId: null
    }
  ])
  const isChainActive = ref(false)
  const isPaused = ref(false)
  const currentTimerIndex = ref(0)

  // Logic
  function stopAllTimers() {
    activeTimers.value.forEach((t) => {
      if (t.intervalId) clearInterval(t.intervalId)
      t.intervalId = null
      t.hours = t.inputHours
      t.minutes = t.inputMinutes
      t.seconds = t.inputSeconds
    })
    isChainActive.value = false
    isPaused.value = false
  }

  function startTimer(index: number, resume = false) {
    const timer = activeTimers.value[index]
    if (timer.intervalId) return

    if (!resume) {
      timer.hours = timer.inputHours
      timer.minutes = timer.inputMinutes
      timer.seconds = timer.inputSeconds
    }

    const tick = () => {
      if (timer.seconds === 0) {
        if (timer.minutes > 0) {
          timer.minutes--
          timer.seconds = 59
        } else if (timer.hours > 0) {
          timer.hours--
          timer.minutes = 59
          timer.seconds = 59
        } else {
          if (timer.intervalId) clearInterval(timer.intervalId)
          timer.intervalId = null
          currentTimerIndex.value++

          if (currentTimerIndex.value < activeTimers.value.length) {
            startTimer(currentTimerIndex.value)
          } else {
            notify('Chain finished!', 'success')
            stopAllTimers()
            currentTimerIndex.value = 0
          }
          return true
        }
      } else {
        timer.seconds--
      }
      return false
    }

    if (!tick()) {
      timer.intervalId = setInterval(tick, 1000)
    }
  }

  function toggleChain() {
    if (isChainActive.value && !isPaused.value) {
      const timer = activeTimers.value[currentTimerIndex.value]
      if (timer.intervalId) {
        clearInterval(timer.intervalId)
        timer.intervalId = null
      }
      isPaused.value = true
    } else if (isPaused.value) {
      isPaused.value = false
      startTimer(currentTimerIndex.value, true)
    } else {
      isChainActive.value = true
      isPaused.value = false
      currentTimerIndex.value = 0
      startTimer(0)
    }
  }

  function stopChain() {
    stopAllTimers()
    currentTimerIndex.value = 0
  }

  function addTimer() {
    const last = activeTimers.value[activeTimers.value.length - 1]
    activeTimers.value.push({
      name: `Timer ${activeTimers.value.length + 1}`,
      label: '',
      hours: last.inputHours,
      minutes: last.inputMinutes,
      seconds: last.inputSeconds,
      inputHours: last.inputHours,
      inputMinutes: last.inputMinutes,
      inputSeconds: last.inputSeconds,
      intervalId: null
    })
  }

  function removeTimer(index: number) {
    if (activeTimers.value.length > 1) {
      const timer = activeTimers.value[index]
      timer.isExploding = true
      setTimeout(() => {
        activeTimers.value.splice(index, 1)
      }, 800)
    }
  }

  function createNewChain() {
    stopAllTimers()
    currentChainName.value = ''
    activeTimers.value = [
      {
        name: 'Timer 1',
        label: '',
        hours: 0,
        minutes: 0,
        seconds: 0,
        inputHours: 0,
        inputMinutes: 0,
        inputSeconds: 0,
        intervalId: null
      }
    ]
    currentTimerIndex.value = 0
    currentChainId.value = null
    showSavedChains.value = false
  }

  async function fetchChains() {
    if (!authStore.user) return
    loading.value = true
    const { data, error } = await supabase
      .from('timer_chains')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching chains:', error)
    } else {
      chains.value = data || []
    }
    loading.value = false
  }

  async function saveChain() {
    if (!authStore.user || !currentChainName.value) return
    loading.value = true

    const payload: any = {
      name: currentChainName.value,
      timers: activeTimers.value.map((t) => ({
        name: t.name,
        label: t.label,
        inputHours: t.inputHours,
        inputMinutes: t.inputMinutes,
        inputSeconds: t.inputSeconds
      })),
      user_id: authStore.user.id
    }

    if (currentChainId.value) {
      payload.id = currentChainId.value
    }

    const { data, error } = await supabase.from('timer_chains').upsert(payload).select()

    if (error) {
      console.error('Error saving chain:', error)
    } else if (data) {
      const savedChain = data[0]
      const index = chains.value.findIndex((c) => c.id === savedChain.id)
      if (index !== -1) {
        chains.value[index] = savedChain
      } else {
        chains.value = [savedChain, ...chains.value]
      }
      currentChainId.value = savedChain.id
    }
    loading.value = false
    return { data, error }
  }

  async function deleteChain(id: string) {
    if (!authStore.user) return
    loading.value = true
    const { error } = await supabase.from('timer_chains').delete().eq('id', id)

    if (error) {
      console.error('Error deleting chain:', error)
    } else {
      chains.value = chains.value.filter((c) => c.id !== id)
      if (currentChainId.value === id) {
        currentChainId.value = null
      }
    }
    loading.value = false
  }

  const showSavedChains = ref(false)

  // Toast system
  const toast = ref<{ message: string; show: boolean; type: 'success' | 'error' }>({
    message: '',
    show: false,
    type: 'success'
  })

  function notify(message: string, type: 'success' | 'error' = 'success') {
    toast.value = { message, show: true, type }
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  function loadChain(chain: any) {
    currentChainId.value = chain.id
    activeTimers.value = chain.timers.map((timer: any) => ({
      ...timer,
      seconds: timer.inputSeconds,
      minutes: timer.inputMinutes,
      hours: timer.inputHours,
      intervalId: null
    }))
    currentChainName.value = chain.name
    showSavedChains.value = false
  }

  return {
    chains,
    loading,
    showSavedChains,
    toast,
    currentChainId,
    currentChainName,
    activeTimers,
    isChainActive,
    isPaused,
    currentTimerIndex,
    fetchChains,
    saveChain,
    deleteChain,
    notify,
    toggleChain,
    stopChain,
    addTimer,
    removeTimer,
    createNewChain,
    stopAllTimers,
    loadChain
  }
})
