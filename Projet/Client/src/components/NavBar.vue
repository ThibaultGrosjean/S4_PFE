<template>
  <v-navigation-drawer
      permanent
      expand-on-hover
      app
  >
    <v-list nav dense flat>
      <v-list-item-group
          v-model="group"
          color="primary"
      >
        <v-list-item @click="redirect('/mon-compte')">
          <v-list-item-icon>
            <v-icon>account_circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mon Compte</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="mb-1"></v-divider>

        <v-list-item
            v-for="(t,index) in subMenu"
            :key="index"
            @click="redirect(t.path)"
            :disabled="$route.name === t.text"
        >
          <v-list-item-icon>
            <v-icon>{{ t.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ t.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <v-list nav dense flat>
        <v-list-item-group
            v-model="group"
            color="primary"
        >
          <v-list-item link @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-list-item-icon>
              <v-icon>{{ $vuetify.theme.dark ? "wb_sunny" : "nightlight_round" }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $vuetify.theme.dark ? "Thème clair" : "Thème sombre" }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="redirect('/logout')">
            <v-list-item-icon>
              <v-icon>logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Déconnexion {{ $route.name }}</v-list-item-title>
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
    subMenu: [
      {text: "Accueil",icon:"home", path: "/accueil"},
      {text: "Projets",icon:"folder", path: "/projets"},
      {text: "Enseignants",icon:"groups", path: "/enseignants"},
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

</style>