<template>
  <v-container fill-height fluid class="pa-16 animate-pop-in background-shape">
    <v-row align="center" justify="center" class="text-center" style="height: 100%">
        <v-col class="pa-0 animate-pop-in" sm="6">
          <v-card>
            <v-form>
              <v-card-title class="pa-5 d-flex justify-center"><span class="text-h5">Gestion des horaires annuels</span></v-card-title>
              <v-card-subtitle class="text-subtitle-1 pb-2">Connexion</v-card-subtitle>
              <v-divider></v-divider>
              <v-card-text class="pa-8">
                <div>
                  <v-text-field
                      v-model="utilisateur.identifiant"
                      label="Identifiant"
                  >
                  </v-text-field>
                  <v-text-field
                      v-model="utilisateur.mot_de_passe"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      label="Mot de passe"
                      @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </div>
                <div class="d-flex justify-start">
                  <a href="#" class="text-caption text-decoration-none">Mot de passe oublié ?</a>
                </div>
              </v-card-text>
              <v-card-actions class="px-8 pb-5">
                <a @click="$router.push('/inscription')" class="text-caption text-decoration-none">Pas encore de compte ?</a>
                <v-spacer></v-spacer>
                <v-btn
                    :loading="loading"
                    color="primary"
                    text
                    @click="connexion"
                >
                  Valider
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

    <v-row>
      <v-snackbar v-model="responseError" :timeout="3000" color="error">
        <span>{{ errors.general_error }}</span>
        <template v-slot:action="{ attrs }">
          <v-btn
              icon
              v-bind="attrs"
              @click="responseError = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    </v-container>
</template>

<script>
import apiUtilisateur from "../services/API/Utilisateurs";

export default {
  name: "Connexion",
  data: () => ({
    errors: [],
    utilisateur: {
      identifiant: '',
      mot_de_passe: '',
    },
    showPassword: false,
    loading: false,
    responseError: false,
  }),
  async created() {
    if (this.$store.getters.isLoggedIn) {
      await this.$router.push('/').catch(()=>{});
    }
  },
  methods: {
    async connexion() {
      this.loading = true;
      const res = await apiUtilisateur.connexion(this.utilisateur);
      if (res.errors){
        this.errors = res.errors;
        if (res.errors.general_error){
          this.responseError = true;
        }
        this.loading = false;
      } else {
        const token = res.token;
        const utilisateur = res.utilisateur;
        await this.$store.dispatch('connexion', {token, utilisateur});
        await this.$router.push('/').catch(()=>{});
        this.clear();
        this.loading = false;
      }
    },
    clear() {
      this.utilisateur = {
        identifiant: '',
        mot_de_passe: '',
      };
    }
  }
}
</script>

<style>
.background-shape {
  background: #eef0f4 !important;
  background: linear-gradient(153deg, #25293a 18%, #eef0f4 18%) no-repeat bottom !important;
}
</style>