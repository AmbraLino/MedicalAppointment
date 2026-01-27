const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  updateDoctor,
  getDoctorById,
  deleteDoctor,
} = require("../Controllers/doctorControllers");
const { verifyToken, isAdmin } = require("../middleware/auth");

// PUBLIC
router.get("/", getDoctors);
// GET single doctor by ID
router.get("/:id", getDoctorById);


// ADMIN ONLY
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;
