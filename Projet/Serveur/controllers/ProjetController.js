var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('nom',"Veuillez saisir un nom avec au minimum 2 caractères").isLength({ min: 2 }),
  check('date_achat',"Veuillez saisir un format correcte pour la date").matches(/^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/]\d{4}$/, "i"),
  check('verrou',"Le verrou doit être un booléen").isBoolean(),
  check('archive',"L'archive doit être un booléen").isBoolean(),
];


exports.getAllProjets = (req, res) => {
  db.query('SELECT * FROM projet;',
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
    nom : req.body.nom,
    date : req.body.date,
    verrou : req.body.verrou,
    archive : req.body.archive,
  };

  var requete="INSERT INTO projet(nom, date, verrou, archive) VALUES ('" 
    + data['nom'] + "','"
    + data['date'] + "','"
    + data['verrou'] + "','"
    + data['archive'] + "');"
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


exports.copyProjet = (req, res) => {
  db.query('SELECT * FROM projet where id = ? ;', [req.params.id],
    function(err, projet) {
      if (!err) {
        var requete="INSERT INTO projet(nom, date, verrou, archive) VALUES ('" 
          + projet[0]['nom'] + ' (copie)' + "','"
          + projet[0]['date'] + "','"
          + projet[0]['verrou'] + "','"
          + projet[0]['archive'] + "');"
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


exports.editProjet = (req, res) => {
  var donnees = {
    id : req.body.id,
    nom : req.body.nom,
    date : req.body.date,
    verrou : req.body.verrou,
    archive : req.body.archive,
  };
  var requete="UPDATE projet SET nom ='" + donnees['nom'] 
  +"', date ='" + donnees['date'] 
  +"', verrou ='" + donnees['verrou'] 
  +"', archive ='" + donnees['archive']
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


exports.deleteProjet = (req, res) => {
  db.query('DELETE FROM projet WHERE id = ? ;',[req.params.id],
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