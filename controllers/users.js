const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const webtoken = require('jsonwebtoken');
const {validationResult} =require('express-validator');


// AJOUT D UTILISATEUR, route POST
exports.signup = (req, res, next) => {

  // récupération et traitement des erreurs liés aux middlewares de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // hachage du mot de passe, création et sauvegarde l'utilisateur
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new Users({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



// CONNEXION DE L UTILISATEUR, route POST
exports.login = (req, res, next) => {

  // récupération et traitement des erreurs liés aux middlewares de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  // récupération des données utilisateur par son mail
  Users.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "erreur" });
      }

      // comparaison de l'input avec le mot de passe de la base donnée
      // récupération de l'ID et création du token pour 8h.
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "erreur" });
          }
          res.status(200).json({
            userId: user._id,
            token: webtoken.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '8h' })
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};