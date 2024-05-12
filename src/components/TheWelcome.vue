<script setup lang="ts"></script>

<template>
  <h1 class="welcomeText">Welcome<br />to<br /></h1>
  <h1 class="logoText">T<span class="logoTextAccent">e</span>imer</h1>
</template>

<style scoped>
.welcomeText {
  color: black;
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 3px;
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
template {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}
@media (prefers-color-scheme: dark) {
  .welcomeText {
    color: white;
  }
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
}
</style>
