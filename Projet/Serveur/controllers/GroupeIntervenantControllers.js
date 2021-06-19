var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('num_semaine',"Veuillez saisir un numérique non nul").isNumeric(),
  check('nb_groupe_cm',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_groupe_td',"Veuillez saisir un numérique non nul").isDecimal(),
  check('nb_groupe_tp',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('nb_groupe_partiel',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
  check('intervenant_id ',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllGroupeIntervenants = (req, res) => {
  db.query('SELECT * FROM groupe_intervenant;',
    function(err, groupe_intervenants) {
      if (!err) {
        res.status(200).json(groupe_intervenants);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getGroupeIntervenant = (req, res) => {
  db.query('SELECT * FROM groupe_intervenant WHERE id = ? ;', [req.params.id],
    function(err, groupe_intervenant) {
      if (!err) {
        res.status(200).json(groupe_intervenant);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getIntervenantByModule = (req, res) => {
  db.query('SELECT element_id, intervenant_id'
        +' FROM groupe_intervenant'
        +' GROUP BY element_id, intervenant_id;',
    function(err, groupe_intervenant) {
      if (!err) {
        res.status(200).json(groupe_intervenant);  
      }
      else {
        res.send(err);
      }
    }
  );  
};



exports.addGroupeIntervenant = (req, res) => {
  var data = {
    num_semaine : req.body.num_semaine,
    nb_groupe_cm : req.body.nb_groupe_cm,
    nb_groupe_td : req.body.nb_groupe_td,
    nb_groupe_tp : req.body.nb_groupe_tp,
    nb_groupe_partiel : req.body.nb_groupe_partiel,
    element_id : req.body.element_id,
    intervenant_id : req.body.intervenant_id,
  };

  var requete="INSERT INTO groupe_intervenant(num_semaine, nb_groupe_cm, nb_groupe_td, nb_groupe_tp, nb_groupe_partiel, element_id, intervenant_id) VALUES ('" 
    + data['num_semaine'] + "','"
    + data['nb_groupe_cm'] + "','"
    + data['nb_groupe_td'] + "','"
    + data['nb_groupe_tp'] + "','"
    + data['nb_groupe_partiel'] + "','"
    + data['element_id'] + "','"
    + data['intervenant_id'] + "');"
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


exports.copyGroupeIntervenant = (req, res) => {
  db.query('SELECT * FROM groupe_intervenant WHERE id = ? ;', [req.params.id],
    function(err, groupe_intervenant) {
      if (!err) {
         var requete="INSERT INTO groupe_intervenant(num_semaine, nb_groupe_cm, nb_groupe_td, nb_groupe_tp, nb_groupe_partiel, element_id, intervenant_id) VALUES ('" 
          + parseInt(groupe_intervenant[0]['num_semaine']+1) + "','"
          + groupe_intervenant[0]['nb_groupe_cm'] + "','"
          + groupe_intervenant[0]['nb_groupe_td'] + "','"
          + groupe_intervenant[0]['nb_groupe_tp'] + "','"
          + groupe_intervenant[0]['nb_groupe_partiel'] + "','"
          + groupe_intervenant[0]['element_id'] + "','"
          + groupe_intervenant[0]['intervenant_id'] + "');"
        ;

        db.query(requete,
          function(err, groupe_intervenant) {
            if (!err) {
              res.status(200).json(groupe_intervenant); 
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


exports.editGroupeIntervenant = (req, res) => {
  var donnees = {
    id : req.body.id,
    num_semaine : req.body.num_semaine,
    nb_groupe_cm : req.body.nb_groupe_cm,
    nb_groupe_td : req.body.nb_groupe_td,
    nb_groupe_tp : req.body.nb_groupe_tp,
    nb_groupe_partiel : req.body.nb_groupe_partiel,
    element_id : req.body.element_id,
    intervenant_id : req.body.intervenant_id,  
  };
  var requete="UPDATE groupe_intervenant SET num_semaine ='" + donnees['num_semaine'] 
  +"', nb_groupe_cm ='" + donnees['nb_groupe_cm'] 
  +"', nb_groupe_td ='" + donnees['nb_groupe_td'] 
  +"', nb_groupe_tp ='" + donnees['nb_groupe_tp'] 
  +"', nb_groupe_partiel ='" + donnees['nb_groupe_partiel']
  +"', element_id ='" + donnees['element_id']
  +"', intervenant_id ='" + donnees['intervenant_id']
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


exports.editTypeValueElementGroupeIntervenant = (req, res) => {
  var typeUpdate = ''
  switch(req.params.type) {
    case 'cm':
      typeUpdate = "nb_groupe_cm =" + req.params.value
      break;
    case 'td':
      typeUpdate = "nb_groupe_td =" + req.params.value
      break;
    case 'tp':
      typeUpdate = "nb_groupe_tp =" + req.params.value
      break;
    case 'partiel':
      typeUpdate = "nb_groupe_partiel =" + req.params.value
      break;
    default:
  } 

  var requete="UPDATE groupe_intervenant SET " + typeUpdate
  +" WHERE element_id = " + req.params.id +" AND intervenant_id  = " + req.params.intervenant + ";";

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


exports.deleteGroupeIntervenant = (req, res) => {
  db.query('DELETE FROM groupe_intervenant WHERE id = ? ;',[req.params.id],
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