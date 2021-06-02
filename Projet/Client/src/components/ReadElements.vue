<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des hierarchies arborescentes</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!elements.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col
            v-for="e in elements"
            :key="e.id"
            sm="4"
        >
          <v-card>
            <v-card-title>{{ e.titre }}</v-card-title>
            <v-card-subtitle><b class="text-uppercase">{{ e.surnom }}</b></v-card-subtitle>
            <v-card-text>
              <p>Code :<b>{{ e.code }}</b></p>
              <p>Niveau :<b>{{ e.niveau }}</b></p>
              <p>Indice :<b>{{ e.indice }}</b></p>
              <p>Volume horaire prévu en CM pour les étudiants :<b>{{ e.vol_hor_total_prevues_etu_cm }}</b></p>
              <p>Volume horaire prévu en TD pour les étudiants :<b>{{ e.vol_hor_total_prevues_etu_td }}</b></p>
              <p>Volume horaire prévu en TP pour les étudiants :<b>{{ e.vol_hor_total_prevues_etu_tp }}</b></p>
              <p>Mode de saisie :<b>{{ e.mode_saisie }}</b></p>
              <p>CM autorisés :<b>{{ e.cm_autorises }}</b></p>
              <p>TD autorisés :<b>{{ e.td_autorises }}</b></p>
              <p>TP autorisés :<b>{{ e.tp_autorises }}</b></p>
              <p>Partiel autorisés :<b>{{ e.partiel_autorises }}</b></p>
              <p>Forfait globale en CM :<b>{{ e.forfait_globale_cm }}</b></p>
              <p>Forfait globale en TD :<b>{{ e.forfait_globale_td }}</b></p>
              <p>Forfait globale en TP :<b>{{ e.forfait_globale_tp }}</b></p>
              <p>Forfait globale en Partiel :<b>{{ e.forfait_globale_partiel }}</b></p>
              <p>Nombre de groupe effectif en CM :<b>{{ e.nb_groupe_effectif_cm }}</b></p>
              <p>Nombre de groupe effectif en TD :<b>{{ e.nb_groupe_effectif_td }}</b></p>
              <p>Nombre de groupe effectif en TP :<b>{{ e.nb_groupe_effectif_tp }}</b></p>
              <p>Nombre de groupe effectif en Partiel :<b>{{ e.nb_groupe_effectif_partiel }}</b></p>
              <p>Parent :<b>{{ e.parent }}</b></p>
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
                    @input="$v.nom.$touch()"
                    @blur="$v.nom.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="surnom"
                    :error-messages="surnomErrors"
                    :counter="255"
                    label="Surnom"
                    required
                    @input="$v.nom.$touch()"
                    @blur="$v.nom.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="code"
                    :error-messages="codeErrors"
                    :counter="255"
                    label="Code"
                    required
                    @input="$v.nom.$touch()"
                    @blur="$v.nom.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="niveau"
                    :error-messages="niveauErrors"
                    label="Niveau"
                    required
                    @input="$v.niveau.$touch()"
                    @blur="$v.niveau.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="indice"
                    :error-messages="indiceErrors"
                    label="Indice"
                    required
                    @input="$v.indice.$touch()"
                    @blur="$v.indice.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_total_prevues_etu_cm"
                    :error-messages="vol_hor_total_prevues_etu_cmErrors"
                    label="Volume horaire total de CM prévu pour les étudiants"
                    required
                    @input="$v.vol_hor_total_prevues_etu_cm.$touch()"
                    @blur="$v.vol_hor_total_prevues_etu_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_total_prevues_etu_td"
                    :error-messages="vol_hor_total_prevues_etu_tdErrors"
                    label="Volume horaire total de TD prévu pour les étudiants"
                    required
                    @input="$v.vol_hor_total_prevues_etu_td.$touch()"
                    @blur="$v.vol_hor_total_prevues_etu_td.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="vol_hor_total_prevues_etu_tp"
                    :error-messages="vol_hor_total_prevues_etu_tpErrors"
                    label="Volume horaire total de TP prévu pour les étudiants"
                    required
                    @input="$v.vol_hor_total_prevues_etu_tp.$touch()"
                    @blur="$v.vol_hor_total_prevues_etu_tp.$touch()"
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
                ></v-select>
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
                <v-text-field
                    v-model="forfait_globale_cm"
                    :error-messages="forfait_globale_cmErrors"
                    label="Forfait horaire global pour les CM"
                    required
                    @input="$v.forfait_globale_cm.$touch()"
                    @blur="$v.forfait_globale_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="forfait_globale_td"
                    :error-messages="forfait_globale_tdErrors"
                    label="Forfait horaire global pour les TD"
                    required
                    @input="$v.forfait_globale_td.$touch()"
                    @blur="$v.forfait_globale_td.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="forfait_globale_tp"
                    :error-messages="fforfait_globale_tpErrors"
                    label="Forfait horaire global pour les TP"
                    required
                    @input="$v.forfait_globale_tp.$touch()"
                    @blur="$v.forfait_globale_tp.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="forfait_globale_partiel"
                    :error-messages="forfait_globale_partielErrors"
                    label="Forfait horaire global pour les partiels"
                    required
                    @input="$v.forfait_globale_partiel.$touch()"
                    @blur="$v.forfait_globale_partiel.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_effectif_cm"
                    :error-messages="nb_groupe_effectif_cmrrors"
                    label="Nombre de groupes effectifs pour les CM"
                    required
                    @input="$v.nb_groupe_effectif_cm.$touch()"
                    @blur="$v.nb_groupe_effectif_cm.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_effectif_td"
                    :error-messages="nb_groupe_effectif_tdErrors"
                    label="Nombre de groupes effectifs pour les TD"
                    required
                    @input="$v.nb_groupe_effectif_td.$touch()"
                    @blur="$v.nb_groupe_effectif_td.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_effectif_tp"
                    :error-messages="nb_groupe_effectif_tpErrors"
                    label="Nombre de groupes effectifs pour les TP"
                    required
                    @input="$v.nb_groupe_effectif_tp.$touch()"
                    @blur="$v.nb_groupe_effectif_tp.$touch()"
                ></v-text-field>
                <v-text-field
                    v-model="nb_groupe_effectif_partiel"
                    :error-messages="nb_groupe_effectif_partielErrors"
                    label="Nombre de groupes effectifs pour les partiels"
                    required
                    @input="$v.nb_groupe_effectif_partiel.$touch()"
                    @blur="$v.nb_groupe_effectif_partiel.$touch()"
                ></v-text-field>
                <v-select
                    v-model="parent"
                    :items="elements"
                    item-text="titre"
                    item-value="id"
                    label="Parent"
                    :error-messages="parentErrors"
                    @change="$v.parent.$touch()"
                    @blur="$v.parent.$touch()"
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

export default {
  name: "ReadElements",
  data: () => ({
    form: false,
    methods: "POST",
    item_mode_saisie: [
      { nom: 'Aucun', val: 'aucun' },
      { nom: 'Hebdomadaire', val: 'hebdo' },
      { nom: 'Globale', val: 'globale' },
    ],
    titre: '',
    surnom: '',
    code: '',
    niveau: '',
    indice: '',
    vol_hor_total_prevues_etu_cm: '',
    vol_hor_total_prevues_etu_td: '',
    vol_hor_total_prevues_etu_tp: '',
    mode_saisie: '',
    cm_autorises: '',
    td_autorises: '',
    tp_autorises: '',
    partiel_autorises: '',
    forfait_globale_cm: '',
    forfait_globale_td: '',
    forfait_globale_tp: '',
    forfait_globale_partiel: '',
    nb_groupe_effectif_cm: '',
    nb_groupe_effectif_td: '',
    nb_groupe_effectif_tp: '',
    nb_groupe_effectif_partiel: '',
    parent: '',
  }),
  mounted() {
    this.$store.dispatch('loadElements');
  },
  computed: {
    ...mapState(['elements']),
  },
  methods: {
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
  }
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