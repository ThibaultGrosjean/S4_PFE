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
  },
  getters: {
    enseignants: state => {
      return state.enseignants;
    },
    statuts: state => {
      return state.statuts;
    },
  },
  mutations: {
    SET_Enseignant (state, enseignants) {
      state.enseignants = enseignants
    },
    SET_Statut (state, statuts) {
      state.statuts = statuts
    },
    DELETE_Enseignant(state, id_enseignant) {
      let index = state.enseignants.findIndex(enseignant => enseignant.id === id_enseignant);
      state.enseignants.splice(index,1)
      axios.delete('/enseignants/' + id_enseignant).catch(error => {
        console.log('Erreur : ', error)
      })
    }
  },
  actions: {
    loadEnseignants ({ commit }) {
      axios
          .get('enseignants')
          .then(response => response.data)
          .then(enseignants => {
            console.log(enseignants);
            commit('SET_Enseignant', enseignants)
          }).catch(error => {
            console.log('Erreur : ', error)
          })
    },
    loadStatuts ({ commit }) {
      axios
          .get('statuts')
          .then(response => response.data)
          .then(statuts => {
            console.log(statuts);
            commit('SET_Statut', statuts)
          }).catch(error => {
            console.log('Erreur : ', error)
          })
    },
  },
  modules: {
  }
})
