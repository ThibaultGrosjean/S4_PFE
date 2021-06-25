<template>
  <v-container>
    <v-row>
      <v-col
          v-for="i in intervenants"
          :key="i.id"
          sm="4"
      >
        <v-card>
          <v-card-title class="text-h5">{{ returnEnseignant(i.enseignant_id).prenom }} {{ returnEnseignant(i.enseignant_id).nom }}</v-card-title>
          <v-card-subtitle class="text-subtitle-1">{{ returnProjet(i.projet_id).nom }} {{ toTime(returnProjet(i.projet_id).date, 4) }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <p>Le Nombre d'heures minimales attendues pour le projet :<b>{{ i.nb_he_td_min_attendu_projet }}</b></p>
            <p>Le Nombre d'heures maximales attendues pour le projet : <b>{{ i.nb_he_td_max_attendu_projet }}</b></p>
            <p>Le Nombre d'heures minimales supplémentaires attendues pour le projet : <b>{{ i.nb_he_td_min_sup_projet }}</b></p>
            <p>Le Nombre d'heures maximales supplémentaires attendues pour le projet : <b>{{ i.nb_he_td_max_sup_projet }}</b></p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon>
                  <v-icon
                      v-bind="attrs"
                      v-on="on"
                      @click="edit(i)"
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
              <span class="headline" v-if="methods === 'POST'">Ajouter un intervenant</span>
              <span class="headline" v-else>Modifier un intervenant</span>
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
                  v-model="projet_id"
                  :items="projetsArchive"
                  :item-text="item => item.nom +' ('+ toTime(item.date) + ')'"
                  no-data-text="Aucun projet non archivé disponible"
                  item-value="id"
                  label="Projet"
                  clearable
                  :disabled="this.methods === 'POST'"
                  :error-messages="projetErrors"
                  @change="$v.projet_id.$touch()"
                  @blur="$v.projet_id.$touch()"
                  required
              ></v-select>
              <v-select
                  v-model="enseignant_id"
                  :items="enseignants"
                  :item-text="item => item.prenom +' '+ item.nom +' ('+item.statut.nom+')'"
                  item-value="id"
                  label="Enseignant"
                  clearable
                  :error-messages="enseignantErrors"
                  @change="initHoraire"
                  required
              ></v-select>
              <div class="ma-0 pa-0" v-if="this.enseignant_id">
                <v-text-field
                    v-model="nb_he_td_min_attendu_projet"
                    :error-messages="nb_he_td_min_attendu_projetErrors"
                    label="Nombre d'heures minimales attendues pour le projet"
                    required
                    clearable
                    @input="$v.nb_he_td_min_attendu_projet.$touch()"
                    @blur="$v.nb_he_td_min_attendu_projet.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_max_attendu_projet"
                    :error-messages="nb_he_td_max_attendu_projetErrors"
                    label="Nombre d'heures maximales attendues pour le projet"
                    required
                    clearable
                    @input="$v.nb_he_td_max_attendu_projet.$touch()"
                    @blur="$v.nb_he_td_max_attendu_projet.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_min_sup_projet"
                    :error-messages="nb_he_td_min_sup_projetErrors"
                    label="Nombre d'heures minimales supplémentaires attendues pour le projet"
                    required
                    clearable
                    @input="$v.nb_he_td_min_sup_projet.$touch()"
                    @blur="$v.nb_he_td_min_sup_projet.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_he_td_max_sup_projet"
                    :error-messages="nb_he_td_max_sup_projetErrors"
                    label="Nombre d'heures maximales supplémentaires attendues pour le projet"
                    required
                    clearable
                    @input="$v.nb_he_td_max_sup_projet.$touch()"
                    @blur="$v.nb_he_td_max_sup_projet.$touch()"
                ></v-text-field>
              </div>
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
            @click="addIntervenant"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import {validationMixin} from "vuelidate";
import {decimal, required} from "vuelidate/lib/validators";

export default {
  name: "ReadIntervenants",
  mixins: [validationMixin],
  props: ['intervenants'],

  validations: {
    nb_he_td_min_attendu_projet: {required, decimal},
    nb_he_td_max_attendu_projet: {required, decimal},
    nb_he_td_min_sup_projet: {required, decimal},
    nb_he_td_max_sup_projet: {required, decimal},
    projet_id: {required},
    enseignant_id: {required},
  },
  data: () => ({
    form: false,
    methods: "POST",
    id: '',
    nb_he_td_min_attendu_projet: '',
    nb_he_td_max_attendu_projet: '',
    nb_he_td_min_sup_projet: '',
    nb_he_td_max_sup_projet: '',
    projet_id: '',
    enseignant_id: '',
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'enseignants')
    this.$store.dispatch('loadGenerique', 'projets')
    this.$store.dispatch('loadProjetsNonArchive')
  },
  computed: {
    ...mapState(['enseignants', 'projets', 'projetsArchive']),
    projetErrors() {
      const errors = []
      if (!this.$v.projet_id.$dirty) return errors
      !this.$v.projet_id.required && errors.push('Veuillez sélectionner un projet')
      return errors
    },
    enseignantErrors() {
      const errors = []
      if (!this.$v.enseignant_id.$dirty) return errors
      !this.$v.enseignant_id.required && errors.push('Veuillez sélectionner un enseignant')
      return errors
    },
    nb_he_td_min_attendu_projetErrors() {
      const errors = []
      if (!this.$v.nb_he_td_min_attendu_projet.$dirty) return errors
      !this.$v.nb_he_td_min_attendu_projet.decimal && errors.push('Le Nombre d\'heures minimales attendues pour le projet doit être un numérique')
      !this.$v.nb_he_td_min_attendu_projet.required && errors.push('Le Nombre d\'heures minimales attendues pour le projet est obligatoire')
      return errors
    },
    nb_he_td_max_attendu_projetErrors() {
      const errors = []
      if (!this.$v.nb_he_td_max_attendu_projet.$dirty) return errors
      !this.$v.nb_he_td_max_attendu_projet.decimal && errors.push('Le Nombre d\'heures maximales attendues pour le projet doit être un numérique')
      !this.$v.nb_he_td_max_attendu_projet.required && errors.push('Le Nombre d\'heures maximales attendues pour le projet est obligatoire')
      return errors
    },
    nb_he_td_min_sup_projetErrors() {
      const errors = []
      if (!this.$v.nb_he_td_min_sup_projet.$dirty) return errors
      !this.$v.nb_he_td_min_sup_projet.decimal && errors.push('Le Nombre d\'heures minimales supplémentaires attendues pour le projet doit être un numérique')
      !this.$v.nb_he_td_min_sup_projet.required && errors.push('Le Nombre d\'heures minimales supplémentaires attendues pour le projet est obligatoire')
      return errors
    },
    nb_he_td_max_sup_projetErrors() {
      const errors = []
      if (!this.$v.nb_he_td_max_sup_projet.$dirty) return errors
      !this.$v.nb_he_td_max_sup_projet.decimal && errors.push('Le Nombre d\'heures maximales supplémentaires attendues pour le projet doit être un numérique')
      !this.$v.nb_he_td_max_sup_projet.required && errors.push('Le Nombre d\'heures maximales supplémentaires attendues pour le projet est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const intervenant = {
        id: this.id,
        nb_he_td_min_attendu_projet: this.nb_he_td_min_attendu_projet,
        nb_he_td_max_attendu_projet: this.nb_he_td_max_attendu_projet,
        nb_he_td_min_sup_projet: this.nb_he_td_min_sup_projet,
        nb_he_td_max_sup_projet: this.nb_he_td_max_sup_projet,
        projet_id: this.projet_id,
        enseignant_id: this.enseignant_id,
      }
      if (this.methods === 'POST'){
        this.$store.commit('ADD_Intervenant', intervenant);
      } else {
        this.$store.commit('EDIT_Intervenant', intervenant);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.nb_he_td_min_attendu_projet = ''
      this.nb_he_td_max_attendu_projet = ''
      this.nb_he_td_min_sup_projet = ''
      this.nb_he_td_max_sup_projet = ''
      this.projet_id = null
      this.enseignant_id = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    addIntervenant() {
      this.projet_id = Number(this.$route.params.id)
      this.methods = 'POST'
      this.form = !this.form
    },
    edit(intervenant) {
      this.methods = 'PUT'

      this.id = intervenant.id
      this.nb_he_td_min_attendu_projet = intervenant.nb_he_td_min_attendu_projet
      this.nb_he_td_max_attendu_projet = intervenant.nb_he_td_max_attendu_projet
      this.nb_he_td_min_sup_projet = intervenant.nb_he_td_min_sup_projet
      this.nb_he_td_max_sup_projet = intervenant.nb_he_td_max_sup_projet
      this.projet_id = intervenant.projet_id
      this.enseignant_id = intervenant.enseignant_id
      this.form = true;
    },
    returnProjet(id) {
      let index = this.projets.findIndex(projet => projet.id === id)
      return this.projets[index]
    },
    returnEnseignant(id){
      let index = this.enseignants.findIndex(enseignant => enseignant.id === id);
      return this.enseignants[index]
    },
    initHoraire(){
      var enseignant = this.returnEnseignant(this.enseignant_id)
      this.nb_he_td_min_attendu_projet = enseignant.statut.nb_he_td_min_attendu
      this.nb_he_td_max_attendu_projet = enseignant.statut.nb_he_td_max_attendu
      this.nb_he_td_min_sup_projet = enseignant.statut.nb_he_td_min_sup
      this.nb_he_td_max_sup_projet = enseignant.statut.nb_he_td_max_sup
    },
    toTime(date) {
      return new Date(date).toISOString().substr(0, 4)
    },
  }
}
</script>

<style scoped>
</style>