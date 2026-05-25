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
      required:true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);