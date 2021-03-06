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
* Ne pas afficher les enseignants qui sont déjà intervenants dans le projet (formulaire création intervenant)
* Accéder aux intervenants depuis les formations et vice-versa, retourner aux projets depuis les formations et les intervenants
* Boîte de confirmation lors du changement du nombre de semaines d'un semestre
* Boîte de confirmation lors de la suppression d'un intervenant d'un module
* Ajouter plusieurs intervenants en même temps à un module.
* Supprimer les volumes hebdomadaires d'un module
* Supprimer tous les volumes hebdomadaires de la formation depuis l'élémént racine
* Supprimer tous les groupes d'intervenants de la formation depuis l'élémént racine
* Animation d'arrivée lors d'un chargement de page
* Thème sombre
* Ajouter plusieurs enseignants en même temps à un projet
* Si aucun vol. hebdo. est associé au module affiche l'icône de suppr. du module et un bouton pour ajouter les vol. hebdo., sinon suppression impossible

## Semaine 7 : 30 juin - 6 juillet

* Supprimer plusieurs intervenants d'un projet
* Confirmation simple s’ils n’ont aucune heure saisie dans le projet et sinon double confirmation
* Archiver, rendre non visible, supprimer (avec un archivage automatique) un projet et restaurer un projet archivé.
* Supprimer plusieurs formations d'un projet
* Confirmation simple s’ils n’ont aucune heure saisie dans la formation et sinon double confirmation
* Supprimer un enseignant + boîte de confirmation lors de la suppression
* Ajout d'une alerte après modification, ajout ou suppression pour les modifications dans la base de données
* Ajout des chargements lors des requêtes à la base de données
* Verrouiller un projet : verrouiller les formations et les intervenants reliés au projet
* Ajouter un intervenant dans un module à saisie globale, modifier les forfaits, supprimer l'intervenant

## Semaine 8 : 7-13 juillet

* Affichage du bilan général d'un projet pour chaque enseignant
* Afficher les sous-totaux
* Formulaire de modification et d'ajout d'un sous-total
* Ajouter et Modifier un sous-total
* Copier un projet : Copier les formations, les intervenants, les hiérarchies, les périodes, les volumes hebdomadaires, copier les groupes d'intervenants, copier les bilans
* Trier les sous-bilans par intervenant ou limite
* Supprimer un sous-total
* Supprimer un statut, si un ou plusieurs enseignants à ce statut affichage d'une boîte de confirmation sinon suppression
* Amélioration de la barre de navigation

## Semaine 9 : 14-20 juillet

* Ajouter une formation par copie
* Correction de la gestion des erreurs (toutes les vérifications des erreurs sont générées par l'API sauf les modifications à la volée, celles-ci sont générées dynamiquement via vues)
* Améliorations du "responsif"
* Améliorations graphiques : barre de navigation et barre d'outils
* Corrections bugs graphiques
* Système de connexion, inscription, protection des routes on n'est pas authentifié

## Semaine 10 : 20-23 juillet

* Sauvegarde de la connexion dans une session
* Affichage des données de l'utilisateur dans la page "mon compte"
* Demande 2 fois le mot de passe lors d'une inscription
* Correction affichage des volumes globaux
* Fonction pour convertir les chaînes avec des caractères spéciaux afin d'éviter les conflits dans les requêtes SQL (l' →  l\')
* Ajouter et modifier un sous-total : Assigner une limite spécifique à un statut
* Algorithme de calcul des HeTD totales selon le statut pour le bilan