<template>
  <div>
    <v-app-bar elevation="2">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-btn icon @click="redirect('/accueil')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title>Gestion des horaires annuels</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on" @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            <v-icon>{{ $vuetify.theme.dark ? "wb_sunny" : "nightlight_round" }}</v-icon>
          </v-btn>
        </template>
        <span>{{ $vuetify.theme.dark ? "Thème clair" : "Thème sombre" }}</span>
      </v-tooltip>
      <v-btn icon @click="redirect('/mon-compte')">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="menu-title" disabled>
              Menu Principale
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item-group
          v-model="group"
          active-class="primary--text"
        >
          <v-list-item v-for="(t,index) in subMenu" :key="index" @click="redirect(t.path)">
            <v-list-item-icon>
              <v-icon>{{ t.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ t.text }}</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    drawer: false,
    theme: false,
    group: null,
    subMenu: [
      {text: "Enseignants",icon:"person", path: "/enseignants"},
      {text: "Projets",icon:"folder", path: "/projets"},
      {text: "Statuts",icon:"grade", path: "/statuts"},
    ]
  }),
  methods: {
    redirect(path) {
      this.$router.push({path:path}).catch(()=>{});
    },
  }
}
</script>

<style scoped>
  .menu-title {
    line-height: 2rem !important;
    font-size: 1.25rem !important;
    letter-spacing: 0.0125em !important;
  }
</style>