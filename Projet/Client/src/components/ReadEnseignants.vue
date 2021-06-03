<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des enseignants</h1>
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
            color="blue--text text--accent-4"
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
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="e in enseignants"
               :key="e.id"
               sm="4"
        >
          <v-card>
            <v-card-title>{{ e.prenom }} {{ e.nom }}</v-card-title>
            <v-card-subtitle><b class="text-uppercase">{{ e.surnom }}</b></v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p>Adresse mail : <b>{{ e.email }}</b></p>
              <p class="mb-0">Statut : <b>{{ e.statut.nom }} ({{ e.statut.surnom }})</b></p>
              <div class="text-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="showDetails = !showDetails">
                      <v-icon
                          v-bind="attrs"
                          v-on="on"
                      >
                        {{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Détails des statuts</span>
                </v-tooltip>
              </div>


              <v-expand-transition>
                <div v-show="showDetails">
                  <p>HeTD* minimal attendu :<b>{{ e.statut.nb_he_td_min_attendu }}</b></p>
                  <p>HeTD* maximal attendu : <b>{{ e.statut.nb_he_td_max_attendu }}</b></p>
                  <p>HeTD* minimal sup. : <b>{{ e.statut.nb_he_td_min_sup }}</b></p>
                  <p>HeTD* maximal sup. : <b>{{ e.statut.nb_he_td_max_sup }}</b></p>
                  <small>* HeTD : Nombre d’heures équivalent TD</small>
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
                        @click="edit(e)"
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
              <Delete :item="e.id"></Delete>
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
                <v-text-field
                    v-model="surnom"
                    :error-messages="surnomErrors"
                    :counter="3"
                    label="Surnom"
                    required
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
                    item-text="nom"
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
                      color="red darken-1"
                      class="mr-4"
                      text
                      @click="clear"
                  >
                    Vider
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="green darken-1"
                      class="mr-4"
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
      <v-row>
        <v-col>
          <v-btn
              class="v-btn--addElement"
              color="green"
              fab
              dark
              @click="close"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Delete from "@/components/DeleteConfirmation";
import {mapState} from 'vuex';
import {validationMixin} from "vuelidate";
import {email, maxLength, required} from "vuelidate/lib/validators";

export default {
  name: "ReadEnseignants",
  components: {Delete},
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    prenom: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(3)},
    email: {required, email},
    statut_id: {required},
  },
  data: () => ({
    showDetails: false,
    form: false,
    sortNom: false,
    sortPrenom: false,
    sortStatut: false,
    methods: "POST",
    id: '',
    nom: '',
    prenom: '',
    surnom: '',
    email: '',
    statut_id: null,
  }),
  mounted() {
    this.$store.dispatch('loadEnseignants')
    this.$store.dispatch('loadStatuts')
  },
  computed: {
    ...mapState(['statuts', 'enseignants']),
    statutErrors() {
      const errors = []
      if (!this.$v.statut_id.$dirty) return errors
      !this.$v.statut_id.required && errors.push('Veuillez sélectionner un statut')
      return errors
    },
    nomErrors() {
      const errors = []
      if (!this.$v.nom.$dirty) return errors
      !this.$v.nom.maxLength && errors.push('Le nom ne doit pas faire plus de 255 caractères')
      !this.$v.nom.required && errors.push('Le nom est obligatoire.')
      return errors
    },
    prenomErrors() {
      const errors = []
      if (!this.$v.prenom.$dirty) return errors
      !this.$v.prenom.maxLength && errors.push('Le prénom ne doit pas faire plus de 255 caractères')
      !this.$v.prenom.required && errors.push('Le prenom est obligatoire.')
      return errors
    },
    surnomErrors() {
      const errors = []
      if (!this.$v.surnom.$dirty) return errors
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 3 caractères')
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Veuillez saisir un mail valide')
      !this.$v.email.required && errors.push('L\'e-mail est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const enseignant = {
        id: this.id,
        nom: this.nom,
        prenom: this.prenom,
        surnom: this.surnom,
        email: this.email,
        statut_id: this.statut_id,
        statut: this.returnStatut(this.statut_id)
      }
      if (this.methods === 'POST'){
        this.$store.commit('ADD_Enseignant', enseignant);
      } else {
        this.$store.commit('EDIT_Enseignant', enseignant);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.nom = ''
      this.prenom = ''
      this.surnom = ''
      this.email = ''
      this.statut_id = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(enseignant) {
      this.methods = 'PUT'

      this.id = enseignant.id
      this.nom = enseignant.nom
      this.prenom = enseignant.prenom
      this.surnom = enseignant.surnom
      this.email = enseignant.email
      this.statut_id = enseignant.statut.id
      this.form = true;
    },
    returnStatut(id) {
      let index = this.statuts.findIndex(statut => statut.id === id)
      return this.statuts[index]
    },
    sortedByPrenom() {
      if (this.sortPrenom) {
        this.sortPrenom = false
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase())
      } else {
        this.sortPrenom = true
        this.enseignants.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase())
      }
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false
        this.enseignants.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase())
      } else {
        this.sortNom = true
        this.enseignants.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase())
      }
    },
    sortedByStatut() {
      if (this.sortStatut) {
        this.sortStatut = false
        this.enseignants.sort((a, b) => a.statut.id < b.statut.id)
      } else {
        this.sortStatut = true
        this.enseignants.sort((a, b) => a.statut.id > b.statut.id)
      }
    }
  },
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