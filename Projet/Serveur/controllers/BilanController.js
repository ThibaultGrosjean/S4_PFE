var db = require('../models/bdd');

exports.getAllLimiteSousTotal = (req, res) => {
  db.query('SELECT * FROM limite_sous_total ORDER BY id_projet, nom;',
    function(err, limite_sous_total) {
      if (!err) {
        res.status(200).json(limite_sous_total);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getAllLimiteSousTotalByProjet = (req, res) => {
  db.query('SELECT * FROM limite_sous_total WHERE id_projet = ? ORDER BY id_projet, nom;',[req.params.id],
    function(err, limite_sous_total) {
      if (!err) {
        res.status(200).json(limite_sous_total);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getAllGroupeSousTotal = (req, res) => {
  db.query('SELECT * FROM groupe_sous_total;',
    function(err, groupe_sous_total) {
      if (!err) {
        res.status(200).json(groupe_sous_total);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getAllGroupeSousByLimiteSousTotal = (req, res) => {
  db.query('SELECT * FROM limite_sous_total WHERE id_limite_sous_total = ? ;',[req.params.id],
    function(err, limite_sous_total) {
      if (!err) {
        res.status(200).json(limite_sous_total);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


/**
 *  La requête récupère les informations de l'intervenant : nom, prénom, HeTd... 
 * Ensuite on fait la somme des heures hebdomadaires pour tous les types de cours
 * La somme des volumes hebdo. ce fait avec les volumes horaires prévus pour un étudiant multipliés par les nombres de groupes gérés par l'intervenant. 
 * La somme générale ce fait en additionnant la somme des volumes hebdo.
 * Les heures supp. sont calculées en réduisant le nombre max HeTD à la somme générale, si le résultat est négatif alors il est égal 0. 
 */ 
exports.getAllBilanByProjetIntervenant = (req, res) => {
  db.query('SELECT g.intervenant_id, e.prenom, e.nom, i.nb_he_td_min_attendu_projet, i.nb_he_td_max_attendu_projet, i.nb_he_td_min_sup_projet, i.nb_he_td_max_sup_projet'
        +' , SUM(v.vol_hor_cm * g.nb_groupe_cm) AS total_cm'
        +' , SUM(v.vol_hor_td * g.nb_groupe_td) AS total_td'
        +' , SUM(v.vol_hor_tp * g.nb_groupe_tp) AS total_tp'
        +' , SUM(v.vol_hor_partiel * g.nb_groupe_partiel) AS total_partiel'
        +' , (SUM(v.vol_hor_cm * g.nb_groupe_cm) + SUM(v.vol_hor_td * g.nb_groupe_td)  + SUM(v.vol_hor_tp * g.nb_groupe_tp)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel)) AS total_general'
        +' , CASE WHEN((SUM(v.vol_hor_cm * g.nb_groupe_cm) + SUM(v.vol_hor_td * g.nb_groupe_td)  + SUM(v.vol_hor_tp * g.nb_groupe_tp)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel)) - i.nb_he_td_max_attendu_projet) > 0 THEN ((SUM(v.vol_hor_cm * g.nb_groupe_cm) + SUM(v.vol_hor_td * g.nb_groupe_td)  + SUM(v.vol_hor_tp * g.nb_groupe_tp)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel)) - i.nb_he_td_max_attendu_projet) ELSE 0 END AS total_heures_sup'
        +' FROM groupe_intervenant AS g'
        +' JOIN intervenant AS i'
        +' ON i.id = g.intervenant_id'
        +' JOIN enseignant AS e'
        +' ON e.id = i.enseignant_id'
        +' LEFT JOIN volume_hebdomadaire AS v'
        +' ON g.element_id = v.element_id AND g.num_semaine = v.num_semaine'
        +' WHERE g.intervenant_id IN (SELECT i.id FROM intervenant AS i WHERE i.projet_id = ' + req.params.id + ')'
        +' GROUP BY g.intervenant_id',
    function(err, bilan) {
      if (!err) {
        res.status(200).json(bilan);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


/**
 *  La requête récupère les informations de l'intervenant : nom, prénom, HeTd... 
 * Ensuite on fait la somme des heures hebdomadaires et globales pour tous les types de cours
 * La somme des volumes hebdo. ce fait avec les volumes horaires prévus pour un étudiant multipliés par les nombres de groupes gérés par l'intervenant. 
 * La somme des volumes globaux ce fait avec les forfaits horaires prévus dans le module multipliés par les nombres de groupes gérés par l'intervenant. 
 * La somme générale ce fait en additionnant la somme des volumes hebdo. et la somme des volumes globaux
 * Les heures supp. sont calculées en réduisant le nombre max HeTD à la somme générale, si le résultat est négatif alors il est égal 0. 
 */ 
exports.getAllBilanByProjetIntervenantWithVolGlobale = (req, res) => {
  db.query('SELECT g.intervenant_id, e.prenom, e.nom, i.nb_he_td_min_attendu_projet, i.nb_he_td_max_attendu_projet, i.nb_he_td_min_sup_projet, i.nb_he_td_max_sup_projet'
      +' , (SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0)) AS total_cm'
      +' , (SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0))  AS total_td'
      +' , (SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)) AS total_tp'
      +' , (SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) AS total_partiel'
      +' , (SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0) + SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0)  + SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) AS total_general'
      +' , CASE WHEN((SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0) + SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0)  + SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) - i.nb_he_td_max_attendu_projet) > 0 THEN ((SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0) + SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0)  + SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) - i.nb_he_td_max_attendu_projet) ELSE 0 END AS total_heures_sup'
      +' FROM groupe_intervenant AS g'
      +' JOIN intervenant AS i'
      +' ON i.id = g.intervenant_id'
      +' JOIN enseignant AS e'
      +' ON e.id = i.enseignant_id'
      +' LEFT JOIN volume_hebdomadaire AS v'
      +' ON g.element_id = v.element_id AND g.num_semaine = v.num_semaine'
      +' LEFT JOIN ('
      +'     SELECT intervenant_id AS id'
      +'   , SUM(IFNULL(vol_hor_cm * el.forfait_globale_cm, 0)) AS total_volume_globale_cm'
      +'   , SUM(IFNULL(vol_hor_td * el.forfait_globale_td, 0)) AS total_volume_globale_td'
      +'   , SUM(IFNULL(vol_hor_tp * el.forfait_globale_tp, 0)) AS total_volume_globale_tp'
      +'   , SUM(IFNULL(vol_hor_partiel * el.forfait_globale_partiel, 0)) AS total_volume_globale_partiel'
      +'   FROM volume_globale'
      +'   LEFT JOIN element AS el'
      +'   ON element_id = el.id'
      +'   WHERE intervenant_id IN (SELECT i2.id FROM intervenant AS i2 WHERE i2.projet_id = ' + req.params.id + ')'
      +'   GROUP BY intervenant_id)'
      +' AS vgt'
      +' ON vgt.id = i.id'
      +' WHERE g.intervenant_id IN (SELECT i.id FROM intervenant AS i WHERE i.projet_id = ' + req.params.id + ')'
      +' GROUP BY g.intervenant_id, vgt.total_volume_globale_cm, vgt.total_volume_globale_td, vgt.total_volume_globale_tp, vgt.total_volume_globale_partiel',
    function(err, bilan) {
      if (!err) {
        res.status(200).json(bilan);  
      }
      else {
        res.send(err);
      }
    }
  );  
};