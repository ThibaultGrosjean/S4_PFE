<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des groupes d'intervenants</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!groupesIntervenants.length">
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
                <th>Nombre de groupe pour les CM</th>
                <th>Nombre de groupe pour les TD</th>
                <th>Nombre de groupe pour les TP</th>
                <th>Nombre de groupe pour les Partiels</th>
                <th>Opération</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="g in groupesIntervenants"
                  :key="g.name"
              >
                <td>{{ returnElement(g.element_id).titre  }}</td>
                <td>{{ returnIntervenant(g.intervenant_id).prenom  }}{{ returnIntervenant(g.intervenant_id).nom  }}</td>
                <td>{{ g.num_semaine }}</td>
                <td>{{ g.nb_groupe_cm }}</td>
                <td>{{ g.nb_groupe_td }}</td>
                <td>{{ g.nb_groupe_tp }}</td>
                <td>{{ g.nb_groupe_partiel }}</td>
                <td>
                  <v-btn
                      icon
                      @click="edit(g)"
                  >
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon small>file_copy</v-icon>
                  </v-btn>
                  <v-btn
                      icon
                      @click="deleteItem(g)"
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
                <span class="headline" v-if="methods === 'POST'">Ajouter un groupe d'intervenant</span>
                <span class="headline" v-else>Modifier un groupe d'intervenant</span>
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
                    label="Élément"
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
                    v-model="nb_groupe_cm"
                    :error-messages="nb_groupe_cmErrors"
                    label="Nombre de groupe par défaut pour les CM"
                    required
                    clearable
                    @input="$v.nb_groupe_cm.$touch()"
                    @blur="$v.nb_groupe_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_td"
                    :error-messages="nb_groupe_tdErrors"
                    label="Nombre de groupe par défaut pour les TD"
                    required
                    clearable
                    @input="$v.nb_groupe_td.$touch()"
                    @blur="$v.nb_groupe_td.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_tp"
                    :error-messages="nb_groupe_tpErrors"
                    label="Nombre de groupe par défaut pour les TP"
                    required
                    clearable
                    @input="$v.nb_groupe_tp.$touch()"
                    @blur="$v.nb_groupe_tp.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_partiel"
                    :error-messages="nb_groupe_partielErrors"
                    label="Nombre de groupe par défaut pour les partiels"
                    required
                    clearable
                    @input="$v.nb_groupe_partiel.$touch()"
                    @blur="$v.nb_groupe_partiel.$touch()"
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
  name: "ReadGroupeIntervenant",
  mixins: [validationMixin],

  validations: {
    num_semaine: {required, numeric},
    nb_groupe_cm: {required, numeric},
    nb_groupe_td: {required, numeric},
    nb_groupe_tp: {required, numeric},
    nb_groupe_partiel: {required, numeric},
    element_id: {required},
    intervenant_id : {required},
  },
  data: () => ({
    form: false,
    methods: "POST",
    id: '',
    num_semaine: '',
    nb_groupe_cm: '',
    nb_groupe_td: '',
    nb_groupe_tp: '',
    nb_groupe_partiel: '',
    element_id: '',
    intervenant_id : '',
  }),
  mounted() {
    this.$store.dispatch('loadElementsLevel', 3)
    this.$store.dispatch('loadElements')
    this.$store.dispatch('loadEnseignants')
    this.$store.dispatch('loadIntervenants')
    this.$store.dispatch('loadGroupesIntervenants')
  },
  computed: {
    ...mapState(['elementsLevel', 'elements', 'intervenants', 'enseignants', 'groupesIntervenants']),
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
      !this.$v.num_semaine.numeric && errors.push('Le Numéro de semaines doit être un numérique')
      !this.$v.num_semaine.required && errors.push('Le Numéro de semaines est obligatoire')
      return errors
    },
    nb_groupe_cmErrors() {
      const errors = []
      if (!this.$v.nb_groupe_cm.$dirty) return errors
      !this.$v.nb_groupe_cm.numeric && errors.push('Le Nombre de groupe pour les CM doit être un numérique')
      !this.$v.nb_groupe_cm.required && errors.push('Le Nombre de groupe pour les CM est obligatoire')
      return errors
    },
    nb_groupe_tdErrors() {
      const errors = []
      if (!this.$v.nb_groupe_td.$dirty) return errors
      !this.$v.nb_groupe_td.numeric && errors.push('Le Nombre de groupe pour les TD doit être un numérique')
      !this.$v.nb_groupe_td.required && errors.push('Le Nombre de groupe pour les TD est obligatoire')
      return errors
    },
    nb_groupe_tpErrors() {
      const errors = []
      if (!this.$v.nb_groupe_tp.$dirty) return errors
      !this.$v.nb_groupe_tp.numeric && errors.push('Le Nombre de groupe pour les TP doit être un numérique')
      !this.$v.nb_groupe_tp.required && errors.push('Le Nombre de groupe pour les TP est obligatoire')
      return errors
    },
    nb_groupe_partielErrors() {
      const errors = []
      if (!this.$v.nb_groupe_partiel.$dirty) return errors
      !this.$v.nb_groupe_partiel.numeric && errors.push('Le Nombre de groupe pour les partiels doit être un numérique')
      !this.$v.nb_groupe_partiel.required && errors.push('Le Nombre de groupe pour les partiels est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const groupeIntervenant = {
        id: this.id,
        num_semaine: this.num_semaine,
        nb_groupe_cm: this.nb_groupe_cm,
        nb_groupe_td: this.nb_groupe_td,
        nb_groupe_tp: this.nb_groupe_tp,
        nb_groupe_partiel: this.nb_groupe_partiel,
        element_id: this.element_id,
        intervenant_id : this.intervenant_id ,
      }
      if (this.methods === 'POST'){
        this.$store.commit('ADD_GroupesIntervenants', groupeIntervenant);
      } else {
        this.$store.commit('EDIT_GroupesIntervenants', groupeIntervenant);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.num_semaine = ''
      this.nb_groupe_cm = ''
      this.nb_groupe_td = ''
      this.nb_groupe_tp = ''
      this.nb_groupe_partiel = ''
      this.element_id = null
      this.intervenant_id = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(groupeIntervenant) {
      this.methods = 'PUT'

      this.id = groupeIntervenant.id
      this.num_semaine = groupeIntervenant.num_semaine
      this.nb_groupe_cm = groupeIntervenant.nb_groupe_cm
      this.nb_groupe_td = groupeIntervenant.nb_groupe_td
      this.nb_groupe_tp = groupeIntervenant.nb_groupe_tp
      this.nb_groupe_partiel = groupeIntervenant.nb_groupe_partiel
      this.element_id = groupeIntervenant.element_id
      this.intervenant_id = groupeIntervenant.intervenant_id
      this.form = true;
    },
    deleteItem(groupeIntervenant){
      this.$store.commit('DELETE_GroupesIntervenants', groupeIntervenant.id);
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