var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('verrou',"Le verrou doit être un booléen").isBoolean(),
  check('projet_id',"Veuillez sélectionner un projet").isNumeric(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllFormations = (req, res) => {
  db.query('SELECT * FROM formation;',
    function(err, formations) {
      if (!err) {
        res.status(200).json(formations);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getFormation = (req, res) => {
  db.query('SELECT * FROM formation WHERE id = ? ;', [req.params.id],
    function(err, formation) {
      if (!err) {
        res.status(200).json(formation);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addFormation = (req, res) => {
  var data = {
    verrou : 0,
    projet_id : req.body.projet_id,
    element_id : req.body.element_id,  
  };

  var requete="INSERT INTO formation(verrou, projet_id, element_id) VALUES ('" 
    + data['verrou'] + "','"
    + data['projet_id'] + "','"
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


exports.editFormation = (req, res) => {
  var donnees = {
    id : req.body.id,
    verrou : req.body.verrou,
    projet_id : req.body.projet_id,
    element_id : req.body.element_id,  
  };
  var requete="UPDATE formation SET verrou ='" + donnees['verrou'] 
  +"', projet_id ='" + donnees['projet_id']
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


exports.deleteFormation = (req, res) => {
  db.query('DELETE FROM formation WHERE id = ? ;',[req.params.id],
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