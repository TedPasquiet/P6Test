// Module
const fs = require("fs"); // Gère le stockage de fichier
// Models
const Sauce = require("../models/sauces");
//  Middleware Get All sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
// Create Sauce
exports.createSauce = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce);
  const newSauce = new Sauce({
    ...sauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  })
  newSauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce sauvegardée",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
// Get one sauce +++++++++++++++++++++++++++++++++++
exports.getSingleSauce = (req,res,next) =>{
  Sauce.findOne({ _id: req.params.id})
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
}
// Modify Sauce ++++++++++++++++++++++
exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    _id: req.params.userId,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId,
  })
    .updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce mise à jour",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
// Delete Sauce ++++++++++++++++++++
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
// Rate sauce +++++++++++++++++++++++++
exports.likeSauce = (req,res,next) =>{
    
}