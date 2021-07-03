import axios from "axios";

const apiElement = {
  async getElements() {
    const response = await axios.get('/elements/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getElement(elementId) {
    const response = await axios.get('/elements/get/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },
  
  async createElement(element) {
    const response = await axios.post('/elements/create', element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editElement(element) {
    const response = await axios.patch('/elements/edit/' + element.id, element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteElement(elementId) {
    const response = await axios.delete('/elements/delete/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteHierarchie(elementId) {
    const response = await axios.delete('/elements/hierarchie/delete/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiElement;