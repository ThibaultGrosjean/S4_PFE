import axios from "axios";
import apiIntervenant from "./intervenants";

const apiProjet = {
  async getProjets() {
    const response = await axios.get('/projets/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getProjet(projetId) {
    const response = await axios.get('/projets/get/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createProjet(nom) {
    const response = await axios.post('/projets/create/' + nom).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editProjet(projet) {
    const response = await axios.patch('/projets/edit/' + projet.id, projet).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async verrouFormationProjet(projetId, verrou) {
    const response = await axios.patch('/projets/edit/' + projetId + '/verrou/' + verrou).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyProjet(projetId, grpInterv) {
    const response = await axios.post('/projets/copy/' + projetId).catch(error => console.error('Erreur API: ', error));
    await apiIntervenant.copyIntervenantByProjet(projetId, response.data.insertId)
    if (grpInterv){
      //Copy Grp Interv
    }
    return response.data;
  },

  async deleteProjet(projetId) {
    const response = await axios.delete('/projets/delete/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiProjet;