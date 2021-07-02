<template>
  <v-container>
    <v-overlay :value="loading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col class="text-center">
        <h1 class="text-h4 animate-pop-in">Liste des formations</h1>
        <span v-if="projet.length" class="text-subtitle-1 animate-pop-in">{{ projet[0].nom + ' - ' + toTime(projet[0].date,4)}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/projets')">
          <v-icon class="mr-2">folder</v-icon>Retourner aux projets
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/intervenants/projets/' + Number($route.params.id))">
          <v-icon class="mr-2">groups</v-icon>Aller au Intervenant
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!formations.length">
        <p class="text-center animate-pop-in">Aucune formation sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" class="animate-pop-in">
        <v-alert v-model="responseSuccess" dismissible border="left" text type="success" class="mb-0">
          La formation a été {{ typeOperation }} avec succès.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="formations.length" class="pa-3 pb-0 animate-pop-in">
      <v-checkbox
          v-model="checkboxSelectAll"
          label="Tout sélectionner"
          color="primary"
          class="ma-0 ml-5"
          @click="checkAllInterv"
      ></v-checkbox>
      <v-tooltip top v-if="deleteSelected.length">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="ml-2"
              @click="deleteAllSelectedFormation"
          >
            <v-icon color="error darken-1">delete</v-icon>
          </v-btn>
        </template>
        <span>Supprimer la sélection</span>
      </v-tooltip>
    </v-row>
    <v-item-group multiple v-model="deleteSelected">
      <v-row>
        <v-col
            v-for="f in formations"
            :key="f.id"
            sm="12"
            class="justify-center"
        >
          <v-item v-slot="{ active, toggle }" :value="f">
            <v-card class="animate-pop-in">
              <v-card-title class="text-h5">
                <v-btn
                    icon
                    @click="toggle"
                    :color="active ? 'primary' : 'gray'"
                >
                  <v-icon>
                    {{ active ? 'check_box' : 'check_box_outline_blank' }}
                  </v-icon>
                </v-btn>
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
              </v-card-actions>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
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
    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5 error darken-2 white--text">
            <span class="headline">Confirmation de suppression</span>
            <v-spacer></v-spacer>
            <v-btn icon  color="white" @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="text-justify pt-4">
            Êtes-vous sûr de vouloir supprimer la sélection de formation ? <br><br>
            Une ou plusieurs formations ont des heures saisies.
            Si vous continuez les heures saisies (hebdomadaire et globale) ainsi que les groupes des intervenants seront supprimés de toutes les formations sélectionnées. Voulez-vous vraiment valider l'opération ?
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="error darken-1"
                text
                @click="dialog = false"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="success darken-1"
                class="mr-4"
                text
                @click="validDeleteAllFormation"
            >
              Valider
            </v-btn>
          </v-card-actions>
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
import apiFormation from "../services/API/formations";
import apiProjet from "../services/API/projets";
import apiElement from "../services/API/elements";
import {validationMixin} from "vuelidate";
import {maxLength, required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import ReadElements from "../components/ReadElements";

export default {
  name: "ReadFormation",
  components: {ReadElements},
  mixins: [validationMixin],

  validations: {
    titre: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(255)},
    code: {required, maxLength: maxLength(255)},
  },
  data: () => ({
    formations: [],
    projet: [],
    elements: [],
    form: false,
    dialog: false,
    loading: false,
    responseSuccess: false,
    typeOperation: 'ajouté',
    titre: '',
    surnom: '',
    code: '',
    deleteSelected: [],
    checkboxSelectAll: false,
  }),
  methods: {
    async getFormationByProjet() {
      this.formations = await apiFormation.getFormationByProjet(this.$route.params.id)
    },
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id)
    },
    async getElement() {
      this.elements = await apiElement.getElements()
    },
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;

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
      this.loading = true
      this.typeOperation = 'ajouté';
      //TODO changer
      this.$store.dispatch('ADD_FormationsElement', {element: element,projet_id: Number(this.$route.params.id)});
      await this.getFormationByProjet();
      this.clear()
      this.loading = false
      this.form = false;
      this.responseSuccess = true;
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
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    },
    async saveVerrou(formation) {
      formation.verrou = Number(!formation.verrou)
      await apiFormation.editFormation(formation);
    },
    checkAllInterv() {
      this.deleteSelected.splice(0, this.deleteSelected.length)
      if (this.checkboxSelectAll){
        for (let i = 0; i < this.formations.length; i++) {
          this.deleteSelected.push(this.formations[i])
        }
      }
    },
    //TODO Delete
    deleteAllSelectedFormation() {
      var verif = 0;
      for (let i = 0; i < this.deleteSelected.length; i++) {
        if (this.deleteSelected[i].nbVolHorGlob === 0 && this.deleteSelected[i].nbVolHorHebdo === 0 && this.deleteSelected[i].nbGrpInterv === 0){
          this.$store.dispatch('DELETE_Formation', this.deleteSelected[i])
          return verif;
        } else {
          verif += 1
        }
      }
      if (verif > 0){
        this.dialog = true
      }
      return verif
    },
    validDeleteAllFormation(){
      for (let i = 0; i < this.deleteSelected.length; i++) {
        this.$store.dispatch('DELETE_Formation', this.deleteSelected[i])
      }
      this.dialog = false
    }
  },
  computed: {
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
  mounted() {
    this.getElement()
    this.getProjet()
    this.getFormationByProjet()
  }
}
</script>

<style scoped>
</style>