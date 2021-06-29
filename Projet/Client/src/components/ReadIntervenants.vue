<template>
  <v-container>
    <v-row>
      <v-col
          v-for="i in intervenants"
          :key="i.id"
          sm="4"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">{{ returnEnseignant(i.enseignant_id).prenom }} {{ returnEnseignant(i.enseignant_id).nom }}</v-card-title>
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
                      color="error darken-1"
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
              <span class="headline" v-else>Modifier l'intervenant</span>
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
                  v-model="enseignant_id"
                  :items="enseignantByProjetNotInIntervenant"
                  :item-text="item => item.prenom +' '+ item.nom"
                  item-value="id"
                  label="Enseignant"
                  clearable
                  multiple
                  chips
                  :disabled="methods === 'PUT'"
                  no-data-text="Tous les enseignants interviennent déjà dans le projet"
                  :rules="rules.selectEnseignant"
                  required
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0 ">
                    <span>{{ item.prenom + ' ' + item.nom }}</span>
                  </v-chip>
                  <v-chip v-if="index === 1 ">
                    <span>{{ item.prenom + ' ' + item.nom }}</span>
                  </v-chip>
                  <span
                      v-if="index === 2"
                      class="grey--text text-caption"
                  >
                    (+{{ enseignant_id.length - 2 }})
                  </span>
                </template>
              </v-select>
              <div class="ma-0 pa-0" v-if="methods === 'PUT'">
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
    <v-row>
      <v-col>
        <v-btn
            class="v-btn--addElement"
            color="success"
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
import {decimal, numeric, required} from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "ReadIntervenants",
  mixins: [validationMixin],
  props: ['intervenants'],

  validations: {
    nb_he_td_min_attendu_projet: {required, decimal},
    nb_he_td_max_attendu_projet: {required, decimal},
    nb_he_td_min_sup_projet: {required, decimal},
    nb_he_td_max_sup_projet: {required, decimal},
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
    enseignant_id: [],

    enseignantByProjetNotInIntervenant: [],

    rules: {
      selectEnseignant: [(v) =>  v.length > 0 || "Veuillez sélectionner un enseignant"],
    }
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'enseignants')
    this.$store.dispatch('loadGenerique', 'projets')
  },
  computed: {
    ...mapState(['enseignants', 'projets']),
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
      if (this.methods === 'POST'){
        this.$v.$touch()
        if (this.enseignant_id.length <= 0) {
          return;
        } else {
          for (let i = 0; i < this.enseignant_id.length; i++) {
            var enseignant = this.returnEnseignant(this.enseignant_id[i])
            var intervenant = {
              enseignant_id : this.enseignant_id[i],
              projet_id : Number(this.$route.params.id),
              nb_he_td_min_attendu_projet : enseignant.statut.nb_he_td_min_attendu,
              nb_he_td_max_attendu_projet : enseignant.statut.nb_he_td_max_attendu,
              nb_he_td_min_sup_projet : enseignant.statut.nb_he_td_min_sup,
              nb_he_td_max_sup_projet : enseignant.statut.nb_he_td_max_sup,
            }
           this.$store.commit('ADD_Intervenant', intervenant)
          }
        }
      } else {
        this.$v.$touch()
        if (this.$v.$invalid) return;
        const intervenant = {
          id: this.id,
          nb_he_td_min_attendu_projet: this.nb_he_td_min_attendu_projet,
          nb_he_td_max_attendu_projet: this.nb_he_td_max_attendu_projet,
          nb_he_td_min_sup_projet: this.nb_he_td_min_sup_projet,
          nb_he_td_max_sup_projet: this.nb_he_td_max_sup_projet,
          projet_id: this.projet_id,
          enseignant_id: this.enseignant_id,
        }
        this.$store.commit('EDIT_Intervenant', intervenant);
      }
      this.form = false
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
      this.enseignant_id = []
    },
    close() {
      this.form = false
      this.getEnseignantProjetNotInIntervenant()
      this.methods = 'POST'
      this.clear()
    },
    addIntervenant() {
      this.getEnseignantProjetNotInIntervenant()
      this.projet_id = Number(this.$route.params.id)
      this.methods = 'POST'
      this.form = true
    },
    edit(intervenant) {
      this.methods = 'PUT'
      this.getEnseignant()

      this.id = intervenant.id
      this.nb_he_td_min_attendu_projet = intervenant.nb_he_td_min_attendu_projet
      this.nb_he_td_max_attendu_projet = intervenant.nb_he_td_max_attendu_projet
      this.nb_he_td_min_sup_projet = intervenant.nb_he_td_min_sup_projet
      this.nb_he_td_max_sup_projet = intervenant.nb_he_td_max_sup_projet
      this.projet_id = intervenant.projet_id
      this.enseignant_id = intervenant.enseignant_id
      this.form = true;
    },
    returnEnseignant(id){
      let index = this.enseignants.findIndex(enseignant => enseignant.id === id);
      return this.enseignants[index]
    },
    initHoraire(enseignant_id){
      var enseignant = this.returnEnseignant(enseignant_id)
      this.nb_he_td_min_attendu_projet = enseignant.statut.nb_he_td_min_attendu
      this.nb_he_td_max_attendu_projet = enseignant.statut.nb_he_td_max_attendu
      this.nb_he_td_min_sup_projet = enseignant.statut.nb_he_td_min_sup
      this.nb_he_td_max_sup_projet = enseignant.statut.nb_he_td_max_sup
    },
    toTime(date) {
      return new Date(date).toISOString().substr(0, 4)
    },
    getEnseignantProjetNotInIntervenant(){
      axios.get('/enseignants/projets/'+ this.$route.params.id +'/get')
        .then(response => (this.enseignantByProjetNotInIntervenant = response.data))
        .catch(error => {
        console.log('Erreur : ', error)
      });
    },
    getEnseignant(){
      axios.get('/enseignants/get')
        .then(response => (this.enseignantByProjetNotInIntervenant = response.data))
        .catch(error => {
        console.log('Erreur : ', error)
      });
    },
    submitGrpInterv() {
      this.$v.$touch()
      if (this.enseignant_id.length <= 0) {
        return;
      } else {
        for (let i = 0; i < this.enseignant_id.length; i++) {
          this.$store.commit('ADD_Intervenant', {module: this.idElement, intervenant: this.intervenant_id[i], nb_semaine_deb: 1, nb_semaine_fin: this.nb_semaine})
        }
      }
      this.closeGrpIntev()
    },
  }
}
</script>

<style scoped>
</style>