<template>
  <v-menu
      :disabled="disabled"
      offset-y
      z-index="2000"
      bottom
      transition="slide-y-transition"
      :close-on-click="validForm"
      :close-on-content-click="validForm"
  >
    <template v-slot:activator="{ on, attrs }">
      <td v-bind="attrs" v-on="on" class="text-center">
        <div v-if="table === 'groupes-intervenants'">
          <span v-if="typeCours === 'cm'">{{ data.nb_groupe_cm }}</span>
          <span v-if="typeCours === 'td'">{{ data.nb_groupe_td }}</span>
          <span v-if="typeCours === 'tp'">{{ data.nb_groupe_tp }}</span>
          <span v-if="typeCours === 'partiel'">{{ data.nb_groupe_partiel }}</span>
        </div>
        <div v-else>
          <span v-if="typeCours === 'cm'">{{ data.vol_hor_cm }}</span>
          <span v-if="typeCours === 'td'">{{ data.vol_hor_td }}</span>
          <span v-if="typeCours === 'tp'">{{ data.vol_hor_tp }}</span>
          <span v-if="typeCours === 'partiel'">{{ data.vol_hor_partiel }}</span>
        </div>
      </td>
    </template>
    <v-card>
      <v-card-title class="text-h6 d-flex justify-center">
        <span v-if="table === 'groupes-intervenants'">Nombre de groupes {{ typeCours.toUpperCase() }}</span>
        <span v-else>Volume horaire {{ typeCours.toUpperCase() }}</span>
      </v-card-title>
      <v-card-subtitle class="text-subtitle-1 text-center">Semaine {{ data.num_semaine }}</v-card-subtitle>
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
            @click="save"
        >
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import {validationMixin} from "vuelidate";
import {between, decimal, numeric, required} from "vuelidate/lib/validators";
import apiGroupeIntervenant from "../services/API/groupes-intervenants";
import apiVolumeHebdomadaire from "../services/API/volumes-hebdomadaires";
import apiVolumeGlobaux from "../services/API/volumes-globaux";

export default {
  name: "TDVEditDialog",
  mixins: [validationMixin],
  props: ['typeCours', 'table', 'data', 'disabled', 'lim'],

  validations: {
    volHorSemaineDefaut: {required, decimal, between:between(0,50)},
    nbGroupeSemaineDefaut: {required, numeric, between(value) {return between(0, this.lim)(value)}},
  },
  data: () => ({
    loading: false,
    showMenuVolHor: false,
    validForm: false,
    volHorSemaineDefaut: 0,
    nbGroupeSemaineDefaut: 0,
    x: 0,
    y: 0,
  }),
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
      if (this.table === 'groupes-intervenants') {
        if (this.typeCours === 'cm') this.nbGroupeSemaineDefaut = this.data.nb_groupe_cm;
        if (this.typeCours === 'td') this.nbGroupeSemaineDefaut = this.data.nb_groupe_td;
        if (this.typeCours === 'tp') this.nbGroupeSemaineDefaut = this.data.nb_groupe_tp;
        if (this.typeCours === 'partiel') this.nbGroupeSemaineDefaut = this.data.nb_groupe_partiel;
      }
      else {
        if (this.typeCours === 'cm') this.volHorSemaineDefaut = this.data.vol_hor_cm;
        if (this.typeCours === 'td') this.volHorSemaineDefaut = this.data.vol_hor_td;
        if (this.typeCours === 'tp') this.volHorSemaineDefaut = this.data.vol_hor_tp;
        if (this.typeCours === 'partiel') this.volHorSemaineDefaut = this.data.vol_hor_partiel;
      }
    },
    close() {
      this.validForm = true;
      this.showMenuVolHor = false;
      this.clear();
    },
    async save() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.validForm = false;
        return;
      }
      this.validForm = true;
      this.loading = true;
      if (this.table === 'groupes-intervenants') {
        if (this.typeCours === 'cm') this.data.nb_groupe_cm = this.nbGroupeSemaineDefaut;
        if (this.typeCours === 'td') this.data.nb_groupe_td = this.nbGroupeSemaineDefaut;
        if (this.typeCours === 'tp') this.data.nb_groupe_tp = this.nbGroupeSemaineDefaut;
        if (this.typeCours === 'partiel') this.data.nb_groupe_partiel = this.nbGroupeSemaineDefaut;
        await apiGroupeIntervenant.editGroupeIntervenant(this.data);
      }
      else if (this.table === 'volumes-hebdomadaires') {
        if (this.typeCours === 'cm') this.data.vol_hor_cm = this.volHorSemaineDefaut;
        if (this.typeCours === 'td') this.data.vol_hor_td = this.volHorSemaineDefaut;
        if (this.typeCours === 'tp') this.data.vol_hor_tp = this.volHorSemaineDefaut;
        if (this.typeCours === 'partiel') this.data.vol_hor_partiel = this.volHorSemaineDefaut;
        await apiVolumeHebdomadaire.editVolumeHebdomadaire(this.data);
      }
      else if (this.table === 'volumes-globaux') {
        if (this.typeCours === 'cm') this.data.vol_hor_cm = this.volHorSemaineDefaut;
        if (this.typeCours === 'td') this.data.vol_hor_td = this.volHorSemaineDefaut;
        if (this.typeCours === 'tp') this.data.vol_hor_tp = this.volHorSemaineDefaut;
        if (this.typeCours === 'partiel') this.data.vol_hor_partiel = this.volHorSemaineDefaut;
        await apiVolumeGlobaux.editVolumeGlobaux(this.data);
      }
      this.$emit('reload-data');
      this.loading = false;
    },
  },
  mounted() {
    this.clear();
  }
}
</script>

<style scoped>
</style>