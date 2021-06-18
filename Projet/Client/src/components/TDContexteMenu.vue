<template>
  <v-menu :disabled="disabled" offset-y right>
    <template v-slot:activator="{ on }">
      <td class="text-right right-border first-col" @contextmenu.prevent="on.click">
        {{ type.toUpperCase() }}
      </td>
    </template>
    <v-card>
      <v-card-title class="text-h6 text-center">Valeur pour toutes les semaines</v-card-title>
      <v-card-subtitle class="text-subtitle-1 text-center">{{ type.toUpperCase() }}</v-card-subtitle>
      <v-card-text>
        <v-text-field
            v-model="volHorSemaineDefaut"
            :rules="[vol_hor]"
            clearable
            autofocus
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            text
            color="primary"
        >
          Annuler
        </v-btn>
        <v-btn
            text
            color="primary"
            @click="appliquerTtesSem()"
        >
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "TDContexteMenu",
  props: ['type', 'element', 'disabled'],
  data: () => ({
    showMenuVolHor: false,
    volHorSemaineDefaut: 0,
    x: 0,
    y: 0,
    vol_hor: v => {
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 50.0) return true;
      return 'Le volume horaire doit être compris entre 0 et 50.0';
    },
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'volumes-hebdomadaires');
    this.$store.dispatch('loadGenerique', 'elements');
  },
  computed: {
    ...mapState(['volumesHebdomadaires', 'elements'])
  },
  methods: {
    show(e) {
      e.preventDefault()
      this.showMenuVolHor = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenuVolHor = true
      })
    },
    appliquerTtesSem() {
      this.$store.commit('SET_ValeurTtesSem', {element:this.element, value:this.volHorSemaineDefaut, type:this.type})
    },
  }
}
</script>

<style scoped>
.right-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
td.first-col {
  width: 7em;
  min-width: 7em;
  max-width: 7em;
}
</style>