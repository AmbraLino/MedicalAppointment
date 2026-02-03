const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },           
    role: { type: String, default: "doctor" },
    bio: { type: String },
    specialty: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);