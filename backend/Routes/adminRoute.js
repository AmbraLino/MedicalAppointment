const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const User = require("../Models/userModel");

router.get("/adminPanel", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json({ message: "Admin dashboard", users });
});

module.exports = router;
