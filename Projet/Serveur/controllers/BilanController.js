var db = require('../models/bdd');
const tools = require('../models/tools');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('nom_limite',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('projet_id',"Veuillez selectionner un projet").isNumeric(),
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
      +' GROUP BY g.intervenant_id, vgt.total_volume_globale_cm, vgt.total_volume_globale_td, vgt.total_volume_globale_tp, vgt.total_volume_globale_partiel'
      +' ORDER BY e.prenom, e.nom',
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
  db.query('SELECT IFNULL(sl.limite, 0) AS limite, s.nom AS statut_nom, g.intervenant_id, e.prenom, e.nom, e.statut_id, l.id, l.nom_limite'
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
       +' JOIN statut AS s'
       +' ON s.id = e.statut_id'
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
       +' ORDER BY l.nom_limite, e.prenom, e.nom',
    function(err, bilan) {
      if (!err) {
        const groupeByLimite = bilan.reduce((acc, value) => {
          if (!acc[value.nom_limite]) {
            acc[value.nom_limite] = [];
          }
          acc[value.nom_limite].push(value);
          return acc;
        }, {});
        res.status(200).send(Object.values(groupeByLimite));  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getAllLimiteSousTotalByProjet = (req, res) => {
  db.query('SELECT * FROM limite_sous_total WHERE projet_id = ? ORDER BY projet_id, nom_limite;',[req.params.id],
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
  db.query('SELECT g.*, l.nom_limite' 
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
  db.query('SELECT * FROM limite_sous_total WHERE projet_id = ' + req.params.id + ' AND nom_limite = "' + req.params.nom + '" ORDER BY projet_id, nom_limite;',
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
    nom_limite : tools.safeStringSQL(req.body.nom_limite),
    projet_id : req.body.projet_id,
  };

  var requete="INSERT INTO limite_sous_total(nom_limite, projet_id) VALUES ('" 
    + data['nom_limite'] + "','" 
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


exports.addLimite = (req, res) => {
  var data = {
    nom_limite : tools.safeStringSQL(req.body.nom_limite),
    projet_id : req.body.projet_id,
    elements : req.body.elements,
    statuts : req.body.statuts,
  };

  const extractedErrors = {};
  var lengthErrors = 0;

  let errorsLimite = validationResult(req);
  if (!errorsLimite.isEmpty()) {
    errorsLimite.array().map(err => extractedErrors[err.param] = err.msg);
    lengthErrors++;
  }
  if (data.elements.length <= 0) {
    extractedErrors.elements = "Veuillez selectionner un ou plusieurs modules";
    lengthErrors++;
  }
  
  for (let i = 0; i < data.statuts.length; i++) {
    if (!tools.isFloat(data.statuts[i].limite)) {
      extractedErrors[data.statuts[i].nom] = "La limite doit être un entier ou un nombre à virgule";
      lengthErrors++;
    }
  }
 
  if (lengthErrors != 0) {
    return res.send({ errors: extractedErrors, data: data});
  } else {
    var requeteLimite ="INSERT INTO limite_sous_total(nom_limite, projet_id) VALUES ('" 
      + data['nom_limite'] + "','"
      + data['projet_id'] + "');"
    ;
    db.query(requeteLimite,
      function(err, limite_sous_total) {
        if (!err) {
          var requeteGroupeLimite = "INSERT INTO groupe_sous_total(limite_sous_total_id, element_id) VALUES";

          for (let i = 0; i < data['elements'].length; i++) {
            var values = " ('" + limite_sous_total.insertId + "','"+ data['elements'][i] + "')";
            if (i < data['elements'].length-1) values += ",";
            requeteGroupeLimite += values;
          }

          db.query(requeteGroupeLimite,
            function(err, groupe_sous_total) {
              if (!err) {
                var requeteLimiteStatut = "INSERT INTO groupe_statut_limite(statut_id, limite_id, limite) VALUES";
  
                for (let i = 0; i < data.statuts.length; i++) {
                  var values = " ('" + data.statuts[i].id + "','"+ limite_sous_total.insertId + "','" + data.statuts[i].limite + "')";
                  if (i < data.statuts.length-1) values += ",";
                  requeteLimiteStatut += values;
                }

                db.query(requeteLimiteStatut,
                  function(err, limite_statut) {
                    if (!err) {
                      res.status(200).json(limite_sous_total, groupe_sous_total, limite_statut);  
                    } else {
                      res.send(err);
                    }
                  }
                );
              } else  {
                res.send(err);
              }
            }
          );
        } else  {
          res.send(err);
        }
      }
    );
   } 
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


exports.editLimite = (req, res) => {
  var data = {
    id: req.body.id,
    nom_limite : tools.safeStringSQL(req.body.nom_limite),
    projet_id : req.body.projet_id,
    elements : req.body.elements,
    statuts : req.body.statuts,
  };

  const extractedErrors = {};
  var lengthErrors = 0;

  let errorsLimite = validationResult(req);
  if (!errorsLimite.isEmpty()) {
    errorsLimite.array().map(err => extractedErrors[err.param] = err.msg);
    lengthErrors++;
  }
  if (data.elements.length <= 0) {
    extractedErrors.elements = "Veuillez selectionner un ou plusieurs modules";
    lengthErrors++;
  }
  
  for (let i = 0; i < data.statuts.length; i++) {
    if (!tools.isFloat(data.statuts[i].limite)) {
      extractedErrors[data.statuts[i].nom] = "La limite doit être un entier ou un nombre à virgule";
      lengthErrors++;
    }
  }
 
  if (lengthErrors != 0) {
    return res.send({ errors: extractedErrors, data: data});
  } else {
    var requeteLimite = "UPDATE limite_sous_total SET nom_limite ='" + data['nom_limite'] +"' WHERE id = " + req.params.id + ";";

    db.query(requeteLimite,
      function(err, limite_sous_total) {
        if (!err) {
          var requeteGroupeLimiteDelete = "DELETE FROM groupe_sous_total WHERE limite_sous_total_id = " + req.params.id;
          db.query(requeteGroupeLimiteDelete,
            function(err, limite_sous_total_delete) {
              if (!err) {
                var requeteGroupeLimite = "INSERT INTO groupe_sous_total(limite_sous_total_id, element_id) VALUES";

                for (let i = 0; i < data['elements'].length; i++) {
                  var values = " ('" + data['id'] + "','"+ data['elements'][i] + "')";
                  if (i < data['elements'].length-1) values += ",";
                  requeteGroupeLimite += values;
                }
                db.query(requeteGroupeLimite,
                  function(err, groupe_sous_total) {
                    if (!err) {
                      var requeteLimiteStatutDelete = "DELETE FROM groupe_statut_limite WHERE limite_id = " + req.params.id;
                      db.query(requeteLimiteStatutDelete,
                        function(err, limite_statut_delete) {
                          if (!err) {
                            var requeteLimiteStatut = "INSERT INTO groupe_statut_limite(statut_id, limite_id, limite) VALUES";
  
                            for (let i = 0; i < data.statuts.length; i++) {
                              var values = " ('" + data.statuts[i].id + "','"+ data['id'] + "','" + data.statuts[i].limite + "')";
                              if (i < data.statuts.length-1) values += ",";
                              requeteLimiteStatut += values;
                            }
                            db.query(requeteLimiteStatut,
                              function(err, limite_statut) {
                                if (!err) {
                                  res.status(200).json(limite_sous_total, groupe_sous_total, limite_statut);  
                                } else {
                                  res.send(err);
                                }
                              }
                            );
                           
                          } else {
                            res.send(err);
                          }
                        }
                      );
                    } else  {
                      res.send(err);
                    }
                  }
                );
              } else  {
                res.send(err);
              }
            }
          );          
        } else  {
          res.send(err);
        }
      }
    );
   } 
};


exports.editLimiteSousTotal = (req, res) => {
  var donnees = {
    id : req.body.id,
    nom_limite : tools.safeStringSQL(req.body.nom_limite),
    projet_id : req.body.projet_id,
  };
  var requete="UPDATE limite_sous_total SET nom_limite ='" + donnees['nom_limite'] +"' WHERE id = " + req.params.id + ";";

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


exports.editLimiteStatut = (req, res) => {
  var donnees = {
    statut_id : req.body.statut_id,
    limite_id : req.body.limite_id,
    limite : req.body.limite,
  };
  var requete="UPDATE groupe_statut_limite SET statut_id ='" + donnees['statut_id'] 
  +"', limite_id ='" + donnees['limite_id'] +"', limite ='" + donnees['limite'] 
  +"' WHERE statut_id = " + req.params.statut + " AND limite_id = " + req.params.limite;

  db.query(requete,
    function(err, limite_statut) {
      if (!err) {
        res.status(200).json(limite_statut);  
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
         var requete="INSERT INTO limite_sous_total(nom_limite, projet_id) VALUES ('" 
          + limite_sous_total[0]['nom_limite'] + "','"
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


exports.copyLimiteStatut = (req, res) => {
  var requete = "INSERT IGNORE INTO groupe_statut_limite(statut_id, limite_id, limite) SELECT statut_id,"+ req.params.newLimite +", limite FROM groupe_statut_limite WHERE limite_id = " + req.params.id + ";";
  db.query(requete,
    function(err, groupe_statut_limite) {
      if (!err) {
        res.status(200).json(groupe_statut_limite); 
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