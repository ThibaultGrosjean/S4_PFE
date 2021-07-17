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
          <v-icon>access_time</v-icon>
        </v-btn>
      </template>
      <span>{{ exist ? "Modifier la période" : "Ajouter une période" }}</span>
    </v-tooltip>
    <v-dialog
        v-model="form"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-form lazy-validation>
          <v-card-title>
            <span class="headline" v-if="!exist">Ajouter une période au {{ element.titre }}</span>
            <span class="headline" v-else>Modifier la période du {{ element.titre }}</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="close">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
                v-model="periode.nb_semaine"
                :error-messages="errors.nb_semaine"
                label="Nombre de semaines"
                clearable
            ></v-text-field>
            <v-text-field
                v-model="periode.nb_groupe_defaut_cm"
                :error-messages="errors.nb_groupe_defaut_cm"
                label="Nombre de groupes par défaut pour les CM"
                clearable
            ></v-text-field>
            <v-text-field
                v-model="periode.nb_groupe_defaut_td"
                :error-messages="errors.nb_groupe_defaut_td"
                label="Nombre de groupes par défaut pour les TD"
                clearable
            ></v-text-field>
            <v-text-field
                v-model="periode.nb_groupe_defaut_tp"
                :error-messages="errors.nb_groupe_defaut_tp"
                label="Nombre de groupes par défaut pour les TP"
                clearable
            ></v-text-field>
            <v-text-field
                v-model="periode.nb_groupe_defaut_partiel"
                :error-messages="errors.nb_groupe_defaut_partiel"
                label="Nombre de groupes par défaut pour les partiels"
                clearable
            ></v-text-field>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  rounded
                  :loading="loading"
                  color="success darken-1"
                  text
                  @click="valideForm"
              >
                Valider
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
          v-model="confirmEditPeriode"
          persistent
          max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5 error darken-2 white--text">
            Confirmation de modification
          </v-card-title>
          <v-card-text class="text-justify pt-4">
            Êtes-vous sûr de vouloir changer le numéro de semaine pour le semestre ?<br><br>
            Cela augmentera / diminuera le nombre de semaine pour tous les modules où la saisie est hebdomadaire.
          </v-card-text>
          <v-card-actions>
            <v-btn
                :disabled="loading"
                color="error darken-1"
                text
                @click="cancel"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :loading="loading"
                color="success darken-1"
                text
                @click="submit"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
  </v-dialog>
  </div>
</template>

<script>
import apiPeriode from "../services/API/periodes";

export default {
  name: "EditPeriode",
  props: ['element'],
  data: () => ({
    periodes: [],
    errors: [],
    form: false,
    loading: false,
    confirmEditPeriode: false,
    exist : false,
    periode: {
      id: '',
      nb_semaine: '',
      nb_groupe_defaut_cm: '',
      nb_groupe_defaut_td: '',
      nb_groupe_defaut_tp: '',
      nb_groupe_defaut_partiel: '',
      element_id: '',
    },
    old_nb_semaine: '',
  }),
  methods: {
    async getPeriodeByElementId() {
      const res = await apiPeriode.getPeriodeByElementId(this.element.id);
      if (!res.length) {
        this.exist = false;
        this.periode.element_id = this.element.id;
      } else {
        this.exist = true;
        this.periode = res[0];
        this.old_nb_semaine = this.periode.nb_semaine;
      }
    },
    async submit() {
      this.loading = true;
      if (!this.exist) {
        const res = await apiPeriode.createPeriode(this.periode);
        if (res.errors){
          this.errors = res.errors;
        } else {
          this.confirmEditPeriode = false;
          this.clear();
          this.form = false;
        }
      } else {
        const res = await apiPeriode.editPeriode(this.periode);
        if (res.errors){
          this.errors = res.errors;
        } else {
          this.confirmEditPeriode = false;
          this.exist = true;
          this.clear();
          this.form = false;
        }
      }
      this.$emit('reload-periode');
      this.loading = false;
    },
    clear() {
      this.periode = {
        id: '',
        nb_semaine: '',
        nb_groupe_defaut_cm: '',
        nb_groupe_defaut_td: '',
        nb_groupe_defaut_tp: '',
        nb_groupe_defaut_partiel: '',
        element_id: null,
      }
      this.old_nb_semaine = '';
      this.errors = [];
    },
    close() {
      this.form = !this.form;
      this.clear();
    },
    cancel() {
      this.confirmEditPeriode = false;
      this.close();
    },
    async edit() {
      await this.getPeriodeByElementId()
      this.form = true;
    },
    valideForm() {
      if (this.periode.nb_semaine !== this.old_nb_semaine && this.exist){
        this.confirmEditPeriode = true;
      } else {
        this.submit();
      }
    },
  },
  mounted() {
    this.getPeriodeByElementId();
  }
}
</script>

<style scoped>
</style>