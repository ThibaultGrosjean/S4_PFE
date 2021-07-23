<template>
  <v-container fluid class="pa-10">
    <ProgressOverlay :loading="loading"/>

    <v-row class="animate-pop-in pa-3">
      <v-card width="100%" class="pa-7">
        <v-row>
          <v-col class="align-center pa-0">
            <v-btn outlined small color="primary" @click="sortedByPrenom" class="mr-2">
              <v-icon small class="mr-2">{{ sortPrenom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Prénom
            </v-btn>
            <v-btn outlined small color="primary"  @click="sortedByNom" class="mr-2">
              <v-icon small class="mr-2">{{ sortNom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Nom
            </v-btn>
            <v-btn outlined small color="primary"  @click="sortedByStatut" class="mr-2">
              <v-icon small class="mr-2">{{ sortStatut ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Statut
            </v-btn>
            <v-btn icon color="success" @click="form = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row v-if="!enseignants.length">
      <v-col>
        <p class="text-center animate-pop-in">Aucune donnée trouvée</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
          v-for="e in enseignants"
          :key="e.id"
          sm="6"
          md="4"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title>
            <span class="text-h5">{{ e.prenom }} {{ e.nom }}</span>
          </v-card-title>
          <v-card-subtitle class="text-subtitle-1 pb-2"><span v-if="e.surnom">{{ e.surnom.toUpperCase() }}</span></v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <div class="pa-4 pb-0">
              Adresse mail<b>{{ ': ' + e.email }}</b>
            </div>
            <v-expansion-panels accordion>
              <v-expansion-panel>
                <v-expansion-panel-header class="pa-4 text--secondary" style="overflow: hidden !important">
                  <span>Statut : <b>{{ e.statut_nom }} <small>({{ e.statut_surnom }})</small></b></span>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-4 pt-0 text--secondary">
                  <DetailsStatut :data="e"/>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="edit(e)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Modifier {{ e.prenom + ' ' + e.nom }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="copy(e.id)"
                >
                  <v-icon>file_copy</v-icon>
                </v-btn>
              </template>
              <span>Dupliquer {{ e.prenom + ' ' + e.nom }}</span>
            </v-tooltip>
            <v-spacer>
            </v-spacer><v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="error darken-1"
                    @click="openDialog(e.id)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Supprimer {{ e.prenom + ' ' + e.nom }}</span>
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
              <span class="headline" v-if="methods === 'POST'">Ajouter un enseignant</span>
              <span class="headline" v-else>Modifier un enseignant</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                  v-model="enseignant.prenom"
                  :counter="255"
                  :error-messages="errors.prenom"
                  label="Prénom"
                  autofocus
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="enseignant.nom"
                  :counter="255"
                  :error-messages="errors.nom"
                  label="Nom"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-if="this.methods === 'PUT'"
                  v-model="enseignant.surnom"
                  :counter="3"
                  hint="Laisser vide pour générer automatiquement"
                  persistent-hint
                  :error-messages="errors.surnom"
                  label="Surnom"
                  clearable
              ></v-text-field><br v-if="this.methods === 'PUT'">
              <v-text-field
                  v-model="enseignant.email"
                  :counter="255"
                  :error-messages="errors.email"
                  label="E-mail"
                  clearable
              ></v-text-field>
              <v-select
                  v-model="enseignant.statut_id"
                  :items="statuts"
                  :item-text="item => item.nom +' ('+ item.surnom + ')'"
                  item-value="id"
                  :error-messages="errors.statut_id"
                  label="Statut"
                  clearable
              ></v-select>
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
            <v-btn icon  color="white" @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="text-justify pt-4">
            Êtes-vous sûr de vouloir supprimer cet enseignant ? <br><br>
            Si vous continuez les heures saisies globales, les groupes ainsi que les interventions de cet enseignant seront supprimées sur la totalité des formations et des projets. Voulez-vous vraiment valider l'opération ?
          </v-card-text>
          <v-card-actions>
            <v-btn
                :disabled="loading"
                color="error darken-1"
                text
                @click="dialog = false"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :loading="loading"
                color="success darken-1"
                text
                @click="this.delete"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success">
        <span>L'enseignant a été {{ typeOperation }} avec succès.</span>
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
import apiEnseignant from "../services/API/enseignants";
import apiStatut from "../services/API/statuts";
import ProgressOverlay from "../components/ProgressOverlay";
import DetailsStatut from "../components/DetailsStatut";

export default {
  name: "ReadEnseignants",
  components: {DetailsStatut, ProgressOverlay},

  data: () => ({
    enseignants: [],
    statuts: [],
    errors: [],
    form: false,
    dialog: false,
    loading: false,
    responseSuccess: false,
    sortNom: false,
    sortPrenom: false,
    sortStatut: false,
    methods: "POST",
    typeOperation: 'ajouté',
    enseignant: {
      id: '',
      nom: '',
      prenom: '',
      surnom: null,
      email: '',
      statut_id: '',
    }
  }),
  methods: {
    async getEnseignants() {
      this.enseignants = await apiEnseignant.getEnseignants();
    },
    async getStatuts() {
      this.statuts = await apiStatut.getStatuts();
    },
    async submit() {
      this.loading = true;
      if (this.methods === 'POST'){
        const res = await apiEnseignant.createEnseignant(this.enseignant);
        if (res.errors){
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'ajouté';
          await this.clear();
          await this.getEnseignants();
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
        }
      } else {
        const res = await apiEnseignant.editEnseignant(this.enseignant);
        if (res.errors){
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'modifié';
          this.enseignant.id = '';
          await this.clear();
          await this.getEnseignants();
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
        }
      }
    },
    clear() {
      this.enseignant = {
        id: this.enseignant.id,
        nom: '',
        prenom: '',
        surnom: null,
        email: '',
        statut_id: '',
      };
      this.errors = [];
      this.methods = 'POST';
    },
    close() {
      this.form = !this.form;
      this.clear();
    },
    edit(enseignant) {
      this.methods = 'PUT';
      this.enseignant = enseignant;
      this.form = true;
    },
    async copy(enseignantId) {
      this.loading = true;
      await apiEnseignant.copyEnseignant(enseignantId);
      await this.getEnseignants();
      this.loading = false;
      this.typeOperation = 'copié';
      this.responseSuccess = true;
    },
    async delete() {
      this.loading = true;
      await apiEnseignant.deleteEnseignant(this.id);
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
      this.loading = false;
      this.dialog = false;
      await this.clear();
      await this.getEnseignants();
    },
    openDialog(id) {
      this.id = id;
      this.dialog = true;
    },
    sortedByPrenom() {
      this.sortNom = this.sortStatut = false;
      if (this.sortPrenom) {
        this.sortPrenom = false;
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase());
      } else {
        this.sortPrenom = true;
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase());
      }
    },
    sortedByNom() {
      this.sortPrenom = this.sortStatut = false;
      if (this.sortNom) {
        this.sortNom = false;
        this.enseignants.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase());
      } else {
        this.sortNom = true;
        this.enseignants.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase());
      }
    },
    sortedByStatut() {
      this.sortNom = this.sortPrenom = false;
      if (this.sortStatut) {
        this.sortStatut = false;
        this.enseignants.sort((a, b) => a.statut_nom > b.statut_nom);
      } else {
        this.sortStatut = true;
        this.enseignants.sort((a, b) => a.statut_nom < b.statut_nom);
      }
    }
  },
  async mounted() {
    this.loading = true;
    await this.getEnseignants();
    await this.getStatuts();
    this.loading = false;
  },
}
</script>

<style scoped>
</style>