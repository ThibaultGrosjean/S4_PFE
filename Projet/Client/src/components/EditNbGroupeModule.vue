<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            @click="edit"
        >
          <v-icon>group</v-icon>
        </v-btn>
      </template>
      <span>Modifier les nombres de groupes</span>
    </v-tooltip>
    <v-dialog
        v-model="form"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-form lazy-validation>
          <v-card-title>
            <span class="headline">Modifier les nombres de groupes de {{ element.surnom }}</span>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click="close"
            >
              <v-icon>
                close
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field v-if="Boolean(element.cm_autorises)"
                clearable
                v-model="nb_groupe_effectif_cm"
                :error-messages="nb_groupe_effectif_cmErrors"
                label="Nombre de groupes effectifs pour les CM"
                @input="$v.nb_groupe_effectif_cm.$touch()"
                @blur="$v.nb_groupe_effectif_cm.$touch()"
            ></v-text-field>
            <v-text-field v-if="Boolean(element.td_autorises)"
                clearable
                v-model="nb_groupe_effectif_td"
                :error-messages="nb_groupe_effectif_tdErrors"
                label="Nombre de groupes effectifs pour les TD"
                @input="$v.nb_groupe_effectif_td.$touch()"
                @blur="$v.nb_groupe_effectif_td.$touch()"
            ></v-text-field>
            <v-text-field v-if="Boolean(element.tp_autorises)"
                clearable
                v-model="nb_groupe_effectif_tp"
                :error-messages="nb_groupe_effectif_tpErrors"
                label="Nombre de groupes effectifs pour les TP"
                @input="$v.nb_groupe_effectif_tp.$touch()"
                @blur="$v.nb_groupe_effectif_tp.$touch()"
            ></v-text-field>
            <v-text-field v-if="Boolean(element.partiel_autorises)"
                clearable
                v-model="nb_groupe_effectif_partiel"
                :error-messages="nb_groupe_effectif_partielErrors"
                label="Nombre de groupes effectifs pour les partiels"
                @input="$v.nb_groupe_effectif_partiel.$touch()"
                @blur="$v.nb_groupe_effectif_partiel.$touch()"
            ></v-text-field>

            <v-card-actions>
              <v-btn
                  color="error darken-1"
                  class="mr-4"
                  text
                  @click="clear"
              >
                Vider
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  :loading="loading"
                  color="success darken-1"
                  class="mr-4"
                  text
                  @click="submit"
              >
                Valider
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {validationMixin} from "vuelidate";
import {numeric} from "vuelidate/lib/validators";
import apiElement from "../services/API/elements";

export default {
  name: "EditNbGroupeModule",
  mixins: [validationMixin],
  props: ['element'],
  validations: {
    nb_groupe_effectif_cm: {numeric},
    nb_groupe_effectif_td: {numeric},
    nb_groupe_effectif_tp: {numeric},
    nb_groupe_effectif_partiel: {numeric},
  },
  data: () => ({
    form: false,
    loading: false,
    nb_groupe_effectif_cm: null,
    nb_groupe_effectif_td: null,
    nb_groupe_effectif_tp: null,
    nb_groupe_effectif_partiel: null,
  }),
  methods: {
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.element.nb_groupe_effectif_cm = this.nb_groupe_effectif_cm;
      this.element.nb_groupe_effectif_td = this.nb_groupe_effectif_td;
      this.element.nb_groupe_effectif_tp = this.nb_groupe_effectif_tp;
      this.element.nb_groupe_effectif_partiel = this.nb_groupe_effectif_partiel;
      this.loading = true;

      await apiElement.editElement(this.element);
      this.clear();
      this.loading = false;
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset()
      this.nb_groupe_effectif_cm = '';
      this.nb_groupe_effectif_td = '';
      this.nb_groupe_effectif_tp = '';
      this.nb_groupe_effectif_partiel = '';
    },
    close() {
      this.form = !this.form;
      this.clear();
    },
    edit() {
      this.nb_groupe_effectif_cm = this.element.nb_groupe_effectif_cm;
      this.nb_groupe_effectif_td =  this.element.nb_groupe_effectif_td;
      this.nb_groupe_effectif_tp =  this.element.nb_groupe_effectif_tp;
      this.nb_groupe_effectif_partiel =  this.element.nb_groupe_effectif_partiel;

      this.form = true;
    },
  },
  computed: {
    nb_groupe_effectif_cmErrors() {
      const errors = [];
      !this.$v.nb_groupe_effectif_cm.numeric && errors.push('Nombre de groupes effectifs pour les CM doit être un entier');
      return errors;
    },
    nb_groupe_effectif_tdErrors() {
      const errors = [];
      !this.$v.nb_groupe_effectif_td.numeric && errors.push('Nombre de groupes effectifs pour les TD doit être un entier');
      return errors;
    },
    nb_groupe_effectif_tpErrors() {
      const errors = [];
      !this.$v.nb_groupe_effectif_tp.numeric && errors.push('Nombre de groupes effectifs pour les TP doit être un entier');
      return errors;
    },
    nb_groupe_effectif_partielErrors() {
      const errors = [];
      !this.$v.nb_groupe_effectif_partiel.numeric && errors.push('Nombre de groupes effectifs pour les partiel doit être un entier');
      return errors;
    },
  },
}
</script>

<style scoped>
</style>