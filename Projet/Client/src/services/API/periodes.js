import axios from "axios";

const apiPeriode = {
  async getPeriodes() {
    const response = await axios.get('/periodes/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getPeriode(periodeId) {
    const response = await axios.get('/periodes/get/' + periodeId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getPeriodeByElementId(elementId) {
    const response = await axios.get('/periodes/element/get/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createPeriode(periode) {
    const response = await axios.post('/periodes/create', periode).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editPeriode(periode) {
    const response = await axios.patch('/periodes/edit/' + periode.id, periode).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deletePeriode(periodeId) {
    const response = await axios.delete('/periodes/delete/' + periodeId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiPeriode;