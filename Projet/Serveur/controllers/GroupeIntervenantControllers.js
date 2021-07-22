var db = require('../models/bdd');
const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('num_semaine',"Veuillez saisir un entier ou un nombre à virgule").isNumeric(),
  check('nb_groupe_cm',"Veuillez saisir un entier ou un nombre à virgule").isNumeric(),
  check('nb_groupe_td',"Veuillez saisir un entier ou un nombre à virgule").isNumeric(),
  check('nb_groupe_tp',"Veuillez saisir un un entier ou un nombre à virgule").isNumeric(),
  check('nb_groupe_partiel',"Veuillez saisir un un entier ou un nombre à virgule").isNumeric(),
  check('element_id',"Veuillez sélectionner un élément").isNumeric(),
];


exports.getAllGroupeIntervenants = (req, res) => {
  db.query('SELECT g.*, eee.parent AS semestre_id'
        +' FROM groupe_intervenant AS g'
        +' LEFT JOIN element as ee'
        +' ON g.element_id = ee.id'
        +' LEFT JOIN element as eee'
        +' ON ee.parent = eee.id'
        +' GROUP BY g.element_id, g.id'
        +' ORDER BY g.element_id, g.intervenant_id, g.num_semaine',
    function(err, groupes_intervenants) {
      if (!err) {
        res.status(200).json(groupes_intervenants);  
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getGroupeIntervenant = (req, res) => {
  db.query('SELECT g.*, eee.parent AS semestre_id'
        +' FROM groupe_intervenant AS g'
        +' LEFT JOIN element as ee'
        +' ON g.element_id = ee.id'
        +' LEFT JOIN element as eee'
        +' ON ee.parent = eee.id'
        +' WHERE id = ' +  req.params.id
        +' GROUP BY g.element_id, g.id'
        +' ORDER BY g.element_id, g.intervenant_id, g.num_semaine;',
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


exports.getAllGroupeIntervenantByModule = (req, res) => {
  db.query('SELECT g.element_id, g.intervenant_id, e.prenom, e.nom, total.total_nb_grp_cm, total.total_nb_grp_td, total.total_nb_grp_tp, total.total_nb_grp_partiel'
        +' FROM groupe_intervenant AS g'
        +' LEFT JOIN ('
        +'     SELECT '
        +'       g2.intervenant_id, g2.element_id,'
        +'     SUM(g2.nb_groupe_cm) as total_nb_grp_cm,'
        +'     SUM(g2.nb_groupe_td) as total_nb_grp_td,'
        +'     SUM(g2.nb_groupe_tp) as total_nb_grp_tp,'
        +'     SUM(g2.nb_groupe_partiel) as total_nb_grp_partiel'
        +'     FROM groupe_intervenant AS g2'
        +'     GROUP BY g2.element_id, g2.intervenant_id'
        +' ) AS total '
        +' ON total.intervenant_id = g.intervenant_id AND total.element_id = g.element_id'
        +' JOIN intervenant AS i' 
        +' ON i.id = g.intervenant_id'
        +' JOIN enseignant AS e'
        +' ON e.id = i.enseignant_id'
        +' GROUP BY g.element_id, g.intervenant_id, e.id, total.total_nb_grp_cm, total.total_nb_grp_td, total.total_nb_grp_tp, total.total_nb_grp_partiel',
    function(err, groupes_intervenants) {
      if (!err) {
        res.status(200).json(groupes_intervenants);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.getGroupeIntervenantByModule = (req, res) => {
  db.query('SELECT g.*, e.id AS enseignant_id' 
        +' FROM groupe_intervenant AS g'
        +' JOIN intervenant AS i' 
        +' ON i.id = g.intervenant_id'
        +' JOIN enseignant AS e'
        +' ON e.id = i.enseignant_id'
        +' WHERE g.element_id = ?', [req.params.id],
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

  var requete = "INSERT INTO groupe_intervenant(num_semaine, nb_groupe_cm, nb_groupe_td, nb_groupe_tp, nb_groupe_partiel, element_id, intervenant_id) VALUES ('" 
    + data['num_semaine'] + "','"
    + data['nb_groupe_cm'] + "','"
    + data['nb_groupe_td'] + "','"
    + data['nb_groupe_tp'] + "','"
    + data['nb_groupe_partiel'] + "','"
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
      function(err, groupe_intervenant) {
        if (!err) {
          res.status(200).json(groupe_intervenant); 
        } else  {
          res.send(err);
        }
      }
    );
  }
};


exports.addGroupesIntervenants = (req, res) => {
  var moduleId = req.params.module
  var intervenantId = req.params.intervenant
  var nbSemaineDeb = req.params.semaineDeb
  var nbSemaineFin = req.params.semaineFin

  var data = {
    num_semaine : 0,
    nb_groupe_cm : 0,
    nb_groupe_td : 0,
    nb_groupe_tp : 0,
    nb_groupe_partiel : 0,
    element_id : moduleId,
    intervenant_id : intervenantId,
  };

  var requete = "INSERT INTO groupe_intervenant(num_semaine, nb_groupe_cm, nb_groupe_td, nb_groupe_tp, nb_groupe_partiel, element_id, intervenant_id) VALUES ";

  for (let i = nbSemaineDeb; i <= nbSemaineFin; i++) {
    data['num_semaine'] = i;
    var values ="('" + data['num_semaine'] + "','"+ data['nb_groupe_cm'] + "','"+ data['nb_groupe_td'] + "','"+ data['nb_groupe_tp'] + "','"+ data['nb_groupe_partiel'] + "','"+ data['element_id'] + "','"+ data['intervenant_id'] + "')";
    if (i < nbSemaineFin) values += ",";
    requete += values;
  }
  db.query(requete,
    function(err, groupe_intervenant) {
      if (!err) {
        res.status(200).json(groupe_intervenant); 
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
         var requete = "INSERT INTO groupe_intervenant(num_semaine, nb_groupe_cm, nb_groupe_td, nb_groupe_tp, nb_groupe_partiel, element_id, intervenant_id) VALUES ('" 
          + groupe_intervenant[0]['num_semaine'] + "','"
          + groupe_intervenant[0]['nb_groupe_cm'] + "','"
          + groupe_intervenant[0]['nb_groupe_td'] + "','"
          + groupe_intervenant[0]['nb_groupe_tp'] + "','"
          + groupe_intervenant[0]['nb_groupe_partiel'] + "','"
          + req.params.parent + "',"
          + "(SELECT i.id FROM intervenant AS i WHERE i.enseignant_id = "+ req.params.enseignant +" AND i.projet_id = "+ req.params.projet +"));"
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
  var data = {
    id : req.body.id,
    num_semaine : req.body.num_semaine | 0,
    nb_groupe_cm : req.body.nb_groupe_cm | 0,
    nb_groupe_td : req.body.nb_groupe_td | 0,
    nb_groupe_tp : req.body.nb_groupe_tp | 0,
    nb_groupe_partiel : req.body.nb_groupe_partiel | 0,
    element_id : req.body.element_id,
    intervenant_id : req.body.intervenant_id,  
  };
  var requete = "UPDATE groupe_intervenant SET num_semaine ='" + data['num_semaine'] 
  +"', nb_groupe_cm ='" + data['nb_groupe_cm'] 
  +"', nb_groupe_td ='" + data['nb_groupe_td'] 
  +"', nb_groupe_tp ='" + data['nb_groupe_tp'] 
  +"', nb_groupe_partiel ='" + data['nb_groupe_partiel']
  +"', element_id ='" + data['element_id']
  +"', intervenant_id ='" + data['intervenant_id']
  +"' WHERE id = " + req.params.id + ";";

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    if (data.intervenant_id) console.log(data.intervenant_id)
    res.send({ errors: extractedErrors, data: data});
  } else {
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

  var requete = "UPDATE groupe_intervenant SET " + typeUpdate
  +" WHERE element_id = " + req.params.id +" AND intervenant_id  = " + req.params.intervenant + ";";

  db.query(requete,
    function(err, groupe_intervenant) {
      if (!err) {
        res.status(200).json(groupe_intervenant); 
      } else {
        res.send(err);
      }
    }
  );
};


exports.deleteAllGroupesIntervenantsBySemaine = (req, res) => {
  var nbSemaineDeb = req.params.semaineDeb
  var nbSemaineFin = req.params.semaineFin

  db.query('DELETE g'
        +' FROM groupe_intervenant AS g'
        +' LEFT JOIN element as e'
        +' ON g.element_id = e.id'
        +' LEFT JOIN element as e2'
        +' ON e.parent = e2.id'
        +' WHERE e2.parent = '+ req.params.id
        +' AND g.num_semaine > '+ nbSemaineDeb +' AND g.num_semaine <= '+ nbSemaineFin +';',
    function(err, groupes_intervenants) {
      if (!err) {
        res.status(200).json(groupes_intervenants);
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.deleteAllGroupesIntervenantsByFormation = (req, res) => {
  db.query('DELETE g'
        +' FROM groupe_intervenant AS g'
        +' LEFT JOIN element as e'
        +' ON g.element_id = e.id'
        +' LEFT JOIN element as e2'
        +' ON e.parent = e2.id'
        +' LEFT JOIN element as e3'
        +' ON e2.parent = e3.id'
        +' WHERE e3.parent = ?',[req.params.id],
    function(err, groupes_intervenants) {
      if (!err) {
        res.status(200).json(groupes_intervenants);
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.deleteAllGroupesIntervenants = (req, res) => {
  db.query('DELETE FROM groupe_intervenant WHERE element_id = ' + req.params.element + ' AND intervenant_id = ' + req.params.intervenant,
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


exports.deleteGroupeIntervenant = (req, res) => {
  db.query('DELETE FROM groupe_intervenant WHERE id = ? ;',[req.params.id],
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