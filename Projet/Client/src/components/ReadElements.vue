<template>
  <v-container class="reset-width">
    <v-row v-for="f in elements" :key="f.id">
      <v-container class="reset-width" v-if="f.parent === null && f.id === formation.element_id">
        <v-row>
          <v-col cols="1" class="py-0 px-2 pb-2"></v-col>
          <v-col class="d-flex justify-center py-0 px-4 pb-2">
            <span class="text-center text-subtitle-1">{{ f.surnom }}</span>
          </v-col>
          <v-col cols="1" class="d-flex justify-end py-0 px-4 pb-2">
            <v-menu :disabled="disabled" :close-on-content-click="false" offset-x left nudge-bottom="-14" rounded="pill" transition="slide-x-reverse-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    :disabled="disabled"
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
                          @click="edit(f)"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier {{ f.surnom }}</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          class="ma-1"
                          @click="addSemester(f)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Ajouter un semestre</span>
                  </v-tooltip>
                  <SupprimerTousGrpIntervenantFormation :formation="f" v-on:relaod-all-groupes="getGroupeIntervenantByModule"/>
                  <SupprimerTousVolHorFormation :formation="f" v-on:relaod-all-volumes="reloadData"/>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="pa-0">
          <v-expansion-panels multiple accordion hover focusable flat>
            <v-expansion-panel v-for="semestre in elements" :key="semestre.id">
              <v-expansion-panel-header v-if="f.id === semestre.parent">
                <div class="ml-n3">
                  <v-menu :disabled="disabled" :close-on-content-click="false" offset-x right nudge-bottom="-14"
                          rounded="pill" transition="slide-x-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          :disabled="disabled"
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
                                @click="edit(semestre)"
                            >
                              <v-icon>edit</v-icon>
                            </v-btn>
                          </template>
                          <span>Modifier {{ semestre.titre }}</span>
                        </v-tooltip>
                        <EditPeriode :element="semestre" v-on:reload-periode="reloadData"></EditPeriode>
                        <v-tooltip top v-if="semestre.periode_id !== null">
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
                        <v-tooltip top v-if="semestre.nbfils === 0">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                class="ma-1"
                                color="error darken-1"
                                @click="remove(semestre)"
                            >
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Supprimer</span>
                        </v-tooltip>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <span class="overline ml-2">{{ semestre.titre }}</span>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="f.id === semestre.parent">

                <v-expansion-panels multiple accordion hover>
                  <v-expansion-panel v-for="ue in elements" :key="ue.id">
                    <v-expansion-panel-header v-if="semestre.id === ue.parent">
                      <div class="ml-2">
                        <v-menu :disabled="disabled" :close-on-content-click="false" offset-x right nudge-bottom="-14"
                                rounded="pill" transition="slide-x-transition">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                                :disabled="disabled"
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
                                      @click="edit(ue)"
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
                              <v-tooltip top v-if="ue.nbfils === 0">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                      icon
                                      v-bind="attrs"
                                      v-on="on"
                                      class="ma-1"
                                      color="error darken-1"
                                      @click="remove(ue)"
                                  >
                                    <v-icon>delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Supprimer</span>
                              </v-tooltip>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <span class="subtitle-1 ml-2">{{ ue.titre }}</span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content v-if="semestre.id === ue.parent">

                      <v-expansion-panels multiple accordion hover>
                        <v-expansion-panel v-for="module in elements" :key="module.id">
                          <v-expansion-panel-header v-if="ue.id === module.parent">
                            <div class="ml-7">
                              <v-menu :disabled="disabled" :close-on-content-click="false" offset-x right
                                      nudge-bottom="-14" rounded="pill" transition="slide-x-transition">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                      icon
                                      v-bind="attrs"
                                      v-on="on"
                                      :disabled="disabled"
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
                                            @click="edit(module)"
                                        >
                                          <v-icon>edit</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Modifier {{ module.surnom }}</span>
                                    </v-tooltip>
                                    <EditNbGroupeModule :element="module"/>
                                    <v-tooltip top v-if="module.nbVolHebdo === 0 && module.nbVolGlob === 0">
                                      <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            icon
                                            v-bind="attrs"
                                            v-on="on"
                                            class="ma-1"
                                            color="error darken-1"
                                            @click="remove(module)"
                                        >
                                          <v-icon>delete</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Supprimer</span>
                                    </v-tooltip>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                              <span class="subtitle-2 ml-2">{{ module.titre }}</span>
                            </div>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content v-if="ue.id === module.parent">

                            <div v-if="module.mode_saisie ==='hebdo'">
                              <div v-if="module.nbVolHebdo === 0 && module.nbVolGlob === 0">
                                <v-btn text tile block height="2.3em" :disabled="disabled" :loading="loading" @click="addVolHebdo(module.id, semestre.id)">
                                  Ajouter les volumes hebdomadaires
                                </v-btn>
                              </div>
                              <template v-for="v in volumesHebdomadairesModules">
                                <div :key="v.id" v-if="v.element_id === module.id && volumesHebdomadairesModules.length !== 0">
                                  <v-container class="reset-width">
                                    <v-row>
                                      <v-col cols="1" class="top-border pa-1 background-gray"></v-col>
                                      <v-col class="top-border d-flex justify-center pa-1 background-gray">
                                        <span class="text-subtitle-1 text-center font-weight-medium text--secondary">Volumes horaires prévus pour un étudiant</span>
                                      </v-col>
                                      <v-col cols="1" class="top-border pa-1 d-flex justify-end background-gray">
                                        <SupprimerTableau v-if="v.nbGrpInterv === 0" :type="'volumes-hebdomadaires'" :module="module" :intervenant="null" :disabled="disabled" v-on:reload-volumes-hebdomadaires-module="getVolumeHebdomadaireByModule"/>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                  <v-simple-table dense fixed-header>
                                    <template v-slot:default>
                                      <thead>
                                      <tr>
                                        <th class="text-right right-border"></th>
                                        <template v-for="v in volumesHebdomadaires">
                                          <th :key="v.id" v-if="v.element_id === module.id" class="text-center">{{ v.num_semaine }}</th>
                                        </template>
                                        <th class="text-center left-border">Total</th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                      <tr v-if="module.cm_autorises">
                                        <TDContexteMenu :lim="50" :type-cours="'cm'" :table="'volumes-hebdomadaires'" :element="module" :disabled="disabled" v-on:reload-volumes-hebdomadaires="getVolumesHebdomadaires"></TDContexteMenu>
                                        <template v-for="v in volumesHebdomadaires">
                                          <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'cm'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                        </template>
                                        <td class="left-border text-center">{{totalVolume(module, 'vol_hor_cm') }}</td>
                                      </tr>

                                      <tr v-if="module.td_autorises">
                                        <TDContexteMenu :lim="50" :type-cours="'td'" :table="'volumes-hebdomadaires'" :element="module" :disabled="disabled" v-on:reload-volumes-hebdomadaires="getVolumesHebdomadaires"></TDContexteMenu>
                                        <template v-for="v in volumesHebdomadaires">
                                          <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'td'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                        </template>
                                        <td class="left-border text-center">{{totalVolume(module, 'vol_hor_td') }}</td>
                                      </tr>

                                      <tr v-if="module.tp_autorises">
                                        <TDContexteMenu :lim="50" :type-cours="'tp'" :table="'volumes-hebdomadaires'" :element="module" :disabled="disabled" v-on:reload-volumes-hebdomadaires="getVolumesHebdomadaires"></TDContexteMenu>
                                        <template v-for="v in volumesHebdomadaires">
                                          <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'tp'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                        </template>
                                        <td class="left-border text-center">{{totalVolume(module, 'vol_hor_tp') }}
                                        </td>
                                      </tr>

                                      <tr v-if="module.partiel_autorises">
                                        <TDContexteMenu :lim="50" :type-cours="'partiel'" :table="'volumes-hebdomadaires'" :element="module" :disabled="disabled" v-on:reload-volumes-hebdomadaires="getVolumesHebdomadaires"></TDContexteMenu>
                                        <template v-for="v in volumesHebdomadaires">
                                          <TDEditValue :key="v.id" v-if="v.element_id === module.id" :type-cours="'partiel'" :data="v" :table="'volumes-hebdomadaires'" :disabled="disabled" :lim="50"/>
                                        </template>
                                        <td class="left-border text-center">{{ totalVolume(module, 'vol_hor_partiel') }}</td>
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
                                            <span v-if="!open" class="ml-2">Afficher les intervenants de {{module.surnom }}</span>
                                            <span v-else class="ml-2">Masquer les intervenants de {{module.surnom }}</span>
                                          </v-row>
                                        </template>
                                      </v-expansion-panel-header>
                                      <v-expansion-panel-content>
                                        <template v-for="i in intervenantsModules">
                                          <v-container :key="i.id" v-if="i.element_id === module.id && intervenantsModules.length !== 0" class="reset-width">
                                            <v-row>
                                              <v-col cols="1" class="top-border pa-1 background-gray"></v-col>
                                              <v-col class="top-border d-flex justify-center pa-1 background-gray">
                                                <span class="text-subtitle-1 text-center font-weight-medium text--secondary">{{i.prenom }} {{ i.nom }}</span>
                                              </v-col>
                                              <v-col cols="1" class="top-border pa-1 d-flex justify-end background-gray">
                                                <SupprimerTableau :type="'groupes-intervenants'" :module="module" :intervenant="i" :disabled="disabled" v-on:reload-groupes-intervenants-module="getGroupeIntervenantByModule"/>
                                              </v-col>
                                            </v-row>
                                          </v-container>
                                          <v-simple-table dense fixed-header :key="i.id" v-if="i.element_id === module.id">
                                            <template v-slot:default>
                                              <thead>
                                              <tr>
                                                <th class="right-border"></th>
                                                <template v-for="g in groupesIntervenants">
                                                  <th :key="g.id" v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id" class="text-center">{{ g.num_semaine }}</th>
                                                </template>
                                                <th class="text-center left-border">Total</th>
                                              </tr>
                                              </thead>
                                              <tbody>
                                              <tr v-if="module.cm_autorises">
                                                <TDContexteMenu :lim="module.nb_groupe_effectif_cm"
                                                                :type-cours="'cm'" :table="'groupes-intervenants'"
                                                                :intervenant="i.intervenant_id" :element="module"
                                                                :disabled="disabled"
                                                                v-on:reload-groupes-intervenants="getGroupesIntervenants"></TDContexteMenu>
                                                <template v-for="g in groupesIntervenants">
                                                  <TDEditValue :key="g.id"
                                                               v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id"
                                                               :lim="module.nb_groupe_effectif_cm"
                                                               :type-cours="'cm'" :data="g"
                                                               :table="'groupes-intervenants'"
                                                               :disabled="disabled"/>
                                                </template>
                                                <td class="left-border text-center">{{ totalNbGroupe(module, i.intervenant_id, 'nb_groupe_cm') }}</td>
                                              </tr>

                                              <tr v-if="module.td_autorises">
                                                <TDContexteMenu :lim="module.nb_groupe_effectif_td"
                                                                :type-cours="'td'" :table="'groupes-intervenants'"
                                                                :intervenant="i.intervenant_id" :element="module"
                                                                :disabled="disabled"
                                                                v-on:reload-groupes-intervenants="getGroupesIntervenants"></TDContexteMenu>
                                                <template v-for="g in groupesIntervenants">
                                                  <TDEditValue :key="g.id"
                                                               v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id"
                                                               :lim="module.nb_groupe_effectif_td"
                                                               :type-cours="'td'" :data="g"
                                                               :table="'groupes-intervenants'"
                                                               :disabled="disabled"/>
                                                </template>
                                                <td class="left-border text-center">
                                                  {{ totalNbGroupe(module, i.intervenant_id, 'nb_groupe_td') }}
                                                </td>
                                              </tr>

                                              <tr v-if="module.tp_autorises">
                                                <TDContexteMenu :lim="module.nb_groupe_effectif_tp"
                                                                :type-cours="'tp'" :table="'groupes-intervenants'"
                                                                :intervenant="i.intervenant_id" :element="module"
                                                                :disabled="disabled"
                                                                v-on:reload-groupes-intervenants="getGroupesIntervenants"></TDContexteMenu>
                                                <template v-for="g in groupesIntervenants">
                                                  <TDEditValue :key="g.id"
                                                               v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id"
                                                               :lim="module.nb_groupe_effectif_tp"
                                                               :type-cours="'tp'" :data="g"
                                                               :table="'groupes-intervenants'"
                                                               :disabled="disabled"/>
                                                </template>
                                                <td class="left-border text-center">{{ totalNbGroupe(module, i.intervenant_id, 'nb_groupe_tp') }}</td>
                                              </tr>

                                              <tr v-if="module.partiel_autorises">
                                                <TDContexteMenu :lim="module.nb_groupe_effectif_partiel"
                                                                :type-cours="'partiel'"
                                                                :table="'groupes-intervenants'"
                                                                :intervenant="i.intervenant_id" :element="module"
                                                                :disabled="disabled"
                                                                v-on:reload-groupes-intervenants="getGroupesIntervenants"></TDContexteMenu>
                                                <template v-for="g in groupesIntervenants">
                                                  <TDEditValue :key="g.id"
                                                               v-if="g.element_id === module.id && g.intervenant_id === i.intervenant_id"
                                                               :lim="module.nb_groupe_effectif_partiel"
                                                               :type-cours="'partiel'" :data="g"
                                                               :table="'groupes-intervenants'"
                                                               :disabled="disabled"/>
                                                </template>
                                                <td class="left-border text-center">{{totalNbGroupe(module, i.intervenant_id, 'nb_groupe_partiel') }}
                                                </td>
                                              </tr>
                                              </tbody>
                                            </template>
                                          </v-simple-table>
                                        </template>
                                        <v-divider></v-divider>
                                        <v-btn text tile block height="2.3em" :disabled="disabled" @click="addGrpInterv(module.id, semestre.id)" color="success">
                                          <v-icon class="mr-2">mdi-plus</v-icon>
                                          Ajouter des intervenants
                                        </v-btn>
                                      </v-expansion-panel-content>
                                    </v-expansion-panel>
                                  </v-expansion-panels>
                                </div>
                              </template>
                            </div>

                            <div v-if="module.mode_saisie ==='globale'">
                              <template v-for="i in volumesGlobaux">
                                <v-container :key="i.id" v-if="i.element_id === module.id" class="reset-width">
                                  <v-row>
                                    <v-col cols="1" class="top-border pa-1 background-gray"></v-col>
                                    <v-col class="top-border d-flex justify-center pa-1 background-gray">
                                      <span class="text-subtitle-1 text-center font-weight-medium text--secondary">{{i.prenom }} {{ i.nom }}</span>
                                    </v-col>
                                    <v-col cols="1" class="top-border pa-1 d-flex justify-end background-gray">
                                      <SupprimerTableau :type="'volumes-globaux'" :module="module" :intervenant="i" :disabled="disabled" v-on:reload-volumes-globaux-module="getVolumesGlobaux"/>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-simple-table dense fixed-header class="width">
                                      <template v-slot:default>
                                        <thead>
                                        <tr>
                                          <th class="text-right right-border"></th>
                                          <th class="text-center">{{ module.titre.substr(module.titre.indexOf(":") + 1) }}</th>
                                          <th class="text-center left-border">Total HeTD</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-if="i.element_id === module.id" :class="{ 'disabled-row' : !module.cm_autorises}">
                                          <TDContexteMenu :lim="50" :type-cours="'cm'" :table="'volumes-globaux'" :intervenant="null" :element="module" :disabled="disabled || !module.cm_autorises" v-on:reload-volumes-globaux="getVolumesGlobaux"></TDContexteMenu>
                                          <TDEditValue :lim="module.nb_groupe_effectif_cm" :type-cours="'cm'" :data="i" :table="'volumes-globaux'" :disabled="disabled || !module.cm_autorises" v-on:reload-data="reloadData"/>
                                          <td class="text-center left-border">{{ i.total_HeTD_cm }}</td>
                                        </tr>

                                        <tr v-if="i.element_id === module.id" :class="{ 'disabled-row' : !module.td_autorises}">
                                          <TDContexteMenu :lim="50" :type-cours="'td'" :table="'volumes-globaux'" :intervenant="null" :element="module" :disabled="disabled || !module.td_autorises" v-on:reload-volumes-globaux="getVolumesGlobaux"></TDContexteMenu>
                                          <TDEditValue :lim="module.nb_groupe_effectif_td" :type-cours="'td'" :data="i" :table="'volumes-globaux'" :disabled="disabled || !module.td_autorises" v-on:reload-data="reloadData"/>
                                          <td class="text-center left-border">{{ i.total_HeTD_td }}</td>
                                        </tr>

                                        <tr v-if="i.element_id === module.id" :class="{ 'disabled-row' : !module.tp_autorises}">
                                          <TDContexteMenu :lim="50" :type-cours="'tp'" :table="'volumes-globaux'" :intervenant="null" :element="module" :disabled="disabled || !module.tp_autorises" v-on:reload-volumes-globaux="getVolumesGlobaux"></TDContexteMenu>
                                          <TDEditValue :lim="module.nb_groupe_effectif_tp" :type-cours="'tp'" :data="i" :table="'volumes-globaux'" :disabled="disabled || !module.tp_autorises" v-on:reload-data="reloadData"/>
                                          <td class="text-center left-border">{{ i.total_HeTD_tp }}</td>
                                        </tr>

                                        <tr v-if="i.element_id === module.id" :class="{ 'disabled-row' : !module.partiel_autorises}">
                                          <TDContexteMenu :lim="50" :type-cours="'partiel'" :table="'volumes-globaux'" :intervenant="null" :element="module" :disabled="disabled || !module.partiel_autorises" v-on:reload-volumes-globaux="getVolumesGlobaux"></TDContexteMenu>
                                          <TDEditValue :lim="module.nb_groupe_effectif_td" :type-cours="'partiel'" :data="i" :table="'volumes-globaux'" :disabled="disabled || !module.partiel_autorises" v-on:reload-data="reloadData"/>
                                          <td class="text-center left-border">{{ i.total_HeTD_partiel }}</td>
                                        </tr>
                                        </tbody>
                                      </template>
                                    </v-simple-table>
                                  </v-row>
                                </v-container>
                              </template>
                              <v-divider></v-divider>
                              <v-btn text tile block height="2.3em" :disabled="disabled" @click="addVolGlob(module.id)" color="success">
                                <v-icon class="mr-2">mdi-plus</v-icon>
                                Ajouter des intervenants
                              </v-btn>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>

                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-container>
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
              <v-btn icon @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-text-field
                  v-model="element.titre"
                  :error-messages="errors.titre"
                  :counter="255"
                  label="Titre"
                  autofocus
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="element.surnom"
                  :error-messages="errors.surnom"
                  :counter="255"
                  label="Surnom"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="element.code"
                  :error-messages="errors.code"
                  :counter="255"
                  label="Code"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-if="this.methods !=='POST' && this.element.niveau > 1 || this.element.niveau === null && !this.isFormation"
                  v-model="element.niveau"
                  :error-messages="errors.niveau"
                  label="Niveau"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-if="!this.isFormation"
                  v-model="element.indice"
                  :error-messages="errors.indice"
                  label="Indice"
                  clearable
              ></v-text-field>
              <v-select
                  v-if="!this.isFormation"
                  v-model="element.mode_saisie"
                  :items="item_mode_saisie"
                  item-text="nom"
                  item-value="val"
                  label="Mode de saisie"
                  :error-messages="errors.mode_saisie"
                  clearable
              ></v-select>
              <v-select
                  v-if="!this.isFormation"
                  v-model="element.parent"
                  :items="elements"
                  clearable
                  disabled
                  hint="Laisser vide pour un élément racine"
                  persistent-hint
                  item-text="titre"
                  item-value="id"
                  label="Parent"
              ></v-select>
              <div class="ma-0 pa-0" v-if="this.element.mode_saisie && this.element.mode_saisie !== 'aucun'">
                <v-container class="mt-4">
                  <v-row class="mb-3">
                    <span class="subtitle-1">Volume horaire total prévu par le programme pour les étudiants</span>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          v-model="element.vol_hor_total_prevues_etu_cm"
                          :error-messages="errors.vol_hor_total_prevues_etu_cm"
                          label="CM"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          v-model="element.vol_hor_total_prevues_etu_td"
                          :error-messages="errors.vol_hor_total_prevues_etu_td"
                          label="TD"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          v-model="element.vol_hor_total_prevues_etu_tp"
                          :error-messages="errors.vol_hor_total_prevues_etu_tp"
                          label="TP"
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
                      <v-switch v-model="element.cm_autorises" :label="'CM'" color="success"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="element.td_autorises" :label="'TD'" color="success"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="element.tp_autorises" :label="'TP'" color="success"></v-switch>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-switch v-model="element.partiel_autorises" :label="'Partiel'" color="success"></v-switch>
                    </v-col>
                  </v-row>
                </v-container>

                <v-container v-if="this.element.mode_saisie ==='globale'">
                  <v-row>
                    <span class="subtitle-1">Forfaits horaires globaux</span>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          :disabled="!Boolean(this.element.cm_autorises)"
                          v-model="element.forfait_globale_cm"
                          :error-messages="errors.forfait_globale_cm"
                          label="CM"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          :disabled="!Boolean(this.element.td_autorises)"
                          v-model="element.forfait_globale_td"
                          :error-messages="errors.forfait_globale_td"
                          label="TD"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          :disabled="!Boolean(this.element.tp_autorises)"
                          v-model="element.forfait_globale_tp"
                          :error-messages="errors.forfait_globale_tp"
                          label="TP"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-text-field
                          :disabled="!Boolean(this.element.partiel_autorises)"
                          v-model="element.forfait_globale_partiel"
                          :error-messages="errors.forfait_globale_partiel"
                          label="Partiel"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
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
          v-model="formIntervenant"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-form ref="formulaire" lazy-validation>
            <v-card-title>
              <span class="headline">Ajouter un intervenant</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeGrpInterv">
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
                  multiple
                  chips
                  :rules="rules.selectIntervenant"
                  no-data-text="Tous les intervenants du projet sont déjà assignés au module ou aucun intervenant dans le projet"
                  required
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0 ">
                    <span>{{ item.prenom + ' ' + item.nom }}</span>
                  </v-chip>
                  <v-chip v-if="index === 1 ">
                    <span>{{ item.prenom + ' ' + item.nom }}</span>
                  </v-chip>
                  <span
                      v-if="index === 2"
                      class="grey--text text-caption"
                  >
                    (+{{ intervenant_id.length - 2 }})
                  </span>
                </template>
              </v-select>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    :loading="loading"
                    color="success darken-1"
                    text
                    @click="submitIntervenant"
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
import apiElement from "../services/API/elements";
import apiPeriode from "../services/API/periodes";
import apiVolumeHebdomadaire from "../services/API/volumes-hebdomadaires";
import apiGroupeIntervenant from "../services/API/groupes-intervenants";
import apiIntervenant from "../services/API/intervenants";
import apiVolumeGlobaux from "../services/API/volumes-globaux";

