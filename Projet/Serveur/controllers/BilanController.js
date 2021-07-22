var db = require('../models/bdd');
const tools = require('../models/tools');
const { check, validationResult } = require('express-validator');
exports.validationResult = []

exports.validatorLimite = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('limite_he_td',"La limite doit être un numérique non nul").isDecimal(),
  check('projet_id',"Veuillez selectionner un projet").isNumeric(),
];

exports.validatorGroupe = [
  check('limite_sous_total_id ',"Veuillez selectionner une limite").isNumeric(),
  check('element_id',"Veuillez selectionner un element").isNumeric(),
];


exports.getAllGroupeSousTotalByIdLimite = (req, res) => {
  db.query('SELECT element_id FROM groupe_sous_total WHERE limite_sous_total_id = ?;',[req.params.id],
    function(err, groupe_sous_total) {
      if (!err) {
        var obj = []
        for (var i = 0; i < groupe_sous_total.length; i++) {
          obj.push(groupe_sous_total[i].element_id);
        }
        res.status(200).json(obj);  
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
exports.getAllBilanByProjetIntervenant = (req, res) => {
  db.query('SELECT g.intervenant_id, e.prenom, e.nom, i.nb_he_td_min_attendu, i.nb_he_td_max_attendu, i.nb_he_td_min_sup, i.nb_he_td_max_sup'
      +' , (SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0)) AS total_cm'
      +' , (SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0))  AS total_td'
      +' , (SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)) AS total_tp'
      +' , (SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) AS total_partiel'
      +' , (SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0) + SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0)  + SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) AS total_general'
      +' , CASE WHEN((SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0) + SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0)  + SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) - i.nb_he_td_max_attendu) > 0 THEN ((SUM(v.vol_hor_cm * g.nb_groupe_cm) + IFNULL(vgt.total_volume_globale_cm, 0) + SUM(v.vol_hor_td * g.nb_groupe_td) + IFNULL(vgt.total_volume_globale_td, 0)  + SUM(v.vol_hor_tp * g.nb_groupe_tp) + IFNULL(vgt.total_volume_globale_tp, 0)+ SUM(v.vol_hor_partiel * g.nb_groupe_partiel) + IFNULL(vgt.total_volume_globale_partiel, 0)) - i.nb_he_td_max_attendu) ELSE 0 END AS total_heures_sup'
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


exports.getAllBilanSousTotal = (req, res) => {
  db.query('SELECT IFNULL(sl.limite, l.limite_he_td) AS limite , g.intervenant_id, e.prenom, e.nom,l.id, l.nom AS nom_limite'
       +' , IFNULL(vgt.total_volume_globale_cm, 0) AS total_cm'
       +' , IFNULL(vgt.total_volume_globale_td, 0)  AS total_td'
       +' , IFNULL(vgt.total_volume_globale_tp, 0) AS total_tp'
       +' , IFNULL(vgt.total_volume_globale_partiel, 0) AS total_partiel'
       +' ,(IFNULL(vgt.total_volume_globale_cm * 1.5, 0) + IFNULL(vgt.total_volume_globale_td, 0)  + IFNULL(vgt.total_volume_globale_tp, 0) + IFNULL(vgt.total_volume_globale_partiel, 0)) AS total_he_td'
       +' FROM groupe_intervenant AS g'
       +' JOIN intervenant AS i'
       +' ON i.id = g.intervenant_id'
       +' JOIN enseignant AS e'
       +' ON e.id = i.enseignant_id'
       +' JOIN limite_sous_total AS l'
       +' ON l.projet_id = i.projet_id'
       +' JOIN groupe_sous_total AS gst'
       +' ON gst.limite_sous_total_id = l.id'
       +' LEFT JOIN volume_hebdomadaire AS v'
       +' ON g.element_id = v.element_id AND g.num_semaine = v.num_semaine'
       +' LEFT JOIN groupe_statut_limite AS sl'
       +' ON sl.limite_id = l.id AND sl.statut_id = e.statut_id'
       +' LEFT JOIN ('
       +'     SELECT intervenant_id AS id'
       +'   , SUM(IFNULL(vol_hor_cm * el.forfait_globale_cm, 0)) AS total_volume_globale_cm'
       +'   , SUM(IFNULL(vol_hor_td * el.forfait_globale_td, 0)) AS total_volume_globale_td'
       +'   , SUM(IFNULL(vol_hor_tp * el.forfait_globale_tp, 0)) AS total_volume_globale_tp'
       +'   , SUM(IFNULL(vol_hor_partiel * el.forfait_globale_partiel, 0)) AS total_volume_globale_partiel'
       +'   FROM volume_globale'
       +'   LEFT JOIN element AS el'
       +'   ON element_id = el.id'
       +'   WHERE intervenant_id IN (SELECT i2.id FROM intervenant AS i2 WHERE i2.projet_id = ' + req.params.id + '  )'
       +'   AND  element_id IN (SELECT g2.element_id  FROM groupe_sous_total AS g2 JOIN limite_sous_total As l2 On l2.id = g2.limite_sous_total_id WHERE l2.projet_id =  ' + req.params.id + ' )'
       +'   GROUP BY intervenant_id)'
       +' AS vgt'
       +' ON vgt.id = i.id'
       +' WHERE g.intervenant_id IN (SELECT i.id FROM intervenant AS i WHERE i.projet_id =  ' + req.params.id + ' )'
       +' GROUP BY g.intervenant_id, vgt.total_volume_globale_cm, vgt.total_volume_globale_td, vgt.total_volume_globale_tp, vgt.total_volume_globale_partiel, l.id, sl.limite'
       +' ORDER BY l.nom, e.prenom, e.nom',
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


exports.getAllLimiteSousTotalByProjet = (req, res) => {
  db.query('SELECT * FROM limite_sous_total WHERE projet_id = ? ORDER BY projet_id, nom;',[req.params.id],
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


exports.getAllGroupeSousTotalByProjetAndElement = (req, res) => {
  db.query('SELECT g.*, l.nom' 
        +' FROM groupe_sous_total AS g'
        +' JOIN limite_sous_total AS l'
        +' ON l.id = g.limite_sous_total_id'
        +' WHERE l.projet_id = ' + req.params.id + ' AND g.element_id = ' + req.params.element + ';',
    function(err, groupe_sous_total) {
      if (!err) {
        res.status(200).json(groupe_sous_total);  
      }
      else {
        res.send(err);
      }
    }
  )
};


exports.getAllLimiteSousTotalByProjetAndName = (req, res) => {
  db.query('SELECT * FROM limite_sous_total WHERE projet_id = ' + req.params.id + ' AND nom = "' + req.params.nom + '" ORDER BY projet_id, nom;',
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


exports.addLimiteSousTotal = (req, res) => {
  var data = {
    nom : tools.safeStringSQL(req.body.nom),
    limite_he_td : req.body.limite_he_td,
    projet_id : req.body.projet_id,
  };

  var requete="INSERT INTO limite_sous_total(nom, limite_he_td, projet_id) VALUES ('" 
    + data['nom'] + "','"
    + data['limite_he_td'] + "','" 
    + data['projet_id'] + "');"
  ;

  db.query(requete,
    function(err, limite_sous_total) {
      if (!err) {
        res.status(200).json(limite_sous_total); 
      } else  {
        res.send(err);
      }
    }
  );
};


exports.addGroupeSousTotal = (req, res) => {
  var data = {
    limite_sous_total_id : req.body.limite_sous_total_id,
    element_id : req.body.element_id,
  };

  var requete = "INSERT INTO groupe_sous_total(limite_sous_total_id, element_id) VALUES";

  for (let i = 0; i < data['element_id'].length; i++) {
    var values = " ('" + data['limite_sous_total_id'] + "','"+ data['element_id'][i] + "')";
    if (i < data['element_id'].length-1) values += ",";
    requete += values;
  }

  db.query(requete,
    function(err, groupe_sous_total) {
      if (!err) {
        res.status(200).json(groupe_sous_total); 
      } else  {
        res.send(err);
      }
    }
  );
};


exports.editLimiteSousTotal = (req, res) => {
  var donnees = {
    id : req.body.id,
    nom : tools.safeStringSQL(req.body.nom),
    limite_he_td : req.body.limite_he_td,
    projet_id : req.body.projet_id,
  };
  var requete="UPDATE limite_sous_total SET nom ='" + donnees['nom'] 
  +"', limite_he_td ='" + donnees['limite_he_td'] 
  +"' WHERE id = " + req.params.id + ";";

  db.query(requete,
    function(err, limite_sous_total) {
      if (!err) {
        res.status(200).json(limite_sous_total);  
      } else {
        res.send(err);
      }
    }
  );
};


exports.copyLimiteSousTotal = (req, res) => {
  db.query('SELECT * FROM limite_sous_total WHERE id = ? ;', [req.params.id],
    function(err, limite_sous_total) {
      if (!err) {
         var requete="INSERT INTO limite_sous_total(nom, limite_he_td, projet_id) VALUES ('" 
          + limite_sous_total[0]['nom'] + "','"
          + limite_sous_total[0]['limite_he_td'] + "','"
          + req.params.projet + "');"
        ;

        db.query(requete,
          function(err, limite_sous_total) {
            if (!err) {
              res.status(200).json(limite_sous_total); 
            } else  {
              res.send(err);
            }
          }
        );
      }
      else {
        res.send(err);
      }
    }
  );
};


exports.copyGroupeSousTotalByLimite = (req, res) => {
  var requete = "INSERT INTO groupe_sous_total(limite_sous_total_id, element_id) SELECT " + req.params.limite + ", element_id FROM groupe_sous_total WHERE limite_sous_total_id = " + req.params.id + ";";
  db.query(requete,
    function(err, groupe_sous_total) {
      if (!err) {
        res.status(200).json(groupe_sous_total); 
      } else  {
        res.send(err);
      }
    }
  );
};


exports.deleteGroupeSousTotal = (req, res) => {
  db.query('DELETE FROM groupe_sous_total WHERE limite_sous_total_id = ? ;',[req.params.id],
    function(err, groupe_sous_total) {
      if (!err) {
        res.status(200).json(groupe_sous_total); 
      } else  {
        res.send(err);
      }
    }
  );  
};

exports.deleteLimiteSousTotal = (req, res) => {
  db.query('DELETE l, g'
        +' FROM limite_sous_total AS l'
        +' JOIN groupe_sous_total AS g'
        +' ON g.limite_sous_total_id = l.id'
        +' WHERE l.id = ?',[req.params.id],
    function(err, groupes_intervenants) {
      if (!err) {
        res.status(200).json(groupes_intervenants);
      }
      else {
        res.send(err);
      }
    }
  );  
};