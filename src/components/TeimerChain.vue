<script setup lang="ts">
import Circle from './ChainCircle.vue'
import { FaPlay, FaStop, FaTrashCan } from '@kalimahapps/vue-icons'
</script>

<template>
  <div
    style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      margin: auto;
      gap: 10px;
    "
  >
    <div v-for="(timer, index) in timers" :key="index" class="timer">
      <div class="timeContainer">
        <p v-if="isAnyTimerRunning" class="time">{{ formattedTimes[index] }}</p>
        <div v-if="!isAnyTimerRunning" class="timerFields">
          <div>
            <!-- <p class="timeTitle">Hours</p> -->
            <input
              v-model.number="timer.inputHours"
              placeholder="hours"
              type="number"
              :disabled="isAnyTimerRunning"
            />
          </div>
          :
          <div>
            <!-- <p class="timeTitle">Minutes</p> -->
            <input
              v-model.number="timer.inputMinutes"
              placeholder="minutes"
              type="number"
              :disabled="isAnyTimerRunning"
            />
          </div>
          :
          <div>
            <!-- <p class="timeTitle">Seconds</p> -->
            <input
              v-model.number="timer.inputSeconds"
              placeholder="seconds"
              type="number"
              :disabled="isAnyTimerRunning"
            />
          </div>
        </div>
      </div>
      <div class="circleContainer">
        <Circle
          :initialSeconds="initialCircle[index]"
          :seconds="computedCircle[index]"
          class="circle"
        />
      </div>
      <button class="remove" @click="removeTimer(index)" :disabled="isAnyTimerRunning">
        <FaTrashCan />
      </button>
    </div>

    <button
      class="button"
      @click="toggleTimer"
      style="position: fixed; top: -10px; right: -10px; border-radius: 0 20px 0 50%; z-index: 999"
    >
      <FaPlay v-if="!isAnyTimerRunning" style="filter: drop-shadow(#971a1a 1px 1px 1px)" />
      <FaStop v-if="isAnyTimerRunning" style="filter: drop-shadow(#971a1a 1px 1px 1px)" />
    </button>
    <button
      class="button"
      @click="resetTimers"
      :disabled="isAnyTimerRunning"
      style="
        height: 120px;
        position: fixed;
        padding-bottom: 10px;
        top: -10px;
        right: -10px;
        border-radius: 0 20px 0 35px;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: end;
        font-size: 35px;
      "
    >
      x
    </button>

    <button
      class="button"
      style="
        position: fixed;
        bottom: -10px;
        right: -10px;
        border-radius: 50% 0 20px 0;
        font-size: 50px;
      "
      @click="addTimer"
      :disabled="isAnyTimerRunning"
    >
      +
    </button>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      timers: [
        {
          name: 'Timer 1',
          seconds: 0,
          minutes: 0,
          hours: 0,
          intervalId: null,
          inputHours: 0,
          inputMinutes: 0,
          inputSeconds: 0
        }
      ],
      isAnyTimerRunning: false,
      currentTimerIndex: 0
    }
  },
  computed: {
    formattedTimes() {
      return this.timers.map((timer) => {
        const formattedHours = timer.hours.toString().padStart(2, '0')
        const formattedMinutes = timer.minutes.toString().padStart(2, '0')
        const formattedSeconds = timer.seconds.toString().padStart(2, '0')
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      })
    },
    initialCircle() {
      return this.timers.map((timer) => {
        const circleInitialTime =
          timer.inputSeconds + timer.inputMinutes * 60 + timer.inputHours * 3600
        return `${circleInitialTime}`
      })
    },
    computedCircle() {
      return this.timers.map((timer) => {
        const circleTime = timer.seconds + timer.minutes * 60 + timer.hours * 3600
        return `${circleTime}`
      })
    }
  },
  methods: {
    toggleTimer() {
      if (!this.isAnyTimerRunning) {
        this.isAnyTimerRunning = true
        this.startNextTimer()
      } else {
        this.isAnyTimerRunning = false
        this.stopAllTimers()
      }
    },
    startNextTimer() {
      if (this.currentTimerIndex < this.timers.length) {
        this.startTimer(this.currentTimerIndex)
      } else {
        this.currentTimerIndex = 0
        this.startNextTimer()
      }
    },
    startTimer(index) {
      const timer = this.timers[index]
      if (!timer.intervalId) {
        const totalSeconds = timer.inputHours * 3600 + timer.inputMinutes * 60 + timer.inputSeconds
        timer.seconds = totalSeconds % 60
        timer.minutes = Math.floor((totalSeconds / 60) % 60)
        timer.hours = Math.floor(totalSeconds / 3600)
        timer.intervalId = setInterval(() => {
          if (timer.seconds === 0 && timer.minutes === 0 && timer.hours === 0) {
            clearInterval(timer.intervalId)
            timer.intervalId = null
            this.currentTimerIndex++
            if (this.currentTimerIndex === this.timers.length) {
              this.isAnyTimerRunning = false
              this.currentTimerIndex = 0
              alert('All timers have finished!')
              this.stopAllTimers() // Остановка всех таймеров после алерта
            } else {
              this.startNextTimer()
            }
          } else {
            if (timer.seconds === 0) {
              if (timer.minutes > 0) {
                timer.minutes--
                timer.seconds = 59
              } else {
                timer.hours--
                timer.minutes = 59
                timer.seconds = 59
              }
            } else {
              timer.seconds--
            }
          }
        }, 1000)
      }
    },
    stopAllTimers() {
      this.timers.forEach((timer) => {
        clearInterval(timer.intervalId)
        timer.intervalId = null
        timer.seconds = timer.inputSeconds
        timer.minutes = timer.inputMinutes
        timer.hours = timer.inputHours
      })
    },
    resetTimers() {
      this.timers.forEach((timer) => {
        timer.seconds = timer.inputSeconds
        timer.minutes = timer.inputMinutes
        timer.hours = timer.inputHours
      })
      this.isAnyTimerRunning = false
      this.currentTimerIndex = 0
    },
    addTimer() {
      if (!this.isAnyTimerRunning) {
        this.timers.push({
          name: `Timer ${this.timers.length + 1}`,
          seconds: this.timers[0].inputSeconds,
          minutes: this.timers[0].inputMinutes,
          hours: this.timers[0].inputHours,
          intervalId: null,
          inputHours: this.timers[0].inputHours,
          inputMinutes: this.timers[0].inputMinutes,
          inputSeconds: this.timers[0].inputSeconds
        })
      }
    },
    removeTimer(index: number) {
      if (!this.isAnyTimerRunning) {
        this.timers.splice(index, 1)
      }
    }
  },
  beforeUnmount() {
    this.timers.forEach((timer) => {
      if (timer.intervalId) {
        clearInterval(timer.intervalId)
      }
    })
  }
}
</script>

