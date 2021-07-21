import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

axios.defaults.baseURL = 'http://localhost:8888/'

new Vue({
  router,
  store,
  vuetify,
  beforeCreate() { this.$store.dispatch('initStore').then()},
  render: h => h(App)
}).$mount('#app')
