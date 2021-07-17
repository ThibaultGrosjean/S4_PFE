import axios from "axios";

const apiVolumeGlobaux = {
  async getVolumesGlobaux() {
    const response = await axios.get('/volumes-globaux/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getVolumeGlobaux(volumeGlobaux) {
    const response = await axios.get('/volumes-globaux/get/' + volumeGlobaux).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getVolumeGlobauxByModule() {
    const response = await axios.get('/volumes-globaux/module/get' ).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createVolumeGlobaux(volumeGlobale) {
    const response = await axios.post('/volumes-globaux/create', volumeGlobale).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createVolumeGlobauxBySemaine(moduleId, semaineDeb, semaineFin) {
    const response = await axios.post('/volumes-globaux/create/' + moduleId + '/nbsemaine/' + semaineDeb + '/' + semaineFin).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createVolumeGlobauxByModule(moduleId, intervenantId) {
    const response = await axios.post('/volumes-globaux/module/' + moduleId + '/intervenant/' + intervenantId + '/create').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editVolumeGlobaux(element) {
    const response = await axios.patch('/volumes-globaux/edit/' + element.id, element);
    return response.data;
  },

  async editTypeValueElementVolumeGlobaux(value, elementId, type) {
    const response = await axios.patch('/volumes-globaux/edit/' + value + '/elements/' + elementId + '/' + type);
    return response.data;
  },

  async deleteVolumeGlobauxBySemaine(semestreId, semaineDeb, semaineFin) {
    const response = await axios.delete('/volumes-globaux/semestre/' + semestreId + '/nbsemaine/' + semaineDeb + '/' + semaineFin + '/delete').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeGlobauxByFormation(formationId) {
    const response = await axios.delete('/volumes-globaux/formation/delete/' + formationId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeGlobauxByElement(elementId, intervenantId) {
    const response = await axios.delete('/volumes-globaux/delete/element/' + elementId + '/intervenant/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteVolumeGlobaux(volumeGlobaux) {
    const response = await axios.delete('/volumes-globaux/delete/' + volumeGlobaux).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiVolumeGlobaux;