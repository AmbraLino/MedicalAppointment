// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require("../Controllers/doctorControllers");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "Images"); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   }
// });

// const upload = multer({ storage: storage });

// router.get("/", getDoctors);
// router.get("/:id", getDoctorById);
// router.post("/", upload.single("image"), createDoctor); 
// router.put("/:id", upload.single("image"), updateDoctor);
// router.delete("/:id", deleteDoctor);

// module.exports = router;


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