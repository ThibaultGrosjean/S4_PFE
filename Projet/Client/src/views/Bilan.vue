<template>
  <v-container fluid class="pa-10">
  <ProgressOverlay :loading="loading"/>

    <v-row class="animate-pop-in mb-2 pa-3">
      <v-card width="100%" class="pt-7 pb-5 pl-7 pr-9">
        <v-row>
          <v-col class="align-center pa-0">
            <v-btn small outlined @click="checkBilan = !checkBilan" color="primary" class="mr-2 mb-2">
              <v-icon class="mr-2">
                {{ checkBilan ? 'visibility' : 'visibility_off' }}
              </v-icon>
              Bilan général
            </v-btn>
            <v-btn small outlined @click="checkSousTotaux = !checkSousTotaux" color="primary" class="mb-2">
              <v-icon class="mr-2">
                {{ checkSousTotaux ? 'visibility' : 'visibility_off' }}
              </v-icon>
              Sous-Totaux
            </v-btn>
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end pa-0 mb-2">
            <span v-if="projet.length" class="subtitle-1 text--secondary">{{ projet[0].nom }} - {{ projet[0].date.substr(0, 4) }}</span>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row v-if="checkBilan">
      <v-col
          sm="12"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">Bilan général</v-card-title>
          <v-card-text class="pa-0">
            <v-divider v-if="!bilans.length"></v-divider>
            <v-simple-table fixed-header v-if="bilans.length">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-subtitle-1 text-center font-weight-medium text--secondary top-border background-gray" colspan="7">Bilan des intervenants du projet</th>
                </tr>
                <tr>
                  <th class="text-center right-border">
                    <span class="mr-1">Intervenant</span>
                    <v-btn x-small icon @click="sortedByIntervenantBilan">
                      <v-icon small>{{ sortIntervenantBilan ? "arrow_upward" : "arrow_downward" }}</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-center">Total CM</th>
                  <th class="text-center">Total TD</th>
                  <th class="text-center">Total TP</th>
                  <th class="text-center">Total Partiel</th>
                  <th class="text-center left-border">Total HeTD</th>
                  <th class="text-center">Total H. sup</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="b in bilans" :key="b.intervenant_id">
                  <MenuShowDetailStatut :bilan="b"></MenuShowDetailStatut>
                  <td class="text-center">{{ b.total_cm }} h</td>
                  <td class="text-center">{{ b.total_td }} h</td>
                  <td class="text-center">{{ b.total_tp }} h</td>
                  <td class="text-center">{{ b.total_partiel }} h</td>
                  <td class="text-center left-border">
                    <span :class="getClassColorForTotal(b)"><b>{{ b.total_general }} h</b></span>
                  </td>
                  <td class="text-center"><span :class="getClassColorForTotalHeureSup(b)"><b>{{ b.total_heures_sup }} h </b> / {{ b.nb_he_td_max_sup }}</span></td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else class="pa-5">Aucune donnée trouvée</div>
          </v-card-text>
          <v-divider v-if="bilans.length"></v-divider>
          <v-card-actions v-if="bilans.length">
            <v-spacer></v-spacer>
            <div class="mr-6">
              <v-icon x-small color="error darken-1">circle</v-icon><span class="mx-1 text-caption">Sous-service</span>
            </div>
            <div class="mr-6">
              <v-icon x-small color="success">circle</v-icon><span class="mx-1 text-caption">Respect les limites</span>
            </div>
            <div class="mr-6">
              <v-icon x-small color="deep-purple darken-2">circle</v-icon><span class="mx-1 text-caption">Dépassement des limites d’heures supp</span>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="checkSousTotaux">
      <v-col
          sm="12"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">Sous-Totaux</v-card-title>
          <v-card-text class="pa-0" style="position: relative">
            <v-divider v-if="!sousTotaux.length"></v-divider>
            <v-btn
                v-if="projet.length"
                :disabled="Boolean(projet[0].verrou)"
                fab absolute
                dark
                small
                top right
                color="success"
                @click="form = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-simple-table fixed-header v-if="sousTotaux.length">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-subtitle-1 text-center font-weight-medium text--secondary top-border background-gray" colspan="8">Sous-Totaux</th>
                </tr>
                <tr>
                  <th class="text-center first-col">
                    <span class="mr-1">Intervenant</span>
                    <v-btn x-small icon @click="sortedByIntervenantSousTotal">
                      <v-icon small>{{ sortIntervenantSousTotal ? "arrow_upward" : "arrow_downward" }}</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-center first-col">
                    <span class="mr-1">Nom limite</span>
                    <v-btn x-small icon @click="sortedByLimite">
                      <v-icon small>{{ sortByLimite ? "arrow_upward" : "arrow_downward" }}</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-center">Sous-total CM</th>
                  <th class="text-center">Sous-total TD</th>
                  <th class="text-center">Sous-total TP</th>
                  <th class="text-center">Sous-total Partiel</th>
                  <th class="text-center left-border">Sous-total HeTD</th>
                  <th v-if="projet.length && !Boolean(projet[0].verrou)" class="text-center">Opération</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(st, idx) in sousTotaux" :key="idx">
                  <td class="text-center first-col-split">{{ st.prenom }} {{ st.nom }}</td>
                  <td class="text-center first-col-split">{{ st.nom_limite }}</td>
                  <td class="text-center">{{ st.total_cm }} h</td>
                  <td class="text-center">{{ st.total_td }} h</td>
                  <td class="text-center">{{ st.total_tp }} h</td>
                  <td class="text-center">{{ st.total_partiel }} h</td>
                  <td class="text-center left-border"><span :class="getClassColorForSousTotal(st)"><b>{{ st.total_he_td }} h</b> / {{ st.limite}}</span></td>
                  <td v-if="projet.length && !Boolean(projet[0].verrou)" class="text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="edit(st)"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Modifier {{ st.nom_limite }}</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            color="error darken-1"
                            @click="openDialog(st)"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Supprimer {{ st.nom_limite }}</span>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else class="pa-5">Aucun sous-total dans le projet</div>
          </v-card-text>
          <v-divider v-if="sousTotaux.length"></v-divider>
          <v-card-actions v-if="sousTotaux.length">
            <v-spacer></v-spacer>
            <div class="mr-6">
              <v-icon x-small color="success">circle</v-icon><span class="mx-1 text-caption">Respect les limites</span>
            </div>
            <div class="mr-6">
              <v-icon x-small color="deep-purple darken-2">circle</v-icon><span class="mx-1 text-caption">Dépassement des limites</span>
            </div>
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
          <v-form ref="formulaire" lazy-validation>
            <v-card-title>
              <span class="headline" v-if="methods === 'POST'">Ajouter un sous-total</span>
              <span class="headline" v-else>Modifier le sous-total</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                  v-model="nom"
                  :error-messages="nomErrors"
                  :counter="255"
                  label="Nom"
                  autofocus
                  required
                  clearable
                  @input="$v.nom.$touch()"
                  @blur="$v.nom.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="limite_he_td"
                  :error-messages="limiteHeTDErrors"
                  label="Limite HeTD (équivalent TD)"
                  required
                  clearable
                  @input="$v.limite_he_td.$touch()"
                  @blur="$v.limite_he_td.$touch()"
              ></v-text-field>
              <v-select
                  v-model="element_id"
                  :items="elementsModules"
                  :item-text="item => item.titre + ' ' + item.semestre_titre + ' (' + item.formation_titre + ')'"
                  item-value="id"
                  label="Modules"
                  clearable
                  multiple
                  chips
                  :rules="rules.selectModules"
                  no-data-text="Tous les modules sont déjà assignés à un sous-total"
                  required
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0 ">
                    <span>{{ item.titre + ' ' + item.semestre_titre + ' (' + item.formation_titre + ' )'}}</span>
                  </v-chip>
                  <v-chip v-if="index === 1 ">
                    <span>{{ item.titre + ' ' + item.semestre_titre + ' (' + item.formation_titre + ' )'}}</span>
                  </v-chip>
                  <span
                      v-if="index === 2"
                      class="grey--text text-caption"
                  >
                    (+{{ element_id.length - 2 }})
                  </span>
                </template>
              </v-select>
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
            <v-btn icon  color="white" @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="text-justify pt-4">
            Êtes-vous sûr de vouloir supprimer la limite « {{ this.nom }} » ?
          </v-card-text>
          <v-card-actions>
            <v-btn
                :disabled="loading"
                color="error darken-1"
                text
                @click="closeDialog"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :loading="loading"
                color="success darken-1"
                text
                @click="deleteLimite"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success">
        <span>Le sous-total a été {{ typeOperation }} avec succès.</span>
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
import apiStatut from "../services/API/statuts";
import apiProjet from "../services/API/projets";
import apiBilan from "../services/API/bilans";
import apiElement from "../services/API/elements";
import MenuShowDetailStatut from "../components/MenuShowDetailStatut";
import ProgressOverlay from "../components/ProgressOverlay";

