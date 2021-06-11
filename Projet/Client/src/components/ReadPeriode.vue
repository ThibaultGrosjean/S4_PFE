<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des périodes</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!periodes.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="p in periodes"
               :key="p.id"
               sm="4"
        >
          <v-card>
            <v-card-title>{{ returnElement(p.element_id).titre }}</v-card-title>
            <v-card-subtitle>{{ returnElement(p.element_id).sousTitre }}</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p>Nombre de semaines :<b>{{ p.nb_semaine }}</b></p>
              <p>Nombre de groupes* pour les CM :<b>{{ p.nb_groupe_defaut_cm }}</b></p>
              <p>Nombre de groupes* pour les TD : <b>{{ p.nb_groupe_defaut_td }}</b></p>
              <p>Nombre de groupes* pour les TP : <b>{{ p.nb_groupe_defaut_tp }}</b></p>
              <p>Nombre de groupes* pour les partiels : <b>{{ p.nb_groupe_defaut_partiel }}</b></p>
              <small>* par défaut</small>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(p)"
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
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        color="red darken-1"
                        v-bind="attrs"
                        v-on="on"
                    >
                      delete
                    </v-icon>
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
                <span class="headline" v-if="methods === 'POST'">Ajouter une période</span>
                <span class="headline" v-else>Modifier une période</span>
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
                <v-select
                    v-model="element_id"
                    :items="elementsLevel"
                    :item-text="item => returnElement(item.id).titre + ' (' + returnElement(item.id).sousTitre + ')'"
                    item-value="id"
                    label="Période"
                    clearable
                    :error-messages="elementErrors"
                    @input="$v.element_id.$touch()"
                    @blur="$v.element_id.$touch()"
                    required
                ></v-select>
                <v-text-field
                    v-model="nb_semaine"
                    :error-messages="nb_semaineErrors"
                    label="Nombre de semaines"
                    required
                    clearable
                    @input="$v.nb_semaine.$touch()"
                    @blur="$v.nb_semaine.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_defaut_cm"
                    :error-messages="nb_groupe_defaut_cmErrors"
                    label="Nombre de groupes par défaut pour les CM"
                    required
                    clearable
                    @input="$v.nb_groupe_defaut_cm.$touch()"
                    @blur="$v.nb_groupe_defaut_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_defaut_td"
                    :error-messages="nb_groupe_defaut_tdErrors"
                    label="Nombre de groupes par défaut pour les TD"
                    required
                    clearable
                    @input="$v.nb_groupe_defaut_td.$touch()"
                    @blur="$v.nb_groupe_defaut_td.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_defaut_tp"
                    :error-messages="nb_groupe_defaut_tpErrors"
                    label="Nombre de groupes par défaut pour les TP"
                    required
                    clearable
                    @input="$v.nb_groupe_defaut_tp.$touch()"
                    @blur="$v.nb_groupe_defaut_tp.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_defaut_partiel"
                    :error-messages="nb_groupe_defaut_partielErrors"
                    label="Nombre de groupes par défaut pour les partiels"
                    required
                    clearable
                    @input="$v.nb_groupe_defaut_partiel.$touch()"
                    @blur="$v.nb_groupe_defaut_partiel.$touch()"
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
import {numeric, required} from "vuelidate/lib/validators";

