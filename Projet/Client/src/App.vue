<template>
  <div id="app">
    <v-app>
      <NavBar v-if="this.$route.name !== 'Connexion' && this.$route.name !== 'Inscription' && this.$route.name !== '404 Page introuvable'"/>
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
  components: {NavBar},
  computed: {
    theme() {
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
  background: #eef0f4 !important;
}

.theme--dark.v-application {
  background: #202020 !important;
}

.v-card-title, .v-card__title {
  word-break: keep-all !important;
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