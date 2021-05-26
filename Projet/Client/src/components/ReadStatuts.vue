<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des statuts</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-breadcrumbs :items="items" large class="pl-0"></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="s in statuts"
               :key="s.id"
               sm="4"
        >
          <v-card>
            <v-card-title>{{ s.nom }}</v-card-title>
            <v-card-subtitle><b class="text-uppercase">{{ s.surnom }}</b></v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p>Nombre HeTD* minimal attendu : <b>{{ s.nb_he_td_min_attendu }}</b></p>
              <p>Nombre HeTD* maximal attendu : <b>{{ s.nb_he_td_max_attendu }}</b></p>
              <p>Nombre HeTD* minimal pour les heure supplémentaires : <b>{{ s.nb_he_td_min_sup }}</b></p>
              <p>Nombre HeTD* maximal pour les heure supplémentaires : <b>{{ s.nb_he_td_max_sup }}</b></p>
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
              <ConfirmPopUp/>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <small>* HeTD : Nombre d’heures équivalent TD</small>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn class="v-btn--example"
                 color="green"
                 fab
                 dark
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ConfirmPopUp from "@/components/DeleteConfirmation";
import {mapState} from "vuex";

export default {
  name: "ReadStatuts",
  components: {ConfirmPopUp},
  data: () => ({
    request: {},
    dialog: false,
    items: [
      {
        text: 'Statuts',
        disabled: true,
      },
      {
        text: 'Liste',
        disabled: true,
      }
    ],
  }),
  mounted() {
    this.$store.dispatch('loadStatuts');
  },
  computed: mapState([
    'statuts'
  ]),
}
</script>

<style scoped>
.v-btn--example {
  bottom: 0;
  right: 0;
  position: fixed;
  margin: 16px;
}
</style>