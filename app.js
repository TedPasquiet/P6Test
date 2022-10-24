// Modules
const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const { application } = require("express");
const multer = require("./middleware/multer-config")
const path = require('path');
// Importation Routes
const userRoute = require("./routes/users");
const sauceRoute = require("./routes/sauces");
// Intercepte content JSON pour l'envoyer dans req.body
app.use(express.json());
// Variable environnement
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbAdress = process.env.DB_ADRESS;
// Mongoose connection
const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbAdress}/?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then(() => console.log("Connecté à Mongo"))
  .catch(() => console.error);
// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// Routes
app.use("/api/auth", userRoute);
app.use("/api/sauces", sauceRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));
// Fin routes
module.exports = app;
