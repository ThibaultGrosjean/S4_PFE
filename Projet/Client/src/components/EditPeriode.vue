<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            @click="edit(findPeriodeSemestre(element))"
        >
          <v-icon>access_time</v-icon>
        </v-btn>
      </template>
      <span>Modifier à la période</span>
    </v-tooltip>
    <v-dialog
        v-model="form"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-form lazy-validation>
          <v-card-title>
            <span class="headline">Modifier la période du {{ element.titre }}</span>
            <v-spacer></v-spacer>
            <v-btn
                icon
                @click="close"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
                v-model="nb_semaine"
                :error-messages="nb_semaineErrors"
                label="Nombre de semaines"
                required
                clearable
                @input="$v.nb_semaine.$touch()"
                @blur="$v.nb_semaine.$touch()"
            ></v-text-field>
            <v-text-field
                v-model="nb_groupe_defaut_cm"
                :error-messages="nb_groupe_defaut_cmErrors"
                label="Nombre de groupes par défaut pour les CM"
                required
                clearable
                @input="$v.nb_groupe_defaut_cm.$touch()"
                @blur="$v.nb_groupe_defaut_cm.$touch()"
            ></v-text-field>
            <v-text-field
                v-model="nb_groupe_defaut_td"
                :error-messages="nb_groupe_defaut_tdErrors"
                label="Nombre de groupes par défaut pour les TD"
                required
                clearable
                @input="$v.nb_groupe_defaut_td.$touch()"
                @blur="$v.nb_groupe_defaut_td.$touch()"
            ></v-text-field>
            <v-text-field
                v-model="nb_groupe_defaut_tp"
                :error-messages="nb_groupe_defaut_tpErrors"
                label="Nombre de groupes par défaut pour les TP"
                required
                clearable
                @input="$v.nb_groupe_defaut_tp.$touch()"
                @blur="$v.nb_groupe_defaut_tp.$touch()"
            ></v-text-field>
            <v-text-field
                v-model="nb_groupe_defaut_partiel"
                :error-messages="nb_groupe_defaut_partielErrors"
                label="Nombre de groupes par défaut pour les partiels"
                required
                clearable
                @input="$v.nb_groupe_defaut_partiel.$touch()"
                @blur="$v.nb_groupe_defaut_partiel.$touch()"
            ></v-text-field>

            <v-card-actions>
              <v-btn
                  color="red darken-1"
                  class="mr-4"
                  text
                  @click="clear"
              >
                Vider
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  color="green darken-1"
                  class="mr-4"
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
          <v-card-title class="text-h5 red darken-2 white--text">
            Confirmation de modification
          </v-card-title>
          <v-card-text class="text-justify pt-4">
            Êtes-vous sûr de vouloir changer le numéro de semaine pour le semestre ?<br><br>
            Cela augmentera / diminuera le nombre de semaine pour tous les modules où la saisie est hebdomadaire.
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="red darken-1"
                text
                @click="cancel"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="green darken-1"
                class="mr-4"
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
import {validationMixin} from "vuelidate";
import {numeric, required} from "vuelidate/lib/validators";
import {mapState} from "vuex";

