var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('nb_semaine',"Veuillez saisir un numérique non nul").isNumeric(),
  check('nb_groupe_defaut_cm',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_groupe_defaut_td',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_groupe_defaut_tp',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('nb_groupe_defaut_partiel',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllPeriodes = (req, res) => {
  db.query('SELECT * FROM periode;',
    function(err, periodes) {
      if (!err) {
        res.status(200).json(periodes);  
      }
      else {
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
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addPeriode = (req, res) => {
  var data = {
    nb_semaine : req.body.nb_semaine,
    nb_groupe_defaut_cm : req.body.nb_groupe_defaut_cm,
    nb_groupe_defaut_td : req.body.nb_groupe_defaut_td,
    nb_groupe_defaut_tp : req.body.nb_groupe_defaut_tp,
    nb_groupe_defaut_partiel : req.body.nb_groupe_defaut_partiel,
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

  db.query(requete,
    function(err) {
      if (!err) {
        res.status(200); 
      } else  {
        res.send(err);
      }
    }
  );
};


exports.editPeriode = (req, res) => {
  var donnees = {
    id : req.body.id,
    nb_semaine : req.body.nb_semaine,
    nb_groupe_defaut_cm : req.body.nb_groupe_defaut_cm,
    nb_groupe_defaut_td : req.body.nb_groupe_defaut_td,
    nb_groupe_defaut_tp : req.body.nb_groupe_defaut_tp,
    nb_groupe_defaut_partiel : req.body.nb_groupe_defaut_partiel,
    element_id : req.body.element_id,  
  };
  var requete="UPDATE periode SET nb_semaine ='" + donnees['nb_semaine'] 
  +"', nb_groupe_defaut_cm ='" + donnees['nb_groupe_defaut_cm'] 
  +"', nb_groupe_defaut_td ='" + donnees['nb_groupe_defaut_td'] 
  +"', nb_groupe_defaut_tp ='" + donnees['nb_groupe_defaut_tp'] 
  +"', nb_groupe_defaut_partiel ='" + donnees['nb_groupe_defaut_partiel']
  +"', element_id ='" + donnees['element_id']
  +"' WHERE id = " + req.params.id + ";";

  db.query(requete,
    function(err) {
      if (!err) {
        res.status(200); 
      } else {
        res.send(err);
      }
    }
  );
};


exports.deletePeriode = (req, res) => {
  db.query('DELETE FROM periode WHERE id = ? ;',[req.params.id],
    function(err) {
      if (!err) {
        res.status(200); 
      }
      else {
        res.send(err);
      }
    }
  );  
};