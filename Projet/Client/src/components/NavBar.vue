<template>
  <v-navigation-drawer
      permanent
      app
      width="75"
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
          <v-list-item-content>
            <v-icon :color="$route.name === 'mon-compte' ? 'primary' : 'gray'">account_circle</v-icon>
            <v-list-item-subtitle class="text-center">
              <small>Mon Compte</small>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item
            @click="redirect('/accueil')"
            :disabled="$route.name === 'Accueil'"
            class="pa-0"
        >
          <v-list-item-content>
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
          <v-list-item-content>
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
              <v-list-item-content>
                <v-icon :color="$route.name === s.text ? 'blue lighten-2' : 'gray'">{{ s.icon }}</v-icon>
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

    <template v-slot:append>
      <v-list dense flat  class="pa-0">
        <v-list-item-group
            v-model="group"
            color="primary"
        >
          <v-list-item
              @click="$vuetify.theme.dark = !$vuetify.theme.dark"
              class="pa-0"
          >
            <v-list-item-content>
              <v-icon>{{ $vuetify.theme.dark ? "wb_sunny" : "nightlight_round" }}</v-icon>
              <v-list-item-subtitle class="text-center">
                <small>{{ $vuetify.theme.dark ? "Thème clair" : "Thème sombre" }}</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
              @click="redirect('/logout')"
              class="pa-0"
          >
            <v-list-item-content>
              <v-icon>logout</v-icon>
              <v-list-item-subtitle class="text-center">
                <small>Déconnexion</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>
  </v-navigation-drawer>
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
  methods: {
    redirect(path) {
      this.$router.push({path:path}).catch(()=>{});
    },
  }
}
</script>

<style scoped>

</style>