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
        <h1 class="text-center text-h4 animate-pop-in mb-2">Liste des projets</h1>
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
          class="animate-pop-in"
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
        <p class="text-center animate-pop-in">Aucun projet trouvé</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" class="animate-pop-in">
        <v-alert v-model="responseSuccess" dismissible border="left" text type="success" class="mb-0">
          Le projet a été {{ typeOperation }} avec succès.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-switch
          v-model="switchArchive"
          :label="switchArchive ? 'Masquer les projets archivés' : 'Afficher les projets archivés'"
          color="success"
          class="ml-4 mt-0 animate-pop-in"
      ></v-switch>
    </v-row>
    <v-row>
      <template v-for="p in projets">
        <v-col
            v-if="switchArchive === Boolean(p.archive)"
            :key="p.id"
            sm="4"
            class="justify-center"
        >
          <v-card class="animate-pop-in">
            <v-card-title class="text-h5">
              <span>{{ p.nom }}</span>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      :color="p.verrou ? 'success' : 'gray'"
                      class="mr-2"
                      @click="saveVerrou(p)"
                  >
                    <v-icon>{{ p.verrou ? "lock" : "lock_open" }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ p.verrou ? "Déverrouiller" : "Verrouiller " }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      :color="p.archive ? 'success' : 'gray'"
                      @click="saveArchive(p)"
                  >
                    <v-icon>{{ p.archive ? "archive" : "unarchive" }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ p.archive ? "Désarchiver" : "Archiver " }}</span>
              </v-tooltip>
            </v-card-title>
            <v-card-subtitle>{{ toTime(p.date) }}</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-btn block outlined rounded color="primary" @click="redirect('/intervenants/projets/'+ p.id)" class="mb-4">
                    <v-icon class="mr-2">groups</v-icon>Intervenants
                  </v-btn>
                </v-row>
                <v-row>
                  <v-btn block outlined rounded color="primary" @click="redirect('/formations/projets/'+ p.id)" class="mb-4">
                    <v-icon class="mr-2">auto_stories</v-icon>Formations
                  </v-btn>
                </v-row>
                <v-row>
                  <v-btn block outlined rounded color="primary" class="mb-4">
                    <v-icon class="mr-2">account_balance_wallet</v-icon>Bilan
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      :disabled="Boolean(p.verrou)"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="edit(p)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Modifier</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      :disabled="Boolean(p.verrou)"
                      icon
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip top v-if="!Boolean(p.archive)">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      :disabled="Boolean(p.verrou)"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="saveArchive(p)"
                  >
                    <v-icon color="error darken-1">delete</v-icon>
                  </v-btn>
                </template>
                <span>Supprimer</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
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
                      color="error darken-1"
                      @click="menu = false"
                  >
                    Annuler
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      :loading="loading"
                      text
                      color="success darken-1"
                      @click="$refs.menu.save(date)"
                  >
                    Valider
                  </v-btn>
                </v-date-picker>
              </v-menu>
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
import apiProjet from "../services/API/projets";
import {validationMixin} from "vuelidate";
import {maxLength, required} from "vuelidate/lib/validators";

export default {
  name: "ReadProjets",
  mixins: [validationMixin],

  validations: {
    nom: {required, maxLength: maxLength(255)},
  },
  data: () => ({
    projets: [],
    form: false,
    menu: false,
    loading: false,
    responseSuccess: false,
    switchArchive: false,
    sortDate: false,
    methods: "POST",
    typeOperation: 'ajouté',
    id: '',
    nom: '',
    date: '',
    verrou: false,
    archive: false,
  }),
  methods: {
    async getProjets() {
      this.projets = await apiProjet.getProjets();
    },
    async saveVerrou(projet) {
      this.loading = true;
      projet.date = this.toTime(projet.date);
      projet.verrou = Number(!projet.verrou);
      await apiProjet.editProjet(projet);
      await apiProjet.verrouFormationProjet(projet.id, projet.verrou);
      if (projet.verrou) this.typeOperation = 'verrouillé';
      else this.typeOperation = 'déverrouillé';
      this.loading = false;
      this.responseSuccess = true;
    },
    async saveArchive(projet) {
      this.loading = true;
      projet.date = this.toTime(projet.date);
      projet.archive = Number(!projet.archive);
      await apiProjet.editProjet(projet);
      if (projet.archive) this.typeOperation = 'archivé';
      else this.typeOperation = 'désarchivé';
      this.loading = false;
      this.responseSuccess = true;
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.loading = true;
      if (this.methods === 'POST') {
        await apiProjet.createProjet(this.nom);
        this.typeOperation = 'ajouté';
      } else {
        await apiProjet.editProjet({
          id: this.id,
          nom: this.nom,
          date: this.date,
          verrou: Number(this.verrou),
          archive: Number(this.archive),
        });
        this.typeOperation = 'modifié';

      }
      await this.getProjets();
      this.clear();
      this.loading = false
      this.form = false;
      this.responseSuccess = true;
    },
    clear() {
      this.$v.$reset();
      this.id = '';
      this.nom = '';
      this.verrou = false;
      this.archive = false;
    },
    close() {
      this.form = !this.form;
      this.clear();
      this.methods = 'POST';
    },
    edit(projet) {
      this.methods = 'PUT';

      this.id = projet.id;
      this.nom = projet.nom;
      this.date = this.toTime(projet.date);
      this.verrou = Boolean(projet.verrou);
      this.archive = Boolean(projet.archive);
      this.form = true;
    },
    async save(projet) {
      this.loading = true;
      projet.date = this.toTime(projet.date);
      await apiProjet.editProjet(projet);
      this.loading = false;
    },
    toTime(date) {
      return new Date(date).toISOString().substr(0, 10);
    },
    redirect(path){
      this.$router.push({path:path}).catch(()=>{});
    },
    sortedByDate() {
      if (this.sortDate) {
        this.sortDate = false;
        this.projets.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        this.sortDate = true;
        this.projets.sort((a, b) => new Date(a.date) - new Date(b.date));
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
  },
  mounted() {
    this.getProjets();
  }
}
</script>

<style scoped>
</style>