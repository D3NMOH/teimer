<template>
  <div class="progress-circle" :style="circleStyle"></div>
</template>

<script>
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
        background: `conic-gradient(#f00 ${this.remainingPercentage}%, #fff ${this.remainingPercentage}% 100%)`
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
    // Вызываем метод updateTotalTime() при монтировании компонента
    this.updateTotalTime()
  }
}
</script>

<style scoped>
.progress-circle {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  &:hover {
    filter: invert(100%) hue-rotate(180deg) drop-shadow(0 0 10px #000);
  }
  &:active {
    scale: 0.99;
    filter: drop-shadow(0 0 2px #000);
  }
}
</style>