import TDContexteMenu from "./TDContexteMenu";
import EditPeriode from "./EditPeriode";
import TDEditValue from "./TDEditValue";
import EditNbGroupeModule from "./EditNbGroupeModule";
import SupprimerTableau from "./SupprimerTableau";
import SupprimerTousVolHorFormation from "./SupprimerTousVolHorFormation";
import SupprimerTousGrpIntervenantFormation from "./SupprimerTousGrpIntervenantFormation";

export default {
  name: "ReadElements",
  components: {
    SupprimerTousGrpIntervenantFormation,
    SupprimerTousVolHorFormation,
    SupprimerTableau, EditNbGroupeModule, TDEditValue, EditPeriode, TDContexteMenu
  },
  props: ['formation', 'disabled'],

  data: () => ({
    elements: [],
    volumesHebdomadaires: [],
    volumesGlobaux: [],
    groupesIntervenants: [],
    volumesHebdomadairesModules: [],
    intervenantsModules: [],
    errors: [],
    form: false,
    dialog: false,
    formIntervenant: false,
    isFormation: false,
    loading: false,
    methods: "POST",
    type: '',
    item_mode_saisie: [
      {nom: 'Aucun', val: 'aucun'},
      {nom: 'Hebdomadaire', val: 'hebdo'},
      {nom: 'Globale', val: 'globale'},
    ],
    element: {
      id: '',
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
    },

    intervenantByProjetNotInModule: [],
    intervenant_id: [],

    rules: {
      selectIntervenant: [(v) => v.length > 0 || "Veuillez sélectionner un intervenant"],
    }
  }),
  methods: {
    async getElements() {
      this.elements = await apiElement.getElements();
    },
    async getPeriodeByElementId(id) {
      return await apiPeriode.getPeriodeByElementId(id);
    },
    async getVolumeHebdomadaireByModule() {
      this.volumesHebdomadairesModules = await apiVolumeHebdomadaire.getAllVolumeHebdomadaireByModule();
      await this.getElements();
    },
    async getVolumesHebdomadaires() {
      this.volumesHebdomadaires = await apiVolumeHebdomadaire.getVolumesHebdomadaires();
    },
    async getVolumesGlobaux() {
      this.volumesGlobaux = await apiVolumeGlobaux.getVolumesGlobaux();
      await this.getElements();
    },
    async getIntervenantsForGrpIntervByProjetNotInModule(idModule) {
      this.intervenantByProjetNotInModule = await apiIntervenant.getIntervenantsForGrpIntervByProjetNotInModule(this.$route.params.id, idModule)
    },
    async getIntervenantsForVolGlobByProjetNotInModule(idModule) {
      this.intervenantByProjetNotInModule = await apiIntervenant.getIntervenantsForVolGlobByProjetNotInModule(this.$route.params.id, idModule)
    },
    async getGroupeIntervenantByModule() {
      this.intervenantsModules = await apiGroupeIntervenant.getAllGroupeIntervenantByModule();
      await this.getVolumeHebdomadaireByModule();
    },
    async getGroupesIntervenants() {
      this.groupesIntervenants = await apiGroupeIntervenant.getGroupesIntervenants();
    },
    async reloadData() {
      await this.getVolumeHebdomadaireByModule();
      await this.getVolumesHebdomadaires();
      await this.getGroupeIntervenantByModule();
      await this.getGroupesIntervenants();
      await this.getVolumesGlobaux();
      await this.getElements();
    },
    async submit() {
      this.loading = true;
      if (this.methods === 'POST') {
        const res = await apiElement.createElement(this.element);
        if (res.errors) {
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.$emit('edit-element', {typeOperaion: 'ajouté', element: this.element.titre});
          this.loading = false;
          this.form = false;
          await this.clear();
        }
      } else {
        const res = await apiElement.editElement(this.element);
        if (res.errors) {
          this.loading = false;
          this.errors = res.errors;
        } else {
          this.$emit('edit-element', {typeOperaion: 'modifié', element: this.element.titre});
          this.loading = false;
          this.form = false;
          await this.clear();
        }
      }
    },
    async clear() {
      this.element = {
        id: '',
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
      };
      this.methods = 'POST';
      this.errors = [];
      await this.reloadData();
    },
    close() {
      this.form = false;
      this.clear();
    },
    async edit(element) {
      this.methods = 'PUT';
      this.element = element;
      this.isFormation = this.parent === null;
      this.form = true;
    },
    addSemester(element) {
      this.methods = 'POST';
      var nbfils = element.nbfils;
      if (nbfils === null) nbfils = 0;
      this.element.titre = "Semestre " + (nbfils + 1);
      this.element.surnom = "S" + (nbfils + 1);
      this.element.niveau = 1;
      this.element.mode_saisie = 'aucun';
      this.element.indice = nbfils;
      this.element.parent = element.id;
      this.isFormation = false;
      this.form = true;
    },
    async addUE(element) {
      this.methods = 'POST';
      var indice = element.indice;
      var nbfils = element.nbfils;
      if (nbfils === null) nbfils = 0;
      this.element.titre = "UE " + (indice + 1) + (nbfils + 1) + " : ";
      this.element.surnom = "UE" + (indice + 1) + (nbfils + 1);
      this.element.niveau = 2;
      this.element.mode_saisie = 'aucun';
      this.element.indice = nbfils;
      this.element.parent = element.id;
      var periode = await this.getPeriodeByElementId(element.id);
      if (periode !== -1 && periode !== undefined) {
        this.element.nb_groupe_effectif_cm = periode[0].nb_groupe_defaut_cm;
        this.element.nb_groupe_effectif_td = periode[0].nb_groupe_defaut_td;
        this.element.nb_groupe_effectif_tp = periode[0].nb_groupe_defaut_tp;
        this.element.nb_groupe_effectif_partiel = periode[0].nb_groupe_defaut_partiel;
      }
      this.isFormation = false;
      this.form = true;
    },
    async addModule(element, semestre) {
      this.methods = 'POST';
      var indice = element.indice;
      var indiceM = semestre.indice;
      var nbfils = element.nbfils;
      if (nbfils === null) nbfils = 0;
      if (nbfils + 1 < 10) {
        this.element.titre = "M " + (indiceM + 1) + (indice + 1) + 0 + (nbfils + 1) + " : ";
        this.element.surnom = "M" + (indiceM + 1) + (indice + 1) + 0 + (nbfils + 1);
      } else {
        this.element.titre = "M " + (indiceM + 1) + (indice + 1) + (nbfils + 1) + " : ";
        this.element.surnom = "M" + (indiceM + 1) + (indice + 1) + (nbfils + 1);
      }
      this.element.niveau = 3;
      this.element.indice = nbfils;
      this.element.parent = element.id;
      const periode = await this.getPeriodeByElementId(semestre.id);
      if (periode !== -1 && periode !== undefined) {
        this.element.nb_groupe_effectif_cm = periode[0].nb_groupe_defaut_cm;
        this.element.nb_groupe_effectif_td = periode[0].nb_groupe_defaut_td;
        this.element.nb_groupe_effectif_tp = periode[0].nb_groupe_defaut_tp;
        this.element.nb_groupe_effectif_partiel = periode[0].nb_groupe_defaut_partiel;
      }
      this.isFormation = false;
      this.form = true;
    },
    async remove(element) {
      this.loading = true;
      await apiElement.deleteElement(element);
      await this.getElements();
      this.loading = false;
      this.$emit('edit-element', {typeOperaion: 'supprimé', element: element.titre});
    },
    totalVolume(module, type) {
      var volumeByModule = [];
      for (let i = 0; i < this.volumesHebdomadaires.length; i++) {
        if (this.volumesHebdomadaires[i].element_id === module.id) {
          volumeByModule.push(this.volumesHebdomadaires[i]);
        }
      }
      let total = 0
      return volumeByModule.reduce((accumulator, currentValue) => {
        return (total += +currentValue[type])
      }, 0)
    },
    totalNbGroupe(module, intervenant, type) {
      var vnbGroupeByModule = [];
      for (let i = 0; i < this.groupesIntervenants.length; i++) {
        if (this.groupesIntervenants[i].element_id === module.id && this.groupesIntervenants[i].intervenant_id === intervenant) {
          vnbGroupeByModule.push(this.groupesIntervenants[i]);
        }
      }
      let total = 0
      return vnbGroupeByModule.reduce((accumulator, currentValue) => {
        return (total += +currentValue[type])
      }, 0)
    },
    async addVolHebdo(module_id, semestre_id) {
      const periode = await this.getPeriodeByElementId(semestre_id);
      var nb_semaine = periode[0].nb_semaine;

      this.loading = true;
      await apiVolumeHebdomadaire.createVolumeHebdomadaireBySemaine(module_id, 1, nb_semaine);
      await this.getVolumeHebdomadaireByModule();
      await this.getVolumesHebdomadaires();
      await this.getElements();
      this.loading = false;
    },
    async addGrpInterv(idModule, idSemestre) {
      this.type = 'grpInterv';
      await this.getIntervenantsForGrpIntervByProjetNotInModule(idModule);
      this.formIntervenant = true;
      this.idElement = idModule;
      const periode = await this.getPeriodeByElementId(idSemestre);
      this.nb_semaine = periode[0].nb_semaine;
      await this.getElements();
    },
    async addVolGlob(idModule) {
      this.type = 'volGlob';
      await this.getIntervenantsForVolGlobByProjetNotInModule(idModule);
      this.formIntervenant = true;
      this.idElement = idModule;
      await this.getElements();
    },
    async submitIntervenant() {
      this.$refs.formulaire.validate();
      if (this.intervenant_id.length <= 0) {
        return;
      } else {
        this.loading = true;
        for (let i = 0; i < this.intervenant_id.length; i++) {
          if (this.type === 'grpInterv') {
            await apiGroupeIntervenant.createGroupeIntervenantBySemaine(this.idElement, this.intervenant_id[i], 1, this.nb_semaine);
          }
          if (this.type === 'volGlob') {
            await apiVolumeGlobaux.createVolumeGlobauxByModule(this.idElement, this.intervenant_id[i]);
          }
        }
      }
      await this.reloadData();
      this.loading = false;
      if (this.type === 'grpInterv') await this.getIntervenantsForGrpIntervByProjetNotInModule(this.idElement);
      if (this.type === 'volGlob') await this.getIntervenantsForVolGlobByProjetNotInModule(this.idElement);
      this.closeGrpInterv();
    },
    clearGrpInterv() {
      this.$refs.formulaire.resetValidation();
      this.idElement = '';
      this.intervenant_id = [];
      this.nb_semaine = 1;
      this.type = '';
    },
    closeGrpInterv() {
      this.formIntervenant = false;
      this.clearGrpInterv();
    },
  },

  mounted() {
    this.getGroupeIntervenantByModule();
    this.getGroupesIntervenants();
    this.getVolumeHebdomadaireByModule();
    this.getVolumesHebdomadaires();
    this.getVolumesGlobaux();
    this.getElements();
  },
}
</script>

<style>
.reset-width {
  max-width: none !important;
}

.v-expansion-panel-header {
  padding-right: 22px !important;
  padding-left: 28px !important;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}

.v-expansion-panel-content__wrap {
  padding: 0 0 0 0 !important;
}

thead th {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.background-gray {
  background-color: rgba(0, 0, 0, 0.10) !important;
}

.right-border {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.left-border {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  width: 5em !important;
  min-width: 5em !important;
  max-width: 5em !important;
}

.top-border {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.disabled-row {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

.height-row {
  max-height: 2em !important;
  min-height: 2em !important;
}

.icon-intervenant {
  order: 0;
}

.header-intervenant {
  order: 1;
}

.width {
  width: 100% !important;
}

.theme--dark.v-expansion-panels.v-expansion-panels--focusable .v-expansion-panel-header--active:hover::before, .theme--dark.v-expansion-panels.v-expansion-panels--focusable .v-expansion-panel-header--active::before {
  opacity: 0.08 !important;
}

td, th {
  width: 4em !important;
  min-width: 4em !important;
  max-width: 4em !important;
}
</style>