import {decimal, maxLength, required} from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";

export default {
  name: "Bilan",
  components: {ProgressOverlay, MenuShowDetailStatut},
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    limite_he_td: {required, decimal},
  },
  data: () => ({
    bilans: [],
    sousTotaux: [],
    limiteSousTotal: [],
    projet: [],
    statuts: [],
    form: false,
    dialog: false,
    showMenuStatutDetail: false,
    checkBilan: true,
    checkSousTotaux: true,
    loading: false,
    responseSuccess: false,
    sortIntervenantBilan: false,
    sortIntervenantSousTotal: false,
    sortByLimite: false,
    typeOperation: 'ajouté',
    methods: "POST",
    id: '',
    nom: '',
    limite_he_td: '',
    elementsModules: [],
    element_id: [],

    rules: {
      selectModules: [(v) => v.length > 0 || "Veuillez sélectionner un enseignant"],
    }
  }),
  methods: {
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id);
    },
    async getStatut() {
      this.statuts = await apiStatut.getStatuts();
    },
    async getElementsModules() {
      this.elementsModules = await apiElement.getElementsModules(this.$route.params.id);
    },
    async getBilanByProjetIntervenant() {
      this.bilans = await apiBilan.getBilanByProjetIntervenant(this.$route.params.id);
    },
    async getSousTotaux() {
      this.sousTotaux = await apiBilan.getBilanSousTotal(this.$route.params.id);
    },
    async submit() {
      this.$refs.formulaire.validate();
      this.$v.$touch();
      if (this.$v.$invalid) return;
      if (this.element_id.length <= 0) {
        return;
      } else {
        const limiteSousTotal = {
          id: this.id,
          nom: this.nom,
          limite_he_td: this.limite_he_td,
          projet_id: Number(this.$route.params.id),
        }
        this.loading = true;
        if (this.methods === 'POST'){
          await apiBilan.createLimiteSousTotal(limiteSousTotal, this.element_id);
          this.typeOperation = 'ajouté';
        } else {
          await apiBilan.editLimiteSousTotal(limiteSousTotal, this.element_id);
          this.typeOperation = 'modifié';
        }
      }
      await this.getSousTotaux();
      this.checkSousTotaux = true;
      this.clear();
      this.loading = false;
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset();
      this.$refs.formulaire.resetValidation();
      this.id = '';
      this.nom = '';
      this.limite_he_td = '';
      this.element_id = [];
      this.methods = 'POST';
    },
    async close() {
      await this.getElementsModules();
      this.form = !this.form;
      this.clear();
    },
    async edit(sousTotal) {
      this.methods = 'PUT';
      this.id = sousTotal.id;
      this.nom = sousTotal.nom_limite;
      this.limite_he_td = sousTotal.limite_he_td;
      this.element_id = await apiBilan.getAllGroupeSousTotalByLimite(sousTotal.id);
      this.form = true;
    },
    closeDialog(){
      this.dialog = false;
      this.id = '';
      this.nom = '';
    },
    openDialog(limite) {
      this.dialog = true;
      this.id = limite.id;
      this.nom = limite.nom_limite;
    },
    async deleteLimite() {
      this.loading = true;
      await apiBilan.deleteLimiteSousTotal(this.id);
      this.id = '';
      await this.getSousTotaux();
      this.loading = false;
      this.dialog = false;
      this.typeOperation = 'supprimé';
      this.responseSuccess = true;
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    },
    sortedByIntervenantBilan() {
      if (this.sortIntervenantBilan) {
        this.sortIntervenantBilan = false;
        this.bilans.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase());
      } else {
        this.sortIntervenantBilan = true;
        this.bilans.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase());
      }
    },
    sortedByIntervenantSousTotal() {
      this.sortByLimite = false;
      if (this.sortIntervenantSousTotal) {
        this.sortIntervenantSousTotal = false;
        this.sousTotaux.sort((a, b) => a.prenom.toUpperCase() > b.prenom.toUpperCase());
      } else {
        this.sortIntervenantSousTotal = true;
        this.sousTotaux.sort((a, b) => a.prenom.toUpperCase() < b.prenom.toUpperCase());
      }
    },
    sortedByLimite() {
      this.sortIntervenantSousTotal = false;
      if (this.sortByLimite) {
        this.sortByLimite = false;
        this.sousTotaux.sort((a, b) => a.nom_limite.toUpperCase() > b.nom_limite.toUpperCase());
      } else {
        this.sortByLimite = true;
        this.sousTotaux.sort((a, b) => a.nom_limite.toUpperCase() < b.nom_limite.toUpperCase());
      }
    },
    getClassColorForTotal(bilan){
      if (bilan.total_general < bilan.nb_he_td_min_attendu) return 'sous-service';
      if (bilan.total_general >= bilan.nb_he_td_min_attendu && bilan.total_general <= bilan.nb_he_td_max_attendu + bilan.nb_he_td_max_sup) return 'valide';
      if (bilan.total_general > bilan.nb_he_td_max_attendu + bilan.nb_he_td_max_sup) return 'heures-sup';
    },
    getClassColorForTotalHeureSup(bilan){
      if (bilan.total_heures_sup <= bilan.nb_he_td_max_sup) return 'valide';
      if (bilan.total_heures_sup > bilan.nb_he_td_max_sup) return 'heures-sup';
    },
    getClassColorForSousTotal(sousTotal){
      if (sousTotal.total_he_td <= sousTotal.limite) return 'valide';
      if (sousTotal.total_he_td > sousTotal.limite) return 'heures-sup';
    }
  },
  computed: {
    nomErrors() {
      const errors = [];
      if (!this.$v.nom.$dirty) return errors;
      !this.$v.nom.maxLength && errors.push('Le nom ne doit pas faire plus de 255 caractères');
      !this.$v.nom.required && errors.push('Le nom est obligatoire.');
      return errors;
    },
    limiteHeTDErrors() {
      const errors = [];
      if (!this.$v.limite_he_td.$dirty) return errors;
      !this.$v.limite_he_td.decimal && errors.push('La limite HeTD (équivalent TD) doit être un numérique');
      !this.$v.limite_he_td.required && errors.push('La limite HeTD (équivalent TD) est obligatoire');
      !this.$v.limite_he_td.required && errors.push('La limite HeTD (équivalent TD) est obligatoire');
      return errors;
    },
  },
  async mounted() {
    this.loading = true;
    await this.getProjet();
    await this.getStatut();
    await this.getBilanByProjetIntervenant();
    await this.getSousTotaux();
    await this.getElementsModules();
    this.loading = false;
  }
}
</script>

<style scoped>
.top-border{
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.left-border {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
.right-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.first-col {
  width: 10em !important;
  min-width: 10em !important;
  max-width: 10em !important;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.first-col-split {
  width: 5em !important;
  min-width: 5em !important;
  max-width: 5em !important;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
thead th {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.background-gray{
  background-color: rgba(0, 0, 0, 0.10) !important;
}
.sous-service{
  color: #D32F2F !important;
}
.valide {
  color: #4caf50 !important;
}
.heures-sup {
  color: #512DA8 !important;
}
</style>