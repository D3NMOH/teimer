<script setup lang="ts">
import 'vue3-circle-progress/dist/circle-progress.css'
import CircleProgress from 'vue3-circle-progress'
</script>

<template>
  <CircleProgress
    empty-color="transparent"
    linecap="rect"
    transition="1000"
    :border-width="150"
    :border-bg-width="0"
    :percent="remainingPercentage"
    :is-gradient="true"
    :gradient="{
      angle: 10,
      startColor: '#ff6565',
      stopColor: '#ff4444'
    }"
    :size="300"
    class="progress-circle"
  />
</template>

<script lang="ts">
export default {
  props: {
    initialHours: {
      type: Number,
      default: 0
    },
    initialMinutes: {
      type: Number,
      default: 0
    },
    initialSeconds: {
      type: Number,
      default: 0
    },
    hours: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    },
    seconds: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      totalTime: 0
    }
  },
  computed: {
    remainingTime() {
      return this.hours * 3600 + this.minutes * 60 + this.seconds
    },
    remainingPercentage() {
      return (this.remainingTime / this.totalTime) * 100
    },
    circleStyle() {
      return {
        background: `conic-gradient(#ff6565 ${this.remainingPercentage}%, #00000000 ${this.remainingPercentage}% 100%)`
      }
    }
  },
  watch: {
    // Отслеживаем изменения пропсов и обновляем totalTime
    initialHours() {
      this.updateTotalTime()
    },
    initialMinutes() {
      this.updateTotalTime()
    },
    initialSeconds() {
      this.updateTotalTime()
    }
  },
  methods: {
    updateTotalTime() {
      this.totalTime = this.initialHours * 3600 + this.initialMinutes * 60 + this.initialSeconds
    }
  },
  mounted() {
    this.updateTotalTime()
  }
}
</script>

<style scoped>
.progress-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
