var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('verrou',"Le verrou doit être un booléen").isBoolean(),
  check('projet_id',"Veuillez sélectionner un projet").isNumeric(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllFormations = (req, res) => {
  db.query('SELECT f.*, COUNT(DISTINCT g.id) AS nbGrpInterv, COUNT(DISTINCT vg.id) AS nbVolHorGlob, COUNT(DISTINCT vh.id) AS nbVolHorHebdo'
        +' FROM formation AS f'
        +' LEFT JOIN element AS e'
        +' ON e.parent = f.element_id'
        +' LEFT JOIN element AS e2'
        +' ON e2.parent = e.id'
        +' LEFT JOIN element AS e3'
        +' ON e3.parent = e2.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.element_id = e3.id'
        +' LEFT JOIN volume_globale AS vg'
        +' ON vg.element_id = e3.id'
        +' LEFT JOIN volume_hebdomadaire AS vh'
        +' ON vh.element_id = e3.id'
        +' GROUP BY f.id, e.titre',
    function(err, formations) {
      if (!err) {
        res.status(200).json(formations);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getFormationByProjet = (req, res) => {
  db.query('SELECT f.*, COUNT(DISTINCT g.id) AS nbGrpInterv, COUNT(DISTINCT vg.id) AS nbVolHorGlob, COUNT(DISTINCT vh.id) AS nbVolHorHebdo'
        +' FROM formation AS f'
        +' LEFT JOIN element AS e'
        +' ON e.parent = f.element_id'
        +' LEFT JOIN element AS e2'
        +' ON e2.parent = e.id'
        +' LEFT JOIN element AS e3'
        +' ON e3.parent = e2.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.element_id = e3.id'
        +' LEFT JOIN volume_globale AS vg'
        +' ON vg.element_id = e3.id'
        +' LEFT JOIN volume_hebdomadaire AS vh'
        +' ON vh.element_id = e3.id'
        +' WHERE f.projet_id = ?'
        +' GROUP BY f.id;', [req.params.id],
    function(err, formation) {
      if (!err) {
        res.status(200).json(formation);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getFormation = (req, res) => {
  db.query('SELECT f.*, COUNT(DISTINCT g.id) AS nbGrpInterv, COUNT(DISTINCT vg.id) AS nbVolHorGlob, COUNT(DISTINCT vh.id) AS nbVolHorHebdo'
        +' FROM formation AS f'
        +' LEFT JOIN element AS e'
        +' ON e.parent = f.element_id'
        +' LEFT JOIN element AS e2'
        +' ON e2.parent = e.id'
        +' LEFT JOIN element AS e3'
        +' ON e3.parent = e2.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.element_id = e3.id'
        +' LEFT JOIN volume_globale AS vg'
        +' ON vg.element_id = e3.id'
        +' LEFT JOIN volume_hebdomadaire AS vh'
        +' ON vh.element_id = e3.id'
        +' WHERE f.id = ?'
        +' GROUP BY f.id', [req.params.id],
    function(err, formation) {
      if (!err) {
        res.status(200).json(formation);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addFormation = (req, res) => {
  var data = {
    verrou : 0,
    projet_id : req.body.projet_id,
    element_id : req.body.element_id,  
  };

  var requete="INSERT INTO formation(verrou, projet_id, element_id) VALUES ('" 
    + data['verrou'] + "','"
    + data['projet_id'] + "','"
    + data['element_id'] + "');"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
    function(err, formation) {
        if (!err) {
          res.status(200).json(formation); 
        } else  {
          res.send(err);
        }
      }
    );
  }  
};


exports.copyFormation = (req, res) => {
  db.query('SELECT * FROM formation WHERE id = ? ;', [req.params.id],
    function(err, formation) {
      if (!err) {
         var requete="INSERT INTO formation(verrou, projet_id, element_id) VALUES ('" 
          + formation[0]['verrou'] + "','"
          + req.params.projet + "','"
          + req.params.element + "');"
        ;
        db.query(requete,
          function(err, formation) {
            if (!err) {
              res.status(200).json(formation); 
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


exports.editFormation = (req, res) => {
  var donnees = {
    id : req.body.id,
    verrou : req.body.verrou,
    projet_id : req.body.projet_id,
    element_id : req.body.element_id,  
  };
  var requete="UPDATE formation SET verrou ='" + donnees['verrou'] 
  +"', projet_id ='" + donnees['projet_id']
  +"', element_id ='" + donnees['element_id']
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
    function(err, formation) {
        if (!err) {
          res.status(200).json(formation); 
        } else  {
          res.send(err);
        }
      }
    );
  }
};


exports.deleteFormation = (req, res) => {
  db.query('DELETE FROM formation WHERE id = ? ;',[req.params.id],
    function(err, formation) {
      if (!err) {
        res.status(200).json(formation); 
      }
      else {
        res.send(err);
      }
    }
  );
};