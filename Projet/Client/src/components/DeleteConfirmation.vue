<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon color="red darken-1">
        <v-icon
            v-bind="attrs"
            v-on="on"
        >
          delete
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        Confirmation
      </v-card-title>
      <v-card-text>Êtes-vous sûr de vouloir supprimer cet enregistrement ?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
        >
          Annuler
        </v-btn>
        <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
        >
          Confirmer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmPopUp",
  data() {
    return {
      dialog: false,
    }
  },
}
</script>

<style scoped>

</style>