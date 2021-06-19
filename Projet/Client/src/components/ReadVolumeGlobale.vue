<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center text-h4">Liste des volumes globaux</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!volumesGlobaux.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Nom de l'UE</th>
                <th>Nom de l'intervanant</th>
                <th>Numéro de semaine</th>
                <th>Volume horaire pour les CM</th>
                <th>Volume horaire pour les TD</th>
                <th>Volume horaire pour les TP</th>
                <th>Volume horaire pour les Partiels</th>
                <th>Opération</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="v in volumesGlobaux"
                  :key="v.name"
              >
                <td>{{ returnElement(v.element_id).titre  }}</td>
                <td>{{ returnIntervenant(v.intervenant_id).prenom  }}{{ returnIntervenant(v.intervenant_id).nom  }}</td>
                <td>{{ v.num_semaine }}</td>
                <td>{{ v.vol_hor_cm }}</td>
                <td>{{ v.vol_hor_td }}</td>
                <td>{{ v.vol_hor_tp }}</td>
                <td>{{ v.vol_hor_partiel }}</td>
                <td>
                  <v-btn
                      icon
                      @click="edit(v)"
                  >
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-btn
                      icon
                      @click="copy(v)"
                  >
                    <v-icon small>file_copy</v-icon>
                  </v-btn>
                  <v-btn
                      icon
                      @click="deleteItem(v)"
                  >
                    <v-icon small color="red darken-1">delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
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
                <span class="headline" v-if="methods === 'POST'">Ajouter un volume hebdomadaire</span>
                <span class="headline" v-else>Modifier un volume hebdomadaire</span>
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
                <v-select
                    v-model="intervenant_id"
                    :items="intervenants"
                    :item-text="item => returnIntervenant(item.id).prenom + ' ' + returnIntervenant(item.id).nom"
                    item-value="id"
                    label="Intervenant"
                    clearable
                    :error-messages="intervenantErrors"
                    @input="$v.intervenant_id.$touch()"
                    @blur="$v.intervenant_id.$touch()"
                    required
                ></v-select>
                <v-text-field
                    v-model="num_semaine"
                    :error-messages="num_semaineErrors"
                    label="Numéro de semaines"
                    required
                    clearable
                    @input="$v.num_semaine.$touch()"
                    @blur="$v.num_semaine.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_cm"
                    :error-messages="vol_hor_cmErrors"
                    label="Volume horaire par défaut pour les CM"
                    required
                    clearable
                    @input="$v.vol_hor_cm.$touch()"
                    @blur="$v.vol_hor_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_td"
                    :error-messages="vol_hor_tdErrors"
                    label="Volume horaire par défaut pour les TD"
                    required
                    clearable
                    @input="$v.vol_hor_td.$touch()"
                    @blur="$v.vol_hor_td.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_tp"
                    :error-messages="vol_hor_tpErrors"
                    label="Volume horaire par défaut pour les TP"
                    required
                    clearable
                    @input="$v.vol_hor_tp.$touch()"
                    @blur="$v.vol_hor_tp.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_partiel"
                    :error-messages="vol_hor_partielErrors"
                    label="Volume horaire par défaut pour les partiels"
                    required
                    clearable
                    @input="$v.vol_hor_partiel.$touch()"
                    @blur="$v.vol_hor_partiel.$touch()"
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
import {between, decimal, required} from "vuelidate/lib/validators";

