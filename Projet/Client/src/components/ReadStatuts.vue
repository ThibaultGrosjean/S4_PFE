<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des statuts</h1>
        </v-col>
      </v-row>
      <v-row
          align="center"
          justify="center"
      >
        <v-btn-toggle
            v-if="statuts.length"
            borderless
            rounded
            dense
            mandatory
            color="blue--text text--accent-4"
        >
          <v-btn
              @click="sortedByNom"
          >
            <span class="hidden-sm-and-down">Nom</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col v-if="!statuts.length">
          <p class="text-center">Aucune donnée trouvée</p>
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
              <p>HeTD* minimal attendu : <b>{{ s.nb_he_td_min_attendu }}</b></p>
              <p>HeTD* maximal attendu : <b>{{ s.nb_he_td_max_attendu }}</b></p>
              <p>HeTD* minimal sup. : <b>{{ s.nb_he_td_min_sup }}</b></p>
              <p>HeTD* maximal sup. : <b>{{ s.nb_he_td_max_sup }}</b></p>
              <small>* HeTD : Nombre d’heures équivalent TD</small>
            </v-card-text>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(s)"
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
                    :counter="255"
                    label="Surnom"
                    required
                    clearable
                    @input="$v.surnom.$touch()"
                    @blur="$v.surnom.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_min_attendu"
                    :error-messages="heTDMinAttenduErrors"
                    label="Nombre d'heures (équivalent TD) minimal attendu"
                    required
                    clearable
                    @input="$v.nb_he_td_min_attendu.$touch()"
                    @blur="$v.nb_he_td_min_attendu.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_max_attendu"
                    :error-messages="heTDMaxAttenduErrors"
                    label="Nombre d'heures (équivalent TD) maximal attendu"
                    required
                    clearable
                    @input="$v.nb_he_td_max_attendu.$touch()"
                    @blur="$v.nb_he_td_max_attendu.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_min_sup"
                    :error-messages="heTDMinSupErrors"
                    label="Nombre d'heures (équivalent TD) minimal supplémentaires"
                    required
                    clearable
                    @input="$v.nb_he_td_min_sup.$touch()"
                    @blur="$v.nb_he_td_min_sup.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_max_sup"
                    :error-messages="heTDMaxSupErrors"
                    label="Nombre d'heures (équivalent TD) maximal supplémentaires"
                    required
                    clearable
                    @input="$v.nb_he_td_max_sup.$touch()"
                    @blur="$v.nb_he_td_max_sup.$touch()"
                ></v-text-field>
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
import {mapState} from "vuex";
import {validationMixin} from "vuelidate";
import {maxLength, required, decimal} from "vuelidate/lib/validators";

export default {
  name: "ReadStatuts",
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(3)},
    nb_he_td_min_attendu: {required, decimal},
    nb_he_td_max_attendu: {required, decimal},
    nb_he_td_min_sup: {required, decimal},
    nb_he_td_max_sup: {required, decimal},
  },
  data: () => ({
    showDetails: false,
    form: false,
    methods: "POST",
    sortNom: false,
    id: '',
    nom: '',
    surnom: '',
    nb_he_td_min_attendu: '',
    nb_he_td_max_attendu: '',
    nb_he_td_min_sup: '',
    nb_he_td_max_sup: '',
  }),
  mounted() {
    this.$store.dispatch('loadStatuts');
  },
  computed: {
    ...mapState(['statuts', 'enseignants']),
    nomErrors() {
      const errors = []
      if (!this.$v.nom.$dirty) return errors
      !this.$v.nom.maxLength && errors.push('Le nom ne doit pas faire plus de 255 caractères')
      !this.$v.nom.required && errors.push('Le nom est obligatoire.')
      return errors
    },
    surnomErrors() {
      const errors = []
      if (!this.$v.surnom.$dirty) return errors
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 255 caractères')
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire')
      return errors
    },
    heTDMinAttenduErrors() {
      const errors = []
      if (!this.$v.nb_he_td_min_attendu.$dirty) return errors
      !this.$v.nb_he_td_min_attendu.decimal && errors.push('Le Nombre d\'heures (équivalent TD) minimal attendu doit être un numérique')
      !this.$v.nb_he_td_min_attendu.required && errors.push('Le Nombre d\'heures (équivalent TD) minimal attendu est obligatoire')
      return errors
    },
    heTDMaxAttenduErrors() {
      const errors = []
      if (!this.$v.nb_he_td_max_attendu.$dirty) return errors
      !this.$v.nb_he_td_max_attendu.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximal attendu doit être un numérique')
      !this.$v.nb_he_td_max_attendu.required && errors.push('Le Nombre d\'heures (équivalent TD) maximal attendu est obligatoire')
      return errors
    },
    heTDMinSupErrors() {
      const errors = []
      if (!this.$v.nb_he_td_min_sup.$dirty) return errors
      !this.$v.nb_he_td_min_sup.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximal supplémentaires doit être un numérique')
      !this.$v.nb_he_td_min_sup.required && errors.push('Le Nombre d\'heures (équivalent TD) maximal supplémentaires est obligatoire')
      return errors
    },
    heTDMaxSupErrors() {
      const errors = []
      if (!this.$v.nb_he_td_max_attendu.$dirty) return errors
      !this.$v.nb_he_td_max_sup.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximal supplémentaires doit être un numérique')
      !this.$v.nb_he_td_max_sup.required && errors.push('Le Nombre d\'heures (équivalent TD) maximal supplémentaires est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const statut = {
        id: this.id,
        nom: this.nom,
        surnom: this.surnom,
        nb_he_td_min_attendu: this.nb_he_td_min_attendu,
        nb_he_td_max_attendu: this.nb_he_td_max_attendu,
        nb_he_td_min_sup: this.nb_he_td_min_sup,
        nb_he_td_max_sup: this.nb_he_td_max_sup,
      };
      if (this.methods === 'POST'){
        this.$store.commit('ADD_Statut',statut);
      } else {
        this.$store.commit('EDIT_Statut',statut);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.nom = ''
      this.surnom = ''
      this.nb_he_td_min_attendu = ''
      this.nb_he_td_max_attendu = ''
      this.nb_he_td_min_sup = ''
      this.nb_he_td_max_sup = ''
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(statut) {
      this.methods = 'PUT'

      this.id = statut.id
      this.nom = statut.nom
      this.surnom = statut.surnom
      this.nb_he_td_min_attendu = statut.nb_he_td_min_attendu
      this.nb_he_td_max_attendu = statut.nb_he_td_max_attendu
      this.nb_he_td_min_sup = statut.nb_he_td_min_sup
      this.nb_he_td_max_sup = statut.nb_he_td_max_sup
      this.form = true;
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false
        this.statuts.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase())
      } else {
        this.sortNom = true
        this.statuts.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase())
      }
    },
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