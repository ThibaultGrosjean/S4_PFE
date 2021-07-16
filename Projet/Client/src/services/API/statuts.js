import axios from "axios";

const apiStatut = {
  async getStatuts() {
    const response = await axios.get('/statuts/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getStatut(statutId) {
    const response = await axios.get('/statuts/get/' + statutId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createStatut(statut) {
    const response = await axios.post('/statuts/create', statut);
    return response.data;
  },

  async editStatut(statut) {
    const response = await axios.patch('/statuts/edit/' + statut.id, statut);
    return response.data;
  },

  async copyStatut(statutId) {
    const response = await axios.post('/statuts/copy/' + statutId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteStatut(statutId) {
    const response = await axios.delete('/statuts/delete/' + statutId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiStatut;