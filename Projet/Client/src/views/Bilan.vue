<template>
  <v-container>
    <v-overlay :value="loading" :opacity="0">
      <v-progress-circular
          indeterminate
          size="64"
          color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col class="text-center">
        <h1 class="text-center text-h4 animate-pop-in mb-2">Bilan</h1>
        <span v-if="projet.length" class="text-subtitle-1 animate-pop-in">{{ projet[0].nom + ' - ' + toTime(projet[0].date,4)}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-start animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/projets')">
          <v-icon class="mr-2">folder</v-icon>Retourner aux projets
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/formations/projets/'+ Number($route.params.id))">
          <v-icon class="mr-2">auto_stories</v-icon>Aller aux formation
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end animate-pop-in">
        <v-btn outlined rounded color="primary" @click="redirect('/intervenants/projets/' + Number($route.params.id))">
          <v-icon class="mr-2">groups</v-icon>Aller aux intervenants
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!limiteSousTotal.length">
        <p class="text-center animate-pop-in">Aucun bilan sur le projet <span v-if="projet.length">« {{ projet[0].nom }} »</span></p>
      </v-col>
    </v-row>
    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success" :rounded="true">
        <span>Le statut a été {{ typeOperation }} avec succès.</span>
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
    <v-row v-if="limiteSousTotal.length" class="pa-3 pb-0 animate-pop-in">
      <v-col class="d-flex justify-start">
        <v-checkbox
            v-model="checkboxBilan"
            label="Afficher le bilan générale"
            color="primary"
            class="ma-0"
        ></v-checkbox>
        <v-checkbox
            v-model="checkboxSousTotaux"
            label="Afficher les sous totaux"
            color="primary"
            class="ma-0 ml-2"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col
          sm="12"
          class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">Bilan - {{ projet[0].nom }}</v-card-title>
          <v-card-subtitle class="text-subtitle-1">{{ toTime(projet[0].date, 4) }}</v-card-subtitle>
          <v-card-text class="pa-0">
            <v-simple-table v-if="checkboxBilan">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center top-border first-col">Intervenant</th>
                  <th class="text-center top-border">Total CM</th>
                  <th class="text-center top-border">Total TD</th>
                  <th class="text-center top-border">Total TP</th>
                  <th class="text-center top-border">Total Partiel</th>
                  <th class="text-center top-border">Total Générale</th>
                  <th class="text-center top-border">Total HeTD</th>
                  <th class="text-center top-border">Total H. sup</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="b in bilans" :key="b.intervenant_id">
                  <MenuShowDetailStatut :bilan="b"></MenuShowDetailStatut>
                  <td class="text-center">{{ b.total_cm }} h</td>
                  <td class="text-center">{{ b.total_td }} h</td>
                  <td class="text-center">{{ b.total_tp }} h</td>
                  <td class="text-center">{{ b.total_partiel }} h</td>
                  <td class="text-center">
                    <span :class="getClassColorForTotal(b)"><b>{{ b.total_general }} h</b></span>
                  </td>
                  <td class="text-center"></td>
                  <td class="text-center">{{ b.total_heures_sup }} h</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-simple-table v-if="checkboxSousTotaux">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center top-border first-col">Intervenant</th>
                  <th class="text-center top-border">Sous-total CM</th>
                  <th class="text-center top-border">Sous-total TD</th>
                  <th class="text-center top-border">Sous-total TP</th>
                  <th class="text-center top-border">Sous-total Partiel</th>
                  <th class="text-center top-border">Sous-total HeTD</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="text-center px-2">Nom enseignant</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
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
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Modifier</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <div class="mr-6">
              <v-icon small color="error">circle</v-icon><span class="mx-1">Sous-service</span>
            </div>
            <div class="mr-6">
              <v-icon small color="deep-purple darken-2">circle</v-icon><span class="mx-1">Dépasse les limites d’heures supp</span>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiProjet from "../services/API/projets";
import apiBilan from "../services/API/bilans";
import MenuShowDetailStatut from "../components/MenuShowDetailStatut";

export default {
  name: "Bilan",
  components: {MenuShowDetailStatut},
  data: () => ({
    bilans: [],
    limiteSousTotal: [],
    groupeSousTotal: [],
    projet: [],
    showMenuStatutDetail: false,
    checkboxBilan: true,
    checkboxSousTotaux: false,
    loading: false,
    responseSuccess: false,
    typeOperation: 'ajouté',
  }),
  methods: {
    async getProjet() {
      this.projet = await apiProjet.getProjet(this.$route.params.id);
    },
    async getBilanByProjetIntervenant() {
      this.bilans = await apiBilan.getBilanByProjetIntervenant(this.$route.params.id);
    },
    async getAllLimiteSousTotalByProjet() {
      this.limiteSousTotal = await apiBilan.getAllLimiteSousTotalByProjet(this.$route.params.id);
    },
    async getAllGroupeSousByLimiteSousTotal() {
      this.groupeSousTotal = await apiBilan.getAllGroupeSousTotal();
    },
    toTime(date, length) {
      return new Date(date).toISOString().substr(0, length);
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    },
    getClassColorForTotal(bilan){
      if (bilan.total_general < bilan.nb_he_td_min_attendu_projet) return 'sous-service';
      if (bilan.total_general >= bilan.nb_he_td_min_attendu_projet && bilan.total_general <= bilan.nb_he_td_max_attendu_projet + bilan.nb_he_td_max_sup_projet) return 'valide';
      if (bilan.total_general > bilan.nb_he_td_max_attendu_projet + bilan.nb_he_td_max_sup_projet) return 'heures-sup';
    }
  },
  computed: {

  },
  async mounted() {
    this.loading = true;
    await this.getProjet();
    await this.getBilanByProjetIntervenant();
    await this.getAllLimiteSousTotalByProjet();
    await this.getAllGroupeSousByLimiteSousTotal();
    this.loading = false;
  }
}
</script>

<style scoped>
.top-border{
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #e4e4e4 !important;
}
.first-col {
  width: 10em !important;
  min-width: 10em !important;
  max-width: 10em !important;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.sous-service{
  color: #df323b !important;
}
.valide {
  color: #4caf50 !important;
}

.heures-sup {
  color: #512DA8 !important;
}
</style>