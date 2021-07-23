<template>
  <v-container fluid class="pa-10">
    <ProgressOverlay :loading="loading"/>

    <v-row class="animate-pop-in mb-2 pa-3">
      <v-card width="100%" class="pa-7">
        <v-row>
          <v-col class="align-center pa-0">
            <v-btn outlined small color="primary" @click="sortedByNom" class="mr-2">
              <v-icon small class="mr-2">{{ sortNom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Nom
            </v-btn>
            <v-btn icon color="success" @click="form = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row v-if="!statuts.length">
      <v-col class="pa-0">
        <p class="text-center animate-pop-in">Aucune donnée trouvée</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
          v-for="s in statuts"
          :key="s.id"
          sm="6"
          md="4"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">{{ s.nom }}</v-card-title>
          <v-card-subtitle class="text-subtitle-1 pb-2">{{ s.surnom }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <DetailsStatut :data="s"/>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="edit(s)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Modifier {{ s.nom }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="copy(s.id)"
                >
                  <v-icon>file_copy</v-icon>
                </v-btn>
              </template>
              <span>Dupliquer {{ s.nom }}</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top v-if="!Boolean(s.verrou)">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="error darken-1"
                    @click="openDialog(s)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Supprimer {{ s.nom }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-dialog
          v-model="form"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-form lazy-validation>
            <v-card-title>
              <span class="headline" v-if="methods === 'POST'">Ajouter un statut</span>
              <span class="headline" v-else>Modifier un statut</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                  v-model="statut.nom"
                  :counter="255"
                  :error-messages="this.errors.nom"
                  label="Nom"
                  autofocus
                  clearable
              >
              </v-text-field>
              <v-text-field
                  v-model="statut.surnom"
                  :counter="255"
                  :error-messages="this.errors.surnom"
                  label="Surnom"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="statut.nb_he_td_min_attendu"
                  :error-messages="this.errors.nb_he_td_min_attendu"
                  label="Nombre d'heures (équivalent TD) minimales attendues"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="statut.nb_he_td_max_attendu"
                  :error-messages="this.errors.nb_he_td_max_attendu"
                  label="Nombre d'heures (équivalent TD) maximales attendues"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="statut.nb_he_td_min_sup"
                  :error-messages="this.errors.nb_he_td_min_sup"
                  label="Nombre d'heures (équivalent TD) minimales supplémentaires attendues"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="statut.nb_he_td_max_sup"
                  :error-messages="this.errors.nb_he_td_max_sup"
                  label="Nombre d'heures (équivalent TD) maximales supplémentaires attendues"
                  clearable
              ></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    :loading="loading"
                    color="success darken-1"
                    text
                    @click="submit"
                >
                  Valider
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5 error darken-2 white--text">
            <span class="headline">Confirmation de suppression</span>
            <v-spacer></v-spacer>
            <v-btn icon color="white" @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="text-justify pt-4">
            Êtes-vous sûr de vouloir supprimer le statut « {{ statut.nom }} » ?<br><br>
            Cela entraînera la suppression des enseignants reliés à ce statut, ainsi que toutes ses interventions dans
            les formations.
          </v-card-text>
          <v-card-actions>
            <v-btn
                :disabled="loading"
                color="error darken-1"
                text
                @click="closeDialog"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :loading="loading"
                color="success darken-1"
                text
                @click="deleteStatut"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success">
        <span>Le statut a été {{ typeOperation }} avec succès.</span>
        <template v-slot:action="{ attrs }">
          <v-btn
              icon
              v-bind="attrs"
              @click="responseSuccess = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
import apiStatut from "../services/API/statuts";
import apiEnseignant from "../services/API/enseignants";
import ProgressOverlay from "../components/ProgressOverlay";
import DetailsStatut from "../components/DetailsStatut";

export default {
  name: "Statuts",
  components: {DetailsStatut, ProgressOverlay},

  data: () => ({
    statuts: [],
    errors: [],
    form: false,
    dialog: false,
    loading: false,
    responseSuccess: false,
    sortNom: false,
    methods: "POST",
    typeOperation: 'ajouté',
    statut: {
      id: '',
      nom: '',
      surnom: '',
      nb_he_td_min_attendu: '',
      nb_he_td_max_attendu: '',
      nb_he_td_min_sup: '',
      nb_he_td_max_sup: '',
    }
  }),
  methods: {
    async getStatuts() {
      this.statuts = await apiStatut.getStatuts();
    },
    async submit() {
      this.loading = true;
      if (this.methods === 'POST') {
        const res = await apiStatut.createStatut(this.statut);
        if (res.errors) {
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'ajouté';
          await this.clear();
          await this.getStatuts();
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
        }
      } else {
        const res = await apiStatut.editStatut(this.statut);
        if (res.errors) {
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'modifié';
          await this.clear();
          await this.getStatuts();
          this.statut.id = '';
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
        }
      }
    },
    async clear() {
      this.statut = {
        nom: '',
        surnom: '',
        nb_he_td_min_attendu: '',
        nb_he_td_max_attendu: '',
        nb_he_td_min_sup: '',
        nb_he_td_max_sup: '',
      };
      this.errors = [];
      this.methods = 'POST';
    },
    close() {
      this.form = !this.form;
      this.clear()
    },
    edit(statut) {
      this.methods = 'PUT';
      this.statut = statut;
      this.form = true;
    },
    async copy(statutId) {
      this.loading = true;
      await apiStatut.copyStatut(statutId);
      await this.getStatuts();
      this.loading = false;
      this.typeOperation = 'copié';
      this.responseSuccess = true;
    },
    closeDialog() {
      this.dialog = false;
      this.clear();
    },
    async openDialog(statut) {
      const enseignantByStatuts = await apiEnseignant.getEnseignantByStatut(statut.id)
      if (!enseignantByStatuts.length) {
        await apiStatut.deleteStatut(statut.id);
        await this.getStatuts();
      } else {
        this.dialog = true;
        this.statut.id = statut.id;
        this.statut.nom = statut.nom;
      }
    },
    async deleteStatut() {
      this.loading = true;
      await apiStatut.deleteStatut(this.statut.id);
      await this.clear();
      await this.getStatuts();
      this.loading = false;
      this.dialog = false;
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false;
        this.statuts.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase());
      } else {
        this.sortNom = true;
        this.statuts.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase());
      }
    },
  },
  async mounted() {
    this.loading = true;
    await this.getStatuts();
    this.loading = false;
  }
}
</script>

<style scoped>
</style>