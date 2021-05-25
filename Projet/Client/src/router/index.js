import Vue from 'vue'
import VueRouter from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Statuts from "@/views/Statuts";
import Enseignants from "@/views/Enseignants";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/accueil',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/statuts',
    name: 'Statuts',
    component: Statuts
  },
  {
    path: '/enseignants',
    name: 'Enseignants',
    component: Enseignants
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
