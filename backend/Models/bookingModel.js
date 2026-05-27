const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true }, 
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  
  appointmentType: {
    type: String,
    enum: ["normal", "emergency", "consultation"],
    required: true,
    default: "normal"
  },

  cost: { 
    type: Number, 
    default: 0 
  },

  consultationType: { 
    type: String, 
    enum: ['online', 'offline'], 
    default: 'offline' 
  },
isPaid: {
  type: Boolean,
  default: false
},
paymentDate: {
  type: Date
},
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });


module.exports = mongoose.model("Booking", bookingSchema);