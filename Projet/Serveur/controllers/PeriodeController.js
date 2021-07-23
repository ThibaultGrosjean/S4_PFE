var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('nb_semaine',"Le Nombre de semaines doit être un entier").isNumeric(),
  check('nb_groupe_defaut_cm',"Le Nombre de groupes pour les CM doit être un entier").isNumeric(),
  check('nb_groupe_defaut_td',"Le Nombre de groupes pour les TD doit être un entier").isNumeric(),
  check('nb_groupe_defaut_tp',"Le Nombre de groupes pour les TP doit être un entier").isNumeric(),
  check('nb_groupe_defaut_partiel',"Le Nombre de groupes pour les partiels doit être un entier").isNumeric(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllPeriodes = (req, res) => {
  db.query('SELECT * FROM periode;',
    function(err, periodes) {
      if (!err) {
        res.status(200).json(periodes);  
      } else {
        res.send(err);
      }
    }
  ); 
};


exports.getPeriode = (req, res) => {
  db.query('SELECT * FROM periode WHERE id = ? ;', [req.params.id],
    function(err, periode) {
      if (!err) {
        res.status(200).json(periode);  
      } else {
        res.send(err);
      }
    }
  );  
};


exports.getPeriodeByElementId = (req, res) => {
  db.query('SELECT * FROM periode WHERE element_id = ? ;', [req.params.id],
    function(err, periode) {
      if (!err) {
        res.status(200).json(periode);  
      } else {
        res.send(err);
      }
    }
  );  
};


exports.addPeriode = (req, res) => {
  var data = {
    nb_semaine : req.body.nb_semaine | 0,
    nb_groupe_defaut_cm : req.body.nb_groupe_defaut_cm | 0,
    nb_groupe_defaut_td : req.body.nb_groupe_defaut_td | 0,
    nb_groupe_defaut_tp : req.body.nb_groupe_defaut_tp | 0,
    nb_groupe_defaut_partiel : req.body.nb_groupe_defaut_partiel | 0,
    element_id : req.body.element_id,  
  };

  var requete="INSERT INTO periode(nb_semaine, nb_groupe_defaut_cm, nb_groupe_defaut_td, nb_groupe_defaut_tp, nb_groupe_defaut_partiel, element_id) VALUES ('" 
    + data['nb_semaine'] + "','"
    + data['nb_groupe_defaut_cm'] + "','"
    + data['nb_groupe_defaut_td'] + "','"
    + data['nb_groupe_defaut_tp'] + "','"
    + data['nb_groupe_defaut_partiel'] + "','"
    + data['element_id'] + "');"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
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
};


exports.copyPeriode = (req, res) => {
  db.query('SELECT * FROM periode WHERE element_id = ? ;', [req.params.id],
    function(err, periode) {
      if (!err && periode.length > 0) {
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


exports.editPeriode = (req, res) => {
  var data = {
    id : req.body.id,
    nb_semaine : req.body.nb_semaine | 0,
    nb_groupe_defaut_cm : req.body.nb_groupe_defaut_cm | 0,
    nb_groupe_defaut_td : req.body.nb_groupe_defaut_td | 0,
    nb_groupe_defaut_tp : req.body.nb_groupe_defaut_tp | 0,
    nb_groupe_defaut_partiel : req.body.nb_groupe_defaut_partiel | 0,
    element_id : req.body.element_id,  
  };
  var requete="UPDATE periode SET nb_semaine ='" + data['nb_semaine'] 
  +"', nb_groupe_defaut_cm ='" + data['nb_groupe_defaut_cm'] 
  +"', nb_groupe_defaut_td ='" + data['nb_groupe_defaut_td'] 
  +"', nb_groupe_defaut_tp ='" + data['nb_groupe_defaut_tp'] 
  +"', nb_groupe_defaut_partiel ='" + data['nb_groupe_defaut_partiel']
  +"', element_id ='" + data['element_id']
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, periode) {
        if (!err) {
          res.status(200).json(periode);  
        } else {
          res.send(err);
        }
      }
    );
  }
};


exports.deletePeriodeByElement = (req, res) => {
  db.query('DELETE FROM periode WHERE element_id = ? ;',[req.params.id],
    function(err, periode) {
      if (!err) {
        res.status(200).json(periode);  
      } else {
        res.send(err);
      }
    }
  );  
};


exports.deletePeriode = (req, res) => {
  db.query('DELETE FROM periode WHERE id = ? ;',[req.params.id],
    function(err, periode) {
      if (!err) {
        res.status(200).json(periode);  
      } else {
        res.send(err);
      }
    }
  );  
};