<style scoped>
.timer {
  display: flex;
  height: 120px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: auto;
  gap: 20px;
  padding: 0 0 0 10px;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
  /* box-shadow: 0 2px 5px #000; */
  border: 1px solid #ff6565;
  &:hover {
    box-shadow: 0 5px 20px #000;
  }
}
.timeContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
}
.time {
  font-size: 40px;
  font-weight: 700;
}
.timerFields {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 50px;
  font-weight: 900;
}
.remove {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 100%;
  font-size: 30px;
  background-color: #ff6565;
  transition: all 0.2s;
  border: none;
  color: #fff;
  * {
    filter: drop-shadow(#971a1a 1px 1px 1px);
  }
  &:hover {
    background-color: #ff5050;
    box-shadow: 0 5px 15px 0 #00000094;
  }
  &:active {
    background-color: #7a0000;
    box-shadow: 0 2px 4px 0 #000;
  }
}
.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  font-size: 30px;
  margin: 10px;
  border-radius: 50%;
  background-color: #ff6565;
  transition: all 0.2s;
  border: none;
  color: #fff;
  text-shadow: #971a1a 1px 1px 1px;
  &:hover {
    background-color: #ff5050;
    box-shadow: 0 5px 15px 0 #00000094;
  }
  &:active {
    background-color: #7a0000;
    box-shadow: 0 2px 4px 0 #000;
  }
}
.icon {
  width: 30px;
  height: 30px;
  color: #fff;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  width: 60px;
  height: 60px;
  border-radius: 14px;
  border: none;
  text-align: center;
  background-color: #ff6565;
  color: #000000;
  text-align: center;
  color: #fff;
  font-weight: 900;
  transition: all 0.3s;
  text-shadow: #971a1a 1px 1px 1px;
  &:focus {
    outline: none;
    filter: drop-shadow(0px 2px 4px #000);
  }
}
.timeTitle {
  font-size: 13px;
  text-align: center;
}
.circle {
  width: 100px;
  height: 100px;
}
@media (prefers-color-scheme: dark) {
}
</style>
