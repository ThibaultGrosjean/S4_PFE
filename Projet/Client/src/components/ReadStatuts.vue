<template>
  <v-container>
    <v-row>
      <v-col v-for="s in statuts"
             :key="s.id"
             sm="4"
             class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">{{ s.nom }}</v-card-title>
          <v-card-subtitle class="text-subtitle-1">{{ s.surnom }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <p>HeTD* minimales attendues : <b>{{ s.nb_he_td_min_attendu }}</b></p>
            <p>HeTD* maximales attendues : <b>{{ s.nb_he_td_max_attendu }}</b></p>
            <p>HeTD* minimales sup. : <b>{{ s.nb_he_td_min_sup }}</b></p>
            <p>HeTD* maximales sup. : <b>{{ s.nb_he_td_max_sup }}</b></p>
            <small>* HeTD : Nombre d’heures équivalent TD</small>
          </v-card-text>
          <v-divider></v-divider>
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
                      @click="copy(s)"
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
                  label="Nombre d'heures (équivalent TD) minimales attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_min_attendu.$touch()"
                  @blur="$v.nb_he_td_min_attendu.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_max_attendu"
                  :error-messages="heTDMaxAttenduErrors"
                  label="Nombre d'heures (équivalent TD) maximales attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_max_attendu.$touch()"
                  @blur="$v.nb_he_td_max_attendu.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_min_sup"
                  :error-messages="heTDMinSupErrors"
                  label="Nombre d'heures (équivalent TD) minimales supplémentaires attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_min_sup.$touch()"
                  @blur="$v.nb_he_td_min_sup.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_max_sup"
                  :error-messages="heTDMaxSupErrors"
                  label="Nombre d'heures (équivalent TD) maximales supplémentaires attendues"
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
</template>

<script>
import {validationMixin} from "vuelidate";
import {maxLength, required, decimal} from "vuelidate/lib/validators";

export default {
  name: "ReadStatuts",
  mixins: [validationMixin],
  props: ['statuts'],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(255)},
    nb_he_td_min_attendu: {required, decimal},
    nb_he_td_max_attendu: {required, decimal},
    nb_he_td_min_sup: {required, decimal},
    nb_he_td_max_sup: {required, decimal},
  },
  data: () => ({
    form: false,
    methods: "POST",
    id: '',
    nom: '',
    surnom: '',
    nb_he_td_min_attendu: '',
    nb_he_td_max_attendu: '',
    nb_he_td_min_sup: '',
    nb_he_td_max_sup: '',
  }),
  computed: {
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
      !this.$v.nb_he_td_min_attendu.decimal && errors.push('Le Nombre d\'heures (équivalent TD) minimales attendues doit être un numérique')
      !this.$v.nb_he_td_min_attendu.required && errors.push('Le Nombre d\'heures (équivalent TD) minimales attendues est obligatoire')
      return errors
    },
    heTDMaxAttenduErrors() {
      const errors = []
      if (!this.$v.nb_he_td_max_attendu.$dirty) return errors
      !this.$v.nb_he_td_max_attendu.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximales attendues doit être un numérique')
      !this.$v.nb_he_td_max_attendu.required && errors.push('Le Nombre d\'heures (équivalent TD) maximales attendues est obligatoire')
      return errors
    },
    heTDMinSupErrors() {
      const errors = []
      if (!this.$v.nb_he_td_min_sup.$dirty) return errors
      !this.$v.nb_he_td_min_sup.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires doit être un numérique')
      !this.$v.nb_he_td_min_sup.required && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires est obligatoire')
      return errors
    },
    heTDMaxSupErrors() {
      const errors = []
      if (!this.$v.nb_he_td_max_attendu.$dirty) return errors
      !this.$v.nb_he_td_max_sup.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires doit être un numérique')
      !this.$v.nb_he_td_max_sup.required && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires est obligatoire')
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
    copy(statut) {
      this.$store.commit('COPY_Statut', statut.id);
    },
  },
}
</script>

<style scoped>
</style>