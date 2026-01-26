const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// PUBLIC
router.get("/", getDoctors);

// ADMIN ONLY
router.post("/", verifyToken, isAdmin, createDoctor);
router.put("/:id", verifyToken, isAdmin, updateDoctor);
router.delete("/:id", verifyToken, isAdmin, deleteDoctor);

module.exports = router;
