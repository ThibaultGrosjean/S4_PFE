var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('num_semaine',"Veuillez saisir un entier ou un nombre à virgule").isNumeric(),
  check('vol_hor_cm',"Veuillez saisir un entier ou un nombre à virgule").isFloat(),
  check('vol_hor_td',"Veuillez saisir un entier ou un nombre à virgule").isFloat(),
  check('vol_hor_tp',"Veuillez saisir un entier ou un nombre à virgule").isFloat(),
  check('vol_hor_partiel',"Veuillez saisir un entier ou un nombre à virgule").isFloat(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllVolumeHebdomadaires = (req, res) => {
  db.query('SELECT v.*, eee.parent AS semestre_id , '
        +' SUM(v2.vol_hor_cm) as total_vol_hor_cm,'
        +' SUM(v2.vol_hor_td) as total_vol_hor_td,'
        +' SUM(v2.vol_hor_tp) as total_vol_hor_tp,'
        +' SUM(v2.vol_hor_partiel) as total_vol_hor_partiel'
        +' FROM volume_hebdomadaire as v'
        +' LEFT JOIN element as ee'
        +' ON v.element_id = ee.id'
        +' LEFT JOIN element as eee'
        +' ON ee.parent = eee.id'
        +' LEFT JOIN volume_hebdomadaire as v2'
        +' ON v.element_id = v2.element_id'
        +' GROUP BY v.element_id, v.id'
        +' ORDER BY v.element_id, v.num_semaine',
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


exports.getAllVolumesHebdoByModule = (req, res) => {
  db.query('SELECT v.element_id, COUNT(DISTINCT g.id) AS nbGrpInterv'
        +' , total.total_vol_hor_cm, total.total_vol_hor_td, total.total_vol_hor_tp, total.total_vol_hor_partiel'
        +' FROM volume_hebdomadaire AS v'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.element_id = v.element_id'
        +' LEFT JOIN ('
        +'     SELECT'
        +'       v.element_id AS id,'
        +'     SUM(v.vol_hor_cm) as total_vol_hor_cm,'
        +'     SUM(v.vol_hor_td) as total_vol_hor_td,'
        +'     SUM(v.vol_hor_tp) as total_vol_hor_tp,'
        +'     SUM(v.vol_hor_partiel) as total_vol_hor_partiel'
        +'     FROM volume_hebdomadaire AS v'
        +'       GROUP BY v.element_id'
        +' ) AS total'
        +' ON total.id = v.element_id'
        +' GROUP BY v.element_id, total.total_vol_hor_cm, total.total_vol_hor_td, total.total_vol_hor_tp, total.total_vol_hor_partiel;',
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


exports.getVolumeHebdoByModule = (req, res) => {
  db.query('SELECT v.*' 
        +' FROM volume_hebdomadaire AS v'
        +' WHERE v.element_id = ?', [req.params.id],
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
    num_semaine : req.body.num_semaine | 0,
    vol_hor_cm : req.body.vol_hor_cm | 0,
    vol_hor_td : req.body.vol_hor_td | 0,
    vol_hor_tp : req.body.vol_hor_tp | 0,
    vol_hor_partiel : req.body.vol_hor_partiel | 0,
    element_id : req.body.element_id,  
  };

  var requete = "INSERT INTO volume_hebdomadaire(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id) VALUES ('" 
    + data['num_semaine'] + "','"
    + data['vol_hor_cm'] + "','"
    + data['vol_hor_td'] + "','"
    + data['vol_hor_tp'] + "','"
    + data['vol_hor_partiel'] + "','"
    + data['element_id'] + "');"
  ;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
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

  var requete = "INSERT INTO volume_hebdomadaire(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id) VALUES";

  for (let i = nbSemaineDeb; i <= nbSemaineFin; i++) {
    data['num_semaine'] = i;
    var values = " ('" + data['num_semaine'] + "','"+ data['vol_hor_cm'] + "','" + data['vol_hor_td'] + "','" + data['vol_hor_tp'] + "','" + data['vol_hor_partiel'] + "','" + data['element_id'] + "')";
    if (i < nbSemaineFin) values += ",";
    requete += values;
  }
  
  db.query(requete,
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


exports.copyVolumeHebdomadaire = (req, res) => {
  db.query('SELECT * FROM volume_hebdomadaire where id = ? ;', [req.params.id],
    function(err, volume_hebdomadaire) {
      if (!err) {
         var requete = "INSERT INTO volume_hebdomadaire(num_semaine, vol_hor_cm, vol_hor_td, vol_hor_tp, vol_hor_partiel, element_id) VALUES ('" 
          + volume_hebdomadaire[0]['num_semaine'] + "','"
          + volume_hebdomadaire[0]['vol_hor_cm'] + "','"
          + volume_hebdomadaire[0]['vol_hor_td'] + "','"
          + volume_hebdomadaire[0]['vol_hor_tp'] + "','"
          + volume_hebdomadaire[0]['vol_hor_partiel'] + "','"
          + req.params.parent + "');"
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
  var data = {
    id : req.body.id,
    num_semaine : req.body.num_semaine | 0,
    vol_hor_cm : req.body.vol_hor_cm | 0,
    vol_hor_td : req.body.vol_hor_td | 0,
    vol_hor_tp : req.body.vol_hor_tp | 0,
    vol_hor_partiel : req.body.vol_hor_partiel | 0,
    element_id : req.body.element_id,  
  };
  var requete = "UPDATE volume_hebdomadaire SET num_semaine ='" + data['num_semaine'] 
  +"', vol_hor_cm ='" + data['vol_hor_cm'] 
  +"', vol_hor_td ='" + data['vol_hor_td'] 
  +"', vol_hor_tp ='" + data['vol_hor_tp'] 
  +"', vol_hor_partiel ='" + data['vol_hor_partiel']
  +"', element_id ='" + data['element_id']
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: data});
  } else {
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

  var requete = "UPDATE volume_hebdomadaire SET " + typeUpdate
  +" WHERE element_id = " + req.params.id +";";

  db.query(requete,
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


exports.deleteAllVolumesHebdomadairesBySemaine = (req, res) => {
  var nbSemaineDeb = req.params.semaineDeb
  var nbSemaineFin = req.params.semaineFin

  db.query('DELETE v'
        +' FROM volume_hebdomadaire AS v'
        +' LEFT JOIN element as e'
        +' ON v.element_id = e.id'
        +' LEFT JOIN element as e2'
        +' ON e.parent = e2.id'
        +' WHERE e2.parent = '+ req.params.id
        +' AND v.num_semaine > '+ nbSemaineDeb +' AND v.num_semaine <= '+ nbSemaineFin +';',
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


exports.deleteAllVolumesHebdomadairesByFormation = (req, res) => {
  db.query('DELETE v'
        +' FROM volume_hebdomadaire AS v'
        +' LEFT JOIN element as e'
        +' ON v.element_id = e.id'
        +' LEFT JOIN element as e2'
        +' ON e.parent = e2.id'
        +' LEFT JOIN element as e3'
        +' ON e2.parent = e3.id'
        +' WHERE e3.parent = ?',[req.params.id],
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


exports.deleteAllVolumesHebdomadaires = (req, res) => {
  db.query('DELETE FROM volume_hebdomadaire WHERE element_id = ' + req.params.element,
    function(err) {
      if (!err) {
        res.status(200); 
      }
      else {
        res.send(err);
      }
    }
  );
  // Par sécurité supprime aussi tous les groupes_intervenants
  db.query('DELETE FROM groupe_intervenant WHERE element_id = ' + req.params.element,
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


exports.deleteVolumeHebdomadaire = (req, res) => {
  db.query('DELETE FROM volume_hebdomadaire WHERE id = ? ;',[req.params.id],
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