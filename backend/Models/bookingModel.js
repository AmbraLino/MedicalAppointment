// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//   fullName: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   preferredDate: { type: String, required: true },
//   preferredTime: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
// }, { timestamps: true });

// module.exports = mongoose.model('Booking', bookingSchema);



const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: String,
  phoneNumber: String,
  preferredDate: String,
  preferredTime: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
