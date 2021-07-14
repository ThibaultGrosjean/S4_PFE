import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import fr from 'vuetify/lib/locale/fr';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: {fr},
    current: 'fr',
  },
  icons: {
    iconfont: 'md',
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: colors.blue,
        accent: colors.blue.lighten2,
      },
      dark: {
        primary: colors.blue,
        accent: colors.blue.lighten2,

      },
    },
  },
});
