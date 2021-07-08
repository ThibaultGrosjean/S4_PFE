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
      <v-card-text>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip> minimales attendues : <b>{{ bilan.nb_he_td_min_attendu_projet }}</b> h<br>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip> maximales attendues : <b>{{ bilan.nb_he_td_max_attendu_projet }}</b> h<br>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip> minimales sup. : <b>{{ bilan.nb_he_td_min_sup_projet }}</b> h<br>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip> maximales sup. : <b>{{ bilan.nb_he_td_max_sup_projet }}</b> h<br>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "MenuShowDetailStatut",
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