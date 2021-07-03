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
        <h1 class="text-h4 animate-pop-in">Liste des intervenants</h1>
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
        <v-btn outlined rounded color="primary" @click="redirect('/formations/projets/'+ Number($route.params.id))">
          <v-icon class="mr-2">auto_stories</v-icon>Aller aux formation
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!intervenants.length">
        <p class="text-center animate-pop-in">Aucun intervenant sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" class="animate-pop-in">
        <v-alert v-model="responseSuccess" dismissible border="left" text type="success" class="mb-0">
          L'intervenant a été {{ typeOperation }} avec succès.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="intervenants.length" class="pa-3 pb-0 animate-pop-in">
      <v-checkbox
          v-model="checkboxSelectAll"
          label="Tout sélectionner"
          color="primary"
          class="ma-0 ml-3"
          @click="checkAllInterv"
      ></v-checkbox>
      <v-tooltip top v-if="deleteSelected.length">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="ml-2"
              @click="deleteAllSelectedIntervenant"
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
            v-for="i in intervenants"
            :key="i.id"
            sm="4"
            class="justify-center"
        >
          <v-item v-slot="{ active, toggle }" :value="i">
            <v-card class="animate-pop-in">
              <v-card-title class="pl-2">
                <v-btn
                    icon
                    @click="toggle"
                    :color="active ? 'primary' : 'gray'"
                >
                  <v-icon>
                    {{ active ? 'check_box' : 'check_box_outline_blank' }}
                  </v-icon>
                </v-btn>
                <span class="text-h5 ml-2">{{ i.prenom }} {{ i.nom }}</span>
              </v-card-title>
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
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(i)"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Modifier</span>
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
                    :loading="loading"
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
            Êtes-vous sûr de vouloir supprimer la sélection d'intervenant ? <br><br>
            Un ou plusieurs intervenants ont des heures saisies dans les formations du projet.
            Si vous continuez les heures saisies dans toutes les formations seront supprimées. Voulez-vous vraiment valider l'opération ?
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
                class="mr-4"
                text
                @click="validDeleteAllIntervenant"
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
            @click="addIntervenant"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiIntervenant from "../services/API/intervenants";
import apiEnseignant from "../services/API/enseignants";
import apiProjet from "../services/API/projets";
import {validationMixin} from "vuelidate";
import {decimal, required} from "vuelidate/lib/validators";

