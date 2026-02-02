const Doctor = require("../Models/doctorModel");

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json(doctor);
  } catch (err) {
    res.status(404).json({ message: "Doctor not found" });
  }
};

const bcrypt = require("bcrypt"); // Shtoje këtë në fillim

const createDoctor = async (req, res) => {
  try {
    const { username, email, password, specialty, department, description } = req.body;
    const image = req.file ? req.file.filename : "";

    // Hash fjalëkalimin!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDoctor = new Doctor({
      username, // Modeli kërkon username, jo name
      email,
      password: hashedPassword,
      role: "doctor",
      specialty,
      department,
      description,
      image
    });

    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: "Gabim gjatë krijimit: " + err.message });
  }
};
const updateDoctor = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.filename; // Nëse po ngarkojmë foto të re
    }

    const updated = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };