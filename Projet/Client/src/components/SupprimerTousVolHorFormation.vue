<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            :loading="loading"
            icon
            v-bind="attrs"
            v-on="on"
            class="ma-1 mt-2"
            color="error darken-1"
            @click="dialog = true"
        >
          <v-icon>auto_delete</v-icon>
        </v-btn>
      </template>
      <span>Supprimer les volumes horaires</span>
    </v-tooltip>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5 error darken-2 white--text">
          <span class="headline">Confirmation de suppression</span>
          <v-spacer></v-spacer>
          <v-btn icon  color="white" @click="dialog =false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-justify pt-4">
          Êtes-vous sûr de vouloir supprimer tous les volumes hebdomadaires et globaux de « {{ formation.titre }} » ?
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
              @click="valider"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import apiVolumeHebdomadaire from "../services/API/volumes-hebdomadaires";
import apiGroupeIntervenant from "../services/API/groupes-intervenants";
import apiVolumeGlobaux from "../services/API/volumes-globaux";

export default {
  name: "SupprimerTousVolHorFormation",
  props: ['formation'],

  data: () => ({
    dialog: false,
    loading: false,
  }),
  methods: {
    async valider() {
      this.loading = true;
      await apiVolumeHebdomadaire.deleteVolumeHebdomadaireByFormation(this.formation.id);
      await apiGroupeIntervenant.deleteGroupeIntervenantByFormation(this.formation.id);
      await apiVolumeGlobaux.deleteVolumeGlobauxByFormation(this.formation.id);
      this.$emit('reload-data');
      this.loading = false;
      this.dialog = false;
    }
  }
}
</script>

<style scoped>

</style>