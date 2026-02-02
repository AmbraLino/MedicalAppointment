const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, isAdmin } = require("../middleware/auth");
const Doctor = require("../Models/doctorModel");

// Krijon folderin Images nëse nuk ekziston
const dir = './Images';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "Images/"); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); },
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. KRIJO DOKTOR (POST)
router.post("/create", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { username, email, password, department, specialty, bio } = req.body;

        const existingDoc = await Doctor.findOne({ email });
        if (existingDoc) {
            return res.status(400).json({ message: "Ky email është i regjistruar një herë!" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newDoctor = new Doctor({
            username,
            email,
            password: hashedPassword,
            department,
            specialty,
            bio,
            image: req.file ? req.file.filename : ""
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doktori u krijua me sukses!" });
    } catch (err) {
        res.status(500).json({ message: "Gabim në server: " + err.message });
    }
});

// 2. MERR TË GJITHË DOKTORËT (GET)
router.get("/doctors", verifyToken, isAdmin, async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. MERR NJË DOKTOR SPECIFIK (GET)
router.get("/doctors/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doktori nuk u gjet!" });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//delete doctor
router.delete("/doctors/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    // Kujdes: Përdor modelin 'Doctor' (jo User) nëse po fshin doktorë
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doktori nuk u gjet" });
    }
    
    res.json({ message: "Doktori u fshi me sukses" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë fshirjes: " + err.message });
  }
});
// 4. PËRDITËSO DOKTORIN (PUT)
router.put("/update/:id", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { username, email, password, department, specialty, bio } = req.body;
        
        let updateFields = { username, email, department, specialty, bio };

        // Hash password-in vetëm nëse është dërguar një i ri (jo bosh)
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        // Nëse admini ka ngarkuar foto të re
        if (req.file) {
            updateFields.image = req.file.filename;
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true } // Kthen doktorin e përditësuar
        );

        if (!updatedDoctor) return res.status(404).json({ message: "Doktori nuk u gjet!" });

        res.status(200).json({ message: "U përditësua me sukses!", doctor: updatedDoctor });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Gabim gjatë përditësimit: " + err.message });
    }
});

module.exports = router;