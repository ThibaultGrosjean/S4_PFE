<template>
  <v-container>
    <v-row>
      <v-col class="pa-0">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip>
        minimales attendues :
      </v-col>
      <v-col cols="3" class="pa-0 d-flex align-center justify-end"><b>{{ data.nb_he_td_min_attendu }}</b> h</v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip>
        maximales attendues :
      </v-col>
      <v-col cols="3" class="pa-0 d-flex align-center justify-end"><b>{{ data.nb_he_td_max_attendu }}</b> h</v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip>
        minimales supplémentaires :
      </v-col>
      <v-col cols="3" class="pa-0 d-flex align-center justify-end"><b>{{ data.nb_he_td_min_sup }}</b> h</v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">HeTD*</span>
          </template>
          <span>Nombre d’heures équivalent TD</span>
        </v-tooltip>
        maximales supplémentaires :
      </v-col>
      <v-col cols="3" class="pa-0 d-flex align-center justify-end"><b>{{ data.nb_he_td_max_sup }}</b> h</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DetailsStatut",
  props: ['data'],
}
</script>

<style scoped>
</style>