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
  db.query('SELECT e.id, e.prenom, e.nom, e.surnom, e.email, e.statut_id, s.id AS id_statut, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup FROM enseignant AS e JOIN statut AS s ON e.statut_id = statut_id',
    function(errE, rows) {
      if (!errE) {
        var obj = []
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].id_statut == rows[i].statut_id){
            obj.push({
              id: rows[i].id,
              prenom: rows[i].prenom,
              nom: rows[i].nom,
              surnom: rows[i].surnom,
              email: rows[i].email,
              statut: {
                id: rows[i].id_statut,
                nom: rows[i].statut_nom,
                surnom: rows[i].statut_surnom,
                nb_he_td_min_attendu: rows[i].nb_he_td_min_attendu,
                nb_he_td_max_attendu: rows[i].nb_he_td_max_attendu,
                nb_he_td_min_sup: rows[i].nb_he_td_min_sup,
                nb_he_td_max_sup: rows[i].nb_he_td_max_sup,
              },
            });
          }
        }
        res.status(200).send(obj);
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


exports.copyEnseignant = (req, res) => {
  db.query('SELECT * FROM enseignant where id = ? ;', [req.params.id],
    function(err, enseignant) {
      if (!err) {
        var requete="INSERT INTO enseignant(nom, prenom, surnom, email, statut_id) VALUES ('" 
          + enseignant[0]['nom'] + ' (copie)' + "','"
          + enseignant[0]['prenom'] + ' (copie)' + "','"
          + enseignant[0]['surnom'] + "','"
          + enseignant[0]['email'] + ' (copie)' + "','"
          + enseignant[0]['statut_id'] + "');"
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
      }
      else {
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