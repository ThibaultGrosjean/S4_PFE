-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : sam. 22 mai 2021 à 11:16
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
-- Structure de la table `bilan`
--

CREATE TABLE `bilan` (
  `id` int NOT NULL,
  `projet_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `bilan_sous_total`
--

CREATE TABLE `bilan_sous_total` (
  `bilan_id` int NOT NULL,
  `sous_total_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `element`
--

CREATE TABLE `element` (
  `id` int NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `niveau` int DEFAULT NULL,
  `indice` int NOT NULL,
  `vol_hor_total_prevues_etu_cm` int DEFAULT NULL,
  `vol_hor_total_prevues_etu_td` int DEFAULT NULL,
  `vol_hor_total_prevues_etu_tp` int DEFAULT NULL,
  `mode_saisie` enum('aucun','hebdo','globale') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cm_autorises` tinyint(1) NOT NULL,
  `td_autorises` tinyint(1) NOT NULL,
  `tp_autorises` tinyint(1) NOT NULL,
  `partiel_autorises` tinyint(1) NOT NULL,
  `forfait_globale_cm` int NOT NULL,
  `forfait_globale_td` int NOT NULL,
  `forfait_globale_tp` int NOT NULL,
  `forfait_globale_partiel` int NOT NULL,
  `nb_groupe_effectif_cm` int NOT NULL,
  `nb_groupe_effectif_td` int NOT NULL,
  `nb_groupe_effectif_tp` int NOT NULL,
  `nb_groupe_effectif_partiel` int NOT NULL,
  `parent` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `element_canva`
--

CREATE TABLE `element_canva` (
  `id` int NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `niveau` int DEFAULT NULL,
  `indice` int DEFAULT NULL,
  `vol_hor_prevues_etu_cm` int DEFAULT NULL,
  `vol_hor_prevues_etu_td` int DEFAULT NULL,
  `vol_hor_prevues_etu_tp` int DEFAULT NULL,
  `date_de_creation` date DEFAULT NULL,
  `parent` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `enseignant`
--

CREATE TABLE `enseignant` (
  `id` int NOT NULL,
  `statut_id` int DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Structure de la table `groupe_enseignant`
--

CREATE TABLE `groupe_enseignant` (
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
-- Structure de la table `intervenant`
--

CREATE TABLE `intervenant` (
  `id` int NOT NULL,
  `projet_id` int DEFAULT NULL,
  `enseignant_id` int DEFAULT NULL,
  `nb_he_td_min_attendu_projet` int NOT NULL,
  `nb_he_td_max_attendu_projet` int NOT NULL,
  `nb_he_td_min_sup_projet` int NOT NULL,
  `nb_he_td_max_sup_projet` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention`
--

CREATE TABLE `intervention` (
  `id` int NOT NULL,
  `element_id` int DEFAULT NULL,
  `intervenant_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `limite`
--

CREATE TABLE `limite` (
  `id` int NOT NULL,
  `limite_cm` int NOT NULL,
  `limite_td` int NOT NULL,
  `limite_tp` int NOT NULL,
  `limite_partiel` int NOT NULL,
  `limite_he_td` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `verrou` tinyint(1) NOT NULL,
  `archive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sous_total`
--

CREATE TABLE `sous_total` (
  `id` int NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sous_total_element`
--

CREATE TABLE `sous_total_element` (
  `sous_total_id` int NOT NULL,
  `element_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sous_total_limite`
--

CREATE TABLE `sous_total_limite` (
  `sous_total_id` int NOT NULL,
  `limite_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `statut`
--

CREATE TABLE `statut` (
  `id` int NOT NULL,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surnom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nb_he_td_min_attendu` int NOT NULL,
  `nb_he_td_max_attendu` int NOT NULL,
  `nb_he_td_min_sup` int NOT NULL,
  `nb_he_td_max_sup` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `volume_globale`
--

CREATE TABLE `volume_globale` (
  `id` int NOT NULL,
  `intervenant_id` int DEFAULT NULL,
  `element_id` int DEFAULT NULL,
  `num_semaine` int NOT NULL,
  `vol_hor_cm` int NOT NULL,
  `vol_hor_td` int NOT NULL,
  `vol_hor_tp` int NOT NULL,
  `vol_hor_partiel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `volume_hebdomadaire`
--

CREATE TABLE `volume_hebdomadaire` (
  `id` int NOT NULL,
  `element_id` int DEFAULT NULL,
  `num_semaine` int NOT NULL,
  `vol_hor_cm` int NOT NULL,
  `vol_hor_td` int NOT NULL,
  `vol_hor_tp` int NOT NULL,
  `vol_hor_partiel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bilan`
--
ALTER TABLE `bilan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_F4DF4F44C18272` (`projet_id`);

--
-- Index pour la table `bilan_sous_total`
--
ALTER TABLE `bilan_sous_total`
  ADD PRIMARY KEY (`bilan_id`,`sous_total_id`),
  ADD KEY `IDX_673FB3DB705F7C57` (`bilan_id`),
  ADD KEY `IDX_673FB3DBE4990DE9` (`sous_total_id`);

--
-- Index pour la table `element`
--
ALTER TABLE `element`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent` (`parent`);

--
-- Index pour la table `element_canva`
--
ALTER TABLE `element_canva`
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
-- Index pour la table `groupe_enseignant`
--
ALTER TABLE `groupe_enseignant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_394A1E7D1F1F2A24` (`element_id`),
  ADD KEY `IDX_394A1E7DAB9A1716` (`intervenant_id`);

--
-- Index pour la table `intervenant`
--
ALTER TABLE `intervenant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_73D0145CC18272` (`projet_id`),
  ADD KEY `IDX_73D0145CE455FCC0` (`enseignant_id`);

--
-- Index pour la table `intervention`
--
ALTER TABLE `intervention`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D11814AB1F1F2A24` (`element_id`),
  ADD KEY `IDX_D11814ABAB9A1716` (`intervenant_id`);

--
-- Index pour la table `limite`
--
ALTER TABLE `limite`
  ADD PRIMARY KEY (`id`);

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
-- Index pour la table `sous_total`
--
ALTER TABLE `sous_total`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sous_total_element`
--
ALTER TABLE `sous_total_element`
  ADD PRIMARY KEY (`sous_total_id`,`element_id`),
  ADD KEY `IDX_883BFAC4E4990DE9` (`sous_total_id`),
  ADD KEY `IDX_883BFAC41F1F2A24` (`element_id`);

--
-- Index pour la table `sous_total_limite`
--
ALTER TABLE `sous_total_limite`
  ADD PRIMARY KEY (`sous_total_id`,`limite_id`),
  ADD KEY `IDX_D593F699E4990DE9` (`sous_total_id`),
  ADD KEY `IDX_D593F699CFCAF325` (`limite_id`);

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
-- AUTO_INCREMENT pour la table `bilan`
--
ALTER TABLE `bilan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `element`
--
ALTER TABLE `element`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `element_canva`
--
ALTER TABLE `element_canva`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `groupe_enseignant`
--
ALTER TABLE `groupe_enseignant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervenant`
--
ALTER TABLE `intervenant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention`
--
ALTER TABLE `intervention`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `limite`
--
ALTER TABLE `limite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT pour la table `sous_total`
--
ALTER TABLE `sous_total`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `statut`
--
ALTER TABLE `statut`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
-- Contraintes pour la table `bilan`
--
ALTER TABLE `bilan`
  ADD CONSTRAINT `FK_F4DF4F44C18272` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`);

--
-- Contraintes pour la table `bilan_sous_total`
--
ALTER TABLE `bilan_sous_total`
  ADD CONSTRAINT `FK_673FB3DB705F7C57` FOREIGN KEY (`bilan_id`) REFERENCES `bilan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_673FB3DBE4990DE9` FOREIGN KEY (`sous_total_id`) REFERENCES `sous_total` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `element`
--
ALTER TABLE `element`
  ADD CONSTRAINT `element_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `element` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `element_canva`
--
ALTER TABLE `element_canva`
  ADD CONSTRAINT `element_canva_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `element_canva` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Contraintes pour la table `groupe_enseignant`
--
ALTER TABLE `groupe_enseignant`
  ADD CONSTRAINT `FK_394A1E7D1F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`),
  ADD CONSTRAINT `FK_394A1E7DAB9A1716` FOREIGN KEY (`intervenant_id`) REFERENCES `intervenant` (`id`);

--
-- Contraintes pour la table `intervenant`
--
ALTER TABLE `intervenant`
  ADD CONSTRAINT `FK_73D0145CC18272` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`),
  ADD CONSTRAINT `FK_73D0145CE455FCC0` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`id`);

--
-- Contraintes pour la table `intervention`
--
ALTER TABLE `intervention`
  ADD CONSTRAINT `FK_D11814AB1F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`),
  ADD CONSTRAINT `FK_D11814ABAB9A1716` FOREIGN KEY (`intervenant_id`) REFERENCES `intervenant` (`id`);

--
-- Contraintes pour la table `periode`
--
ALTER TABLE `periode`
  ADD CONSTRAINT `FK_93C32DF31F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`);

--
-- Contraintes pour la table `sous_total_element`
--
ALTER TABLE `sous_total_element`
  ADD CONSTRAINT `FK_883BFAC41F1F2A24` FOREIGN KEY (`element_id`) REFERENCES `element` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_883BFAC4E4990DE9` FOREIGN KEY (`sous_total_id`) REFERENCES `sous_total` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sous_total_limite`
--
ALTER TABLE `sous_total_limite`
  ADD CONSTRAINT `FK_D593F699CFCAF325` FOREIGN KEY (`limite_id`) REFERENCES `limite` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D593F699E4990DE9` FOREIGN KEY (`sous_total_id`) REFERENCES `sous_total` (`id`) ON DELETE CASCADE;

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
