<script setup lang="ts">
import CircleProgress from './ChainCircle.vue'
import { FaPlay, FaStop, FaTrashCan, GlTimeOut, BxPlusMedical } from '@kalimahapps/vue-icons'
</script>

<template>
  <div class="chainContainer">
    <div class="timerList">
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
            <span>:</span>
            <div>
              <!-- <p class="timeTitle">Minutes</p> -->
              <input
                v-model.number="timer.inputMinutes"
                placeholder="minutes"
                type="number"
                :disabled="isAnyTimerRunning"
              />
            </div>
            <span>:</span>
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
          <CircleProgress
            :initialSeconds="parseInt(initialCircle[index])"
            :seconds="parseInt(computedCircle[index])"
            class="circle"
          />
        </div>
        <button class="remove" @click="removeTimer(index)" :disabled="isAnyTimerRunning">
          <FaTrashCan />
        </button>
      </div>
    </div>
    <div class="buttons">
      <button class="button playButton" @click="toggleTimer">
        <FaPlay v-if="!isAnyTimerRunning" style="filter: drop-shadow(#00000077 1px 1px 1px)" />
        <FaStop v-if="isAnyTimerRunning" style="filter: drop-shadow(#00000077 1px 1px 1px)" />
      </button>
      <button class="button resetButton" @click="resetTimers" :disabled="isAnyTimerRunning">
        <GlTimeOut style="filter: drop-shadow(#00000077 1px 1px 1px)" />
      </button>
      <button class="button addTimerButton" @click="addTimer" :disabled="isAnyTimerRunning">
        <BxPlusMedical style="filter: drop-shadow(#00000077 1px 1px 1px)" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
