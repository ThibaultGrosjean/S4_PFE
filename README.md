# S4 PFE
Application permettant de saisir les heures annuelles faîtes par un enseignant et d’en faire un bilan global

* Client : VueJs
* Serveur : NodeJs
* BDD : MySQL

## Semaine 1 : 19-25 mai

* Découverte du sujet
* Construction d'un modèle relationnel (ERD, MCD)
* Création du Serveur
* API des tables Enseignant et Statut (CRUD)
* Création du Client
* Début d'une interface
* Test API avec Axios
* Liste des Enseignants et Statuts

## Semaine 2 : 26 mai - 1 juin

* Filtrer les Enseignants
* Suppression d'un Enseignant
* Formulaire de création et de modification d'un Enseignant
* Filtrer les Statuts
* Formulaire de création et de modification d'un Statut
* API des tables Projet et Élément (CRUD)

## Semaine 3 : 2-8 juin

* Filtrer les Projets
* Formulaire de création et de modification d'un Projet
* Filtrer les Éléments
* Formulaire de création et de modification d'un Éléments
* API de la table Intervenant (CRUD)
* Formulaire de création et de modification d'un Intervenant
* API de la table Formation (CRUD)
* Formulaire de création et de modification d'une Formation
* Affichage hiérarchique des éléments
* API de la table Période (CRUD)
* Formulaire de création et de modification d'une Période

## Semaine 4 : 9-15 juin

* Initialisation auto. des nombres de groupes (CM, TD...) grâce à la période du semestre
* Dupliquer un statut et un enseignant
* Affichage des heures prévues hebdo. (tableau)
* API de la table Volume_globale, Volume_hebomadaire et Groupe_intervenant (CRUD)
* Formulaire de création et de modification des Volumes hebdomadaires
* Formulaire de création et de modification des Volumes globaux
* Formulaire de création et de modification des Groupes d'enseignants
* Modification des Volumes hebdomadaires depuis le tableau des heures hebdo. prévues
* Surnom d'un enseignant calculé automatiquement
* Menu contextuel pour copier la même valeur à toutes les semaines (Volumes Hebdo.)
* Accéder à la période (d'un semestre) depuis la hiérarchie
* Accéder à la composition hiérarchique depuis la formation

## Semaine 5 : 16-22 juin

* Changement de niveau (sauf 0 et 1) et cacher les champs inutiles selon le niveau
* Création de tous les volumes hebdomadaires lors de la création d'un Module
* Ajout et suppr. des volumes hebdo. si changement du nb semaine d'une période
* Restructuration des fonctions loadNomTable en 1 fonction
* Affichage des enseignants intervenants sur le module
* Affichage volumes globaux
* Menu contextuel pour copier la même valeur à toutes les semaines (Grp. Intervenant)
* Accéder au nombre de groupes depuis le module

## Semaine 6 : 23-29 juin

* Accéder aux formations et aux intervenants liés au projet depuis le projet
* Page d'erreur 404
* Ajouter un intervenant à un module
* Supprimer un intervenant à un module
* Ajouter un élément racine depuis les formations du projet (Création de l'élément puis de la formation dans la bdd)