import Vue from 'vue'
import VueRouter from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Statuts from "../views/Statuts";
import Enseignants from "../views/Enseignants";
import Projets from "../views/Projets";
import Intervenant from "../views/Intervenants";
import Formation from "../views/Formations";
import Bilan from "../views/Bilan";
import Erreur404 from "../views/Erreur404";
import Connexion from "../views/Connexion";
import Inscription from "../views/Inscription";
import MonCompte from "../views/MonCompte";


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
    name: 'Intervenants',
    component: Intervenant
  },
  {
    path: '/formations/projets/:id',
    name: 'Formations',
    component: Formation
  },
  {
    path: '/bilan/projets/:id',
    name: 'Bilan',
    component: Bilan
  },
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: Inscription
  },
  {
    path: '/mon-compte',
    name: 'Mon Compte',
    component: MonCompte
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
