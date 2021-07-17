import axios from "axios";
import apiElement from "./elements";
import apiVolumeHebdomadaire from "./volumes-hebdomadaires";
import apiVolumeGlobaux from "./volumes-globaux";
import apiGroupeIntervenant from "./groupes-intervenants";

const apiFormation = {
  async getFormations() {
    const response = await axios.get('/formations/get').catch(error => console.log('Erreur API: ', error));
    return response.data;
  },

  async getFormation(formationId) {
    const response = await axios.get('/formations/get/' + formationId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async getFormationByProjet(projetId) {
    const response = await axios.get('/formations/projets/get/' + projetId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async createFormation(projetId, elementId) {
    const formation = {
      verrou: Number(false),
      projet_id: projetId,
      element_id: elementId,
    }
    const response = await axios.post('/formations/create', formation);
    return response.data;
  },

  async createFormationByCopie(projetId, elementId) {
    const newFormation = {
      verrou: Number(false),
      projet_id: projetId,
      element_id: elementId,
    }
    const response = await axios.post('/formations/create', newFormation);
    return response.data;
  },

  async editFormation(formation) {
    const response = await axios.patch('/formations/edit/' + formation.id, formation);
    return response.data;
  },

  async copyFormation(formation, projetId, newProjetId, grpInterv) {
    const hierarchie = await apiElement.copyHierarchie(formation.element_id, grpInterv, projetId, newProjetId);
    const response = await axios.post('/formations/copy/' + formation.id + '/projet/' + newProjetId + '/element/' + hierarchie.insertId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async deleteFormation(formation) {
    const response = await axios.delete('/formations/delete/' + formation.id).catch(error => console.error('Erreur API: ', error));

    await apiVolumeHebdomadaire.deleteVolumeHebdomadaireByFormation(formation.element_id)
    await apiVolumeGlobaux.deleteVolumeGlobauxByFormation(formation.element_id)
    await apiGroupeIntervenant.deleteGroupeIntervenantByFormation(formation.element_id)
    //TODO DELETE DELETE_AllBilanByFormation
    await apiElement.deleteHierarchie(formation.element_id)

    return response.data;
  }
};

export default apiFormation;