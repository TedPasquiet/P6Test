const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN = process.env.TOKEN

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrect" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrect" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, TOKEN, {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const newUSer = new User({
        email: req.body.email,
        password: hash,
      });
      newUSer
        .save()
        .then(() => res.status(201).json({ message: "utilisateur enregistré" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
