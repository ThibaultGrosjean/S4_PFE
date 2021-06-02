<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des hierarchies arborescentes</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!elements.length">
          <p class="text-center">Aucune donnée trouvée</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
              class="v-btn--addElement"
              color="green"
              fab
              dark
              @click="close"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "ReadElements",
  data: () => ({
    form: false,
    methods: "POST",
  }),
  mounted() {
    this.$store.dispatch('loadElements');
  },
  computed: {
    ...mapState(['elements']),
  },
  methods: {
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
  }
}
</script>

<style scoped>
.v-btn--addElement {
  bottom: 0;
  right: 0;
  position: fixed;
  margin: 16px;
}
</style>