<template>
  <v-menu :disabled="disabled" offset-y right>
    <template v-slot:activator="{ on }">
      <td class="text-right right-border first-col" @contextmenu.prevent="on.click">
        {{ typeCours.toUpperCase() }}
      </td>
    </template>
    <v-card>
      <v-card-title class="text-h6 text-center">
        <span v-if="table === 'groupes-intervenants'">Nombre de groupes pour toutes les semaines</span>
        <span v-else>Volume horaire pour toutes les semaines</span>
      </v-card-title>
      <v-card-subtitle class="text-subtitle-1 text-center">{{ typeCours.toUpperCase() }}</v-card-subtitle>
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
  props: ['typeCours', 'table', 'element', 'intervenant', 'disabled'],
  data: () => ({
    showMenuVolHor: false,
    volHorSemaineDefaut: 0,
    x: 0,
    y: 0,

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
      this.$store.commit('SET_ValeurTtesSem', {element:this.element, value:this.volHorSemaineDefaut, typeCours:this.typeCours, tab:this.table, intervenant:this.intervenant})
    },
    vol_hor() {
      let index = this.elements.findIndex(i => i.id === this.element);
      var el = this.elements[index]
      if (this.table === 'groupes-intervenants'){
        switch (this.typeCours){
          case 'cm' :
            if (!isNaN(parseInt(this.volHorSemaineDefaut)) && this.volHorSemaineDefaut >= 0 && this.volHorSemaineDefaut <= el.nb_groupe_effectif_cm) return true;
            return 'Le nombre de groupes doit être compris entre 0 et ' + el.nb_groupe_effectif_cm;
          case 'td':
            if (!isNaN(parseInt(this.volHorSemaineDefaut)) && this.volHorSemaineDefaut >= 0 && this.volHorSemaineDefaut <= el.nb_groupe_effectif_td) return true;
            return 'Le nombre de groupes doit être compris entre 0 et ' + el.nb_groupe_effectif_td;
          case 'tp' :
            if (!isNaN(parseInt(this.volHorSemaineDefaut)) && this.volHorSemaineDefaut >= 0 && this.volHorSemaineDefaut <= el.nb_groupe_effectif_tp) return true;
            return 'Le nombre de groupes doit être compris entre 0 et ' + el.nb_groupe_effectif_tp;
          case 'partiel' :
            if (!isNaN(parseInt(this.volHorSemaineDefaut)) && this.volHorSemaineDefaut >= 0 && this.volHorSemaineDefaut <= el.nb_groupe_effectif_partiel) return true;
            return 'Le nombre de groupes doit être compris entre 0 et ' + el.nb_groupe_effectif_partiel;
          default:
            return 'Le nombre de groupe doit être un entier';
        }
      } else {
        if (!isNaN(parseFloat(this.volHorSemaineDefaut)) && this.volHorSemaineDefaut >= 0 && this.volHorSemaineDefaut <= 50.0) return true;
        return 'Le volume horaire doit être compris entre 0 et 50.0';
      }
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