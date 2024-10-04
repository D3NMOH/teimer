<script setup lang="ts">
import CircleProgress from './ChainCircle.vue'
import SingleTeimer from './SingleTeimer.vue'
import { FaPlay, FaStop, FaTrashCan, GlTimeOut, BxPlusMedical } from '@kalimahapps/vue-icons'
</script>

<template>
  <div class="chainContainer">
    <div class="timerList">
      <SingleTeimer v-if="timers.length === 1" />
      <div
        v-else
        v-for="(timer, index) in timers"
        :key="index"
        class="timer"
        :id="'timer-' + (index + 1)"
      >
        <p class="number">
          {{ index + 1 }}
        </p>
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
      <button v-if="timers.length > 1" class="button playButton" @click="toggleTimer">
        <FaPlay v-if="!isAnyTimerRunning" />
        <FaStop v-if="isAnyTimerRunning" />
      </button>
      <button
        v-if="timers.length > 1"
        class="button resetButton"
        @click="resetTimers"
        :disabled="isAnyTimerRunning"
      >
        <GlTimeOut />
      </button>
      <div v-if="timers.length > 1" class="timerNav">
        <div class="shadowOver"></div>
        <div
          style="
            height: 100%;
            overflow-y: scroll;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 70px;
            z-index: 9;
          "
        >
          <a
            v-for="(timer, index) in timers"
            :key="index"
            class="timerNavButton"
            :href="'#timer-' + (index + 1)"
            >{{ index + 1 }}</a
          >
        </div>
      </div>
      <button class="button addTimerButton" @click="addTimer" :disabled="isAnyTimerRunning">
        <BxPlusMedical />
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
  data(): {
    timers: Timer[]
    isAnyTimerRunning: boolean
    currentTimerIndex: number
  } {
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: auto;
  gap: 5px;
}
.timerList:before {
  background: linear-gradient(#eee, var(--color-background), transparent);
  height: 130px;
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9;
}
.timerList {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
  padding: 120px 0 65px 0;
  overflow-y: scroll;
  scrollbar-width: none;
}
.timerList:after {
  background: linear-gradient(transparent, var(--color-background), #eee);
  height: 70px;
  content: '';
  position: fixed;
  bottom: -2px;
  left: 0;
  width: 100%;
  z-index: 9;
}

.timer {
  position: relative;
  width: 95vw;
  max-width: 430px;
  display: flex;
  height: 75px;
  place-self: center;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  justify-content: space-between;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid var(--main);
  color: var(--main);
  padding-left: 0;
  padding-right: 60px;
  &:hover {
    /*    box-shadow: 0 5px 20px #00000077; */
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
.number {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 45px;
  height: 100%;
  background-color: var(--main);
  font-size: 30px;
  color: #fff;
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
  width: 45px;
  height: 100%;
  font-size: 30px;
  background-color: var(--main);
  transition: all 0.2s;
  border: none;
  color: #fff;
  right: 0;
  * {
  }
  &:hover {
    background-color: #232323;
    box-shadow: 0 5px 15px 0 #00000094;
    color: #fff;
  }
  &:active {
    background-color: black;
    box-shadow: 0 2px 4px 0 #000;
    color: #fff;
  }
}
.buttons {
  height: max-content;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 999;
}
.button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  transition: all 0.3s;
  border: none;
  padding: 10px;
  height: 50px;
  width: 50px;
  background-color: transparent;
  color: var(--main);
  /*  text-shadow: #000000 0px 0px 2px; */
  &:hover {
    scale: 1.2;
  }
  &:active {
    scale: 0.9;
  }
}
.playButton {
}
.resetButton {
  font-weight: 900;
}

.timerNav {
  display: none;
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
  background-color: transparent;
  color: var(--main);
  font-weight: 900;
  transition: all 0.3s;
  &:focus {
    outline: none;
  }
}
.circle {
  width: 70px;
  max-width: 70px;
  height: 70px;
  max-height: 70px;
  overflow: hidden;
}
@media screen and (min-width: 1024px) {
  .chainContainer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    top: unset;
    padding-bottom: unset;
    align-items: unset;
    justify-content: unset;
    margin: unset;
    gap: unset;
  }

  .timerList:before {
    background: linear-gradient(#eee, transparent);
    height: 70px;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
  }
  .timerList {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: center;
    padding: 70px;
    gap: 5px;
    overflow-y: scroll;
    scrollbar-width: none;
  }
  .timerList:after {
    background: linear-gradient(transparent, #eee);
    height: 70px;
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9;
  }
  .timer {
    position: relative;
    justify-self: flex-start;
    align-self: flex-start;
    width: stretch;
    display: flex;
    height: 100px;
    flex-direction: row;
    align-items: center;
    padding-right: 80px;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s;
    border: 1px solid var(--main);
    &:hover {
      /* box-shadow: 0 5px 20px #000; */
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
    width: 50px;
    height: 100%;
    font-size: 30px;
    background-color: var(--main);
    border: none;
    color: #fff;
    transition: all 0.2s;
    * {
    }
    &:hover {
      background-color: #232323;
    }
    &:active {
      background-color: #000;
    }
  }
  .playButton {
    z-index: 999 !important;
  }
  .addTimerButton {
    font-weight: 900;
  }
  .resetButton {
    display: flex;
    justify-content: center;
    font-size: 45px;
    font-weight: 900;
  }
  .buttons {
    position: absolute;
    height: 100%;
    left: unset;
    right: 0;
    top: 0;
    bottom: 0;
    width: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    scrollbar-width: none;
  }
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    font-size: 30px;
    background-color: transparent;
    transition: all 0.2s;
    border: none;
    color: var(--main);
    /* text-shadow: #000000 0px 0px 2px;*/
    z-index: 999;
    &:hover {
    }
    &:active {
    }
  }

  .shadowOver {
    position: absolute;
    top: -1px;
    bottom: 0;
    right: 0;
    width: 70px;
    z-index: 9999;
    pointer-events: none;
    background:
      -webkit-linear-gradient(to bottom, #eee, transparent 50px, transparent),
      -webkit-linear-gradient(to top, #eee, transparent 50px, transparent);
    background: linear-gradient(to bottom, #eee, transparent 50px, transparent),
      linear-gradient(to top, #eee, transparent 50px, transparent);
  }
  .timerNav {
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;
    width: 70px;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 20px;
  }

  .timerNavButton {
    width: 70px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    border-radius: 14px 0 0 14px;
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
    color: var(--main);
    text-align: center;

    font-weight: 900;
    /* text-shadow: #000000 0px 0px 2px;*/
    transition: all 0.3s;
    &:focus {
      outline: none;
      /* filter: drop-shadow(0px 2px 4px #000); */
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
  .timerList:before {
    background: linear-gradient(#333, transparent);
  }
  .timerList:after {
    background: linear-gradient(transparent, #333);
  }
  .shadowOver {
    background:
      -webkit-linear-gradient(to bottom, #333, transparent 50px, transparent),
      -webkit-linear-gradient(to top, #333, transparent 50px, transparent);
    background: linear-gradient(to bottom, #333, transparent 50px, transparent),
      linear-gradient(to top, #333, transparent 50px, transparent);
  }
  input {
    color: var(--main);
  }
  .icon {
    color: #000;
  }
  .button {
  }
  .number {
    color: #000;
  }
  .remove {
    color: #000;
  }
}
</style>