export default {
  name: "Intervenants",
  mixins: [validationMixin],

  validations: {
    nb_he_td_min_attendu_projet: {required, decimal},
    nb_he_td_max_attendu_projet: {required, decimal},
    nb_he_td_min_sup_projet: {required, decimal},
    nb_he_td_max_sup_projet: {required, decimal},
  },
  data: () => ({
    enseignants: [],
    intervenants: [],
    projet: [],
    form: false,
    dialog: false,
    loading: false,
    responseSuccess: false,
    methods: "POST",
    typeOperation: 'ajouté',
    id: '',
    nb_he_td_min_attendu_projet: '',
    nb_he_td_max_attendu_projet: '',
    nb_he_td_min_sup_projet: '',
    nb_he_td_max_sup_projet: '',
    projet_id: '',
    enseignant_id: [],
    enseignantByProjetNotInIntervenant: [],
    deleteSelected: [],
    checkboxSelectAll: false,
    rules: {
      selectEnseignant: [(v) =>  v.length > 0 || "Veuillez sélectionner un enseignant"],
    }
  }),
  methods: {
    async getIntervenantsByProjet() {
      this.intervenants = await apiIntervenant.getIntervenantsByProjet(this.$route.params.id);
    },
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id);
    },
    async getEnseignantProjetNotInIntervenant(){
      this.enseignantByProjetNotInIntervenant = await apiEnseignant.getEnseignantByProjetNotInIntervenant(Number(this.$route.params.id));
    },
    async getEnseignants() {
      this.enseignantByProjetNotInIntervenant = await apiEnseignant.getEnseignants();
    },
    async returnEnseignant(id){
      return await apiEnseignant.getEnseignant(id);
    },
    async submit() {
      this.loading = true;
      if (this.methods === 'POST'){
        this.$v.$touch();
        if (this.enseignant_id.length <= 0) {
          return;
        } else {
          for (let i = 0; i < this.enseignant_id.length; i++) {
            var enseignant = await this.returnEnseignant(this.enseignant_id[i]);
            var intervenant = {
              enseignant_id: this.enseignant_id[i],
              projet_id: Number(this.$route.params.id),
              nb_he_td_min_attendu_projet: enseignant[0].statut.nb_he_td_min_attendu,
              nb_he_td_max_attendu_projet: enseignant[0].statut.nb_he_td_max_attendu,
              nb_he_td_min_sup_projet: enseignant[0].statut.nb_he_td_min_sup,
              nb_he_td_max_sup_projet: enseignant[0].statut.nb_he_td_max_sup,
            }
            await apiIntervenant.createIntervenant(intervenant);
          }
          this.typeOperation = 'ajouté';
        }
      } else {
        this.$v.$touch();
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
        await apiIntervenant.editIntervenant(intervenant);
        this.typeOperation = 'modifié';
      }
      await this.getIntervenantsByProjet();
      this.clear();
      this.loading = false;
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset();
      this.id = '';
      this.nb_he_td_min_attendu_projet = '';
      this.nb_he_td_max_attendu_projet = '';
      this.nb_he_td_min_sup_projet = '';
      this.nb_he_td_max_sup_projet = '';
      this.projet_id = null;
      this.enseignant_id = [];
    },
    close() {
      this.getEnseignantProjetNotInIntervenant();
      this.form = false;
      this.methods = 'POST';
      this.clear();
    },
    addIntervenant() {
      this.getEnseignantProjetNotInIntervenant();
      this.projet_id = Number(this.$route.params.id);
      this.methods = 'POST';
      this.form = true;
    },
    edit(intervenant) {
      this.methods = 'PUT';
      this.getEnseignants();

      this.id = intervenant.id;
      this.nb_he_td_min_attendu_projet = intervenant.nb_he_td_min_attendu_projet;
      this.nb_he_td_max_attendu_projet = intervenant.nb_he_td_max_attendu_projet;
      this.nb_he_td_min_sup_projet = intervenant.nb_he_td_min_sup_projet;
      this.nb_he_td_max_sup_projet = intervenant.nb_he_td_max_sup_projet;
      this.projet_id = intervenant.projet_id;
      this.enseignant_id = intervenant.enseignant_id;
      this.form = true;
    },
    checkAllInterv() {
      this.deleteSelected.splice(0, this.deleteSelected.length);
      if (this.checkboxSelectAll){
        for (let i = 0; i < this.intervenants.length; i++) {
          this.deleteSelected.push(this.intervenants[i]);
        }
      }
    },
    async deleteAllSelectedIntervenant() {
      var verif = 0;
      this.loading = true;
      for (let i = 0; i < this.deleteSelected.length; i++) {
        if (this.deleteSelected[i].nbVolHorGlob === 0 && this.deleteSelected[i].nbGrpInterv === 0){
          await apiIntervenant.deleteIntervenant(this.deleteSelected[i].id);
          this.typeOperation = 'supprimé';
          this.responseSuccess = true;
        } else {
          verif += 1;
        }
      }
      if (verif > 0) this.dialog = true;
      this.loading = false;
      await this.getIntervenantsByProjet();
    },
    async validDeleteAllIntervenant(){
      this.loading = true;
      for (let i = 0; i < this.deleteSelected.length; i++) {
        await apiIntervenant.deleteIntervenant(this.deleteSelected[i].id);
      }
      this.dialog = false;
      this.loading = false;
      await this.getIntervenantsByProjet();
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
    },
    toTime(date) {
      return new Date(date).toISOString().substr(0, 4);
    },
    redirect(path) {
      this.$router.push({path: path}).catch(() => {});
    },
  },
  computed: {
    nb_he_td_min_attendu_projetErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_min_attendu_projet.$dirty) return errors;
      !this.$v.nb_he_td_min_attendu_projet.decimal && errors.push('Le Nombre d\'heures minimales attendues pour le projet doit être un numérique');
      !this.$v.nb_he_td_min_attendu_projet.required && errors.push('Le Nombre d\'heures minimales attendues pour le projet est obligatoire');
      return errors;
    },
    nb_he_td_max_attendu_projetErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_max_attendu_projet.$dirty) return errors;
      !this.$v.nb_he_td_max_attendu_projet.decimal && errors.push('Le Nombre d\'heures maximales attendues pour le projet doit être un numérique');
      !this.$v.nb_he_td_max_attendu_projet.required && errors.push('Le Nombre d\'heures maximales attendues pour le projet est obligatoire');
      return errors;
    },
    nb_he_td_min_sup_projetErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_min_sup_projet.$dirty) return errors;
      !this.$v.nb_he_td_min_sup_projet.decimal && errors.push('Le Nombre d\'heures minimales supplémentaires attendues pour le projet doit être un numérique');
      !this.$v.nb_he_td_min_sup_projet.required && errors.push('Le Nombre d\'heures minimales supplémentaires attendues pour le projet est obligatoire');
      return errors;
    },
    nb_he_td_max_sup_projetErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_max_sup_projet.$dirty) return errors;
      !this.$v.nb_he_td_max_sup_projet.decimal && errors.push('Le Nombre d\'heures maximales supplémentaires attendues pour le projet doit être un numérique');
      !this.$v.nb_he_td_max_sup_projet.required && errors.push('Le Nombre d\'heures maximales supplémentaires attendues pour le projet est obligatoire');
      return errors;
    },
  },
  mounted() {
    this.getIntervenantsByProjet();
    this.getProjet();
    this.getEnseignantProjetNotInIntervenant();
  },
}
</script>

<style scoped>
</style>