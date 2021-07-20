import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    token: '',
    utilisateur: {}
  };
};

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
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
      state.user = utilisateur;
    },
    RESET: state => {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    connexion: ({ commit, dispatch }, { token, utilisateur }) => {
      commit('SET_TOKEN', token);
      commit('SET_UTILISATEUR', utilisateur);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    deconnexion: ({ commit }) => {
      commit('RESET', '');
    }
  },
  modules: {}
})
