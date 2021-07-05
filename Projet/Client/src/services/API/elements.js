import axios from "axios";
import apiPeriode from "./periodes";
import apiVolumeHebdomadaire from "./volumes-hebdomadaires";

const apiElement = {
  async getElements() {
    const response = await axios.get('/elements/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getElement(elementId) {
    const response = await axios.get('/elements/get/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },
  
  async createElement(element) {
    const response = await axios.post('/elements/create', element).catch(error => console.error('Erreur API: ', error));
    if (element.niveau === 1) {
      element.periode.element_id = response.data.insertId;
      await apiPeriode.createPeriode(element.periode);
    }
    if (element.niveau === 3 && element.mode_saisie === 'hebdo'){
      await apiVolumeHebdomadaire.createVolumeHebdomadaireBySemaine(response.data.insertId, 1, element.periode[0].nb_semaine);
    }
    return response.data;
  },

  async editElement(element) {
    const response = await axios.patch('/elements/edit/' + element.id, element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteElement(element) {
    if (element.niveau === 1) {
      await apiPeriode.deletePeriodeByElement(element.id);
    }
    const response = await axios.delete('/elements/delete/' + element.id).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteHierarchie(elementId) {
    const response = await axios.delete('/elements/hierarchie/delete/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiElement;