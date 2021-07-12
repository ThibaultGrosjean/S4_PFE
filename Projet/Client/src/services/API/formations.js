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

  async createFormation(data) {
    const responseElement = await apiElement.createElement(data.element)
    console.log(responseElement.insertId);
    const formation = {
      verrou: Number(false),
      projet_id: data.projet_id,
      element_id: responseElement.insertId,
    }
    const response = await axios.post('/formations/create', formation).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async editFormation(formation) {
    const response = await axios.patch('/formations/edit/' + formation.id, formation).catch(error => console.error('Erreur API: ', error));
    return response.data;
  },

  async copyFormation(formation, projetId, grpInterv) {
    const hierarchie = await apiElement.copyHierarchie(formation.element_id, grpInterv, projetId);
    const response = await axios.post('/formations/copy/' + formation.id + '/projet/' + projetId + '/element/' + hierarchie.insertId).catch(error => console.error('Erreur API: ', error));
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