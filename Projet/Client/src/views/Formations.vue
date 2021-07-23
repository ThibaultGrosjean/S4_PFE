<template>
  <v-container fluid class="pa-10">
    <ProgressOverlay :loading="loading"/>
    <v-row class="animate-pop-in mb-2 pa-3">
      <v-card width="100%" class="pa-7 pr-9">
        <v-row>
          <v-col class="align-center pa-0">
            <v-btn v-show="formations.length" :disabled="!projet.length || Boolean(projet[0].verrou)" icon @click="checkAllFormation" color="primary" class="mr-2">
              <v-icon>
                {{ deleteSelected.length === formations.length && deleteSelected.length > 0 ? 'check_box' : 'check_box_outline_blank' }}
              </v-icon>
            </v-btn>
            <v-btn outlined small color="primary"  @click="sortedByNom" class="mr-2">
              <v-icon small class="mr-2">{{ sortNom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Nom
            </v-btn>
            <v-btn small outlined @click="changeSaisie" color="primary" class="mr-2">
              <v-icon class="mr-2">
                {{ saisieHebdo ? 'date_range' : 'pie_chart' }}
              </v-icon>
              {{ saisieHebdo ? 'Saisie Hebdomadaire' : 'Saisie Globale' }}
            </v-btn>
            <v-btn :disabled="!projet.length || Boolean(projet[0].verrou)" icon color="success" @click="form = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn v-show="deleteSelected.length" :disabled="!projet.length || Boolean(projet[0].verrou)" icon color="error darken-1" @click="deleteAllSelectedFormation">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end pa-0">
            <span v-if="projet.length" class="subtitle-1 text--secondary">{{ projet[0].nom }} - {{ projet[0].date.substr(0, 4) }}</span>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row v-if="!formations.length">
      <v-col>
        <p class="text-center animate-pop-in">Aucune formation sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>

    <v-item-group multiple v-model="deleteSelected">
        <v-row >
          <v-col
              v-for="f in formations"
              :key="f.id"
              sm="12"
              class="justify-center"
          >
            <v-item v-slot="{ active, toggle }" :value="f">
              <v-card class="animate-pop-in">
                <v-card-title class="text-h5 pa-4 pt-5">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="1" class="pa-0 d-flex justify-start">
                        <v-btn :disabled="Boolean(projet[0].verrou)" icon @click="toggle" :color="active ? 'primary' : 'gray'">
                          <v-icon>{{ active ? 'check_box' : 'check_box_outline_blank' }}</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col class="py-0 px-6 d-flex justify-center align-center">
                        <v-divider></v-divider>
                        <span class="mr-2 ml-2 text-h5 text-center">{{ f.titre }}</span>
                        <v-divider></v-divider>
                      </v-col>
                      <v-col cols="1" class="pa-0 d-flex justify-end">
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
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text class="pa-0">
                  <ReadElements :formation="f" :disabled="Boolean(f.verrou)" v-on:edit-element="snackbarElement($event)" :saisie="saisieHebdo"></ReadElements>
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
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="d-flex justify-start pa-0">
                    <v-checkbox
                        v-model="checkboxNewElement"
                        label="Créer un nouvel élément"
                        color="primary"
                        class="ma-0"
                        @click="checkboxCopyElement = false"
                    ></v-checkbox>
                  </v-col>
                  <v-col class="d-flex justify-end pa-0">
                    <v-checkbox
                        v-model="checkboxCopyElement"
                        label="Copier une hiérachie existante"
                        color="primary"
                        class="ma-0"
                        @click="checkboxNewElement = false"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
              <div v-if="checkboxNewElement">
                <v-text-field
                    v-model="titre"
                    :error-messages="errors.titre"
                    :counter="255"
                    label="Titre"
                    autofocus
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="surnom"
                    :error-messages="errors.surnom"
                    :counter="255"
                    label="Surnom"
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="code"
                    :error-messages="errors.code"
                    :counter="255"
                    label="Code"
                    clearable
                ></v-text-field>
              </div>
              <v-form v-if="checkboxCopyElement" ref="formulaire" lazy-validation>
                <v-select
                    v-model="element"
                    :items="hierarchies"
                    :item-text="item => item.titre + ' (' + item.nom + ' - ' + item.date.substr(0, 4) + ')'"
                    item-value="id"
                    label="Hiérarchie"
                    clearable
                    :rules="rules.selectElement"
                    required
                ></v-select>
                <v-checkbox
                    v-if="element"
                    v-model="checkboxCopierGrpInterv"
                    label="Copier les groupes des intervenants"
                ></v-checkbox>
              </v-form>
              <v-card-actions>
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
                :disabled="loading"
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

    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success">
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
  </v-container>
</template>

<script>
import apiFormation from "../services/API/formations";
import apiElement from "../services/API/elements";
import apiProjet from "../services/API/projets";
import ReadElements from "../components/ReadElements";
import ProgressOverlay from "../components/ProgressOverlay";

export default {
  name: "Formations",
  components: {ProgressOverlay, ReadElements},

  data: () => ({
    formations: [],
    projet: [],
    hierarchies: [],
    errors: [],
    form: false,
    saisieHebdo: true,
    dialog: false,
    loading: false,
    responseSuccess: false,
    sortNom: false,
    typeOperation: 'ajouté',
    table: 'La formation',
    titre: '',
    surnom: '',
    code: '',
    element: null,
    deleteSelected: [],
    checkboxSelectAll: false,
    checkboxNewElement: false,
    checkboxCopyElement: false,
    checkboxCopierGrpInterv: false,
    rules: {
      selectElement: [(v) =>  v !== null || "Veuillez sélectionner une hiérarchie"],
    }
  }),
  methods: {
    async getFormationByProjet() {
      this.formations = await apiFormation.getFormationByProjet(this.$route.params.id);
    },
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id);
    },
    async getRacineHierarchie() {
      this.hierarchies = await apiElement.getAllRacineHierarchie();
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
        await this.clear();
        this.form = false;
        return;
      }
      this.table = 'La formation';
      if (this.checkboxNewElement){
        this.loading = true;
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
        const resElement = await apiElement.createElement(element);
        if (resElement.errors){
          this.errors = resElement.errors;
          this.loading = false;
        } else {
          await apiFormation.createFormation(Number(this.$route.params.id), resElement.insertId);
          this.typeOperation = 'ajouté';
          await this.clear();
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
          this.checkboxCopierGrpInterv = false;
          this.checkboxCopyElement = false;
          this.checkboxNewElement = false;
        }
      } else {
        if (this.element !== null){
          this.$refs.formulaire.validate();
          this.loading = true;
          let index = await this.hierarchies.findIndex(e => e.id === this.element);
          const res = await apiFormation.copyFormation(this.hierarchies[index], this.hierarchies[index].projet_id, this.$route.params.id, this.checkboxCopierGrpInterv);
          if (res.errors){
            this.errors = res.errors;
            this.loading = false;
          } else {
            this.typeOperation = 'copié';
            await this.clear();
            this.$refs.formulaire.resetValidation();
            this.loading = false;
            this.form = false;
            this.responseSuccess = true;
            this.checkboxCopierGrpInterv = false;
            this.checkboxCopyElement = false;
            this.checkboxNewElement = false;
          }
        }
      }
      await this.getFormationByProjet();
    },
    async clear() {
      this.titre = '';
      this.surnom = '';
      this.code = '';
      this.element = null;
      this.methods = 'POST';
      this.errors = [];
      await this.getRacineHierarchie();
    },
    close() {
      this.form = !this.form;
      this.clear();
    },
    checkAllFormation() {
      this.checkboxSelectAll = !this.checkboxSelectAll;
      this.deleteSelected = [];
      if (this.checkboxSelectAll) this.deleteSelected = this.formations;
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
        } else {
          verif += 1;
        }
      }
      if (verif > 0) this.dialog = true;
      await this.getFormationByProjet();
      await this.getRacineHierarchie();
      this.loading = false;
      this.checkboxSelectAll = false;
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
      await this.getRacineHierarchie();
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
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false;
        this.formations.sort((a, b) => a.titre.toUpperCase() > b.titre.toUpperCase());
      } else {
        this.sortNom = true;
        this.formations.sort((a, b) => a.titre.toUpperCase() < b.titre.toUpperCase());
      }
    },
    async changeSaisie() {
      this.loading = true;
      this.saisieHebdo = !this.saisieHebdo;
      this.loading = false;
    }
  },
  async mounted() {
    this.loading = true;
    await this.getProjet();
    await this.getFormationByProjet();
    await this.getRacineHierarchie();
    this.loading = false;
  },
}
</script>

<style scoped>
</style>