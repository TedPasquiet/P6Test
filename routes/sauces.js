// Modules
const express = require("express");
const router = express.Router();
// Middleware
const auth = require("../middleware/auth"); // Crée Token
const multer = require("../middleware/multer-config"); // Permet d'envoyer un fichier dans la requête
// Controllers
const sauceCtrl = require("../Controllers/sauces");
// Routes
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getSingleSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", sauceCtrl.likeSauce)

module.exports = router;
