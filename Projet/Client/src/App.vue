<template>
  <div id="app">
    <v-app>
      <NavBar></NavBar>
      <v-main>
        <router-view/>
      </v-main>
    </v-app>
  </div>
</template>

<script>

import NavBar from "@/components/NavBar";

export default {
  name: 'App',
  components: {
    NavBar
  },
  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #353535;
}
</style>