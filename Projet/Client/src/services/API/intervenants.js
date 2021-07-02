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

  async createIntervenant(intervenant) {
    const response = await axios.post('/intervenants/create', intervenant).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editIntervenant(intervenant) {
    const response = await axios.patch('/intervenants/edit/' + intervenant.id, intervenant).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyIntervenant(intervenantId) {
    const response = await axios.post('/intervenants/copy/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteIntervenant(intervenantId) {
    const response = await axios.delete('/intervenants/delete/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiIntervenant;