var db = require('../models/bdd');

const { check, validator } = require('express-validator');

exports.validator = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('surnom',"Veuillez saisir un surnom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('nb_he_td_min_attendu',"Le nombre d’heures (équivalent TD) minimal attendu doit être un numérique non nul").isDecimal(),
  check('nb_he_td_max_attendu',"Le nombre d’heures (équivalent TD) maximal attendu doit être un numérique non nul").isDecimal(),
  check('nb_he_td_min_sup',"Le nombre d’heures (équivalent TD) minimal supplémentaires doit être un numérique non nul").isDecimal(),
  check('nb_he_td_max_sup',"Le nombre d’heures (équivalent TD) maximal supplémentaires doit être un numérique non nul").isDecimal(),
];


exports.getAllStatuts = (req, res) => {
  db.query('SELECT * FROM statut;',
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
    nom : req.body.nom,
    surnom : req.body.surnom,
    nb_he_td_min_attendu : req.body.nb_he_td_min_attendu,
    nb_he_td_max_attendu : req.body.nb_he_td_max_attendu,
    nb_he_td_min_sup : req.body.nb_he_td_min_sup,
    nb_he_td_max_sup : req.body.nb_he_td_max_sup,
  };

  var requete="INSERT INTO statut(nom, surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup) VALUES ('" 
    + data['nom'] + "','"
    + data['surnom'] + "','"
    + data['nb_he_td_min_attendu'] + "','" 
    + data['nb_he_td_max_attendu'] + "','" 
    + data['nb_he_td_min_sup'] + "','" 
    + data['nb_he_td_max_sup'] + "');"
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


exports.copyStatut = (req, res) => {
  db.query('SELECT * FROM statut where id = ? ;', [req.params.id],
    function(err, statut) {
      if (!err) {
        var requete="INSERT INTO statut(nom, surnom, nb_he_td_min_attendu, nb_he_td_max_attendu, nb_he_td_min_sup, nb_he_td_max_sup) VALUES ('" 
          + statut[0]['nom'] + ' (copie)' + "','"
          + statut[0]['surnom'] + "','"
          + statut[0]['nb_he_td_min_attendu'] + "','" 
          + statut[0]['nb_he_td_max_attendu'] + "','" 
          + statut[0]['nb_he_td_min_sup'] + "','" 
          + statut[0]['nb_he_td_max_sup'] + "');"
        ;

        db.query(requete,
          function(err, nexs) {
            if (!err) {
              res.status(200).json(nexs); 
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


exports.editStatut = (req, res) => {
  var donnees = {
    id : req.body.id,
    nom : req.body.nom,
    surnom : req.body.surnom,
    nb_he_td_min_attendu : req.body.nb_he_td_min_attendu,
    nb_he_td_max_attendu : req.body.nb_he_td_max_attendu,
    nb_he_td_min_sup : req.body.nb_he_td_min_sup,
    nb_he_td_max_sup : req.body.nb_he_td_max_sup,
  };
  var requete="UPDATE statut SET nom ='" + donnees['nom'] 
  +"', surnom ='" + donnees['surnom'] 
  +"', nb_he_td_min_attendu ='" + donnees['nb_he_td_min_attendu'] 
  +"', nb_he_td_max_attendu ='" + donnees['nb_he_td_max_attendu'] 
  +"', nb_he_td_min_sup ='" + donnees['nb_he_td_min_sup'] 
  +"', nb_he_td_max_sup ='" + donnees['nb_he_td_max_sup'] 
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


exports.deleteStatut = (req, res) => {
  db.query('DELETE FROM statut WHERE id = ? ;',[req.params.id],
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