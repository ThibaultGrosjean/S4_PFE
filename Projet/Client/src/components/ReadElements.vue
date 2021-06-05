<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des hierarchies arborescentes</h1>
        </v-col>
      </v-row>
      <v-row
          align="center"
          justify="center"
      >
        <v-btn-toggle
            v-if="elements.length"
            borderless
            rounded
            dense
            mandatory
            color="blue--text text--accent-4"
        >
          <v-btn
              @click="sortedByTitre"
          >
            <span class="hidden-sm-and-down">Titre</span>
            <v-icon right>sort_by_alpha</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row>
        <v-col v-if="!elements.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12"
               v-for="i in elements"
               :key="i.id"
        >
          <v-card
              v-if="i.niveau === 0"
          >
            <v-card-title>{{ i.titre }}</v-card-title>
            <v-card-subtitle>{{ i.surnom }}</v-card-subtitle>
            <v-card-text></v-card-text>
            <v-card-actions class="pa-0">

              <v-expansion-panels
                  multiple flat
                  accordion
              >
                <v-expansion-panel
                    v-for="j in elements"
                    :key="j.id"
                >
                  <div v-if="i.id === j.parent">
                    <v-expansion-panel-header>{{ j.titre }}</v-expansion-panel-header>
                    <v-expansion-panel-content>

                      <v-expansion-panels
                          multiple flat
                          accordion
                      >
                        <v-expansion-panel
                            v-for="k in elements"
                            :key="k.id"
                        >
                          <div v-if="j.id === k.parent">
                            <v-expansion-panel-header>{{ k.titre }}</v-expansion-panel-header>
                            <v-expansion-panel-content>

                              <v-expansion-panels
                                  multiple flat
                                  accordion
                              >
                                <v-expansion-panel
                                    v-for="l in elements"
                                    :key="l.id"
                                >
                                  <div v-if="k.id === l.parent">
                                    <v-expansion-panel-header>{{ l.titre }}</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                      <p>Mode de saisie :<b>{{ l.mode_saisie }}</b></p>
                                      <div class="ma-0 pa-0" v-if="l.mode_saisie !=='aucun'">
                                        <p>Volume horaire prévu en CM pour les étudiants
                                          :<b>{{ l.vol_hor_total_prevues_etu_cm }}</b></p>
                                        <p>Volume horaire prévu en TD pour les étudiants
                                          :<b>{{ l.vol_hor_total_prevues_etu_td }}</b></p>
                                        <p>Volume horaire prévu en TP pour les étudiants
                                          :<b>{{ l.vol_hor_total_prevues_etu_tp }}</b></p>
                                        <p>CM autorisés :<b>{{ convertBoolean(l.cm_autorises) }}</b></p>
                                        <p>TD autorisés :<b>{{ convertBoolean(l.td_autorises) }}</b></p>
                                        <p>TP autorisés :<b>{{ convertBoolean(l.tp_autorises) }}</b></p>
                                        <p>Partiel autorisés :<b>{{ convertBoolean(l.partiel_autorises) }}</b></p>
                                        <div class="ma-0 pa-0" v-if="l.mode_saisie ==='globale'">
                                          <p>Forfait globale en CM :<b>{{ l.forfait_globale_cm }}</b></p>
                                          <p>Forfait globale en TD :<b>{{ l.forfait_globale_td }}</b></p>
                                          <p>Forfait globale en TP :<b>{{ l.forfait_globale_tp }}</b></p>
                                          <p>Forfait globale en Partiel :<b>{{ l.forfait_globale_partiel }}</b></p>
                                        </div>
                                        <p>Nombre de groupe effectif en CM :<b>{{ l.nb_groupe_effectif_cm }}</b></p>
                                        <p>Nombre de groupe effectif en TD :<b>{{ l.nb_groupe_effectif_td }}</b></p>
                                        <p>Nombre de groupe effectif en TP :<b>{{ l.nb_groupe_effectif_tp }}</b></p>
                                        <p>Nombre de groupe effectif en Partiel :<b>{{ l.nb_groupe_effectif_partiel}}</b></p>
                                      </div>
                                    </v-expansion-panel-content>
                                  </div>

                                </v-expansion-panel>
                              </v-expansion-panels>

                            </v-expansion-panel-content>
                          </div>

                        </v-expansion-panel>
                      </v-expansion-panels>

                    </v-expansion-panel-content>
                  </div>

                </v-expansion-panel>
              </v-expansion-panels>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col
            v-for="e in elements"
            :key="e.id"
            sm="5"
        >
          <v-card>
            <v-card-title>{{ e.titre }}</v-card-title>
            <v-card-subtitle><b class="text-uppercase">{{ e.surnom }}</b></v-card-subtitle>
            <v-card-text>
              <p>Code :<b>{{ e.code }}</b></p>
              <p>Niveau :<b>{{ e.niveau }}</b></p>
              <p>Indice :<b>{{ e.indice }}</b></p>
              <p>Mode de saisie :<b>{{ e.mode_saisie }}</b></p>
              <p>Parent :<b>{{ e.parent }}</b></p>
              <div class="ma-0 pa-0" v-if="e.mode_saisie !=='aucun'">
                <p>Volume horaire prévu en CM pour les étudiants :<b>{{ e.vol_hor_total_prevues_etu_cm }}</b></p>
                <p>Volume horaire prévu en TD pour les étudiants :<b>{{ e.vol_hor_total_prevues_etu_td }}</b></p>
                <p>Volume horaire prévu en TP pour les étudiants :<b>{{ e.vol_hor_total_prevues_etu_tp }}</b></p>
                <p>CM autorisés :<b>{{ convertBoolean(e.cm_autorises) }}</b></p>
                <p>TD autorisés :<b>{{ convertBoolean(e.td_autorises) }}</b></p>
                <p>TP autorisés :<b>{{ convertBoolean(e.tp_autorises) }}</b></p>
                <p>Partiel autorisés :<b>{{ convertBoolean(e.partiel_autorises) }}</b></p>
                <div class="ma-0 pa-0" v-if="e.mode_saisie ==='globale'">
                  <p>Forfait globale en CM :<b>{{ e.forfait_globale_cm }}</b></p>
                  <p>Forfait globale en TD :<b>{{ e.forfait_globale_td }}</b></p>
                  <p>Forfait globale en TP :<b>{{ e.forfait_globale_tp }}</b></p>
                  <p>Forfait globale en Partiel :<b>{{ e.forfait_globale_partiel }}</b></p>
                </div>
                <p>Nombre de groupe effectif en CM :<b>{{ e.nb_groupe_effectif_cm }}</b></p>
                <p>Nombre de groupe effectif en TD :<b>{{ e.nb_groupe_effectif_td }}</b></p>
                <p>Nombre de groupe effectif en TP :<b>{{ e.nb_groupe_effectif_tp }}</b></p>
                <p>Nombre de groupe effectif en Partiel :<b>{{ e.nb_groupe_effectif_partiel }}</b></p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon>
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(e)"
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
                <span class="headline" v-if="methods === 'POST'">Ajouter un élément constitutif</span>
                <span class="headline" v-else>Modifier un élément constitutif</span>
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
                    v-model="titre"
                    :error-messages="titreErrors"
                    :counter="255"
                    label="Titre"
                    required
                    clearable
                    @input="$v.titre.$touch()"
                    @blur="$v.titre.$touch()"
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
                    v-model="code"
                    :error-messages="codeErrors"
                    :counter="255"
                    label="Code"
                    required
                    clearable
                    @input="$v.code.$touch()"
                    @blur="$v.code.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="niveau"
                    :error-messages="niveauErrors"
                    label="Niveau"
                    required
                    clearable
                    @input="$v.niveau.$touch()"
                    @blur="$v.niveau.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="indice"
                    :error-messages="indiceErrors"
                    label="Indice"
                    required
                    clearable
                    @input="$v.indice.$touch()"
                    @blur="$v.indice.$touch()"
                ></v-text-field>
                <v-select
                    v-model="mode_saisie"
                    :items="item_mode_saisie"
                    item-text="nom"
                    item-value="val"
                    label="Mode de saisie"
                    :error-messages="mode_saisieErrors"
                    @change="$v.mode_saisie.$touch()"
                    @blur="$v.mode_saisie.$touch()"
                    required
                    clearable
                ></v-select>
                <v-select
                    v-model="parent"
                    :items="elements"
                    clearable
                    hint="Laisser vide pour un élément racine"
                    persistent-hint
                    item-text="titre"
                    item-value="id"
                    label="Parent"
                ></v-select>

                <br>
                <div class="text-center">Les champs suivants sont optionnels</div>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <br>
                <v-text-field
                    clearable
                    v-model="vol_hor_total_prevues_etu_cm"
                    :error-messages="vol_hor_total_prevues_etu_cmErrors"
                    label="Volume horaire total de CM prévu pour les étudiants"
                    @input="$v.vol_hor_total_prevues_etu_cm.$touch()"
                    @blur="$v.vol_hor_total_prevues_etu_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    clearable
                    v-model="vol_hor_total_prevues_etu_td"
                    :error-messages="vol_hor_total_prevues_etu_tdErrors"
                    label="Volume horaire total de TD prévu pour les étudiants"
                    @input="$v.vol_hor_total_prevues_etu_td.$touch()"
                    @blur="$v.vol_hor_total_prevues_etu_td.$touch()"
                ></v-text-field>
                <v-text-field
                    clearable
                    v-model="vol_hor_total_prevues_etu_tp"
                    :error-messages="vol_hor_total_prevues_etu_tpErrors"
                    label="Volume horaire total de TP prévu pour les étudiants"
                    @input="$v.vol_hor_total_prevues_etu_tp.$touch()"
                    @blur="$v.vol_hor_total_prevues_etu_tp.$touch()"
                ></v-text-field>
                <v-switch
                    v-model="cm_autorises"
                    inset
                    :label="'CM autorisés'"
                ></v-switch>
                <v-switch
                    v-model="td_autorises"
                    inset
                    :label="'TD autorisés'"
                ></v-switch>
                <v-switch
                    v-model="tp_autorises"
                    inset
                    :label="'TP autorisés'"
                ></v-switch>
                <v-switch
                    v-model="partiel_autorises"
                    inset
                    :label="'Partiel autorisés'"
                ></v-switch>
                <div class="ma-0 pa-0" v-if="this.mode_saisie ==='globale'">
                  <v-text-field
                      clearable
                      v-model="forfait_globale_cm"
                      :error-messages="forfait_globale_cmErrors"
                      label="Forfait horaire global pour les CM"
                      @input="$v.forfait_globale_cm.$touch()"
                      @blur="$v.forfait_globale_cm.$touch()"
                  ></v-text-field>
                  <v-text-field
                      clearable
                      v-model="forfait_globale_td"
                      :error-messages="forfait_globale_tdErrors"
                      label="Forfait horaire global pour les TD"
                      @input="$v.forfait_globale_td.$touch()"
                      @blur="$v.forfait_globale_td.$touch()"
                  ></v-text-field>
                  <v-text-field
                      clearable
                      v-model="forfait_globale_tp"
                      :error-messages="forfait_globale_tpErrors"
                      label="Forfait horaire global pour les TP"
                      @input="$v.forfait_globale_tp.$touch()"
                      @blur="$v.forfait_globale_tp.$touch()"
                  ></v-text-field>
                  <v-text-field
                      clearable
                      v-model="forfait_globale_partiel"
                      :error-messages="forfait_globale_partielErrors"
                      label="Forfait horaire global pour les partiels"
                      @input="$v.forfait_globale_partiel.$touch()"
                      @blur="$v.forfait_globale_partiel.$touch()"
                  ></v-text-field>
                </div>
                <v-text-field
                    clearable
                    v-model="nb_groupe_effectif_cm"
                    :error-messages="nb_groupe_effectif_cmErrors"
                    label="Nombre de groupes effectifs pour les CM"
                    @input="$v.nb_groupe_effectif_cm.$touch()"
                    @blur="$v.nb_groupe_effectif_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    clearable
                    v-model="nb_groupe_effectif_td"
                    :error-messages="nb_groupe_effectif_tdErrors"
                    label="Nombre de groupes effectifs pour les TD"
                    @input="$v.nb_groupe_effectif_td.$touch()"
                    @blur="$v.nb_groupe_effectif_td.$touch()"
                ></v-text-field>
                <v-text-field
                    clearable
                    v-model="nb_groupe_effectif_tp"
                    :error-messages="nb_groupe_effectif_tpErrors"
                    label="Nombre de groupes effectifs pour les TP"
                    @input="$v.nb_groupe_effectif_tp.$touch()"
                    @blur="$v.nb_groupe_effectif_tp.$touch()"
                ></v-text-field>
                <v-text-field
                    clearable
                    v-model="nb_groupe_effectif_partiel"
                    :error-messages="nb_groupe_effectif_partielErrors"
                    label="Nombre de groupes effectifs pour les partiels"
                    @input="$v.nb_groupe_effectif_partiel.$touch()"
                    @blur="$v.nb_groupe_effectif_partiel.$touch()"
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
import {mapGetters} from 'vuex'
import {validationMixin} from "vuelidate";
import {decimal, numeric, maxLength, required} from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "ReadElements",
  mixins: [validationMixin],

  validations: {
    titre: {required, maxLength: maxLength(255)},
    surnom: {required, maxLength: maxLength(255)},
    code: {required, maxLength: maxLength(255)},
    niveau: {required, numeric},
    indice: {required, numeric},
    vol_hor_total_prevues_etu_cm: {decimal},
    vol_hor_total_prevues_etu_td: {decimal},
    vol_hor_total_prevues_etu_tp: {decimal},
    mode_saisie: {required},
    forfait_globale_cm: {decimal},
    forfait_globale_td: {decimal},
    forfait_globale_tp: {decimal},
    forfait_globale_partiel: {decimal},
    nb_groupe_effectif_cm: {numeric},
    nb_groupe_effectif_td: {numeric},
    nb_groupe_effectif_tp: {numeric},
    nb_groupe_effectif_partiel: {numeric},
    parent: {numeric},
  },
  data: () => ({
    form: false,
    methods: "POST",
    item_mode_saisie: [
      {nom: 'Aucun', val: 'aucun'},
      {nom: 'Hebdomadaire', val: 'hebdo'},
      {nom: 'Globale', val: 'globale'},
    ],
    showDetails: '',
    sortTitre: false,
    id: '',
    titre: '',
    surnom: '',
    code: '',
    niveau: '',
    indice: '',
    vol_hor_total_prevues_etu_cm: null,
    vol_hor_total_prevues_etu_td: null,
    vol_hor_total_prevues_etu_tp: null,
    mode_saisie: '',
    cm_autorises: false,
    td_autorises: false,
    tp_autorises: false,
    partiel_autorises: false,
    forfait_globale_cm: null,
    forfait_globale_td: null,
    forfait_globale_tp: null,
    forfait_globale_partiel: null,
    nb_groupe_effectif_cm: null,
    nb_groupe_effectif_td: null,
    nb_groupe_effectif_tp: null,
    nb_groupe_effectif_partiel: null,
    parent: null,
  }),
  mounted() {
    this.$store.dispatch('loadElements');
  },
  computed: {
    ...mapState(['elements']),
    mode_saisieErrors() {
      const errors = []
      if (!this.$v.mode_saisie.$dirty) return errors
      !this.$v.mode_saisie.required && errors.push('Veuillez sélectionner un mode de saisie')
      return errors
    },
    titreErrors() {
      const errors = []
      if (!this.$v.titre.$dirty) return errors
      !this.$v.titre.maxLength && errors.push('Le titre ne doit pas faire plus de 255 caractères')
      !this.$v.titre.required && errors.push('Le titre est obligatoire.')
      return errors
    },
    surnomErrors() {
      const errors = []
      if (!this.$v.surnom.$dirty) return errors
      !this.$v.surnom.maxLength && errors.push('Le surnom ne doit pas faire plus de 255 caractères')
      !this.$v.surnom.required && errors.push('Le surnom est obligatoire.')
      return errors
    },
    codeErrors() {
      const errors = []
      if (!this.$v.code.$dirty) return errors
      !this.$v.code.maxLength && errors.push('Le code ne doit pas faire plus de 255 caractères')
      !this.$v.code.required && errors.push('Le code est obligatoire')
      return errors
    },
    niveauErrors() {
      const errors = []
      if (!this.$v.niveau.$dirty) return errors
      !this.$v.niveau.numeric && errors.push('Le niveau doit être un entier')
      !this.$v.niveau.required && errors.push('Le niveau est obligatoire')
      return errors
    },
    indiceErrors() {
      const errors = []
      if (!this.$v.indice.$dirty) return errors
      !this.$v.indice.numeric && errors.push('Le niveau doit être un entier')
      !this.$v.indice.required && errors.push('Le niveau est obligatoire')
      return errors
    },
    vol_hor_total_prevues_etu_cmErrors() {
      const errors = []
      !this.$v.vol_hor_total_prevues_etu_cm.decimal && errors.push('Volume horaire total de CM prévu pour les étudiants doit être un numérique')
      return errors
    },
    vol_hor_total_prevues_etu_tdErrors() {
      const errors = []
      !this.$v.vol_hor_total_prevues_etu_td.decimal && errors.push('Volume horaire total de TD prévu pour les étudiants doit être un numérique')
      return errors
    },
    vol_hor_total_prevues_etu_tpErrors() {
      const errors = []
      !this.$v.vol_hor_total_prevues_etu_tp.decimal && errors.push('Volume horaire total de TD prévu pour les étudiants doit être un numérique')
      return errors
    },
    forfait_globale_cmErrors() {
      const errors = []
      !this.$v.forfait_globale_cm.decimal && errors.push('Forfait horaire global pour les CM doit être un numérique')
      return errors
    },
    forfait_globale_tdErrors() {
      const errors = []
      !this.$v.forfait_globale_td.decimal && errors.push('Forfait horaire global pour les TD doit être un numérique')
      return errors
    },
    forfait_globale_tpErrors() {
      const errors = []
      !this.$v.forfait_globale_tp.decimal && errors.push('Forfait horaire global pour les TP doit être un numérique')
      return errors
    },
    forfait_globale_partielErrors() {
      const errors = []
      !this.$v.forfait_globale_partiel.decimal && errors.push('Forfait horaire global pour les partiels doit être un numérique')
      return errors
    },
    nb_groupe_effectif_cmErrors() {
      const errors = []
      !this.$v.nb_groupe_effectif_cm.numeric && errors.push('Nombre de groupes effectifs pour les CM doit être un entier')
      return errors
    },
    nb_groupe_effectif_tdErrors() {
      const errors = []
      !this.$v.nb_groupe_effectif_td.numeric && errors.push('Nombre de groupes effectifs pour les TD doit être un entier')
      return errors
    },
    nb_groupe_effectif_tpErrors() {
      const errors = []
      !this.$v.nb_groupe_effectif_tp.numeric && errors.push('Nombre de groupes effectifs pour les TP doit être un entier')
      return errors
    },
    nb_groupe_effectif_partielErrors() {
      const errors = []
      !this.$v.nb_groupe_effectif_partiel.numeric && errors.push('Nombre de groupes effectifs pour les partiel doit être un entier')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      const element = {
        id: this.id,
        titre: this.titre,
        surnom: this.surnom,
        code: this.code,
        niveau: this.niveau,
        indice: this.indice,
        vol_hor_total_prevues_etu_cm: this.vol_hor_total_prevues_etu_cm,
        vol_hor_total_prevues_etu_td: this.vol_hor_total_prevues_etu_td,
        vol_hor_total_prevues_etu_tp: this.vol_hor_total_prevues_etu_tp,
        mode_saisie: this.mode_saisie,
        cm_autorises: Number(this.cm_autorises),
        td_autorises: Number(this.td_autorises),
        tp_autorises: Number(this.tp_autorises),
        partiel_autorises: Number(this.partiel_autorises),
        forfait_globale_cm: this.forfait_globale_cm,
        forfait_globale_td: this.forfait_globale_td,
        forfait_globale_tp: this.forfait_globale_tp,
        forfait_globale_partiel: this.forfait_globale_partiel,
        nb_groupe_effectif_cm: this.nb_groupe_effectif_cm,
        nb_groupe_effectif_td: this.nb_groupe_effectif_td,
        nb_groupe_effectif_tp: this.nb_groupe_effectif_tp,
        nb_groupe_effectif_partiel: this.nb_groupe_effectif_partiel,
        parent: this.parent,
      }
      if (this.methods === 'POST') {
        this.$store.commit('ADD_Element', element);
      } else {
        this.$store.commit('EDIT_Element', element);
      }
      this.clear()
      this.form = false;
    },
    clear() {
      this.$v.$reset()
      this.id = ''
      this.titre = ''
      this.surnom = ''
      this.code = ''
      this.niveau = ''
      this.indice = ''
      this.vol_hor_total_prevues_etu_cm = ''
      this.vol_hor_total_prevues_etu_td = ''
      this.vol_hor_total_prevues_etu_tp = ''
      this.mode_saisie = ''
      this.cm_autorises = false
      this.td_autorises = false
      this.tp_autorises = false
      this.partiel_autorises = false
      this.forfait_globale_cm = ''
      this.forfait_globale_td = ''
      this.forfait_globale_tp = ''
      this.forfait_globale_partiel = ''
      this.nb_groupe_effectif_cm = ''
      this.nb_groupe_effectif_td = ''
      this.nb_groupe_effectif_tp = ''
      this.nb_groupe_effectif_partiel = ''
      this.parent = null
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(element) {
      this.methods = 'PUT'

      this.id = element.id
      this.titre = element.titre
      this.surnom = element.surnom
      this.code = element.code
      this.niveau = element.niveau
      this.indice = element.indice
      this.vol_hor_total_prevues_etu_cm = element.vol_hor_total_prevues_etu_cm
      this.vol_hor_total_prevues_etu_td = element.vol_hor_total_prevues_etu_td
      this.vol_hor_total_prevues_etu_tp = element.vol_hor_total_prevues_etu_tp
      this.mode_saisie = element.mode_saisie
      this.cm_autorises = element.cm_autorises
      this.td_autorises = element.td_autorises
      this.tp_autorises = element.tp_autorises
      this.partiel_autorises = element.partiel_autorises
      this.forfait_globale_cm = element.forfait_globale_cm
      this.forfait_globale_td = element.forfait_globale_td
      this.forfait_globale_tp = element.forfait_globale_tp
      this.forfait_globale_partiel = element.forfait_globale_partiel
      this.nb_groupe_effectif_cm = element.nb_groupe_effectif_cm
      this.nb_groupe_effectif_td = element.nb_groupe_effectif_td
      this.nb_groupe_effectif_tp = element.nb_groupe_effectif_tp
      this.nb_groupe_effectif_partiel = element.nb_groupe_effectif_partiel
      this.parent = element.parent
      this.form = true;
    },
    sortedByTitre() {
      if (this.sortTitre) {
        this.sortTitre = false
        this.elements.sort((a, b) => a.titre.toUpperCase() < b.titre.toUpperCase())
      } else {
        this.sortTitre = true
        this.elements.sort((a, b) => a.titre.toUpperCase() > b.titre.toUpperCase())
      }
    },
    convertBoolean(b) {
      if (b === 0) return "Non"
      else return "Oui"
    },
  }
}
</script>

<style scoped>
.v-expansion-panel::before {
  box-shadow: none !important;
}

.v-expansion-panel-content::before {
  padding: 0 0 0 0 !important;
}
</style>