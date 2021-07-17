import axios from "axios";

const apiVolumeHebdomadaire = {
  async getVolumesHebdomadaires() {
    const response = await axios.get('/volumes-hebdomadaires/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getVolumeHebdomadaire(volumeHebdomadaire) {
    const response = await axios.get('/volumes-hebdomadaires/get/' + volumeHebdomadaire).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getAllVolumeHebdomadaireByModule() {
    const response = await axios.get('/volumes-hebdomadaires/module/get' ).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getVolumeHebdomadaireByModule(moduleId) {
    const response = await axios.get('/volumes-hebdomadaires/module/get/' + moduleId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createVolumeHebdomadaire(element) {
    const response = await axios.post('/volumes-hebdomadaires/create', element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createVolumeHebdomadaireBySemaine(moduleId, semaineDeb, semaineFin) {
    const response = await axios.post('/volumes-hebdomadaires/create/' + moduleId + '/nbsemaine/' + semaineDeb + '/' + semaineFin);
    return response.data;
  },

  async copyVolumeHebdomadaireByModule(volumeId, parentId) {
    const response = await axios.post('/volumes-hebdomadaires/copy/' + volumeId + '/parent/' + parentId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editVolumeHebdomadaire(element) {
    const response = await axios.patch('/volumes-hebdomadaires/edit/' + element.id, element);
    return response.data;
  },

  async editTypeValueElementVolumeHebdomadaire(value, elementId, type) {
    const response = await axios.patch('/volumes-hebdomadaires/edit/' + value + '/elements/' + elementId + '/' + type ).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeHebdomadaireBySemaine(semestreId, semaineDeb, semaineFin) {
    const response = await axios.delete('/volumes-hebdomadaires/semestre/' + semestreId + '/nbsemaine/' + semaineDeb + '/' + semaineFin + '/delete').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeHebdomadaireByFormation(formationId) {
    const response = await axios.delete('/volumes-hebdomadaires/formation/delete/' + formationId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeHebdomadaireByElement(elementId) {
    const response = await axios.delete('/volumes-hebdomadaires/delete/element/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeHebdomadaire(volumeHebdomadaire) {
    const response = await axios.delete('/volumes-hebdomadaires/delete/' + volumeHebdomadaire).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiVolumeHebdomadaire;