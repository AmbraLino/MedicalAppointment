const express = require("express");
const router = express.Router();
const Department = require("../Models/departmentModel");

// 1. GET ALL - Merr të gjitha (Bazohet te /api/departments)
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST - Krijo Departament të ri (Bazohet te /api/departments)
router.post("/", async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.body.id.toLowerCase().trim(),
      icon: req.body.icon

    };
    const newDept = new Department(data);
    const savedDept = await newDept.save();
    res.status(201).json(savedDept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. GET SINGLE - Merr një të vetëm sipas fushës 'id' (Bazohet te /api/departments/:id)
router.get("/:id", async (req, res) => {
  try {
    const searchId = req.params.id.toLowerCase().trim();
    const department = await Department.findOne({ id: searchId });
    
    if (!department) {
      return res.status(404).json({ message: "Department not found in database" });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. PUT - Përditëso sipas fushës 'id' (Bazohet te /api/departments/:id)
// PUT - Përditëso sipas fushës 'id' string (Bazohet te URL: /api/departments/:id)
router.put("/:id", async (req, res) => {
  try {
    const searchId = req.params.id.toLowerCase().trim();
    const updatedDept = await Department.findOneAndUpdate(
      { id: searchId },
      {
        id: req.body.id.toLowerCase().trim(),
        title: req.body.title,
        desc: req.body.desc,
        icon: req.body.icon, // <--- KJO DUHET TË SHTOHET KËTU!
        treatments: req.body.treatments
      },
      { new: true, runValidators: true }
    );

    if (!updatedDept) {
      return res.status(404).json({ message: "Department not found for update" });
    }
    res.json(updatedDept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Fshi sipas _id të vërtetë të MongoDB (Bazohet te URL: /api/departments/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deletedDept = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDept) {
      return res.status(404).json({ message: "Department not found for deletion" });
    }
    res.json({ message: "Department deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;