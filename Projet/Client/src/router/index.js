import Vue from 'vue'
import VueRouter from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Statuts from "@/views/Statuts";
import Enseignants from "@/views/Enseignants";
import Projets from "../views/Projets";
import Elements from "../views/Elements";
import Intervenant from "../views/Intervenant";

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
  {
    path: '/projets',
    name: 'Projets',
    component: Projets
  },
  {
    path: '/hierarchies-arborescentes',
    name: 'Hierarchies Arborescentes',
    component: Elements
  },
  {
    path: '/intervenants',
    name: 'Intervenants',
    component: Intervenant
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
