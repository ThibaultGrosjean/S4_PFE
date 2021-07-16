var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('prenom',"Veuillez saisir un prénom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('surnom',"Veuillez saisir un surnom avec au minimum 3 caractères").optional({nullable: true}).isLength({ min: 0, max: 3 }),
  check('email',"Veuillez saisir un email valide").isEmail(),
  check('statut_id',"Veuillez sélectionner un statut").isNumeric(),
];


exports.getAllEnseignants = (req, res) => {
  db.query('SELECT e.*, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup FROM enseignant AS e JOIN statut AS s ON s.id = e.statut_id ORDER BY e.prenom, e.nom, s.nom',
    function(errE, enseignant) {
      if (!errE) {
        res.status(200).send(enseignant);
      }
      else {
        res.send(errE);
      }
    }
  );  
};


exports.getEnseignantByProjetNotInIntervenant = (req, res) => {
  db.query('SELECT e.*, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup'
       +' FROM enseignant AS e'
       +' JOIN statut AS s'
       +' ON s.id = e.statut_id'
       +' WHERE e.id NOT IN (SELECT i.enseignant_id'
                          +' FROM intervenant AS i'
                          +' WHERE projet_id = '+ req.params.idProjet +') ORDER BY e.prenom, e.nom, s.nom;',
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


exports.getEnseignant = (req, res) => {
  db.query('SELECT e.*, s.nom AS statut_nom, s.surnom AS statut_surnom, s.nb_he_td_min_attendu, s.nb_he_td_max_attendu, s.nb_he_td_min_sup, s.nb_he_td_max_sup FROM enseignant AS e JOIN statut AS s ON s.id = e.statut_id  WHERE e.id = ? ;', [req.params.id],
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


exports.getEnseignantByStatut = (req, res) => {
  db.query('SELECT e.* FROM enseignant AS e WHERE statut_id = ? ;', [req.params.id],
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


function generateSurnom(prenom, nom) {
  if (prenom != null && nom !== null){
    var compose = prenom.indexOf("-");
    if (nom.length == 1 && prenom.length == 1){
      surnom = prenom[0] + nom[0]
    } else {
      if (compose != -1)
        surnom = prenom[0] + prenom[compose+1] + nom[0]
      else
        surnom = prenom[0] + nom[0] + nom[1]
    }
    return surnom.toUpperCase();
  }
  return null;
}


exports.addEnseignant = (req, res) => {
  var data = {
    nom : req.body.nom,
    prenom : req.body.prenom,
    email : req.body.email,
    statut_id : req.body.statut_id,
  };

  let surnom = generateSurnom(data['prenom'], data['nom']);

  var requete = "INSERT INTO enseignant(nom, prenom, surnom, email, statut_id) VALUES ('" 
    + data['nom'] + "','"
    + data['prenom'] + "','"
    + surnom + "','"
    + data['email'] + "','"
    + data['statut_id'] + "');"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
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
};


exports.copyEnseignant = (req, res) => {
  db.query("INSERT INTO enseignant(statut_id, prenom, nom, surnom, email)"
        +" SELECT statut_id, prenom, CONCAT(nom, ' (copie)'), surnom, email"
        +" FROM enseignant WHERE id = ?", [req.params.id],
    function(err, enseignant) {
      if (!err) {
        res.status(200).json(enseignant);
        
      } else  {
        res.send(err);
      }
    }
  ); 
};


exports.editEnseignant = (req, res) => {
  var data = {
    id : req.body.id,
    nom : req.body.nom,
    prenom : req.body.prenom,
    surnom : req.body.surnom,
    email : req.body.email,
    statut_id : req.body.statut_id
  };

  if (data['surnom'] == null || data['surnom'] == '') data['surnom'] = generateSurnom(data['prenom'], data['nom']);
  else data['surnom'] = data['surnom'].toUpperCase();
  
  var requete = "UPDATE enseignant SET nom ='" + data['nom'] 
  +"', prenom ='" + data['prenom'] 
  +"', surnom ='" + data['surnom']
  +"', email ='" + data['email'] 
  +"', statut_id ='" + data['statut_id']
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, enseignant) {
        if (!err) {
          res.status(200).json(enseignant); 
        } else {
          res.send(err);
        }
      }
    );
  }
};


exports.deleteEnseignant = (req, res) => {
  db.query('DELETE g, v, i, e'
        +' FROM enseignant AS e'
        +' LEFT JOIN intervenant AS i'
        +' ON i.enseignant_id = e.id'
        +' LEFT JOIN volume_globale AS v'
        +' ON v.intervenant_id = i.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.intervenant_id = i.id'
        +' WHERE e.id = ?;',[req.params.id],
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