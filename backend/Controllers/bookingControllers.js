const Booking = require("../Models/bookingModel");
exports.getDoctorSchedule = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const bookings = await Booking.find({ doctor: doctorId });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// metoda create pr t krijuar booking dhe qe te ruhen ne db
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// updateing booking status (ne progress)
exports.updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
