const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");

router.get("/profile", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
