<template>
  <div>
    <v-app-bar elevation="0" height="67px">
      <span class="custom-app-bar-title">{{ this.$route.name }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ $vuetify.theme.dark ? "wb_sunny" : "nightlight_round" }}</v-icon>
      </v-btn>
      <v-btn icon @click="deconnexion">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-divider></v-divider>
    <v-navigation-drawer
        permanent
        app
        width="75"
        dark
        color="accent"
    >
      <v-list dense flat class="pa-0">
        <v-list-item-group
            v-model="group"
            color="primary"
        >
          <v-list-item
              @click="redirect('/mon-compte')"
              :disabled="$route.name === 'mon-compte'"
              class="pa-0"
          >
            <v-list-item-content class="py-3">
              <v-icon :color="$route.name === 'mon-compte' ? 'primary' : 'gray'">account_circle</v-icon>
              <v-list-item-subtitle class="text-center">
                <small>{{ this.$store.state.utilisateur.identifiant }}</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item
              @click="redirect('/accueil')"
              :disabled="$route.name === 'Accueil'"
              class="pa-0"
          >
            <v-list-item-content class="py-3">
              <v-icon :color="$route.name === 'Accueil' ? 'primary' : 'gray'">home</v-icon>
              <v-list-item-subtitle class="text-center">
                <small>Accueil</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              @click="redirect('/projets')"
              :disabled="$route.name === 'Projets'"
              class="pa-0"
          >
            <v-list-item-content class="py-3">
              <v-icon :color="$route.name === 'Projets' || $route.name === 'Formations' || $route.name === 'Intervenants' || $route.name === 'Bilan' ? 'primary' : 'gray'">folder</v-icon>
              <v-list-item-subtitle class="text-center">
                <small>Projets</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <div v-if="$route.name === 'Formations' || $route.name === 'Intervenants' || $route.name === 'Bilan'">
            <v-divider></v-divider>
            <template v-for="s in subMenuProjet">
              <v-list-item
                  :key="s.index"
                  @click="redirect(s.path + Number($route.params.id))"
                  class="pa-0"
              >
                <v-list-item-content class="py-3">
                  <v-icon :color="$route.name === s.text ? 'primary' : 'gray'">{{ s.icon }}</v-icon>
                  <v-list-item-subtitle class="text-center">
                    <small>{{ s.text }}</small>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-divider></v-divider>
          </div>

          <v-list-item
              v-for="m in menu2"
              :key="m.index"
              @click="redirect(m.path)"
              :disabled="$route.name === m.text"
              class="pa-0"
          >
            <v-list-item-content>
              <v-icon :color="$route.name === m.text ? 'primary' : 'gray'">{{ m.icon }}</v-icon>
              <v-list-item-subtitle class="text-center">
                <small>{{ m.text }}</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "LeftBar",
  data: () => ({
    group: null,
    subMenuProjet: [
      {index:3, text: "Formations",icon:"auto_stories", path: "/formations/projets/"},
      {index:4, text: "Intervenants",icon:"groups", path: "/intervenants/projets/"},
      {index:5, text: "Bilan",icon:"account_balance_wallet", path: "/bilan/projets/"},
    ],
    menu2: [
      {index:6, text: "Enseignants",icon:"groups", path: "/enseignants"},
      {index:7, text: "Statuts",icon:"grade", path: "/statuts"},
    ]
  }),
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      await this.$router.push('/connexion').catch(()=>{});
    }
  },
  methods: {
    redirect(path) {
      this.$router.push({path:path}).catch(()=>{});
    },
    async deconnexion() {
      this.loading = true;
      await this.$store.dispatch('deconnexion');
      this.redirect('/connexion');
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #ffffff;
}
.custom-app-bar-title{
  margin-left: 3.1em !important;
  font-size: 2em !important;
  overflow: visible !important;
}
</style>