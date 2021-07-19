<template>
  <v-menu
      v-model="showMenuStatutDetails"
      offset-y
      bottom
      transition="slide-y-transition"
      class="border-custom"
  >
    <template v-slot:activator="{ on }">
      <td class="text-center px-2 first-col" @contextmenu.prevent="on.click">
        {{ bilan.prenom }} {{ bilan.nom }}
      </td>
    </template>
    <v-card class="border-custom">
      <v-card-title class="justify-center">{{ bilan.prenom }} {{ bilan.nom }}</v-card-title>
      <v-card-text class="px-5 pb-5">
        <DetailsStatut :data="bilan"/>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import DetailsStatut from "./DetailsStatut";
export default {
  name: "MenuShowDetailStatut",
  components: {DetailsStatut},
  props: ['bilan'],
  data: () => ({
    showMenuStatutDetails: false,
    x: 0,
    y: 0,
  }),
  methods: {
    show(e) {
      e.preventDefault();
      this.showMenuStatutDetails = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenuStatutDetails = true;
      })
    },
  }
}
</script>

<style scoped>
.first-col {
  width: 10em !important;
  min-width: 10em !important;
  max-width: 10em !important;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>