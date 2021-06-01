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
    elements: [],
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
          commit('SET_Elements', elements)
        }).catch(error => {
        console.log('Erreur : ', error)
      })
    },
    addEnseignant({commit}, enseignant) {
      axios.post('/enseignants/create', enseignant)
        .then(response => response.data)
        .then(enseignants => {
          this.state.enseignants.push(enseignant)
          console.log(enseignants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    }
  },
  modules: {}
})
