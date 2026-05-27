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
router.get("/my-appointments", verifyToken, async (req, res) => {
  try {
    // Supozohet se req.user është mjeku i loguar
    const doctorId = req.user.id || req.user._id;
    
    // Gjej të gjitha rezervimet për këtë mjek dhe popullo të dhënat e pacientit
    const appointments = await Booking.find({ doctor: doctorId })
      .populate("user", "username email phone") 
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Gabim në marrjen e takimeve: " + err.message });
  }
});
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// ADMIN 
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;