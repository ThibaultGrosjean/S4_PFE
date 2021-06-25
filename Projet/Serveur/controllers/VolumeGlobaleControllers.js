var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('num_semaine',"Veuillez saisir un numérique non nul").isNumeric(),
  check('vol_hor_cm',"Veuillez saisir un numérique non nul").isDecimal(),
  check('vol_hor_td',"Veuillez saisir un numérique non nul").isDecimal(),
  check('vol_hor_tp',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('vol_hor_partiel',"Veuillez saisir un un numérique non nul").isDecimal(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
  check('intervenant_id ',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllVolumeGlobales = (req, res) => {
  db.query('SELECT * FROM volume_globale;',
    function(err, volume_globales) {
      if (!err) {
        res.status(200).json(volume_globales);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getVolumeGlobale = (req, res) => {
  db.query('SELECT * FROM volume_globale WHERE id = ? ;', [req.params.id],
    function(err, volume_globale) {
      if (!err) {
        res.status(200).json(volume_globale);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addVolumeGlobale = (req, res) => {
  var data = {
    num_semaine : req.body.num_semaine,
    vol_hor_cm : req.body.vol_hor_cm,
    vol_hor_td : req.body.vol_hor_td,
    vol_hor_tp : req.body.vol_hor_tp,
    vol_hor_partiel : req.body.vol_hor_partiel,
    element_id : req.body.element_id,  
    intervenant_id : req.body.intervenant_id,  
  };

  var requete="INSERT INTO volume_globale(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id, intervenant_id) VALUES ('" 
    + data['num_semaine'] + "','"
    + data['vol_hor_cm'] + "','"
    + data['vol_hor_td'] + "','"
    + data['vol_hor_tp'] + "','"
    + data['vol_hor_partiel'] + "','"
    + data['element_id'] + "','"
    + data['intervenant_id'] + "');"
  ;

  db.query(requete,
    function(err, volume_globale) {
      if (!err) {
        res.status(200).json(volume_globale); 
      } else  {
        res.send(err);
      }
    }
  );
};


exports.copyVolumeGlobale = (req, res) => {
  db.query('SELECT * FROM volume_globale where id = ? ;', [req.params.id],
    function(err, volume_globale) {
      if (!err) {
         var requete="INSERT INTO volume_globale(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, intervenant_id, element_id) VALUES ('" 
          + parseInt(volume_globale[0]['num_semaine']+1) + "','"
          + volume_globale[0]['vol_hor_cm'] + "','"
          + volume_globale[0]['vol_hor_td'] + "','"
          + volume_globale[0]['vol_hor_tp'] + "','"
          + volume_globale[0]['vol_hor_partiel'] + "','"
          + volume_globale[0]['intervenant_id'] + "','"
          + volume_globale[0]['element_id'] + "');"
        ;

        db.query(requete,
          function(err, volume_globale) {
            if (!err) {
              res.status(200).json(volume_globale); 
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


exports.editVolumeGlobale = (req, res) => {
  var donnees = {
    id : req.body.id,
    num_semaine : req.body.num_semaine,
    vol_hor_cm : req.body.vol_hor_cm,
    vol_hor_td : req.body.vol_hor_td,
    vol_hor_tp : req.body.vol_hor_tp,
    vol_hor_partiel : req.body.vol_hor_partiel,
    element_id : req.body.element_id,  
    intervenant_id : req.body.intervenant_id,  
  };
  var requete="UPDATE volume_globale SET num_semaine ='" + donnees['num_semaine'] 
  +"', vol_hor_cm ='" + donnees['vol_hor_cm'] 
  +"', vol_hor_td ='" + donnees['vol_hor_td'] 
  +"', vol_hor_tp ='" + donnees['vol_hor_tp'] 
  +"', vol_hor_partiel ='" + donnees['vol_hor_partiel']
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


exports.deleteVolumeGlobale = (req, res) => {
  db.query('DELETE FROM volume_globale WHERE id = ? ;',[req.params.id],
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