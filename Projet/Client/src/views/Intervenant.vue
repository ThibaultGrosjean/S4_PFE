<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4">Liste des intervenants<span v-if="intervenantsByProjet.length"> de {{ intervenantsByProjet[0].nom }} - {{ toTime(intervenantsByProjet[0].date, 4) }}</span></h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                class="ma-1"
                @click="redirect('/projets')"
            >
              <v-icon large>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Retourner aux projets</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!intervenantsByProjet.length">
        <p class="text-center">Aucun intervenant sur ce projet</p>
      </v-col>
    </v-row>
    <v-row>
      <ReadIntervenants :intervenants="intervenantsByProjet"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadIntervenants from "../components/ReadIntervenants";
import {mapState} from "vuex";
export default {
  name: "Intervenant",
  components: {ReadIntervenants},

  mounted() {
    this.$store.dispatch('loadIntervenantsProjet', this.$route.params.id);
  },
  computed: {
    ...mapState(['intervenantsByProjet']),
  },
  methods: {
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length)
    },
    redirect(path) {
      this.$router.push({path: path}).catch(() => {});
    }
  }
}
</script>

<style scoped>

</style>