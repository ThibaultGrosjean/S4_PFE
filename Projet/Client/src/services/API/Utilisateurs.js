import axios from "axios";

const apiUtilisateur = {
  async connexion(credentials) {
    const responce = await axios.post('/connexion/', credentials);
    return responce.data;
  },

  async inscription(credentials) {
    const responce = await axios.post('/inscription/', credentials);
    return responce.data;
  }
};

export default apiUtilisateur;