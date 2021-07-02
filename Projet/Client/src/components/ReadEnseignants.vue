<template>
  <v-container>
    <v-row v-if="enseignants.length" class="pa-3 pb-0 animate-pop-in">
      <v-checkbox
          v-model="checkboxSelectAll"
          label="Tout sélectionner"
          color="primary"
          class="ma-0 ml-5"
          @click="checkAllInterv"
      ></v-checkbox>
      <v-tooltip top v-if="deleteSelected.length">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="ml-2"
              @click="dialog = true"
          >
            <v-icon color="error darken-1">delete</v-icon>
          </v-btn>
        </template>
        <span>Supprimer la sélection</span>
      </v-tooltip>
    </v-row>
      <v-item-group multiple v-model="deleteSelected">
        <v-row>
          <v-col
            v-for="e in enseignants"
            :key="e.id"
            sm="4"
            class="justify-center"
        >
          <v-item v-slot="{ active, toggle }" :value="e">
            <v-card class="animate-pop-in">
              <v-card-title>
                <v-btn
                    icon
                    @click="toggle"
                    :color="active ? 'primary' : 'gray'"
                >
                  <v-icon>
                    {{ active ? 'check_box' : 'check_box_outline_blank' }}
                  </v-icon>
                </v-btn>
                <span class="text-h5 ml-2">{{ e.prenom }} {{ e.nom }}</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <p>Adresse mail : <b>{{ e.email }}</b></p>
                <p class="mb-0">Statut : <b>{{ e.statut.nom }} ({{ e.statut.surnom }})</b></p>
                <div class="text-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="showDetails = !showDetails"
                      >
                        <v-icon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-btn>
                    </template>
                    <span>Détails des statuts</span>
                  </v-tooltip>
                </div>

                <v-expand-transition>
                  <div v-show="showDetails">
                    <p>HeTD* minimales attendues :<b>{{ e.statut.nb_he_td_min_attendu }}</b></p>
                    <p>HeTD* maximales attendues : <b>{{ e.statut.nb_he_td_max_attendu }}</b></p>
                    <p>HeTD* minimales sup. : <b>{{ e.statut.nb_he_td_min_sup }}</b></p>
                    <p>HeTD* maximales sup. : <b>{{ e.statut.nb_he_td_max_sup }}</b></p>
                    <small>* HeTD : Nombre d’heures équivalent TD</small>
                  </div>
                </v-expand-transition>
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
                        @click="copy(e)"
                    >
                      <v-icon>file_copy</v-icon>
                    </v-btn>
                  </template>
                  <span>Dupliquer</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
      </v-item-group>
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
                    color="success darken-1"
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
                color="success darken-1"
                class="mr-4"
                text
                @click="validDeleteAllEnseignants"
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
import {mapState} from 'vuex';
import {validationMixin} from "vuelidate";
import {email, maxLength, required} from "vuelidate/lib/validators";

export default {
  name: "ReadEnseignants",
  mixins: [validationMixin],
  props: ['enseignants'],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    prenom: {required, maxLength: maxLength(255)},
    surnom: {maxLength: maxLength(3)},
    email: {required, email},
    statut_id: {required},
  },
  data: () => ({
    showDetails: false,
    form: false,
    dialog: false,
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
    deleteSelected: [],
    checkboxSelectAll: false,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'statuts')
  },
  computed: {
    ...mapState(['statuts']),
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
        var compose = enseignant.prenom.indexOf("-")
        if (this.nom.length === 1 && this.prenom.length === 1){
          enseignant.surnom = this.prenom[0] + enseignant.nom[0]
        } else {
          if (compose !== -1)
            enseignant.surnom = this.prenom[0] + this.prenom[compose+1] + this.nom[0]
          else
            enseignant.surnom = this.prenom[0] + this.nom[0] + this.nom[1]
        }
        this.surnom = this.surnom.toUpperCase()
        this.$store.commit('ADD_Enseignant', enseignant);
      } else {
        this.surnom = this.surnom.toUpperCase()
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
      this.surnom = enseignant.surnom.toUpperCase()
      this.email = enseignant.email
      this.statut_id = enseignant.statut.id
      this.form = true;
    },
    copy(statut) {
      this.$store.commit('COPY_Enseignant', statut.id);
    },
    returnStatut(id) {
      let index = this.statuts.findIndex(statut => statut.id === id)
      return this.statuts[index]
    },
    checkAllInterv() {
      this.deleteSelected.splice(0, this.deleteSelected.length)
      if (this.checkboxSelectAll){
        for (let i = 0; i < this.enseignants.length; i++) {
          this.deleteSelected.push(this.enseignants[i])
        }
      }
    },
    validDeleteAllEnseignants(){
      for (let i = 0; i < this.deleteSelected.length; i++) {
        this.$store.commit('DELETE_Enseignant', this.deleteSelected[i].id)
      }
      this.dialog = false
    }
  },
}
</script>

<style scoped>
</style>