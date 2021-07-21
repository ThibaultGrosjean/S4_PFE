<template>
  <v-container fluid class="pa-10">
    <v-row>
      <v-col sm="12">
        <v-card class="animate-pop-in">
          <v-card-title>{{ utilisateur.prenom }} {{ utilisateur.nom }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>Identifiant</v-col>
                <v-col><b>{{ utilisateur.identifiant }}</b></v-col>
              </v-row>
              <v-row>
                <v-col>Prénom</v-col>
                <v-col><b>{{ utilisateur.prenom }}</b></v-col>
              </v-row>
              <v-row>
                <v-col>Nom</v-col>
                <v-col><b>{{ utilisateur.nom }}</b></v-col>
              </v-row>
              <v-row>
                <v-col>Adresse Mail</v-col>
                <v-col><b>{{ utilisateur.email }}</b></v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Modifier mes données</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-btn text link color="primary" class="px-1">Modifier mon mot de passe</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MonCompte",
  computed: {
    utilisateur() {
      return this.$store.getters.getUtilisateur;
    }
  }
}
</script>

<style scoped>

</style>