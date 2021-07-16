var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('nb_he_td_min_attendu_projet',"Le Nombre d'heures minimales attendues pour le projet doit être un numérique").notEmpty().isFloat(),
  check('nb_he_td_max_attendu_projet',"Le Nombre d'heures minimales attendues pour le projet doit être un numérique").notEmpty().isFloat(),
  check('nb_he_td_min_sup_projet',"Le Nombre d'heures minimales attendues pour le projet doit être un numérique").notEmpty().isFloat(),
  check('nb_he_td_max_sup_projet',"Le Nombre d'heures minimales attendues pour le projet doit être un numérique").notEmpty().isFloat(),
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


exports.getIntervenantsByProjet = (req, res) => {
  db.query('SELECT i.*, e.prenom, e.nom, COUNT(DISTINCT g.id) AS nbGrpInterv, COUNT(DISTINCT v.id) AS nbVolHorGlob' 
        +' FROM intervenant AS i'
        +' JOIN projet AS p'
        +' ON p.id = i.projet_id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.intervenant_id = i.id'
        +' LEFT JOIN volume_globale AS v'
        +' ON v.intervenant_id = i.id'
        +' JOIN enseignant AS e'
        +' ON e.id = i.enseignant_id'
        +' WHERE i.projet_id = ?'
        +' GROUP BY i.id', [req.params.id],
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


exports.getIntervenantsForGrpIntervByProjetNotInModule = (req, res) => {
  db.query('SELECT i.id, i.projet_id, e.prenom, e.nom, s.nom AS statut'
        +' FROM intervenant AS i'
        +' JOIN enseignant AS e'
        +' ON e.id = i.enseignant_id'
        +' JOIN statut AS s'
        +' ON s.id = e.statut_id'
        +' WHERE i.projet_id = ' + req.params.idProjet
        +' AND i.id NOT IN (SELECT g2.intervenant_id'
                         +' FROM groupe_intervenant AS g2'
                         +' WHERE g2.element_id = ' + req.params.idModule
                         +' GROUP BY g2.element_id, g2.intervenant_id);',
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


exports.getIntervenantsForVolGlobByProjetNotInModule = (req, res) => {
  db.query('SELECT i.id, i.projet_id, e.prenom, e.nom, s.nom AS statut'
        +' FROM intervenant AS i'
        +' JOIN enseignant AS e'
        +' ON e.id = i.enseignant_id'
        +' JOIN statut AS s'
        +' ON s.id = e.statut_id'
        +' WHERE i.projet_id = ' + req.params.idProjet
        +' AND i.id NOT IN (SELECT v.intervenant_id'
                         +' FROM volume_globale AS v'
                         +' WHERE v.element_id = ' + req.params.idModule
                         +' GROUP BY v.element_id, v.intervenant_id);',
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

  var requete = "INSERT INTO intervenant(nb_he_td_min_attendu_projet, nb_he_td_max_attendu_projet, nb_he_td_min_sup_projet, nb_he_td_max_sup_projet, projet_id, enseignant_id) VALUES ('" 
    + data['nb_he_td_min_attendu_projet'] + "','"
    + data['nb_he_td_max_attendu_projet'] + "','"
    + data['nb_he_td_min_sup_projet'] + "','"
    + data['nb_he_td_max_sup_projet'] + "','"
    + data['projet_id'] + "','"
    + data['enseignant_id'] + "');"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, intervenant) {
        if (!err) {
          res.status(200).json(intervenant); 
        } else  {
          res.send(err);
        }
      }
    );
  }
};


exports.copyIntervenantByProjet = (req, res) => {
  db.query('INSERT INTO intervenant(projet_id, enseignant_id, nb_he_td_min_attendu_projet, nb_he_td_max_attendu_projet, nb_he_td_min_sup_projet, nb_he_td_max_sup_projet)'
        +' SELECT ' + req.params.newProjetId + ', enseignant_id, nb_he_td_min_attendu_projet, nb_he_td_max_attendu_projet, nb_he_td_min_sup_projet, nb_he_td_max_sup_projet'
        +' FROM intervenant WHERE projet_id = ' + req.params.projetId,
    function(err, projet) {
      if (!err) {
        res.status(200).json(projet);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.editIntervenant = (req, res) => {
  var data = {
    id : req.body.id,
    nb_he_td_min_attendu_projet : req.body.nb_he_td_min_attendu_projet,
    nb_he_td_max_attendu_projet : req.body.nb_he_td_max_attendu_projet,
    nb_he_td_min_sup_projet : req.body.nb_he_td_min_sup_projet,
    nb_he_td_max_sup_projet : req.body.nb_he_td_max_sup_projet,
    projet_id : req.body.projet_id,
    enseignant_id : req.body.enseignant_id,  
  };
  var requete = "UPDATE intervenant SET nb_he_td_min_attendu_projet ='" + data['nb_he_td_min_attendu_projet'] 
  +"', nb_he_td_max_attendu_projet ='" + data['nb_he_td_max_attendu_projet'] 
  +"', nb_he_td_min_sup_projet ='" + data['nb_he_td_min_sup_projet'] 
  +"', nb_he_td_max_sup_projet ='" + data['nb_he_td_max_sup_projet'] 
  +"', projet_id ='" + data['projet_id']
  +"', enseignant_id ='" + data['enseignant_id']
  +"' WHERE id = " + req.params.id + ";";

  console.log(data)
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, intervenant) {
        if (!err) {
          res.status(200).json(intervenant); 
        } else {
          res.send(err);
        }
      }
    );
  }
};


exports.deleteIntervenant = (req, res) => {
  db.query('DELETE g, v, i'
        +' FROM intervenant AS i'
        +' LEFT JOIN volume_globale AS v'
        +' ON v.intervenant_id = i.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.intervenant_id = i.id'
        +' WHERE i.id = ?',[req.params.id],
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