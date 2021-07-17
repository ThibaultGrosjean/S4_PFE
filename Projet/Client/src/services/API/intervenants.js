import axios from "axios";

const apiIntervenant = {
  async getIntervenants() {
    const response = await axios.get('/intervenants/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getIntervenant(intervenantId) {
    const response = await axios.get('/intervenants/get/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getIntervenantsByProjet(projetId) {
    const response = await axios.get('/intervenants/projets/get/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getIntervenantsForGrpIntervByProjetNotInModule(projetId, moduleId) {
    const response = await axios.get('/intervenants/groupes-intervenants/projets/' + projetId + '/module/' + moduleId + '/get').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getIntervenantsForVolGlobByProjetNotInModule(projetId, moduleId) {
    const response = await axios.get('/intervenants/volumes-globaux/projets/' + projetId + '/module/' + moduleId + '/get').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createIntervenant(intervenant) {
    const response = await axios.post('/intervenants/create', intervenant);
    return response.data;
  },

  async copyIntervenantByProjet(projetId, newProjetId) {
    const response = await axios.post('/intervenants/copy/projets/' + projetId + '/new-projet/' + newProjetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editIntervenant(intervenant) {
    const response = await axios.patch('/intervenants/edit/' + intervenant.id, intervenant);
    return response.data;
  },

  async deleteIntervenant(intervenantId) {
    const response = await axios.delete('/intervenants/delete/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiIntervenant;