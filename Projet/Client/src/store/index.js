import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = "http://localhost:8888/";

export default new Vuex.Store({
  state: {
    enseignants: [],
    statuts: [],
    projets: [],
    projetsArchive: [],
    elementsLevel: [],
    elements: [],
    intervenants: [],
    intervenantsByProjet: [],
    intervenantsModules: [],
    formations: [],
    formationsByProjet: [],
    periodes: [],
    volumesHebdomadaires: [],
    volumesHebdomadairesModules: [],
    volumesGlobaux: [],
    groupesIntervenants: [],
  },
  getters: {
    enseignants: state => {
      return state.enseignants;
    },
    statuts: state => {
      return state.statuts;
    },
    projets: state => {
      return state.projets;
    },
    projetsArchive: state => {
      return state.projetsArchive;
    },
    elements: state => {
      return state.elements;
    },
    elementsLevel: state => {
      return state.elementsLevel;
    },
    intervenants: state => {
      return state.intervenants;
    },
    intervenantsByProjet: state => {
      return state.intervenantsByProjet;
    },
    formations: state => {
      return state.formations;
    },
    formationsByProjet: state => {
      return state.formationsByProjet;
    },
    periodes: state => {
      return state.periodes;
    },
    volumesHebdomadaires: state => {
      return state.volumesHebdomadaires;
    },
    volumesGlobaux: state => {
      return state.volumesGlobaux;
    },
    groupesIntervenants: state => {
      return state.groupesIntervenants;
    },
    intervenantsModules: state => {
      return state.intervenantsModules;
    },
    volumesHebdomadairesModules: state => {
      return state.volumesHebdomadairesModules;
    },
  },
  mutations: {
    SET_Enseignant(state, enseignants) {
      state.enseignants = enseignants
    },
    SET_Statut(state, statuts) {
      state.statuts = statuts
    },
    SET_Projet(state, projets) {
      state.projets = projets
    },
    SET_Projet_archive(state, projetsArchive) {
      state.projetsArchive = projetsArchive
    },
    SET_Element(state, elements) {
      state.elements = elements
    },
    SET_ElementLevel(state, elementsLevel) {
      state.elementsLevel = elementsLevel
    },
    SET_Intervenant(state, intervenants) {
      state.intervenants = intervenants
    },
    SET_IntervenantsByProjet(state, intervenantsByProjet) {
      state.intervenantsByProjet = intervenantsByProjet
    },
    SET_Formations(state, formations) {
      state.formations = formations
    },
    SET_FormationsByProjet(state, formationsByProjet) {
      state.formationsByProjet = formationsByProjet
    },
    SET_Periodes(state, periodes) {
      state.periodes = periodes
    },
    SET_VolumesHebdomadaires(state, volumesHebdomadaires) {
      state.volumesHebdomadaires = volumesHebdomadaires
    },
    SET_VolumesGlobaux(state, volumesGlobaux) {
      state.volumesGlobaux = volumesGlobaux
    },
    SET_GroupesIntervenants(state, groupesIntervenants) {
      state.groupesIntervenants = groupesIntervenants
    },
    SET_IntervenantsModules(state, intervenantsModules) {
      state.intervenantsModules = intervenantsModules
    },
    SET_VolumesHebdomadairesModules(state, volumesHebdomadairesModules) {
      state.volumesHebdomadairesModules = volumesHebdomadairesModules
    },
    SET_ValeurTtesSem(state, objs){
      var url = '/'+ objs.tab +'/edit/'+objs.value+'/elements/'+objs.element+'/'+objs.typeCours
      if (objs.tab === 'volumes-globaux' || objs.tab === 'groupes-intervenants') {
        url = url + '/intervenant/' + objs.intervenant
      }
      axios.put(url)
        .then(response => response.data)
        .then(response => {
          console.log(response);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      if (objs.tab === 'volumes-hebdomadaires') {
        for (let i = 0; i < state.volumesHebdomadaires.length; i++) {
          if(state.volumesHebdomadaires[i].element_id === objs.element){
            switch(objs.typeCours) {
              case 'cm':
                state.volumesHebdomadaires[i].vol_hor_cm = objs.value
                break;
              case 'td':
                state.volumesHebdomadaires[i].vol_hor_td = objs.value
                break;
              case 'tp':
                state.volumesHebdomadaires[i].vol_hor_tp = objs.value
                break;
              case 'partiel':
                state.volumesHebdomadaires[i].vol_hor_partiel = objs.value
                break;
              default:
            }
          }
        }
      }
      if (objs.tab === 'groupes-intervenants') {
        for (let i = 0; i < state.groupesIntervenants.length; i++) {
          if(state.groupesIntervenants[i].element_id === objs.element && state.groupesIntervenants[i].intervenant_id === objs.intervenant){
            switch(objs.typeCours) {
              case 'cm':
                state.groupesIntervenants[i].nb_groupe_cm = objs.value
                break;
              case 'td':
                state.groupesIntervenants[i].nb_groupe_td = objs.value
                break;
              case 'tp':
                state.groupesIntervenants[i].nb_groupe_tp = objs.value
                break;
              case 'partiel':
                state.groupesIntervenants[i].nb_groupe_partiel = objs.value
                break;
              default:
            }
          }
        }
      }
      if (objs.tab === 'volumes-globaux') {
        for (let i = 0; i < state.volumesGlobaux.length; i++) {
          if(state.volumesGlobaux[i].element_id === objs.element && state.volumesGlobaux[i].intervenant_id === objs.intervenant){
            switch(objs.typeCours) {
              case 'cm':
                state.volumesGlobaux[i].vol_hor_cm = objs.value
                break;
              case 'td':
                state.volumesGlobaux[i].vol_hor_td = objs.value
                break;
              case 'tp':
                state.volumesGlobaux[i].vol_hor_tp = objs.value
                break;
              case 'partiel':
                state.volumesGlobaux[i].vol_hor_partiel = objs.value
                break;
              default:
            }
          }
        }
      }

    },
    DELETE_Enseignant(state, id_enseignant) {
      let index = state.enseignants.findIndex(enseignant => enseignant.id === id_enseignant);
      state.enseignants.splice(index, 1)
      axios.delete('/enseignants/delete/' + id_enseignant).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    DELETE_VolumesHebdomadaires(state, id_volumeHebdo) {
      axios.delete('/volumes-hebdomadaires/delete/' + id_volumeHebdo).catch(error => {
        console.log('Erreur : ', error)
      })
      let index = state.volumesHebdomadaires.findIndex(volumeHebdo => volumeHebdo.id === id_volumeHebdo);
      state.volumesHebdomadaires.splice(index, 1)
    },
    DELETE_VolumeGlobaux(state, id_volumeGlobale) {
      let index = state.volumesGlobaux.findIndex(volumeGlobale => volumeGlobale.id === id_volumeGlobale);
      state.volumesGlobaux.splice(index, 1)
      axios.delete('/volumes-globaux/delete/' + id_volumeGlobale).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    DELETE_GroupesIntervenants(state, id_groupeIntervenant) {
      let index = state.groupesIntervenants.findIndex(groupeIntervenant => groupeIntervenant.id === id_groupeIntervenant);
      state.groupesIntervenants.splice(index, 1)
      axios.delete('/groupes-intervenants/delete/' + id_groupeIntervenant).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    ADD_Enseignant(state, enseignant) {
      axios.post('/enseignants/create/', enseignant)
        .then(response => response.data)
        .then(response => {
          enseignant.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.enseignants.push(enseignant)
    },
    ADD_Statut(state, statut) {
      axios.post('/statuts/create/', statut)
        .then(response => response.data)
        .then(response => {
          statut.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.statuts.push(statut)
    },
    ADD_Projet(state, nom) {
      axios.put('/projets/create/' + nom)
        .then(response => response.data)
        .then(response => {
          const dateNow = new Date().toISOString().substr(0, 10)
          state.projets.push({id: response.insertId, nom: nom, date: dateNow, verrou: 0, archive: 0})
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    ADD_Intervenant(state, intervenant) {
      axios.post('/intervenants/create/', intervenant)
        .then(response => response.data)
        .then(response => {
          intervenant.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.intervenants.push(intervenant)
      state.intervenantsByProjet.push(intervenant)
    },
    ADD_Formation(state, formation) {
      axios.post('/formations/create/', formation)
        .then(response => response.data)
        .then(response => {
          formation.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.formations.push(formation)
      state.formationsByProjet.push(formation)
    },
    ADD_Periodes(state, periode) {
      axios.post('/periodes/create/', periode)
        .then(response => response.data)
        .then(response => {
          periode.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.periodes.push(periode)
    },
    ADD_VolumesHebdomadaires(state, volumesHebdomadaires) {
      axios.post('/volumes-hebdomadaires/create/', volumesHebdomadaires)
        .then(response => response.data)
        .then(response => {
          volumesHebdomadaires.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.volumesHebdomadaires.push(volumesHebdomadaires)
    },
    ADD_VolumesGlobaux(state, volumesGlobaux) {
      axios.post('/volumes-globaux/create/', volumesGlobaux)
        .then(response => response.data)
        .then(response => {
          volumesGlobaux.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.volumesGlobaux.push(volumesGlobaux)
    },
    ADD_GroupesIntervenants(state, groupesIntervenants) {
      axios.post('/groupes-intervenants/create/', groupesIntervenants)
        .then(response => response.data)
        .then(response => {
          groupesIntervenants.id = response.insertId
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.groupesIntervenants.push(groupesIntervenants)
    },
    EDIT_Enseignant(state, enseignant) {
      axios.put('/enseignants/edit/' + enseignant.id, enseignant)
        .then(response => response.data)
        .then(enseignants => {
          console.log(enseignants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.enseignants.findIndex(e => e.id === enseignant.id);
      state.enseignants[index] = enseignant
    },
    EDIT_Statut(state, statut) {
      axios.put('/statuts/edit/' + statut.id, statut)
        .then(response => response.data)
        .then(statuts => {
          console.log(statuts);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.statuts.findIndex(e => e.id === statut.id);
      state.statuts[index] = statut
    },
    EDIT_Projet(state, projet) {
      axios.put('/projets/edit/' + projet.id, projet)
        .then(response => response.data)
        .then(projet => {
          console.log(projet);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.projets.findIndex(e => e.id === projet.id);
      state.projets[index] = projet
    },
    EDIT_Element(state, element) {
      axios.put('/elements/edit/' + element.id, element)
        .then(response => response.data)
        .then(elements => {
          console.log(elements);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.elements.findIndex(e => e.id === element.id);
      state.elements[index].titre = element.titre
      state.elements[index].surnom = element.surnom
      state.elements[index].code = element.code
    },
    EDIT_Intervenant(state, intervenant) {
      axios.put('/intervenants/edit/' + intervenant.id, intervenant)
        .then(response => response.data)
        .then(intervenant => {
          console.log(intervenant);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.intervenants.findIndex(i => i.id === intervenant.id);
      state.intervenants[index] = intervenant
      let indexP = state.intervenantsByProjet.findIndex(i => i.id === intervenant.id);
      state.intervenantsByProjet[indexP] = intervenant
    },
    EDIT_Formations(state, formations) {
      axios.put('/formations/edit/' + formations.id, formations)
        .then(response => response.data)
        .then(formations => {
          console.log(formations);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.formations.findIndex(f => f.id === formations.id);
      state.formations[index] = formations
    },
    EDIT_VolumesGlobaux(state, volumesGlobaux) {
      axios.put('/volumes-globaux/edit/' + volumesGlobaux.id, volumesGlobaux)
        .then(response => response.data)
        .then(volumesGlobaux => {
          console.log(volumesGlobaux);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.volumesGlobaux.findIndex(p => p.id === volumesGlobaux.id);
      state.volumesGlobaux[index] = volumesGlobaux
    },
    EDIT_GroupesIntervenants(state, groupesIntervenants) {
      axios.put('/groupes-intervenants/edit/' + groupesIntervenants.id, groupesIntervenants)
        .then(response => response.data)
        .then(groupesIntervenants => {
          console.log(groupesIntervenants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.groupesIntervenants.findIndex(g => g.id === groupesIntervenants.id);
      state.groupesIntervenants[index] = groupesIntervenants
    },
    COPY_Enseignant(state, id_enseignant) {
      axios.post('/enseignants/copy/' + id_enseignant)
        .then(response => response.data)
        .then(enseignant => {
          let index = state.enseignants.findIndex(s => s.id === id_enseignant);
          var copy =  Object.assign({}, state.enseignants[index])
          copy.id = enseignant.insertId
          copy.nom = copy.nom + " (copie)";
          state.enseignants.push(copy)
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    COPY_VolumeHebdomadaire(state, id_volumeHebdomadaire) {
      axios.post('/volumes-hebdomadaires/copy/' + id_volumeHebdomadaire)
        .then(response => response.data)
        .then(volumeHebdomadaire => {
          let index = state.volumesHebdomadaires.findIndex(v => v.id === id_volumeHebdomadaire);
          var copy =  Object.assign({}, state.volumesHebdomadaires[index])
          copy.id = volumeHebdomadaire.insertId
          copy.num_semaine = parseInt(copy.num_semaine)+1
          state.volumesHebdomadaires.push(copy)
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    COPY_VolumesGlobaux(state, id_volumesGlobaux) {
      axios.post('/volumes-globaux/copy/' + id_volumesGlobaux)
        .then(response => response.data)
        .then(volumesGlobaux => {
          let index = state.volumesGlobaux.findIndex(v => v.id === id_volumesGlobaux);
          var copy =  Object.assign({}, state.volumesGlobaux[index])
          copy.id = volumesGlobaux.insertId
          copy.num_semaine = parseInt(copy.num_semaine)+1
          state.volumesGlobaux.push(copy)
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    COPY_GroupeIntervenant(state, i_groupeIntervenant) {
      axios.post('/groupes-intervenants/copy/' + i_groupeIntervenant)
        .then(response => response.data)
        .then(groupeIntervenant => {
          let index = state.groupesIntervenants.findIndex(v => v.id === i_groupeIntervenant);
          var copy =  Object.assign({}, state.groupesIntervenants[index])
          copy.id = groupeIntervenant.insertId
          copy.num_semaine = parseInt(copy.num_semaine)+1
          state.groupesIntervenants.push(copy)
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    COPY_Statut(state, id_statut) {
      axios.post('/statuts/copy/' + id_statut)
        .then(response => response.data)
        .then(statut => {
          let index = state.statuts.findIndex(s => s.id === id_statut);
          var copy =  Object.assign({}, state.statuts[index])
          copy.id = statut.insertId
          copy.nom = copy.nom + " (copie)";
          state.statuts.push(copy)
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
  },
  actions: {
    loadProjetsNonArchive({commit}) {
      axios.get('projets/non-archive/get')
        .then(response => response.data)
        .then(projetsArchive => {
          commit('SET_Projet_archive', projetsArchive)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadFormationProjet({commit}, id) {
      axios.get('/formations/projets/get/'+id)
        .then(response => response.data)
        .then(formationProjet => {
          commit('SET_FormationsByProjet', formationProjet)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadIntervenantsProjet({commit}, id) {
      axios.get('/intervenants/projets/get/'+id)
        .then(response => response.data)
        .then(intervenantsProjet => {
          commit('SET_IntervenantsByProjet', intervenantsProjet)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadElementsLevel({commit}, level) {
      axios.get('/elements/get/level/' + level)
        .then(response => response.data)
        .then(elementsLevel => {
          commit('SET_ElementLevel', elementsLevel)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadIntervenantsModules({commit}) {
      axios.get('/groupes-intervenants/module/get')
        .then(response => response.data)
        .then(intervenantGroupe => {
          commit('SET_IntervenantsModules', intervenantGroupe)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadVolumesHorairesByModule({commit}) {
      axios.get('/volumes-hebdomadaires/module/get')
        .then(response => response.data)
        .then(volumeHebdomadaire => {
          commit('SET_VolumesHebdomadairesModules', volumeHebdomadaire)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadGenerique({commit}, table) {
      axios.get(table + '/get')
        .then(response => response.data)
        .then(response => {
          switch (table) {
            case 'enseignants':
              commit('SET_Enseignant', response);
              break;
            case 'statuts':
              commit('SET_Statut', response);
              break;
            case 'projets':
              commit('SET_Projet', response);
              break;
            case 'elements':
              commit('SET_Element', response);
              break;
            case 'intervenants':
              commit('SET_Intervenant', response);
              break;
            case 'formations':
              commit('SET_Formations', response);
              break;
            case 'periodes':
              commit('SET_Periodes', response);
              break;
            case 'volumes-hebdomadaires':
              commit('SET_VolumesHebdomadaires', response);
              break;
            case 'volumes-globaux':
              commit('SET_VolumesGlobaux', response);
              break;
            case 'groupes-intervenants':
              commit('SET_GroupesIntervenants', response);
              break;
            default:
          }
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    ADD_Element({commit, dispatch}, element) {
      axios.post('/elements/create/', element)
        .then(response => response.data)
        .then(elements => {
          element.id = elements.insertId
          this.state.elements.push(element)

          let index = this.state.elements.findIndex(e => e.id === element.parent);
          if (this.state.elements[index]) this.state.elements[index].nbfils += 1

          if (element.niveau === 1) {
            element.periode.element_id = element.id;
            commit('ADD_Periodes',  element.periode)
          }

          if (element.niveau === 3){
            if (element.mode_saisie === 'hebdo'){
              dispatch('ADD_AllVolumesHebdomadairesForModule', {module: element.id, nb_semaine_deb: 1, nb_semaine_fin: element.periode.nb_semaine})
            } else if (element.mode_saisie === 'globale'){
              console.log("mode de saisie gloable")
            }
          }

        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    EDIT_Periodes({commit, dispatch}, periode) {
      axios.put('/periodes/edit/' + periode.id, periode)
        .then(response => response.data)
        .then(periodes => {
          console.log(periodes);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = this.state.periodes.findIndex(p => p.id === periode.id);
      this.state.periodes[index] = periode

      var diff = periode.nb_semaine - periode.old_nb_semaine

      if (diff < 0 ){
        dispatch('DELETE_AllVolumesHebdomadairesBySemaine', {semestre_id: periode.element_id, nb_semaine_deb: periode.nb_semaine, nb_semaine_fin: periode.old_nb_semaine})
        dispatch('DELETE_AllGroupesIntervenantsBySemaine', {semestre_id: periode.element_id, nb_semaine_deb: periode.nb_semaine, nb_semaine_fin: periode.old_nb_semaine})
      }
      else if (diff > 0){
        var toAddVolHebdo = this.state.volumesHebdomadaires.filter(e => (e.semestre_id === periode.element_id && e.num_semaine === periode.old_nb_semaine));
        for (let i = 0; i < toAddVolHebdo.length ; i++) {
          dispatch('ADD_AllVolumesHebdomadairesForModule', {module: toAddVolHebdo[i].element_id, nb_semaine_deb: periode.old_nb_semaine +1, nb_semaine_fin: periode.nb_semaine})
        }

        var toAddGrpInterv = this.state.groupesIntervenants.filter(e => (e.semestre_id === periode.element_id && e.num_semaine === periode.old_nb_semaine));
        for (let i = 0; i < toAddGrpInterv.length ; i++) {
          dispatch('ADD_AllGroupeIntervenantForModule', {module: toAddGrpInterv[i].element_id, intervenant: toAddGrpInterv[i].intervenant_id, nb_semaine_deb: periode.old_nb_semaine +1, nb_semaine_fin: periode.nb_semaine})
        }
      }
    },
    EDIT_VolumesHebdomadaires({dispatch}, volumesHebdomadaires) {
      axios.put('/volumes-hebdomadaires/edit/' + volumesHebdomadaires.id, volumesHebdomadaires)
        .then(response => response.data)
        .then(volumesHebdomadaires => {
          console.log(volumesHebdomadaires);
          dispatch('loadVolumesHorairesByModule')
          dispatch('loadGenerique', 'volumes-hebdomadaires')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    EDIT_GroupeIntervenant({dispatch}, groupeIntervenant) {
      axios.put('/groupes-intervenants/edit/' + groupeIntervenant.id, groupeIntervenant)
        .then(response => response.data)
        .then(groupesIntervenants => {
          console.log(groupesIntervenants);
          dispatch('loadGenerique', 'groupes-intervenants')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    EDIT_VolumesGlobaux({dispatch}, volumeGlobale) {
      axios.put('/volumes-globaux/edit/' + volumeGlobale.id, volumeGlobale)
        .then(response => response.data)
        .then(volumesGlobaux => {
          console.log(volumesGlobaux);
          dispatch('loadGenerique', 'volumes-globaux')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    ADD_AllGroupeIntervenantForModule({dispatch}, params ) {
      axios.post('/groupes-intervenants/create/module/'+ params.module + '/intervenant/'+ params.intervenant +'/nbsemaine/'+ params.nb_semaine_deb + '/' + params.nb_semaine_fin)
        .then(response => response.data)
        .then(groupesIntervenants => {
          console.log(groupesIntervenants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      dispatch('loadIntervenantsModules')
      dispatch('loadGenerique', 'groupes-intervenants')
      dispatch('loadVolumesHorairesByModule') // reload nbGrpInterv pour savoir si il reste des groupes intervenant et masquer la suppression des volumes hebdos
    },
    ADD_AllVolumesHebdomadairesForModule({dispatch}, params ) {
      axios.post('/volumes-hebdomadaires/create/'+ params.module + '/'+'nbsemaine/'+ params.nb_semaine_deb + '/' + params.nb_semaine_fin)
        .then(response => response.data)
        .then(response => {
          console.log(response);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      dispatch('loadVolumesHorairesByModule')
      dispatch('loadGenerique', 'volumes-hebdomadaires')
      dispatch('loadGenerique', 'elements')
    },
    DELETE_AllGroupeIntervenant({commit, dispatch}, params ) {
      axios.delete('/groupes-intervenants/delete/element/'+ params.element_id +'/intervenant/' + params.intervenant_id)
        .then(groupesIntervenants => {
          console.log(groupesIntervenants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      var toDelete = this.state.groupesIntervenants.filter(e => (e.intervenant_id === params.intervenant_id && e.element_id === params.element_id))
      for (let j = 0; j < toDelete.length; j++) this.state.groupesIntervenants.splice(toDelete[j])

      dispatch('loadIntervenantsModules')
      dispatch('loadGenerique', 'groupes-intervenants')
      dispatch('loadVolumesHorairesByModule')  // reload nbGrpInterv pour savoir si il reste des groupes intervenant et masquer la suppression des volumes hebdos
    },
    DELETE_AllVolumesHebdomadaires({commit, dispatch}, element_id ) {
      axios.delete('/volumes-hebdomadaires/delete/element/'+ element_id)
        .then(volumesHebdomadaires => {
          console.log(volumesHebdomadaires);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      var toDelete = this.state.volumesHebdomadaires.filter(e => (e.element_id === element_id))
      for (let j = 0; j < toDelete.length; j++) this.state.volumesHebdomadaires.splice(toDelete[j])

      dispatch('loadVolumesHorairesByModule')
      dispatch('loadGenerique', 'volumes-hebdomadaires')
      dispatch('loadGenerique', 'elements')
    },
    ADD_FormationsElement({commit, dispatch}, data) {
      axios.post('/elements/create/', data.element)
        .then(response => response.data)
        .then(elements => {
          data.element.id = elements.insertId
          this.state.elements.push(data.element)
          const formation = {
            verrou: Number(false),
            projet_id: data.projet_id,
            element_id: elements.insertId,
          }
          commit('ADD_Formation', formation)
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    DELETE_AllVolumesHebdomadairesBySemaine({dispatch}, params) {
      axios.delete('/volumes-hebdomadaires/semestre/'+ params.semestre_id +'/nbsemaine/' + params.nb_semaine_deb + '/' + params.nb_semaine_fin + '/delete')
        .then(response => {
          console.log(response);
          this.state.volumesHebdomadaires.splice(0, this.state.volumesHebdomadaires.length)
          dispatch('loadVolumesHorairesByModule')
          dispatch('loadGenerique', 'volumes-hebdomadaires')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    DELETE_AllGroupesIntervenantsBySemaine({dispatch}, params) {
      axios.delete('/groupes-intervenants/semestre/'+ params.semestre_id +'/nbsemaine/' + params.nb_semaine_deb + '/' + params.nb_semaine_fin + '/delete')
        .then(response => {
          console.log(response);
          this.state.groupesIntervenants.splice(0, this.state.groupesIntervenants.length)
          dispatch('loadIntervenantsModules')
          dispatch('loadGenerique', 'groupes-intervenants')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    DELETE_AllVolumesHebdomadairesByFormation({dispatch}, id_racine) {
      axios.delete('/volumes-hebdomadaires/formation/'+ id_racine +'/delete')
        .then(response => {
          console.log(response);
          this.state.volumesHebdomadaires.splice(0, this.state.volumesHebdomadaires.length)
          dispatch('loadVolumesHorairesByModule')
          dispatch('loadGenerique', 'volumes-hebdomadaires')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    DELETE_AllGroupesIntervenantsByFormation({dispatch}, id_racine) {
      axios.delete('/groupes-intervenants/formation/'+ id_racine +'/delete')
        .then(response => {
          console.log(response);
          this.state.groupesIntervenants.splice(0, this.state.groupesIntervenants.length)
          dispatch('loadIntervenantsModules')
          dispatch('loadGenerique', 'groupes-intervenants')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
  },
  modules: {}
})
