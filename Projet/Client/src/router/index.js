import Vue from 'vue'
import VueRouter from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Statuts from "../views/Statuts";
import Enseignants from "../views/Enseignants";
import Projets from "../views/Projets";
import Intervenant from "../views/Intervenants";
import Formation from "../views/Formations";
import Erreur404 from "../views/Erreur404";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/accueil'
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
    path: '/intervenants/projets/:id',
    name: 'Intervenants par Projet',
    component: Intervenant
  },
  {
    path: '/formations/projets/:id',
    name: 'Formations par Projet',
    component: Formation
  },
  {
    path: '*',
    name: '404 Page introuvable',
    component: Erreur404
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = "Gestion des horaires annuels | " + to.name
  next();
})

export default router
