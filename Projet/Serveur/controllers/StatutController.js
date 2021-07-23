var db = require('../models/bdd');
const tools = require('../models/tools');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('surnom',"Veuillez saisir un surnom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('nb_he_td_min_attendu',"Le nombre d’heures (équivalent TD) minimal attendu doit être un entier ou un nombre à virgule").isFloat(),
  check('nb_he_td_max_attendu',"Le nombre d’heures (équivalent TD) maximal attendu doit être un entier ou un nombre à virgule").isFloat(),
  check('nb_he_td_min_sup',"Le nombre d’heures (équivalent TD) minimal supplémentaires doit être un entier ou un nombre à virgule").isFloat(),
  check('nb_he_td_max_sup',"Le nombre d’heures (équivalent TD) maximal supplémentaires doit être un entier ou un nombre à virgule").isFloat(),
];


exports.getAllStatuts = (req, res) => {
  db.query('SELECT * FROM statut ORDER BY nom;',
    function(err, statuts) {
      if (!err) {
        res.status(200).json(statuts);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getAllStatutsLimite = (req, res) => {
  db.query('SELECT s.*, IFNULL(limite_statut.limite, 0)AS limite'
        +' FROM statut AS s'
        +' LEFT JOIN ('
        +'     SELECT IFNULL(sl.limite, 0) AS limite, sl.statut_id'
        +'   FROM groupe_statut_limite AS sl'
        +'   LEFT JOIN limite_sous_total AS l'
        +'   ON sl.limite_id = l.id'
        +'   WHERE l.id = ?'
        +' ) AS limite_statut'
        +' ON limite_statut.statut_id = s.id'
        +' ORDER BY s.nom',[req.params.id],
    function(err, statuts) {
      if (!err) {
        res.status(200).send(statuts);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getStatut = (req, res) => {
  db.query('SELECT * FROM statut where id = ? ;', [req.params.id],
    function(err, statut) {
      if (!err) {
        res.status(200).json(statut);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addStatut = (req, res) => {
  var data = {
    nom : tools.safeStringSQL(req.body.nom),
    surnom : tools.safeStringSQL(req.body.surnom),
    nb_he_td_min_attendu : req.body.nb_he_td_min_attendu | 0,
    nb_he_td_max_attendu : req.body.nb_he_td_max_attendu | 0,
    nb_he_td_min_sup : req.body.nb_he_td_min_sup | 0,
    nb_he_td_max_sup : req.body.nb_he_td_max_sup | 0,
  };

  var requete = "INSERT INTO statut(nom, surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup, verrou) VALUES ('" 
    + data['nom'] + "','"
    + data['surnom'] + "','"
    + data['nb_he_td_min_attendu'] + "','" 
    + data['nb_he_td_max_attendu'] + "','" 
    + data['nb_he_td_min_sup'] + "','" 
    + data['nb_he_td_max_sup'] + "',0);"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, statut) {
        if (!err) {
          res.status(200).json(statut); 
        } else  {
          res.send(err);
        }
      }
    );
  }
};


exports.copyStatut = (req, res) => {
  db.query("INSERT INTO statut(nom, surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup, verrou)"
        +" SELECT CONCAT(nom, ' (copie)'), surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup, 0"
        +" FROM statut WHERE id = ?;", [req.params.id],
    function(err, statut) {
      if (!err) {
        res.status(200).json(statut); 
      } else  {
        res.send(err);
      }
    }
  );
};


exports.editStatut = (req, res) => {
  var data = {
    id : req.body.id,
    nom : tools.safeStringSQL(req.body.nom),
    surnom : tools.safeStringSQL(req.body.surnom),
    nb_he_td_min_attendu : req.body.nb_he_td_min_attendu | 0,
    nb_he_td_max_attendu : req.body.nb_he_td_max_attendu | 0,
    nb_he_td_min_sup : req.body.nb_he_td_min_sup | 0,
    nb_he_td_max_sup : req.body.nb_he_td_max_sup | 0,
  };

  var requete = "UPDATE statut SET nom ='" + data['nom'] 
  +"', surnom ='" + data['surnom'] 
  +"', nb_he_td_min_attendu ='" + data['nb_he_td_min_attendu'] 
  +"', nb_he_td_max_attendu ='" + data['nb_he_td_max_attendu'] 
  +"', nb_he_td_min_sup ='" + data['nb_he_td_min_sup'] 
  +"', nb_he_td_max_sup ='" + data['nb_he_td_max_sup'] 
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, statut) {
        if (!err) {
          res.status(200).json(statut); 
        } else  {
          res.send(err);
        }
      }
    );
  }
};


exports.deleteStatut = (req, res) => {
  db.query('DELETE g, v, i, e, s'
        +' FROM statut AS s'
        +' LEFT JOIN enseignant AS e'
        +' ON e.statut_id = s.id'
        +' LEFT JOIN intervenant AS i'
        +' ON i.enseignant_id = e.id'
        +' LEFT JOIN volume_globale AS v'
        +' ON v.intervenant_id = i.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.intervenant_id = i.id'
        +' WHERE s.id = ?;',[req.params.id],
    function(err, statut) {
      if (!err) {
        res.status(200).json(statut); 
      } else  {
        res.send(err);
      }
    }
  );  
};