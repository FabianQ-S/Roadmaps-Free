<script setup>
import RoadmapView from './components/RoadmapView.vue'
</script>

<template>
  <div id="app-container">
    <RoadmapView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #1a1a2e;
  color: #f8f8f2;
  overflow-x: hidden;
  line-height: 1.6;
  position: relative;
}

#app {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  box-sizing: border-box;
}

#app-container {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;
}

/* Asegurar que todos los elementos hijos respeten el contenedor */
#app-container *,
#app * {
  max-width: 100%;
  box-sizing: border-box;
}

/* Reset de estilos por defecto que pueden causar problemas */
a, button, input, textarea, select {
  box-sizing: border-box;
}
</style>
