const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  medicalRecordNumber: String,
  reasonForVisit: String,
  department: String,
  doctorId: String, 
  preferredDate: { type: String, required: true }, 
  preferredTime: { type: String, required: true }, 
  status: { type: String, default: 'pending' }  
});

module.exports = mongoose.model('Contact', contactSchema);