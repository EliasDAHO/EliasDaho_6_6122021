const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hash = require('hash.js');


const passwordValidator = require('password-validator');


const shemaPassValid = new passwordValidator();
shemaPassValid
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123', 'Pass123word']);


exports.signup = (req, res, next) => {
  const regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;   
  if (!regexEmail.test(req.body.email)) {    
      res.status(401).json({ error: "Rentrez un email valide!" })
      return false
  }  

  const emailHash = hash.sha256().update(req.body.email).digest('hex');   // If email is validated, it is updated and digested to be hex encoded.

  if (!shemaPassValid.validate(req.body.password)) {
      res.status(401).json({message:"L'email exist déjà et/ou le mot de passe doit contenir min 1 majuscule, 1 minuscule, 1 chiffre et min de 8 caractères!"});

  } else {
    bcrypt.hash(req.body.password, 10)  
    .then(hash => {
        const user = new User(
        {    
            email: emailHash,
            password: hash
        });
 
    user.save()  
        .then(() => res.status(201).json({ message: 'Nouveu utilisateur crée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    }
    };
  

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};