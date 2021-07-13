import axios from "axios";

const apiEnseignant = {
  async getEnseignants() {
    const response = await axios.get('/enseignants/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getEnseignant(enseignantId) {
    const response = await axios.get('/enseignants/get/' + enseignantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getEnseignantByStatut(statutId) {
    const response = await axios.get('/enseignants/statuts/get/' + statutId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getEnseignantByProjetNotInIntervenant(projetId) {
    const response = await axios.get('/enseignants/projets/' + projetId + '/get').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createEnseignant(enseignant) {
    const response = await axios.post('/enseignants/create', enseignant).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editEnseignant(enseignant) {
    const response = await axios.patch('/enseignants/edit/' + enseignant.id, enseignant).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyEnseignant(enseignantId) {
    const response = await axios.post('/enseignants/copy/' + enseignantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteEnseignant(enseignantId) {
    const response = await axios.delete('/enseignants/delete/' + enseignantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiEnseignant;