// Modules
const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN = process.env.TOKEN
// Configuration token
module.exports = (req, res, next) => { // Check si le token est bon
  try { // Check si le token est bon grâce à notre phrase secrète
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, TOKEN);
      const userId = decodedToken.userId;

      if (req.body.userId && req.body.userId !== userId) { // Check si l'userId est le même que dans la requête (si présent)
          throw "userID invalide";
      } else {
          next();
      }
  } catch{
      res.status(401).json(new Error('Requête invalide!'));
  }
};