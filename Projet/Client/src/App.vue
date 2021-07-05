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

import NavBar from "./components/NavBar";

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light';
    }
  }
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.v-btn--addElement {
  bottom: 0;
  right: 0;
  position: fixed;
  margin: 16px;
  z-index: 1000;
}
.animate-pop-in {
  animation: pop-in .3s forwards .15s;
  opacity: 0;
}
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: translateY(-2%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.theme--light.v-application {
  background: #fafafa !important;
}
.v-card {
  border-radius:20px !important;
}
.v-dialog{
  border-radius:20px !important;
}
.v-sheet.v-snack__wrapper{
  border-radius:50px !important;
}
.v-menu__content{
  border-radius:20px !important;
}
.theme--dark.v-application {
  background: #202020 !important;
}
.theme--dark.v-card {
  background: #272727 !important;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background: #272727 !important;
}
.theme--dark.v-data-table {
  background: #272727 !important;
}
.theme--dark.v-data-table.v-data-table--fixed-header thead th {
  background: #202020 !important;
}
</style>