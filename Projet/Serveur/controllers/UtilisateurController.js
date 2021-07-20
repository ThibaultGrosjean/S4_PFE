var db = require('../models/bdd');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { check, validationResult } = require('express-validator');

exports.validationResult = [
  check('identifiant',"Veuillez sélectionner un mot de passe supérieur à 6 caractères").isLength({ min: 8 }),
  check('mot_de_passe',"Veuillez sélectionner un mot de passe supérieur à 6 caractères").isLength({ min: 8 }),
];

exports.addUtilisateur = (req, res, next) => {
	let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: req.body});
  } else {
  	db.query(`SELECT * FROM utilisateur WHERE LOWER(identifiant) = LOWER(${db.escape(req.body.identifiant)});`,
	    function(err, utilisateur) {
	      if (utilisateur) {
	        res.send({ errors: "L'identifiant est déjà utilisé"});
	      } else {
	        bcrypt.hash(req.body.mot_de_passe, 10, (err, hash) => {
	          if (err) {
	             res.send({ errors: err});
	          } else {
	            db.query(`INSERT INTO utilisateur (identifiant, mot_de_passe) VALUES (${db.escape(req.body.identifiant)}, ${db.escape(hash)})`,
	              function(err, utilisateur) {
	                if (err) {
	                  throw err;
	                  res.send({ errors: err});
	                }
	                return res.status(201).send({
	                  msg: 'Registered!'
	                });
	              }
	            );
	          }
	        });
	      }
	    }
	  );
  }
};



exports.connexion = (req, res, next) => {
	let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().map(err => extractedErrors[err.param] = err.msg);
    res.send({ errors: extractedErrors, data: req.body});
  } else {
  	db.query(`SELECT * FROM utilisateur WHERE identifiant = ${db.escape(req.body.identifiant)};`,
	    function(err, result) {
	      // user does not exists
	      if (err) {
	        throw err;
	        res.send({ errors: err});
	      }
	      if (!result.length) {
	        res.status(401).send({ errors: err});
	      }
	      // check password
	      bcrypt.compare(
	        req.body.mot_de_passe,
	        result[0]['mot_de_passe'],
	        (bErr, bResult) => {
	          // wrong password
	          if (bErr) {
	            throw bErr;
	            res.send({ errors: err});
	          }
	          if (bResult) {
	            const token = jwt.sign({
	                identifiant: result[0].identifiant,
	                userId: result[0].id
	              },
	              'SECRETKEY', {
	                expiresIn: '7d'
	              }
	            );
	            return res.status(200).send({
	              msg: 'Logged in!',
	              token,
	              utilisateur: result[0]
	            });
	          }
	          res.send({ errors: err});
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
      token,
      'SECRETKEY'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    res.send({ errors: err});
  }
}