<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4">Liste des formations<span v-if="formationsByProjet.length"> de {{ formationsByProjet[0].nom }} - {{ toTime(formationsByProjet[0].date, 4) }}</span></h1>
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
      <v-col v-if="!formationsByProjet.length">
        <p class="text-center">Aucune formation sur ce projet</p>
      </v-col>
    </v-row>
    <v-row>
      <ReadFormation :formations="formationsByProjet"/>
    </v-row>
  </v-container>
</template>

<script>
import ReadFormation from "../components/ReadFormation";
import {mapState} from "vuex";
export default {
  name: "Formation",
  components: {ReadFormation},

  mounted() {
    this.$store.dispatch('loadFormationProjet', this.$route.params.id);
  },
  computed: {
    ...mapState(['formationsByProjet']),
  },
  methods: {
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length)
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    }
  }
}
</script>

<style scoped>

</style>