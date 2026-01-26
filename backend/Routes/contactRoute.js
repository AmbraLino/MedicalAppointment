const express = require('express');
const router = express.Router();
const contactModel = require('../Models/contactModel');

router.post("/", async (req, res) => {
  try {
    // Kjo do të ndihmojë të shohësh nëse të dhënat po vijnë bosh
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Body është bosh!" });
    }

    const newAppointment = new contactModel(req.body);
    const saved = await newAppointment.save();
    
    console.log("U ruajt në MongoDB:", saved); // Verifikimi në terminal
    res.status(201).json({ message: "Termini u dërgua me sukses!", data: saved });
  } catch (error) {
    console.error("GABIMI NË RUAJTJE:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Marrja e takimeve për një doktor (për të bllokuar kalendarin)
router.get("/doctor/:id", async (req, res) => {
  try {
    const appointments = await contactModel.find({ doctorId: req.params.id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;