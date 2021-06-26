<template>
  <v-container>
    <v-row>
      <template v-for="formation in racine">
        <v-col
            :key="formation.id"
            v-if="formation.parent === null"
            cols="12"
            class="pa-0"
        >
          <v-card flat>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-divider></v-divider>
              <span class="mr-2 ml-2 text-h5">{{ formation.titre }}</span>
              <v-divider></v-divider>
              <v-spacer></v-spacer>
              <div>
                <v-menu :disabled="disabled" :close-on-content-click="false" offset-x left nudge-bottom="-14" rounded="pill" transition="slide-x-reverse-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                              icon
                              v-bind="attrs"
                              v-on="on"
                              class="ma-1"
                              @click="edit(formation, null)"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Modifier {{ formation.surnom }}</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                              icon
                              v-bind="attrs"
                              v-on="on"
                              class="ma-1"
                              @click="addSemester(formation)"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>
                        <span>Ajouter un semestre</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                              icon
                              v-bind="attrs"
                              v-on="on"
                              class="ma-1"
                          >
                            <v-icon>file_copy</v-icon>
                          </v-btn>
                        </template>
                        <span>Dupliquer</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                              icon
                              v-bind="attrs"
                              v-on="on"
                              class="ma-1"
                          >
                            <v-icon color="red darken-1">delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Supprimer</span>
                      </v-tooltip>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-card-title>
            <v-card-subtitle class="text-center text-subtitle-1">{{ formation.surnom }}</v-card-subtitle>
            <v-card-text class="pa-0">
              <v-container>
                <v-row>
                  <v-expansion-panels
                      multiple
                      accordion
                      hover
                      flat
                      focusable
                  >
                    <v-expansion-panel
                        v-for="semestre in elements"
                        :key="semestre.id"
                    >
                      <v-expansion-panel-header v-if="formation.id === semestre.parent">
                        <div class="ml-n3">
                          <v-menu :disabled="disabled" :close-on-content-click="false" offset-x right nudge-bottom="-14" rounded="pill" transition="slide-x-transition">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                              >
                                <v-icon>mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ma-1"
                                        @click="edit(semestre, findPeriodeBySemestre(semestre.id))"
                                    >
                                      <v-icon>edit</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Modifier {{ semestre.titre }}</span>
                                </v-tooltip>
                                <EditPeriode :element="semestre"></EditPeriode>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ma-1"
                                        @click="addUE(semestre)"
                                    >
                                      <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Ajouter une UE au {{ semestre.titre }}</span>
                                </v-tooltip>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ma-1"
                                    >
                                      <v-icon>file_copy</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Dupliquer</span>
                                </v-tooltip>
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ma-1"
                                    >
                                      <v-icon color="red darken-1">delete</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Supprimer</span>
                                </v-tooltip>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                          <span class="overline">{{ semestre.titre }}</span>
                        </div>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content v-if="formation.id === semestre.parent">
                          <v-container>
                            <v-row>
                              <v-expansion-panels
                                  multiple
                                  accordion
                                  hover
                              >
                                <v-expansion-panel
                                    v-for="ue in elements"
                                    :key="ue.id"
                                >
                                  <v-expansion-panel-header v-if="semestre.id === ue.parent">
                                    <div class="ml-2">
                                      <v-menu :disabled="disabled" :close-on-content-click="false" offset-x right nudge-bottom="-14" rounded="pill" transition="slide-x-transition">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-btn
                                              icon
                                              v-bind="attrs"
                                              v-on="on"
                                          >
                                            <v-icon>mdi-dots-vertical</v-icon>
                                          </v-btn>
                                        </template>
                                        <v-list>
                                          <v-list-item>
                                            <v-tooltip top>
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ma-1"
                                                    @click="edit(ue, null)"
                                                >
                                                  <v-icon>edit</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Modifier {{ ue.titre }}</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ma-1"
                                                    @click="addModule(ue, semestre)"
                                                >
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Ajouter un module à l'{{ ue.titre }}</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ma-1"
                                                >
                                                  <v-icon>file_copy</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Dupliquer</span>
                                            </v-tooltip>
                                            <v-tooltip top>
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    icon
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ma-1"
                                                >
                                                  <v-icon color="red darken-1">delete</v-icon>
                                                </v-btn>
                                              </template>
                                              <span>Supprimer</span>
                                            </v-tooltip>
                                          </v-list-item>
                                        </v-list>
                                      </v-menu>
                                      <span class="subtitle-1">{{ ue.titre }}</span>
                                    </div>
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content v-if="semestre.id === ue.parent">
                                      <v-container>
                                        <v-row>
                                          <v-expansion-panels
                                              multiple
                                              accordion
                                              hover
                                          >
                                            <v-expansion-panel
                                                v-for="module in elements"
                                                :key="module.id"
                                            >
                                                <v-expansion-panel-header v-if="ue.id === module.parent">
                                                  <div class="ml-7">
                                                    <v-menu :disabled="disabled" :close-on-content-click="false" offset-x right nudge-bottom="-14" rounded="pill" transition="slide-x-transition">
                                                      <template v-slot:activator="{ on, attrs }">
                                                        <v-btn
                                                            icon
                                                            v-bind="attrs"
                                                            v-on="on"
                                                        >
                                                          <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                      </template>
                                                      <v-list>
                                                        <v-list-item>
                                                          <v-tooltip top>
                                                            <template v-slot:activator="{ on, attrs }">
                                                              <v-btn
                                                                  icon
                                                                  v-bind="attrs"
                                                                  v-on="on"
                                                                  class="ma-1"
                                                                  @click="edit(module, null)"
                                                              >
                                                                <v-icon>edit</v-icon>
                                                              </v-btn>
                                                            </template>
                                                            <span>Modifier {{ module.surnom }}</span>
                                                          </v-tooltip>
                                                          <EditNbGroupeModule :element="module"/>
                                                          <v-tooltip top>
                                                            <template v-slot:activator="{ on, attrs }">
                                                              <v-btn
                                                                  icon
                                                                  v-bind="attrs"
                                                                  v-on="on"
                                                                  class="ma-1"
                                                              >
                                                                <v-icon>file_copy</v-icon>
                                                              </v-btn>
                                                            </template>
                                                            <span>Dupliquer</span>
                                                          </v-tooltip>
                                                          <v-tooltip top>
                                                            <template v-slot:activator="{ on, attrs }">
                                                              <v-btn
                                                                  icon
                                                                  v-bind="attrs"
                                                                  v-on="on"
                                                                  class="ma-1"
                                                              >
                                                                <v-icon color="red darken-1">delete</v-icon>
                                                              </v-btn>
                                                            </template>
                                                            <span>Supprimer</span>
                                                          </v-tooltip>
                                                        </v-list-item>
                                                      </v-list>
                                                    </v-menu>
                                                    <span class="subtitle-2">{{ module.titre }}</span>
                                                  </div>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content v-if="ue.id === module.parent">
                                                  <v-container>
                                                    <v-row>
                                                      <v-col class="pl-16 pr-6 pt-0 pb-0">
                                                        <div v-if="module.mode_saisie !=='aucun'">
                                                          <div v-if="module.mode_saisie ==='hebdo'">
                                                            <v-simple-table dense fixed-header>
                                                              <template v-slot:default>
                                                                <thead>
                                                                <tr>
                                                                  <th class="top-border"></th>
                                                                  <th :colspan="findPeriodeBySemestre(semestre.id).nb_semaine" class="text-center top-border">
                                                                    <span class="text-subtitle-1">Volumes horaires prévus pour un étudiant</span>
                                                                  </th>
                                                                  <th class="top-border"></th>
                                                                </tr>

                                                                <tr>
                                                                  <th class="text-right right-border"></th>
                                                                  <template v-for="v in volumesHebdomadaires">
                                                                    <th :key="v.id" v-if="v.element_id === module.id" class="text-center">
                                                                      {{ v.num_semaine }}
                                                                    </th>
                                                                  </template>
                                                                  <th class="text-center left-border">Total</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr v-if="module.cm_autorises">
                                                                  <TDContexteMenu :lim="50" :type-cours="'cm'" :table="'volumes-hebdomadaires'" :element="module.id" :disabled="disabled"></TDContexteMenu>
                                                                  <template v-for="v in volumesHebdomadaires">
                                                                    <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'cm'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                                                  </template>
                                                                  <td class="left-border text-center">{{ totalVolume(module, 'vol_hor_cm') }}</td>
                                                                </tr>

                                                                <tr v-if="module.td_autorises">
                                                                  <TDContexteMenu :lim="50" :type-cours="'td'" :table="'volumes-hebdomadaires'" :element="module.id"></TDContexteMenu>
                                                                  <template v-for="v in volumesHebdomadaires">
                                                                    <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'td'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                                                  </template>
                                                                  <td class="left-border text-center">{{totalVolume(module, 'vol_hor_td') }}</td>
                                                                </tr>

                                                                <tr v-if="module.tp_autorises">
                                                                  <TDContexteMenu :lim="50" :type-cours="'tp'" :table="'volumes-hebdomadaires'" :element="module.id"></TDContexteMenu>
                                                                  <template v-for="v in volumesHebdomadaires">
                                                                    <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'tp'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                                                  </template>
                                                                  <td class="left-border text-center">{{totalVolume(module, 'vol_hor_tp') }}</td>
                                                                </tr>

                                                                <tr v-if="module.partiel_autorises">
                                                                  <TDContexteMenu :lim="50" :type-cours="'partiel'" :table="'volumes-hebdomadaires'" :element="module.id"></TDContexteMenu>
                                                                  <template v-for="v in volumesHebdomadaires">
                                                                    <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'partiel'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                                                  </template>
                                                                  <td class="left-border text-center">{{totalVolume(module, 'vol_hor_partiel') }}</td>
                                                                </tr>
                                                                </tbody>
                                                              </template>
                                                            </v-simple-table>
                                                            <v-divider></v-divider>
                                                            <v-expansion-panels hover flat focusable tile>
                                                              <v-expansion-panel>
                                                                <v-expansion-panel-header class="height-row">
                                                                  <template v-slot:actions>
                                                                    <v-icon class="icon-intervenant">$expand</v-icon>
                                                                  </template>
                                                                  <template v-slot:default="{ open }">
                                                                    <v-row no-gutters class="header-intervenant">
                                                                      <span v-if="!open" class="ml-2">Afficher les intervenants de {{ module.surnom }}</span>
                                                                      <span v-else class="ml-2">Masquer les intervenants de {{ module.surnom }}</span>
                                                                    </v-row>
                                                                  </template>
                                                                </v-expansion-panel-header>
                                                                <v-expansion-panel-content>
                                                                  <template v-for="i in intervenantsModules">
                                                                    <v-simple-table dense fixed-header :key="i.id" v-if="i.element_id === module.id">
                                                                      <template v-slot:default>
                                                                        <thead>
                                                                        <tr>
                                                                          <th class="top-border"></th>
                                                                          <th :colspan="findPeriodeBySemestre(semestre.id).nb_semaine" class="text-center top-border">
                                                                            <span class="text-subtitle-1">{{ returnEnseignant(i.intervenant_id).prenom }} {{ returnEnseignant(i.intervenant_id).nom }}</span>
                                                                          </th>
                                                                          <SupprimerTableau :type="'groupes-intervenants'" :module="module" :intervenant="i"/>
                                                                        </tr>

                                                                        <tr>
                                                                          <th class="right-border"></th>
                                                                          <template v-for="g in groupesIntervenants">
                                                                            <th :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" class="text-center">
                                                                              {{ g.num_semaine }}
                                                                            </th>
                                                                          </template>
                                                                          <th class="text-center left-border">Total</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        <tr v-if="module.cm_autorises">
                                                                          <TDContexteMenu :lim="module.nb_groupe_effectif_cm" :type-cours="'cm'" :table="'groupes-intervenants'" :intervenant="i.intervenant_id" :element="module.id" :disabled="disabled"></TDContexteMenu>
                                                                          <template v-for="g in groupesIntervenants">
                                                                            <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_cm" :type-cours="'cm'" :data="g" :table="'groupes-intervenants'" :disabled="disabled"/>
                                                                          </template>
                                                                          <td class="left-border text-center">{{ totalNbGroupe(module,i.intervenant_id , 'nb_groupe_cm') }}</td>
                                                                        </tr>

                                                                        <tr v-if="module.td_autorises">
                                                                          <TDContexteMenu :lim="module.nb_groupe_effectif_td" :type-cours="'td'" :table="'groupes-intervenants'" :intervenant="i.intervenant_id" :element="module.id"></TDContexteMenu>
                                                                          <template v-for="g in groupesIntervenants">
                                                                            <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_td" :type-cours="'td'" :data="g" :table="'groupes-intervenants'" :disabled="disabled"/>
                                                                          </template>
                                                                          <td class="left-border text-center">{{ totalNbGroupe(module, i.intervenant_id , 'nb_groupe_td') }}</td>
                                                                        </tr>

                                                                        <tr v-if="module.tp_autorises">
                                                                          <TDContexteMenu :lim="module.nb_groupe_effectif_tp" :type-cours="'tp'" :table="'groupes-intervenants'" :intervenant="i.intervenant_id" :element="module.id"></TDContexteMenu>
                                                                          <template v-for="g in groupesIntervenants">
                                                                            <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_tp" :type-cours="'tp'" :data="g" :table="'groupes-intervenants'" :disabled="disabled"/>
                                                                          </template>
                                                                          <td class="left-border text-center">{{ totalNbGroupe(module, i.intervenant_id , 'nb_groupe_tp') }}</td>
                                                                        </tr>

                                                                        <tr v-if="module.partiel_autorises">
                                                                          <TDContexteMenu :lim="module.nb_groupe_effectif_partiel" :type-cours="'partiel'" :table="'groupes-intervenants'" :intervenant="i.intervenant_id" :element="module.id"></TDContexteMenu>
                                                                          <template v-for="g in groupesIntervenants">
                                                                            <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_partiel" :type-cours="'partiel'" :data="g" :table="'groupes-intervenants'" :disabled="disabled"/>
                                                                          </template>
                                                                          <td class="left-border text-center">{{ totalNbGroupe(module, i.intervenant_id , 'nb_groupe_partiel') }}</td>
                                                                        </tr>
                                                                        </tbody>
                                                                      </template>
                                                                    </v-simple-table>
                                                                  </template>
                                                                  <v-divider></v-divider>
                                                                  <v-btn text tile block @click="addGrpInterv(module.id, semestre.id)" height="2.3em" :disabled="disabled">
                                                                    Ajouter un intervenant
                                                                  </v-btn>
                                                                </v-expansion-panel-content>
                                                              </v-expansion-panel>
                                                            </v-expansion-panels>
                                                          </div>
                                                          <div v-if="module.mode_saisie ==='globale'">
                                                            <template v-for="i in volumesGlobaux">
                                                              <v-simple-table dense fixed-header :key="i.id" v-if="i.element_id === module.id">
                                                                <template v-slot:default>
                                                                  <thead>
                                                                  <tr>
                                                                    <th :colspan="2" class="text-center top-border">
                                                                      <span class="text-subtitle-1">{{ returnEnseignant(i.intervenant_id).prenom }} {{ returnEnseignant(i.intervenant_id).nom }}</span>
                                                                    </th>
                                                                  </tr>
                                                                  <tr>
                                                                    <th class="text-right right-border"></th>
                                                                    <th>{{ module.surnom }}</th>
                                                                  </tr>
                                                                  </thead>
                                                                  <tbody>
                                                                  <tr v-if="module.cm_autorises">
                                                                    <td>CM</td>
                                                                    <template v-for="g in volumesGlobaux">
                                                                      <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_cm" :type-cours="'cm'" :data="g" :table="'volumes-globaux'" :disabled="disabled"/>
                                                                    </template>
                                                                  </tr>

                                                                  <tr v-if="module.td_autorises">
                                                                    <td>TD</td>
                                                                    <template v-for="g in volumesGlobaux">
                                                                      <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_td" :type-cours="'td'" :data="g" :table="'volumes-globaux'" :disabled="disabled"/>
                                                                    </template>
                                                                  </tr>

                                                                  <tr v-if="module.tp_autorises">
                                                                    <td>TP</td>
                                                                    <template v-for="g in volumesGlobaux">
                                                                      <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_tp" :type-cours="'tp'" :data="g" :table="'volumes-globaux'" :disabled="disabled"/>
                                                                    </template>
                                                                  </tr>

                                                                  <tr v-if="module.partiel_autorises">
                                                                    <td>PARTIEL</td>
                                                                    <template v-for="g in volumesGlobaux">
                                                                      <TDEditValue :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" :lim="module.nb_groupe_effectif_partiel" :type-cours="'partiel'" :data="g" :table="'volumes-globaux'" :disabled="disabled"/>
                                                                    </template>
                                                                  </tr>
                                                                  </tbody>
                                                                </template>
                                                              </v-simple-table>
                                                            </template>
                                                          </div>
                                                        </div>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-expansion-panel-content>

                                            </v-expansion-panel>
                                          </v-expansion-panels>
                                        </v-row>
                                      </v-container>
                                    </v-expansion-panel-content>

                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-row>
                          </v-container>
                        </v-expansion-panel-content>

                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-container>
            </v-card-text>
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
              <v-text-field v-if="this.methods !=='POST' && this.niveau > 1 && !this.formation"
                  v-model="niveau"
                  :error-messages="niveauErrors"
                  label="Niveau"
                  required
                  clearable
                  @input="$v.niveau.$touch()"
                  @blur="$v.niveau.$touch()"
              ></v-text-field>
              <v-text-field v-if="!this.formation"
                  v-model="indice"
                  :error-messages="indiceErrors"
                  label="Indice"
                  required
                  clearable
                  @input="$v.indice.$touch()"
                  @blur="$v.indice.$touch()"
              ></v-text-field>
              <v-select v-if="!this.formation"
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
              <v-select v-if="!this.formation"
                  v-model="parent"
                  :items="elements"
                  clearable
                  hint="Laisser vide pour un élément racine"
                  persistent-hint
                  item-text="titre"
                  item-value="id"
                  label="Parent"
              ></v-select>
              <div class="ma-0 pa-0" v-if="this.niveau === 1 && methods !== 'PUT'">
                <div class="text-h5 mt-4">Période</div>
                <v-divider class="mt-3 mb-6"></v-divider>
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
              </div>
              <div class="ma-0 pa-0" v-if="this.mode_saisie && this.mode_saisie !== 'aucun'">
                <v-container class="mt-4">
                  <v-row class="mb-3">
                    <span class="subtitle-1">Volume horaire total prévu par le programme pour les étudiants</span>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          v-model="vol_hor_total_prevues_etu_cm"
                          :error-messages="vol_hor_total_prevues_etu_cmErrors"
                          label="CM"
                          @input="$v.vol_hor_total_prevues_etu_cm.$touch()"
                          @blur="$v.vol_hor_total_prevues_etu_cm.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          v-model="vol_hor_total_prevues_etu_td"
                          :error-messages="vol_hor_total_prevues_etu_tdErrors"
                          label="TD"
                          @input="$v.vol_hor_total_prevues_etu_td.$touch()"
                          @blur="$v.vol_hor_total_prevues_etu_td.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          v-model="vol_hor_total_prevues_etu_tp"
                          :error-messages="vol_hor_total_prevues_etu_tpErrors"
                          label="TP"
                          @input="$v.vol_hor_total_prevues_etu_tp.$touch()"
                          @blur="$v.vol_hor_total_prevues_etu_tp.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>

                <v-container>
                  <v-row>
                    <span class="subtitle-1">Cours autorisés</span>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="cm_autorises" :label="'CM'" color="success"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="td_autorises" :label="'TD'" color="success"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="tp_autorises" :label="'TP'" color="success"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="partiel_autorises" :label="'Partiel'" color="success"></v-switch>
                    </v-col>
                  </v-row>
                </v-container>

                <v-container v-if="this.mode_saisie ==='globale'">
                  <v-row>
                    <span class="subtitle-1">Forfait horaire global</span>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center" v-if="Boolean(this.cm_autorises)">
                      <v-text-field
                        v-model="forfait_globale_cm"
                        :error-messages="forfait_globale_cmErrors"
                        label="CM"
                        @input="$v.forfait_globale_cm.$touch()"
                        @blur="$v.forfait_globale_cm.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center" v-if="Boolean(this.td_autorises)">
                      <v-text-field
                          v-model="forfait_globale_td"
                          :error-messages="forfait_globale_tdErrors"
                          label="TD"
                          @input="$v.forfait_globale_td.$touch()"
                          @blur="$v.forfait_globale_td.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center" v-if="Boolean(this.tp_autorises)">
                      <v-text-field
                          v-model="forfait_globale_tp"
                          :error-messages="forfait_globale_tpErrors"
                          label="TP"
                          @input="$v.forfait_globale_tp.$touch()"
                          @blur="$v.forfait_globale_tp.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center" v-if="Boolean(this.partiel_autorises)">
                      <v-text-field
                          v-model="forfait_globale_partiel"
                          :error-messages="forfait_globale_partielErrors"
                          label="Partiel"
                          @input="$v.forfait_globale_partiel.$touch()"
                          @blur="$v.forfait_globale_partiel.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
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
    <v-row justify="center">
      <v-dialog
          v-model="formIntervenant"
          persistent
          max-width="600px"
      >

        <v-card>
          <v-form lazy-validation>
            <v-card-title>
              <span class="headline">Ajouter un intervenant</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeGrpIntev">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-select
                  v-model="intervenant_id"
                  :items="intervenantByProjetNotInModule"
                  :item-text="item => item.prenom + ' ' + item.nom"
                  item-value="id"
                  label="Intervenant"
                  clearable
                  :error-messages="intervenantErrors"
                  no-data-text="Tous les intervenants du projet sont déjà assignés au module ou aucun intervenant dans le projet"
                  @input="$v.intervenant_id.$touch()"
                  @blur="$v.intervenant_id.$touch()"
                  required
              ></v-select>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    class="mr-4"
                    text
                    @click="submitGrpInterv"
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
</template>

