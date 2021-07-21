import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state:{
    token: '',
    utilisateur: {}
  },
  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUtilisateur: state => {
      return state.utilisateur;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UTILISATEUR: (state, utilisateur) => {
      state.utilisateur = utilisateur;
    },
    RESET: state => {
      state.token = '';
      state.utilisateur = {};
      localStorage.clear();
    }
  },
  actions: {
    connexion: ({ commit, dispatch }, { token, utilisateur }) => {
      commit('SET_TOKEN', token);
      commit('SET_UTILISATEUR', utilisateur);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      localStorage.setItem('token', token);
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    },
    deconnexion: ({ commit }) => {
      commit('RESET');
    },
    initStore: ({ commit}) => {
      if (localStorage.token && localStorage.utilisateur){
        commit('SET_TOKEN', localStorage.token);
        commit('SET_UTILISATEUR', JSON.parse(localStorage.utilisateur));

        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
      }
    }
  },
  modules: {}
})
