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
    elementsRoot: [],
    elements: [],
    intervenants: [],
    formations: [],
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
    elements: state => {
      return state.elements;
    },
    elementsRoot: state => {
      return state.elementsRoot;
    },
    intervenants: state => {
      return state.intervenants;
    },
    formations: state => {
      return state.formations;
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
    SET_Element(state, elements) {
      state.elements = elements
    },
    SET_ElementRoot(state, elementsRoot) {
      state.elementsRoot = elementsRoot
    },
    SET_Intervenant(state, intervenants) {
      state.intervenants = intervenants
    },
    SET_Formations(state, formations) {
      state.formations = formations
    },
    DELETE_Enseignant(state, id_enseignant) {
      let index = state.enseignants.findIndex(enseignant => enseignant.id === id_enseignant);
      state.enseignants.splice(index, 1)
      axios.delete('/enseignants/delete/' + id_enseignant).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    ADD_Enseignant(state, enseignant) {
      axios.post('/enseignants/create/', enseignant)
        .then(response => response.data)
        .then(enseignants => {
          console.log(enseignants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.enseignants.push(enseignant)
    },
    ADD_Statut(state, statut) {
      axios.post('/statuts/create/', statut)
        .then(response => response.data)
        .then(statuts => {
          console.log(statuts);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.statuts.push(statut)
    },
    ADD_Projet(state, nom) {
      axios.put('/projets/create/'+ nom)
        .then(response => response.data)
        .then(projet => {
          console.log(projet);
          const dateNow = new Date().toISOString().substr(0, 10)
          state.projets.push({id:projet.insertId, nom: nom, date:dateNow, verrou:0,archive:0})
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    ADD_Element(state, element) {
      axios.post('/elements/create/', element)
        .then(response => response.data)
        .then(elements => {
          console.log(elements);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.elements.push(element)
    },
    ADD_Intervenant(state, intervenant) {
      axios.post('/intervenants/create/', intervenant)
        .then(response => response.data)
        .then(intervenant => {
          console.log(intervenant);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.intervenants.push(intervenant)
    },
    ADD_Formations(state, formations) {
      axios.post('/formations/create/', formations)
        .then(response => response.data)
        .then(formations => {
          console.log(formations);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      state.formations.push(formations)
    },
    EDIT_Enseignant(state, enseignant) {
      axios.put('/enseignants/edit/'+enseignant.id, enseignant)
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
      axios.put('/statuts/edit/'+statut.id, statut)
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
      axios.put('/projets/edit/'+projet.id, projet)
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
      axios.put('/elements/edit/'+element.id, element)
        .then(response => response.data)
        .then(elements => {
          console.log(elements);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.elements.findIndex(e => e.id === element.id);
      state.elements[index] = element
    },
    EDIT_Intervenant(state, intervenant) {
      axios.put('/intervenants/edit/'+intervenant.id, intervenant)
        .then(response => response.data)
        .then(intervenant => {
          console.log(intervenant);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.intervenants.findIndex(i => i.id === intervenant.id);
      state.intervenants[index] = intervenant
    },
    EDIT_Formations(state, formations) {
      axios.put('/formations/edit/'+formations.id, formations)
        .then(response => response.data)
        .then(formations => {
          console.log(formations);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      let index = state.formations.findIndex(f => f.id === formations.id);
      state.formations[index] = formations
    },
  },
  actions: {
    loadEnseignants({commit}) {
      axios
        .get('enseignants/get')
        .then(response => response.data)
        .then(enseignants => {
          console.log(enseignants);
          commit('SET_Enseignant', enseignants)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadStatuts({commit}) {
      axios
        .get('statuts/get')
        .then(response => response.data)
        .then(statuts => {
          console.log(statuts);
          commit('SET_Statut', statuts)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadProjets({commit}) {
      axios
        .get('projets/get')
        .then(response => response.data)
        .then(projets => {
          console.log(projets);
          commit('SET_Projet', projets)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadElements({commit}) {
      axios
        .get('elements/get')
        .then(response => response.data)
        .then(elements => {
          console.log(elements);
          commit('SET_Element', elements)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadElementsRoot({commit}) {
      axios
        .get('/elements/get/level/'+0)
        .then(response => response.data)
        .then(elementsRoot => {
          console.log(elementsRoot);
          commit('SET_ElementRoot', elementsRoot)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadIntervenants({commit}) {
      axios
        .get('intervenants/get')
        .then(response => response.data)
        .then(intervenants => {
          console.log(intervenants);
          commit('SET_Intervenant', intervenants)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    loadFormations({commit}) {
      axios
        .get('formations/get')
        .then(response => response.data)
        .then(formations => {
          console.log(formations);
          commit('SET_Formations', formations)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
  },
  modules: {}
})