<script>
import {mapState} from "vuex";
import {validationMixin} from "vuelidate";
import {decimal, maxLength, numeric, required} from "vuelidate/lib/validators";
import TDContexteMenu from "./TDContexteMenu";
import EditPeriode from "./EditPeriode";
import TDEditValue from "./TDEditValue";
import EditNbGroupeModule from "./EditNbGroupeModule";
import axios from "axios";
import SupprimerTableau from "./SupprimerTableau";

export default {
  name: "ReadElements",
  components: {SupprimerTableau, EditNbGroupeModule, TDEditValue, EditPeriode, TDContexteMenu},
  mixins: [validationMixin],
  props: ['racine', 'disabled'],

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
    parent: {numeric},

    nb_semaine: {numeric, required},
    nb_groupe_defaut_cm: {numeric, required},
    nb_groupe_defaut_td: {numeric, required},
    nb_groupe_defaut_tp: {numeric, required},
    nb_groupe_defaut_partiel: {numeric, required},

    intervenant_id : {numeric},
  },
  data: () => ({
    form: false,
    formIntervenant: false,
    formation: false,
    methods: "POST",
    item_mode_saisie: [
      {nom: 'Aucun', val: 'aucun'},
      {nom: 'Hebdomadaire', val: 'hebdo'},
      {nom: 'Globale', val: 'globale'},
    ],
    idElement: '',
    titre: '',
    surnom: '',
    code: '',
    niveau: '',
    indice: '',
    vol_hor_total_prevues_etu_cm: null,
    vol_hor_total_prevues_etu_td: null,
    vol_hor_total_prevues_etu_tp: null,
    mode_saisie: null,
    cm_autorises: true,
    td_autorises: true,
    tp_autorises: true,
    partiel_autorises: true,
    forfait_globale_cm: null,
    forfait_globale_td: null,
    forfait_globale_tp: null,
    forfait_globale_partiel: null,
    nb_groupe_effectif_cm: null,
    nb_groupe_effectif_td: null,
    nb_groupe_effectif_tp: null,
    nb_groupe_effectif_partiel: null,
    parent: null,
    nbfils: null,

    idPeriode: '',
    nb_semaine: 1,
    old_nb_semaine: '',
    nb_groupe_defaut_cm: 1,
    nb_groupe_defaut_td: 1,
    nb_groupe_defaut_tp: 1,
    nb_groupe_defaut_partiel: 1,

    intervenantByProjetNotInModule: [],
    intervenant_id: null,
  }),
  mounted() {
    this.$store.dispatch('loadGenerique', 'elements');
    this.$store.dispatch('loadGenerique', 'periodes');
    this.$store.dispatch('loadGenerique', 'volumes-hebdomadaires');
    this.$store.dispatch('loadGenerique', 'volumes-globaux');
    this.$store.dispatch('loadGenerique', 'intervenants');
    this.$store.dispatch('loadGenerique', 'enseignants');
    this.$store.dispatch('loadIntervenantsModules');
    this.$store.dispatch('loadGenerique', 'groupes-intervenants');
  },
  computed: {
    ...mapState(['elements','periodes', 'volumesHebdomadaires', 'volumesGlobaux', 'intervenants', 'enseignants', 'intervenantsModules', 'groupesIntervenants']),
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
      !this.$v.vol_hor_total_prevues_etu_cm.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
    vol_hor_total_prevues_etu_tdErrors() {
      const errors = []
      !this.$v.vol_hor_total_prevues_etu_td.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
    vol_hor_total_prevues_etu_tpErrors() {
      const errors = []
      !this.$v.vol_hor_total_prevues_etu_tp.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
    forfait_globale_cmErrors() {
      const errors = []
      !this.$v.forfait_globale_cm.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
    forfait_globale_tdErrors() {
      const errors = []
      !this.$v.forfait_globale_td.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
    forfait_globale_tpErrors() {
      const errors = []
      !this.$v.forfait_globale_tp.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
    forfait_globale_partielErrors() {
      const errors = []
      !this.$v.forfait_globale_partiel.decimal && errors.push('Veuillez saisir un entier ou un nombre à virgule')
      return errors
    },
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
    intervenantErrors() {
      const errors = []
      if (!this.$v.intervenant_id .$dirty) return errors
      !this.$v.intervenant_id.numeric && errors.push('Veuillez sélectionner un intervenant')
      return errors
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return;
      const element = {
        id: this.idElement,
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
        nbfils: this.nbfils,
        periode: null,
      }
      if (element.niveau === 1){
        element.periode = {
          id: this.idPeriode,
          nb_semaine: this.nb_semaine,
          old_nb_semaine: this.old_nb_semaine,
          nb_groupe_defaut_cm: this.nb_groupe_defaut_cm,
          nb_groupe_defaut_td: this.nb_groupe_defaut_td,
          nb_groupe_defaut_tp: this.nb_groupe_defaut_tp,
          nb_groupe_defaut_partiel: this.nb_groupe_defaut_partiel,
        }
      }
      if (element.niveau === 3){
        let index = this.elements.findIndex(e => e.id === element.parent);
        var grand_pere_id = this.elements[index].parent
        element.periode = this.findPeriodeBySemestre(grand_pere_id)
      }

      if (this.methods === 'POST') {
        this.$store.dispatch('ADD_Element', element);
      } else {
        this.$store.commit('EDIT_Element', element);
      }
      this.clear()
      this.form = false;
    },
    clear() {
      this.$v.$reset()
      this.idElement = ''
      this.titre = ''
      this.surnom = ''
      this.code = ''
      this.niveau = ''
      this.indice = ''
      this.vol_hor_total_prevues_etu_cm = null
      this.vol_hor_total_prevues_etu_td = null
      this.vol_hor_total_prevues_etu_tp = null
      this.mode_saisie = ''
      this.cm_autorises = true
      this.td_autorises = true
      this.tp_autorises = true
      this.partiel_autorises = true
      this.forfait_globale_cm = null
      this.forfait_globale_td = null
      this.forfait_globale_tp = null
      this.forfait_globale_partiel = null
      this.nb_groupe_effectif_cm = ''
      this.nb_groupe_effectif_td = ''
      this.nb_groupe_effectif_tp = ''
      this.nb_groupe_effectif_partiel = ''
      this.parent = null
      this.nbfils = null

      this.idPeriode = ''
      this.nb_semaine = 1
      this.old_nb_semaine = ''
      this.nb_groupe_defaut_cm = 1
      this.nb_groupe_defaut_td = 1
      this.nb_groupe_defaut_tp = 1
      this.nb_groupe_defaut_partiel = 1
    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
    edit(element, periode) {
      this.methods = 'PUT'

      this.idElement = element.id
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
      this.nbfils = element.nbfils

      if (periode !== null){
        this.idPeriode = periode.id
        this.nb_semaine = periode.nb_semaine
        this.old_nb_semaine = periode.nb_semaine
        this.nb_groupe_defaut_cm = periode.nb_groupe_defaut_cm
        this.nb_groupe_defaut_td = periode.nb_groupe_defaut_td
        this.nb_groupe_defaut_tp = periode.nb_groupe_defaut_tp
        this.nb_groupe_defaut_partiel = periode.nb_groupe_defaut_partiel
        this.element_id = element.id
      }

      this.formation = this.parent === null;
      this.form = true;
    },
    save(data, type){
      if (type === 'groupe'){
          this.$store.dispatch('EDIT_GroupeIntervenant', data);
      } else if (type === 'volume'){
        this.$store.dispatch('EDIT_VolumesHebdomadaires', data);
      } else if (type === 'globale'){
        this.$store.dispatch('EDIT_VolumesGlobaux', data);
      }
    },
    addSemester(element) {
      var nbfils = element.nbfils
      if (nbfils === null) nbfils = 0
      this.titre = "Semestre " + (nbfils + 1)
      this.surnom = "S" + (nbfils + 1)
      this.niveau = 1
      this.mode_saisie = 'aucun'
      this.indice = nbfils
      this.parent = element.id
      this.formation = false;
      this.form = true;
    },
    addUE(element) {
      var indice = element.indice
      var nbfils = element.nbfils
      if (nbfils === null) nbfils = 0
      this.titre = "UE " + (indice + 1) + (nbfils+1) + " : "
      this.surnom = "UE" + (indice + 1) + (nbfils+1)
      this.niveau = 2
      this.mode_saisie = 'aucun'
      this.indice = nbfils
      this.parent = element.id
      var periode = this.findPeriodeBySemestre(element.id);
      if (periode !== -1 && periode !== undefined){
        this.nb_groupe_effectif_cm = periode.nb_groupe_defaut_cm
        this.nb_groupe_effectif_td = periode.nb_groupe_defaut_td
        this.nb_groupe_effectif_tp = periode.nb_groupe_defaut_tp
        this.nb_groupe_effectif_partiel = periode.nb_groupe_defaut_partiel
      }
      this.formation = false;
      this.form = true;
    },
    addModule(element, semestre) {
      var indice = element.indice
      var indiceM = semestre.indice
      var nbfils = element.nbfils
      if (nbfils === null) nbfils = 0
      if (nbfils + 1 < 10) {
        this.titre = "M " + (indiceM + 1) + (indice + 1) + 0 + (nbfils + 1) + " : "
        this.surnom = "M" + (indiceM + 1) + (indice + 1) + 0 + (nbfils + 1)
      } else {
        this.titre = "M " + (indiceM + 1) + (indice + 1) + (nbfils + 1) + " : "
        this.surnom = "M" + (indiceM + 1) + (indice + 1) + (nbfils + 1)
      }
      this.niveau = 3
      this.indice = nbfils
      this.parent = element.id
      var periode = this.findPeriodeBySemestre(semestre.id);
      if (periode !== -1 && periode !== undefined){
        this.nb_groupe_effectif_cm = periode.nb_groupe_defaut_cm
        this.nb_groupe_effectif_td = periode.nb_groupe_defaut_td
        this.nb_groupe_effectif_tp = periode.nb_groupe_defaut_tp
        this.nb_groupe_effectif_partiel = periode.nb_groupe_defaut_partiel
      }
      this.formation = false;
      this.form = true;
    },
    findPeriodeBySemestre(id){
      let index = this.periodes.findIndex(p => p.element_id === id);
      return this.periodes[index];
    },
    returnEnseignant(id){
      let index = this.intervenants.findIndex(p => p.id === id);
      let indexE = this.enseignants.findIndex(p => p.id === this.intervenants[index].enseignant_id);
      return this.enseignants[indexE];
    },
    totalVolume(module, type) {
      var volumeByModule = []
      for (let i = 0; i < this.volumesHebdomadaires.length; i++) {
        if(this.volumesHebdomadaires[i].element_id === module.id){
          volumeByModule.push(this.volumesHebdomadaires[i])
        }
      }
      let total = 0
      return volumeByModule.reduce((accumulator, currentValue) => {
        return (total += +currentValue[type])
      }, 0)
    },
    totalNbGroupe(module, intervenant, type) {
      var vnbGroupeByModule = []
      for (let i = 0; i < this.groupesIntervenants.length; i++) {
        if(this.groupesIntervenants[i].element_id === module.id && this.groupesIntervenants[i].intervenant_id === intervenant){
          vnbGroupeByModule.push(this.groupesIntervenants[i])
        }
      }
      let total = 0
      return vnbGroupeByModule.reduce((accumulator, currentValue) => {
        return (total += +currentValue[type])
      }, 0)
    },
    addGrpInterv(idModule, idSemestre){
      this.getIntervenantProjetNotInModule(idModule)
      this.formIntervenant = true
      this.idElement = idModule
      this.nb_semaine = this.findPeriodeBySemestre(idSemestre).nb_semaine
    },
    getIntervenantProjetNotInModule(idModule){
      axios.get('/intervenants/projets/'+ this.$route.params.id +'/module/'+ idModule +'/get')
          .then(response => (this.intervenantByProjetNotInModule = response.data))
          .catch(error => {
        console.log('Erreur : ', error)
      });
    },
    submitGrpInterv() {
      this.$v.$touch()
      if (!this.intervenant_id) return;
      this.$store.dispatch('ADD_AllGroupeIntervenantForModule', {module: this.idElement, intervenant: this.intervenant_id, nb_semaine_deb: 1, nb_semaine_fin: this.nb_semaine})
      this.closeGrpIntev()
    },
    closeGrpIntev() {
      this.formIntervenant = false
      this.getIntervenantProjetNotInModule(this.idElement)
      this.clearGrpInterv()
    },
    clearGrpInterv() {
      this.$v.$reset()
      this.idElement = ''
      this.intervenant_id = ''
      this.nb_semaine = 1
    },
  }
}
</script>

<style>
.v-expansion-panel::before {
  box-shadow: none !important;
}
.v-expansion-panel-content__wrap {
  padding: 0 0 0 0 !important;
}
.right-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.left-border {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
.top-border{
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: rgba(0, 0, 0, 0.03) !important;
  color: #353535 !important;
}
.height-row{
  max-height: 2em !important;
  min-height: 2em !important;
}
td, th, tr {
  width: 5em;
  min-width: 5em;
  max-width: 5em;
}
.icon-intervenant {
  order: 0;
}
.header-intervenant {
  order: 1;
}
</style>