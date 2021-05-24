<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Test API
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mb-4" v-for="(t,index) in this.request.data" :key="index">
        <p>nom : {{ t.nom }}</p>
        <p>surnom : {{ t.surnom }}</p>
        <p>nb_he_td_min_attendu : {{ t.nb_he_td_min_attendu }}</p>
        <p>nb_he_td_max_attendu : {{ t.nb_he_td_max_attendu }}</p>
        <p>nb_he_td_min_sup : {{ t.nb_he_td_min_sup }}</p>
        <p>nb_he_td_max_sup :{{ t.nb_he_td_max_sup }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Test API',
  data: () => ({
    request: {},
  }),
  mounted() {
    axios
      .get('http://localhost:8888/statuts')
      .then((responce) => {
        this.request = responce;
        console.log(responce.data);
      })
      .catch((responce) => {
        console.log(responce.data);
        console.log(responce.status);
        console.log(responce.headers);
      })
  }
}
</script>
