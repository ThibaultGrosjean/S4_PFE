<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center text-h4">Liste des hiérarchies arborescentes</h1>
        </v-col>
      </v-row>
      <v-row
          align="center"
          justify="center"
      >
        <v-btn-toggle
            v-if="elementsLevel.length"
            borderless
            rounded
            dense
            mandatory
            color="blue--text text--accent-4"
        >
          <v-btn
              @click="sortedByTitre"
          >
            <span class="hidden-sm-and-down">Titre</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col v-if="!elementsLevel.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <ReadElements :racine="elementsLevel" :flat="false" :add-btn="true"/>
    </v-container>
  </div>
</template>

<script>
import ReadElements from "../components/ReadElements";
import {mapState} from "vuex"

export default {
  name: "Elements",
  components: {ReadElements},
  mounted() {
    this.$store.dispatch('loadElementsLevel', 0);
  },
  computed: {
    ...mapState(['elementsLevel']),
  },
  methods: {
    sortedByTitre() {
      if (this.sortTitre) {
        this.sortTitre = false
        this.elementsLevel.sort((a, b) => a.titre.toUpperCase() < b.titre.toUpperCase())
      } else {
        this.sortTitre = true
        this.elementsLevel.sort((a, b) => a.titre.toUpperCase() > b.titre.toUpperCase())
      }
    },
  }
}
</script>

<style scoped>

</style>