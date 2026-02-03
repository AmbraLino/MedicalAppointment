const express = require("express");
const router = express.Router();
const Booking = require("../Models/bookingModel");
const { verifyToken } = require("../middleware/auth");

router.post("/create", verifyToken, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user.id || req.user._id 
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: "Gabim gjatë krijimit të rezervimit: " + err.message });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; 
    
    const myBookings = await Booking.find({ user: userId })
      .populate({
        path: 'doctor',
        model: 'Doctor', 
        select: 'username email' 
      })
      .sort({ createdAt: -1 });

    res.status(200).json(myBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/doctor-list", verifyToken, async (req, res) => {
  try {
    const doctorId = req.user.id || req.user._id;
    console.log("ID doctor:", doctorId); 

    const bookings = await Booking.find({ doctor: doctorId }).sort({ createdAt: -1 });
    
    console.log("Reservation that are found on db:", bookings.length);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctor-schedule/:id", async (req, res) => {
  try {
    const appointments = await Booking.find({ 
      doctor: req.params.id,
      status: { $ne: "rejected" }
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Reservation not found!" });

    if (booking.doctor.toString() !== (req.user.id || req.user._id)) {
      return res.status(403).json({ message: "You don't have permission to update this reservation!" });
    }

    booking.status = req.body.status; 
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/cancel/:id", verifyToken, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: "Reservation not found!" });
    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;