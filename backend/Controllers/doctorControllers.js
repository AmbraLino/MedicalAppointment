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
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
