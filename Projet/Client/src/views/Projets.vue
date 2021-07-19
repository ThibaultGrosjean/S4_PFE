<template>
  <v-container fluid class="pa-10">
    <ProgressOverlay :loading="loading"/>

    <v-row class="animate-pop-in mb-2 pa-3">
      <v-card width="100%" class="pa-7">
        <v-row>
          <v-col class="align-center pa-0">
            <v-btn outlined small color="primary"  @click="sortedByNom" class="mr-2">
              <v-icon small class="mr-2">{{ sortNom ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Nom
            </v-btn>
            <v-btn outlined small color="primary"  @click="sortedByDate" class="mr-2">
              <v-icon small class="mr-2">{{ sortDate ? "arrow_upward" : "arrow_downward" }}</v-icon>
              Date
            </v-btn>
            <v-btn small outlined @click="switchArchive = !switchArchive" :color="switchArchive ? 'success' : 'primary'">
              <v-icon class="mr-2">
                {{ switchArchive ? 'visibility' : 'visibility_off' }}
              </v-icon>
              Archive
            </v-btn>
            <v-btn icon color="success" @click="form = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-row v-if="!projets.length">
      <v-col>
        <p class="text-center animate-pop-in">Aucun projet trouvé</p>
      </v-col>
    </v-row>

    <v-row>
      <template v-for="p in projets">
        <v-col
            v-if="switchArchive === Boolean(p.archive)"
            :key="p.id"
            sm="6"
            md="4"
            class="justify-center"
        >
          <v-card class="animate-pop-in">
            <v-card-title class="text-h5">
              <v-container>
                <v-row>
                  <v-col class="pa-0"><span>{{ p.nom }}</span></v-col>
                  <v-col class="pa-0 d-flex justify-end">
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
                    <span>{{ p.verrou ? "Déverrouiller" : "Verrouiller " }}  {{ p.nom }}</span>
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
                      <span>{{ p.archive ? "Désarchiver" : "Archiver " }}  {{ p.nom }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1 pb-2">{{ p.date.substr(0, 10) }}</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-btn block outlined color="primary" @click="redirect('/formations/projets/'+ p.id)" class="mb-4">
                    <v-icon class="mr-2">auto_stories</v-icon>Formations
                  </v-btn>
                </v-row>
                <v-row>
                  <v-btn block outlined color="primary" @click="redirect('/intervenants/projets/'+ p.id)" class="mb-4">
                    <v-icon class="mr-2">groups</v-icon>Intervenants
                  </v-btn>
                </v-row>
                <v-row>
                  <v-btn block outlined color="primary" @click="redirect('/bilan/projets/'+ p.id)" class="mb-4">
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
                <span>Modifier {{ p.nom }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      :disabled="Boolean(p.verrou)"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="openCopyDialog(p.id)"
                  >
                    <v-icon>file_copy</v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer {{ p.nom }}</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip top v-if="!Boolean(p.archive)">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      :disabled="Boolean(p.verrou)"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      color="error darken-1"
                      @click="saveArchive(p)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </template>
                <span>Supprimer {{ p.nom }}</span>
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
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                  v-model="projet.nom"
                  :counter="255"
                  :error-messages="errors.nom"
                  label="Nom"
                  autofocus
                  clearable
              ></v-text-field>
              <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="projet.date"
                  transition="slide-y-transition"
                  offset-y
                  bottom
                  :nudge-left="16"
                  min-width="auto"
                  v-if="this.methods !== 'POST'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="projet.date"
                      label="Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    width="600px"
                    v-model="projet.date"
                    no-title
                    scrollable
                >
                  <v-btn
                      :disabled="loading"
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
                      @click="$refs.menu.save(projet.date)"
                  >
                    Valider
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-card-actions>
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

    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5">
            <span class="headline">Confirmation de copie</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-justify pt-4 pb-0">
            Le projet ainsi que ses formations et intervenants vont être dupliqués voulez-vous également dupliquer les
            nombres de groupes associés aux intervenants ?<br>
            <v-checkbox
                v-model="checkboxCopierGrpInterv"
                label="Copier les groupes des intervenants"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions class="pb-5">
            <v-btn
                :disabled="loading"
                color="error darken-1"
                text
                @click="dialog = false"
            >
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :loading="loading"
                color="success darken-1"
                text
                @click="copy"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar v-model="responseSuccess" :timeout="3000" color="success">
        <span>Le projet a été {{ typeOperation }} avec succès.</span>
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
  </v-container>
</template>

<script>
import apiProjet from "../services/API/projets";
import ProgressOverlay from "../components/ProgressOverlay";

export default {
  name: "ReadProjets",
  components: {ProgressOverlay},

  data: () => ({
    projets: [],
    errors: [],
    form: false,
    dialog: false,
    menu: false,
    checkboxCopierGrpInterv: false,
    loading: false,
    responseSuccess: false,
    switchArchive: false,
    sortNom: false,
    sortDate: false,
    methods: "POST",
    typeOperation: 'ajouté',
    projet: {
      id: '',
      nom: null,
      date: '',
      verrou: false,
      archive: false,
    }
  }),
  methods: {
    async getProjets() {
      this.projets = await apiProjet.getProjets();
    },
    async saveVerrou(projet) {
      this.loading = true;
      projet.date = projet.date.substr(0, 10);
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
      projet.date = projet.date.substr(0, 10);
      projet.archive = Number(!projet.archive);
      await apiProjet.editProjet(projet);
      if (projet.archive) this.typeOperation = 'archivé';
      else this.typeOperation = 'désarchivé';
      this.loading = false;
      this.responseSuccess = true;
    },
    async submit() {
      this.loading = true;
      if (this.methods === 'POST') {
        const res = await apiProjet.createProjet(this.projet.nom);
        if (res.errors){
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'ajouté';
          await this.clear();
          await this.getProjets();
          this.loading = false
          this.form = false;
          this.responseSuccess = true;
        }
      } else {
        const res = await apiProjet.editProjet(this.projet);
        if (res.errors){
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.typeOperation = 'modifié';
          this.projet.id = '';
          await this.clear();
          await this.getProjets();
          this.loading = false
          this.form = false;
          this.responseSuccess = true;
        }
      }
    },
    async clear() {
      this.projet = {
        nom: null,
        date: '',
        verrou: false,
        archive: false,
      };
      this.errors = [];
      this.methods = 'POST';
    },
    close() {
      this.form = !this.form;
      this.clear();
    },
    edit(projet) {
      this.methods = 'PUT';
      this.projet = projet;
      this.projet.date = projet.date.substr(0, 10);
      this.form = true;
    },
    async save(projet) {
      this.loading = true;
      projet.date = projet.date.substr(0, 10);
      await apiProjet.editProjet(projet);
      this.loading = false;
    },
    openCopyDialog(projetId) {
      this.dialog = true;
      this.id = projetId;
    },
    async copy() {
      this.loading = true;
      await apiProjet.copyProjet(this.id, this.checkboxCopierGrpInterv);
      await this.getProjets();
      this.loading = false;
      this.dialog = false;
      this.projet.id = '';
      this.checkboxCopierGrpInterv = false;
    },
    redirect(path) {
      this.$router.push({path: path}).catch(() => {
      });
    },
    sortedByDate() {
      this.sortNom = false;
      if (this.sortDate) {
        this.sortDate = false;
        this.projets.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        this.sortDate = true;
        this.projets.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    },
    sortedByNom() {
      this.sortDate = false;
      if (this.sortNom) {
        this.sortNom = false;
        this.projets.sort((a, b) => a.nom.toUpperCase() > b.nom.toUpperCase());
      } else {
        this.sortNom = true;
        this.projets.sort((a, b) => a.nom.toUpperCase() < b.nom.toUpperCase());
      }
    },
  },
  async mounted() {
    this.loading = true;
    await this.getProjets();
    this.loading = false;
  }
}
</script>

<style scoped>
</style>