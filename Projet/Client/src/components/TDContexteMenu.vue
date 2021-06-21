<template>
  <v-menu
      :disabled="disabled"
      offset-y
      right
      transition="slide-y-transition"
      :close-on-click="validForm"
      :close-on-content-click="validForm"
  >
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
        <v-text-field v-if="table === 'groupes-intervenants'"
            v-model="nbGroupeSemaineDefaut"
            :error-messages="nbGroupeSemaineDefautErrors"
            clearable
            autofocus
            @input="$v.nbGroupeSemaineDefaut.$touch()"
            @blur="$v.nbGroupeSemaineDefaut.$touch()"
        ></v-text-field>
        <v-text-field v-else
            v-model="volHorSemaineDefaut"
            :error-messages="volHorSemaineDefautErrors"
            clearable
            autofocus
            @input="$v.volHorSemaineDefaut.$touch()"
            @blur="$v.volHorSemaineDefaut.$touch()"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            text
            color="primary"
            @click="close"
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
import {validationMixin} from "vuelidate";
import {decimal,numeric, between, required} from "vuelidate/lib/validators";

export default {
  name: "TDContexteMenu",
  mixins: [validationMixin],
  props: ['typeCours', 'table', 'element', 'intervenant', 'disabled', 'lim'],

  validations: {
    volHorSemaineDefaut: {required, decimal, between:between(0,50)},
    nbGroupeSemaineDefaut: {required, numeric, between(value) {return between(0, this.lim)(value)}},
  },
  data: () => ({
    showMenuVolHor: false,
    validForm: false,
    volHorSemaineDefaut: 0,
    nbGroupeSemaineDefaut: 0,
    x: 0,
    y: 0,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'volumes-hebdomadaires');
    this.$store.dispatch('loadGenerique', 'elements');
  },
  computed: {
    ...mapState(['volumesHebdomadaires', 'elements']),
    volHorSemaineDefautErrors() {
      const errors = []
      if (!this.$v.volHorSemaineDefaut.$dirty) return errors
      !this.$v.volHorSemaineDefaut.required && errors.push('Ce champs est requis')
      !this.$v.volHorSemaineDefaut.decimal && errors.push('Le volume horaire doit être un nombre à virgule')
      !this.$v.volHorSemaineDefaut.between && errors.push('Le volume horaire doit être compris entre 0 et 50.0')
      return errors
    },
    nbGroupeSemaineDefautErrors() {
      const errors = []
      if (!this.$v.nbGroupeSemaineDefaut.$dirty) return errors
      !this.$v.nbGroupeSemaineDefaut.required && errors.push('Ce champs est requis')
      !this.$v.nbGroupeSemaineDefaut.numeric && errors.push('Le nombre de groupes doit être un entier')
      !this.$v.nbGroupeSemaineDefaut.between && errors.push('Le nombre de groupes doit être compris entre 0 et ' + this.lim)
      return errors
    },
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
    clear() {
      this.$v.$reset()
      this.volHorSemaineDefaut = 0
      this.nbGroupeSemaineDefaut = 0
    },
    close() {
      this.validForm = true
      this.clear()
    },
    appliquerTtesSem() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.validForm = false
        return;
      }
      if (this.table === 'groupes-intervenants'){
        this.volHorSemaineDefaut = this.nbGroupeSemaineDefaut
      }
      this.validForm = true
      this.$store.commit('SET_ValeurTtesSem', {element:this.element, value:this.volHorSemaineDefaut, typeCours:this.typeCours, tab:this.table, intervenant:this.intervenant})
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