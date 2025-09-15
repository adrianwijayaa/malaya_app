const jwt = require("jsonwebtoken");
//require('dotenv').config(); // Load environment variables

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretKey", (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
