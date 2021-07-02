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
  db.query('SELECT e.*, s.id AS id_statut, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup FROM enseignant AS e JOIN statut AS s ON e.statut_id = s.id',
    function(errE, rows) {
      if (!errE) {
        var obj = []
        for (var i = 0; i < rows.length; i++) {
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
        res.status(200).send(obj);
      }
      else {
        res.send(errE);
      }
    }
  );  
};


exports.getEnseignantByProjetNotInIntervenant = (req, res) => {
  db.query('SELECT e.*, s.id AS id_statut, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup'
       +' FROM enseignant AS e'
       +' JOIN statut AS s'
       +' ON s.id = e.statut_id'
       +' WHERE e.id NOT IN (SELECT i.enseignant_id'
                          +' FROM intervenant AS i'
                          +' WHERE projet_id = '+ req.params.idProjet +');',
    function(err, rows) {
      if (!err) {
        var obj = []
        for (var i = 0; i < rows.length; i++) {
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
        res.status(200).json(obj);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getEnseignant = (req, res) => {
  db.query('SELECT e.id, e.prenom, e.nom, e.surnom, e.email, e.statut_id, s.id AS id_statut, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup FROM enseignant AS e JOIN statut AS s ON e.statut_id = s.id WHERE e.id = ? ;', [req.params.id],
    function(err, rows) {
      if (!err) {
        var obj = []
        obj.push({
          id: rows[0].id,
          prenom: rows[0].prenom,
          nom: rows[0].nom,
          surnom: rows[0].surnom,
          email: rows[0].email,
          statut: {
            id: rows[0].id_statut,
            nom: rows[0].statut_nom,
            surnom: rows[0].statut_surnom,
            nb_he_td_min_attendu: rows[0].nb_he_td_min_attendu,
            nb_he_td_max_attendu: rows[0].nb_he_td_max_attendu,
            nb_he_td_min_sup: rows[0].nb_he_td_min_sup,
            nb_he_td_max_sup: rows[0].nb_he_td_max_sup,
          },
        });
        res.status(200).json(obj);  
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
    email : req.body.email,
    statut_id : req.body.statut_id,
  };

  var nom = data['nom']
  var prenom = data['prenom']
  var surnom = ''

  var compose = prenom.indexOf("-")
  if (nom.length == 1 && prenom.length == 1){
    surnom = prenom[0] + nom[0]
  } else {
    if (compose != -1)
      surnom = prenom[0] + prenom[compose+1] + nom[0]
    else
      surnom = prenom[0] + nom[0] + nom[1]
  }
      
  var requete="INSERT INTO enseignant(nom, prenom, surnom, email, statut_id) VALUES ('" 
    + data['nom'] + "','"
    + data['prenom'] + "','"
    + surnom.toUpperCase() + "','"
    + data['email'] + "','"
    + data['statut_id'] + "');"
  ;

  db.query(requete,
    function(err, enseignant) {
      if (!err) {
        res.status(200).send(enseignant); 
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
          + enseignant[0]['prenom'] + "','"
          + enseignant[0]['surnom'] + "','"
          + enseignant[0]['email'] + "','"
          + enseignant[0]['statut_id'] + "');"
        ;

        db.query(requete,
          function(err, enseignant) {
            if (!err) {
              res.status(200).json(enseignant);
              
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
  db.query('DELETE v'
        +' FROM volume_globale AS v'
        +' LEFT JOIN intervenant AS i'
        +' ON i.id = v.intervenant_id'
        +' WHERE i.enseignant_id = ? ;',[req.params.id],
    function(err) {
      if (!err) {
        res.status(200); 
      }
      else {
        res.send(err);
      }
    }
  );
  db.query('DELETE g'
        +' FROM groupe_intervenant AS g'
        +' LEFT JOIN intervenant AS i'
        +' ON i.id = g.intervenant_id'
        +' WHERE i.enseignant_id = ? ;',[req.params.id],
    function(err) {
      if (!err) {
        res.status(200); 
      }
      else {
        res.send(err);
      }
    }
  );
  db.query('DELETE FROM intervenant WHERE enseignant_id = ? ;',[req.params.id],
    function(err) {
      if (!err) {
        res.status(200); 
      }
      else {
        res.send(err);
      }
    }
  );
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