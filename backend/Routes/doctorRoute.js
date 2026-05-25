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

router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// ADMIN 
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;