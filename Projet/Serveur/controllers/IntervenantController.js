var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('nb_he_td_min_attendu_projet',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_he_td_max_attendu_projet',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_he_td_min_sup_projet',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_he_td_max_sup_projet',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('projet_id',"Veuillez sélectionner un projet").isNumeric(),
  check('enseignant_id',"Veuillez sélectionner un enseignant").isNumeric(),
];


exports.getAllIntervenants = (req, res) => {
  db.query('SELECT * FROM intervenant;',
    function(err, intervenants) {
      if (!err) {
        res.status(200).json(intervenants);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getIntervenant = (req, res) => {
  db.query('SELECT * FROM intervenant WHERE id = ? ;', [req.params.id],
    function(err, intervenant) {
      if (!err) {
        res.status(200).json(intervenant);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addIntervenant = (req, res) => {
  var data = {
    nb_he_td_min_attendu_projet : req.body.nb_he_td_min_attendu_projet,
    nb_he_td_max_attendu_projet : req.body.nb_he_td_max_attendu_projet,
    nb_he_td_min_sup_projet : req.body.nb_he_td_min_sup_projet,
    nb_he_td_max_sup_projet : req.body.nb_he_td_max_sup_projet,
    projet_id : req.body.projet_id,
    enseignant_id : req.body.enseignant_id,  
  };

  var requete="INSERT INTO intervenant(nb_he_td_min_attendu_projet, nb_he_td_max_attendu_projet, nb_he_td_min_sup_projet, nb_he_td_max_sup_projet, projet_id, enseignant_id) VALUES ('" 
    + data['nb_he_td_min_attendu_projet'] + "','"
    + data['nb_he_td_max_attendu_projet'] + "','"
    + data['nb_he_td_min_sup_projet'] + "','"
    + data['nb_he_td_max_sup_projet'] + "','"
    + data['projet_id'] + "','"
    + data['enseignant_id'] + "');"
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


exports.editIntervenant = (req, res) => {
  var donnees = {
    id : req.body.id,
    nb_he_td_min_attendu_projet : req.body.nb_he_td_min_attendu_projet,
    nb_he_td_max_attendu_projet : req.body.nb_he_td_max_attendu_projet,
    nb_he_td_min_sup_projet : req.body.nb_he_td_min_sup_projet,
    nb_he_td_max_sup_projet : req.body.nb_he_td_max_sup_projet,
    projet_id : req.body.projet_id,
    enseignant_id : req.body.enseignant_id,  
  };
  var requete="UPDATE intervenant SET nb_he_td_min_attendu_projet ='" + donnees['nb_he_td_min_attendu_projet'] 
  +"', nb_he_td_max_attendu_projet ='" + donnees['nb_he_td_max_attendu_projet'] 
  +"', nb_he_td_min_sup_projet ='" + donnees['nb_he_td_min_sup_projet'] 
  +"', nb_he_td_max_sup_projet ='" + donnees['nb_he_td_max_sup_projet'] 
  +"', projet_id ='" + donnees['projet_id']
  +"', enseignant_id ='" + donnees['enseignant_id']
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


exports.deleteIntervenant = (req, res) => {
  db.query('DELETE FROM intervenant WHERE id = ? ;',[req.params.id],
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