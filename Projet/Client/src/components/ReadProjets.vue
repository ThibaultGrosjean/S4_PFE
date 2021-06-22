<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center text-h4">Liste des projets</h1>
        </v-col>
      </v-row>
      <v-row
          align="center"
          justify="center"
      >
        <v-btn-toggle
            v-if="projets.length"
            borderless
            rounded
            dense
            mandatory
            color="blue--text text--accent-4"
        >
          <v-btn
              @click="sortedByDate"
          >
            <span class="hidden-sm-and-down">Date</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col v-if="!projets.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col
            v-for="p in projets"
            :key="p.id"
            sm="6"
        >
          <v-card>
            <v-card-title class="text-h5">
              <span>{{ p.nom }}</span>
              <v-spacer></v-spacer>
              <v-edit-dialog
                  :return-value.sync="p.verrou"
                  large
                  @save="save(p)"
                  cancel-text="Annuler"
                  save-text="Valider"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        :color="p.verrou ? 'success' : 'gray'"
                    >
                      <v-icon>{{ p.verrou ? "lock" : "lock_open" }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ p.verrou ? "Déverrouiller" : "Verrouiller " }}</span>
                </v-tooltip>
                <template v-slot:input>
                  <v-switch
                      v-model="p.verrou"
                      :true-value="1"
                      :false-value="0"
                      color="success"
                      :label="p.verrou ? 'Verrouiller' : 'Déverrouiller'"
                  >
                  </v-switch>
                </template>
              </v-edit-dialog>
              <v-edit-dialog
                  :return-value.sync="p.archive"
                  large
                  @save="save(p)"
                  cancel-text="Annuler"
                  save-text="Valider"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        :color="p.verrou ? 'success' : 'gray'"
                    >
                      <v-icon>{{ p.archive ? "archive" : "unarchive" }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ p.archive ? "Désarchiver" : "Archiver " }}</span>
                </v-tooltip>
                <template v-slot:input>
                  <v-switch
                      v-model="p.archive"
                      :true-value="1"
                      :false-value="0"
                      color="success"
                      label="Archive"
                  >
                  </v-switch>
                </template>
              </v-edit-dialog>
            </v-card-title>
            <v-card-text>
              <p class="mb-0">Date : <b>{{ toTime(p.date) }}</b></p>
              <p class="mb-0">Verrou :
                <b><span class="red--text text--darken-1" v-if="p.verrou === 0">Désactivé</span>
                  <span class="green--text text--darken-1" v-else>Activé</span></b>
              </p>
              <p class="mb-0">Archive :
                <b><span class="red--text text--darken-1" v-if="p.archive === 0">Désactivé</span>
                  <span class="green--text text--darken-1" v-else>Activé</span></b>
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(p)"
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
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        color="red darken-1"
                        v-bind="attrs"
                        v-on="on"
                    >
                      delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Supprimer</span>
              </v-tooltip>
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
                <span class="headline" v-if="methods === 'POST'">Ajouter un projet</span>
                <span class="headline" v-else>Modifier un projet</span>
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
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="slide-y-transition"
                    offset-y
                    bottom
                    :nudge-left="16"
                    min-width="auto"
                    v-if="this.methods !== 'POST'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      width="600px"
                      v-model="date"
                      no-title
                      scrollable
                  >
                    <v-btn
                        text
                        color="red darken-1"
                        @click="menu = false"
                    >
                      Annuler
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="green darken-1"
                        @click="$refs.menu.save(date)"
                    >
                      Valider
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <v-switch
                    v-if="this.methods !== 'POST'"
                    v-model="verrou"
                    inset
                    :label="'Verrouiller'"
                ></v-switch>
                <v-switch
                    v-if="this.methods !== 'POST'"
                    v-model="archive"
                    inset
                    :label="'Archiver'"
                ></v-switch>
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
      <v-row>
        <v-col>
          <v-btn
              class="v-btn--addElement"
              color="green"
              fab
              dark
              @click="close"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {validationMixin} from "vuelidate";
import {maxLength, required} from "vuelidate/lib/validators";

export default {
  name: "ReadProjets",
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
  },
  data: () => ({
    form: false,
    sortDate: false,
    menu: false,
    methods: "POST",
    id: '',
    nom: '',
    date: '',
    verrou: false,
    archive: false,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'projets');
  },
  computed: {
    ...mapState(['projets']),
    nomErrors() {
      const errors = []
      if (!this.$v.nom.$dirty) return errors
      !this.$v.nom.maxLength && errors.push('Le nom ne doit pas faire plus de 255 caractères')
      !this.$v.nom.required && errors.push('Le nom est obligatoire.')
      return errors
    },
  },
  methods: {
    toTime(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      this.form = false;
      if (this.methods === 'POST') {
        this.$store.commit('ADD_Projet', this.nom);
      } else {
        this.$store.commit('EDIT_Projet', {
          id: this.id,
          nom: this.nom,
          date: this.date,
          verrou: Number(this.verrou),
          archive: Number(this.archive),
        });
      }
      this.clear()
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.nom = ''
      this.verrou = false
      this.archive = false
    },
    close() {
      this.form = !this.form
      this.clear()
      this.methods = 'POST'
    },
    edit(projet) {
      this.methods = 'PUT'

      this.id = projet.id
      this.nom = projet.nom
      this.date = this.toTime(projet.date)
      this.verrou = projet.verrou
      this.archive = projet.archive
      this.form = true;
    },
    save(projet){
      projet.date = this.toTime(projet.date)
      this.$store.commit('EDIT_Projet', projet);
    },
    sortedByDate() {
      if (this.sortDate) {
        this.sortDate = false
        this.projets.sort((a, b) => new Date(b.date) - new Date(a.date))
      } else {
        this.sortDate = true
        this.projets.sort((a, b) => new Date(a.date) - new Date(b.date))
      }
    },
  },
}
</script>

<style scoped>
</style>