export default {
  name: "ReadPeriodes",
  mixins: [validationMixin],

  validations: {
    nb_semaine: {required, numeric},
    nb_groupe_defaut_cm: {required, numeric},
    nb_groupe_defaut_td: {required, numeric},
    nb_groupe_defaut_tp: {required, numeric},
    nb_groupe_defaut_partiel: {required, numeric},
    element_id: {required},
  },
  data: () => ({
    form: false,
    methods: "POST",
    id: '',
    nb_semaine: '',
    nb_groupe_defaut_cm: 1,
    nb_groupe_defaut_td: 1,
    nb_groupe_defaut_tp: 1,
    nb_groupe_defaut_partiel: 1,
    element_id: '',
  }),
  mounted() {
    this.$store.dispatch('loadElementsLevel', 1)
    this.$store.dispatch('loadElements')
    this.$store.dispatch('loadPeriodes')
  },
  computed: {
    ...mapState(['elementsLevel', 'elements', 'periodes']),
    elementErrors() {
      const errors = []
      if (!this.$v.element_id.$dirty) return errors
      !this.$v.element_id.required && errors.push('Veuillez sélectionner un element')
      return errors
    },
    nb_semaineErrors() {
      const errors = []
      if (!this.$v.nb_semaine.$dirty) return errors
      !this.$v.nb_semaine.numeric && errors.push('Le Nombre de semaines doit être un numérique')
      !this.$v.nb_semaine.required && errors.push('Le Nombre de semaines est obligatoire')
      return errors
    },
    nb_groupe_defaut_cmErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_cm.$dirty) return errors
      !this.$v.nb_groupe_defaut_cm.numeric && errors.push('Le Nombre de groupes pour les CM doit être un numérique')
      !this.$v.nb_groupe_defaut_cm.required && errors.push('Le Nombre de groupes pour les CM est obligatoire')
      return errors
    },
    nb_groupe_defaut_tdErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_td.$dirty) return errors
      !this.$v.nb_groupe_defaut_td.numeric && errors.push('Le Nombre de groupes pour les TD doit être un numérique')
      !this.$v.nb_groupe_defaut_td.required && errors.push('Le Nombre de groupes pour les TD est obligatoire')
      return errors
    },
    nb_groupe_defaut_tpErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_tp.$dirty) return errors
      !this.$v.nb_groupe_defaut_tp.numeric && errors.push('Le Nombre de groupes pour les TP doit être un numérique')
      !this.$v.nb_groupe_defaut_tp.required && errors.push('Le Nombre de groupes pour les TP est obligatoire')
      return errors
    },
    nb_groupe_defaut_partielErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_partiel.$dirty) return errors
      !this.$v.nb_groupe_defaut_partiel.numeric && errors.push('Le Nombre de groupes pour les partiels doit être un numérique')
      !this.$v.nb_groupe_defaut_partiel.required && errors.push('Le Nombre de groupes pour les partiels est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const periode = {
        id: this.id,
        nb_semaine: this.nb_semaine,
        nb_groupe_defaut_cm: this.nb_groupe_defaut_cm,
        nb_groupe_defaut_td: this.nb_groupe_defaut_td,
        nb_groupe_defaut_tp: this.nb_groupe_defaut_tp,
        nb_groupe_defaut_partiel: this.nb_groupe_defaut_partiel,
        element_id: this.element_id,
      }
      if (this.methods === 'POST'){
        this.$store.commit('ADD_Periodes', periode);
      } else {
        this.$store.commit('EDIT_Periodes', periode);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.nb_semaine = ''
      this.nb_groupe_defaut_cm = 1
      this.nb_groupe_defaut_td = 1
      this.nb_groupe_defaut_tp = 1
      this.nb_groupe_defaut_partiel = 1
      this.element_id = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(periode) {
      this.methods = 'PUT'

      this.id = periode.id
      this.nb_semaine = periode.nb_semaine
      this.nb_groupe_defaut_cm = periode.nb_groupe_defaut_cm
      this.nb_groupe_defaut_td = periode.nb_groupe_defaut_td
      this.nb_groupe_defaut_tp = periode.nb_groupe_defaut_tp
      this.nb_groupe_defaut_partiel = periode.nb_groupe_defaut_partiel
      this.element_id = periode.element_id
      this.form = true;
    },
    returnElement(id){
      let index = this.elementsLevel.findIndex(elementLevel => elementLevel.id === id);
      let indexP = this.elements.findIndex(element => element.id === this.elementsLevel[index].parent);
      return {titre:this.elementsLevel[index].titre, sousTitre:this.elements[indexP].surnom}
    },
  }
}
</script>

<style scoped>
</style>