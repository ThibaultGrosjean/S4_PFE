<template>
  <v-form lazy-validation>
    <v-text-field
        v-model="nom"
        :error-messages="nomErrors"
        :counter="255"
        label="Nom"
        required
        @input="$v.nom.$touch()"
        @blur="$v.nom.$touch()"
    ></v-text-field>
    <v-text-field
        v-model="prenom"
        :error-messages="prenomErrors"
        :counter="255"
        label="Prénom"
        required
        @input="$v.prenom.$touch()"
        @blur="$v.prenom.$touch()"
    ></v-text-field>
    <v-text-field
        v-model="surnom"
        :error-messages="surnomErrors"
        :counter="3"
        label="Surnom"
        required
        @input="$v.surnom.$touch()"
        @blur="$v.surnom.$touch()"
    ></v-text-field>
    <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        :counter="255"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
    ></v-text-field>
    <v-select
        v-model="select"
        :items="statuts"
        item-text="nom"
        item-value="id"
        label="Statut"
        :error-messages="selectErrors"
        @change="$v.select.$touch()"
        @blur="$v.select.$touch()"
        required
    ></v-select>
    <br>
    <v-btn
        class="mr-4"
        @click="submit"
    >
      Valider
    </v-btn>
    <v-btn @click="clear">
      Vider
    </v-btn>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import {mapState} from "vuex";

//TODO Génération automatique du Surnom cf cahier des charges
//TODO développer le formulaire lors du clique du bouton +

export default {
  name: "EnseignantForm",
  mixins: [validationMixin],

  validations: {
    nom: { required, maxLength: maxLength(255) },
    prenom: { required, maxLength: maxLength(255) },
    surnom: { required, maxLength: maxLength(3) },
    email: { required, email },
    select: { required },
  },

  data: () => ({
    nom: '',
    prenom: '',
    surnom: '',
    email: '',
    select: null,
  }),

  computed: {
    ...mapState(['statuts']),
    selectErrors () {
      const errors = []
      if (!this.$v.select.$dirty) return errors
      !this.$v.select.required && errors.push('Veuillez sélectionner un statut')
      return errors
    },
    nomErrors () {
      const errors = []
      if (!this.$v.nom.$dirty) return errors
      !this.$v.nom.maxLength && errors.push('nom must be at most 10 characters long')
      !this.$v.nom.required && errors.push('Le nom est obligatoire.')
      return errors
    },
    prenomErrors () {
      const errors = []
      if (!this.$v.prenom.$dirty) return errors
      !this.$v.prenom.maxLength && errors.push('prenom must be at most 10 characters long')
      !this.$v.prenom.required && errors.push('Le prenom est obligatoire.')
      return errors
    },
    surnomErrors () {
      const errors = []
      if (!this.$v.surnom.$dirty) return errors
      !this.$v.surnom.maxLength && errors.push('surnom must be at most 10 characters long')
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Veuillez saisir un mail valide')
      !this.$v.email.required && errors.push('L\'e-mail est obligatoire')
      return errors
    },
  },

  methods: {
    submit () {
      this.$v.$touch()
    },
    clear () {
      this.$v.$reset()
      this.nom = ''
      this.prenom = ''
      this.surnom = ''
      this.email = ''
      this.select = null
    },
  },
  mounted() {
    this.$store.dispatch('loadStatuts');
  }
}
</script>

<style scoped>

</style>