<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des enseignants</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-breadcrumbs :items="items" large class="pl-0"></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            icon
            @click="display = !display"
          >
            <v-icon>
              {{ display ? 'grid_view' : 'table_rows' }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="display">
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <br>
          <v-data-table
            :headers="headers"
            :items="enseignants"
            :items-per-page="10"
            :search="search"
            class="elevation-1"
          >

            <template v-slot:item.actions="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      @click="editItem(item)"
                    >
                      edit
                    </v-icon>
                  </v-btn>
                </template>
                <span>Modifier</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      @click="copyItem(item)"
                    >
                      file_copy
                    </v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer</span>
              </v-tooltip>
              <ConfirmPopUp :item="item.id"></ConfirmPopUp>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row v-if="!display">
        <v-col v-for="e in enseignants"
               :key="e.id"
               sm="4"
        >
          <v-card>
            <v-card-title>{{ e.prenom }} {{ e.nom }}</v-card-title>
            <v-card-subtitle><b class="text-uppercase">{{ e.surnom }}</b></v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <p>Prénom : <b>{{ e.prenom }}</b></p>
              <p>Nom : <b>{{ e.nom }}</b></p>
              <p>Adresse mail : <b>{{ e.email }}</b></p>
              <p class="mb-0">Statut : <b>{{ e.statut.nom }} ({{ e.statut.surnom }})</b></p>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    @click="show = !show"
                  >
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>Détails des statuts</span>
              </v-tooltip>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>
                  <v-card-text>
                    <p>Nombre HeTD* minimal attendu :<b>{{ e.statut.nb_he_td_min_attendu }}</b></p>
                    <p>Nombre HeTD* maximal attendu : <b>{{ e.statut.nb_he_td_max_attendu }}</b></p>
                    <p>Nombre HeTD* minimal pour les heure supplémentaires : <b>{{ e.statut.nb_he_td_min_sup }}</b></p>
                    <p>Nombre HeTD* maximal pour les heure supplémentaires : <b>{{ e.statut.nb_he_td_max_sup }}</b></p>
                    <small>* HeTD : Nombre d’heures équivalent TD</small>
                  </v-card-text>
                </div>
              </v-expand-transition>

            </v-card-text>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      edit
                    </v-icon>
                  </v-btn>
                </template>
                <span>Modifier</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      file_copy
                    </v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <ConfirmPopUp :item="e.id"></ConfirmPopUp>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn class="v-btn--addElement"
                 color="green"
                 fab
                 dark
                 @click="form = !form"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

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
                <span class="headline">Ajouter un enseignant</span>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="form = !form"
                >
                  <v-icon>
                    close
                  </v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>

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
                  v-model="statut_id"
                  :items="statuts"
                  item-text="nom"
                  item-value="id"
                  label="Statut"
                  :error-messages="statutErrors"
                  @change="$v.statut_id.$touch()"
                  @blur="$v.statut_id.$touch()"
                  required
                ></v-select>
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
    </v-container>
  </div>
</template>

<script>
import ConfirmPopUp from "@/components/DeleteConfirmation";
import {mapState} from 'vuex';
import {validationMixin} from "vuelidate";
import {email, maxLength, required} from "vuelidate/lib/validators";

export default {
  name: "ReadStatuts",
  components: {ConfirmPopUp},
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
    prenom: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(3)},
    email: {required, email},
    statut_id: {required},
  },
  data: () => ({
    headers: [
      {text: 'Nom', value: 'nom',align: 'center',},
      {text: 'Prénom', value: 'prenom',align: 'center',},
      {text: 'Surnom', value: 'surnom',align: 'center',},
      {text: 'Email', value: 'email',align: 'center',},
      {text: 'Statut', value: 'statut.nom',align: 'center',},
      {text: 'HeTD min attendu', value: 'statut.nb_he_td_min_attendu',align: 'center',},
      {text: 'HeTD max attendu', value: 'statut.nb_he_td_max_attendu',align: 'center',},
      {text: 'HeTD min sup.', value: 'statut.nb_he_td_min_sup',align: 'center',},
      {text: 'HeTD max sup.', value: 'statut.nb_he_td_max_sup',align: 'center',},
      {text: 'Actions', value: 'actions', sortable: false, width: "13%",align: 'center',},
    ],
    show: false,
    display: true,
    form: false,
    search: '',
    items: [
      {text: 'Enseignants', disabled: true,},
      {text: 'Liste', disabled: true,},
    ],
    nom: '',
    prenom: '',
    surnom: '',
    email: '',
    statut_id: null,
  }),
  computed: {
    ...mapState(['statuts', 'enseignants']),
    statutErrors() {
      const errors = []
      if (!this.$v.statut_id.$dirty) return errors
      !this.$v.statut_id.required && errors.push('Veuillez sélectionner un statut')
      return errors
    },
    nomErrors() {
      const errors = []
      if (!this.$v.nom.$dirty) return errors
      !this.$v.nom.maxLength && errors.push('nom must be at most 10 characters long')
      !this.$v.nom.required && errors.push('Le nom est obligatoire.')
      return errors
    },
    prenomErrors() {
      const errors = []
      if (!this.$v.prenom.$dirty) return errors
      !this.$v.prenom.maxLength && errors.push('prenom must be at most 10 characters long')
      !this.$v.prenom.required && errors.push('Le prenom est obligatoire.')
      return errors
    },
    surnomErrors() {
      const errors = []
      if (!this.$v.surnom.$dirty) return errors
      !this.$v.surnom.maxLength && errors.push('surnom must be at most 10 characters long')
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Veuillez saisir un mail valide')
      !this.$v.email.required && errors.push('L\'e-mail est obligatoire')
      return errors
    },
  },

  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      this.$store.commit('ADD_Enseignant', {
        nom: this.nom,
        prenom: this.prenom,
        surnom: this.surnom,
        email: this.email,
        statut_id: this.statut_id,
        statut: this.returnStatut(this.statut_id)
      });
    },
    clear() {
      this.$v.$reset()
      this.nom = ''
      this.prenom = ''
      this.surnom = ''
      this.email = ''
      this.statut_id = null
    },
    returnStatut(id) {
      let index = this.statuts.findIndex(statut => statut.id === id)
      return this.statuts[index]
    }
  },
  mounted() {
    this.$store.dispatch('loadEnseignants')
    this.$store.dispatch('loadStatuts')
  },
}
</script>

<style scoped>
.v-btn--addElement {
  bottom: 0;
  right: 0;
  position: fixed;
  margin: 16px;
}
</style>