<template>
  <div>
    <v-app-bar
      color="secondary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-btn icon @click="redirect('/accueil')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title>Gestion des horaires annuels</v-toolbar-title>

      <v-spacer></v-spacer>
      <ThemeChangerMenu/>
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
          active-class="primary--text text--accent-4"
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
import ThemeChangerMenu from "./ThemeChangerMenu";
export default {
  name: "NavBar",
  components: {ThemeChangerMenu},
  data: () => ({
    drawer: false,
    group: null,
    subMenu: [
      {text: "Bilan",icon:"account_balance_wallet", path: "/bilan"},
      {text: "Enseignants",icon:"person", path: "/enseignants"},
      {text: "Projets",icon:"folder", path: "/projets"},
      {text: "Statuts",icon:"grade", path: "/statuts"},
      {text: "Volumes globaux",icon: "pie_chart", path: "/volumes-globaux"},//

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