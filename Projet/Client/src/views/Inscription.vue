<template>
  <v-container fill-height fluid class="animate-pop-in pa-16 background-shape">
    <v-row align="center" justify="center" class="text-center">
      <v-col class="pa-0 animate-pop-in" sm="6">
        <v-card>
          <v-form>
            <v-card-title class="pa-5 d-flex justify-center"><span class="text-h5">Gestion des horaires annuels</span></v-card-title>
            <v-card-subtitle class="text-subtitle-1 pb-2">Inscription</v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text class="pa-8">
              <div>
                <v-text-field
                    v-model="utilisateur.identifiant"
                    :error-messages="errors.identifiant"
                    label="Identifiant"
                    clearable
                >

                </v-text-field>
                <v-text-field
                    v-model="utilisateur.mot_de_passe"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :error-messages="errors.mot_de_passe"
                    label="Mot de passe"
                    clearable
                    @click:append="showPassword = !showPassword"
                ></v-text-field>
                <v-text-field
                    v-model="utilisateur.mot_de_passe_verif"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :error-messages="errors.mot_de_passe"
                    label="Mot de passe"
                    clearable
                    @click:append="showPassword = !showPassword"
                ></v-text-field>
              </div>
              <div class="d-flex justify-start">
                <a href="#" class="text-caption text-decoration-none">Mot de passe oublié ?</a>
              </div>
            </v-card-text>
            <v-card-actions class="px-8 pb-5">
              <v-spacer></v-spacer>
              <v-btn
                  :loading="loading"
                  color="primary"
                  text
                  @click="inscription"
              >
                Valider
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apiUtilisateur from "../services/API/Utilisateurs";

export default {
  name: "Inscription",
  data: () => ({
    errors: [],
    utilisateur: {
      identifiant: '',
      mot_de_passe: '',
      mot_de_passe_verif: '',
    },
    showPassword: false,
    loading: false,
  }),
  methods: {
    async inscription() {
      this.loading = true;
      const res = await apiUtilisateur.connexion(this.utilisateur);
      if (res.errors){
        this.errors = res.errors;
        this.loading = false;
      } else {
        await this.$router.push('/').catch(()=>{});
        this.clear();
        this.loading = false;

      }
    },
    clear() {
      this.utilisateur = {
        identifiant: '',
        mot_de_passe: '',
        mot_de_passe_verif: '',
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