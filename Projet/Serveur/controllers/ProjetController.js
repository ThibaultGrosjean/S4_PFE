var db = require('../models/bdd');
const tools = require('../models/tools');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('date',"Veuillez saisir un format correcte pour la date"),
  check('verrou',"Le verrou doit être un booléen").optional({nullable: true}).isBoolean(),
  check('archive',"L'archive doit être un booléen").optional({nullable: true}).isBoolean(),
];


exports.getAllProjets = (req, res) => {
  db.query('SELECT * FROM projet ORDER BY date DESC, nom ASC;',
    function(err, projets) {
      if (!err) {
        res.status(200).json(projets);
      }
      else {
        res.send(err);
      }
    }
  );
};


exports.getProjet = (req, res) => {
  db.query('SELECT * FROM projet where id = ? ;', [req.params.id],
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


exports.addProjet = (req, res) => {
  var data = {
    nom :  tools.safeStringSQL(req.params.name),
    date : new Date().toISOString().substr(0, 10),
    verrou : 0,
    archive : 0,
  };

  var requete = "INSERT INTO projet(nom, date, verrou, archive) VALUES ('" 
    + data['nom'] + "','"
    + data['date'] + "','"
    + data['verrou'] + "','"
    + data['archive'] + "');"
  ;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, projet) {
        if (!err) {
          res.status(200).json(projet); 
        } else  {
          res.send(err);
        }
      }
    );
  }
};


exports.copyProjet = (req, res) => {
  db.query("INSERT INTO projet(nom, date, verrou, archive)"
        +" SELECT CONCAT(nom, ' (copie)'), date, verrou, archive"
        +" FROM projet WHERE id = ?;", [req.params.id],
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


exports.editProjet = (req, res) => {
  var data = {
    id : req.body.id,
    nom : tools.safeStringSQL(req.body.nom),
    date : req.body.date,
    verrou : req.body.verrou | 0,
    archive : req.body.archive | 0,
  };

  var requete = "UPDATE projet SET nom ='" + data['nom'] 
  +"', date ='" + data['date'] 
  +"', verrou =" + data['verrou'] 
  +", archive =" + data['archive']
  +" WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    console.log(extractedErrors)
    res.send({ errors: extractedErrors, data: data});
  } else {
    db.query(requete,
      function(err, projet) {
        if (!err) {
          res.status(200).json(projet); 
        } else {
          res.send(err);
        }
      }
    );
  }
};


exports.verrouFormationProjet = (req, res) => {
  var requete="UPDATE formation SET verrou = " + req.params.verrou +" WHERE projet_id = " + req.params.projetId + ";";

  db.query(requete,
    function(err, projet) {
      if (!err) {
        res.status(200).json(projet); 
      } else {
        res.send(err);
      }
    }
  );
};


exports.deleteProjet = (req, res) => {
  db.query('DELETE FROM projet WHERE id = ? ;',[req.params.id],
    function(err, projet) {
      if (!err) {
        res.status(200).json(projet); 
      } else {
        res.send(err);
      }
    }
  );  
};