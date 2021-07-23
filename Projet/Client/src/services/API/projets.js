import axios from "axios";
import apiIntervenant from "./intervenants";
import apiFormation from "./formations";
import apiBilan from "./bilans";

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
    const response = await axios.post('/projets/create/' + nom, {nom: nom});
    console.log(response.data.errors)
    return response.data;
  },

  async editProjet(projet) {
    const response = await axios.patch('/projets/edit/' + projet.id, projet);
    return response.data;
  },

  async verrouFormationProjet(projetId, verrou) {
    const response = await axios.patch('/projets/edit/' + projetId + '/verrou/' + verrou).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyProjet(projetId, grpInterv) {
    const projetResponse = await axios.post('/projets/copy/' + projetId).catch(error => console.error('Erreur API: ', error));
    await apiIntervenant.copyIntervenantByProjet(projetId, projetResponse.data.insertId);
    const bilan = await apiBilan.getAllLimiteSousTotalByProjet(projetId);
    for (let i = 0; i < bilan.length; i++) {
      const res = await apiBilan.copyLimiteSousTotalByProjet(bilan[i].id, projetResponse.data.insertId);
      await apiBilan.copyLimiteStatut(bilan[i].id, res.insertId);
    }
    const formations = await apiFormation.getFormationByProjet(projetId);
    for (let i = 0; i < formations.length; i++) {
      await apiFormation.copyFormation(formations[i], projetId, projetResponse.data.insertId, grpInterv);
    }
    return projetResponse.data;
  },

  async deleteProjet(projetId) {
    const response = await axios.delete('/projets/delete/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiProjet;