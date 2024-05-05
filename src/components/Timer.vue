<script setup lang="ts">
import Circle from './Circle.vue'
import { IoStop } from 'oh-vue-icons/icons'
import { IoPlay } from 'oh-vue-icons/icons'
</script>

<template>
  <div class="timer">
    <p>Timer</p>
    <p class="time">{{ formattedTime }}</p>
    <div class="buttons">
      <div class="button" @click="startTimer">
        <IoPlay />
      </div>
      <div class="button" @click="stopTimer">
        <IoStop />
      </div>
    </div>
    <br />
    <div class="timerFields">
      <p>Hours</p>
      <input v-model.number="inputHours" placeholder="hours" type="number" />
      <p>Minutes</p>
      <input v-model.number="inputMinutes" placeholder="minutes" type="number" />
      <p>Seconds</p>
      <input v-model.number="inputSeconds" placeholder="seconds" type="number" />
    </div>
    <br />
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
      inputSeconds: 0
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
    }
  },
  beforeUnmount() {
    this.stopTimer()
  }
}
</script>

<style scoped>
.timer {
  display: flex;
  flex-direction: column;
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
  gap: 10px;
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
  width: 60px;
  height: 60px;
  font-size: 30px;
  margin: 10px;
  border-radius: 7px;
  background-color: #ff6565;
  transition: all 0.3s ease;
  &:hover {
    background-color: #ff000084;
  }
  &:active {
    background-color: #ff000033;
  }
}
.icon {
  width: 30px;
  height: 30px;
  color: #ff0000;
}
</style>