interface Timer {
  name: string
  seconds: number
  minutes: number
  hours: number
  intervalId: number | null | undefined
  inputHours: number
  inputMinutes: number
  inputSeconds: number
}
export default {
  data(): { timers: Timer[]; isAnyTimerRunning: boolean; currentTimerIndex: number } {
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
    startTimer(index: number) {
      const timer = this.timers[index]
      if (!timer.intervalId) {
        const totalSeconds = timer.inputHours * 3600 + timer.inputMinutes * 60 + timer.inputSeconds
        timer.seconds = totalSeconds % 60
        timer.minutes = Math.floor((totalSeconds / 60) % 60)
        timer.hours = Math.floor(totalSeconds / 3600)
        timer.intervalId = setInterval(() => {
          if (timer.seconds === 0 && timer.minutes === 0 && timer.hours === 0) {
            if (timer.intervalId !== null && timer.intervalId !== undefined) {
              clearInterval(timer.intervalId)
            }
            timer.intervalId = undefined
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
        if (timer.intervalId !== null) {
          clearInterval(timer.intervalId)
        }
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
.chainContainer {
  position: absolute;
  top: 50px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: auto;
  gap: 5px;
}
.timerList {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.timer {
  position: relative;
  width: 95vw;
  max-width: 500px;
  display: flex;
  height: 75px;
  place-self: center;
  flex-direction: row;
  align-items: center;
  align-content: space-around;
  justify-content: space-around;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid var(--main);
  color: var(--main);
  text-shadow: #00000077 1px 1px 1px;
  padding-left: 10px;
  padding-right: 60px;
  &:hover {
    box-shadow: 0 5px 20px #000;
  }
  span {
    font-weight: 900;
    padding-bottom: 10px;
  }
}
.timeContainer {
  display: flex;
  align-items: center;
  justify-content: center;
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
  gap: 5px;
  font-size: 50px;
  font-weight: 900;
}
.remove {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  font-size: 30px;
  background-color: var(--main);
  transition: all 0.2s;
  border: none;
  color: #fff;
  right: 0;
  * {
    filter: drop-shadow(#00000077 1px 1px 1px);
  }
  &:hover {
    filter: brightness(0.9);
    box-shadow: 0 5px 15px 0 #00000094;
  }
  &:active {
    filter: brightness(0.8);
    box-shadow: 0 2px 4px 0 #000;
  }
}
.buttons {
  box-shadow: 5px 5px 30px #000;
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  place-self: center;
  right: 0;
  bottom: 0;
  border-top-left-radius: 14px;
  background-color: var(--main);
}
.button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  background-color: var(--main);
  transition: all 0.3s;
  border: none;
  color: #fff;
  padding: 10px;
  height: 50px;
  width: 50px;
  text-shadow: #00000077 1px 1px 1px;
  &:hover {
    z-index: 999;
    filter: brightness(0.9);
    box-shadow: 0 0px 15px 0 #00000094;
  }
  &:active {
    filter: brightness(0.8);
    box-shadow: 0 0px 4px 0 #000;
  }
}
.playButton {
}
.addTimerButton {
  font-weight: 900;
}
.resetButton {
  font-weight: 900;
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
  width: 45px;
  height: 45px;
  border-radius: 14px;
  border: none;
  text-align: center;
  background-color: var(--main);
  color: #000000;
  text-align: center;
  color: #fff;
  font-weight: 900;
  transition: all 0.3s;
  text-shadow: #00000077 1px 1px 1px;
  &:focus {
    outline: none;
    filter: drop-shadow(0px 2px 4px #000);
  }
}
.circle {
  width: 70px;
  height: 70px;
}
@media screen and (min-width: 1024px) {
  .chainContainer {
    position: relative;
    top: unset;
    padding-bottom: unset;
    align-items: unset;
    justify-content: unset;
    margin: unset;
    gap: unset;
  }
  .timerList {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: auto;
    gap: 5px;
    padding-bottom: 0px;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .timer {
    position: relative;
    justify-self: flex-start;
    align-self: flex-start;
    width: 90%;
    display: flex;
    height: 120px;
    min-height: 120px;
    flex-direction: row;
    align-items: center;
    margin: auto;
    gap: 20px;
    padding-right: 80px;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s;
    border: 1px solid var(--main);
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
    background-color: var(--main);
    transition: all 0.2s;
    border: none;
    color: #fff;
    margin-right: 0;
    margin-left: auto;
    * {
      filter: drop-shadow(#00000077 1px 1px 1px);
    }
    &:hover {
      filter: brightness(0.9);
      box-shadow: 0 5px 15px 0 #00000094;
    }
    &:active {
      filter: brightness(0.8);
      box-shadow: 0 2px 4px 0 #000;
    }
  }
  .playButton {
    position: fixed;
    top: -10px;
    right: -10px;
    border-radius: 0 20px 0 50% !important;
    z-index: 999 !important;
  }
  .addTimerButton {
    position: fixed;
    bottom: -10px;
    right: -10px;
    border-radius: 50% 0 20px 0 !important;
    font-size: 40px !important;
    font-weight: 900;
  }
  .resetButton {
    height: 120px !important;
    position: fixed;
    padding-bottom: 15px;
    top: -10px;
    right: -10px;
    border-radius: 0 20px 0 35px !important;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: end !important;
    font-size: 45px;
    font-weight: 900;
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
    background-color: var(--main);
    transition: all 0.2s;
    border: none;
    color: #fff;
    text-shadow: #00000077 1px 1px 1px;
    &:hover {
      filter: brightness(0.9);
      box-shadow: 0 5px 15px 0 #00000094;
      z-index: 0;
    }
    &:active {
      filter: brightness(0.8);
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
    background-color: var(--main);
    color: #000000;
    text-align: center;
    color: #fff;
    font-weight: 900;
    transition: all 0.3s;
    text-shadow: #00000077 1px 1px 1px;
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
}
@media (prefers-color-scheme: dark) {
  input {
    color: #000;
  }
  .icon {
    color: #000;
  }
  .button {
    color: #000;
  }
  .remove {
    color: #000;
  }
}
</style>
