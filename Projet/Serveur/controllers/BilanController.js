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


exports.getAllBilanByProjetIntervenant = (req, res) => {
  db.query('SELECT g.intervenant_id, e.prenom, e.nom, i.nb_he_td_min_attendu_projet, i.nb_he_td_max_attendu_projet, i.nb_he_td_min_sup_projet, i.nb_he_td_max_sup_projet'
      +' , SUM(v.vol_hor_cm * g.nb_groupe_cm) AS total_cm'
      +' , SUM(v.vol_hor_td * g.nb_groupe_td) AS total_td'
      +' , SUM(v.vol_hor_tp * g.nb_groupe_tp) AS total_tp'
      +' , SUM(v.vol_hor_partiel * g.nb_groupe_partiel) AS total_partiel'
      +' , (SUM(v.vol_hor_cm * g.nb_groupe_cm) + SUM(v.vol_hor_td * g.nb_groupe_td) + SUM(v.vol_hor_tp * g.nb_groupe_tp) + SUM(v.vol_hor_partiel * g.nb_groupe_partiel)) AS total_general'
      +' , CASE WHEN((SUM(v.vol_hor_cm * g.nb_groupe_cm) + SUM(v.vol_hor_td * g.nb_groupe_td)  + SUM(v.vol_hor_tp * g.nb_groupe_tp)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel)) - i.nb_he_td_max_attendu_projet) > 0 THEN ((SUM(v.vol_hor_cm * g.nb_groupe_cm) + SUM(v.vol_hor_td * g.nb_groupe_td)  + SUM(v.vol_hor_tp * g.nb_groupe_tp)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel)) - i.nb_he_td_max_attendu_projet) ELSE 0 END AS total_heures_sup'
      +' FROM groupe_intervenant AS g'
      +' JOIN intervenant AS i'
      +' ON i.id = g.intervenant_id'
      +' JOIN enseignant AS e'
      +' ON e.id = i.enseignant_id'
      +' LEFT JOIN volume_hebdomadaire AS v'
      +' ON g.element_id = v.element_id AND g.num_semaine = v.num_semaine'
      +' WHERE g.intervenant_id IN (SELECT i.id FROM intervenant AS i WHERE i.projet_id = ?)'
      +' GROUP BY g.intervenant_id;',[req.params.id],
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