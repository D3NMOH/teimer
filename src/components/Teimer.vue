<script setup lang="ts">
import Circle from './Circle.vue'
import { FaPlay, FaStop, CoAvTimer } from '@kalimahapps/vue-icons'
import VueTimepicker from 'vue3-timepicker'
import Timeselector from 'vue-timeselector'
</script>

<template>
  <div class="timer">
    <p class="time">{{ formattedTime }}</p>
    <div class="buttons">
      <div
        v-if="isTimerRunning === false"
        class="button"
        style="position: fixed; top: -10px; right: -10px; border-radius: 0 20px 0 50%; z-index: 999"
        @click="startTimer"
      >
        <FaPlay class="icon" style="filter: drop-shadow(#971a1a 1px 1px 1px)" />
      </div>
      <div
        v-if="isTimerRunning === true"
        class="button"
        style="position: fixed; top: -10px; right: -10px; border-radius: 0 20px 0 50%; z-index: 999"
        @click="stopTimer"
      >
        <FaStop />
      </div>
    </div>
    <br />
    <div class="timerFields">
      <div>
        <p class="timeTitle">Hours</p>
        <input v-model.number="inputHours" placeholder="hours" type="number" />
      </div>
      <div>
        <p class="timeTitle">Minutes</p>
        <input inactive v-model.number="inputMinutes" placeholder="minutes" type="number" />
      </div>
      <div>
        <p class="timeTitle">Seconds</p>
        <input v-model.number="inputSeconds" placeholder="seconds" type="number" />
      </div>
    </div>
    <br />
    <!-- <VueTimepicker drop-direction="auto" format="hh:mm:ss" class="timepicker"> </VueTimepicker> -->
    <Circle
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
export default {
  data() {
    return {
      seconds: 0,
      minutes: 0,
      hours: 0,
      intervalId: null,
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
            clearInterval(this.intervalId)
            this.intervalId = null
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
      clearInterval(this.intervalId)
      this.intervalId = null
      this.isTimerRunning = false
    }
  },
  beforeUnmount() {
    this.stopTimer()
    this.isTimerRunning = false
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
@media (prefers-color-scheme: dark) {
}
</style>
