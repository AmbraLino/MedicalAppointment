exports.isDoctor = (req, res, next) => {
  if (req.user && req.user.role === "doctor") {
    return next();
  }
  return res.status(403).json({ message: "Doctor access only" });
};

exports.isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    return next();
  }
  return res.status(403).json({ message: "User access only" });
};
