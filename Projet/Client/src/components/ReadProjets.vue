<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-center">Liste des Projets</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="p in projets"
               :key="p.id"
               sm="4"
        >
          <v-card>
            <v-card-title>
              {{ p.nom }}
              <v-spacer></v-spacer>
              <v-btn
                  icon
                  @click="archive"
              >
                <v-icon>
                  {{ p.archive ? 'unarchive' : 'archive' }}
                </v-icon>
              </v-btn>
              <v-btn
                  icon
                  @click="verrou"
              >
                <v-icon>
                  {{ p.verrou ? 'lock' : 'lock_open' }}
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <p class="mb-0">{{ toTime(p.date)}}</p>
            </v-card-text>
            <v-card-actions>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon :disabled="p.verrou">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        @click="edit(s)"
                    >
                      edit
                    </v-icon>
                  </v-btn>
                </template>
                <span>Modifier</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon :disabled="p.verrou">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      file_copy
                    </v-icon>
                  </v-btn>
                </template>
                <span>Dupliquer</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon :disabled="p.verrou">
                    <v-icon
                        color="red darken-1"
                        v-bind="attrs"
                        v-on="on"
                    >
                      delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Supprimer</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
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
  name: "ReadProjets",
  data: () => ({
    form: false,
    methods: "POST",
  }),
  mounted() {
    this.$store.dispatch('loadProjets');
  },
  computed: {
    ...mapState(['projets']),
  },
  methods: {
    toTime(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    archive() {

    },
    verrou() {

    },
    close() {
      this.form = !this.form
      this.methods = 'POST'
      this.clear()
    },
  },
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