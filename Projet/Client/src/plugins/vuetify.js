import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import fr from 'vuetify/lib/locale/fr';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

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
        primary: '#727caa',
        accent: '#25293a',
      },
      dark: {
        primary: '#a6b0dd',
        accent: '#25293a',
      },
    },
  },
});