export default {
  name: "ReadVolumeGlobale",
  mixins: [validationMixin],

  validations: {
    num_semaine: {required, decimal},
    vol_hor_cm: {required, decimal, between: between(0, 50.0)},
    vol_hor_td: {required, decimal, between: between(0, 50.0)},
    vol_hor_tp: {required, decimal, between: between(0, 50.0)},
    vol_hor_partiel: {required, decimal, between: between(0, 50.0)},
    element_id: {required},
    intervenant_id : {required},
  },
  data: () => ({
    form: false,
    methods: "POST",
    id: '',
    num_semaine: '',
    vol_hor_cm: '',
    vol_hor_td: '',
    vol_hor_tp: '',
    vol_hor_partiel: '',
    element_id: '',
    intervenant_id : '',
  }),
  mounted() {
    this.$store.dispatch('loadElementsLevel', 3)
    this.$store.dispatch('loadGenerique', 'elements')
    this.$store.dispatch('loadGenerique', 'intervenants')
    this.$store.dispatch('loadGenerique', 'enseignants')
    this.$store.dispatch('loadGenerique', 'volumes-globaux')
  },
  computed: {
    ...mapState(['elementsLevel', 'elements', 'intervenants', 'enseignants', 'volumesGlobaux']),
    elementErrors() {
      const errors = []
      if (!this.$v.element_id.$dirty) return errors
      !this.$v.element_id.required && errors.push('Veuillez sélectionner un élément')
      return errors
    },
    intervenantErrors() {
      const errors = []
      if (!this.$v.intervenant_id .$dirty) return errors
      !this.$v.intervenant_id .required && errors.push('Veuillez sélectionner un intervenant')
      return errors
    },
    num_semaineErrors() {
      const errors = []
      if (!this.$v.num_semaine.$dirty) return errors
      !this.$v.num_semaine.decimal && errors.push('Le numéro de semaines doit être un numérique')
      !this.$v.num_semaine.required && errors.push('Le numéro de semaines est obligatoire')
      return errors
    },
    vol_hor_cmErrors() {
      const errors = []
      if (!this.$v.vol_hor_cm.$dirty) return errors
      !this.$v.vol_hor_cm.decimal && errors.push('Le volume horaire pour les CM doit être un numérique')
      !this.$v.vol_hor_cm.between && errors.push('Le volume horaire pour les CM doit être compris entre 0 et 50.0')
      !this.$v.vol_hor_cm.required && errors.push('Le volume horaire pour les CM est obligatoire')
      return errors
    },
    vol_hor_tdErrors() {
      const errors = []
      if (!this.$v.vol_hor_td.$dirty) return errors
      !this.$v.vol_hor_td.decimal && errors.push('Le volume horaire pour les TD doit être un numérique')
      !this.$v.vol_hor_td.between && errors.push('Le volume horaire pour les CM doit être compris entre 0 et 50.0')
      !this.$v.vol_hor_td.required && errors.push('Le volume horaire pour les TD est obligatoire')
      return errors
    },
    vol_hor_tpErrors() {
      const errors = []
      if (!this.$v.vol_hor_tp.$dirty) return errors
      !this.$v.vol_hor_tp.decimal && errors.push('Le volume horaire pour les TP doit être un numérique')
      !this.$v.vol_hor_tp.between && errors.push('Le volume horaire pour les CM doit être compris entre 0 et 50.0')
      !this.$v.vol_hor_tp.required && errors.push('Le volume horaire pour les TP est obligatoire')
      return errors
    },
    vol_hor_partielErrors() {
      const errors = []
      if (!this.$v.vol_hor_partiel.$dirty) return errors
      !this.$v.vol_hor_partiel.decimal && errors.push('Le volume horaire pour les partiels doit être un numérique')
      !this.$v.vol_hor_partiel.between && errors.push('Le volume horaire pour les CM doit être compris entre 0 et 50.0')
      !this.$v.vol_hor_partiel.required && errors.push('Le volume horaire pour les partiels est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const volumeGlobale = {
        id: this.id,
        num_semaine: this.num_semaine,
        vol_hor_cm: this.vol_hor_cm,
        vol_hor_td: this.vol_hor_td,
        vol_hor_tp: this.vol_hor_tp,
        vol_hor_partiel: this.vol_hor_partiel,
        element_id: this.element_id,
        intervenant_id : this.intervenant_id ,
      }
      if (this.methods === 'POST'){
        this.$store.commit('ADD_VolumesGlobaux', volumeGlobale);
      } else {
        this.$store.commit('EDIT_VolumesGlobaux', volumeGlobale);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.num_semaine = ''
      this.vol_hor_cm = ''
      this.vol_hor_td = ''
      this.vol_hor_tp = ''
      this.vol_hor_partiel = ''
      this.element_id = null
      this.intervenant_id = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(volumeGlobale) {
      this.methods = 'PUT'

      this.id = volumeGlobale.id
      this.num_semaine = volumeGlobale.num_semaine
      this.vol_hor_cm = volumeGlobale.vol_hor_cm
      this.vol_hor_td = volumeGlobale.vol_hor_td
      this.vol_hor_tp = volumeGlobale.vol_hor_tp
      this.vol_hor_partiel = volumeGlobale.vol_hor_partiel
      this.element_id = volumeGlobale.element_id
      this.intervenant_id = volumeGlobale.intervenant_id
      this.form = true;
    },
    deleteItem(volumeGlobale){
      this.$store.commit('DELETE_VolumeGlobaux', volumeGlobale.id);
    },
    copy(volumeGlobale) {
      this.$store.commit('COPY_VolumesGlobaux', volumeGlobale.id);
    },
    returnElement(id){
      let index = this.elementsLevel.findIndex(elementLevel => elementLevel.id === id);
      let indexP = this.elements.findIndex(element => element.id === this.elementsLevel[index].parent);
      return {titre:this.elementsLevel[index].titre, sousTitre:this.elements[indexP].surnom}
    },
    returnIntervenant(id){
      let index = this.intervenants.findIndex(i => i.id === id);
      var intervenant = this.intervenants[index]
      let indexE = this.enseignants.findIndex(e => e.id === intervenant.enseignant_id);
      return this.enseignants[indexE]
    },
  }
}
</script>

<style scoped>
</style>