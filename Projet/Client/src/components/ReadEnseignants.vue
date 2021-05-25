<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des enseignants</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-breadcrumbs :items="items" large class="pl-0"></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(e,index) in this.enseignant.data"
               :key="index"
               sm="4"
        >
          <v-card>
            <v-card-title>{{e.prenom }} {{ e.nom }}</v-card-title>
            <v-card-subtitle><b class="text-uppercase">{{ e.surnom }}</b></v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p>Prénom : <b>{{ e.prenom}}</b></p>
              <p>Nom : <b>{{ e.nom}}</b></p>
              <p>Adresse mail : <b>{{ e.email}}</b></p>
              <p class="mb-0">Statut : <b>{{ e.statut_id.nom}}</b></p>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      @click="show = !show"
                  >
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      {{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>Détails des statuts</span>
              </v-tooltip>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>
                  <v-card-text>
                    <p>Nombre HeTD* minimal attendu : <b>{{ e.statut_id.nb_he_td_min_attendu }}</b></p>
                    <p>Nombre HeTD* maximal attendu : <b>{{ e.statut_id.nb_he_td_max_attendu }}</b></p>
                    <p>Nombre HeTD* minimal pour les heure supplémentaires : <b>{{ e.statut_id.nb_he_td_min_sup }}</b></p>
                    <p>Nombre HeTD* maximal pour les heure supplémentaires : <b>{{ e.statut_id.nb_he_td_max_sup }}</b></p>
                    <small>* HeTD : Nombre d’heures équivalent TD</small>
                  </v-card-text>
                </div>
              </v-expand-transition>

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
import axios from "axios";
import ConfirmPopUp from "@/components/DeleteConfirmation";

export default {
  name: "ReadStatuts",
  components: {ConfirmPopUp},
  data: () => ({
    enseignant: {},
    show: false,
    items: [
      {
        text: 'Enseignants',
        disabled: true,
      },
      {
        text: 'Liste',
        disabled: true,
      }
    ],
  }),
  mounted() {
    axios
        .get('http://localhost:8888/enseignants')
        .then((responce) => {
          this.enseignant = responce;
          console.log(responce.data);
        })
        .catch((responce) => {
          console.log(responce.data);
          console.log(responce.status);
          console.log(responce.headers);
        });
  },


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