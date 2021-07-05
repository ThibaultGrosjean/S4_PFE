<template>
  <v-container>
    <v-overlay :value="loading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col>
        <h1 class="text-center text-h4 animate-pop-in mb-2">Liste des statuts</h1>
      </v-col>
    </v-row>
    <v-row
        align="center"
        justify="center"
    >
      <v-btn-toggle
          v-if="statuts.length"
          borderless
          rounded
          dense
          mandatory
          class="animate-pop-in"
      >
        <v-btn
            @click="sortedByNom"
        >
          <span class="hidden-sm-and-down">Nom</span>
          <v-icon right>sort_by_alpha</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row>
      <v-col v-if="!statuts.length">
        <p class="text-center animate-pop-in">Aucune donnée trouvée</p>
      </v-col>
    </v-row>
    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success" :rounded="true">
        <span>Le statut a été {{ typeOperation }} avec succès.</span>
        <template v-slot:action="{ attrs }">
          <v-btn
              icon
              v-bind="attrs"
              @click="responseSuccess = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    <v-row>
      <v-col
         v-for="s in statuts"
         :key="s.id"
         sm="4"
         class="justify-center"
      >
        <v-card class="animate-pop-in">
          <v-card-title class="text-h5">{{ s.nom }}</v-card-title>
          <v-card-subtitle class="text-subtitle-1">{{ s.surnom }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">HeTD*</span>
              </template>
              <span>Nombre d’heures équivalent TD</span>
            </v-tooltip> minimales attendues : <b>{{ s.nb_he_td_min_attendu }}</b><br>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">HeTD*</span>
              </template>
              <span>Nombre d’heures équivalent TD</span>
            </v-tooltip> maximales attendues : <b>{{ s.nb_he_td_max_attendu }}</b><br>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">HeTD*</span>
              </template>
              <span>Nombre d’heures équivalent TD</span>
            </v-tooltip> minimales sup. : <b>{{ s.nb_he_td_min_sup }}</b><br>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">HeTD*</span>
              </template>
              <span>Nombre d’heures équivalent TD</span>
            </v-tooltip> maximales sup. : <b>{{ s.nb_he_td_max_sup }}</b><br>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="edit(s)"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Modifier</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="copy(s.id)"
                >
                  <v-icon>file_copy</v-icon>
                </v-btn>
              </template>
              <span>Dupliquer</span>
            </v-tooltip>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog
          v-model="form"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-form lazy-validation>
            <v-card-title>
              <span class="headline" v-if="methods === 'POST'">Ajouter un statut</span>
              <span class="headline" v-else>Modifier un statut</span>
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
              <v-text-field
                  v-model="nom"
                  :error-messages="nomErrors"
                  :counter="255"
                  label="Nom"
                  required
                  clearable
                  @input="$v.nom.$touch()"
                  @blur="$v.nom.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="surnom"
                  :error-messages="surnomErrors"
                  :counter="255"
                  label="Surnom"
                  required
                  clearable
                  @input="$v.surnom.$touch()"
                  @blur="$v.surnom.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_min_attendu"
                  :error-messages="heTDMinAttenduErrors"
                  label="Nombre d'heures (équivalent TD) minimales attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_min_attendu.$touch()"
                  @blur="$v.nb_he_td_min_attendu.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_max_attendu"
                  :error-messages="heTDMaxAttenduErrors"
                  label="Nombre d'heures (équivalent TD) maximales attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_max_attendu.$touch()"
                  @blur="$v.nb_he_td_max_attendu.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_min_sup"
                  :error-messages="heTDMinSupErrors"
                  label="Nombre d'heures (équivalent TD) minimales supplémentaires attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_min_sup.$touch()"
                  @blur="$v.nb_he_td_min_sup.$touch()"
              ></v-text-field>
              <v-text-field
                  v-model="nb_he_td_max_sup"
                  :error-messages="heTDMaxSupErrors"
                  label="Nombre d'heures (équivalent TD) maximales supplémentaires attendues"
                  required
                  clearable
                  @input="$v.nb_he_td_max_sup.$touch()"
                  @blur="$v.nb_he_td_max_sup.$touch()"
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
    </v-row>
    <v-row>
      <v-col>
        <v-btn
            class="v-btn--addElement"
            color="success"
            fab
            dark
            @click="close"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiStatut from "../services/API/statuts";
import {validationMixin} from "vuelidate";
import {decimal, maxLength, required} from "vuelidate/lib/validators";

export default {
  name: "Statuts",
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(255)},
    nb_he_td_min_attendu: {required, decimal},
    nb_he_td_max_attendu: {required, decimal},
    nb_he_td_min_sup: {required, decimal},
    nb_he_td_max_sup: {required, decimal},
  },
  data: () => ({
    statuts: [],
    form: false,
    loading: false,
    responseSuccess: false,
    sortByNom: false,
    methods: "POST",
    typeOperation: 'ajouté',
    id: '',
    nom: '',
    surnom: '',
    nb_he_td_min_attendu: '',
    nb_he_td_max_attendu: '',
    nb_he_td_min_sup: '',
    nb_he_td_max_sup: '',
  }),
  methods: {
    async getStatuts() {
      this.statuts = await apiStatut.getStatuts();
    },
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      const statut = {
        id: this.id,
        nom: this.nom,
        surnom: this.surnom,
        nb_he_td_min_attendu: this.nb_he_td_min_attendu,
        nb_he_td_max_attendu: this.nb_he_td_max_attendu,
        nb_he_td_min_sup: this.nb_he_td_min_sup,
        nb_he_td_max_sup: this.nb_he_td_max_sup,
      };
      this.loading = true;
      if (this.methods === 'POST') {
        await apiStatut.createStatut(statut);
        this.typeOperation = 'ajouté';
      } else {
        await apiStatut.editStatut(statut);
        this.typeOperation = 'modifié';
      }
      await this.getStatuts();
      this.clear();
      this.loading = false;
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset();
      this.id = '';
      this.nom = '';
      this.surnom = '';
      this.nb_he_td_min_attendu = '';
      this.nb_he_td_max_attendu = '';
      this.nb_he_td_min_sup = '';
      this.nb_he_td_max_sup = '';
    },
    close() {
      this.form = !this.form;
      this.methods = 'POST';
      this.clear()
    },
    edit(statut) {
      this.methods = 'PUT';

      this.id = statut.id;
      this.nom = statut.nom;
      this.surnom = statut.surnom;
      this.nb_he_td_min_attendu = statut.nb_he_td_min_attendu;
      this.nb_he_td_max_attendu = statut.nb_he_td_max_attendu;
      this.nb_he_td_min_sup = statut.nb_he_td_min_sup;
      this.nb_he_td_max_sup = statut.nb_he_td_max_sup;
      this.form = true;
    },
    async copy(statutId) {
      this.loading = true;
      await apiStatut.copyStatut(statutId);
      await this.getStatuts();
      this.loading = false;
      this.typeOperation = 'copié';
      this.responseSuccess = true;
    },
    sortedByNom() {
      if (this.sortNom) {
        this.sortNom = false;
        this.statuts.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase());
      } else {
        this.sortNom = true;
        this.statuts.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase());
      }
    },
  },
  computed: {
    nomErrors() {
      const errors = [];
      if (!this.$v.nom.$dirty) return errors;
      !this.$v.nom.maxLength && errors.push('Le nom ne doit pas faire plus de 255 caractères');
      !this.$v.nom.required && errors.push('Le nom est obligatoire.');
      return errors;
    },
    surnomErrors() {
      const errors = [];
      if (!this.$v.surnom.$dirty) return errors;
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 255 caractères');
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire');
      return errors;
    },
    heTDMinAttenduErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_min_attendu.$dirty) return errors;
      !this.$v.nb_he_td_min_attendu.decimal && errors.push('Le Nombre d\'heures (équivalent TD) minimales attendues doit être un numérique');
      !this.$v.nb_he_td_min_attendu.required && errors.push('Le Nombre d\'heures (équivalent TD) minimales attendues est obligatoire');
      return errors;
    },
    heTDMaxAttenduErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_max_attendu.$dirty) return errors;
      !this.$v.nb_he_td_max_attendu.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximales attendues doit être un numérique');
      !this.$v.nb_he_td_max_attendu.required && errors.push('Le Nombre d\'heures (équivalent TD) maximales attendues est obligatoire');
      return errors;
    },
    heTDMinSupErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_min_sup.$dirty) return errors;
      !this.$v.nb_he_td_min_sup.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires doit être un numérique');
      !this.$v.nb_he_td_min_sup.required && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires est obligatoire');
      return errors;
    },
    heTDMaxSupErrors() {
      const errors = [];
      if (!this.$v.nb_he_td_max_attendu.$dirty) return errors;
      !this.$v.nb_he_td_max_sup.decimal && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires doit être un numérique');
      !this.$v.nb_he_td_max_sup.required && errors.push('Le Nombre d\'heures (équivalent TD) maximales supplémentaires est obligatoire');
      return errors;
    },
  },
  mounted() {
    this.getStatuts();
  }
}
</script>

<style scoped>
</style>