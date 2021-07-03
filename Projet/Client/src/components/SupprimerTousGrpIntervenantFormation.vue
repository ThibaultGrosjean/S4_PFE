<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            class="ma-1 mt-2"
            @click="dialog = true"
        >
          <v-icon color="error darken-1">person_remove</v-icon>
        </v-btn>
      </template>
      <span>Supprimer les groupes d'intervenants</span>
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
          Êtes-vous sûr de vouloir supprimer tous les groupes d'intervenants de « {{ formation.titre }} » ?</v-card-text>
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
import apiGroupeIntervenant from "../services/API/groupes-intervenants";

export default {
  name: "SupprimerTousVGrpIntervenant",
  props: ['formation'],

  data: () => ({
    dialog: false,
    loading: false,
  }),
  methods: {
    async valider() {
      this.loading = true;
      await apiGroupeIntervenant.deleteGroupeIntervenantByFormation(this.formation.id);
      this.$emit('relaod-all-groupes');
      this.loading = false;
      this.dialog = false;
    }
  }
}
</script>

<style scoped>

</style>