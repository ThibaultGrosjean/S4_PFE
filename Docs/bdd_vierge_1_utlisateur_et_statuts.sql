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

-- --------------------------------------------------------

--
-- Structure de la table groupe_sous_total
--

CREATE TABLE groupe_sous_total (
  limite_sous_total_id int NOT NULL,
  element_id int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table groupe_statut_limite
--

CREATE TABLE groupe_statut_limite (
  statut_id int NOT NULL,
  limite_id int NOT NULL,
  limite int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

-- --------------------------------------------------------

--
-- Structure de la table limite_sous_total
--

CREATE TABLE limite_sous_total (
  id int NOT NULL,
  nom_limite varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  projet_id int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  nb_he_td_max_sup float NOT NULL,
  verrou tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table statut
--

INSERT INTO statut (id, nom, surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup, verrou) VALUES
(1, 'Professeur des Universités', 'PU', 192, 192, 0, 100, 1),
(2, 'Maître de Conférence', 'MCF', 192, 192, 0, 100, 1),
(3, 'Professeur agrégé', 'PRAG', 384, 384, 0, 200, 1),
(4, 'Professeur certifié', 'PRCE', 384, 384, 0, 200, 1),
(5, 'Vacataire', 'VAC', 0, 64, 0, 0, 1);

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
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table enseignant
--
ALTER TABLE enseignant
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table formation
--
ALTER TABLE formation
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table groupe_intervenant
--
ALTER TABLE groupe_intervenant
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table intervenant
--
ALTER TABLE intervenant
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table limite_sous_total
--
ALTER TABLE limite_sous_total
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table periode
--
ALTER TABLE periode
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table projet
--
ALTER TABLE projet
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

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
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT pour la table volume_hebdomadaire
--
ALTER TABLE volume_hebdomadaire
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

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
