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
        <v-col>
          <v-btn
              icon
              @click="display = !display"
          >
            <v-icon>
              {{ display ? 'grid_view' : 'table_rows' }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="display">
        <v-col>
          <v-col>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
          </v-col>
          <v-data-table
              :headers="headers"
              :items="enseignants"
              :items-per-page="5"
              :search="search"
              class="elevation-1"
          >

            <template v-slot:item.actions="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="editItem(item)"
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
                        @click="copyItem(item)"
                    >
                      file_copy
                    </v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer</span>
              </v-tooltip>
              <ConfirmPopUp :item="item.id"></ConfirmPopUp>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row v-if="!display">
        <v-col v-for="e in enseignants"
               :key="e.id"
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
              <p class="mb-0">Statut : <b>{{ e.statut.nom}}</b></p>
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
                    <p>Nombre HeTD* minimal attendu : <b>{{ e.statut.nb_he_td_min_attendu }}</b></p>
                    <p>Nombre HeTD* maximal attendu : <b>{{ e.statut.nb_he_td_max_attendu }}</b></p>
                    <p>Nombre HeTD* minimal pour les heure supplémentaires : <b>{{ e.statut.nb_he_td_min_sup }}</b></p>
                    <p>Nombre HeTD* maximal pour les heure supplémentaires : <b>{{ e.statut.nb_he_td_max_sup }}</b></p>
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
              <ConfirmPopUp :item="e.id"></ConfirmPopUp>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn class="v-btn--addElement"
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
import { mapState } from 'vuex';

export default {
  name: "ReadStatuts",
  components: {ConfirmPopUp},
  data: () => ({
    headers: [
      { text: 'Nom', value: 'nom' },
      { text: 'Prénom', value: 'prenom' },
      { text: 'Surnom', value: 'surnom' },
      { text: 'Email', value: 'email' },
      { text: 'Statut', value: 'statut.nom' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    show: false,
    display: true,
    search: '',
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
    this.$store.dispatch('loadEnseignants');
  },
  computed: mapState([
    'enseignants'
  ]),
}
</script>

<style scoped>
.v-btn--addElement {
  bottom: 0;
  right: 0;
  position: fixed;
  margin: 16px;
}
</style>