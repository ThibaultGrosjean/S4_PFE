import axios from "axios";

const apiGroupeIntervenant = {
  async getGroupesIntervenants() {
    const response = await axios.get('/groupes-intervenants/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getGroupeIntervenant(groupeIntervenant) {
    const response = await axios.get('/groupes-intervenants/get/' + groupeIntervenant).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getGroupeIntervenantByModule() {
    const response = await axios.get('/groupes-intervenants/module/get' ).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createGroupeIntervenant(element) {
    const response = await axios.post('/groupes-intervenants/create', element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createGroupeIntervenantBySemaine(moduleId, intervenantId, semaineDeb, semaineFin) {
    const response = await axios.post('/groupes-intervenants/create/module/' + moduleId + '/intervenant/' + intervenantId + '/nbsemaine/' + semaineDeb + '/' + semaineFin).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editGroupeIntervenant(element) {
    const response = await axios.patch('/groupes-intervenants/edit/' + element.id, element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editTypeValueElementGroupeIntervenant(value, elementId, intervenantId, type) {
    const response = await axios.patch('/groupes-intervenants/edit/' + value + '/elements/' + elementId + '/' + type + '/intervenant/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteGroupeIntervenantBySemaine(semestreId, semaineDeb, semaineFin) {
    const response = await axios.delete('/groupes-intervenants/semestre/' + semestreId + '/nbsemaine/' + semaineDeb + '/' + semaineFin + '/delete').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteGroupeIntervenantByFormation(formationId) {
    const response = await axios.delete('/groupes-intervenants/formation/delete/' + formationId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteGroupeIntervenantByElement(elementId, intervenantId) {
    const response = await axios.delete('/groupes-intervenants/delete/element/' + elementId + '/intervenant/' + intervenantId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteGroupeIntervenant(groupeIntervenant) {
    const response = await axios.delete('/groupes-intervenants/delete/' + groupeIntervenant).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiGroupeIntervenant;