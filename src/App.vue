<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="logo">
    <h1 class="logoText">T<span class="logoTextAccent">e</span>imer</h1>
  </div>
  <div class="container">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/teimer">Single Teimer</RouterLink>
          <RouterLink to="/teimer-chain">Teimer Chain</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView class="main" />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.logo {
  user-select: none;
  position: fixed;
  top: 0;
  left: 20;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
}
.logoText {
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 3px;
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(to bottom, #555 40%, #000 70%);
  /* filter: drop-shadow(0 3px 10px #0000007c); */
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
nav {
  width: max-content;
  font-size: 12px;
  text-align: center;
  position: fixed;
  border-radius: 20px;
  overflow: hidden;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: 600;
  width: 100%;
  text-shadow: #00000088 0px 5px 25px;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: flex;
  font-size: 30px;
  display: inline-block;
  padding: 10px 30px;
  align-items: center;
  justify-content: center;
  border-radius: 10px 0 0 10px;
}

.main {
  margin-top: 50px;
  padding: 20px;
}

@media (min-width: 1024px) {
  .container {
    flex-direction: row;
    justify-content: center;
    width: 100%;
    padding: 40px;
    border-radius: 25px;
    background: linear-gradient(to right bottom, #eee, #efefefef);
    filter: drop-shadow(#00000064 0 10px 40px);
    max-width: 1000px;
    gap: 20px;
    overflow: hidden;
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
    font-size: 12px;
    text-align: left;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    border-right: 2px solid;
    border-image: linear-gradient(to bottom, transparent, #ff6565, #ff6565, #ff6565, transparent) 1;
  }
  nav a.router-link-exact-active {
    margin-right: -2px;
    z-index: 99999;
    border: #ff6565 1px solid;
    border-right: none;
  }
  .main {
    display: flex;
    justify-content: center !important;
    align-items: center !important;
    flex-direction: column;
    margin-top: 0;
    padding: 0;
    border-radius: 20px;
    height: 700px;
    width: 600px;
    overflow-y: scroll;
    scrollbar-width: none;
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
  .container {
    background: linear-gradient(#444, #333);
    filter: drop-shadow(#000 0 10px 40px);
  }
}
</style>
