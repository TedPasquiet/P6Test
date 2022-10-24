// Models
const Sauce = require("../models/sauces");
// Module
const fs = require("fs"); // Gère le stockage de fichier

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
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
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
// Get one sauce
exports.getSingleSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
// Modify Sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Ajout nouvelle et suppression ancienne
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
        const sauceObject = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    });
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};
// Delete Sauce
// Supprimer image
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch(error => res.status(400).json(error));
      })
    })
    .catch(error => res.status(400).json({error}))
};
// Rate sauce +++++++++++++++++++++++++
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) { // Si un like
                sauce.usersLiked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersLiked: sauce.usersLiked,
                    likes: sauce.usersLiked.length
                })
                    .then(() => res.status(200).json({ message: "Sauce liké !" }))
                    .catch(error => res.status(400).json(error));
            } else if (req.body.like == -1) { // Si un dislike
                sauce.usersDisliked.push(req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, {
                    sauce,
                    usersDisliked: sauce.usersDisliked,
                    dislikes: sauce.usersDisliked.length
                })
                    .then(() => res.status(200).json({ message: "Sauce décevante !" }))
                    .catch(error => res.status(400).json(error));
            } else if (req.body.like == 0) { // Si un vote neutre
                sauceLiked = sauce.usersLiked.indexOf(req.body.userId);
                sauceDisliked = sauce.usersDisliked.indexOf(req.body.userId);
                if (sauceLiked == -1) { // Si l'user n'aimait pas la sauce avant son vote neutre
                    sauce.usersDisliked.splice(sauceDisliked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersDisliked: sauce.usersDisliked,
                        dislikes: sauce.usersDisliked.length
                    })
                        .then(() => res.status(200).json({ message: "Avis neutre !" }))
                        .catch(error => res.status(400).json(error));
                } else { // Si l'user aimait la sauce avant son vote neutre
                    sauce.usersLiked.splice(sauceLiked, 1);
                    Sauce.updateOne({ _id: req.params.id }, {
                        sauce,
                        usersLiked: sauce.usersLiked,
                        likes: sauce.usersLiked.length
                    })
                        .then(() => res.status(200).json({ message: "Avis neutre !" }))
                        .catch(error => res.status(400).json(error));
                }
            }
        })
        .catch(error => res.status(500).json(error));
};
