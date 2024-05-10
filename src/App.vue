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
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  margin-top: -30px;
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
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  border-image: linear-gradient(to right, transparent, #ff6565, #ff6565, #ff6565, transparent) 1;
}

nav a.router-link-exact-active {
  border-radius: 14px 14px 0 0;
  color: var(--color-text);
  font-weight: 600;
  width: max-content;
  text-shadow: #00000088 0px 5px 25px;
  border: #ff6565 1px solid;
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
}

.main {
  * {
    justify-self: center;
    margin: 0;
  }
}

@media (min-width: 1024px) {
  .container {
    flex-direction: row;
    justify-content: left;
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
    max-width: 270px !important;
    min-width: 270px !important;
    font-size: 12px;
    text-align: left;
    justify-content: center;
    border-radius: 20px;
    overflow: hidden;
    border-right: 2px solid;
    border-image: linear-gradient(to bottom, transparent, #ff6565, #ff6565, #ff6565, transparent) 1;
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
    border: #ff6565 1px solid;
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
    height: 700px;
    width: 600px;
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
      background: linear-gradient(#444, #333);
      filter: drop-shadow(#000 0 10px 40px);
    }
  }
}
</style>
