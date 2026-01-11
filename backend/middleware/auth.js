const jwt = require("jsonwebtoken");
const secret = "asdfe45we45w345wegw345werjktjwertkjfdgfgfsgf";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Asnje token" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Aksesohet vetem nga admini" });
  next();
};

const isAgent = (req, res, next) => {
  if (req.user.role !== "agent")
    return res.status(403).json({ message: "Aksesohet vetem nga agjentet" });
  next();
};

module.exports = { verifyToken, isAdmin, isAgent };
