import axios from "axios";
import apiVolumeHebdomadaire from "./volumes-hebdomadaires";
import apiGroupeIntervenant from "./groupes-intervenants";

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
    var diff = periode.nb_semaine - periode.old_nb_semaine

    if (diff < 0) {
      await apiVolumeHebdomadaire.deleteVolumeHebdomadaireBySemaine(periode.element_id, periode.nb_semaine, periode.old_nb_semaine);
      await apiGroupeIntervenant.deleteGroupeIntervenantBySemaine(periode.element_id, periode.nb_semaine, periode.old_nb_semaine);
    } else if (diff > 0) {
      const volHebdo = await apiVolumeHebdomadaire.getVolumesHebdomadaires();

      var toAddVolHebdo = volHebdo.filter(e => (e.semestre_id === periode.element_id && e.num_semaine === periode.old_nb_semaine));
      for (let i = 0; i < toAddVolHebdo.length; i++) {
        await apiVolumeHebdomadaire.createVolumeHebdomadaireBySemaine(toAddVolHebdo[i].element_id, periode.old_nb_semaine + 1, periode.nb_semaine)
      }
      const grpInterv = await apiGroupeIntervenant.getGroupesIntervenants();
      var toAddGrpInterv = grpInterv.filter(e => (e.semestre_id === periode.element_id && e.num_semaine === periode.old_nb_semaine));
      for (let i = 0; i < toAddGrpInterv.length; i++) {
        await apiGroupeIntervenant.createGroupeIntervenantBySemaine(toAddGrpInterv[i].element_id, toAddGrpInterv[i].intervenant_id, periode.old_nb_semaine + 1, periode.nb_semaine)
      }
    }
    return response.data;
  },

  async deletePeriode(periodeId) {
    const response = await axios.delete('/periodes/delete/' + periodeId).catch(error => console.error('Erreur API: ', error));
    return response.data;
  }
};

export default apiPeriode;