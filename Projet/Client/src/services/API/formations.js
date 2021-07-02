import axios from "axios";

const apiFormation = {
  async getFormations() {
    const response = await axios.get('/formations/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getFormation(formationId) {
    const response = await axios.get('/formations/get/' + formationId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getFormationByProjet(projetId) {
    const response = await axios.get('/formations/projets/get/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createFormation(formation) {
    const response = await axios.post('/formations/create', formation).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editFormation(formation) {
    const response = await axios.patch('/formations/edit/' + formation.id, formation).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteFormation(formationId) {
    const response = await axios.delete('/formations/delete/' + formationId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiFormation;