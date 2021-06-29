<template>
  <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center text-h4 animate-pop-in">Liste des enseignants</h1>
        </v-col>
      </v-row>
      <v-row
          align="center"
          justify="center"
      >
        <v-btn-toggle
            v-if="enseignants.length"
            borderless
            rounded
            dense
            mandatory
            color="blue--text text--accent-4"
            class="animate-pop-in"
        >
          <v-btn
              @click="sortedByPrenom"
          >
            <span class="hidden-sm-and-down">Prénom</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
          <v-btn
              @click="sortedByNom"
          >
            <span class="hidden-sm-and-down">Nom</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
          <v-btn
              @click="sortedByStatut"
          >
            <span class="hidden-sm-and-down">Statut</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col v-if="!enseignants.length">
          <p class="text-center animate-pop-in">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
    <v-row>
      <ReadEnseignants :enseignants="enseignants"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadEnseignants from "../components/ReadEnseignants";
import {mapState} from "vuex";
export default {
  name: "Enseignants",
  components: {ReadEnseignants},

  data: () => ({
    sortNom: false,
    sortPrenom: false,
    sortStatut: false,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'enseignants')
  },
  computed: {
    ...mapState(['statuts', 'enseignants']),
  },
  methods: {
    sortedByPrenom() {
      if (this.sortPrenom) {
        this.sortPrenom = false
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase())
      } else {
        this.sortPrenom = true
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase())
      }
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false
        this.enseignants.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase())
      } else {
        this.sortNom = true
        this.enseignants.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase())
      }
    },
    sortedByStatut() {
      if (this.sortStatut) {
        this.sortStatut = false
        this.enseignants.sort((a, b) => a.statut.id < b.statut.id)
      } else {
        this.sortStatut = true
        this.enseignants.sort((a, b) => a.statut.id > b.statut.id)
      }
    }
  }
}
</script>

<style scoped>

</style>