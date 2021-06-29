<template>
  <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      :nudge-bottom="-5"
      offset-x left rounded="pill" transition="slide-x-reverse-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn large icon v-on="on">
        <v-icon color="white">mdi-palette</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            Thème sombre
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch v-model="$vuetify.theme.dark" />
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "ThemeChangerMenu",
  data: () => ({
    menu:false
  }),
};
</script>