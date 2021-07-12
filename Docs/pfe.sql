-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 12 juil. 2021 à 14:01
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
-- Base de données : `pfe`
--
DROP TABLE element, enseignant, formation, groupe_intervenant, groupe_sous_total, intervenant, limite_sous_total, periode, projet, statut, volume_globale, volume_hebdomadaire;
-- --------------------------------------------------------

--
-- Structure de la table `element`
--

CREATE TABLE `element` (
  `id` int NOT NULL,
  `titre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `niveau` int NOT NULL,
  `indice` int NOT NULL,
  `vol_hor_total_prevues_etu_cm` float DEFAULT NULL,
  `vol_hor_total_prevues_etu_td` float DEFAULT NULL,
  `vol_hor_total_prevues_etu_tp` float DEFAULT NULL,
  `mode_saisie` enum('aucun','hebdo','globale') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cm_autorises` tinyint(1) NOT NULL DEFAULT '0',
  `td_autorises` tinyint(1) NOT NULL DEFAULT '0',
  `tp_autorises` tinyint(1) NOT NULL DEFAULT '0',
  `partiel_autorises` tinyint(1) NOT NULL DEFAULT '0',
  `forfait_globale_cm` float DEFAULT NULL,
  `forfait_globale_td` float DEFAULT NULL,
  `forfait_globale_tp` float DEFAULT NULL,
  `forfait_globale_partiel` float DEFAULT NULL,
  `nb_groupe_effectif_cm` int DEFAULT NULL,
  `nb_groupe_effectif_td` int DEFAULT NULL,
  `nb_groupe_effectif_tp` int DEFAULT NULL,
  `nb_groupe_effectif_partiel` int DEFAULT NULL,
  `parent` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `element`
--

INSERT INTO `element` (`id`, `titre`, `surnom`, `code`, `niveau`, `indice`, `vol_hor_total_prevues_etu_cm`, `vol_hor_total_prevues_etu_td`, `vol_hor_total_prevues_etu_tp`, `mode_saisie`, `cm_autorises`, `td_autorises`, `tp_autorises`, `partiel_autorises`, `forfait_globale_cm`, `forfait_globale_td`, `forfait_globale_tp`, `forfait_globale_partiel`, `nb_groupe_effectif_cm`, `nb_groupe_effectif_td`, `nb_groupe_effectif_tp`, `nb_groupe_effectif_partiel`, `parent`) VALUES
(1, 'DUT Informatique IUT Belfort-Montbéliard', 'DUT Info', 'DUTI', 0, 0, NULL, NULL, NULL, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Semestre 1', 'S1', 'S1', 1, 0, NULL, NULL, NULL, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(3, 'Semestre 2', 'S2', 'S2', 1, 1, NULL, NULL, NULL, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(4, 'Semestre 3', 'S3', 'S3', 1, 2, NULL, NULL, NULL, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(5, 'Semestre 4', 'S4', 'S4', 1, 3, NULL, NULL, NULL, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(6, 'UE 11: Informatique', 'UE11', 'UE11', 2, 0, 44, 60, 76, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2),
(7, 'UE 12: Connaissances et compétences générales', 'UE12', 'UE12', 2, 1, NULL, NULL, NULL, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2),
(8, 'M1101 - Algorithmique et Programmation', 'M1101', 'M1101', 3, 0, 19, 16, 16, 'hebdo', 1, 1, 1, 1, NULL, NULL, NULL, NULL, 1, 4, 8, 2, 6),
(9, 'M1102 - Architecture, Systèmes et Réseaux', 'M1102', 'M1102', 3, 1, 2, 1, 2, 'hebdo', 1, 1, 1, 1, NULL, NULL, NULL, NULL, 1, 4, 8, 2, 6),
(10, 'UE 41 : Stage', 'UE41', 'UE41', 2, 0, 0, 0, 0, 'aucun', 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5),
(11, 'M 4101 : Stage', 'M4101', 'M4101', 3, 0, 0, 0, 0, 'globale', 0, 1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 10),
(12, 'UE 42 : Projet tuteuré', 'UE42 Ptut', 'UE42', 2, 1, 0, 0, 0, 'aucun', 1, 1, 1, 1, 0, 0, 0, 0, 1, 3, 6, 2, 5),
(13, 'M 4201 : Projet tuteuré', 'M4201', 'M4201', 3, 0, 0, 0, 0, 'globale', 0, 1, 0, 0, 0, 2, 0, 0, 1, 3, 6, 2, 12);

-- --------------------------------------------------------

--
-- Structure de la table `enseignant`
--

CREATE TABLE `enseignant` (
  `id` int NOT NULL,
  `statut_id` int DEFAULT NULL,
  `prenom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `enseignant`
--

INSERT INTO `enseignant` (`id`, `statut_id`, `prenom`, `nom`, `surnom`, `email`) VALUES
(1, 1, 'Gérard', 'Dupond', 'GDU', 'gerard.dupond@testmail.com'),
(2, 4, 'Jean-Louis', 'Martin', 'JLM', 'jeanlouis.martin@testmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE `formation` (
  `id` int NOT NULL,
  `projet_id` int DEFAULT NULL,
  `element_id` int DEFAULT NULL,
  `verrou` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `formation`
--

INSERT INTO `formation` (`id`, `projet_id`, `element_id`, `verrou`) VALUES
(1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `groupe_intervenant`
--

CREATE TABLE `groupe_intervenant` (
  `id` int NOT NULL,
  `element_id` int DEFAULT NULL,
  `intervenant_id` int DEFAULT NULL,
  `num_semaine` int NOT NULL,
  `nb_groupe_cm` int NOT NULL,
  `nb_groupe_td` int NOT NULL,
  `nb_groupe_tp` int NOT NULL,
  `nb_groupe_partiel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `groupe_intervenant`
--

INSERT INTO `groupe_intervenant` (`id`, `element_id`, `intervenant_id`, `num_semaine`, `nb_groupe_cm`, `nb_groupe_td`, `nb_groupe_tp`, `nb_groupe_partiel`) VALUES
(1, 9, 1, 1, 1, 1, 3, 1),
(2, 9, 1, 2, 1, 1, 3, 1),
(3, 9, 1, 3, 1, 1, 3, 1),
(4, 9, 1, 4, 1, 1, 3, 1),
(5, 9, 1, 5, 1, 1, 3, 1),
(6, 9, 1, 6, 1, 1, 3, 1),
(7, 9, 1, 7, 1, 1, 3, 1),
(8, 9, 1, 8, 1, 1, 3, 1),
(9, 9, 1, 9, 1, 1, 3, 1),
(10, 9, 1, 10, 1, 1, 3, 1),
(11, 9, 1, 11, 0, 0, 0, 1),
(12, 9, 2, 1, 3, 1, 1, 1),
(13, 9, 2, 2, 1, 1, 1, 1),
(14, 9, 2, 3, 1, 1, 1, 1),
(15, 9, 2, 4, 1, 1, 1, 1),
(16, 9, 2, 5, 1, 1, 1, 1),
(17, 9, 2, 6, 1, 1, 1, 1),
(18, 9, 2, 7, 1, 1, 1, 1),
(19, 9, 2, 8, 1, 1, 1, 1),
(20, 9, 2, 9, 1, 1, 1, 1),
(21, 9, 2, 10, 1, 1, 1, 1),
(22, 9, 2, 11, 0, 0, 0, 1),
(23, 8, 1, 1, 1, 2, 6, 0),
(24, 8, 1, 2, 1, 2, 6, 0),
(25, 8, 1, 3, 1, 2, 6, 0),
(26, 8, 1, 4, 1, 2, 6, 0),
(27, 8, 1, 5, 1, 2, 6, 0),
(28, 8, 1, 6, 1, 2, 6, 0),
(29, 8, 1, 7, 1, 2, 6, 0),
(30, 8, 1, 8, 1, 2, 6, 0),
(31, 8, 1, 9, 1, 2, 6, 0),
(32, 8, 1, 10, 1, 2, 6, 0),
(33, 8, 1, 11, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Structure de la table `groupe_sous_total`
--

CREATE TABLE `groupe_sous_total` (
  `limite_sous_total_id` int NOT NULL,
  `element_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `groupe_sous_total`
--

INSERT INTO `groupe_sous_total` (`limite_sous_total_id`, `element_id`) VALUES
(1, 11),
(1, 13);

-- --------------------------------------------------------

--
-- Structure de la table `intervenant`
--

CREATE TABLE `intervenant` (
  `id` int NOT NULL,
  `projet_id` int DEFAULT NULL,
  `enseignant_id` int DEFAULT NULL,
  `nb_he_td_min_attendu_projet` float NOT NULL,
  `nb_he_td_max_attendu_projet` float NOT NULL,
  `nb_he_td_min_sup_projet` float NOT NULL,
  `nb_he_td_max_sup_projet` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `intervenant`
--

INSERT INTO `intervenant` (`id`, `projet_id`, `enseignant_id`, `nb_he_td_min_attendu_projet`, `nb_he_td_max_attendu_projet`, `nb_he_td_min_sup_projet`, `nb_he_td_max_sup_projet`) VALUES
(1, 1, 1, 192, 192, 0, 100),
(2, 1, 2, 384, 384, 0, 200);

-- --------------------------------------------------------

--
-- Structure de la table `limite_sous_total`
--

CREATE TABLE `limite_sous_total` (
  `id` int NOT NULL,
  `nom` varchar(255) NOT NULL,
  `limite_he_td` int NOT NULL DEFAULT '0',
  `projet_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `limite_sous_total`
--

INSERT INTO `limite_sous_total` (`id`, `nom`, `limite_he_td`, `projet_id`) VALUES
(1, 'Référentiel', 50, 1);

-- --------------------------------------------------------

--
-- Structure de la table `periode`
--

CREATE TABLE `periode` (
  `id` int NOT NULL,
  `element_id` int DEFAULT NULL,
  `nb_semaine` int NOT NULL,
  `nb_groupe_defaut_cm` int NOT NULL,
  `nb_groupe_defaut_td` int NOT NULL,
  `nb_groupe_defaut_tp` int NOT NULL,
  `nb_groupe_defaut_partiel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `periode`
--

INSERT INTO `periode` (`id`, `element_id`, `nb_semaine`, `nb_groupe_defaut_cm`, `nb_groupe_defaut_td`, `nb_groupe_defaut_tp`, `nb_groupe_defaut_partiel`) VALUES
(1, 2, 11, 1, 4, 8, 2),
(2, 3, 10, 1, 4, 8, 2),
(3, 4, 10, 1, 4, 8, 2),
(4, 5, 10, 1, 3, 6, 2);

-- --------------------------------------------------------

--
-- Structure de la table `projet`
--

CREATE TABLE `projet` (
  `id` int NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `verrou` tinyint(1) NOT NULL,
  `archive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `projet`
--

INSERT INTO `projet` (`id`, `nom`, `date`, `verrou`, `archive`) VALUES
(1, 'Test Projet', '2021-05-30', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `statut`
--

CREATE TABLE `statut` (
  `id` int NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nb_he_td_min_attendu` float NOT NULL,
  `nb_he_td_max_attendu` float NOT NULL,
  `nb_he_td_min_sup` float NOT NULL,
  `nb_he_td_max_sup` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `statut`
--

INSERT INTO `statut` (`id`, `nom`, `surnom`, `nb_he_td_min_attendu`, `nb_he_td_max_attendu`, `nb_he_td_min_sup`, `nb_he_td_max_sup`) VALUES
(1, 'Professeur des Universités', 'PU', 192, 192, 0, 100),
(2, 'Maître de Conférence', 'MCF', 192, 192, 0, 100),
(3, 'Professeur agrégé', 'PRAG', 384, 384, 0, 200),
(4, 'Professeur certifié', 'PRCE', 384, 384, 0, 200),
(5, 'Vacataire', 'VAC', 0, 64, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `volume_globale`
--

CREATE TABLE `volume_globale` (
  `id` int NOT NULL,
  `intervenant_id` int DEFAULT NULL,
  `element_id` int DEFAULT NULL,
  `num_semaine` int NOT NULL,
  `vol_hor_cm` float NOT NULL,
  `vol_hor_td` float NOT NULL,
  `vol_hor_tp` float NOT NULL,
  `vol_hor_partiel` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `volume_globale`
--

INSERT INTO `volume_globale` (`id`, `intervenant_id`, `element_id`, `num_semaine`, `vol_hor_cm`, `vol_hor_td`, `vol_hor_tp`, `vol_hor_partiel`) VALUES
(1, 2, 11, 1, 0, 5, 0, 0),
(2, 1, 13, 1, 0, 3, 0, 0),
(3, 2, 13, 1, 0, 2, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `volume_hebdomadaire`
--

CREATE TABLE `volume_hebdomadaire` (
  `id` int NOT NULL,
  `element_id` int DEFAULT NULL,
  `num_semaine` int NOT NULL,
  `vol_hor_cm` float NOT NULL,
  `vol_hor_td` float NOT NULL,
  `vol_hor_tp` float NOT NULL,
  `vol_hor_partiel` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `volume_hebdomadaire`
--

INSERT INTO `volume_hebdomadaire` (`id`, `element_id`, `num_semaine`, `vol_hor_cm`, `vol_hor_td`, `vol_hor_tp`, `vol_hor_partiel`) VALUES
(1, 8, 1, 1, 1, 1.5, 0),
(2, 8, 3, 1, 1, 1.5, 0),
(3, 8, 2, 1, 1, 1.5, 0),
(4, 8, 4, 1, 1, 1.5, 0),
(5, 8, 5, 1, 1, 1.5, 0),
(6, 8, 6, 1, 1, 1.5, 0),
(7, 8, 7, 1, 1, 1.5, 0),
(8, 8, 8, 1, 1, 1.5, 0),
(9, 8, 9, 1, 1, 1.5, 0),
(10, 8, 10, 1, 1, 1.5, 0),
(11, 8, 11, 0, 0, 0, 3),
(13, 9, 1, 1, 1, 2, 0),
(14, 9, 3, 1, 1, 2, 0),
(15, 9, 2, 1, 1, 2, 0),
(16, 9, 4, 1, 1, 2, 0),
(17, 9, 5, 1, 1, 2, 0),
(18, 9, 6, 1, 1, 2, 0),
(19, 9, 7, 1, 1, 2, 0),
(20, 9, 8, 1, 1, 2, 0),
(21, 9, 9, 1, 1, 2, 0),
(22, 9, 10, 1, 1, 2, 0),
(23, 9, 11, 0, 0, 0, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `element`
--
ALTER TABLE `element`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent` (`parent`);

--
-- Index pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_81A72FA1F6203804` (`statut_id`);

--
-- Index pour la table `formation`
--
ALTER TABLE `formation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_404021BFC18272` (`projet_id`),
  ADD KEY `IDX_404021BF1F1F2A24` (`element_id`);

--
-- Index pour la table `groupe_intervenant`
--
ALTER TABLE `groupe_intervenant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_394A1E7D1F1F2A24` (`element_id`),
  ADD KEY `IDX_394A1E7DAB9A1716` (`intervenant_id`);

--
-- Index pour la table `groupe_sous_total`
--
ALTER TABLE `groupe_sous_total`
  ADD KEY `id_limite_sous_total` (`limite_sous_total_id`),
  ADD KEY `id_element` (`element_id`);

--
-- Index pour la table `intervenant`
--
ALTER TABLE `intervenant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_73D0145CC18272` (`projet_id`),
  ADD KEY `IDX_73D0145CE455FCC0` (`enseignant_id`);

--
-- Index pour la table `limite_sous_total`
--
ALTER TABLE `limite_sous_total`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_projet` (`projet_id`);

--
-- Index pour la table `periode`
--
ALTER TABLE `periode`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_93C32DF31F1F2A24` (`element_id`);

--
-- Index pour la table `projet`
--
ALTER TABLE `projet`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `statut`
--
ALTER TABLE `statut`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `volume_globale`
--
ALTER TABLE `volume_globale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F0BC8913AB9A1716` (`intervenant_id`),
  ADD KEY `IDX_F0BC89131F1F2A24` (`element_id`);

--
-- Index pour la table `volume_hebdomadaire`
--
ALTER TABLE `volume_hebdomadaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_8665328E1F1F2A24` (`element_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `element`
--
ALTER TABLE `element`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `groupe_intervenant`
--
ALTER TABLE `groupe_intervenant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `intervenant`
--
ALTER TABLE `intervenant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `limite_sous_total`
--
ALTER TABLE `limite_sous_total`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `periode`
--
ALTER TABLE `periode`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `projet`
--
ALTER TABLE `projet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `statut`
--
ALTER TABLE `statut`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `volume_globale`
--
ALTER TABLE `volume_globale`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `volume_hebdomadaire`
--
ALTER TABLE `volume_hebdomadaire`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `element`
--
ALTER TABLE `element`
  ADD CONSTRAINT `element_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `element` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `enseignant`
--
ALTER TABLE `enseignant`
  ADD CONSTRAINT `FK_81A72FA1F6203804` FOREIGN KEY (`statut_id`) REFERENCES `statut` (`id`);

--
-- Contraintes pour la table `formation`
--
ALTER TABLE `formation`
  ADD CONSTRAINT `FK_404021BF1F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`),
  ADD CONSTRAINT `FK_404021BFC18272` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`);

--
-- Contraintes pour la table `groupe_intervenant`
--
ALTER TABLE `groupe_intervenant`
  ADD CONSTRAINT `FK_394A1E7D1F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`),
  ADD CONSTRAINT `FK_394A1E7DAB9A1716` FOREIGN KEY (`intervenant_id`) REFERENCES `intervenant` (`id`);

--
-- Contraintes pour la table `groupe_sous_total`
--
ALTER TABLE `groupe_sous_total`
  ADD CONSTRAINT `groupe_sous_total_ibfk_1` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groupe_sous_total_ibfk_2` FOREIGN KEY (`limite_sous_total_id`) REFERENCES `limite_sous_total` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `intervenant`
--
ALTER TABLE `intervenant`
  ADD CONSTRAINT `FK_73D0145CC18272` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`),
  ADD CONSTRAINT `FK_73D0145CE455FCC0` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`id`);

--
-- Contraintes pour la table `limite_sous_total`
--
ALTER TABLE `limite_sous_total`
  ADD CONSTRAINT `limite_sous_total_ibfk_1` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `periode`
--
ALTER TABLE `periode`
  ADD CONSTRAINT `FK_93C32DF31F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`);

--
-- Contraintes pour la table `volume_globale`
--
ALTER TABLE `volume_globale`
  ADD CONSTRAINT `FK_F0BC89131F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`),
  ADD CONSTRAINT `FK_F0BC8913AB9A1716` FOREIGN KEY (`intervenant_id`) REFERENCES `intervenant` (`id`);

--
-- Contraintes pour la table `volume_hebdomadaire`
--
ALTER TABLE `volume_hebdomadaire`
  ADD CONSTRAINT `FK_8665328E1F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
