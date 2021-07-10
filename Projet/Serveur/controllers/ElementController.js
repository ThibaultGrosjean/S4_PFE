var db = require('../models/bdd');
const { check, validator } = require('express-validator');

exports.validator = [
  check('titre',"Veuillez saisir un titre avec au minimum 2 caractères").isLength({ min: 2 }),
  check('surnom',"Le surnom doit être un numérique non nul").isLength({ min: 2 }),
  check('code',"Veuillez saisir un code avec au minimum 2 caractères").isLength({ min: 2 }),
  check('niveau',"Le niveau doit être un numérique non nul").isNumeric().optional(),
  check('indice',"L'indice doit être un numérique non nul").isNumeric(),
  check('vol_hor_total_prevues_etu_cm',"Saisir un numérique non nul").isDecimal().optional(),
  check('vol_hor_total_prevues_etu_tp',"Saisir un numérique non nul").isDecimal().optional(),
  check('vol_hor_total_prevues_etu_tp',"Saisir un numérique non nul").isDecimal().optional(),
  check('mode_saisie',"Veuillez saisir un mode de saisie").isLength({ min: 2 }),
  check('cm_autorises',"Saisir un booléen").isBoolean(),
  check('td_autorises',"Saisir un booléen").isBoolean(),
  check('tp_autorises',"Saisir un booléen").isBoolean(),
  check('partiel_autorises',"Saisir un booléen").isBoolean(),
  check('forfait_globale_cm',"Saisir un numérique non nul").isDecimal().optional(),
  check('forfait_globale_td',"Saisir un numérique non nul").isDecimal().optional(),
  check('forfait_globale_tp',"Saisir un numérique non nul").isDecimal().optional(),
  check('forfait_globale_partiel',"Saisir un numérique non nul").isDecimal().optional(),
  check('nb_groupe_effectif_cm',"Saisir un numérique non nul").isNumeric().optional(),
  check('nb_groupe_effectif_td',"Saisir un numérique non nul").isNumeric().optional(),
  check('nb_groupe_effectif_tp',"Saisir un numérique non nul").isNumeric().optional(),
  check('nb_groupe_effectif_partiel',"Saisir un numérique non nul").isNumeric().optional(),
  check('parent',"Veuillez selectionner un parent").isNumeric().optional(),
];


exports.getAllElements = (req, res) => {
  db.query('SELECT e.*, COUNT(ee.id) AS nbfils, COUNT(vh.id) AS nbVolHebdo, COUNT(vg.id) AS nbVolGlob, COUNT(g.id) AS nbGrpInterv'
        +' FROM element AS e'
        +' LEFT JOIN element AS ee'
        +' ON e.id = ee.parent'
        +' LEFT JOIN volume_hebdomadaire AS vh'
        +' ON vh.element_id = e.id'
        +' LEFT JOIN volume_globale AS vg'
        +' ON vg.element_id = e.id'
        +' LEFT JOIN groupe_intervenant AS g'
        +' ON g.element_id = e.id'
        +' GROUP BY e.id ORDER BY e.parent, e.indice;',
    function(err, elements) {
      if (!err) {
        res.status(200).send(elements);
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getAllElementsModules = (req, res) => {
  db.query('SELECT e4.surnom AS parent_titre, e.*'
        +' FROM `element` AS e'
        +' JOIN element AS e2'
        +' ON e2.id = e.parent'
        +' JOIN element AS e3'
        +' ON e3.id = e2.parent'
        +' JOIN element AS e4'
        +' ON e4.id = e3.parent'
        +' WHERE e4.id IN (SELECT f.element_id FROM formation AS f WHERE f.projet_id = ' + req.params.id + ')'
        +' AND e.mode_saisie = "globale"'
        +' ORDER BY e.mode_saisie DESC, e.titre ASC;',
    function(err, elements) {
      if (!err) {
        res.status(200).send(elements);
      }
      else {
        res.send(err);
      }
    }
  ); 
};


exports.getHierarchieByRoot = (req, res) => {
  db.query(' SELECT e.* FROM element AS e'
          +' LEFT JOIN element AS e2 ON e.parent = e2.id' 
          +' LEFT JOIN element as e3 ON e2.parent = e3.id' 
          +' LEFT JOIN element as e4 ON e3.parent = e4.id' 
          +' WHERE e.id = ' + req.params.id + ' OR e2.id = ' + req.params.id + ' OR e3.id = ' + req.params.id + ' OR e4.id = ' + req.params.id
          + ' ORDER BY e.niveau;',
    function(err, hierarchie) {
      if (!err) {
        res.status(200).send(hierarchie);
      }
      else {
        res.send(err);
      }
    }
  ); 
};



exports.getElement = (req, res) => {
  db.query('SELECT e.*, COUNT(ee.id) as nbfils'
        +' FROM element as e'
        +' LEFT JOIN element as ee'
        +' ON e.id = ee.parent'
        +' WHERE e.id = ?'
        +' GROUP BY e.id ORDER BY parent ;', [req.params.id],
    function(err, element) {
      if (!err) {
        res.status(200).json(element);  
      }
      else {
        res.send(err);
      }
    }
  );  
};


exports.addElement = (req, res) => {
  var data = {
    titre : req.body.titre,
    surnom : req.body.surnom,
    code : req.body.code,
    niveau : req.body.niveau,
    indice : req.body.indice,
    vol_hor_total_prevues_etu_cm : req.body.vol_hor_total_prevues_etu_cm | null,
    vol_hor_total_prevues_etu_td : req.body.vol_hor_total_prevues_etu_td | null,
    vol_hor_total_prevues_etu_tp : req.body.vol_hor_total_prevues_etu_tp | null,
    mode_saisie : req.body.mode_saisie,
    cm_autorises : req.body.cm_autorises,
    td_autorises : req.body.td_autorises,
    tp_autorises : req.body.tp_autorises,
    partiel_autorises : req.body.partiel_autorises,
    forfait_globale_cm : req.body.forfait_globale_cm | null,
    forfait_globale_td : req.body.forfait_globale_td | null,
    forfait_globale_tp : req.body.forfait_globale_tp | null,
    forfait_globale_partiel : req.body.forfait_globale_partiel | null,
    nb_groupe_effectif_cm : req.body.nb_groupe_effectif_cm | null,
    nb_groupe_effectif_td : req.body.nb_groupe_effectif_td | null,
    nb_groupe_effectif_tp : req.body.nb_groupe_effectif_tp | null,
    nb_groupe_effectif_partiel : req.body.nb_groupe_effectif_partiel | null,
    parent : req.body.parent,
  };

  var requete="INSERT INTO element(titre, surnom, code, niveau, indice, vol_hor_total_prevues_etu_cm, vol_hor_total_prevues_etu_td, vol_hor_total_prevues_etu_tp, mode_saisie, cm_autorises, td_autorises, tp_autorises, partiel_autorises, forfait_globale_cm, forfait_globale_td, forfait_globale_tp, forfait_globale_partiel, nb_groupe_effectif_cm, nb_groupe_effectif_td, nb_groupe_effectif_tp, nb_groupe_effectif_partiel, parent) VALUES ('" 
    + data['titre'] + "','"
    + data['surnom'] + "','"
    + data['code'] + "','"
    + data['niveau'] + "','"
    + data['indice'] + "','"
    + data['vol_hor_total_prevues_etu_cm'] + "','"
    + data['vol_hor_total_prevues_etu_td'] + "','"
    + data['vol_hor_total_prevues_etu_tp'] + "','"
    + data['mode_saisie'] + "','"
    + data['cm_autorises'] + "','"
    + data['td_autorises'] + "','"
    + data['tp_autorises'] + "','"
    + data['partiel_autorises'] + "','"
    + data['forfait_globale_cm'] + "','"
    + data['forfait_globale_td'] + "','"
    + data['forfait_globale_tp'] + "','"
    + data['forfait_globale_partiel'] + "','"
    + data['nb_groupe_effectif_cm'] + "','"
    + data['nb_groupe_effectif_td'] + "','"
    + data['nb_groupe_effectif_tp'] + "','"
    + data['nb_groupe_effectif_partiel'] + "',"
    + data['parent'] + ");"
  ;

  db.query(requete,
    function(err, element) {
      if (!err) {
        res.status(200).json(element);
      } else  {
        res.send(err);
      }
    }
  );
};


exports.copyElement = (req, res) => {
  db.query('SELECT * FROM element where id = ? ;', [req.params.id],
    function(err, element) {
      if (!err) {
        if (req.params.parent === '0'){
          element[0]['parent'] = 'NULL';
        } else{
          element[0]['parent'] = req.params.parent;
        }

        var requete="INSERT INTO element(titre, surnom, code, niveau, indice, vol_hor_total_prevues_etu_cm, vol_hor_total_prevues_etu_td, vol_hor_total_prevues_etu_tp, mode_saisie, cm_autorises, td_autorises, tp_autorises, partiel_autorises, forfait_globale_cm, forfait_globale_td, forfait_globale_tp, forfait_globale_partiel, nb_groupe_effectif_cm, nb_groupe_effectif_td, nb_groupe_effectif_tp, nb_groupe_effectif_partiel, parent) VALUES ('" 
          + element[0]['titre'] + "','"
          + element[0]['surnom'] + "','"
          + element[0]['code'] + "','"
          + element[0]['niveau'] + "','"
          + element[0]['indice'] + "',"
          + element[0]['vol_hor_total_prevues_etu_cm'] + ","
          + element[0]['vol_hor_total_prevues_etu_td'] + ","
          + element[0]['vol_hor_total_prevues_etu_tp'] + ",'"
          + element[0]['mode_saisie'] + "','"
          + element[0]['cm_autorises'] + "','"
          + element[0]['td_autorises'] + "','"
          + element[0]['tp_autorises'] + "','"
          + element[0]['partiel_autorises'] + "',"
          + element[0]['forfait_globale_cm'] + ","
          + element[0]['forfait_globale_td'] + ","
          + element[0]['forfait_globale_tp'] + ","
          + element[0]['forfait_globale_partiel'] + ","
          + element[0]['nb_groupe_effectif_cm'] + ","
          + element[0]['nb_groupe_effectif_td'] + ","
          + element[0]['nb_groupe_effectif_tp'] + ","
          + element[0]['nb_groupe_effectif_partiel'] + ","
          + element[0]['parent'] + ");"
        ;
        db.query(requete,
          function(err, element) {
            if (!err) {
              res.status(200).json(element); 
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


exports.editElement = (req, res) => {
  var data = {
    titre : req.body.titre,
    surnom : req.body.surnom,
    code : req.body.code,
    niveau : req.body.niveau,
    indice : req.body.indice,
    vol_hor_total_prevues_etu_cm : req.body.vol_hor_total_prevues_etu_cm | null,
    vol_hor_total_prevues_etu_td : req.body.vol_hor_total_prevues_etu_td | null,
    vol_hor_total_prevues_etu_tp : req.body.vol_hor_total_prevues_etu_tp | null,
    mode_saisie : req.body.mode_saisie,
    cm_autorises : req.body.cm_autorises,
    td_autorises : req.body.td_autorises,
    tp_autorises : req.body.tp_autorises,
    partiel_autorises : req.body.partiel_autorises,
    forfait_globale_cm : req.body.forfait_globale_cm | null,
    forfait_globale_td : req.body.forfait_globale_td | null,
    forfait_globale_tp : req.body.forfait_globale_tp | null,
    forfait_globale_partiel : req.body.forfait_globale_partiel | null,
    nb_groupe_effectif_cm : req.body.nb_groupe_effectif_cm | null,
    nb_groupe_effectif_td : req.body.nb_groupe_effectif_td | null,
    nb_groupe_effectif_tp : req.body.nb_groupe_effectif_tp | null,
    nb_groupe_effectif_partiel : req.body.nb_groupe_effectif_partiel | null,
    parent : req.body.parent,
  };
  
  var requete="UPDATE element SET titre ='" + data['titre'] 
  +"', surnom ='" + data['surnom']
  +"', code ='" + data['code'] 
  +"', niveau ='" + data['niveau'] 
  +"', indice ='" + data['indice'] 
  +"', vol_hor_total_prevues_etu_cm =" + data['vol_hor_total_prevues_etu_cm'] 
  +", vol_hor_total_prevues_etu_td =" + data['vol_hor_total_prevues_etu_td'] 
  +", vol_hor_total_prevues_etu_tp =" + data['vol_hor_total_prevues_etu_tp'] 
  +", mode_saisie ='" + data['mode_saisie'] 
  +"', cm_autorises ='" + data['cm_autorises'] 
  +"', td_autorises ='" + data['td_autorises'] 
  +"', tp_autorises ='" + data['tp_autorises'] 
  +"', partiel_autorises ='" + data['partiel_autorises'] 
  +"', forfait_globale_cm =" + data['forfait_globale_cm'] 
  +", forfait_globale_td =" + data['forfait_globale_td'] 
  +", forfait_globale_tp =" + data['forfait_globale_tp'] 
  +", forfait_globale_partiel =" + data['forfait_globale_partiel']
  +", nb_groupe_effectif_cm =" + data['nb_groupe_effectif_cm'] 
  +", nb_groupe_effectif_td =" + data['nb_groupe_effectif_td'] 
  +", nb_groupe_effectif_tp =" + data['nb_groupe_effectif_tp'] 
  +", nb_groupe_effectif_partiel =" + data['nb_groupe_effectif_partiel']
  +", parent =" + data['parent']
  +" WHERE id = " + req.params.id + ";";

  db.query(requete,
    function(err, element) {
      if (!err) {
        res.status(200).json(element); 
      } else {
        res.send(err);
      }
    }
  );
};

exports.deleteElement = (req, res) => {
  db.query('DELETE FROM element WHERE id = ? ;',[req.params.id],
    function(err, element) {
      if (!err) {
        res.status(200).json(element); 
      }
      else {
        res.send(err);
      }
    }
  );  
};

exports.deleteHierarchie = (req, res) => {
  //Suppression des périodes de la hiérarchies
  db.query('DELETE p'
        +' FROM periode AS p'
        +' JOIN element AS e ON p.element_id = e.id'
        +' WHERE e.parent = ? ;',[req.params.id],
    function(err) {
      if (!err) {
        res.status(200); 
      }
      else {
        res.send(err);
      }
    }
  ); 

  // Suppression de la hiérarchies
  db.query('DELETE e, p, e2, e3, e4'
        +' FROM `element` AS e'
        +' LEFT JOIN element AS e2'
        +' ON e2.parent = e.id'
        +' LEFT JOIN periode AS p '
        +' ON p.element_id = e2.id'
        +' LEFT JOIN element AS e3'
        +' ON e3.parent = e2.id'
        +' LEFT JOIN element AS e4'
        +' ON e4.parent = e3.id'
        +' WHERE e.id = ? ;',[req.params.id],
    function(err, element) {
      if (!err) {
        res.status(200).json(element); 
      }
      else {
        res.send(err);
      }
    }
  );
};