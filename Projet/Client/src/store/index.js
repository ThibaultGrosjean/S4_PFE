import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = "http://localhost:8888/";

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
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
  },
  actions: {
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

        //TODO déplacer dans periodes.js
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
        ///
      }
    },
    ADD_AllGroupeIntervenantForModule({dispatch}, params ) {
      axios.post('/groupes-intervenants/create/module/'+ params.module + '/intervenant/'+ params.intervenant +'/nbsemaine/'+ params.nb_semaine_deb + '/' + params.nb_semaine_fin)
        .then(response => response.data)
        .then(groupesIntervenants => {
          console.log(groupesIntervenants);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      // dispatch('loadIntervenantsModules')
      // dispatch('loadGenerique', 'groupes-intervenants')
    },
    ADD_AllVolumesHebdomadairesForModule({dispatch}, params ) {
      axios.post('/volumes-hebdomadaires/create/'+ params.module + '/'+'nbsemaine/'+ params.nb_semaine_deb + '/' + params.nb_semaine_fin)
        .then(response => response.data)
        .then(response => {
          console.log(response);
        }).catch(error => {
        console.log('Erreur : ', error)
      });
      // dispatch('loadGenerique', 'volumes-hebdomadaires')
      // dispatch('loadGenerique', 'elements')
    },
    DELETE_AllVolumesHebdomadairesBySemaine({dispatch}, params) {
      axios.delete('/volumes-hebdomadaires/semestre/'+ params.semestre_id +'/nbsemaine/' + params.nb_semaine_deb + '/' + params.nb_semaine_fin + '/delete')
        .then(response => {
          console.log(response);
          this.state.volumesHebdomadaires.splice(0, this.state.volumesHebdomadaires.length)
          // dispatch('loadGenerique', 'volumes-hebdomadaires')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
    DELETE_AllGroupesIntervenantsBySemaine({dispatch}, params) {
      axios.delete('/groupes-intervenants/semestre/'+ params.semestre_id +'/nbsemaine/' + params.nb_semaine_deb + '/' + params.nb_semaine_fin + '/delete')
        .then(response => {
          console.log(response);
          this.state.groupesIntervenants.splice(0, this.state.groupesIntervenants.length)
          // dispatch('loadIntervenantsModules')
          // dispatch('loadGenerique', 'groupes-intervenants')
        }).catch(error => {
        console.log('Erreur : ', error)
      });
    },
  },
  modules: {}
})
