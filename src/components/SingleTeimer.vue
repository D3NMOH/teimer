<script setup lang="ts">
import CircleProgress from './CircleGraph.vue'
import { FaPlay, FaStop } from '@kalimahapps/vue-icons'
</script>

<template>
  <div class="timer">
    <p class="time" v-if="isTimerRunning === true">{{ formattedTime }}</p>
    <div class="buttons">
      <div v-if="isTimerRunning === false" class="button" @click="startTimer">
        <FaPlay class="icon" />
      </div>
      <div v-if="isTimerRunning === true" class="button" @click="stopTimer">
        <FaStop />
      </div>
    </div>
    <br />
    <div v-if="isTimerRunning === false" class="timerFields">
      <div>
        <p class="timeTitle">Hours</p>
        <input v-model.number="inputHours" placeholder="hours" type="number" />
      </div>
      <span class="colon">:</span>
      <div>
        <p class="timeTitle">Minutes</p>
        <input inactive v-model.number="inputMinutes" placeholder="minutes" type="number" />
      </div>
      <span class="colon">:</span>
      <div>
        <p class="timeTitle">Seconds</p>
        <input v-model.number="inputSeconds" placeholder="seconds" type="number" />
      </div>
    </div>
    <br />
    <!-- <VueTimepicker drop-direction="auto" format="hh:mm:ss" class="timepicker"> </VueTimepicker> -->
    <CircleProgress
      :initialHours="inputHours"
      :initialMinutes="inputMinutes"
      :initialSeconds="inputSeconds"
      :hours="hours"
      :minutes="minutes"
      :seconds="seconds"
    />
  </div>
</template>

<script lang="ts">
interface Timer {
  seconds: number
  minutes: number
  hours: number
  intervalId: number | null | undefined
  inputHours: number
  inputMinutes: number
  inputSeconds: number
  isTimerRunning: boolean
}
export default {
  data(): Timer {
    return {
      seconds: 0,
      minutes: 0,
      hours: 0,
      intervalId: undefined,
      inputHours: 0,
      inputMinutes: 0,
      inputSeconds: 0,
      isTimerRunning: false
    }
  },
  computed: {
    formattedTime() {
      const formattedHours = this.hours.toString().padStart(2, '0')
      const formattedMinutes = this.minutes.toString().padStart(2, '0')
      const formattedSeconds = this.seconds.toString().padStart(2, '0')
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
  },
  watch: {
    inputHours(newHours) {
      this.hours = newHours
    },
    inputMinutes(newMinutes) {
      this.minutes = newMinutes
    },
    inputSeconds(newSeconds) {
      this.seconds = newSeconds
    }
  },
  methods: {
    startTimer() {
      if (!this.intervalId) {
        this.isTimerRunning = true
        this.seconds = this.inputSeconds
        this.minutes = this.inputMinutes
        this.hours = this.inputHours
        this.intervalId = setInterval(() => {
          if (this.seconds === 0 && this.minutes === 0 && this.hours === 0) {
            if (this.intervalId !== null && this.intervalId !== undefined) {
              clearInterval(this.intervalId)
            }
            this.intervalId = undefined
            alert('Time is up!')
          } else {
            if (this.seconds === 0) {
              if (this.minutes > 0) {
                this.minutes--
                this.seconds = 59
              } else {
                this.hours--
                this.minutes = 59
                this.seconds = 59
              }
            } else {
              this.seconds--
            }
          }
        }, 1000)
      }
    },
    stopTimer() {
      if (this.intervalId !== null && this.intervalId !== undefined) {
        clearInterval(this.intervalId)
      }
      this.intervalId = null
      this.isTimerRunning = false
    }
  },
  beforeUnmount() {
    this.stopTimer()
    this.isTimerRunning = false
    if (this.intervalId !== null && this.intervalId !== undefined) {
      clearInterval(this.intervalId)
    }
    this.intervalId = null
  }
}
</script>

<style scoped>
.timepicker {
  height: 50px;
  overflow-y: scroll;
  display: grid;
  place-items: center;
  scrollbar-width: none;
  &:focus {
    height: 250px;
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
  color: var(--main);
  text-align: center;
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
.colon {
  color: var(--main);
  font-weight: 900;
  text-shadow: #00000077 1px 1px 2px;
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
  width: 100px;
  height: 50px;
  margin-top: 0;
  font-size: 30px;
  border-radius: 50%;
  background-color: var(--main);
  transition: all 0.2s;
  border: none;
  color: #fff;
  text-shadow: #00000077 1px 1px 1px;
  border-radius: 14px;
  z-index: 999;
  &:hover {
    filter: brightness(0.9);
    box-shadow: 0 5px 15px 0 #00000094;
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
  filter: drop-shadow(#00000077 1px 1px 1px);
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
  text-align: center;
  color: #fff;
  font-weight: 900;
  transition: all 0.3s;
  text-shadow: #00000077 1px 1px 1px;
  &:focus {
    outline: none;
    filter: drop-shadow(0px 2px 4px 00000077);
  }
}
.timeTitle {
  font-size: 13px;
  text-align: center;
}

@media (min-width: 1024px) {
  .timepicker {
    height: 50px;
    overflow-y: scroll;
    display: grid;
    place-items: center;
    scrollbar-width: none;
    &:focus {
      height: 250px;
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
    transition: all 0.2s;
    border: none;
  }
  .icon {
    width: 30px;
    height: 30px;
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
    font-weight: 900;
    transition: all 0.3s;
  }
  .timeTitle {
    font-size: 13px;
    text-align: center;
  }
}
@media (prefers-color-scheme: dark) {
  .button {
    color: #000;
  }
  .icon {
    color: #000;
  }
  input {
    color: #000;
  }
}
</style>
