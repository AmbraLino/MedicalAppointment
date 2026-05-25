const express = require("express");
const router = express.Router();
const Booking = require("../Models/bookingModel");
const { verifyToken } = require("../middleware/auth");

// 1. KRIJIMI I REZERVIMIT
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

// 2. MARRJA E REZERVIMEVE TË MIAT (PACIENTI)
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

// 3. LISTA E REZERVIMEVE PËR DOKTORIN
router.get("/doctor-list", verifyToken, async (req, res) => {
  try {
    const doctorId = req.user.id || req.user._id;
    const bookings = await Booking.find({ doctor: doctorId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. ORARI I DOKTORIT
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

// 5. UPDATE NGA DOKTORI (PATCH)
router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Reservation not found!" });

    const currentUserId = req.user._id ? req.user._id.toString() : req.user.id ? req.user.id.toString() : null;
    
    if (!currentUserId || booking.doctor.toString() !== currentUserId) {
      return res.status(403).json({ message: "You don't have permission to update this reservation!" });
    }

    const updateData = {};
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.cost !== undefined) updateData.cost = Number(req.body.cost);

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. ANULIMI LOGJIK NGA PACIENTI (PUT) - Që doktori ta shohë si të anuluar
router.put("/cancel/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Reservation not found!" });

    booking.status = "Cancelled by Patient";
    await booking.save();

    res.status(200).json({ message: "Vizita u anulua me sukses!", booking });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë anulimit", error: err.message });
  }
});

// 7. PRANIMI I PAGESËS ONLINE (PUT)
router.put("/pay/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Reservation not found!" });

    booking.isPaid = true; // Ndryshon fushën në true pas pagesës
    await booking.save();

    res.status(200).json({ message: "Pagesa u krye me sukses!", booking });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë përpunimit të pagesës" });
  }
});

// 8. FSHIRJA E REZERVIMIT (E lamë siç e kishit)
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