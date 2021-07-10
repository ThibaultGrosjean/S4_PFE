import axios from "axios";
import apiPeriode from "./periodes";
import apiVolumeHebdomadaire from "./volumes-hebdomadaires";

const apiElement = {
  async getElements() {
    const response = await axios.get('/elements/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getElementsModules(projetId) {
    const response = await axios.get('/elements/modules/projets/get/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getHierarchie(racineId) {
    const response = await axios.get('/elements/hierarchie/get/' + racineId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getElement(elementId) {
    const response = await axios.get('/elements/get/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },
  
  async createElement(element) {
    const response = await axios.post('/elements/create', element).catch(error => console.error('Erreur API: ', error));
    if (element.niveau === 1) {
      element.periode.element_id = response.data.insertId;
      await apiPeriode.createPeriode(element.periode);
    }
    if (element.niveau === 3 && element.mode_saisie === 'hebdo'){
      await apiVolumeHebdomadaire.createVolumeHebdomadaireBySemaine(response.data.insertId, 1, element.periode[0].nb_semaine);
    }
    return response.data;
  },

  async editElement(element) {
    const response = await axios.patch('/elements/edit/' + element.id, element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyElement(element, parent) {
    const response = await axios.post('/elements/copy/' + element.id +'/parent/' +  parent, element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyHierarchie(racineId) {
    const hierarchie = await this.getHierarchie(racineId);
    const racine = await this.copyElement(hierarchie[0], 0);
    for (let i = 0; i < hierarchie.length; i++) {
      if(hierarchie[i].niveau === 1){
        const semestre = await this.copyElement(hierarchie[i], racine.insertId);
        for (let j = 0; j < hierarchie.length; j++) {
          if(hierarchie[j].niveau === 2 && hierarchie[j].parent === hierarchie[i].id){
            const ue = await this.copyElement(hierarchie[j], semestre.insertId);
            for (let k = 0; k < hierarchie.length; k++) {
              if(hierarchie[k].niveau === 3 && hierarchie[k].parent === hierarchie[j].id){
                await this.copyElement(hierarchie[k], ue.insertId);
                //Copy vol hebdo, vol globale, grp interv, bilan
              }
            }
          }
        }
      }
    }
  },

  async deleteElement(element) {
    if (element.niveau === 1) {
      await apiPeriode.deletePeriodeByElement(element.id);
    }
    const response = await axios.delete('/elements/delete/' + element.id).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteHierarchie(elementId) {
    const response = await axios.delete('/elements/hierarchie/delete/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiElement;