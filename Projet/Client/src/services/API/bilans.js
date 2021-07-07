import axios from "axios";

const apiBilan = {
  async getBilanByProjetIntervenant(projetId) {
    const response = await axios.get('/bilan/projets/get/' + projetId).catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getAllLimiteSousTotal() {
    const response = await axios.get('/bilan/limite-sous-total/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getAllGroupeSousTotal() {
    const response = await axios.get('/bilan/groupe-sous-total/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getAllLimiteSousTotalByProjet(projetId) {
    const response = await axios.get('/bilan/limite-sous-total/projet/get/' + projetId).catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getAllGroupeSousByLimiteSousTotal(projetId) {
    const response = await axios.get('/bilan/groupe-sous-total/projet/get/' + projetId).catch(error => console.log('Erreur API: ', error));
    return response.data;
  },
};

export default apiBilan;