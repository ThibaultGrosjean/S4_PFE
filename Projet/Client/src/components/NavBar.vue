<template>
  <div>
    <v-app-bar
      color="blue"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
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
        <v-list-item-group
          v-model="group"
          active-class="blue--text text--accent-4"
        >
          <v-list-item v-for="(t,index) in subMenu" :key="index" @click="redirect(t)">
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
    title: "",
    subMenu: [
      {text: "Accueil",icon:"mdi-home", path: "/accueil"},
      {text: "Mon Compte",icon:"settings", path: "/mon-compte"},
      {text: "Bilan",icon:"account_balance_wallet", path: "/bilan"},
      {text: "Enseignants",icon:"person", path: "/enseignants"},
      {text: "Formations",icon:"auto_stories", path: "/formations"},
      {text: "Groupes d'enseignants",icon:"groups", path: "/groupes-enseignants"},
      {text: "Hiérarchies  arborescentes",icon: "account_tree", path: "/hierarchies-arborescentes"},
      {text: "Intervenants",icon:"assignment_ind", path: "/intervenant"},
      {text: "Périodes",icon:"access_time", path: "/periodes"},
      {text: "Projets",icon:"folder", path: "/projets"},
      {text: "Statuts",icon:"grade", path: "/statuts"},
      {text: "Volumes hebdomadaires",icon:"align_horizontal_left", path: "/volumes-hebdomadaire"},
      {text: "Volumes globaux",icon: "pie_chart", path: "/volumes-globaux"},

    ]
  }),
  methods: {
    redirect: function (t){
      this.$router.push({path:t.path});
      this.title = t.text;
    }
  }
}
</script>