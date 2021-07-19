<template>
  <v-container fluid class="pa-10">
    <ProgressOverlay :loading="loading"/>

    <v-row class="animate-pop-in mb-2 pa-3">
      <v-card width="100%" class="pt-7 pb-5 pl-5 pr-9">
        <v-row>
          <v-col class="align-center pa-0">
            <v-btn v-show="intervenants.length" :disabled="!projet.length || Boolean(projet[0].verrou)" icon @click="checkAllInterv" color="primary" class="mb-2">
              <v-icon>
                {{ deleteSelected.length === intervenants.length && deleteSelected.length > 0 ? 'check_box' : 'check_box_outline_blank' }}
              </v-icon>
            </v-btn>
            <v-btn outlined small color="primary"  @click="sortedByPrenom" class="mx-2 mb-2">
              <v-icon small class="mr-2">{{ sortPrenom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Prénom
            </v-btn>
            <v-btn outlined small color="primary"  @click="sortedByNom" class="mx-2 mb-2">
              <v-icon small class="mr-2">{{ sortNom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Nom
            </v-btn>
            <v-btn :disabled="!projet.length || Boolean(projet[0].verrou)" icon color="success" @click="form = true" class="mb-2">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn v-show="deleteSelected.length" :disabled="!projet.length || Boolean(projet[0].verrou)" icon color="error darken-1" @click="deleteAllSelectedIntervenant">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-col>
          <v-col class="d-flex align-center justify-end pa-0 mb-2">
            <span v-if="projet.length" class="subtitle-1 text--secondary">{{ projet[0].nom }} - {{ projet[0].date.substr(0, 4) }}</span>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row v-if="!intervenants.length">
      <v-col>
        <p class="text-center animate-pop-in">Aucun intervenant sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>

    <v-item-group multiple v-model="deleteSelected">
      <v-row>
        <v-col
            v-for="i in intervenants"
            :key="i.id"
            sm="6"
            md="4"
            class="justify-center"
        >
          <v-item v-slot="{ active, toggle }" :value="i">
            <v-card class="animate-pop-in">
              <v-card-title class="pl-2">
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
                <span class="text-h5 ml-2">{{ i.prenom }} {{ i.nom }}</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <DetailsStatut :data="i"/>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        :disabled="Boolean(projet[0].verrou)"
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
          <v-form ref="formulaire" lazy-validation>
            <v-card-title>
              <span class="headline" v-if="methods === 'POST'">Ajouter un intervenant</span>
              <span class="headline" v-else>Modifier l'intervenant</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-select
                  v-model="intervenant.enseignant_id"
                  :items="enseignantByProjetNotInIntervenant"
                  :item-text="item => item.prenom +' '+ item.nom"
                  item-value="id"
                  label="Enseignant"
                  autofocus
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
                    (+{{ intervenant.enseignant_id.length - 2 }})
                  </span>
                </template>
              </v-select>
              <div class="ma-0 pa-0" v-if="methods === 'PUT'">
                <v-text-field
                    v-model="intervenant.nb_he_td_min_attendu"
                    :error-messages="errors.nb_he_td_min_attendu"
                    label="Nombre d'heures minimales attendues pour le projet"
                    required
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="intervenant.nb_he_td_max_attendu"
                    :error-messages="errors.nb_he_td_max_attendu"
                    label="Nombre d'heures maximales attendues pour le projet"
                    required
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="intervenant.nb_he_td_min_sup"
                    :error-messages="errors.nb_he_td_min_sup"
                    label="Nombre d'heures minimales supplémentaires attendues pour le projet"
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="intervenant.nb_he_td_max_sup"
                    :error-messages="errors.nb_he_td_max_sup"
                    label="Nombre d'heures maximales supplémentaires attendues pour le projet"
                    clearable
                ></v-text-field>
              </div>
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
            Êtes-vous sûr de vouloir supprimer la sélection d'intervenant ? <br><br>
            Un ou plusieurs intervenants ont des heures saisies dans les formations du projet.
            Si vous continuez les heures saisies dans toutes les formations seront supprimées. Voulez-vous vraiment valider l'opération ?
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
                @click="validDeleteAllIntervenant"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success">
        <span>L'intervenant a été {{ typeOperation }} avec succès.</span>
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
import apiIntervenant from "../services/API/intervenants";
import apiEnseignant from "../services/API/enseignants";
import apiProjet from "../services/API/projets";
import ProgressOverlay from "../components/ProgressOverlay";
import DetailsStatut from "../components/DetailsStatut";

export default {
  name: "Intervenants",
  components: {DetailsStatut, ProgressOverlay},

  data: () => ({
    intervenants: [],
    enseignantByProjetNotInIntervenant: [],
    projet: [],
    errors: [],
    form: false,
    dialog: false,
    loading: false,
    responseSuccess: false,
    sortNom: false,
    sortPrenom: false,
    methods: "POST",
    typeOperation: 'ajouté',
    intervenant: {
      id: '',
      nb_he_td_min_attendu: '',
      nb_he_td_max_attendu: '',
      nb_he_td_min_sup: '',
      nb_he_td_max_sup: '',
      projet_id: '',
      enseignant_id: [],
    },
    deleteSelected: [],
    checkboxSelectAll: false,
    rules: {
      selectEnseignant: [(v) => v.length > 0 || "Veuillez sélectionner un enseignant"],
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
      this.$refs.formulaire.validate();
      if (this.projet[0].verrou === 1) {
        await this.clear();
        this.form = false;
        return;
      }
      this.loading = true;
      if (this.methods === 'POST'){
        if (this.intervenant.enseignant_id.length <= 0) {
          this.loading = false;
          return;
        } else {
          for (let i = 0; i < this.intervenant.enseignant_id.length; i++) {
            var enseignant = await this.returnEnseignant(this.intervenant.enseignant_id[i]);
            var intervenant = {
              enseignant_id: this.intervenant.enseignant_id[i],
              projet_id: Number(this.$route.params.id),
              nb_he_td_min_attendu: enseignant[0].nb_he_td_min_attendu,
              nb_he_td_max_attendu: enseignant[0].nb_he_td_max_attendu,
              nb_he_td_min_sup: enseignant[0].nb_he_td_min_sup,
              nb_he_td_max_sup: enseignant[0].nb_he_td_max_sup,
            }
            const res = await apiIntervenant.createIntervenant(intervenant);
            if (res.errors) this.errors = res.errors;
          }
          this.typeOperation = 'ajouté';
          await this.clear();
          await this.getIntervenantsByProjet();
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
        }
      } else {
        const res = await apiIntervenant.editIntervenant(this.intervenant);
        if (res.errors){
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'modifié';
          this.intervenant.id = '';
          await this.clear();
          await this.getIntervenantsByProjet();
          this.loading = false;
          this.form = false;
          this.responseSuccess = true;
          this.intervenant.enseignant_id = [];
        }
      }
    },
    async clear() {
      this.$refs.formulaire.resetValidation();
      this.intervenant = {
        nb_he_td_min_attendu: '',
        nb_he_td_max_attendu: '',
        nb_he_td_min_sup: '',
        nb_he_td_max_sup: '',
        projet_id: this.$route.params.id,
        enseignant_id: [],
      };
      this.errors = [];
      this.methods = 'POST';
      await this.getEnseignantProjetNotInIntervenant();
      this.checkboxSelectAll = false;
      this.deleteSelected = [];
    },
    close() {
      this.form = false;
      this.clear();
    },
    addIntervenant() {
      this.getEnseignantProjetNotInIntervenant();
      this.methods = 'POST';
      this.form = !this.form;
    },
    edit(intervenant) {
      this.methods = 'PUT';
      this.getEnseignants();
      this.intervenant = intervenant;
      this.form = true;
    },
    checkAllInterv() {
      this.checkboxSelectAll = !this.checkboxSelectAll;
      this.deleteSelected = [];
      if (this.checkboxSelectAll) this.deleteSelected = this.intervenants;
    },
    async deleteAllSelectedIntervenant() {
      if (this.projet[0].verrou === 1) return;
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
      await this.getEnseignantProjetNotInIntervenant();
      this.checkboxSelectAll = false;
    },
    async validDeleteAllIntervenant(){
      if (this.projet[0].verrou === 1) {
        this.dialog = false;
        return;
      }
      this.loading = true;
      for (let i = 0; i < this.deleteSelected.length; i++) {
        await apiIntervenant.deleteIntervenant(this.deleteSelected[i].id);
      }
      this.dialog = false;
      this.loading = false;
      await this.getIntervenantsByProjet();
      await this.getEnseignantProjetNotInIntervenant();
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
      this.checkboxSelectAll = false;
    },
    redirect(path) {
      this.$router.push({path: path}).catch(() => {});
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false;
        this.intervenants.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase());
      } else {
        this.sortNom = true;
        this.intervenants.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase());
      }
    },
    sortedByPrenom() {
      if (this.sortPrenom) {
        this.sortPrenom = false;
        this.intervenants.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase());
      } else {
        this.sortPrenom = true;
        this.intervenants.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase());
      }
    },
  },
  async mounted() {
    this.loading = true;
    await this.getProjet();
    await this.getIntervenantsByProjet();
    await this.getEnseignantProjetNotInIntervenant();
    this.loading = false;
  },
}
</script>

<style scoped>
</style>