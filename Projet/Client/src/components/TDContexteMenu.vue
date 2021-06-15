<template>
  <v-menu offset-y right>
    <template v-slot:activator="{ on }">
      <td class="text-right" @contextmenu.prevent="on.click">
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
  props: ['type', 'element'],
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
    this.$store.dispatch('loadVolumesHebdomadaires');
    this.$store.dispatch('loadElements');
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
</style>