import axios from "axios";
import apiPeriode from "./periodes";
import apiVolumeHebdomadaire from "./volumes-hebdomadaires";
import apiGroupeIntervenant from "./groupes-intervenants";
import apiBilan from "./bilans";

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

  async getAllRacineHierarchie() {
    const response = await axios.get('/elements/hierarchie/racine/get/').catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getChildren(racineId) {
    const response = await axios.get('/elements/children/get/' + racineId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getElement(elementId) {
    const response = await axios.get('/elements/get/' + elementId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createElement(element) {
    const response = await axios.post('/elements/create', element);
    return response.data;
  },

  async editElement(element) {
    const response = await axios.patch('/elements/edit/' + element.id, element);
    return response.data;
  },

  async copyElement(element, parent) {
    const response = await axios.post('/elements/copy/' + element.id + '/parent/' + parent, element).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyHierarchie(racineId, grpInterv, projetId, newProjetId) {
    const racine = await this.getElement(racineId);
    const copyRacine = await this.copyElement(racine[0], 0);

    const childrenRacine = await this.getChildren(racineId);
    for (let i = 0; i < childrenRacine.length; i++) {
      const semestre = await this.copyElement(childrenRacine[i], copyRacine.insertId);
      const childrenSemestre = await this.getChildren(childrenRacine[i].id);
      await apiPeriode.copyPeriode(childrenRacine[i].id, semestre.insertId);
      for (let j = 0; j < childrenSemestre.length; j++) {
        const ue = await this.copyElement(childrenSemestre[j], semestre.insertId);
        const childrenUe = await this.getChildren(childrenSemestre[j].id);
        for (let k = 0; k < childrenUe.length; k++) {
          const module = await this.copyElement(childrenUe[k], ue.insertId);

          //Copier les volumes hebdo.
          const volumesHebdo = await apiVolumeHebdomadaire.getVolumeHebdomadaireByModule(childrenUe[k].id);
          for (let l = 0; l < volumesHebdo.length; l++) {
            await apiVolumeHebdomadaire.copyVolumeHebdomadaireByModule(volumesHebdo[l].id, module.insertId);
          }

          //Copier les groupes d'intervenants
          if (grpInterv) {
            const groupesIntervenants = await apiGroupeIntervenant.getGroupeIntervenantByModule(childrenUe[k].id);
            for (let l = 0; l < groupesIntervenants.length; l++) {
              await apiGroupeIntervenant.copyGroupeIntervenantByModule(groupesIntervenants[l].id, module.insertId, groupesIntervenants[l].enseignant_id, newProjetId);
            }
          }

          //Copier les sous-totaux
          const groupeSousTotalElement = await apiBilan.getGroupeSousTotalByProjetAndElement(projetId, childrenUe[k].id);
          for (let l = 0; l < groupeSousTotalElement.length; l++) {
            const sousTotal = await apiBilan.getLimiteSousTotalByProjetAndName(groupeSousTotalElement[l].nom, newProjetId);
            if (sousTotal.length) await apiBilan.createGroupeSousTotal({limite_sous_total_id: sousTotal[0].id, element_id: [module.insertId]})
          }
        }
      }
    }
    return copyRacine;
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