import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import fr from 'vuetify/lib/locale/fr';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify);

export default new Vuetify({
	lang: {
      locales: { fr },
      current: 'fr',
    },
    icons: {
        iconfont: 'md',
    },
});
