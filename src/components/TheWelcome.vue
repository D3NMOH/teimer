<script setup lang="ts"></script>

<template>
  <h1 class="logoText">
    Welcome<br />to<br />
    T<span class="logoTextAccent">e</span>imer
  </h1>
</template>

<style scoped>
.logoText {
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  color: black;
  letter-spacing: 3px;
  text-wrap: nowrap;
}
.logoTextAccent {
  display: inline-block;
  -webkit-text-fill-color: white;
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
  .logoText {
    color: white;
  }
  .logoTextAccent {
    -webkit-text-fill-color: black;
    -webkit-text-stroke-width: 0px;
    -webkit-text-stroke-color: black;
    filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff);
  }
}
</style>
