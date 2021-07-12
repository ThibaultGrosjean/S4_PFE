var db = require('../models/bdd');

const { check, validator } = require('express-validator');

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


exports.getAllBilanSousTotal = (req, res) => {
  db.query('SELECT g.intervenant_id, e.prenom, e.nom,l.id, l.nom AS nom_limite, l.limite_he_td'
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
       +' LEFT JOIN ('
       +'     SELECT intervenant_id AS id'
       +'   , SUM(IFNULL(vol_hor_cm * el.forfait_globale_cm, 0)) AS total_volume_globale_cm'
       +'   , SUM(IFNULL(vol_hor_td * el.forfait_globale_td, 0)) AS total_volume_globale_td'
       +'   , SUM(IFNULL(vol_hor_tp * el.forfait_globale_tp, 0)) AS total_volume_globale_tp'
       +'   , SUM(IFNULL(vol_hor_partiel * el.forfait_globale_partiel, 0)) AS total_volume_globale_partiel'
       +'   FROM volume_globale'
       +'   LEFT JOIN element AS el'
       +'   ON element_id = el.id'
       +'   WHERE intervenant_id IN (SELECT i2.id FROM intervenant AS i2 WHERE i2.projet_id = ' + req.params.id + ' )'
       +'   AND  element_id IN (SELECT g2.element_id  FROM groupe_sous_total AS g2 JOIN limite_sous_total As l2 On l2.id = g2.limite_sous_total_id WHERE l2.projet_id =  ' + req.params.id + ')'
       +'   GROUP BY intervenant_id)'
       +' AS vgt'
       +' ON vgt.id = i.id'
       +' WHERE g.intervenant_id IN (SELECT i.id FROM intervenant AS i WHERE i.projet_id =  ' + req.params.id + ')'
       +' GROUP BY g.intervenant_id, vgt.total_volume_globale_cm, vgt.total_volume_globale_td, vgt.total_volume_globale_tp, vgt.total_volume_globale_partiel, l.id',
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


exports.addLimiteSousTotal = (req, res) => {
  var data = {
    nom : req.body.nom,
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
    nom : req.body.nom,
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


exports.copySousTotalByLimite = (req, res) => {
  var requete = "INSERT INTO limite_sous_total(nom, limite_he_td, projet_id) VALUES";

  for (let i = nbSemaineDeb; i <= nbSemaineFin; i++) {
    data['num_semaine'] = i;
    var values = " ('" + data['num_semaine'] + "','"+ data['vol_hor_cm'] + "','" + data['vol_hor_td'] + "','" + data['vol_hor_tp'] + "','" + data['vol_hor_partiel'] + "','" + data['element_id'] + "')";
    if (i < nbSemaineFin) values += ",";
    requete += values;
  }

  db.query('SELECT * FROM periode WHERE element_id = ? ;', [req.params.id],
    function(err, periode) {
      if (!err) {
         periode[0]['element_id'] = req.params.parent
         var requete="INSERT INTO periode(nb_semaine, nb_groupe_defaut_cm, nb_groupe_defaut_td, nb_groupe_defaut_tp, nb_groupe_defaut_partiel, element_id) VALUES ('" 
          + periode[0]['nb_semaine'] + "','"
          + periode[0]['nb_groupe_defaut_cm'] + "','"
          + periode[0]['nb_groupe_defaut_td'] + "','"
          + periode[0]['nb_groupe_defaut_tp'] + "','"
          + periode[0]['nb_groupe_defaut_partiel'] + "','"
          + periode[0]['element_id'] + "');"
        ;

        db.query(requete,
          function(err, periode) {
            if (!err) {
              res.status(200).json(periode); 
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