// Modules
const express = require("express");
const router = express.Router();
// Controllers
const userCtrl = require("../Controllers/users")
// Routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
