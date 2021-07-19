<template>
  <v-menu
      :disabled="disabled"
      offset-y
      bottom
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
      <v-card-title class="text-h6 d-flex justify-center">
        <span v-if="table === 'groupes-intervenants'">Nombre de groupes {{ typeCours.toUpperCase() }}s</span>
        <span v-else-if="table === 'volumes-globaux'">Forfait horaire du {{ element.titre.substr(element.titre.indexOf(":")+1) }}</span>
        <span v-else>Volume horaire {{ typeCours.toUpperCase() }}</span>
      </v-card-title>
      <v-card-subtitle class="text-subtitle-1 text-center">Pour toutes les semaines</v-card-subtitle>
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
        <v-btn
            :disabled="loading"
            color="error darken-1"
            text
            @click="close"
        >
          Annuler
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            :loading="loading"
            color="success darken-1"
            text
            @click="appliquerTtesSem()"
        >
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import apiVolumeHebdomadaire from "../services/API/volumes-hebdomadaires";
import apiGroupeIntervenant from "../services/API/groupes-intervenants";
import {validationMixin} from "vuelidate";
import {decimal,numeric, between, required} from "vuelidate/lib/validators";
import apiVolumeGlobaux from "../services/API/volumes-globaux";

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
    loading: false,
    validForm: false,
    volHorSemaineDefaut: 0,
    nbGroupeSemaineDefaut: 0,
    x: 0,
    y: 0,
  }),
  methods: {
    show(e) {
      e.preventDefault();
      this.showMenuVolHor = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenuVolHor = true;
      })
    },
    clear() {
      this.$v.$reset();
      if (this.table !== 'volumes-globaux') {
        this.volHorSemaineDefaut = 0;
        this.nbGroupeSemaineDefaut = 0;
      }
    },
    close() {
      this.validForm = true;
      this.clear();
    },
    async appliquerTtesSem() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.validForm = false;
        return;
      }
      this.validForm = true;
      this.loading = true;
      if (this.table === 'groupes-intervenants') {
        await apiGroupeIntervenant.editTypeValueElementGroupeIntervenant(this.nbGroupeSemaineDefaut, this.element.id, this.intervenant, this.typeCours);
        this.$emit('reload-groupes-intervenants');
      }
      if (this.table === 'volumes-hebdomadaires') {
        await apiVolumeHebdomadaire.editTypeValueElementVolumeHebdomadaire(this.volHorSemaineDefaut, this.element.id, this.typeCours);
        this.$emit('reload-volumes-hebdomadaires');
      }
      if (this.table === 'volumes-globaux') {
        await apiVolumeGlobaux.editTypeValueElementVolumeGlobaux(this.volHorSemaineDefaut, this.element.id, this.typeCours);
        this.$emit('reload-volumes-globaux');
      }
      this.loading = false;
    },
  },
  computed: {
    volHorSemaineDefautErrors() {
      const errors = [];
      if (!this.$v.volHorSemaineDefaut.$dirty) return errors;
      !this.$v.volHorSemaineDefaut.required && errors.push('Ce champs est requis');
      !this.$v.volHorSemaineDefaut.decimal && errors.push('Le volume horaire doit être un nombre à virgule');
      !this.$v.volHorSemaineDefaut.between && errors.push('Le volume horaire doit être compris entre 0 et 50.0');
      return errors;
    },
    nbGroupeSemaineDefautErrors() {
      const errors = [];
      if (!this.$v.nbGroupeSemaineDefaut.$dirty) return errors;
      !this.$v.nbGroupeSemaineDefaut.required && errors.push('Ce champs est requis');
      !this.$v.nbGroupeSemaineDefaut.numeric && errors.push('Le nombre de groupes doit être un entier');
      !this.$v.nbGroupeSemaineDefaut.between && errors.push('Le nombre de groupes doit être compris entre 0 et ' + this.lim);
      return errors;
    },
  },
  mounted() {
    if (this.table === 'volumes-globaux') {
      switch(this.typeCours) {
        case 'cm':
          this.volHorSemaineDefaut = this.element.forfait_globale_cm
          break;
        case 'td':
          this.volHorSemaineDefaut = this.element.forfait_globale_td
          break;
        case 'tp':
          this.volHorSemaineDefaut = this.element.forfait_globale_tp
          break;
        case 'partiel':
          this.volHorSemaineDefaut = this.element.forfait_globale_partiel
          break;
        default:
      }
    }
  }
}
</script>

<style scoped>
.right-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.first-col {
  min-width: 70px !important;
  word-wrap: normal !important;
}
</style>