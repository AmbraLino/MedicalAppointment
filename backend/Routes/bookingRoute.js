const express = require('express');
const router = express.Router();
const Booking = require('../Models/bookingModel');

// GET all appointments for a specific doctor
router.get("/doctor-schedule/:id", async (req, res) => {
  try {
    const appointments = await Booking.find({ doctorId: req.params.id });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new booking for a doctor
router.post("/doctor-schedule/:id", async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      doctorId: req.params.id,
      status: 'pending'
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all bookings for a doctor (for dashboard)
router.get("/doctor/:id", async (req, res) => {
  try {
    const appointments = await Booking.find({ doctorId: req.params.id });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update status (approve/reject)
router.patch("/update/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
