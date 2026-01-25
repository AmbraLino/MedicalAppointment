const express = require('express');
const router = express.Router();
const contactModel = require('../Models/contactModel');

// 1. Ruajtja e takimit të ri (nga pacienti)
router.post("/", async (req, res) => {
  try {
    console.log("Body që po vjen nga React:", req.body); // Shiko në terminal
    const newAppointment = new contactModel(req.body);
    await newAppointment.save();
    res.status(200).json({ message: "Termini u dërgua me sukses!" });
  } catch (error) {
    console.error("GABIMI REAL NË BACKEND:", error); // Kjo do të tregojë cilat fusha mungojnë
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