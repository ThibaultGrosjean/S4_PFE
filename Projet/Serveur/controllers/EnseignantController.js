var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('prenom',"Veuillez saisir un prenom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('surnom',"Veuillez saisir un surnom avec au minimum 2 caractères").isLength({ max: 2 }),
  check('email',"Veuillez saisir un surnom avec au minimum 2 caractères").isLength({ max: 2 }),
  check('statut_id',"Veuillez sélectionner un statut").isNumeric(),
];


exports.getAllEnseignants = (req, res) => {
  db.query('SELECT * FROM enseignant;',
    function(errE, enseignant) {
      if (!errE) {
        db.query('SELECT * FROM statut',
          function(errS, statut) {
            if (!errS) {
              for (var i = enseignant.length - 1; i >= 0; i--) {
                const idS = enseignant[i].statut_id;
                for (var j = statut.length - 1; j >= 0; j--) {
                  if (idS == statut[j].id) enseignant[i]['statut_id'] = statut[j];
                }
              }
              res.status(200).send(enseignant);
            }
            else {
              res.send(errS);
            }
          }
        )   
      }
      else {
        res.send(errE);
      }
    }
  );  
};


exports.getEnseignant = (req, res) => {
  db.query('SELECT * FROM enseignant where id = ? ;', [req.params.id],
    function(err, enseignant) {
      if (!err) {
        res.status(200).json(enseignant);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addEnseignant = (req, res) => {
  var data = {
    nom : req.body.nom,
    prenom : req.body.prenom,
    surnom : req.body.surnom,
    email : req.body.email,
    statut_id : req.body.statut_id,
  };

  var requete="INSERT INTO enseignant(nom, prenom, surnom, email, statut_id) VALUES ('" 
    + data['nom'] + "','"
    + data['prenom'] + "','"
    + data['surnom'] + "','"
    + data['email'] + "','"
    + data['statut_id'] + "');"
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


exports.editEnseignant = (req, res) => {
  var donnees = {
    id : req.body.id,
    nom : req.body.nom,
    prenom : req.body.prenom,
    surnom : req.body.surnom,
    email : req.body.email,
    statut_id : req.body.statut_id
  };
  var requete="UPDATE enseignant SET nom ='" + donnees['nom'] 
  +"', prenom ='" + donnees['prenom'] 
  +"', surnom ='" + donnees['surnom'] 
  +"', email ='" + donnees['email'] 
  +"', statut_id ='" + donnees['statut_id']
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


exports.deleteEnseignant = (req, res) => {
  db.query('DELETE FROM enseignant WHERE id = ? ;',[req.params.id],
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