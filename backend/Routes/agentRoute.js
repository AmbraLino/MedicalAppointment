const express = require("express");
const router = express.Router();
const { verifyToken, isAgent } = require("../middleware/auth");

router.get("/agjentPanel", verifyToken, isAgent, (req, res) => {
  res.json({ message: "Agent dashboard" });
});

module.exports = router;
