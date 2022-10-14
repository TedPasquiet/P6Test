// Modules
const jwt = require("jsonwebtoken");
// Configuration token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      // Check si l'userId est le même que dans la requête (si présent)
      throw "userID invalide";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
