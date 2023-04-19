<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <!-- <wconsole></wconsole> -->
    <m-router>
      <router-view></router-view>
    </m-router>
  </div>
</template>

<script>
// import wconsole from '@/components/wconsole/wconsole.vue'
export default {
  name: 'App',
  components: {
    // wconsole
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
  margin-top: 60px;
  overflow-y: scroll;
}
#app>div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: pink;
}
</style>
