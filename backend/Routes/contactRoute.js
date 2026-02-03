const express = require('express');
const router = express.Router();
const contactModel = require('../Models/contactModel');

router.post("/", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Body is empty!" });
    }

    const newAppointment = new contactModel(req.body);
    const saved = await newAppointment.save();
    
    console.log("Saved on mongo:", saved); 
    res.status(201).json({ message: "sent!", data: saved });
  } catch (error) {
    console.error("error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/doctor/:id", async (req, res) => {
  try {
    const appointments = await contactModel.find({ doctorId: req.params.id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;