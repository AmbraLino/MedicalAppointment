const express = require("express");
const router = express.Router();
const Booking = require("../Models/bookingModel");
const { verifyToken } = require("../middleware/auth");

// 1. KRIJO REZERVIM (Për Pacientin)
router.post("/create", verifyToken, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user.id || req.user._id // Lidhet automatikisht me pacientin e loguar
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: "Gabim gjatë krijimit të rezervimit: " + err.message });
  }
});

// 2. MERR REZERVIMET E MIA (Për Profilin e Pacientit)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; 
    
    // Përdorim populate në formë objekti për siguri maksimale
    const myBookings = await Booking.find({ user: userId })
      .populate({
        path: 'doctor',
        model: 'Doctor', // Këtu sigurohemi që referenca është te modeli User
        select: 'username email' 
      })
      .sort({ createdAt: -1 });

    res.status(200).json(myBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. MERR REZERVIMET PËR DOKTORIN (Për Dashboard-in e Doktorit)
router.get("/doctor-list", verifyToken, async (req, res) => {
  try {
    const doctorId = req.user.id || req.user._id;
    console.log("ID e Doktorit që kërkon listën:", doctorId); // Debugging

    // Kërkojmë të gjitha rezervimet për këtë ID
    const bookings = await Booking.find({ doctor: doctorId }).sort({ createdAt: -1 });
    
    console.log("Rezervimet e gjetura në DB:", bookings.length);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. MERR ORARET E NJË DOKTORI (Për kalendarin te DoctorSchedule)
router.get("/doctor-schedule/:id", async (req, res) => {
  try {
    const appointments = await Booking.find({ 
      doctor: req.params.id,
      status: { $ne: "rejected" } // Mos shfaq oraret që janë refuzuar
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. PËRDITËSO STATUSIN (Approve/Reject - Vetëm nga Doktori)
router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Rezervimi nuk u gjet" });

    // Siguria: Kontrollojmë nëse rezervimi i përket këtij doktori
    if (booking.doctor.toString() !== (req.user.id || req.user._id)) {
      return res.status(403).json({ message: "Nuk keni autorizim për të modifikuar këtë rezervim" });
    }

    booking.status = req.body.status; // merr "approved" ose "rejected"
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/cancel/:id", verifyToken, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).send("Nuk u gjet");
    res.status(200).json({ message: "U fshi" });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;