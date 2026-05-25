const Booking = require("../Models/bookingModel");
exports.getDoctorSchedule = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const bookings = await Booking.find({ doctor: doctorId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.updateBooking = async (req, res) => {
  // Nëse ky mesazh nuk del në terminal kur shtyp butonin, 
  // React nuk po lidhet me këtë Backend!
  console.log("KËRKESA U MOR! Body:", req.body);

  try {
    const { status, cost } = req.body;
    
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status, cost: Number(cost) } },
      { new: true }
    );

    console.log("MBAS UPDATE:", updated);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};