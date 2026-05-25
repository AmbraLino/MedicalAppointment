const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, isAdmin } = require("../middleware/auth");
const Doctor = require("../Models/doctorModel");

const dir = './Images';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "Images/"); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); },
});
const upload = multer({ storage: storage });

// post method to create doctor nga admini
router.post("/create", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { username, email, password, department, specialty, description } = req.body;

        const existingDoc = await Doctor.findOne({ email });
        if (existingDoc) {
            return res.status(400).json({ message: "this email is already registered!" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newDoctor = new Doctor({
            username,
            email,
            password: hashedPassword,
            department,
            specialty,
            description,
            image: req.file ? req.file.filename : ""
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doctor created successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error on server: " + err.message });
    }
});

//metoda get for all doctors
router.get("/doctors", verifyToken, isAdmin, async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//metoda get per me marr 1 doktor vetem
router.get("/doctors/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found!" });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete("/doctors/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found!" });
    }
    
    res.json({ message: "Doctor deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error during deletion: " + err.message });
  }
});

//update doctor me metoden put
router.put("/update/:id", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { username, email, password, department, specialty, description } = req.body;
        
        let updateFields = { username, email, department, specialty, description };
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }
        if (req.file) {
            updateFields.image = req.file.filename;
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );
        if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found!" });

        res.status(200).json({ message: "Doctor updated successfully!", doctor: updatedDoctor });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Error during update: " + err.message });
    }
});

module.exports = router;