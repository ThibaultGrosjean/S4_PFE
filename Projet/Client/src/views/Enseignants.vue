<template>
  <v-container>
    <v-overlay :value="loading" :opacity="0">
      <v-progress-circular
          indeterminate
          size="64"
          color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4 animate-pop-in mb-2">Liste des enseignants</h1>
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
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success" :rounded="true">
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
          <v-card-subtitle class="text-subtitle-1">{{ e.surnom }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <div class="pa-4 pb-0">
              Adresse mail<b>{{ ': ' + e.email }}</b>
            </div>
            <v-expansion-panels accordion>
              <v-expansion-panel>
                <v-expansion-panel-header class="pa-4 text--secondary">
                  Statut<b>{{ ': ' + e.statut.nom }} <small>({{ e.statut.surnom }})</small></b>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-4 pt-0 text--secondary">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">HeTD*</span>
                    </template>
                    <span>Nombre d’heures équivalent TD</span>
                  </v-tooltip> minimales attendues : <b>{{ e.statut.nb_he_td_min_attendu }}</b><br>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">HeTD*</span>
                    </template>
                    <span>Nombre d’heures équivalent TD</span>
                  </v-tooltip> maximales attendues : <b>{{ e.statut.nb_he_td_max_attendu }}</b><br>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">HeTD*</span>
                    </template>
                    <span>Nombre d’heures équivalent TD</span>
                  </v-tooltip> minimales sup. : <b>{{ e.statut.nb_he_td_min_sup }}</b><br>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">HeTD*</span>
                    </template>
                    <span>Nombre d’heures équivalent TD</span>
                  </v-tooltip> maximales sup. : <b>{{ e.statut.nb_he_td_max_sup }}</b><br>
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
              <span>Modifier</span>
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
              <span>Dupliquer</span>
            </v-tooltip>
            <v-spacer>
            </v-spacer><v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="openDialog(e.id)"
                >
                  <v-icon color="error darken-1">delete</v-icon>
                </v-btn>
              </template>
              <span>Supprimer</span>
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
              <v-btn
                  icon
                  @click="close"
              >
                <v-icon>
                  close
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                  v-model="prenom"
                  :error-messages="prenomErrors"
                  :counter="255"
                  label="Prénom"
                  required
                  clearable
                  @input="$v.prenom.$touch()"
                  @blur="$v.prenom.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nom"
                  :error-messages="nomErrors"
                  :counter="255"
                  label="Nom"
                  required
                  clearable
                  @input="$v.nom.$touch()"
                  @blur="$v.nom.$touch()"
              ></v-text-field>
              <v-text-field v-if="this.methods === 'PUT'"
                  v-model="surnom"
                  :error-messages="surnomErrors"
                  :counter="3"
                  label="Surnom"
                  clearable
                  @input="$v.surnom.$touch()"
                  @blur="$v.surnom.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  :counter="255"
                  required
                  clearable
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
              ></v-text-field>
              <v-select
                  v-model="statut_id"
                  :items="statuts"
                  :item-text="item => item.nom +' ('+ item.surnom + ')'"
                  item-value="id"
                  label="Statut"
                  clearable
                  :error-messages="statutErrors"
                  @change="$v.statut_id.$touch()"
                  @blur="$v.statut_id.$touch()"
                  required
              ></v-select>
              <v-card-actions>
                <v-btn
                    color="error darken-1"
                    class="mr-4"
                    text
                    @click="clear"
                >
                  Vider
                </v-btn>
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
            Êtes-vous sûr de vouloir supprimer la sélection d'enseignant ? <br><br>
            Si vous continuez les heures saisies globales, les groupes ainsi que les interventions de ces enseignants seront supprimées sur la totalité des formations et des projets. Voulez-vous vraiment valider l'opération ?
          </v-card-text>
          <v-card-actions>
            <v-btn
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
      <v-col>
        <v-btn
            class="v-btn--addElement"
            color="success"
            fab
            dark
            @click="close"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiEnseignant from "../services/API/enseignants";
import apiStatut from "../services/API/statuts";
import {validationMixin} from "vuelidate";
import {email, maxLength, required} from "vuelidate/lib/validators";


export default {
  name: "ReadEnseignants",
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    prenom: {required, maxLength: maxLength(255)},
    surnom: {maxLength: maxLength(3)},
    email: {required, email},
    statut_id: {required},
  },
  data: () => ({
    enseignants: [],
    statuts: [],
    form: false,
    dialog: false,
    loading: false,
    responseSuccess: false,
    showDetails: false,
    showStatut: [],
    sortNom: false,
    sortPrenom: false,
    sortStatut: false,
    methods: "POST",
    typeOperation: 'ajouté',
    id: '',
    nom: '',
    prenom: '',
    surnom: '',
    email: '',
    statut_id: null,
  }),
  methods: {
    async getEnseignants() {
      this.enseignants = await apiEnseignant.getEnseignants();
    },
    async getStatuts() {
      this.statuts = await apiStatut.getStatuts();
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const enseignant = {
        id: this.id,
        nom: this.nom,
        prenom: this.prenom,
        surnom: this.surnom,
        email: this.email,
        statut_id: this.statut_id,
        statut: this.returnStatut(this.statut_id)
      }
      this.loading = true;
      if (this.methods === 'POST'){
        await apiEnseignant.createEnseignant(enseignant);
        this.typeOperation = 'ajouté';
      } else {
        await apiEnseignant.editEnseignant(enseignant);
        this.typeOperation = 'modifié';
      }
      await this.getEnseignants();
      this.clear();
      this.loading = false;
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset();
      this.id = '';
      this.nom = '';
      this.prenom = '';
      this.surnom = '';
      this.email = '';
      this.statut_id = null;
    },
    close() {
      this.form = !this.form;
      this.methods = 'POST';
      this.clear();
    },
    edit(enseignant) {
      this.methods = 'PUT';

      this.id = enseignant.id;
      this.nom = enseignant.nom;
      this.prenom = enseignant.prenom;
      this.surnom = enseignant.surnom.toUpperCase();
      this.email = enseignant.email;
      this.statut_id = enseignant.statut.id;
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
      await this.getEnseignants();
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
      this.loading = false;
      this.dialog = false;
      this.clear()
    },
    returnStatut(id) {
      let index = this.statuts.findIndex(statut => statut.id === id);
      return this.statuts[index];
    },
    openDialog(id) {
      this.id = id;
      this.dialog = true;
    },
    sortedByPrenom() {
      if (this.sortPrenom) {
        this.sortPrenom = false;
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase());
      } else {
        this.sortPrenom = true;
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase());
      }
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false;
        this.enseignants.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase());
      } else {
        this.sortNom = true;
        this.enseignants.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase());
      }
    },
    sortedByStatut() {
      if (this.sortStatut) {
        this.sortStatut = false;
        this.enseignants.sort((a, b) => a.statut.id > b.statut.id);
      } else {
        this.sortStatut = true;
        this.enseignants.sort((a, b) => a.statut.id < b.statut.id);
      }
    }
  },
  computed: {
    statutErrors() {
      const errors = [];
      if (!this.$v.statut_id.$dirty) return errors;
      !this.$v.statut_id.required && errors.push('Veuillez sélectionner un statut');
      return errors;
    },
    nomErrors() {
      const errors = [];
      if (!this.$v.nom.$dirty) return errors;
      !this.$v.nom.maxLength && errors.push('Le nom ne doit pas faire plus de 255 caractères');
      !this.$v.nom.required && errors.push('Le nom est obligatoire.');
      return errors;
    },
    prenomErrors() {
      const errors = [];
      if (!this.$v.prenom.$dirty) return errors;
      !this.$v.prenom.maxLength && errors.push('Le prénom ne doit pas faire plus de 255 caractères');
      !this.$v.prenom.required && errors.push('Le prenom est obligatoire.');
      return errors;
    },
    surnomErrors() {
      const errors = [];
      if (!this.$v.surnom.$dirty) return errors;
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 3 caractères');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Veuillez saisir un mail valide');
      !this.$v.email.required && errors.push('L\'e-mail est obligatoire');
      return errors;
    },
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