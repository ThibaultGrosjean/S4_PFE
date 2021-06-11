<template>
  <div>
    <v-app-bar
      color="blue"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-btn icon @click="redirect('/accueil')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title>Gestion des horaires annuels</v-toolbar-title>
      <v-spacer></v-spacer>
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
            <v-list-item-title class="title" disabled>
              Menu Principale
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item-group
          v-model="group"
          active-class="blue--text text--accent-4"
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
    group: null,
    subMenu: [
      {text: "Bilan",icon:"account_balance_wallet", path: "/bilan"},
      {text: "Enseignants",icon:"person", path: "/enseignants"},
      {text: "Formations",icon:"auto_stories", path: "/formations"},
      {text: "Groupes d'intervenants",icon:"groups", path: "/groupes-intervenants"},
      {text: "Hiérarchies  arborescentes",icon: "account_tree", path: "/hierarchies-arborescentes"},
      {text: "Intervenants",icon:"assignment_ind", path: "/intervenants"},
      {text: "Périodes",icon:"access_time", path: "/periodes"},
      {text: "Projets",icon:"folder", path: "/projets"},
      {text: "Statuts",icon:"grade", path: "/statuts"},
      {text: "Volumes hebdomadaires",icon:"align_horizontal_left", path: "/volumes-hebdomadaires"},
      {text: "Volumes globaux",icon: "pie_chart", path: "/volumes-globaux"},

    ]
  }),
  methods: {
    redirect: function (path){
      this.$router.push({path:path}).catch(()=>{});
    },
  }
}
</script>