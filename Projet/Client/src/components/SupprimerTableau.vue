<template>
  <div>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          small
          color="red darken-1"
          v-bind="attrs"
          v-on="on"
          @click="dialog = true"
      >
        <v-icon>close</v-icon>
      </v-btn>
      </template>
      <span v-if="type === 'groupes-intervenants'">Supprimer l'intervenant</span>
      <span v-else>Supprimer les volumes hebdomadaires</span>
    </v-tooltip>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5 red darken-2 white--text">
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
              color="red darken-1"
              text
              @click="dialog = false"
          >
            Annuler
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              class="mr-4"
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
export default {
  name: "SupprimerTableau",
  props: ['type', 'module', 'intervenant'],

  data: () => ({
    dialog: false,
  }),
  methods: {
    deleteAll(){
      if (this.type === 'groupes-intervenants'){
        this.$store.dispatch('DELETE_AllGroupeIntervenant', {element_id: this.module.id, intervenant_id: this.intervenant.intervenant_id})
      } else if (this.type === 'volumes-hebdomadaires') {
        this.$store.dispatch('DELETE_AllVolumesHebdomadaires', this.module.id);
      } else if (this.type === 'volumes-globaux') {
        console.log()
      }
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>