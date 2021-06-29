<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4 animate-pop-in">Liste des projets</h1>
      </v-col>
    </v-row>
    <v-row
        align="center"
        justify="center"
    >
      <v-btn-toggle
          v-if="projets.length"
          borderless
          rounded
          dense
          mandatory
          color="blue--text text--accent-4"
          class="animate-pop-in"
      >
        <v-btn
            @click="sortedByDate"
        >
          <span class="hidden-sm-and-down">Date</span>
          <v-icon right>sort_by_alpha</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row>
      <v-col v-if="!projets.length">
        <p class="text-center animate-pop-in">Aucun projet trouvé</p>
      </v-col>
    </v-row>
    <v-row>
      <ReadProjets :projets="projets"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadProjets from "../components/ReadProjets";
import {mapState} from "vuex";
export default {
  name: "Projets",
  components: {ReadProjets},

  data: () => ({
    sortDate: false,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'projets');
  },
  computed: {
    ...mapState(['projets']),
  },
  methods: {
    sortedByDate() {
      if (this.sortDate) {
        this.sortDate = false
        this.projets.sort((a, b) => new Date(b.date) - new Date(a.date))
      } else {
        this.sortDate = true
        this.projets.sort((a, b) => new Date(a.date) - new Date(b.date))
      }
    },
  }
}
</script>

<style scoped>

</style>