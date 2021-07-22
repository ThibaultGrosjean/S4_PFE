-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 22 juil. 2021 à 15:06
-- Version du serveur :  8.0.22
-- Version de PHP : 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : pfe
--
DROP TABLE element, enseignant, formation, groupe_intervenant, groupe_sous_total, groupe_statut_limite, intervenant, limite_sous_total, periode, projet, statut, utilisateur, volume_globale, volume_hebdomadaire;
-- --------------------------------------------------------

--
-- Structure de la table element
--

CREATE TABLE element (
  id int NOT NULL,
  titre varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  surnom varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  code varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  niveau int NOT NULL,
  indice int NOT NULL,
  vol_hor_total_prevues_etu_cm float DEFAULT NULL,
  vol_hor_total_prevues_etu_td float DEFAULT NULL,
  vol_hor_total_prevues_etu_tp float DEFAULT NULL,
  mode_saisie enum('aucun','hebdo','globale') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  cm_autorises tinyint(1) NOT NULL DEFAULT '0',
  td_autorises tinyint(1) NOT NULL DEFAULT '0',
  tp_autorises tinyint(1) NOT NULL DEFAULT '0',
  partiel_autorises tinyint(1) NOT NULL DEFAULT '0',
  forfait_globale_cm float DEFAULT NULL,
  forfait_globale_td float DEFAULT NULL,
  forfait_globale_tp float DEFAULT NULL,
  forfait_globale_partiel float DEFAULT NULL,
  nb_groupe_effectif_cm int DEFAULT NULL,
  nb_groupe_effectif_td int DEFAULT NULL,
  nb_groupe_effectif_tp int DEFAULT NULL,
  nb_groupe_effectif_partiel int DEFAULT NULL,
  parent int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table element
--

INSERT INTO element (id, titre, surnom, code, niveau, indice, vol_hor_total_prevues_etu_cm, vol_hor_total_prevues_etu_td, vol_hor_total_prevues_etu_tp, mode_saisie, cm_autorises, td_autorises, tp_autorises, partiel_autorises, forfait_globale_cm, forfait_globale_td, forfait_globale_tp, forfait_globale_partiel, nb_groupe_effectif_cm, nb_groupe_effectif_td, nb_groupe_effectif_tp, nb_groupe_effectif_partiel, parent) VALUES
(1, 'DUT Informatique IUT Belfort-Montbéliard', 'Dut Info', 'DUTI', 0, 0, 0, 0, 0, 'aucun', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
(2, 'Semestre 1', 'S1', 'S1', 1, 0, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1),
(3, 'Semestre 2', 'S2', 'S2', 1, 1, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1),
(4, 'Semestre 3', 'S3', 'S3', 1, 2, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1),
(5, 'Semestre 4', 'S4', 'S4', 1, 3, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1),
(6, 'UE 11 : Base de l\'Informatique', 'UE11', 'UE11', 2, 0, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 2),
(7, 'UE 12 : Base de culture scientifique, sociale et humaine', 'UE12', 'UE12', 2, 1, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 2),
(8, 'M 1101 : Introduction aux systèmes informatiques', 'M1101', 'M1101', 3, 0, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 6),
(9, 'M 1102 : Introduction à l\'algorithmique et à la programmation', 'M1102', 'M1102', 3, 1, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 6),
(10, 'M 1103 : Structures de données et algorithmes fondamentaux', 'M1103', 'M1103', 3, 2, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 6),
(11, 'M 1104 : Introduction aux bases de données', 'M1104', 'M1104', 3, 3, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 6),
(12, 'M 1105 : Conception de documents et interfaces numériques', 'M1105', 'M1105', 3, 4, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 6),
(13, 'Projet Tutoré', 'Ptut', 'Ptut', 2, 2, 0, 0, 0, 'globale', 0, 1, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 2),
(14, 'M 1201 : Mathématiques discrètes', 'M1201', 'M1201', 3, 0, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(15, 'M 1202 : Algèbre linéaire', 'M1202', 'M1202', 3, 1, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(16, 'M 1203 : Environnement économique', 'M1203', 'M1203', 3, 2, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(17, 'M 1204 : Fonctionnement des organisations', 'M1204', 'M1204', 3, 3, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(18, 'M 1205 : Expression et communication', 'M1205', 'M1205', 3, 4, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(19, 'M 1206 : Anglais', 'M1206', 'M1206', 3, 5, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(20, 'M 1207 : PPP', 'M1207', 'M1207', 3, 6, 0, 0, 0, 'hebdo', 1, 1, 1, 1, 0, 0, 0, 0, 1, 4, 8, 2, 7),
(21, 'Stage', 'Stage', 'Stage', 2, 1, 0, 0, 0, 'globale', 0, 1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 5),
(22, 'Projet Tutoré', 'Ptut', 'Ptut', 2, 0, 0, 0, 0, 'globale', 0, 1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5);

-- --------------------------------------------------------

--
-- Structure de la table enseignant
--

CREATE TABLE enseignant (
  id int NOT NULL,
  statut_id int DEFAULT NULL,
  prenom varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  nom varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  surnom varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  email varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table enseignant
--

INSERT INTO enseignant (id, statut_id, prenom, nom, surnom, email) VALUES
(1, 1, 'Gérard', 'Dupond', 'GDU', 'gerard.dupond@testmail.com'),
(2, 4, 'Jean-Louis', 'Martin', 'JLM', 'jeanlouis.martin@testmail.com'),
(3, 2, 'Jean-Pierre', 'Rondin', 'JPR', 'jeanlouis.martin@testmail.com'),
(4, 5, 'Henri', 'Bernard', 'HBE', 'jeanlouis.martin@testmail.com');

-- --------------------------------------------------------

--
-- Structure de la table formation
--

CREATE TABLE formation (
  id int NOT NULL,
  projet_id int DEFAULT NULL,
  element_id int DEFAULT NULL,
  verrou tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table formation
--

INSERT INTO formation (id, projet_id, element_id, verrou) VALUES
(1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table groupe_intervenant
--

CREATE TABLE groupe_intervenant (
  id int NOT NULL,
  element_id int DEFAULT NULL,
  intervenant_id int DEFAULT NULL,
  num_semaine int NOT NULL,
  nb_groupe_cm int NOT NULL,
  nb_groupe_td int NOT NULL,
  nb_groupe_tp int NOT NULL,
  nb_groupe_partiel int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table groupe_intervenant
--

INSERT INTO groupe_intervenant (id, element_id, intervenant_id, num_semaine, nb_groupe_cm, nb_groupe_td, nb_groupe_tp, nb_groupe_partiel) VALUES
(1, 8, 1, 1, 1, 4, 4, 0),
(2, 8, 1, 2, 1, 4, 4, 0),
(3, 8, 1, 3, 1, 4, 4, 0),
(4, 8, 1, 4, 1, 4, 4, 0),
(5, 8, 1, 5, 1, 4, 4, 0),
(6, 8, 1, 6, 1, 4, 4, 0),
(7, 8, 1, 7, 1, 4, 4, 0),
(8, 8, 1, 8, 1, 4, 4, 0),
(9, 8, 1, 9, 1, 4, 4, 0),
(10, 8, 1, 10, 1, 4, 4, 0),
(11, 8, 1, 11, 1, 4, 4, 0),
(12, 8, 1, 12, 1, 4, 4, 0),
(13, 8, 1, 13, 1, 4, 4, 0),
(14, 8, 1, 14, 1, 4, 4, 0),
(15, 8, 2, 1, 0, 2, 4, 0),
(16, 8, 2, 2, 0, 2, 4, 0),
(17, 8, 2, 3, 0, 2, 4, 0),
(18, 8, 2, 4, 0, 2, 4, 0),
(19, 8, 2, 5, 0, 2, 4, 0),
(20, 8, 2, 6, 0, 2, 4, 0),
(21, 8, 2, 7, 0, 2, 4, 0),
(22, 8, 2, 8, 0, 2, 4, 0),
(23, 8, 2, 9, 0, 2, 4, 0),
(24, 8, 2, 10, 0, 2, 4, 0),
(25, 8, 2, 11, 0, 2, 4, 0),
(26, 8, 2, 12, 0, 2, 4, 0),
(27, 8, 2, 13, 0, 2, 4, 0),
(28, 8, 2, 14, 0, 2, 4, 0),
(29, 8, 3, 1, 1, 0, 2, 0),
(30, 8, 3, 2, 1, 0, 2, 0),
(31, 8, 3, 3, 1, 0, 2, 0),
(32, 8, 3, 4, 1, 0, 2, 0),
(33, 8, 3, 5, 1, 0, 2, 0),
(34, 8, 3, 6, 1, 0, 2, 0),
(35, 8, 3, 7, 1, 0, 2, 0),
(36, 8, 3, 8, 1, 0, 2, 0),
(37, 8, 3, 9, 1, 0, 2, 0),
(38, 8, 3, 10, 1, 0, 2, 0),
(39, 8, 3, 11, 1, 0, 2, 0),
(40, 8, 3, 12, 1, 0, 2, 0),
(41, 8, 3, 13, 1, 0, 2, 0),
(42, 8, 3, 14, 1, 0, 2, 0),
(43, 8, 4, 1, 1, 1, 0, 0),
(44, 8, 4, 2, 1, 1, 0, 0),
(45, 8, 4, 3, 1, 1, 0, 0),
(46, 8, 4, 4, 1, 1, 0, 0),
(47, 8, 4, 5, 1, 1, 0, 0),
(48, 8, 4, 6, 1, 1, 0, 0),
(49, 8, 4, 7, 1, 1, 0, 0),
(50, 8, 4, 8, 1, 1, 0, 0),
(51, 8, 4, 9, 1, 1, 0, 0),
(52, 8, 4, 10, 1, 1, 0, 0),
(53, 8, 4, 11, 1, 1, 0, 0),
(54, 8, 4, 12, 1, 0, 0, 0),
(55, 8, 4, 13, 1, 0, 0, 0),
(56, 8, 4, 14, 1, 0, 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table groupe_sous_total
--

CREATE TABLE groupe_sous_total (
  limite_sous_total_id int NOT NULL,
  element_id int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table groupe_sous_total
--

INSERT INTO groupe_sous_total (limite_sous_total_id, element_id) VALUES
(1, 13),
(1, 22),
(1, 21);

-- --------------------------------------------------------

--
-- Structure de la table groupe_statut_limite
--

CREATE TABLE groupe_statut_limite (
  statut_id int NOT NULL,
  limite_id int NOT NULL,
  limite int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table groupe_statut_limite
--

INSERT INTO groupe_statut_limite (statut_id, limite_id, limite) VALUES
(2, 1, 42),
(1, 1, 42),
(3, 1, 84),
(4, 1, 84);

-- --------------------------------------------------------

--
-- Structure de la table intervenant
--

CREATE TABLE intervenant (
  id int NOT NULL,
  projet_id int DEFAULT NULL,
  enseignant_id int DEFAULT NULL,
  nb_he_td_min_attendu float NOT NULL,
  nb_he_td_max_attendu float NOT NULL,
  nb_he_td_min_sup float NOT NULL,
  nb_he_td_max_sup float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table intervenant
--

INSERT INTO intervenant (id, projet_id, enseignant_id, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup) VALUES
(1, 1, 1, 192, 192, 0, 100),
(2, 1, 2, 384, 384, 0, 200),
(3, 1, 3, 192, 192, 0, 100),
(4, 1, 4, 0, 64, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table limite_sous_total
--

CREATE TABLE limite_sous_total (
  id int NOT NULL,
  nom varchar(255) NOT NULL,
  limite_he_td int NOT NULL DEFAULT '0',
  projet_id int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table limite_sous_total
--

INSERT INTO limite_sous_total (id, nom, limite_he_td, projet_id) VALUES
(1, 'Référentiel', 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table periode
--

CREATE TABLE periode (
  id int NOT NULL,
  element_id int DEFAULT NULL,
  nb_semaine int NOT NULL,
  nb_groupe_defaut_cm int NOT NULL,
  nb_groupe_defaut_td int NOT NULL,
  nb_groupe_defaut_tp int NOT NULL,
  nb_groupe_defaut_partiel int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table periode
--

INSERT INTO periode (id, element_id, nb_semaine, nb_groupe_defaut_cm, nb_groupe_defaut_td, nb_groupe_defaut_tp, nb_groupe_defaut_partiel) VALUES
(1, 2, 14, 1, 4, 8, 2),
(2, 3, 14, 1, 4, 8, 2),
(3, 4, 14, 1, 4, 8, 2),
(4, 5, 14, 1, 4, 8, 2);

-- --------------------------------------------------------

--
-- Structure de la table projet
--

CREATE TABLE projet (
  id int NOT NULL,
  nom varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  date date NOT NULL,
  verrou tinyint(1) NOT NULL,
  archive tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table projet
--

INSERT INTO projet (id, nom, date, verrou, archive) VALUES
(1, 'Test Projet 2021', '2021-05-16', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table statut
--

CREATE TABLE statut (
  id int NOT NULL,
  nom varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  surnom varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  nb_he_td_min_attendu float NOT NULL,
  nb_he_td_max_attendu float NOT NULL,
  nb_he_td_min_sup float NOT NULL,
  nb_he_td_max_sup float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table statut
--

INSERT INTO statut (id, nom, surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup) VALUES
(1, 'Professeur des Universités', 'PU', 192, 192, 0, 100),
(2, 'Maître de Conférence', 'MCF', 192, 192, 0, 100),
(3, 'Professeur agrégé', 'PRAG', 384, 384, 0, 200),
(4, 'Professeur certifié', 'PRCE', 384, 384, 0, 200),
(5, 'Vacataire', 'VAC', 0, 64, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table utilisateur
--

CREATE TABLE utilisateur (
  id int NOT NULL,
  identifiant varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  prenom varchar(255) NOT NULL,
  nom varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  mot_de_passe varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table utilisateur
--

INSERT INTO utilisateur (id, identifiant, prenom, nom, email, mot_de_passe) VALUES
(1, 'adminadmin', 'admin', 'admin', 'admin@admin.com', '$2a$10$5Smk/aQ6BDI9c6EqWvb73u3CWpxwuwS61upSYJquCC/z32dJyJgUi');

-- --------------------------------------------------------

--
-- Structure de la table volume_globale
--

CREATE TABLE volume_globale (
  id int NOT NULL,
  intervenant_id int DEFAULT NULL,
  element_id int DEFAULT NULL,
  num_semaine int NOT NULL,
  vol_hor_cm float NOT NULL,
  vol_hor_td float NOT NULL,
  vol_hor_tp float NOT NULL,
  vol_hor_partiel float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table volume_globale
--

INSERT INTO volume_globale (id, intervenant_id, element_id, num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel) VALUES
(1, 1, 13, 1, 0, 2, 0, 0),
(2, 2, 13, 1, 0, 3, 0, 0),
(4, 2, 21, 1, 0, 4, 0, 0),
(5, 1, 22, 1, 0, 4, 0, 0),
(7, 3, 13, 1, 0, 8, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table volume_hebdomadaire
--

CREATE TABLE volume_hebdomadaire (
  id int NOT NULL,
  element_id int DEFAULT NULL,
  num_semaine int NOT NULL,
  vol_hor_cm float NOT NULL,
  vol_hor_td float NOT NULL,
  vol_hor_tp float NOT NULL,
  vol_hor_partiel float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table volume_hebdomadaire
--

INSERT INTO volume_hebdomadaire (id, element_id, num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel) VALUES
(1, 8, 1, 1, 2, 3, 0),
(2, 8, 2, 1, 2, 3, 0),
(3, 8, 3, 1, 2, 3, 0),
(4, 8, 4, 1, 2, 3, 0),
(5, 8, 5, 1, 2, 3, 0),
(6, 8, 6, 1, 2, 3, 0),
(7, 8, 7, 1, 2, 3, 0),
(8, 8, 8, 1, 2, 3, 0),
(9, 8, 9, 1, 2, 3, 0),
(10, 8, 10, 1, 2, 3, 0),
(11, 8, 11, 1, 2, 3, 0),
(12, 8, 12, 1, 2, 3, 0),
(13, 8, 13, 1, 2, 3, 0),
(14, 8, 14, 0, 0, 0, 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table element
--
ALTER TABLE element
  ADD PRIMARY KEY (id),
  ADD KEY parent (parent);

--
-- Index pour la table enseignant
--
ALTER TABLE enseignant
  ADD PRIMARY KEY (id),
  ADD KEY IDX_81A72FA1F6203804 (statut_id);

--
-- Index pour la table formation
--
ALTER TABLE formation
  ADD PRIMARY KEY (id),
  ADD KEY IDX_404021BFC18272 (projet_id),
  ADD KEY IDX_404021BF1F1F2A24 (element_id);

--
-- Index pour la table groupe_intervenant
--
ALTER TABLE groupe_intervenant
  ADD PRIMARY KEY (id),
  ADD KEY IDX_394A1E7D1F1F2A24 (element_id),
  ADD KEY IDX_394A1E7DAB9A1716 (intervenant_id);

--
-- Index pour la table groupe_sous_total
--
ALTER TABLE groupe_sous_total
  ADD KEY limite_sous_total_id (limite_sous_total_id) USING BTREE,
  ADD KEY element_id (element_id) USING BTREE;

--
-- Index pour la table groupe_statut_limite
--
ALTER TABLE groupe_statut_limite
  ADD KEY statut_id (statut_id) USING BTREE,
  ADD KEY limite_id (limite_id) USING BTREE;

--
-- Index pour la table intervenant
--
ALTER TABLE intervenant
  ADD PRIMARY KEY (id),
  ADD KEY IDX_73D0145CC18272 (projet_id),
  ADD KEY IDX_73D0145CE455FCC0 (enseignant_id);

--
-- Index pour la table limite_sous_total
--
ALTER TABLE limite_sous_total
  ADD PRIMARY KEY (id),
  ADD KEY id_projet (projet_id);

--
-- Index pour la table periode
--
ALTER TABLE periode
  ADD PRIMARY KEY (id),
  ADD KEY IDX_93C32DF31F1F2A24 (element_id);

--
-- Index pour la table projet
--
ALTER TABLE projet
  ADD PRIMARY KEY (id);

--
-- Index pour la table statut
--
ALTER TABLE statut
  ADD PRIMARY KEY (id);

--
-- Index pour la table utilisateur
--
ALTER TABLE utilisateur
  ADD PRIMARY KEY (id);

--
-- Index pour la table volume_globale
--
ALTER TABLE volume_globale
  ADD PRIMARY KEY (id),
  ADD KEY IDX_F0BC8913AB9A1716 (intervenant_id),
  ADD KEY IDX_F0BC89131F1F2A24 (element_id);

--
-- Index pour la table volume_hebdomadaire
--
ALTER TABLE volume_hebdomadaire
  ADD PRIMARY KEY (id),
  ADD KEY IDX_8665328E1F1F2A24 (element_id);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table element
--
ALTER TABLE element
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table enseignant
--
ALTER TABLE enseignant
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table formation
--
ALTER TABLE formation
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table groupe_intervenant
--
ALTER TABLE groupe_intervenant
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT pour la table intervenant
--
ALTER TABLE intervenant
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table limite_sous_total
--
ALTER TABLE limite_sous_total
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table periode
--
ALTER TABLE periode
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table projet
--
ALTER TABLE projet
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table statut
--
ALTER TABLE statut
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table utilisateur
--
ALTER TABLE utilisateur
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table volume_globale
--
ALTER TABLE volume_globale
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table volume_hebdomadaire
--
ALTER TABLE volume_hebdomadaire
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table element
--
ALTER TABLE element
  ADD CONSTRAINT element_ibfk_1 FOREIGN KEY (parent) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table enseignant
--
ALTER TABLE enseignant
  ADD CONSTRAINT FK_81A72FA1F6203804 FOREIGN KEY (statut_id) REFERENCES statut (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table formation
--
ALTER TABLE formation
  ADD CONSTRAINT FK_404021BF1F1F2A24 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT FK_404021BFC18272 FOREIGN KEY (projet_id) REFERENCES projet (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table groupe_intervenant
--
ALTER TABLE groupe_intervenant
  ADD CONSTRAINT FK_394A1E7D1F1F2A24 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT FK_394A1E7DAB9A1716 FOREIGN KEY (intervenant_id) REFERENCES intervenant (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table groupe_sous_total
--
ALTER TABLE groupe_sous_total
  ADD CONSTRAINT groupe_sous_total_ibfk_1 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT groupe_sous_total_ibfk_2 FOREIGN KEY (limite_sous_total_id) REFERENCES limite_sous_total (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table groupe_statut_limite
--
ALTER TABLE groupe_statut_limite
  ADD CONSTRAINT groupe_statut_limite_ibfk_1 FOREIGN KEY (statut_id) REFERENCES statut (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT groupe_statut_limite_ibfk_2 FOREIGN KEY (limite_id) REFERENCES limite_sous_total (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table intervenant
--
ALTER TABLE intervenant
  ADD CONSTRAINT FK_73D0145CC18272 FOREIGN KEY (projet_id) REFERENCES projet (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT FK_73D0145CE455FCC0 FOREIGN KEY (enseignant_id) REFERENCES enseignant (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table limite_sous_total
--
ALTER TABLE limite_sous_total
  ADD CONSTRAINT limite_sous_total_ibfk_1 FOREIGN KEY (projet_id) REFERENCES projet (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table periode
--
ALTER TABLE periode
  ADD CONSTRAINT FK_93C32DF31F1F2A24 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table volume_globale
--
ALTER TABLE volume_globale
  ADD CONSTRAINT FK_F0BC89131F1F2A24 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT FK_F0BC8913AB9A1716 FOREIGN KEY (intervenant_id) REFERENCES intervenant (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table volume_hebdomadaire
--
ALTER TABLE volume_hebdomadaire
  ADD CONSTRAINT FK_8665328E1F1F2A24 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
