<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="350"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          v-bind="attrs"
          v-on="on"
          >
        <v-icon color="error darken-1">delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        Confirmation
      </v-card-title>
      <v-card-text>Êtes-vous sûr de vouloir supprimer cet enregistrement ?</v-card-text>
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
            color="success darken-1"
            text
            @click="deleteItem(item)"
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
  props: ['item'],
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    deleteItem(item){
      //TODO trouver un moyen de génraliser l'action ou supprimer cette vue et la remettre dans ReadNom.vue et ajouter une snackbar a la fin de la suppression
      this.$store.commit('DELETE_Enseignant', item);
    }
  }
}
</script>

<style scoped>

</style>