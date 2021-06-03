<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des intervenants</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!intervenants.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="inter in intervenants"
               :key="inter.id"
               sm="4"
        >
          <v-card>
            <v-card-title>{{ returnEnseignant(inter.enseignant_id).nom }} {{ returnEnseignant(inter.enseignant_id).prenom }}</v-card-title>
            <v-card-subtitle><b>{{ returnProjet(inter.projet_id).nom }}</b></v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p>nb_he_td_min_attendu_projet :<b>{{ inter.nb_he_td_min_attendu_projet }}</b></p>
              <p>nb_he_td_max_attendu_projet : <b>{{ inter.nb_he_td_max_attendu_projet }}</b></p>
              <p>nb_he_td_min_sup_projet : <b>{{ inter.nb_he_td_min_sup_projet }}</b></p>
              <p>nb_he_td_max_sup_projet : <b>{{ inter.nb_he_td_max_sup_projet }}</b></p>
            </v-card-text>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      edit
                    </v-icon>
                  </v-btn>
                </template>
                <span>Modifier</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      file_copy
                    </v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer</span>
              </v-tooltip>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>


import {mapState} from "vuex";

export default {
  name: "ReadIntervenants",
  data: () => ({
  }),
  mounted() {
    this.$store.dispatch('loadIntervenants')
    this.$store.dispatch('loadProjets')
    this.$store.dispatch('loadEnseignants')
  },
  computed: {
    ...mapState(['intervenants' , 'projets', 'enseignants']),
  },
  methods: {
    returnProjet(id) {
      let index = this.projets.findIndex(projet => projet.id === id)
      return this.projets[index]
    },
    returnEnseignant(id){
      let index = this.enseignants.findIndex(enseignant => enseignant.id === id);
      return this.enseignants[index]
    }
  }
}
</script>

<style scoped>

</style>