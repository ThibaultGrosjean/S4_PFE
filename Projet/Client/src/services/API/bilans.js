import axios from "axios";

const apiBilan = {
  async getBilanByProjetIntervenant(projetId) {
    const response = await axios.get('/bilan/general/projets/get/' + projetId).catch(error => console.log('Erreur API: ', error));
    return response.data;
  },
  async getBilanSousTotal(projetId) {
    const response = await axios.get('/bilan/sous-total/projets/get/' + projetId).catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getAllGroupeSousTotalByLimite(limiteId) {
    const response = await axios.get('/bilan/groupe-sous-total/limite/get/' + limiteId).catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async createLimiteSousTotal(limiteSousTotal, elements) {
    const response = await axios.post('/bilan/limite-sous-total/create', limiteSousTotal).catch(error => console.error('Erreur API: ', error));
    console.log(elements);
    await this.createGroupeSousTotal({limite_sous_total_id: response.data.insertId, element_id: elements});
    return response.data;
  },

  async createGroupeSousTotal(GroupeSousTotal) {
    const response = await axios.post('/bilan/groupe-sous-total/create', GroupeSousTotal).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editLimiteSousTotal(limiteSousTotal, elements) {
    const response = await axios.patch('/bilan/limite-sous-total/edit/' + limiteSousTotal.id, limiteSousTotal).catch(error => console.error('Erreur API: ', error));
    await this.deleteGroupeSousTotal(limiteSousTotal.id);
    console.log(limiteSousTotal.id)
    await this.createGroupeSousTotal({limite_sous_total_id: limiteSousTotal.id, element_id: elements});
    return response.data;
  },

  async deleteGroupeSousTotal(limiteSousTotalId) {
    const response = await axios.delete('/bilan/groupe-sous-total/delete/' + limiteSousTotalId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiBilan;