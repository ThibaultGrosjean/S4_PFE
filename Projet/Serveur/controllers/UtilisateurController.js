var db = require('../models/bdd');
const tools = require('../models/tools');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { check, validationResult } = require('express-validator');

const secretKey = 'SECRETKEY';

exports.validationResult = [
  check('identifiant',"Veuillez sélectionner un identifiant supérieur à 6 caractères").isLength({ min: 6 }),
  check('prenom',"Veuillez sélectionner un prénom supérieur à 2 caractères").optional().isLength({ min: 2 }),
  check('nom',"Veuillez sélectionner un nom supérieur à 2 caractères").optional().isLength({ min: 2 }),
  check('email',"Veuillez sélectionner un email valide").optional().isEmail(),
  check('mot_de_passe',"Veuillez sélectionner un mot de passe supérieur à 6 caractères").isLength({ min: 6 }),
];

exports.addUtilisateur = (req, res, next) => {
	let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    return res.send({ errors: extractedErrors, data: req.body});
  } else {
  	db.query(`SELECT * FROM utilisateur WHERE LOWER(identifiant) = LOWER(${db.escape(req.body.identifiant)});`,
	    function(err, utilisateur) {
	      if (utilisateur.length) {
	        return res.send({ errors: {"identifiant": "L'identifiant est déjà utilisé"} });
	      } else {
	      	// Vérifier le double mot de passgite
	      	if (req.body.mot_de_passe != req.body.mot_de_passe_verif){
	      		 return res.send({ errors: {"mot_de_passe_verif": "Les deux mots de passe sont différents"} });
	      	} else {
	      		bcrypt.hash(req.body.mot_de_passe, 10, (err, hash) => {
		          if (err) {
		            return res.send({ errors: err});
		          } else {
		            db.query(`INSERT INTO utilisateur (identifiant, prenom, nom, email, mot_de_passe) VALUES (${db.escape(tools.safeStringSQL(req.body.identifiant))}, ${db.escape(tools.safeStringSQL(req.body.prenom))}, ${db.escape(tools.safeStringSQL(req.body.nom))},${db.escape(tools.safeStringSQL(req.body.email))}, ${db.escape(hash)})`,
		              function(err, utilisateur) {
		                if (err) {
		                  return res.send({ errors: err});
		                }
		                return res.status(201).send({
		                  msg: '!'
		                });
		              }
		            );
		          }
		        });
	      	}
	      }
	    }
	  );
  }
};



exports.connexion = (req, res, next) => {
	if (!req.body.identifiant && !req.body.mot_de_passe){
		 return res.send({ errors: {"general_error": "Veuillez remplir les champs"}});
	} else {
  	db.query(`SELECT * FROM utilisateur WHERE identifiant = ${db.escape(req.body.identifiant)};`,
	    function(err, result) {
	    	// Pas de compte trouvé
	      if (err) {
	        return res.send({ errors: {"general_error": "Le compte entré n'existe pas"} });
	      }
	      if (!result.length) {
	        return res.send({ errors: {"general_error": "L'identifiant ou le mot de passe est incorrect"} });
	      }
	      // Vérifier le mot de passe
	      bcrypt.compare(req.body.mot_de_passe,result[0]['mot_de_passe'],
	        function(bErr, bResult) {
	          // Mauvais mot de passe
	          if (bErr) {
	            return res.send({ errors:  {"general_error": "L'identifiant ou le mot de passe est incorrect"} });
	          } else if (bResult) {
	            const token = jwt.sign(
	            	{identifiant: result[0].identifiant,userId: result[0].id}
	              , secretKey
	              , {expiresIn: '7d'}
	            );
	            return res.status(200).send({token,utilisateur: result[0]});
	          }
	          return res.send({ errors: {"general_error": "L'identifiant ou le mot de passe est incorrect"} });
	        }
	      );
	    }
	  );
  }
};


exports.verifToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token
      , secretKey
    );
    req.userData = decoded;
    next();
  } catch (err) {
    res.send({ errors: {"general_error": "Problème d'identification, veuillez recommencer."} });
  }
};