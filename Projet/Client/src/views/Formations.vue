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
        <h1 class="text-h4 animate-pop-in mb-2">Liste des formations</h1>
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
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success" :rounded="true">
        <span>{{ table }} a été {{ typeOperation }} avec succès.</span>
        <template v-slot:action="{ attrs }">
          <v-btn
              icon
              v-bind="attrs"
              @click="responseSuccess = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    <v-row v-if="formations.length" class="pa-3 pb-0 animate-pop-in">
      <v-col class="d-flex justify-start">
        <v-checkbox
            :disabled="Boolean(projet[0].verrou)"
            v-model="checkboxSelectAll"
            label="Tout sélectionner"
            color="primary"
            class="ma-0 ml-2"
            @click="checkAllFormation"
        ></v-checkbox>
        <v-tooltip top v-if="deleteSelected.length">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                :disabled="Boolean(projet[0].verrou)"
                :loading="loading"
                icon
                v-bind="attrs"
                v-on="on"
                @click="deleteAllSelectedFormation"
            >
              <v-icon color="error darken-1">delete</v-icon>
            </v-btn>
          </template>
          <span>Supprimer la sélection</span>
        </v-tooltip>
      </v-col>
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
                    :disabled="Boolean(projet[0].verrou)"
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
                        :disabled="Boolean(projet[0].verrou)"
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
              <v-card-text class="pa-0 pb-5">
                <ReadElements :formation="f" :disabled="Boolean(f.verrou)" v-on:edit-element="snackbarElement($event)"></ReadElements>
              </v-card-text>
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
                    :loading="loading"
                    color="success darken-1"
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
                :loading="loading"
                color="success darken-1"
                text
                @click="validDeleteAllFormation"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row v-if="projet.length" v-show="!Boolean(projet[0].verrou)">
      <v-col>
        <v-btn
            :disabled="Boolean(projet[0].verrou)"
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
import ReadElements from "../components/ReadElements";

export default {
  name: "Formations",
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
    table: 'La formation',
    titre: '',
    surnom: '',
    code: '',
    deleteSelected: [],
    checkboxSelectAll: false,
  }),
  methods: {
    //TODO créer une formation en copiant une hiérarchie existante
    async getFormationByProjet() {
      this.formations = await apiFormation.getFormationByProjet(this.$route.params.id);
    },
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id);
    },
    async getElement() {
      this.elements = await apiElement.getElements();
    },
    async saveVerrou(formation) {
      formation.verrou = Number(!formation.verrou)
      await apiFormation.editFormation(formation);
      this.table = 'La formation';
      if (formation.verrou) this.typeOperation = 'verrouillé';
      else this.typeOperation = 'déverrouillé';
      this.responseSuccess = true;
    },
    async submit() {
      if (this.projet[0].verrou === 1) {
        this.clear();
        this.form = false;
        return;
      }
      this.$v.$touch();
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
      this.loading = true;
      this.table = 'La formation';
      this.typeOperation = 'ajouté';
      await apiFormation.createFormation({element: element,projet_id: Number(this.$route.params.id)});
      await this.getFormationByProjet();
      this.clear();
      this.loading = false;
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset();
      this.titre = '';
      this.surnom = '';
      this.code = '';
    },
    close() {
      this.form = !this.form;
      this.clear();
    },
    checkAllFormation() {
      this.deleteSelected = [];
      if (this.checkboxSelectAll){
        for (let i = 0; i < this.formations.length; i++) {
          this.deleteSelected.push(this.formations[i]);
        }
      }
    },
    async deleteAllSelectedFormation() {
      if (this.projet[0].verrou === 1) return;
      var verif = 0;
      this.loading = true;
      for (let i = 0; i < this.deleteSelected.length; i++) {
        if (this.deleteSelected[i].nbVolHorGlob === 0 && this.deleteSelected[i].nbVolHorHebdo === 0 && this.deleteSelected[i].nbGrpInterv === 0){
          await apiFormation.deleteFormation(this.deleteSelected[i]);
          this.table = 'La formation';
          this.typeOperation = 'supprimé';
          this.responseSuccess = true;
          this.loading = false;
        } else {
          verif += 1;
        }
      }
      if (verif > 0) this.dialog = true;
      this.loading = false;
      await this.getFormationByProjet();
    },
    async validDeleteAllFormation(){
      if (this.projet[0].verrou === 1) {
        this.dialog = false;
        return;
      }
      this.loading = true;
      for (let i = 0; i < this.deleteSelected.length; i++) {
        await apiFormation.deleteFormation(this.deleteSelected[i]);
      }
      this.loading = false;
      this.dialog = false;
      await this.getFormationByProjet();
      this.table = 'La formation';
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
      this.deleteSelected = [];
      this.checkboxSelectAll = false;
    },
    snackbarElement(data) {
      this.table = data.element;
      this.typeOperation = data.typeOperaion;
      this.responseSuccess = true;
    },
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length);
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    }
  },
  computed: {
    projetErrors() {
      const errors = [];
      if (!this.$v.projet_id.$dirty) return errors;
      !this.$v.projet_id.required && errors.push('Veuillez sélectionner un projet');
      return errors;
    },
    elementErrors() {
      const errors = [];
      if (!this.$v.element_id.$dirty) return errors;
      !this.$v.element_id.required && errors.push('Veuillez sélectionner un élément');
      return errors;
    },
    titreErrors() {
      const errors = [];
      if (!this.$v.titre.$dirty) return errors;
      !this.$v.titre.maxLength && errors.push('Le titre ne doit pas faire plus de 255 caractères');
      !this.$v.titre.required && errors.push('Le titre est obligatoire.');
      return errors;
    },
    surnomErrors() {
      const errors = [];
      if (!this.$v.surnom.$dirty) return errors;
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 255 caractères');
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire.');
      return errors;
    },
    codeErrors() {
      const errors = [];
      if (!this.$v.code.$dirty) return errors;
      !this.$v.code.maxLength && errors.push('Le code ne doit pas faire plus de 255 caractères');
      !this.$v.code.required && errors.push('Le code est obligatoire');
      return errors;
    },
  },
  mounted() {
    this.getProjet();
    this.getFormationByProjet();
    this.getElement();
  }
}
</script>

<style scoped>
</style>