export default {
  name: "EditPeriode",
  mixins: [validationMixin],
  props: ['element'],
  validations: {
    nb_semaine: {required, numeric},
    nb_groupe_defaut_cm: {required, numeric},
    nb_groupe_defaut_td: {required, numeric},
    nb_groupe_defaut_tp: {required, numeric},
    nb_groupe_defaut_partiel: {required, numeric},
    element_id: {required},
  },
  data: () => ({
    form: false,
    confirmEditPeriode: false,
    id: '',
    nb_semaine: '',
    old_nb_semaine: '',
    nb_groupe_defaut_cm: 1,
    nb_groupe_defaut_td: 1,
    nb_groupe_defaut_tp: 1,
    nb_groupe_defaut_partiel: 1,
    element_id: '',
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'periodes')
  },
  computed: {
    ...mapState(['periodes']),
    nb_semaineErrors() {
      const errors = []
      if (!this.$v.nb_semaine.$dirty) return errors
      !this.$v.nb_semaine.numeric && errors.push('Le Nombre de semaines doit être un numérique')
      !this.$v.nb_semaine.required && errors.push('Le Nombre de semaines est obligatoire')
      return errors
    },
    nb_groupe_defaut_cmErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_cm.$dirty) return errors
      !this.$v.nb_groupe_defaut_cm.numeric && errors.push('Le Nombre de groupes pour les CM doit être un numérique')
      !this.$v.nb_groupe_defaut_cm.required && errors.push('Le Nombre de groupes pour les CM est obligatoire')
      return errors
    },
    nb_groupe_defaut_tdErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_td.$dirty) return errors
      !this.$v.nb_groupe_defaut_td.numeric && errors.push('Le Nombre de groupes pour les TD doit être un numérique')
      !this.$v.nb_groupe_defaut_td.required && errors.push('Le Nombre de groupes pour les TD est obligatoire')
      return errors
    },
    nb_groupe_defaut_tpErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_tp.$dirty) return errors
      !this.$v.nb_groupe_defaut_tp.numeric && errors.push('Le Nombre de groupes pour les TP doit être un numérique')
      !this.$v.nb_groupe_defaut_tp.required && errors.push('Le Nombre de groupes pour les TP est obligatoire')
      return errors
    },
    nb_groupe_defaut_partielErrors() {
      const errors = []
      if (!this.$v.nb_groupe_defaut_partiel.$dirty) return errors
      !this.$v.nb_groupe_defaut_partiel.numeric && errors.push('Le Nombre de groupes pour les partiels doit être un numérique')
      !this.$v.nb_groupe_defaut_partiel.required && errors.push('Le Nombre de groupes pour les partiels est obligatoire')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      const periode = {
        id: this.id,
        nb_semaine: this.nb_semaine,
        old_nb_semaine: this.old_nb_semaine,
        nb_groupe_defaut_cm: this.nb_groupe_defaut_cm,
        nb_groupe_defaut_td: this.nb_groupe_defaut_td,
        nb_groupe_defaut_tp: this.nb_groupe_defaut_tp,
        nb_groupe_defaut_partiel: this.nb_groupe_defaut_partiel,
        element_id: this.element_id,
      }
      this.$store.dispatch('EDIT_Periodes', periode);

      this.form = false;
      this.confirmEditPeriode = false;
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.nb_semaine = ''
      this.old_nb_semaine = ''
      this.nb_groupe_defaut_cm = 1
      this.nb_groupe_defaut_td = 1
      this.nb_groupe_defaut_tp = 1
      this.nb_groupe_defaut_partiel = 1
      this.element_id = null
    },
    close() {
      this.form = !this.form
      this.clear()
    },
    cancel() {
      this.confirmEditPeriode = false
      this.close()
    },
    edit(periode) {
      this.id = periode.id
      this.nb_semaine = periode.nb_semaine
      this.old_nb_semaine = periode.nb_semaine
      this.nb_groupe_defaut_cm = periode.nb_groupe_defaut_cm
      this.nb_groupe_defaut_td = periode.nb_groupe_defaut_td
      this.nb_groupe_defaut_tp = periode.nb_groupe_defaut_tp
      this.nb_groupe_defaut_partiel = periode.nb_groupe_defaut_partiel
      this.element_id = periode.element_id
      this.form = true;
    },
    valideForm() {
      if (this.nb_semaine !== this.old_nb_semaine){
        this.confirmEditPeriode = true
      } else {
        this.submit()
      }
    },
    findPeriodeSemestre(){
      let index = this.periodes.findIndex(p => p.element_id === this.element.id);
      return this.periodes[index];
    },
  }
}
</script>

<style scoped>

</style>