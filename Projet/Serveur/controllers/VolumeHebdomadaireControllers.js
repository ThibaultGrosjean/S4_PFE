var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('num_semaine',"Veuillez saisir un numérique non nul").isNumeric(),
  check('vol_hor_cm',"Veuillez saisir un numérique non nul").isDecimal(),
  check('vol_hor_td',"Veuillez saisir un numérique non nul").isDecimal(),
  check('vol_hor_tp',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('vol_hor_partiel',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllVolumeHebdomadaires = (req, res) => {
  db.query('SELECT v.*, eee.parent AS semestre_id '
        + ' FROM volume_hebdomadaire as v'
        + ' LEFT JOIN element as ee'
        + ' ON v.element_id = ee.id'
        + ' LEFT JOIN element as eee'
        + ' ON ee.parent = eee.id'
        + ' ORDER BY v.element_id, v.num_semaine',
    function(err, volume_hebdomadaires) {
      if (!err) {
        res.status(200).json(volume_hebdomadaires);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getVolumeHebdomadaire = (req, res) => {
  db.query('SELECT * FROM volume_hebdomadaire WHERE id = ? ;', [req.params.id],
    function(err, volume_hebdomadaire) {
      if (!err) {
        res.status(200).json(volume_hebdomadaire);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addVolumeHebdomadaire = (req, res) => {
  var data = {
    num_semaine : req.body.num_semaine,
    vol_hor_cm : req.body.vol_hor_cm,
    vol_hor_td : req.body.vol_hor_td,
    vol_hor_tp : req.body.vol_hor_tp,
    vol_hor_partiel : req.body.vol_hor_partiel,
    element_id : req.body.element_id,  
  };

  var requete="INSERT INTO volume_hebdomadaire(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id) VALUES ('" 
    + data['num_semaine'] + "','"
    + data['vol_hor_cm'] + "','"
    + data['vol_hor_td'] + "','"
    + data['vol_hor_tp'] + "','"
    + data['vol_hor_partiel'] + "','"
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


exports.addVolumesHebdomadaires = (req, res) => {
  var moduleId = req.params.module
  var nbSemaineDeb = req.params.semaineDeb
  var nbSemaineFin = req.params.semaineFin

  var data = {
    num_semaine : 0,
    vol_hor_cm : 0,
    vol_hor_td : 0,
    vol_hor_tp : 0,
    vol_hor_partiel : 0,
    element_id : moduleId,
  };

  for (let i = nbSemaineDeb; i <= nbSemaineFin; i++) {
    data['num_semaine'] = i;

    var requete="INSERT INTO volume_hebdomadaire(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id) VALUES ('" 
      + data['num_semaine'] + "','"
      + data['vol_hor_cm'] + "','"
      + data['vol_hor_td'] + "','"
      + data['vol_hor_tp'] + "','"
      + data['vol_hor_partiel'] + "','"
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
  }


  
};


exports.copyVolumeHebdomadaire = (req, res) => {
  db.query('SELECT * FROM volume_hebdomadaire where id = ? ;', [req.params.id],
    function(err, volume_hebdomadaire) {
      if (!err) {
         var requete="INSERT INTO volume_hebdomadaire(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id) VALUES ('" 
          + parseInt(volume_hebdomadaire[0]['num_semaine']+1) + "','"
          + volume_hebdomadaire[0]['vol_hor_cm'] + "','"
          + volume_hebdomadaire[0]['vol_hor_td'] + "','"
          + volume_hebdomadaire[0]['vol_hor_tp'] + "','"
          + volume_hebdomadaire[0]['vol_hor_partiel'] + "','"
          + volume_hebdomadaire[0]['element_id'] + "');"
        ;

        db.query(requete,
          function(err, volume_hebdomadaire) {
            if (!err) {
              res.status(200).json(volume_hebdomadaire); 
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


exports.editVolumeHebdomadaire = (req, res) => {
  var donnees = {
    id : req.body.id,
    num_semaine : req.body.num_semaine,
    vol_hor_cm : req.body.vol_hor_cm,
    vol_hor_td : req.body.vol_hor_td,
    vol_hor_tp : req.body.vol_hor_tp,
    vol_hor_partiel : req.body.vol_hor_partiel,
    element_id : req.body.element_id,  
  };
  var requete="UPDATE volume_hebdomadaire SET num_semaine ='" + donnees['num_semaine'] 
  +"', vol_hor_cm ='" + donnees['vol_hor_cm'] 
  +"', vol_hor_td ='" + donnees['vol_hor_td'] 
  +"', vol_hor_tp ='" + donnees['vol_hor_tp'] 
  +"', vol_hor_partiel ='" + donnees['vol_hor_partiel']
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


exports.editTypeValueElementVolumeHebdomadaire = (req, res) => {
  var typeUpdate = ''
  switch(req.params.type) {
    case 'cm':
      typeUpdate = "vol_hor_cm =" + req.params.value
      break;
    case 'td':
      typeUpdate = "vol_hor_td =" + req.params.value
      break;
    case 'tp':
      typeUpdate = "vol_hor_tp =" + req.params.value
      break;
    case 'partiel':
      typeUpdate = "vol_hor_partiel =" + req.params.value
      break;
    default:
  } 

  var requete="UPDATE volume_hebdomadaire SET " + typeUpdate
  +" WHERE element_id = " + req.params.id +";";

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


exports.deleteVolumeHebdomadaire = (req, res) => {
  db.query('DELETE FROM volume_hebdomadaire WHERE id = ? ;',[req.params.id],
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