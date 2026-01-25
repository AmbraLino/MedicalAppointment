const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  medicalRecordNumber: String,
  reasonForVisit: String,
  department: String,
  doctorId: String, 
  preferredDate: { type: String, required: true }, // Monday, Tuesday...
  preferredTime: { type: String, required: true }, // 09:00, 10:00...
  status: { type: String, default: 'pending' }     // pending, approved, rejected
});

module.exports = mongoose.model('Contact', contactSchema);