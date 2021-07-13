<template>
  <div>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          small
          color="error darken-1"
          v-bind="attrs"
          v-on="on"
          :disabled="disabled"
          @click="dialog = true"
      >
        <v-icon>close</v-icon>
      </v-btn>
      </template>
      <span v-if="type === 'groupes-intervenants'">Supprimer l'intervenant</span>
      <span v-else-if="type === 'volumes-globaux'">Supprimer les volumes globaux</span>
      <span v-else>Supprimer les volumes hebdomadaires</span>
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
          Êtes-vous sûr de vouloir supprimer
          <span v-if="type === 'groupes-intervenants'">
           l'intervenant
          </span>
          <span v-else> les volumes horaires </span>
          du module {{ module.titre }} ?
        </v-card-text>
        <v-card-actions>
          <v-btn
              rounded
              :disabled="loading"
              color="error darken-1"
              text
              @click="dialog = false"
          >
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              rounded
              :loading="loading"
              color="success darken-1"
              text
              @click="deleteAll"
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
import apiVolumeHebdomadaire from "../services/API/volumes-hebdomadaires";
import apiVolumeGlobaux from "../services/API/volumes-globaux";

export default {
  name: "SupprimerTableau",
  props: ['type', 'module', 'intervenant', 'disabled'],

  data: () => ({
    dialog: false,
    loading: false,
  }),
  methods: {
    async deleteAll(){
      if (this.type === 'groupes-intervenants'){
        this.loading = true;
        await apiGroupeIntervenant.deleteGroupeIntervenantByElement(this.module.id, this.intervenant.intervenant_id);
        this.loading = false;
        this.$emit('reload-groupes-intervenants-module');
      } else if (this.type === 'volumes-hebdomadaires') {
        this.loading = true;
        await apiVolumeHebdomadaire.deleteVolumeHebdomadaireByElement(this.module.id);
        this.loading = false;
        this.$emit('reload-volumes-hebdomadaires-module');
      } else if (this.type === 'volumes-globaux') {
        this.loading = true;
        await apiVolumeGlobaux.deleteVolumeGlobauxByElement(this.module.id, this.intervenant.intervenant_id);
        this.loading = false;
        this.$emit('reload-volumes-globaux-module');
      }
      this.dialog = false;
    }
  }
}
</script>

<style scoped>

</style>