import axios from "axios";
import apiPeriode from "./periodes";
import apiVolumeHebdomadaire from "./volumes-hebdomadaires";
import apiGroupeIntervenant from "./groupes-intervenants";
import apiBilan from "./bilans";

const apiElement = {
  async getElementsHebdo() {
    const response = await axios.get('/elements/hebdomadaire/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getElementsGlobale() {
    const response = await axios.get('/elements/globale/get').catch(error => console.log('Erreur API: ', error));
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
    //Copier la racine
    var racine = await this.getElement(racineId);
    var copyRacine = await this.copyElement(racine[0], 0);
    const childrenRacine = await this.getChildren(racineId);

    for (let i = 0; i < childrenRacine.length; i++) {
      //Copier les semestres
      var semestre = await this.copyElement(childrenRacine[i], copyRacine.insertId);
      var childrenSemestre = await this.getChildren(childrenRacine[i].id);
      await apiPeriode.copyPeriode(childrenRacine[i].id, semestre.insertId);

      //Copier les UE
      for (let j = 0; j < childrenSemestre.length; j++) {
        var ue = await this.copyElement(childrenSemestre[j], semestre.insertId);
        var childrenUe = await this.getChildren(childrenSemestre[j].id);

        //Copier les sous-totaux
        var groupeSousTotalElement = await apiBilan.getGroupeSousTotalByProjetAndElement(projetId, childrenSemestre[j].id);
        for (let l = 0; l < groupeSousTotalElement.length; l++) {
          var sousTotal = await apiBilan.getLimiteSousTotalByProjetAndName(groupeSousTotalElement[l].nom_limite, newProjetId);
          if (sousTotal.length) {
            await apiBilan.createGroupeSousTotal({limite_sous_total_id: sousTotal[0].id, element_id: [ue.insertId]})
          }
        }

        //Copier les modules
        for (let k = 0; k < childrenUe.length; k++) {
          var module = await this.copyElement(childrenUe[k], ue.insertId);

          //Copier les volumes hebdo.
          var volumesHebdo = await apiVolumeHebdomadaire.getVolumeHebdomadaireByModule(childrenUe[k].id);
          for (let l = 0; l < volumesHebdo.length; l++) {
            await apiVolumeHebdomadaire.copyVolumeHebdomadaireByModule(volumesHebdo[l].id, module.insertId);
          }

          //Copier les groupes d'intervenants
          if (grpInterv) {
            var groupesIntervenants = await apiGroupeIntervenant.getGroupeIntervenantByModule(childrenUe[k].id);
            for (let l = 0; l < groupesIntervenants.length; l++) {
              await apiGroupeIntervenant.copyGroupeIntervenantByModule(groupesIntervenants[l].id, module.insertId, groupesIntervenants[l].enseignant_id, newProjetId);
            }
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