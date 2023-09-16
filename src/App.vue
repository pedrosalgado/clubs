<template>
  <div id="app">
    <ClubRatings />
  </div>
</template>

<script>
import ClubRatings from './components/ClubRatings.vue'

export default {
  name: 'App',
  components: {
    ClubRatings
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fff;
  margin-top: 60px;
}
</style>
