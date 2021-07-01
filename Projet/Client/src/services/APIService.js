import axios from "axios";

axios.defaults.baseURL = "http://localhost:8888/"

const apiClient = {
  async deleteIntervenant(intervenantId) {
    const response = await axios.delete("/intervenants/delete/" + intervenantId);
    console.log(response.data)
    return response.data;
  },
};

export default apiClient;
// this.selectedBooks = this.selectedBooks.filter(
//   (book) => book.id != bookId
// );

// deleteIntervenantTest: async function(bookId) {
//   const data = await api.deleteIntervenant(bookId);
// },