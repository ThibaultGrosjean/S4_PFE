<template>
  <v-container>
    <v-row>
      <v-col
          v-for="f in formations"
          :key="f.id"
          sm="12"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    :color="f.verrou ? 'success' : 'gray'"
                    @click="saveVerrou(f)"
                >
                  <v-icon>{{ f.verrou ? "lock" : "lock_open" }}</v-icon>
                </v-btn>
              </template>
              <span>{{ f.verrou ? "Déverrouiller" : "Verrouiller " }}</span>
            </v-tooltip>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <ReadElements :racine="returnElement(f.element_id)" :disabled="Boolean(f.verrou)"></ReadElements>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>file_copy</v-icon>
                </v-btn>
              </template>
              <span>Dupliquer la formation</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="error darken-1"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Supprimer la formation</span>
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
              <span class="headline">Ajouter une formation</span>
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
                  v-model="titre"
                  :error-messages="titreErrors"
                  :counter="255"
                  label="Titre"
                  required
                  clearable
                  @input="$v.titre.$touch()"
                  @blur="$v.titre.$touch()"
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
                  v-model="code"
                  :error-messages="codeErrors"
                  :counter="255"
                  label="Code"
                  required
                  clearable
                  @input="$v.code.$touch()"
                  @blur="$v.code.$touch()"
              ></v-text-field>
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
            @click="form = !form"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {validationMixin} from "vuelidate";
import {maxLength, numeric, required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import ReadElements from "./ReadElements";

export default {
  name: "ReadFormation",
  components: {ReadElements},
  mixins: [validationMixin],
  props: ['formations'],

  validations: {
    titre: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(255)},
    code: {required, maxLength: maxLength(255)},
  },
  data: () => ({
    form: false,
    titre: '',
    surnom: '',
    code: '',
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'elements')
  },
  computed: {
    ...mapState(['elements']),
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
    titreErrors() {
      const errors = []
      if (!this.$v.titre.$dirty) return errors
      !this.$v.titre.maxLength && errors.push('Le titre ne doit pas faire plus de 255 caractères')
      !this.$v.titre.required && errors.push('Le titre est obligatoire.')
      return errors
    },
    surnomErrors() {
      const errors = []
      if (!this.$v.surnom.$dirty) return errors
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 255 caractères')
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire.')
      return errors
    },
    codeErrors() {
      const errors = []
      if (!this.$v.code.$dirty) return errors
      !this.$v.code.maxLength && errors.push('Le code ne doit pas faire plus de 255 caractères')
      !this.$v.code.required && errors.push('Le code est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;

      const element = {
        titre: this.titre,
        surnom: this.surnom,
        code: this.code,
        niveau: 0,
        indice: 0,
        vol_hor_total_prevues_etu_cm: null,
        vol_hor_total_prevues_etu_td: null,
        vol_hor_total_prevues_etu_tp: null,
        mode_saisie: 'aucun',
        cm_autorises: Number(false),
        td_autorises: Number(false),
        tp_autorises: Number(false),
        partiel_autorises: Number(false),
        forfait_globale_cm: null,
        forfait_globale_td: null,
        forfait_globale_tp: null,
        forfait_globale_partiel: null,
        nb_groupe_effectif_cm: null,
        nb_groupe_effectif_td: null,
        nb_groupe_effectif_tp: null,
        nb_groupe_effectif_partiel: null,
        parent: null,
        nbfils: 0,
      }

      this.$store.dispatch('ADD_FormationsElement', {element: element,projet_id: Number(this.$route.params.id)});
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.titre = ''
      this.surnom = ''
      this.code = ''
    },
    close() {
      this.form = !this.form
      this.clear()
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
    saveVerrou(formation) {
      formation.verrou = Number(!formation.verrou)
      this.$store.commit('EDIT_Formations', formation);
    },
  }
}
</script>

<style scoped>
</style>