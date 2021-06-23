<template>
  <v-container>
    <v-row>
      <v-col
          v-for="f in formations"
          :key="f.id"
          sm="12"
      >
        <v-card>
          <v-card-title class="text-h5">
            <v-spacer></v-spacer>
            <small class="text-body-1 mr-2">Verrou</small>
            <v-edit-dialog
                :return-value.sync="f.verrou"
                large
                @save="save(f)"
                cancel-text="Annuler"
                save-text="Valider"
            >
              <v-btn
                  outlined
                  rounded
                  :color="f.verrou ? 'success' : 'error'"
              >
                {{ f.verrou ? "Activé" : "Désactivé" }}
              </v-btn>
              <template v-slot:input>
                <div class="d-flex justify-center">
                  <v-switch
                      v-model="f.verrou"
                      :true-value="1"
                      :false-value="0"
                      color="success"
                      label="Verrou"
                  ></v-switch>
                </div>
              </template>
            </v-edit-dialog>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <ReadElements :racine="returnElement(f.element_id)" :flat="true" :add-btn="false" :disabled="Boolean(f.verrou)"></ReadElements>
          </v-card-text>
          <v-divider></v-divider>
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
              <span class="headline" v-else>Modifier la formation</span>
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
                  :label="'Verrouiller'"
                  color="success"
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
</template>

<script>
import {validationMixin} from "vuelidate";
import {numeric, required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import ReadElements from "./ReadElements";

export default {
  name: "ReadFormation",
  components: {ReadElements},
  mixins: [validationMixin],
  props: ['formations'],

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
    this.$store.dispatch('loadGenerique', 'projets')
    this.$store.dispatch('loadProjetsNonArchive')
    this.$store.dispatch('loadGenerique', 'elements')
    this.$store.dispatch('loadElementsLevel', 0)
  },
  computed: {
    ...mapState(['projets', 'elements', 'elementsLevel', 'projetsArchive']),
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
    save(formation){
      this.$store.commit('EDIT_Formations', formation);
    },
    returnElement(id){
      let index = this.elements.findIndex(element => element.id === id);
      return [this.elements[index]]
    },
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length)
    },
  }
}
</script>

<style scoped>
</style>