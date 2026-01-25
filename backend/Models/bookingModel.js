const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  doctorId: { type: String, required: true },
  preferredDate: { type: String, required: true }, // Monday, Tuesday...
  preferredTime: { type: String, required: true }, // 09:00...
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);