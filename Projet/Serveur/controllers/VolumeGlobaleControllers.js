var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('num_semaine',"Veuillez saisir un entier ou un nombre à virgule").isNumeric(),
  check('vol_hor_cm',"Veuillez saisir un entier ou un nombre à virgule").isFloat(),
  check('vol_hor_td',"Veuillez saisir un entier ou un nombre à virgule").isFloat(),
  check('vol_hor_tp',"Veuillez saisir un un entier ou un nombre à virgule").isFloat(),
  check('vol_hor_partiel',"Veuillez saisir un un entier ou un nombre à virgule").isFloat(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];

exports.getAllVolumeGlobales = (req, res) => {
  db.query('SELECT v.*,el.titre, e.prenom, e.nom'
      +' , SUM(el.forfait_globale_cm * v.vol_hor_cm) AS total_he_td_cm'
      +' , SUM(el.forfait_globale_td * v.vol_hor_td) AS total_he_td_td'
      +' , SUM(el.forfait_globale_tp * v.vol_hor_tp) AS total_he_td_tp'
      +' , SUM(el.forfait_globale_partiel * v.vol_hor_partiel) AS total_he_td_partiel'
      +' FROM volume_globale AS v'
      +' JOIN element AS el'
      +' ON el.id = v.element_id'
      +' JOIN intervenant AS i'
      +' ON i.id = v.intervenant_id'
      +' JOIN enseignant AS e'
      +' ON e.id = i.enseignant_id'
      +' GROUP BY v.id;',
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
  db.query('SELECT v.*, e.prenom, e.nom'
      +' , SUM(el.forfait_globale_cm * v.vol_hor_cm) AS total_HeTD_cm'
      +' , SUM(el.forfait_globale_td * v.vol_hor_td) AS total_HeTD_td'
      +' , SUM(el.forfait_globale_tp * v.vol_hor_tp) AS total_HeTD_tp'
      +' , SUM(el.forfait_globale_partiel * v.vol_hor_partiel) AS total_HeTD_partiel'
      +' FROM volume_globale AS v'
      +' JOIN element AS el'
      +' ON el.id = v.element_id'
      +' JOIN intervenant AS i'
      +' ON i.id = v.intervenant_id'
      +' JOIN enseignant AS e'
      +' ON e.id = i.enseignant_id'
      +' GROUP BY v.id'
      +' WHERE id = ? ;', [req.params.id],
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

  var requete = "INSERT INTO volume_globale(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id, intervenant_id) VALUES ('" 
    + data['num_semaine'] + "','"
    + data['vol_hor_cm'] + "','"
    + data['vol_hor_td'] + "','"
    + data['vol_hor_tp'] + "','"
    + data['vol_hor_partiel'] + "','"
    + data['element_id'] + "','"
    + data['intervenant_id'] + "');"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
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
};


exports.addVolumeGlobaleByModule = (req, res) => {
  var data = {
    num_semaine : 1,
    vol_hor_cm : 0,
    vol_hor_td : 0,
    vol_hor_tp : 0,
    vol_hor_partiel : 0,
    element_id : req.params.module,  
    intervenant_id : req.params.intervenant,
  };

  var requete = "INSERT INTO volume_globale(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id, intervenant_id) VALUES ('" 
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
         var requete = "INSERT INTO volume_globale(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, intervenant_id, element_id) VALUES ('" 
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
  var data = {
    id : req.body.id,
    num_semaine : req.body.num_semaine | 0,
    vol_hor_cm : req.body.vol_hor_cm | 0,
    vol_hor_td : req.body.vol_hor_td | 0,
    vol_hor_tp : req.body.vol_hor_tp | 0,
    vol_hor_partiel : req.body.vol_hor_partiel | 0,
    element_id : req.body.element_id,  
    intervenant_id : req.body.intervenant_id,  
  };
  var requete = "UPDATE volume_globale SET num_semaine ='" + data['num_semaine'] 
  +"', vol_hor_cm ='" + data['vol_hor_cm'] 
  +"', vol_hor_td ='" + data['vol_hor_td'] 
  +"', vol_hor_tp ='" + data['vol_hor_tp'] 
  +"', vol_hor_partiel ='" + data['vol_hor_partiel']
  +"', element_id ='" + data['element_id']
  +"', intervenant_id ='" + data['intervenant_id']
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
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
};


exports.editTypeValueElementVolumesGlobaux = (req, res) => {
  var typeUpdate = ''
  switch(req.params.type) {
    case 'cm':
      typeUpdate = "forfait_globale_cm =" + req.params.value
      break;
    case 'td':
      typeUpdate = "forfait_globale_td =" + req.params.value
      break;
    case 'tp':
      typeUpdate = "forfait_globale_tp =" + req.params.value
      break;
    case 'partiel':
      typeUpdate = "forfait_globale_partiel =" + req.params.value
      break;
    default:
  } 

  var requete = "UPDATE element SET " + typeUpdate
  +" WHERE id = " + req.params.id +";";

  db.query(requete,
    function(err, volume_globale) {
      if (!err) {
        res.status(200).json(volume_globale); 
      } else {
        res.send(err);
      }
    }
  );
};


exports.deleteAllVolumesGlobauxByFormation = (req, res) => {
  db.query('DELETE v'
        +' FROM volume_globale AS v'
        +' LEFT JOIN element as e'
        +' ON v.element_id = e.id'
        +' LEFT JOIN element as e2'
        +' ON e.parent = e2.id'
        +' LEFT JOIN element as e3'
        +' ON e2.parent = e3.id'
        +' WHERE e3.parent = ' + req.params.id + ' OR e2.parent = ' + req.params.id,
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


exports.deleteAllVolumesGlobaux = (req, res) => {
  db.query('DELETE FROM volume_globale WHERE element_id = ' + req.params.element + ' AND intervenant_id = ' + req.params.intervenant,
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


exports.deleteVolumeGlobale = (req, res) => {
  db.query('DELETE FROM volume_globale WHERE id = ? ;',[req.params.id],
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