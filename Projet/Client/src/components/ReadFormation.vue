<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des formations</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!formations.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="f in formations"
               :key="f.id"
               sm="6"
        >
          <v-card>
            <v-card-title>{{ returnElement(f.element_id).titre }}</v-card-title>
            <v-card-subtitle><b>{{ returnProjet(f.projet_id).nom }}</b> {{ toTime(returnProjet(f.projet_id).date, 10) }}</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p class="mb-0">Verrou :
                <b><span class="red--text text--darken-1" v-if="f.verrou === 0">Désactivé</span>
                  <span class="green--text text--darken-1" v-else>Activé</span></b>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(f)"
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
                <span class="headline" v-if="methods === 'POST'">Ajouter une formation</span>
                <span class="headline" v-else>Modifier une formation</span>
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
                    :item-text="item => item.nom +' ('+ toTime(item.date, 4) + ')'"
                    no-data-text="Aucun projet non archivé disponible"
                    item-value="id"
                    label="Projet"
                    clearable
                    :error-messages="projetErrors"
                    @change="$v.projet_id.$touch()"
                    @blur="$v.projet_id.$touch()"
                    required
                ></v-select>
                <v-select
                    v-model="element_id"
                    :items="elementsLevel"
                    item-text="titre"
                    item-value="id"
                    label="Hierarchies arborescentes"
                    clearable
                    :error-messages="elementErrors"
                    @change="$v.element_id.$touch()"
                    @blur="$v.element_id.$touch()"
                    required
                ></v-select>
                <v-switch
                    v-if="this.methods !== 'POST'"
                    v-model="verrou"
                    inset
                    :label="'Verrouiller'"
                ></v-switch>
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
import {validationMixin} from "vuelidate";
import {numeric, required} from "vuelidate/lib/validators";
import {mapState} from "vuex";

export default {
  name: "ReadFormation",
  mixins: [validationMixin],

  validations: {
    projet_id: {required, numeric},
    element_id: {required, numeric},
  },
  data: () => ({
    form: false,
    methods: "POST",
    verrou: false,
    projet_id: '',
    element_id: '',
  }),
  mounted() {
    this.$store.dispatch('loadProjets')
    this.$store.dispatch('loadProjetsNonArchive')
    this.$store.dispatch('loadElements')
    this.$store.dispatch('loadElementsLevel', 0)
    this.$store.dispatch('loadFormations')
  },
  computed: {
    ...mapState(['projets', 'elements', 'elementsLevel', 'projetsArchive', 'formations']),
    projetErrors() {
      const errors = []
      if (!this.$v.projet_id.$dirty) return errors
      !this.$v.projet_id.required && errors.push('Veuillez sélectionner un projet')
      return errors
    },
    elementErrors() {
      const errors = []
      if (!this.$v.element_id.$dirty) return errors
      !this.$v.element_id.required && errors.push('Veuillez sélectionner un élément')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      const formation = {
        id: this.id,
        verrou: Number(this.verrou),
        projet_id: this.projet_id,
        element_id: this.element_id,
      }
      if (this.methods === 'POST'){
        this.$store.commit('ADD_Formations', formation);
      } else {
        this.$store.commit('EDIT_Formations', formation);
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.verrou = false
      this.projet_id = null
      this.element_id = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(formation) {
      this.methods = 'PUT'

      this.id = formation.id
      this.verrou = formation.verrou
      this.projet_id = formation.projet_id
      this.element_id = formation.element_id
      this.form = true;
    },
    returnProjet(id) {
      let index = this.projets.findIndex(projet => projet.id === id)
      return this.projets[index]
    },
    returnElement(id){
      let index = this.elements.findIndex(element => element.id === id);
      return this.elements[index]
    },
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length)
    },
  }
}
</script>

<style scoped>
</style>