<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { McPalette2Fill } from '@kalimahapps/vue-icons'
</script>

<template>
  <button class="changeColor" @click="changeWholeColorTheme">
    <McPalette2Fill />
  </button>
  <div class="logo">
    <h1 class="logoText">T<span class="logoTextAccent">e</span>imer</h1>
  </div>
  <div class="container">
    <!--header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/teimer">Single Teimer</RouterLink>
          <RouterLink to="/teimer-chain">Teimer Chain</RouterLink>
        </nav>
      </div>
    </header -->

    <RouterView class="main" />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      colors: [
        // mint
        { primary: '#1de9b6', secondary: '#00bfa5', tertiary: '#00695c' },
        // red
        { primary: '#ff6565', secondary: '#ff5050', tertiary: '#7a0000' },
        // yellow
        { primary: '#ffcc00', secondary: '#ff9900', tertiary: '#7a5c00' },
        // blue
        { primary: '#2196f3', secondary: '#1976d2', tertiary: '#0d47a1' },
        // green
        { primary: '#00c853', secondary: '#009624', tertiary: '#003d00' },
        // purple
        { primary: '#ab47bc', secondary: '#8e24aa', tertiary: '#4a148c' },
        // orange
        { primary: '#ffab00', secondary: '#ff6d00', tertiary: '#7a1b00' }
      ]
    }
  },
  methods: {
    // get next color palette
    getNextColor() {
      return this.colors.push(this.colors.shift())
    },
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },
    changeWholeColorTheme() {
      document.documentElement.style.setProperty('--main', this.getRandomColor().primary)
    },
    changeColor() {
      document.documentElement.style.setProperty('--main', this.getRandomColor().primary)
    }
  },
  mounted() {
    document.documentElement.style.setProperty('--main', this.getRandomColor().primary)
  },
  watch: {
    isAnyTimerRunning() {
      if (!this.isAnyTimerRunning) {
        document.documentElement.style.setProperty('--main', this.getRandomColor().primary)
      }
    }
  }
}
</script>

<style scoped>
.changeColor {
  background-color: transparent;
  z-index: 99;
  position: fixed;
  top: 10px;
  right: 10px;
  color: var(--main);
  font-size: 35px;
  border: none;
  transition: all 0.3s;
  &:hover {
    scale: 1.1;
    transition: all 0.3s;
  }
  &:active {
    scale: 0.9;
    transition: all 0.3s;
  }
}
header {
  line-height: 1.5;
  max-height: 100vh;
}
.main {
  width: 100%;
  height: 100%;
}
.logo {
  user-select: none;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  z-index: 999;
}
.logoText {
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 3px;
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(to bottom, #555 40%, #000 70%);
}
.logoTextAccent {
  display: inline-block;
  background-clip: text;
  background-image: linear-gradient(to bottom, #fff 45%, #eee 60%, #ddd 100%);
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 0px;
  -webkit-text-stroke-color: black;
  font-weight: 900;
  rotate: -25deg;
  margin-right: -8px;
  margin-left: -20px;
  filter: drop-shadow(0 0 3px #000);
}
.container {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
nav {
  display: flex;
  width: 100vw;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  text-wrap: nowrap;
  border-bottom: 2px solid;
  margin-bottom: 10px;
  border-image: linear-gradient(
      to right,
      transparent,
      var(--main),
      var(--main),
      var(--main),
      transparent
    )
    1;
}

nav a.router-link-exact-active {
  border-radius: 14px 14px 0 0;
  color: var(--color-text);
  font-weight: 600;
  width: max-content;
  text-shadow: #00000088 0px 5px 25px;
  border: var(--main) 1px solid;
  border-bottom: none;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  border-radius: 14px 14px 0 0;
  text-align: center;
  display: flex;
  display: inline-block;
  padding: 7px;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.main {
  * {
    justify-self: center;
    margin: 0;
  }
}

@media (min-width: 1024px) {
  .container {
    position: absolute;
    flex-direction: row;
    justify-content: center;
    min-height: 300px;
    border-radius: 28px;
    background-color: #eee;
    box-shadow: 0 10px 50px #00000055;
    gap: 20px;
    overflow: hidden;
    inset: 100px 40px 40px 40px;
  }
  header {
    display: flex;
    place-items: center;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 700px;
    width: 270px !important;
    max-width: 270px !important;
    min-width: 270px !important;
    font-size: 12px;
    text-align: left;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    border-right: 2px solid;
    border-image: linear-gradient(
        to bottom,
        transparent,
        var(--main),
        var(--main),
        var(--main),
        transparent
      )
      1;
  }
  nav a {
    align-self: flex-start;
    text-align: left;
    font-size: 30px;
    margin-right: 0;
    padding-left: 20px;
    border-radius: 14px 0 0 14px;
    width: 270px !important;
  }
  nav a.router-link-exact-active {
    border-radius: 14px 0 0 14px;
    z-index: 99999;
    border: var(--main) 1px solid;
    border-right: none;
    margin: 0;
    padding-right: 50px;
  }
  .main {
    display: flex;
    justify-content: center !important;
    align-items: center !important;
    flex-direction: column;
    padding: 0;
    border-radius: 20px;
    height: 100%;
    width: 100%;
  }
}
@media (prefers-color-scheme: dark) {
  .logoText {
    color: transparent;
    background-clip: text;
    background-image: linear-gradient(to bottom, #fff 40%, #aaa 70%);
    /* filter: drop-shadow(0 3px 10px #0000007c); */
  }
  .logoTextAccent {
    background-clip: text;
    background-image: linear-gradient(to bottom, #555 40%, #000 70%);
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke-width: 0px;
    -webkit-text-stroke-color: black;
    filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff);
  }
  @media (min-width: 1024px) {
    .container {
      background-color: #333;
      filter: drop-shadow(#000 0 10px 40px);
    }
  }
}
</style>
