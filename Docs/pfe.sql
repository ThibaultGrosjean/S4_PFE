-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 03 juin 2021 à 15:22
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
(8, 'M1101 - Algorithmique et Programmation', 'M1101', 'M1101', 3, 0, 27, 33.5, 42, 'hebdo', 1, 1, 1, 1, NULL, NULL, NULL, NULL, 1, 4, 8, 2, 6),
(9, 'M1102 - Architecture, Systèmes et Réseaux', 'M1102', 'M1102', 3, 1, 17, 26.5, 34, 'hebdo', 1, 1, 1, 1, NULL, NULL, NULL, NULL, 1, 4, 8, 2, 6);

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

-- --------------------------------------------------------

--
-- Structure de la table ` groupe_intervenant`
--

CREATE TABLE ` groupe_intervenant` (
  `id` int NOT NULL,
  `element_id` int DEFAULT NULL,
  `intervenant_id` int DEFAULT NULL,
  `num_semaine` int NOT NULL,
  `nb_groupe_cm` int NOT NULL,
  `nb_groupe_td` int NOT NULL,
  `nb_groupe_tp` int NOT NULL,
  `nb_groupe_partiel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `groupe_sous_total`
--

CREATE TABLE `groupe_sous_total` (
  `id_limite_sous_total` int NOT NULL,
  `id_element` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(1, 1, 1, 10, 15, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `limite_sous_total`
--

CREATE TABLE `limite_sous_total` (
  `id` int NOT NULL,
  `nom` varchar(255) NOT NULL,
  `limite_eqTD` float NOT NULL,
  `id_projet` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(1, 'Test Projet', '2021-05-31', 0, 1);

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
(1, ' Professeur des Universités', 'PU', 192, 192, 0, 100),
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
-- Index pour la table ` groupe_intervenant`
--
ALTER TABLE ` groupe_intervenant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_394A1E7D1F1F2A24` (`element_id`),
  ADD KEY `IDX_394A1E7DAB9A1716` (`intervenant_id`);

--
-- Index pour la table `groupe_sous_total`
--
ALTER TABLE `groupe_sous_total`
  ADD KEY `id_limite_sous_total` (`id_limite_sous_total`),
  ADD KEY `id_element` (`id_element`);

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
  ADD KEY `id_projet` (`id_projet`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table ` groupe_intervenant`
--
ALTER TABLE ` groupe_intervenant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervenant`
--
ALTER TABLE `intervenant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table `periode`
--
ALTER TABLE `periode`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `projet`
--
ALTER TABLE `projet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `statut`
--
ALTER TABLE `statut`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `volume_globale`
--
ALTER TABLE `volume_globale`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `volume_hebdomadaire`
--
ALTER TABLE `volume_hebdomadaire`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
-- Contraintes pour la table ` groupe_intervenant`
--
ALTER TABLE ` groupe_intervenant`
  ADD CONSTRAINT `FK_394A1E7D1F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`),
  ADD CONSTRAINT `FK_394A1E7DAB9A1716` FOREIGN KEY (`intervenant_id`) REFERENCES `intervenant` (`id`);

--
-- Contraintes pour la table `groupe_sous_total`
--
ALTER TABLE `groupe_sous_total`
  ADD CONSTRAINT `groupe_sous_total_ibfk_1` FOREIGN KEY (`id_element`) REFERENCES `element` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groupe_sous_total_ibfk_2` FOREIGN KEY (`id_limite_sous_total`) REFERENCES `limite_sous_total` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `limite_sous_total_ibfk_1` FOREIGN KEY (`id_projet`) REFERENCES `projet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
